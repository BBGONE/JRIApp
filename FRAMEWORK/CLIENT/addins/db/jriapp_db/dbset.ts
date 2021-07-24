/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    FIELD_TYPE, SORT_ORDER, COLL_CHANGE_REASON, COLL_CHANGE_TYPE, COLL_CHANGE_OPER, ITEM_STATUS
} from "jriapp_shared/collection/const";
import {
    IIndexer, IValidationInfo, TEventHandler, IBaseObject,
    IPromise, TPriority, LocaleERRS as ERRS, Debounce, Utils
} from "jriapp_shared";
import {
    IInternalCollMethods, IFieldInfo
} from "jriapp_shared/collection/int";
import { BaseCollection } from "jriapp_shared/collection/base";
import {
    ValueUtils, CollUtils
} from "jriapp_shared/collection/utils";
import {
    IFieldName, IEntityItem, IRowInfo, ITrackAssoc, IQueryResponse,
    IPermissions, IDbSetConstuctorOptions, IAssociationInfo, ICalcFieldImpl, INavFieldImpl,
    IQueryResult, IRowData, IDbSetLoadedArgs
} from "./int";
import { REFRESH_MODE } from "./const";
import { DataQuery, TDataQuery } from "./dataquery";
import { DbContext } from "./dbcontext";
import { EntityAspect } from "./entity_aspect";

const utils = Utils, { isArray, isNt } = utils.check, { format } = utils.str,
    { getValue, setValue, merge, forEach, Indexer } = utils.core, ERROR = utils.err,
    { parseValue, stringifyValue } = ValueUtils, { getPKFields, walkField, walkFields, objToVals, initVals, getObjectField } = CollUtils;

function doFieldDependences(dbSet: TDbSet, info: IFieldInfo) {
    if (!info.dependentOn) {
        return;
    }
    const deps: string[] = info.dependentOn.split(",");
    for(const depOn of deps)
    {
        const depOnFld = dbSet.getFieldInfo(depOn);
        if (!depOnFld) {
            throw new Error(format(ERRS.ERR_CALC_FIELD_DEFINE, depOn));
        }
        if (info === depOnFld) {
            throw new Error(format(ERRS.ERR_CALC_FIELD_SELF_DEPEND, depOn));
        }
        if (depOnFld.dependents.indexOf(info.fullName) < 0) {
            depOnFld.dependents.push(info.fullName);
        }
    }
}

export interface IFillFromServiceArgs {
    res: IQueryResponse;
    reason: COLL_CHANGE_REASON;
    query: TDataQuery;
    onFillEnd: () => void;
}

export interface IFillFromCacheArgs {
    reason: COLL_CHANGE_REASON;
    query: TDataQuery;
}

export interface IInternalDbSetMethods<TItem extends IEntityItem, TObj> extends IInternalCollMethods<TItem> {
    getCalcFieldVal(fieldName: string, item: IEntityItem): any;
    getNavFieldVal(fieldName: string, item: IEntityItem): any;
    setNavFieldVal(fieldName: string, item: IEntityItem, value: any): void;
    beforeLoad(query: DataQuery<TItem, TObj>, oldQuery: DataQuery<TItem, TObj>): void;
    updatePermissions(perms: IPermissions): void;
    getChildToParentNames(childFieldName: string): string[];
    fillFromService(info: IFillFromServiceArgs): IQueryResult<TItem>;
    fillFromCache(info: IFillFromCacheArgs): IQueryResult<TItem>;
    commitChanges(rows: IRowInfo[]): void;
    setItemInvalid(row: IRowInfo): TItem;
    getChanges(): IRowInfo[];
    getTrackAssocInfo(): ITrackAssoc[];
    addToChanged(item: TItem): void;
    removeFromChanged(key: string): void;
    onItemStatusChanged(item: TItem, oldStatus: ITEM_STATUS): void;
    setQuery(query: DataQuery<TItem, TObj>): void;
}

const enum DBSET_EVENTS {
    loaded = "dbset_loaded"
}

export interface IDbSetConstructor<TItem extends IEntityItem, TObj> {
    new (dbContext: DbContext): DbSet<TItem, TObj, DbContext>;
}

export abstract class DbSet<TItem extends IEntityItem = IEntityItem, TObj extends IIndexer<any> = IIndexer<any>, TDbContext extends DbContext = DbContext> extends BaseCollection<TItem> {
    private _dbContext: TDbContext;
    private _isSubmitOnDelete: boolean;
    private _trackAssoc: { [name: string]: IAssociationInfo; };
    private _fieldMap: IIndexer<IFieldInfo>;
    private _fieldInfos: IFieldInfo[];
    private _trackAssocMap: { [childFieldName: string]: string[]; };
    private _childAssocMap: { [fieldName: string]: IAssociationInfo; };
    private _parentAssocMap: { [fieldName: string]: IAssociationInfo; };
    private _changeCount: number;
    private _changeCache: { [key: string]: TItem; };
    protected _navfldMap: { [fieldName: string]: INavFieldImpl<TItem>; };
    protected _calcfldMap: { [fieldName: string]: ICalcFieldImpl<TItem>; };
    protected _ignorePageChanged: boolean;
    protected _query: DataQuery<TItem, TObj>;
    private _pageDebounce: Debounce;
    private _dbSetName: string;
    private _pkFields: IFieldInfo[];
    private _isPageFilled: boolean;
    private _newKey: number;

