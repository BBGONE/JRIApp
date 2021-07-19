/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    IBaseObject, IIndexer, IErrorNotification, IValidationInfo, LocaleERRS,
    BaseObject, Utils
} from "jriapp_shared";
import { BINDING_MODE, BindTo } from "./consts";
import { TBindingInfo, TBindingOptions, IBinding, IConverter, IApplication } from "./int";
import { bootstrapper } from "./bootstrapper";

const utils = Utils, { isString, isUndefined, isNt, _undefined, isHasProp } = utils.check,
    { format } = utils.str, { getNewID, forEach, Indexer } = utils.core,
    sys = utils.sys, debug = utils.debug, log = utils.log,
    ERRS = LocaleERRS;
const { resolvePath, getPathParts, getErrorNotification, getProp, setProp } = sys, boot = bootstrapper;

sys.isBinding = (obj: any): boolean => {
    return (!!obj && obj instanceof Binding);
};

interface IBindingState {
    source: any;
    target: any;
}

const bindModeMap: IIndexer<BINDING_MODE> = {
    OneTime: BINDING_MODE.OneTime,
    OneWay: BINDING_MODE.OneWay,
    TwoWay: BINDING_MODE.TwoWay,
    BackWay: BINDING_MODE.BackWay
};

/**
 * Unresolved binding - property path is invalid or source is empty
 */
function fn_reportUnResolved(bindTo: BindTo, root: any, path: string, propName: string): void {
    if (!debug.isDebugging()) {
        return;
    }
    debug.checkStartDebugger();
    let msg = "Unresolved data binding for ";
    if (bindTo === BindTo.Source) {
        msg += " Source: ";
    } else {
        msg += " Target: ";
    }
    msg += "'" + root + "'";
    msg += ", property: '" + propName + "'";
    msg += ", binding path: '" + path + "'";

    log.error(msg);
}

/**
 * Maximum recursion exceeded
 */
function fn_reportMaxRec(bindTo: BindTo, src: any, tgt: any, spath: string, tpath: string): void {
    if (!debug.isDebugging()) {
        return;
    }
    debug.checkStartDebugger();
    let msg = "Maximum recursion exceeded for ";
    if (bindTo === BindTo.Source) {
        msg += "Updating Source value: ";
    } else {
        msg += "Updating Target value: ";
    }
    msg += " source:'" + src + "'";
    msg += ", target:'" + tgt + "'";
    msg += ", source path: '" + spath + "'";
    msg += ", target path: '" + tpath + "'";

    log.error(msg);
}

export function getBindingOptions(bindInfo: TBindingInfo, defTarget: IBaseObject, dataContext: any): TBindingOptions {
    const bindingOpts: TBindingOptions = {
        targetPath: null,
        sourcePath: null,
        target: null,
        source: null,
        isSourceFixed: false,
        mode: BINDING_MODE.OneWay,
        converter: null,
        param: null,
        isBind: false
    };
    const app = boot.app;
    let converter: IConverter;
    if (isString(bindInfo.converter)) {
        converter = app.getConverter(bindInfo.converter);
    } else {
        converter = bindInfo.converter;
    }

    const fixedSource = bindInfo.source, fixedTarget = bindInfo.target;

    if (!bindInfo.sourcePath && !!bindInfo.to) {
        bindingOpts.sourcePath = bindInfo.to;
    } else if (!!bindInfo.sourcePath) {
        bindingOpts.sourcePath = bindInfo.sourcePath;
    }

    if (!!bindInfo.targetPath) {
        bindingOpts.targetPath = bindInfo.targetPath;
    }

    if (!!bindInfo.param) {
        bindingOpts.param = bindInfo.param;
        bindingOpts.isBind = bindInfo.isBind;
    }

    if (!!bindInfo.mode) {
        bindingOpts.mode = bindModeMap[bindInfo.mode];
    }

    if (!!converter) {
        bindingOpts.converter = converter;
    }

    if (!fixedTarget) {
        bindingOpts.target = defTarget;
    } else {
        if (isString(fixedTarget)) {
            if (fixedTarget === "this") {
                bindingOpts.target = defTarget;
            } else {
                // if no fixed target, then target evaluation starts from this app
                bindingOpts.target = resolvePath(app, fixedTarget);
            }
        } else {
            bindingOpts.target = fixedTarget;
        }
    }

    if (!fixedSource) {
        // if source is not supplied use defaultSource parameter as source
        bindingOpts.source = dataContext;
    } else {
        bindingOpts.isSourceFixed = true;
        if (isString(fixedSource)) {
            if (fixedSource === "this") {
                bindingOpts.source = defTarget;
            } else {
                // source evaluation starts from this app
                bindingOpts.source = resolvePath(app, fixedSource);
            }
        } else {
            //this can happen when binding to inline literal source
            bindingOpts.source = fixedSource;
        }
    }

    return bindingOpts;
}

