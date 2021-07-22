/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { FIELD_TYPE, DATA_TYPE, ITEM_STATUS, VALS_VERSION } from "jriapp_shared/collection/const";
import {
    IBaseObject, IPromise, IIndexer, IStatefulPromise, LocaleERRS as ERRS, Utils, IValidationError
} from "jriapp_shared";
import { ValidationError } from "jriapp_shared/errors";
import { ICancellableArgs, IFieldInfo } from "jriapp_shared/collection/int";
import { ValueUtils } from "jriapp_shared/collection/utils";
import { ItemAspect } from "jriapp_shared/collection/aspect";
import { FLAGS, REFRESH_MODE } from "./const";
import { DbContext } from "./dbcontext";
import { IEntityItem, IValueChange, IRowInfo } from "./int";
import { DbSet } from "./dbset";
import { SubmitError } from "./error";

const utils = Utils, { _undefined } = utils.check, { format } = utils.str, { getValue, setValue, uuid } = utils.core,
    { compareVals, parseValue } = ValueUtils, sys = utils.sys;

// don't submit these types of fields to the server
function fn_isNotSubmittable(fieldInfo: IFieldInfo) {
    switch (fieldInfo.fieldType) {
        case FIELD_TYPE.ClientOnly:
        case FIELD_TYPE.Navigation:
        case FIELD_TYPE.Calculated:
            return true;
        default:
            return false;
    }
}

function _fn_walkChanges(name: string, val: IValueChange, fn: (name: string, val: IValueChange) => void) {
    if (!!val.nested && val.nested.length > 0) {
        const len = val.nested.length;
        for (let i = 0; i < len; i += 1) {
            const prop: IValueChange = val.nested[i];
            if (!!prop.nested && prop.nested.length > 0) {
                _fn_walkChanges(name + "." + prop.fieldName, prop, fn);
            } else {
                fn(name + "." + prop.fieldName, prop);
            }
        }
    } else {
        fn(name, val);
    }
}

function fn_walkChanges(val: IValueChange, fn: (name: string, val: IValueChange) => void): void {
    _fn_walkChanges(val.fieldName, val, fn);
}

export class EntityAspect<TItem extends IEntityItem = IEntityItem, TObj extends IIndexer<any> = IIndexer<any>, TDbContext extends DbContext = DbContext> extends ItemAspect<TItem, TObj> {
    private _srvKey: string;
    private _origVals: TObj;
    private _savedStatus: ITEM_STATUS;
    private _disposables: Array<IBaseObject>;