    constructor(opts: IDbSetConstuctorOptions) {
        super();
        const self = this, dbContext = opts.dbContext, dbSetInfo = opts.dbSetInfo, fieldInfos = dbSetInfo.fieldInfos;
        this._dbContext = <TDbContext>dbContext;
        this._dbSetName = dbSetInfo.dbSetName;
        this.options.enablePaging = dbSetInfo.enablePaging;
        this.options.pageSize = dbSetInfo.pageSize;
        this._query = null;
        this._isSubmitOnDelete = false;
        this._navfldMap = Indexer();
        this._calcfldMap = Indexer();
        this._fieldMap = Indexer();
        this._fieldInfos = fieldInfos;
        this._pkFields = getPKFields(fieldInfos);
        this._isPageFilled = false;
        this._newKey = 0;
        // used when page index is changed
        this._pageDebounce = new Debounce(400);
        // association infos maped by name
        // we should track changes in navigation properties for this associations
        this._trackAssoc = Indexer();
        // map childToParentName by childField as a key
        this._trackAssocMap = Indexer();
        // map association infos by childToParent fieldname
        this._childAssocMap = Indexer();
        // map association infos by parentToChildren fieldname
        this._parentAssocMap = Indexer();

        this._changeCount = 0;
        this._changeCache = Indexer();
        this._ignorePageChanged = false;
        for (const f of fieldInfos)
        {
            self._fieldMap[f.fieldName] = f;
            walkField(f, (fld, fullName) => {
                fld.dependents = [];
                fld.fullName = fullName;
            });
        }

        walkFields(fieldInfos, (fld, fullName) => {
            if (fld.fieldType === FIELD_TYPE.Navigation) {
                // navigation fields can NOT be on nested fields
                setValue(self._navfldMap, fullName, self._doNavigationField(opts, fld), true);
            } else if (fld.fieldType === FIELD_TYPE.Calculated) {
                // calculated fields can be on nested fields
                setValue(self._calcfldMap, fullName, self._doCalculatedField(opts, fld), true);
            }
        });

        self._mapAssocFields();
        const extraInternal = {
            getCalcFieldVal: (fieldName: string, item: TItem) => {
                return self._getCalcFieldVal(fieldName, item);
            },
            getNavFieldVal: (fieldName: string, item: TItem) => {
                return self._getNavFieldVal(fieldName, item);
            },
            setNavFieldVal: (fieldName: string, item: TItem, value: any) => {
                self._setNavFieldVal(fieldName, item, value);
            },
            beforeLoad: (query: DataQuery<TItem, TObj>, oldQuery: DataQuery<TItem, TObj>) => {
                self._beforeLoad(query, oldQuery);
            },
            updatePermissions: (perms: IPermissions) => {
                self._updatePermissions(perms);
            },
            getChildToParentNames: (childFieldName: string) => {
                return self._getChildToParentNames(childFieldName);
            },
            fillFromService: (info: IFillFromServiceArgs) => {
                return self._fillFromService(info);
            },
            fillFromCache: (info: IFillFromCacheArgs) => {
                return self._fillFromCache(info);
            },
            commitChanges: (rows: IRowInfo[]) => {
                self._commitChanges(rows);
            },
            setItemInvalid: (row: IRowInfo) => {
                return self._setItemInvalid(row);
            },
            getChanges: () => {
                return self._getChanges();
            },
            getTrackAssocInfo: () => {
                return self._getTrackAssocInfo();
            },
            addToChanged: (item: TItem) => {
                self._addToChanged(item);
            },
            removeFromChanged: (key: string) => {
                self._removeFromChanged(key);
            },
            onItemStatusChanged: (item: TItem, oldStatus: ITEM_STATUS) => {
                self._onItemStatusChanged(item, oldStatus);
            },
            setQuery: (query: DataQuery<TItem, TObj>) => {
                self._setQuery(query);
            }
        };
        let internal = this._getInternal();
        this._setInternal(merge(extraInternal, internal));
        this.dbContext.objEvents.onProp("isSubmiting", () => {
            self.objEvents.raiseProp("isBusy");
        }, this.dbSetName);
        this.objEvents.onProp("isLoading", () => {
            self.objEvents.raiseProp("isBusy");
        });
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        this._pageDebounce.dispose();
        this._pageDebounce = null;
        this.clear();
        const dbContext = this.dbContext;
        this._dbContext = null;
        if (!!dbContext) {
            dbContext.objEvents.offNS(this.dbSetName);
        }
        this._navfldMap = Indexer();
        this._calcfldMap = Indexer();
        super.dispose();
    }
    abstract itemFactory(aspect: EntityAspect<TItem, TObj, TDbContext>): TItem;
    public handleError(error: any, source: any): boolean {
        return (!this._dbContext) ? super.handleError(error, source) : this._dbContext.handleError(error, source);
    }
    protected _mapAssocFields(): void {
        const trackAssoc = this._trackAssoc, tasKeys = Object.keys(trackAssoc), trackAssocMap = this._trackAssocMap;
        const len = tasKeys.length;
        for (let i = 0; i < len; i += 1) {
            const assoc: IAssociationInfo = trackAssoc[tasKeys[i]], len2 = assoc.fieldRels.length;
            for (let j = 0; j < len2; j += 1) {
                const frel: { childField: string; parentField: string; } = assoc.fieldRels[j];
                if (!isArray(trackAssocMap[frel.childField])) {
                    trackAssocMap[frel.childField] = [assoc.childToParentName];
                } else {
                    trackAssocMap[frel.childField].push(assoc.childToParentName);
                }
            }
        }
    }
    protected _doNavigationField(opts: IDbSetConstuctorOptions, fieldInfo: IFieldInfo): INavFieldImpl<TItem> {
        const self = this, result: INavFieldImpl<TItem> = {
            getFunc: (_item) => {
                throw new Error(`Navigation get function for the field: ${fieldInfo.fieldName} is not implemented`);
            },
            setFunc: (_v: any, _item: TItem) => {
                throw new Error(`Navigation set function for the field: ${fieldInfo.fieldName} is not implemented`);
            }
        };
        let isChild = true, assocs = opts.childAssoc.filter((a) => {
            return a.childToParentName === fieldInfo.fieldName;
        });

        if (assocs.length === 0) {
            assocs = opts.parentAssoc.filter((a) => {
                return a.parentToChildrenName === fieldInfo.fieldName;
            });
            isChild = false;
        }

        if (assocs.length !== 1) {
            throw new Error(format(ERRS.ERR_PARAM_INVALID_TYPE, "assocs", "Array"));
        }
        const assocName = assocs[0].name;
        fieldInfo.isReadOnly = true;
        if (isChild) {
            fieldInfo.isReadOnly = false;
            self._childAssocMap[assocs[0].childToParentName] = assocs[0];
            for (const frel of assocs[0].fieldRels)
            {
                const childFld = self.getFieldInfo(frel.childField);
                if (!fieldInfo.isReadOnly && (childFld.isReadOnly && !childFld.allowClientDefault)) {
                    fieldInfo.isReadOnly = true;
                }
            }
            // this property should return parent
            result.getFunc = (item: TItem) => {
                const assoc = self.dbContext.getAssociation(assocName);
                return assoc.getParentItem(item);
            };

            if (!fieldInfo.isReadOnly) {
                // should track this association for new items parent - child relationship changes
                self._trackAssoc[assocName] = assocs[0];
                result.setFunc = (v: any, item: TItem) => {
                    const assoc = self.dbContext.getAssociation(assocName);
                    if (!!v) {
                        if (((<IEntityItem>v)._aspect.dbSetName !== assoc.parentDS.dbSetName)) {
                            throw new Error(format(ERRS.ERR_PARAM_INVALID_TYPE, "value", assoc.parentDS.dbSetName));
                        }

                        if ((<IEntityItem>v)._aspect.isNew) {
                            item._aspect._setFieldVal(fieldInfo.fieldName, (<IEntityItem>v)._key);
                        } else {
                            const len = assoc.childFldInfos.length;
                            for (let i = 0; i < len; i += 1) {
                                (<any>item)[assoc.childFldInfos[i].fieldName] = v[assoc.parentFldInfos[i].fieldName];
                            }
                        }
                    } else {
                        const oldKey = item._aspect._getFieldVal(fieldInfo.fieldName);
                        if (!!oldKey) {
                            item._aspect._setFieldVal(fieldInfo.fieldName, null);
                        }
                        const len = assoc.childFldInfos.length;
                        for (let i = 0; i < len; i += 1) {
                            (<any>item)[assoc.childFldInfos[i].fieldName] = null;
                        }
                    }
                };
            }
            // if (isChild)
        } else {
            self._parentAssocMap[assocs[0].parentToChildrenName] = assocs[0];
            // returns items children
            result.getFunc = (item: TItem) => {
                return self.dbContext.getAssociation(assocName).getChildItems(item);
            };
        }
        return result;
    }
    protected _doCalculatedField(_opts: IDbSetConstuctorOptions, fieldInfo: IFieldInfo): ICalcFieldImpl<TItem> {
        const self = this, result: ICalcFieldImpl<TItem> = {
            getFunc: (_item) => { throw new Error(format("Calculated field:'{0}' is not initialized", fieldInfo.fieldName)); }
        };
        fieldInfo.isReadOnly = true;
        if (!!fieldInfo.dependentOn) {
            doFieldDependences(self, fieldInfo);
        }
        return result;
    }
    protected _refreshValues(path: string, item: IEntityItem, values: any[], names: IFieldName[], rm: REFRESH_MODE): void {
        const self = this, dependents = utils.core.Indexer();

        values.forEach((value, index) => {
            const name: IFieldName = names[index], fieldName = path + name.n, fld = self.getFieldInfo(fieldName);
            if (!fld) {
                throw new Error(format(ERRS.ERR_DBSET_INVALID_FIELDNAME, self.dbSetName, fieldName));
            }

            if (fld.fieldType === FIELD_TYPE.Object) {
                // for object fields the value should be an array of values - recursive processing
                self._refreshValues(fieldName + ".", item, <any[]>value, name.p, rm);
            } else {
                // for other fields the value is a string
                item._aspect._refreshValue(value, fieldName, rm, dependents);
            }
        });

        item._aspect._updateDependents(dependents);
    }
    protected _applyFieldVals(vals: any, path: string, values: any[], names: IFieldName[]) {
        const self = this, stz = self.dbContext.serverTimezone;
        values.forEach((value, index) => {
            const name: IFieldName = names[index], fieldName = path + name.n,
                fld = self.getFieldInfo(fieldName);
            if (!fld) {
                throw new Error(format(ERRS.ERR_DBSET_INVALID_FIELDNAME, self.dbSetName, fieldName));
            }

            if (fld.fieldType === FIELD_TYPE.Object) {
                // for object fields the value should be an array of values - recursive processing
                self._applyFieldVals(vals, fieldName + ".", <any[]>value, name.p);
            } else {
                // for other fields the value is a string, which is parsed to a typed value
                const val = parseValue(value, fld.dataType, fld.dateConversion, stz);
                setValue(vals, fieldName, val, false);
            }
        });
    }
    protected _getNewKey(): string {
        // client's item ID
        const key = "clkey_" + this._newKey;
        this._newKey += 1;
        return key;
    }
    // override
    protected _onItemAdded(item: TItem): void {
        super._onItemAdded(item);
        this._addToChanged(item);
    }
    // override
    protected _createNew(): TItem {
        return this.createEntityFromData(null, null);
    }
    // override
    protected _clear(reason: COLL_CHANGE_REASON, oper: COLL_CHANGE_OPER): void {
        try {
            super._clear(reason, oper);
        } finally {
            this._newKey = 0;
            this._isPageFilled = false;
        }
    }
    protected _onPageChanging(): boolean {
        const res = super._onPageChanging();
        if (!res) {
            return res;
        }
        this.rejectChanges();

        const query = this.query;
        if (!!query && query.loadPageCount > 1 && this._isPageFilled) {
            query._getInternal().updateCache(this.pageIndex, this.items);
        }
        return res;
    }
    protected _onPageChanged(): void {
        const self = this;
        this._isPageFilled = false;
        this.cancelEdit();
        super._onPageChanged();
        if (this._ignorePageChanged) {
            return;
        }
        self.query.pageIndex = self.pageIndex;
        self._pageDebounce.enque(() => {
            self.dbContext._getInternal().load(self.query, COLL_CHANGE_REASON.PageChange);
        });
    }
    protected _onPageSizeChanged(): void {
        super._onPageSizeChanged();
        if (!!this._query) {
            this._query.pageSize = this.pageSize;
        }
    }
    protected _defineCalculatedField(fullName: string, getFunc: (item: TItem) => any): void {
        const calcDef: ICalcFieldImpl<TItem> = getValue(this._calcfldMap, fullName);
        if (!calcDef) {
            throw new Error(format(ERRS.ERR_PARAM_INVALID, "calculated fieldName", fullName));
        }
        calcDef.getFunc = getFunc;
    }
    protected _getStrValue(val: any, fieldInfo: IFieldInfo): string {
        const dcnv = fieldInfo.dateConversion, stz = this.dbContext.serverTimezone;
        return stringifyValue(val, dcnv, fieldInfo.dataType, stz);
    }
    protected _getKeyValue(vals: any): string {
        const pkFlds = this._pkFields, len = pkFlds.length;
        if (len === 1) {
            const val = getValue(vals, pkFlds[0].fieldName);
            if (isNt(val)) {
                throw new Error(`Empty key field value for: ${pkFlds[0].fieldName}`);
            }
            return this._getStrValue(val, pkFlds[0]);
        } else {
            const pkVals: string[] = [];
            for (let i = 0; i < len; i += 1) {
                const val = getValue(vals, pkFlds[i].fieldName);
                if (isNt(val)) {
                    throw new Error(`Empty key field value for: ${pkFlds[i].fieldName}`);
                }
                const strval = this._getStrValue(val, pkFlds[i]);
                pkVals.push(strval);
            }
            return pkVals.join(";");
        }
    }
    protected _getCalcFieldVal(fieldName: string, item: TItem): any {
        try {
            const val: ICalcFieldImpl<TItem> = getValue(this._calcfldMap, fieldName);
            return val.getFunc.call(item, item);
        } catch (err) {
            ERROR.reThrow(err, this.handleError(err, this));
        }
    }
    protected _getNavFieldVal(fieldName: string, item: TItem): any {
        const val: INavFieldImpl<TItem> = getValue(this._navfldMap, fieldName);
        return val.getFunc.call(item, item);
    }
    protected _setNavFieldVal(fieldName: string, item: TItem, value: any): void {
        const val: INavFieldImpl<TItem> = getValue(this._navfldMap, fieldName);
        val.setFunc.call(item, value, item);
    }
    protected _beforeLoad(query: DataQuery<TItem, TObj>, oldQuery: DataQuery<TItem, TObj>): void {
        if (!!query.isForAppend) {
            query.pageSize = this.pageSize;
            query.pageIndex = this.pageIndex;
            this._query = query;
        } else {
            if (oldQuery !== query) {
                query.pageIndex = 0;
                this._query = query;

                if (!!oldQuery) {
                    oldQuery.dispose();
                }
            }

            if (query.pageSize !== this.pageSize) {
                this._ignorePageChanged = true;
                try {
                    this.pageIndex = 0;
                    this.pageSize = query.pageSize;
                } finally {
                    this._ignorePageChanged = false;
                }
            }

            if (query.pageIndex !== this.pageIndex) {
                this._ignorePageChanged = true;
                try {
                    this.pageIndex = query.pageIndex;
                } finally {
                    this._ignorePageChanged = false;
                }
            }

            if (!query.isCacheValid) {
                query._getInternal().clearCache();
            }
        }
    }
    protected _getChildToParentNames(childFieldName: string): string[] { return this._trackAssocMap[childFieldName]; }
    protected _afterFill(result: IQueryResult<TItem>, isClearAll?: boolean) {
        const self = this;
        // fetchedItems is null when loaded from the data cache
        if (!isNt(result.fetchedItems)) {
            this._onLoaded(result.fetchedItems);
        }

        this._onCollectionChanged({
            changeType: !isClearAll ? COLL_CHANGE_TYPE.Add : COLL_CHANGE_TYPE.Reset,
            reason: result.reason,
            oper: COLL_CHANGE_OPER.Fill,
            items: result.newItems
        });

        this._onFillEnd({
            items: result.items,
            newItems: result.newItems,
            reason: result.reason
        });

        this._isPageFilled = true;

        if (!!isClearAll) {
            self.moveFirst();
        }
    }
    protected _fillFromService(info: IFillFromServiceArgs): IQueryResult<TItem> {
        const self = this, res = info.res, fieldNames = res.names, rows = res.rows || [],
            isPagingEnabled = this.isPagingEnabled, query = info.query;
        let isClearAll = true;

        if (!!query && !query.getIsStateDirty()) {
            isClearAll = query.isClearPrevData;
            if (query.isClearCacheOnEveryLoad) {
                query._getInternal().clearCache();
            }
            if (isClearAll) {
                this._clear(info.reason, COLL_CHANGE_OPER.Fill);
            }
        }

        const fetchedItems = rows.map((row) => {
            // row.key already a string value generated on server (no need to convert to string)
            const key = row.k;
            if (!key) {
                throw new Error(ERRS.ERR_KEY_IS_EMPTY);
            }

            let item = self.getItemByKey(key);
            if (!item) {
                item = self.createEntityFromData(row, fieldNames);
            } else {
                self._refreshValues("", item, row.v, fieldNames, REFRESH_MODE.RefreshCurrent);
            }

            return item;
        });

        let _fetchedItems = fetchedItems;

        if (!!query && !query.getIsStateDirty()) {
            if (query.isIncludeTotalCount && !isNt(res.totalCount)) {
                this.totalCount = res.totalCount;
            }

            if (query.loadPageCount > 1 && isPagingEnabled) {
                const dataCache = query._getInternal().getCache();
                if (query.isIncludeTotalCount && !isNt(res.totalCount)) {
                    dataCache.totalCount = res.totalCount;
                }
                dataCache.fill(res.pageIndex, fetchedItems);
                _fetchedItems = <TItem[]>dataCache.getPageItems(query.pageIndex);
            }
        }

        const newItems: TItem[] = [], items: TItem[] = [];

        for(const item of _fetchedItems)
        {
            const oldItem = self.getItemByKey(item._key);
            if (!oldItem) {
                self._appendItem(item);
                newItems.push(item);
                items.push(item);
                item._aspect._setIsAttached(true);
            } else {
                items.push(oldItem);
            }
        }

        if (newItems.length > 0) {
            this._onCountChanged();
        }

        const result: IQueryResult<TItem> = {
            newItems: newItems,
            fetchedItems: fetchedItems,
            items: items,
            reason: info.reason,
            outOfBandData: info.res.extraInfo
        };

        info.onFillEnd();
        this._afterFill(result, isClearAll);
        return result;
    }
    protected _fillFromCache(args: IFillFromCacheArgs): IQueryResult<TItem> {
        const query = args.query;
        if (!query) {
            throw new Error(format(ERRS.ERR_ASSERTION_FAILED, "query is not null"));
        }
        if (query.getIsStateDirty()) {
            throw new Error(format(ERRS.ERR_ASSERTION_FAILED, "query not destroyed"));
        }
        const dataCache = query._getInternal().getCache(), arr = <TItem[]>dataCache.getPageItems(query.pageIndex);

        this._replaceItems(args.reason, COLL_CHANGE_OPER.Fill, arr);

        const items: TItem[] = [];

        for (const item of arr) {
            items.push(item);
        }

        if (items.length > 0) {
            this._onCountChanged();
        }

        const result: IQueryResult<TItem> = {
            newItems: items,
            fetchedItems: null,
            items: items,
            reason: args.reason,
            outOfBandData: null
        };

        this._afterFill(result, true);
        return result;
    }
    protected _commitChanges(rows: IRowInfo[]): void {
        const self = this;
        for(const rowInfo of rows)
        {
            const oldKey = rowInfo.clientKey, newKey = rowInfo.serverKey,
                item: TItem = self.getItemByKey(oldKey);
            if (!item) {
                throw new Error(format(ERRS.ERR_KEY_IS_NOTFOUND, oldKey));
            }
            const itemStatus = item._aspect.status;
            item._aspect._acceptChanges(rowInfo);
            if (itemStatus === ITEM_STATUS.Added) {
                // on insert
                item._aspect._updateKeys(rowInfo.serverKey);
                self._remapItem(oldKey, newKey, item);
                self._onCollectionChanged({
                    changeType: COLL_CHANGE_TYPE.Remap,
                    reason: COLL_CHANGE_REASON.None,
                    oper: COLL_CHANGE_OPER.Commit,
                    items: [item],
                    old_key: oldKey,
                    new_key: newKey
                });
            }
        }
    }
    protected _setItemInvalid(row: IRowInfo): TItem {
        const item = this.getItemByKey(row.clientKey), errors = Indexer<string[]>();
        row.invalid.forEach((err) => {
            if (!err.fieldName) {
                err.fieldName = "*";
            }
            if (isArray(errors[err.fieldName])) {
                errors[err.fieldName].push(err.message);
            } else {
                errors[err.fieldName] = [err.message];
            }
        });
        const res: IValidationInfo[] = [];
        forEach(errors, (fieldName, err) => {
            res.push({ fieldName: fieldName, errors: err });
        });
        this.errors.addErrors(item, res);
        return item;
    }
    protected _getChanges(): IRowInfo[] {
        const changes: IRowInfo[] = [], csh = this._changeCache;
        forEach(csh, (_key, item) => {
            changes.push(item._aspect._getRowInfo());
        });
        return changes;
    }
    protected _getTrackAssocInfo(): ITrackAssoc[] {
        const self = this, res: ITrackAssoc[] = [], csh = this._changeCache, trackAssoc = self._trackAssoc;
        forEach(csh, (_key, item) => {
            forEach(trackAssoc, (assocName, assocInfo) => {
                const parentKey = item._aspect._getFieldVal(assocInfo.childToParentName),
                    childKey = item._key;
                if (!!parentKey && !!childKey) {
                    res.push({ assocName: assocName, parentKey: parentKey, childKey: childKey });
                }
            });
        });
        return res;
    }
    protected _addToChanged(item: TItem): void {
        if (item._aspect.isDetached) {
            return;
        }
        if (!this._changeCache[item._key]) {
            this._changeCache[item._key] = item;
            this._changeCount += 1;
            if (this._changeCount === 1) {
                this.objEvents.raiseProp("isHasChanges");
            }
        }
    }
    protected _removeFromChanged(key: string): void {
        if (!key) {
            return;
        }
        if (!!this._changeCache[key]) {
            delete this._changeCache[key];
            this._changeCount -= 1;
            if (this._changeCount === 0) {
                this.objEvents.raiseProp("isHasChanges");
            }
        }
    }
    protected _setQuery(query: DataQuery<TItem, TObj>): void {
        this._query = query;
    }
    // occurs when item Status Changed (not used in simple collections)
    protected _onItemStatusChanged(item: TItem, oldStatus: ITEM_STATUS): void {
        super._onItemStatusChanged(item, oldStatus);
        if (item._aspect.isDeleted && this.isSubmitOnDelete) {
            this.dbContext.submitChanges().catch((_err) => {
                utils.queue.enque(() => {
                    this.dbContext.rejectChanges();
                });
            });
        }
    }
    protected _onRemoved(item: TItem): void {
        this._removeFromChanged(item._key);
        super._onRemoved(item);
    }
    // reports ALL the values returned from the server 
    // it is not not triggered when loaded from the Data Cache
    protected _onLoaded(items: TItem[]) {
        // canRaise is checked because creating vals is an expensive operation
        if (this.objEvents.canRaise(DBSET_EVENTS.loaded)) {
            const vals = items.map((item) => <TObj>item._aspect.vals);
            this.objEvents.raise(DBSET_EVENTS.loaded, { vals: vals });
        }
    }
    protected _destroyQuery(): void {
        const query = this._query;
        this._query = null;
        if (!!query) {
            query.dispose();
        }
    }
    protected _getNames(): IFieldName[] {
        const fieldInfos = this.getFieldInfos(), names: IFieldName[] = [];
        walkFields(fieldInfos, (fld, _fullName, arr) => {
            if (fld.fieldType === FIELD_TYPE.Object) {
                const res: any[] = [];
                arr.push({
                    n: fld.fieldName, p: res
                });
                return res;
            } else {
                const isOK = fld.fieldType === FIELD_TYPE.None || fld.fieldType === FIELD_TYPE.RowTimeStamp || fld.fieldType === FIELD_TYPE.ServerCalculated;
                if (isOK) {
                    arr.push({
                        n: fld.fieldName, p: null
                    });
                }
                return arr;
            }
        }, names);
        return names;
    }
    // override
    getFieldMap(): IIndexer<IFieldInfo> {
        return this._fieldMap;
    }
    // override
    getFieldInfos(): IFieldInfo[] {
        return this._fieldInfos;
    }
    createEntityFromObj(obj: TObj, key?: string): TItem {
        const isNew = !obj, vals: any = objToVals(this.getFieldInfos(), obj),
            _key = isNew ? this._getNewKey() : (!key ? this._getKeyValue(vals) : key);
        const aspect = new EntityAspect<TItem, TObj, TDbContext>(this, vals, _key, isNew);
        return aspect.item;
    }
    createEntityFromData(row: IRowData, fieldNames: IFieldName[]): TItem {
        const vals: any = initVals(this.getFieldInfos(), {}), isNew = !row;
        if (!!row) {
            this._applyFieldVals(vals, "", row.v, fieldNames);
        }
        const aspect = new EntityAspect<TItem, TObj, TDbContext>(this, vals, isNew ? this._getNewKey() : row.k, isNew);
        return aspect.item;
    }
    _getInternal(): IInternalDbSetMethods<TItem, TObj> {
        return <IInternalDbSetMethods<TItem, TObj>>super._getInternal();
    }
    refreshData(data: {
        names: IFieldName[];
        rows: IRowData[];
    }): void {
        for (const row of data.rows)
        {
            // row.key already a string value generated on server (no need to convert to string)
            const key = row.k;
            if (!key) {
                throw new Error(ERRS.ERR_KEY_IS_EMPTY);
            }

            let item = this.getItemByKey(key);
            if (!!item) {
                this._refreshValues("", item, row.v, data.names, REFRESH_MODE.RefreshCurrent);
            }
        }
    }
    // fill items from row data (in wire format)
    fillData(data: {
        names: IFieldName[];
        rows: IRowData[];
    }, isAppend?: boolean): IQueryResult<TItem> {
        const self = this, reason = COLL_CHANGE_REASON.None;
        this._destroyQuery();
        const isClearAll = !isAppend;
        if (isClearAll) {
            self._clear(reason, COLL_CHANGE_OPER.Fill);
        }

        const fetchedItems = data.rows.map((row) => {
            // row.key already a string value generated on server (no need to convert to string)
            const key = row.k;
            if (!key) {
                throw new Error(ERRS.ERR_KEY_IS_EMPTY);
            }

            let item = self.getItemByKey(key);
            if (!item) {
                item = self.createEntityFromData(row, data.names);
            } else {
                self._refreshValues("", item, row.v, data.names, REFRESH_MODE.RefreshCurrent);
            }
            return item;
        });

        const newItems: TItem[] = [], items: TItem[] = [];
        fetchedItems.forEach((item) => {
            const oldItem = self.getItemByKey(item._key);
            if (!oldItem) {
                self._appendItem(item);
                newItems.push(item);
                items.push(item);
                item._aspect._setIsAttached(true);
            } else {
                items.push(oldItem);
            }
        });

        if (newItems.length > 0) {
            this._onCountChanged();
        }

        this.totalCount = fetchedItems.length;

        const result: IQueryResult<TItem> = {
            newItems: newItems,
            fetchedItems: fetchedItems,
            items: items,
            reason: COLL_CHANGE_REASON.None,
            outOfBandData: null
        };

        this._afterFill(result, isClearAll);
        return result;
    }
    // manually fill items for an array of objects
    fillItems(data: TObj[], isAppend?: boolean): IQueryResult<TItem> {
        const self = this, reason = COLL_CHANGE_REASON.None;
        this._destroyQuery();
        const isClearAll = !isAppend;
        if (isClearAll) {
            self._clear(reason, COLL_CHANGE_OPER.Fill);
        }

        const fetchedItems = data.map((obj) => {
            return self.createEntityFromObj(obj);
        });

        const newItems: TItem[] = [], items: TItem[] = [];
        fetchedItems.forEach((item) => {
            const oldItem = self.getItemByKey(item._key);
            if (!oldItem) {
                self._appendItem(item);
                newItems.push(item);
                items.push(item);
                item._aspect._setIsAttached(true);
            } else {
                items.push(oldItem);
            }
        });

        if (newItems.length > 0) {
            this._onCountChanged();
        }

        this.totalCount = fetchedItems.length;

        const result: IQueryResult<TItem> = {
            newItems: newItems,
            fetchedItems: fetchedItems,
            items: items,
            reason: COLL_CHANGE_REASON.None,
            outOfBandData: null
        };

        this._afterFill(result, isClearAll);
        return result;
    }
    addOnLoaded(fn: TEventHandler<DbSet<TItem, TObj, TDbContext>, IDbSetLoadedArgs<TObj>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void {
        this.objEvents.on(DBSET_EVENTS.loaded, fn, nmspace, context, priority);
    }
    offOnLoaded(nmspace?: string): void {
        this.objEvents.off(DBSET_EVENTS.loaded, nmspace);
    }
    waitForNotBusy(callback: () => void, groupName: string): void {
        this._waitForProp("isBusy", callback, groupName);
    }
    getFieldInfo(fieldName: string): IFieldInfo {
        const parts = fieldName.split(".");
        let fld = this._fieldMap[parts[0]];
        if (!fld) {
            throw new Error(format(ERRS.ERR_DBSET_INVALID_FIELDNAME, this.dbSetName, fieldName));
        }
        if (parts.length === 1) {
            return fld;
        }
        if (fld.fieldType === FIELD_TYPE.Object) {
            for (let i = 1; i < parts.length; i += 1) {
                fld = getObjectField(parts[i], fld.nested);
            }
            return fld;
        } else if (fld.fieldType === FIELD_TYPE.Navigation) {
            // for example Customer.Name
            const assoc = this._childAssocMap[fld.fieldName];
            if (!!assoc) {
                const parentDB = this.dbContext.getDbSet(assoc.parentDbSetName);
                return parentDB.getFieldInfo(parts.slice(1).join("."));
            }
        }

        throw new Error(format(ERRS.ERR_DBSET_INVALID_FIELDNAME, this.dbSetName, fieldName));
    }
    sort(fieldNames: string[], sortOrder: SORT_ORDER): IPromise<any> {
        const self = this, query = self.query;
        if (!isNt(query)) {
            query.clearSort();
            for (let i = 0; i < fieldNames.length; i += 1) {
                switch (i) {
                    case 0:
                       query.orderBy(fieldNames[i], sortOrder);
                    break;
                    default:
                       query.thenBy(fieldNames[i], sortOrder);
                    break;
                }
            }

            query.isClearPrevData = true;
            query.pageIndex = 0;
            return self.dbContext._getInternal().load(query, COLL_CHANGE_REASON.Sorting);
        } else {
            return super.sort(fieldNames, sortOrder);
        }
    }
    acceptChanges(): void {
        if (!this.isHasChanges) {
            return;
        }
        const csh = this._changeCache;
        forEach(csh, (key) => {
            const item = csh[key];
            item._aspect.acceptChanges();
        });
        if (this.isHasChanges) {
            // should never happen
            throw new Error("Invalid Operation: the changes are left after the acceptChanges operation");
        }
    }
    // override
    rejectChanges(): void {
        if (!this.isHasChanges) {
            return;
        }
        const csh = this._changeCache;
        forEach(csh, (key) => {
            const item = csh[key];
            item._aspect.rejectChanges();
        });
        if (this.isHasChanges) {
            // should never happen
            throw new Error("Invalid Operation: the changes are left after the rejectChanges operation");
        }
    }
    deleteOnSubmit(item: TItem): void {
        item._aspect.deleteOnSubmit();
    }
    clear(): void {
        this._destroyQuery();
        super.clear();
    }
    createQuery(name: string): DataQuery<TItem, TObj> {
        const queryInfo = this.dbContext._getInternal().getQueryInfo(name);
        if (!queryInfo) {
            throw new Error(format(ERRS.ERR_QUERY_NAME_NOTFOUND, name));
        }
        return new DataQuery<TItem, TObj>(this, queryInfo);
    }
    toString(): string {
        return this.dbSetName;
    }
    get dbContext(): TDbContext {
        return this._dbContext;
    }
    get dbSetName(): string {
        return this._dbSetName;
    }
    get query(): DataQuery<TItem, TObj> {
        return this._query;
    }
    get isHasChanges(): boolean {
        return this._changeCount > 0;
    }
    get cacheSize(): number {
        const query = this._query;
        if (!!query && query.isCacheValid) {
            const dataCache = query._getInternal().getCache();
            return dataCache.cacheSize;
        }
        return 0;
    }
    get isSubmitOnDelete(): boolean {
        return this._isSubmitOnDelete;
    }
    set isSubmitOnDelete(v: boolean) {
        if (this._isSubmitOnDelete !== v) {
            this._isSubmitOnDelete = !!v;
            this.objEvents.raiseProp("isSubmitOnDelete");
        }
    }
    get isBusy(): boolean {
        return this.isLoading || this.dbContext.isSubmiting;
    }
}

export type TDbSet = DbSet;