export class Binding extends BaseObject implements IBinding {
    private _state: IBindingState;
    private _mode: BINDING_MODE;
    private _converter: IConverter;
    // converter Param
    private _param: any;
    // Is converter Param the bind expression and needs to be evaluated?
    private _isBindParam: boolean;
    private _srcPath: string[];
    private _tgtPath: string[];
    private _srcFixed: boolean;
    private _pathItems: IIndexer<IBaseObject>;
    private _uniqueID: string;
    // the last object in the source path
    private _srcEnd: any;
    // the last object in the target path
    private _tgtEnd: any;
    private _source: any;
    private _target: IBaseObject;
    private _umask: number;
    private _cntUtgt: number;
    private _cntUSrc: number;

    constructor(options: TBindingOptions) {
        super();
        if (isString(options.mode)) {
            options.mode = bindModeMap[options.mode];
        }

        if (!isString(options.targetPath)) {
            debug.checkStartDebugger();
            throw new Error(format(ERRS.ERR_BIND_TGTPATH_INVALID, options.targetPath));
        }

        if (isNt(options.mode)) {
            debug.checkStartDebugger();
            throw new Error(format(ERRS.ERR_BIND_MODE_INVALID, options.mode));
        }

        if (!options.target) {
            throw new Error(ERRS.ERR_BIND_TARGET_EMPTY);
        }

        if (!sys.isBaseObj(options.target)) {
            throw new Error(ERRS.ERR_BIND_TARGET_INVALID);
        }

        // save the state - source and target, when the binding is disabled
        this._state = null;
        this._mode = options.mode;
        this._converter = !options.converter ? null : options.converter;
        this._param = options.param;
        this._isBindParam = !!options.isBind;
        this._srcPath = getPathParts(options.sourcePath);
        this._tgtPath = getPathParts(options.targetPath);
        if (this._tgtPath.length < 1) {
            throw new Error(format(ERRS.ERR_BIND_TGTPATH_INVALID, options.targetPath));
        }
        this._srcFixed = (!!options.isSourceFixed);
        this._pathItems = Indexer();
        this._uniqueID = getNewID("bnd");
        this._srcEnd = null;
        this._tgtEnd = null;
        this._source = null;
        this._target = null;
        // a mask indicating to update update the target or the source or both
        this._umask = 0;
        this._cntUtgt = 0;
        this._cntUSrc = 0;
        this._setTarget(options.target);
        this._setSource(options.source);
        this._update();

        const errNotif = getErrorNotification(this._srcEnd);
        if (!!errNotif && errNotif.getIsHasErrors()) {
            this._onSrcErrChanged(errNotif);
        }
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        const self = this;
        forEach(this._pathItems, (_key, old) => {
            self._cleanUp(old);
        });
        this._pathItems = Indexer();
        this._setSource(null);
        this._setTarget(null);
        this._state = null;
        this._converter = null;
        this._param = null;
        this._srcPath = null;
        this._tgtPath = null;
        this._srcEnd = null;
        this._tgtEnd = null;
        this._source = null;
        this._target = null;
        this._umask = 0;
        super.dispose();
    }
    private _update(): void {
        const umask = this._umask, MAX_REC = 3;
        let flag = 0;
        this._umask = 0;

        if (this._mode === BINDING_MODE.BackWay) {
            if (!!(umask & 1)) {
                flag = 1;
            }
        } else {
            if (!!(umask & 2)) {
                flag = 2;
            } else if (!!(umask & 1) && (this._mode === BINDING_MODE.TwoWay)) {
                flag = 1;
            }
        }

        switch (flag) {
            case 1:
                if (this._cntUtgt === 0) {
                    if (this._cntUSrc < MAX_REC) {
                        this._cntUSrc += 1;
                        try {
                            this.updateSource();
                        } finally {
                            this._cntUSrc -= 1;
                        }
                    } else {
                        fn_reportMaxRec(BindTo.Source, this._source, this._target, this._srcPath.join("."), this._tgtPath.join("."));
                    }
                }
                break;
            case 2:
                if (this._cntUSrc === 0) {
                    if (this._cntUtgt < MAX_REC) {
                        this._cntUtgt += 1;
                        try {
                            this.updateTarget();
                        } finally {
                            this._cntUtgt -= 1;
                        }
                    } else {
                        fn_reportMaxRec(BindTo.Target, this._source, this._target, this._srcPath.join("."), this._tgtPath.join("."));
                    }
                }
                break;
        }
    }
    private _onSrcErrChanged(errNotif: IErrorNotification): void {
        let errors: IValidationInfo[] = [];
        const tgt = this._tgtEnd, src = this._srcEnd, srcPath = this._srcPath;
        if (sys.isValidatable(tgt)) {
            if (!!src && srcPath.length > 0) {
                const prop = srcPath[srcPath.length - 1];
                errors = errNotif.getFieldErrors(prop);
            }
            tgt.validationErrors = errors;
        }
    }
    private _getTgtChangedFn(self: Binding, obj: any, prop: string, restPath: string[], lvl: number): () => void {
        return () => {
            const val = getProp(obj, prop);
            if (restPath.length > 0) {
                self._setPathItem(null, BindTo.Target, lvl, restPath);
            }
            // bind and trigger target update
            self._parseTgt(val, restPath, lvl);
            self._update();
        };
    }
    private _getSrcChangedFn(self: Binding, obj: any, prop: string, restPath: string[], lvl: number): () => void {
        return () => {
            const val = getProp(obj, prop);
            if (restPath.length > 0) {
                self._setPathItem(null, BindTo.Source, lvl, restPath);
            }
            self._parseSrc(val, restPath, lvl);
            self._update();
        };
    }
    private _addOnPropChanged(obj: IBaseObject, prop: string, fn: (s: any, a: any) => void) {
        obj.objEvents.onProp(prop, fn, this._uniqueID);
        // for PropertyBag also listen for all property changes notification
        if (prop !== "[*]" && sys.isPropBag(obj)) {
            obj.objEvents.onProp("[*]", fn, this._uniqueID);
        }
    }
    private _parseSrc(obj: any, path: string[], lvl: number): void {
        const self = this;
        self._srcEnd = null;

        if (sys.isBaseObj(obj) && obj.getIsStateDirty()) {
            return;
        }

        if (path.length === 0) {
            self._srcEnd = obj;
        } else {
            self._parseSrc2(obj, path, lvl);
        }

        if (self._mode === BINDING_MODE.BackWay) {
            if (!!self._srcEnd) {
                self._umask |= 1;
            }
        } else {
            if (!!self._tgtEnd) {
                self._umask |= 2;
            }
        }
    }
    private _parseSrc2(obj: any, path: string[], lvl: number): void {
        const self = this, isBaseObj = sys.isBaseObj(obj);

        if (isBaseObj) {
            if ((<IBaseObject>obj).getIsStateDirty()) {
                return;
            }
            /*
            (<IBaseObject>obj).addOnDisposed(self._onSrcDestroyed, self._uniqueID, self);
            */
            self._setPathItem(obj, BindTo.Source, lvl, path);
        }

        if (path.length > 1) {
            if (isBaseObj) {
                const fnChange = self._getSrcChangedFn(self, obj, path[0], path.slice(1), lvl + 1);
                self._addOnPropChanged(obj, path[0], fnChange);
            }

            if (!!obj) {
                const nextObj = getProp(obj, path[0]);
                if (!!nextObj) {
                    self._parseSrc2(nextObj, path.slice(1), lvl + 1);
                } else if (isUndefined(nextObj)) {
                    fn_reportUnResolved(BindTo.Source, self.source, self._srcPath.join("."), path[0]);
                }
            }
            return;
        }

        if (!!obj && path.length === 1) {
            const isValidProp =  (!debug.isDebugging() ? true : (isBaseObj ? (<IBaseObject>obj).isHasProp(path[0]) : isHasProp(obj, path[0])));

            if (isValidProp) {
                const updateOnChange = isBaseObj && (self._mode === BINDING_MODE.OneWay || self._mode === BINDING_MODE.TwoWay);
                if (updateOnChange) {
                    const fnUpd = () => {
                        if (!!self._tgtEnd) {
                            self._umask |= 2;
                            self._update();
                        }
                    };
                    self._addOnPropChanged(obj, path[0], fnUpd);
                }

                const errNotif = getErrorNotification(obj);
                if (!!errNotif) {
                    errNotif.addOnErrorsChanged(self._onSrcErrChanged, self._uniqueID, self);
                }
                self._srcEnd = obj;
            } else {
                fn_reportUnResolved(BindTo.Source, self.source, self._srcPath.join("."), path[0]);
            }
        }
    }
    private _parseTgt(obj: any, path: string[], lvl: number): void {
        const self = this;
        self._tgtEnd = null;
        if (sys.isBaseObj(obj) && obj.getIsStateDirty()) {
            return;
        }

        if (path.length === 0) {
            self._tgtEnd = obj;
        } else {
            self._parseTgt2(obj, path, lvl);
        }

        if (self._mode === BINDING_MODE.BackWay) {
            if (!!self._srcEnd) {
                this._umask |= 1;
            }
        } else {
            // if new target then update the target (not the source!)
            if (!!self._tgtEnd) {
                this._umask |= 2;
            }
        }
    }
    private _parseTgt2(obj: any, path: string[], lvl: number): void {
        const self = this, isBaseObj = sys.isBaseObj(obj);

        if (isBaseObj) {
            if ((<IBaseObject>obj).getIsStateDirty()) {
                return;
            }
            /*
            (<IBaseObject>obj).addOnDisposed(self._onTgtDestroyed, self._uniqueID, self);
            */
            self._setPathItem(obj, BindTo.Target, lvl, path);
        }

        if (path.length > 1) {
            if (isBaseObj) {
                const fnChange = self._getTgtChangedFn(self, obj, path[0], path.slice(1), lvl + 1);
                self._addOnPropChanged(obj, path[0], fnChange);
            }

            if (!!obj) {
                const nextObj = getProp(obj, path[0]);
                if (!!nextObj) {
                    self._parseTgt2(nextObj, path.slice(1), lvl + 1);
                } else if (isUndefined(nextObj)) {
                    fn_reportUnResolved(BindTo.Target, self.target, self._tgtPath.join("."), path[0]);
                }
            }
            return;
        }

        if (!!obj && path.length === 1) {
            const isValidProp = (!debug.isDebugging() ? true : (isBaseObj ? (<IBaseObject>obj).isHasProp(path[0]) : isHasProp(obj, path[0])));

            if (isValidProp) {
                const updateOnChange = isBaseObj && (self._mode === BINDING_MODE.TwoWay || self._mode === BINDING_MODE.BackWay);
                if (updateOnChange) {
                    const fnUpd = () => {
                        if (!!self._srcEnd) {
                            self._umask |= 1;
                            self._update();
                        }
                    };
                    self._addOnPropChanged(obj, path[0], fnUpd);
                }
                self._tgtEnd = obj;
            } else {
                fn_reportUnResolved(BindTo.Target, self.target, self._tgtPath.join("."), path[0]);
            }
        }
    }
    private _setPathItem(newObj: IBaseObject, bindingTo: BindTo, lvl: number, path: string[]): void {
        const len = lvl + path.length;
        for (let i = lvl; i < len; i += 1) {
            const key = (bindingTo === BindTo.Source) ? ("s" + i) : ((bindingTo === BindTo.Target) ? ("t" + i) : null);
            if (!key) {
                throw new Error(format(ERRS.ERR_PARAM_INVALID, "bindingTo", bindingTo));
            }

            const oldObj = this._pathItems[key];
            if (!!oldObj) {
                this._cleanUp(oldObj);
                delete this._pathItems[key];
            }

            if (!!newObj && i === lvl) {
                this._pathItems[key] = newObj;
            }
        }
    }
    private _cleanUp(obj: IBaseObject): void {
        if (!!obj) {
            obj.objEvents.offNS(this._uniqueID);
            const errNotif = getErrorNotification(obj);
            if (!!errNotif) {
                errNotif.offOnErrorsChanged(this._uniqueID);
            }
        }
    }
    /*
    private _onTgtDestroyed(sender: any) {
        const self = this;
        if (self.getIsStateDirty()) {
            return;
        }

        if (sender === self.target) {
            this._setTarget(null);
            this._update();
        } else {
            self._setPathItem(null, BindTo.Target, 0, self._tgtPath);
            utils.queue.enque(() => {
                if (self.getIsStateDirty()) {
                    return;
                }
                // rebind after the target is destroyed
                self._parseTgt(self.target, self._tgtPath, 0);
                self._update();
            });
        }
    }
    private _onSrcDestroyed(sender: any) {
        const self = this;
        if (self.getIsStateDirty()) {
            return;
        }

        if (sender === self.source) {
            self._setSource(null);
            self._update();
        } else {
            self._setPathItem(null, BindTo.Source, 0, self._srcPath);
            utils.queue.enque(() => {
                if (self.getIsStateDirty()) {
                    return;
                }
                // rebind after the source is destroyed
                self._parseSrc(self.source, self._srcPath, 0);
                self._update();
            });
        }
    }
    */
    protected _setTarget(value: any): boolean {
        if (!!this._state) {
            this._state.target = value;
            return false;
        }

        if (this._target !== value) {
            if (!!this._tgtEnd && !(this._mode === BINDING_MODE.BackWay)) {
                this._cntUtgt += 1;
                try {
                    this.targetValue = null;
                } finally {
                    this._cntUtgt -= 1;
                    // sanity check
                    if (this._cntUtgt < 0) {
                        throw new Error("Invalid operation: this._cntUtgt = " + this._cntUtgt);
                    }
                }
            }
            this._setPathItem(null, BindTo.Target, 0, this._tgtPath);
            if (!!value && !sys.isBaseObj(value)) {
                throw new Error(ERRS.ERR_BIND_TARGET_INVALID);
            }
            this._target = value;
            this._parseTgt(this._target, this._tgtPath, 0);
            if (!!this._target && !this._tgtEnd) {
                throw new Error(format(ERRS.ERR_BIND_TGTPATH_INVALID, this._tgtPath.join(".")));
            }

            return true;
        } else {
            return false;
        }
    }
    protected _setSource(value: any): boolean {
        if (!!this._state) {
            this._state.source = value;
            return false;
        }

        if (this._source !== value) {
            if (!!this._srcEnd && (this._mode === BINDING_MODE.BackWay)) {
                this._cntUSrc += 1;
                try {
                    this.sourceValue = null;
                } finally {
                    this._cntUSrc -= 1;
                    // sanity check
                    if (this._cntUSrc < 0) {
                        throw new Error("Invalid Operation: this._cntUSrc = " + this._cntUSrc);
                    }
                }
            }
            this._setPathItem(null, BindTo.Source, 0, this._srcPath);
            this._source = value;
            this._parseSrc(this._source, this._srcPath, 0);
            return true
        } else {
            return false;
        }
    }
    updateTarget(): void {
        if (this.getIsStateDirty()) {
            return;
        }
        try {
            if (!this._converter) {
                this.targetValue = this.sourceValue;
            } else {
                this.targetValue = this._converter.convertToTarget(this.sourceValue, this.param, this.source);
            }
        } catch (ex) {
            utils.err.reThrow(ex, this.handleError(ex, this));
        }
    }
    updateSource(): void {
        if (this.getIsStateDirty()) {
            return;
        }
        try {
            if (!this._converter) {
                this.sourceValue = this.targetValue;
            } else {
                this.sourceValue = this._converter.convertToSource(this.targetValue, this.param, this.source);
            }
        } catch (ex) {
            if (!sys.isValidationError(ex) || !sys.isValidatable(this._tgtEnd)) {
                // BaseElView is notified about errors in _onSrcErrChanged event handler
                // err_notif.addOnErrorsChanged(self._onSrcErrChanged, self._uniqueID, self);
                // we only need to rethrow in other cases:
                // 1) when target is not a IValidatable
                // 2) when error is not a ValidationError
                utils.err.reThrow(ex, this.handleError(ex, this));
            }
        }
    }
    toString(): string {
        return "Binding";
    }
    get uniqueID(): string {
        return this._uniqueID;
    }
    get target(): IBaseObject {
        return this._target;
    }
    set target(v: IBaseObject) {
        if (this._setTarget(v)) {
            this._update();
        }
    }
    get source(): any {
        return this._source;
    }
    set source(v: any) {
        if (this._setSource(v)) {
            this._update();
        }
    }
    get targetPath(): string[] {
        return this._tgtPath;
    }
    get sourcePath(): string[] {
        return this._srcPath;
    }
    get sourceValue():any {
        let res: any = null;
        if (this._srcPath.length === 0) {
            res = this._srcEnd;
        } else if (!!this._srcEnd) {
            const prop = this._srcPath[this._srcPath.length - 1];
            res = getProp(this._srcEnd, prop);
        }
        return res;
    }
    set sourceValue(v: any) {
        if (this._srcPath.length === 0 || !this._srcEnd || v === _undefined) {
            return;
        }
        const prop = this._srcPath[this._srcPath.length - 1];
        setProp(this._srcEnd, prop, v);
    }
    get targetValue(): any {
        let res: any = null;
        if (this._tgtPath.length === 0) {
            res = this._tgtEnd;
        } else if (!!this._tgtEnd) {
            const prop = this._tgtPath[this._tgtPath.length - 1];
            res = getProp(this._tgtEnd, prop);
        }
        return res;
    }
    set targetValue(v: any) {
        if (this._tgtPath.length === 0 || !this._tgtEnd || v === _undefined) {
            return;
        }
        const prop = this._tgtPath[this._tgtPath.length - 1];
        setProp(this._tgtEnd, prop, v);
    }
    get isSourceFixed(): boolean {
        return this._srcFixed;
    }
    get mode(): BINDING_MODE {
        return this._mode;
    }
    get converter(): IConverter {
        return this._converter;
    }
    get param(): any {
        if (this._isBindParam) {
            if (isNt(this._param)) {
                return this._param;
            } 
            const bindparts = <string[]>this._param;
            let source = this.source;
            if (bindparts.length > 1) {
                //resolve source (second path relative to the application in the array)
                source = resolvePath(this.app, bindparts[1]);
            }
            return resolvePath(source, bindparts[0]);
        } else {
            return this._param;
        }
    }
    get isDisabled(): boolean {
        return !!this._state;
    }
    set isDisabled(v: boolean) {
        let s: IBindingState;
        v = !!v;
        if (this.isDisabled !== v) {
            if (v) {
                // going to disabled state
                s = { source: this._source, target: this._target };
                try {
                    this.target = null;
                    this.source = null;
                } finally {
                    this._state = s;
                }
            } else {
                // restoring from disabled state
                s = this._state;
                this._state = null;
                this._setTarget(s.target);
                this._setSource(s.source);
                this._update();
            }
        }
    }
    get app(): IApplication {
        return boot.app;
    }
}