    constructor(dbSet: DbSet<TItem, TObj, TDbContext>, vals: TObj, key: string, isNew: boolean) {
        super(dbSet, vals, key, isNew);
        this._srvKey = !isNew ? key : null;
        this._origVals = null;
        this._disposables = null;
        this._savedStatus = null;
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        try {
            if (!this.isDetached) {
                this.cancelEdit();
                this.rejectChanges();
            }
            const objs = this._disposables;
            this._disposables = null;
            // destroy objects which we own: such as complex properties
            if (!!objs && objs.length > 0) {
                const k = objs.length - 1;
                for (let i = k; i >= 0; --i) {
                    objs[i].dispose();
                }
            }
        } finally {
            super.dispose();
        }
    }
    // override
    protected _getValue(name: string, ver: VALS_VERSION): any {
        switch (ver) {
            case VALS_VERSION.Original:
                if (!this._origVals) {
                    throw new Error("Invalid Operation, no Stored Version: " + ver);
                }
                return getValue(this._origVals, name);
            default:
                return super._getValue(name, ver);
        }
    }
    // override
    protected _setValue(name: string, val: any, ver: VALS_VERSION): void {
        switch (ver) {
            case VALS_VERSION.Original:
                if (!this._origVals) {
                    throw new Error("Invalid Operation, no Stored Version: " + ver);
                }
                setValue(this._origVals, name, val, false);
                break;
            default:
                super._setValue(name, val, ver);
                break;
        }
    }
    // override
    protected _storeVals(toVer: VALS_VERSION): void {
        switch (toVer) {
            case VALS_VERSION.Original:
                this._origVals = this._cloneVals();
                break;
            default:
                super._storeVals(toVer);
                break;
        }
    }
    // override
    protected _restoreVals(fromVer: VALS_VERSION): void {
        switch (fromVer) {
            case VALS_VERSION.Original:
                if (!this._origVals) {
                    throw new Error("Invalid Operation, no Stored Version: " + fromVer);
                }
                this._setVals(this._origVals);
                this._origVals = null;
                break;
            default:
                super._restoreVals(fromVer);
                break;
        }
    }
    protected _onFieldChanged(fieldName: string, fieldInfo?: IFieldInfo): void {
        sys.raiseProp(this.item, fieldName);
        const info = fieldInfo || this.coll.getFieldInfo(fieldName);
        if (!!info.dependents) {
            const item = this.item;
            // this call is made async for calculated properties correctly updated
            // because it needs to be updated after all the fields are refreshed
            utils.async.getTaskQueue().enque(() => {
                if (item.getIsStateDirty()) {
                    return;
                }

                for (const d of info.dependents) {
                    sys.raiseProp(item, d);
                }
            });
        }
    }
    protected _getValueChange(fullName: string, fieldInfo: IFieldInfo, changedOnly: boolean): IValueChange {
        const self = this, dbSet = self.dbSet;
        let res: IValueChange = null;

        if (fn_isNotSubmittable(fieldInfo)) {
            return res;
        }
        switch (fieldInfo.fieldType) {
            case FIELD_TYPE.ServerCalculated:
                res = {
                    fieldName: fieldInfo.fieldName,
                    val: null,
                    orig: null,
                    flags: FLAGS.None,
                    nested: null
                };
                break;
            case FIELD_TYPE.Object:
                res = { fieldName: fieldInfo.fieldName, val: null, orig: null, flags: FLAGS.None, nested: [] };
                const len = fieldInfo.nested.length;
                for (let i = 0; i < len; i += 1) {
                    const tmp = self._getValueChange(fullName + "." + fieldInfo.nested[i].fieldName, fieldInfo.nested[i], changedOnly);
                    if (!!tmp) {
                        res.nested.push(tmp);
                    }
                }
                break;
            default:
                const newVal = dbSet._getInternal().getStrValue(self._getValue(fullName, VALS_VERSION.Current), fieldInfo),
                    oldV = !self.hasOrigVals ? newVal : dbSet._getInternal().getStrValue(self._getValue(fullName, VALS_VERSION.Original), fieldInfo),
                    isChanged = (oldV !== newVal);
                if (isChanged) {
                    res = {
                        fieldName: fieldInfo.fieldName,
                        val: newVal,
                        orig: oldV,
                        flags: (FLAGS.Changed | FLAGS.Setted),
                        nested: null
                    };
                } else if (fieldInfo.isPrimaryKey > 0 || fieldInfo.fieldType === FIELD_TYPE.RowTimeStamp || fieldInfo.isNeedOriginal) {
                    res = {
                        fieldName: fieldInfo.fieldName,
                        val: newVal,
                        orig: oldV,
                        flags: FLAGS.Setted,
                        nested: null
                    };
                } else {
                    res = {
                        fieldName: fieldInfo.fieldName,
                        val: null,
                        orig: null,
                        flags: FLAGS.None,
                        nested: null
                    };
                }
                break;
        }

        if (changedOnly) {
            if (fieldInfo.fieldType === FIELD_TYPE.Object) {
                return (res.nested.length > 0) ? res : null;
            } else if ((res.flags & FLAGS.Changed) === FLAGS.Changed) {
                return res;
            } else {
                return null;
            }
        } else {
            return res;
        }
    }
    protected _getValueChanges(changedOnly: boolean): IValueChange[] {
        const self = this, flds = this.dbSet.getFieldInfos();
        const res = flds.map((fld: IFieldInfo) => {
            return self._getValueChange(fld.fieldName, fld, changedOnly);
        });

        // remove nulls
        const res2 = res.filter((vc: IValueChange) => {
            return !!vc;
        });
        return res2;
    }
    protected _fldChanging(_fieldName: string, _fieldInfo: IFieldInfo, _oldV: any, _newV: any): boolean {
        if (!this._origVals) {
            this._storeVals(VALS_VERSION.Original);
        }
        return true;
    }
    protected _skipValidate(fieldInfo: IFieldInfo, val: any): boolean {
        const childToParentNames = this.dbSet._getInternal().getChildToParentNames(fieldInfo.fieldName);
        let res = false;
        if (!!childToParentNames && val === null) {
            const len = childToParentNames.length;
            for (let i = 0; i < len; i += 1) {
                res = !!this._getFieldVal(childToParentNames[i]);
                if (res) {
                    break;
                }
            }
        }
        return res;
    }
    protected _beginEdit(): boolean {
        if (!super._beginEdit()) {
            return false;
        }
        this._savedStatus = this.status;
        return true;
    }
    protected _endEdit(): boolean {
        if (!super._endEdit()) {
            return false;
        }
        this._savedStatus = null;
        return true;
    }
    protected _cancelEdit(): boolean {
        if (!this.isEditing) {
            return false;
        }
        const self = this, changes: IValueChange[] = this._getValueChanges(true), dbSet = this.dbSet;
        this._restoreVals(VALS_VERSION.Temporary);
        dbSet.errors.removeAllErrors(this.item);
        this._setStatus(this._savedStatus);
        this._savedStatus = null;
        for (const change of changes)
        {
            const fld = dbSet.getFieldInfo(change.fieldName);
            if (!fld) {
                throw new Error(format(ERRS.ERR_DBSET_INVALID_FIELDNAME, self.dbSetName, change.fieldName));
            }
            self._onFieldChanged(change.fieldName, fld);
        }
        return true;
    }
    // override
    protected _setStatus(v: ITEM_STATUS): void {
        const old = this.status;
        if (old !== v) {
            const internal = this.dbSet._getInternal();
            super._setStatus(v);
            if (v !== ITEM_STATUS.None) {
                internal.addToChanged(this.item);
            } else {
                internal.removeFromChanged(this.key);
            }
            internal.onItemStatusChanged(this.item, old);
        }
    }
    _addDisposable(obj: IBaseObject): void {
        if (!this._disposables) {
            this._disposables = [];
        }
        this._disposables.push(obj);
    }
    _updateKeys(key: string): void {
        this._setSrvKey(key);
        this._setKey(key);
    }
    _checkCanRefresh(): void {
        if (this.key === null || this.status === ITEM_STATUS.Added) {
            throw new Error(ERRS.ERR_OPER_REFRESH_INVALID);
        }
    }
    _refreshValue(val: any, fullName: string, refreshMode: REFRESH_MODE): void {
        const self = this, fld = self.dbSet.getFieldInfo(fullName);
        if (!fld) {
            throw new Error(format(ERRS.ERR_DBSET_INVALID_FIELDNAME, self.dbSetName, fullName));
        }
        const stz = self.serverTimezone, dataType = fld.dataType, dcnv = fld.dateConversion;
        let newVal = parseValue(val, dataType, dcnv, stz), oldVal = self._getValue(fullName, VALS_VERSION.Current);
        switch (refreshMode) {
            case REFRESH_MODE.CommitChanges:
                {
                    if (!compareVals(newVal, oldVal, dataType)) {
                        self._setValue(fullName, newVal, VALS_VERSION.Current);
                        self._onFieldChanged(fullName, fld);
                    }
                }
                break;
            case REFRESH_MODE.RefreshCurrent:
                {
                    if (self.hasOrigVals) {
                        self._setValue(fullName, newVal, VALS_VERSION.Original);
                    }
                    if (self.hasTempVals) {
                        self._setValue(fullName, newVal, VALS_VERSION.Temporary);
                    }
                    if (!compareVals(newVal, oldVal, dataType)) {
                        self._setValue(fullName, newVal, VALS_VERSION.Current);
                        self._onFieldChanged(fullName, fld);
                    }
                }
                break;
            case REFRESH_MODE.MergeIntoCurrent:
                {
                    let origOldVal: any = _undefined;
                    if (self.hasOrigVals) {
                        origOldVal = self._getValue(fullName, VALS_VERSION.Original);
                        self._setValue(fullName, newVal, VALS_VERSION.Original);
                    }
                    if (origOldVal === _undefined || compareVals(origOldVal, oldVal, dataType)) {
                        // unmodified
                        if (!compareVals(newVal, oldVal, dataType)) {
                            self._setValue(fullName, newVal, VALS_VERSION.Current);
                            self._onFieldChanged(fullName, fld);
                        }
                    }
                }
                break;
            default:
                throw new Error(format(ERRS.ERR_PARAM_INVALID, "refreshMode", refreshMode));
        }
    }
    _refreshValues(rowInfo: IRowInfo, refreshMode: REFRESH_MODE): void {
        const self = this, oldStatus = this.status;
        if (!this.getIsDisposed()) {
            if (!refreshMode) {
                refreshMode = REFRESH_MODE.RefreshCurrent;
            }

            for (const val of rowInfo.values)
            {
                fn_walkChanges(val, (fullName, vc) => {
                    if ((vc.flags & FLAGS.Refreshed)) {
                        self._refreshValue(vc.val, fullName, refreshMode);
                    }
                });
            }

            if (oldStatus === ITEM_STATUS.Updated) {
                const changes = this._getValueChanges(true);
                if (changes.length === 0) {
                    this._origVals = null;
                    this._setStatus(ITEM_STATUS.None);
                }
            }
        }
    }
    _getRowInfo(): IRowInfo {
        const res: IRowInfo = {
            values: this._getValueChanges(false),
            changeType: this.status,
            serverKey: this.srvKey,
            clientKey: this.key,
            error: null
        };
        return res;
    }
    _getCalcFieldVal(fieldName: string): any {
        return this.dbSet._getInternal().getCalcFieldVal(fieldName, this.item);
    }
    _getNavFieldVal(fieldName: string): any {
        return this.dbSet._getInternal().getNavFieldVal(fieldName, this.item);
    }
    _setNavFieldVal(fieldName: string, value: any): void {
        this.dbSet._getInternal().setNavFieldVal(fieldName, this.item, value);
    }
    _clearFieldVal(fieldName: string): void {
        this._setValue(fieldName, null, VALS_VERSION.Current);
    }
    _getFieldVal(fieldName: string): any {
        return this._getValue(fieldName, VALS_VERSION.Current);
    }
    _setFieldVal(fieldName: string, val: any): boolean {
        if (this.isCancelling) {
            return false;
        }
        const dbSetName = this.dbSetName, dbSet = this.dbSet,
            oldV = this._getFieldVal(fieldName), fieldInfo = this.getFieldInfo(fieldName);
        let newV = val, res = false;
        if (!fieldInfo) {
            throw new Error(format(ERRS.ERR_DBSET_INVALID_FIELDNAME, dbSetName, fieldName));
        }
        if (!(this.isEditing || this.isUpdating)) {
            this.beginEdit();
        }

        try {
            if (fieldInfo.dataType === DATA_TYPE.String && fieldInfo.isNullable && !newV) {
                newV = null;
            }
            if (oldV !== newV) {
                if (fieldInfo.isReadOnly && !(this.isNew && fieldInfo.allowClientDefault)) {
                    throw new Error(ERRS.ERR_FIELD_READONLY);
                }

                if (this._fldChanging(fieldName, fieldInfo, oldV, newV)) {
                    this._setValue(fieldName, newV, VALS_VERSION.Current);
                    if (!(fieldInfo.fieldType === FIELD_TYPE.ClientOnly || fieldInfo.fieldType === FIELD_TYPE.ServerCalculated)) {
                        switch (this.status) {
                            case ITEM_STATUS.None:
                                this._setStatus(ITEM_STATUS.Updated);
                                break;
                        }
                    }
                    this._onFieldChanged(fieldName, fieldInfo);
                    res = true;
                }
                dbSet.errors.removeError(this.item, fieldName);
                const validationInfo = this._validateField(fieldName);
                if (!!validationInfo) {
                    throw new ValidationError([validationInfo], this);
                }
            }
        } catch (ex) {
            let error: IValidationError;
            if (sys.isValidationError(ex)) {
                error = ex;
            } else {
                error = new ValidationError([
                    { fieldName: fieldName, errors: [ex.message] }
                ], this);
            }
            dbSet.errors.addError(this.item, fieldName, error.validations[0].errors);
            throw error;
        }
        return res;
    }
    _setSrvKey(v: string): void {
        this._srvKey = v;
    }
    _acceptChanges(rowInfo?: IRowInfo): void {
        if (this.getIsDisposed()) {
            return;
        }
        const oldStatus = this.status, dbSet = this.dbSet, internal = dbSet._getInternal(),
            errors = dbSet.errors;
        if (oldStatus !== ITEM_STATUS.None) {
            internal.onCommitChanges(this.item, true, false, oldStatus);

            if (oldStatus === ITEM_STATUS.Deleted) {
                internal.removeFromChanged(this.key);
                errors.removeAllErrors(this.item);
                if (!this.getIsStateDirty()) {
                    this.dispose();
                }
            } else {
                this._origVals = null;
                if (this.hasTempVals) {
                    // refresh saved temporary values
                    this._storeVals(VALS_VERSION.Temporary);
                }
                this._setStatus(ITEM_STATUS.None);
                errors.removeAllErrors(this.item);
                if (!!rowInfo) {
                    this._refreshValues(rowInfo, REFRESH_MODE.CommitChanges);
                }
                internal.onCommitChanges(this.item, false, false, oldStatus);
            }
        }
    }
    deleteItem(): boolean {
        return this.deleteOnSubmit();
    }
    deleteOnSubmit(): boolean {
        if (this.getIsStateDirty()) {
            return false;
        }
        const oldStatus = this.status, dbSet = this.dbSet;
        const args: ICancellableArgs<TItem> = { item: this.item, isCancel: false };
        dbSet._getInternal().onItemDeleting(args);
        if (args.isCancel) {
            return false;
        }
        if (oldStatus === ITEM_STATUS.Added) {
            dbSet.removeItem(this.item);
        } else {
            this._setStatus(ITEM_STATUS.Deleted);
        }
        return true;
    }
    acceptChanges(): void {
        this._acceptChanges(null);
    }
    rejectChanges(): void {
        if (this.getIsDisposed()) {
            return;
        }
        const self = this, oldStatus = self.status, dbSet = self.dbSet, internal = dbSet._getInternal(), errors = dbSet.errors;
        if (oldStatus !== ITEM_STATUS.None) {
            internal.onCommitChanges(self.item, true, true, oldStatus);

            if (oldStatus === ITEM_STATUS.Added) {
                internal.removeFromChanged(this.key);
                errors.removeAllErrors(this.item);
                if (!this.getIsStateDirty()) {
                    this.dispose();
                }
            } else {
                const changes = self._getValueChanges(true);
                if (self.hasOrigVals) {
                    self._restoreVals(VALS_VERSION.Original);
                    if (self.hasTempVals) {
                        // refresh saved temporary values
                        self._storeVals(VALS_VERSION.Temporary);
                    }
                }
                self._setStatus(ITEM_STATUS.None);
                errors.removeAllErrors(this.item);
                for (const change of changes)
                {
                    fn_walkChanges(change, (fullName) => {
                        self._onFieldChanged(fullName, dbSet.getFieldInfo(fullName));
                    });
                }
                internal.onCommitChanges(this.item, false, true, oldStatus);
            }
        }
    }
    submitChanges(): IPromise {
        const removeHandler = () => {
            dbxt.offOnSubmitError(uniqueID);
        };
        const dbxt = this.dbSet.dbContext, uniqueID = uuid();
        dbxt.addOnSubmitError((_, args) => {
            if (args.error instanceof SubmitError) {
                const submitErr: SubmitError = args.error;
                if (submitErr.notValidated.length > 0) {
                    // don't reject changes,so the user can see errors in the edit dialog
                    args.isHandled = true;
                }
            }
        }, uniqueID);

        const promise = dbxt.submitChanges();
        promise.then(removeHandler, removeHandler);
        return promise;
    }
    refresh(): IStatefulPromise<TItem> {
        const dbxt = this.dbSet.dbContext;
        return <IStatefulPromise<TItem>>dbxt._getInternal().refreshItem(this.item);
    }
    toString(): string {
        return this.dbSetName + "EntityAspect";
    }
    protected get hasOrigVals(): boolean {
        return !!this._origVals;
    }
    get srvKey(): string {
        return this._srvKey;
    }
    get isCanSubmit(): boolean {
        return true;
    }
    get dbSetName(): string {
        return this.dbSet.dbSetName;
    }
    get serverTimezone(): number {
        return this.dbSet.dbContext.serverTimezone;
    }
    get dbSet(): DbSet<TItem, TObj, TDbContext> {
        return <any>this.coll;
    }
}
