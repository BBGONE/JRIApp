declare module "jriapp_shared/consts" {
    export const enum DEBUG_LEVEL {
        NONE = 0,
        NORMAL = 1,
        HIGH = 2
    }
    export const enum BRACKETS {
        ROUND = 0,
        CURLY = 1,
        SQUARE = 2
    }
    export const enum SIDE {
        BOTH = 0,
        LEFT = 1,
        RIGHT = 2
    }
    export const APP_NAME = "app";
    export const DUMY_ERROR = "DUMMY_ERROR";
}
declare module "jriapp_shared/utils/ipromise" {
    export const enum PromiseState {
        Pending = 0,
        ResolutionInProgress = 1,
        Resolved = 2,
        Rejected = 3
    }
    export interface IPromiseState {
        state(): PromiseState;
    }
    export interface ITaskQueue {
        enque(task: () => void): number;
        cancel(taskId: number): void;
    }
    export type IThenable<T> = PromiseLike<T>;
    export interface IPromise<T = any> {
        then<TResult1 = T, TResult2 = never>(onFulfilled?: ((value: T) => TResult1 | IThenable<TResult1>) | undefined | null, onRejected?: ((reason: any) => TResult2 | IThenable<TResult2>) | undefined | null): IPromise<TResult1 | TResult2>;
        catch<TResult = never>(onRejected?: ((reason: any) => TResult | IThenable<TResult>) | undefined | null): IPromise<T | TResult>;
        finally(onFinally: () => void): IPromise<T>;
    }
    export interface IVoidPromise extends IPromise<void> {
    }
    export interface IStatefulPromise<T = any> extends IPromiseState {
        then<TResult1 = T, TResult2 = never>(onFulfilled?: ((value: T) => TResult1 | IThenable<TResult1>) | undefined | null, onRejected?: ((reason: any) => TResult2 | IThenable<TResult2>) | undefined | null): IStatefulPromise<TResult1 | TResult2>;
        catch<TResult = never>(onRejected?: ((reason: any) => TResult | IThenable<TResult>) | undefined | null): IStatefulPromise<T | TResult>;
        finally(onFinally: () => void): IStatefulPromise<T>;
    }
    export interface ICancellationToken {
        register(fn: (reason?: string) => void): void;
        readonly isCancelled: boolean;
    }
    export interface ICancellationTokenSource extends ICancellationToken {
        cancel(reason?: string): void;
        readonly token: ICancellationToken;
    }
    export interface IAbortable {
        abort(reason?: string): void;
    }
    export interface IAbortablePromise<T = any> extends IStatefulPromise<T>, IAbortable {
    }
    export interface IStatefulDeferred<T = any> extends IPromiseState {
        resolve(value?: T | PromiseLike<T> | IThenable<T> | IPromise<T> | IStatefulPromise<T>): IStatefulPromise<T>;
        reject(error?: any): IStatefulPromise<T>;
        promise(): IStatefulPromise<T>;
    }
    export type IDeferred<T = any> = IStatefulDeferred<T>;
    export type TResolved<T> = T | PromiseLike<T> | IThenable<T> | IPromise<T> | IStatefulPromise<T>;
}
declare module "jriapp_shared/int" {
    import { DEBUG_LEVEL } from "jriapp_shared/consts";
    import { IVoidPromise } from "jriapp_shared/utils/ipromise";
    export interface IConfig {
        debugLevel?: DEBUG_LEVEL;
    }
    export const Config: IConfig;
    export let DebugLevel: DEBUG_LEVEL;
    export type TEventHandler<T = any, U = any> = (sender: T, args: U) => void;
    export type TErrorArgs = {
        error: any;
        source: any;
        isHandled: boolean;
    };
    export type TErrorHandler<T = any> = (sender: T, args: TErrorArgs) => void;
    export type TPropChangedHandler<T = any> = (sender: T, args: {
        property: string;
    }) => void;
    export type TFunc<T = any> = {
        (...args: any[]): T;
    };
    export type TAnyConstructor<T> = new (...args: any[]) => T;
    export interface IDisposable {
        dispose(): void;
        getIsDisposed(): boolean;
    }
    export interface IIndexer<T> {
        [name: string]: T;
    }
    export interface IErrorHandler {
        handleError(error: any, source: any): boolean;
    }
    export interface IPropertyBag extends IBaseObject {
        getProp(name: string): any;
        setProp(name: string, val: any): void;
        isPropertyBag: boolean;
    }
    export const enum TPriority {
        Normal = 0,
        AboveNormal = 1,
        High = 2
    }
    export type PropertyNames<T> = keyof T | "*" | "[*]";
    export interface IEvents<T = any> {
        canRaise(name: string): boolean;
        on(name: string, handler: TEventHandler<T, any>, nmspace?: string, context?: object, priority?: TPriority): void;
        off(name?: string, nmspace?: string): void;
        offNS(nmspace?: string): void;
        raise(name: string, args: any): void;
        raiseProp(name: PropertyNames<T>): void;
        onProp(prop: PropertyNames<T>, handler: TPropChangedHandler<T>, nmspace?: string, context?: object, priority?: TPriority): void;
        offProp(prop?: PropertyNames<T>, nmspace?: string): void;
    }
    export interface IBaseObject extends IErrorHandler, IDisposable {
        getIsStateDirty(): boolean;
        isHasProp(prop: string): boolean;
        readonly objEvents: IObjectEvents;
    }
    export interface IObjectEvents<T = any> extends IEvents<T> {
        addOnError(handler: TErrorHandler<T>, nmspace?: string, context?: object, priority?: TPriority): void;
        offOnError(nmspace?: string): void;
        addOnDisposed(handler: TEventHandler<T, any>, nmspace?: string, context?: object, priority?: TPriority): void;
        offOnDisposed(nmspace?: string): void;
        readonly owner: T;
    }
    export interface IEditable extends IBaseObject {
        beginEdit(): boolean;
        endEdit(): boolean;
        cancelEdit(): boolean;
        readonly isEditing: boolean;
    }
    export interface ISubmittable extends IBaseObject {
        submitChanges(): IVoidPromise;
        rejectChanges(): void;
        readonly isCanSubmit: boolean;
    }
    export interface IValidationInfo {
        readonly fieldName: string;
        errors: string[];
    }
    export interface IValidatable {
        validationErrors: IValidationInfo[];
    }
    export interface IValidationError {
        readonly item: any;
        readonly validations: IValidationInfo[];
    }
    export interface IErrorNotification extends IBaseObject {
        getIsHasErrors(): boolean;
        addOnErrorsChanged(fn: TEventHandler, nmspace?: string, context?: any): void;
        offOnErrorsChanged(nmspace?: string): void;
        getFieldErrors(fieldName: string): IValidationInfo[];
        getAllErrors(): IValidationInfo[];
        getIErrorNotification(): IErrorNotification;
    }
    export interface IWeakMap {
        set(key: any, value: any): IWeakMap;
        get(key: any): any;
        delete(key: any): boolean;
        has(key: any): boolean;
    }
    export interface WeakMapConstructor {
        new (): IWeakMap;
    }
}
declare module "jriapp_shared/utils/checks" {
    import { IThenable } from "jriapp_shared/utils/ipromise";
    export class Checks {
        static readonly _undefined: undefined;
        static isHasProp(obj: any, prop: string): boolean;
        static isNull(a: any): a is void;
        static isUndefined(a: any): a is void;
        static readonly isNt: (a: any) => a is void;
        static isObject(a: any): boolean;
        static isPlainObject(a: any): boolean;
        static readonly isString: (a: any) => a is string;
        static readonly isFunc: (a: any) => a is (...args: any[]) => any;
        static isBoolean(a: any): a is boolean;
        static isDate(a: any): a is Date;
        static readonly isNumber: (a: any) => a is Number;
        static isNumeric(a: any): a is Number;
        static isBoolString(a: any): boolean;
        static isGuid(a: any): boolean;
        static isArray<T>(a: any): a is Array<T>;
        static isThenable(a: any): a is IThenable<any>;
    }
}
declare module "jriapp_shared/utils/strutils" {
    import { SIDE } from "jriapp_shared/consts";
    export class StringUtils {
        static endsWith(str: string, suffix: string): boolean;
        static startsWith(str: string, prefix: string): boolean;
        static fastTrim(str: string): string;
        static trim(str: string, chars?: string[], side?: SIDE): string;
        static ltrim(str: string, chars?: string[]): string;
        static rtrim(str: string, chars?: string[]): string;
        static format(formatStr: string, ...args: any[]): string;
        static formatNumber(num: any, decimals?: number, decPoint?: string, thousandsSep?: string): string;
        static stripNonNumeric(str: string): string;
        static padLeft(val: string, len: number, pad: string): string;
        static fastPadLeft(val: string, pad: string): string;
        static trimQuotes(val: string): string;
        static trimBrackets(val: string): string;
    }
}
declare module "jriapp_shared/utils/coreutils" {
    import { IIndexer } from "jriapp_shared/int";
    import { Checks } from "jriapp_shared/utils/checks";
    export class CoreUtils {
        static getNewID(prefix?: string): string;
        static readonly getTimeZoneOffset: () => number;
        static readonly hasProp: typeof Checks.isHasProp;
        static setValue(root: any, namePath: string, val: any, checkOverwrite?: boolean): void;
        static getValue(root: any, namePath: string): any;
        static removeValue(root: any, namePath: string): any;
        static uuid(len?: number, radix?: number): string;
        static parseBool(a: any): boolean;
        static round(num: number, decimals: number): number;
        static readonly clone: (obj: any, target?: any) => any;
        static merge<S, T>(source: S, target?: T): S & T;
        static readonly extend: <T, U>(target: T, ...source: U[]) => T & U;
        static memoize<R>(fn: () => R): () => R;
        static memoize<T1, R>(fn: (A1: T1) => R): (A1: T1) => R;
        static memoize<T1, T2, R>(fn: (A1: T1, A2: T2) => R): (A1: T1, A2: T2) => R;
        static memoize<T1, T2, T3, R>(fn: (A1: T1, A2: T2, A3: T3) => R): (A1: T1, A2: T2, A3: T3) => R;
        static readonly Indexer: <T = any>() => IIndexer<T>;
        static forEach<T>(map: IIndexer<T>, fn: (name: string, val: T) => void): void;
        static toArray<T>(map: IIndexer<T>): T[];
        static readonly assignStrings: <T extends U, U extends IIndexer<any>>(target: T, source: U) => T;
        static pipe<T, R>(fn1: (...args: T[]) => R, ...fns: Array<(a: R) => R>): (...args: T[]) => R;
        static compose<R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>): (a: R) => R;
    }
}
declare module "jriapp_shared/lang" {
    import { IIndexer } from "jriapp_shared/int";
    export function assign<T extends U, U extends IIndexer<any>>(target: T, source: U): T;
    export interface _IErrors extends IIndexer<string> {
        ERR_OBJ_ALREADY_REGISTERED: string;
        ERR_OPTIONS_ALREADY_REGISTERED: string;
        ERR_APP_NEED_JQUERY: string;
        ERR_ASSERTION_FAILED: string;
        ERR_BINDING_CONTENT_NOT_FOUND: string;
        ERR_DBSET_READONLY: string;
        ERR_DBSET_INVALID_FIELDNAME: string;
        ERR_FIELD_READONLY: string;
        ERR_FIELD_ISNOT_NULLABLE: string;
        ERR_FIELD_WRONG_TYPE: string;
        ERR_FIELD_MAXLEN: string;
        ERR_FIELD_DATATYPE: string;
        ERR_FIELD_REGEX: string;
        ERR_FIELD_RANGE: string;
        ERR_EVENT_INVALID: string;
        ERR_EVENT_INVALID_FUNC: string;
        ERR_MODULE_NOT_REGISTERED: string;
        ERR_MODULE_ALREDY_REGISTERED: string;
        ERR_PROP_NAME_EMPTY: string;
        ERR_PROP_NAME_INVALID: string;
        ERR_GLOBAL_SINGLTON: string;
        ERR_TEMPLATE_ALREADY_REGISTERED: string;
        ERR_TEMPLATE_NOTREGISTERED: string;
        ERR_TEMPLATE_GROUP_NOTREGISTERED: string;
        ERR_TEMPLATE_HAS_NO_ID: string;
        ERR_OPTIONS_HAS_NO_ID: string;
        ERR_CONVERTER_NOTREGISTERED: string;
        ERR_OPTIONS_NOTREGISTERED: string;
        ERR_JQUERY_DATEPICKER_NOTFOUND: string;
        ERR_PARAM_INVALID: string;
        ERR_PARAM_INVALID_TYPE: string;
        ERR_KEY_IS_EMPTY: string;
        ERR_KEY_IS_NOTFOUND: string;
        ERR_ITEM_IS_ATTACHED: string;
        ERR_ITEM_IS_DETACHED: string;
        ERR_ITEM_IS_NOTFOUND: string;
        ERR_ITEM_NAME_COLLISION: string;
        ERR_DICTKEY_IS_NOTFOUND: string;
        ERR_DICTKEY_IS_EMPTY: string;
        ERR_CONV_INVALID_DATE: string;
        ERR_CONV_INVALID_NUM: string;
        ERR_QUERY_NAME_NOTFOUND: string;
        ERR_QUERY_BETWEEN: string;
        ERR_QUERY_OPERATOR_INVALID: string;
        ERR_OPER_REFRESH_INVALID: string;
        ERR_CALC_FIELD_DEFINE: string;
        ERR_CALC_FIELD_SELF_DEPEND: string;
        ERR_DOMAIN_CONTEXT_INITIALIZED: string;
        ERR_DOMAIN_CONTEXT_NOT_INITIALIZED: string;
        ERR_SVC_METH_PARAM_INVALID: string;
        ERR_DB_LOAD_NO_QUERY: string;
        ERR_DBSET_NAME_INVALID: string;
        ERR_APP_NAME_NOT_UNIQUE: string;
        ERR_ELVIEW_NOT_REGISTERED: string;
        ERR_ELVIEW_NOT_CREATED: string;
        ERR_BIND_TARGET_EMPTY: string;
        ERR_BIND_TGTPATH_INVALID: string;
        ERR_BIND_MODE_INVALID: string;
        ERR_BIND_TARGET_INVALID: string;
        ERR_EXPR_BRACES_INVALID: string;
        ERR_APP_SETUP_INVALID: string;
        ERR_GRID_DATASRC_INVALID: string;
        ERR_COLLECTION_CHANGETYPE_INVALID: string;
        ERR_GRID_COLTYPE_INVALID: string;
        ERR_PAGER_DATASRC_INVALID: string;
        ERR_STACKPNL_DATASRC_INVALID: string;
        ERR_STACKPNL_TEMPLATE_INVALID: string;
        ERR_LISTBOX_DATASRC_INVALID: string;
        ERR_DATAFRM_DCTX_INVALID: string;
        ERR_DCTX_HAS_NO_FIELDINFO: string;
        ERR_TEMPLATE_ID_INVALID: string;
        ERR_ITEM_DELETED_BY_ANOTHER_USER: string;
        ERR_ACCESS_DENIED: string;
        ERR_CONCURRENCY: string;
        ERR_VALIDATION: string;
        ERR_SVC_VALIDATION: string;
        ERR_SVC_ERROR: string;
        ERR_UNEXPECTED_SVC_ERROR: string;
        ERR_ASSOC_NAME_INVALID: string;
        ERR_DATAVIEW_DATASRC_INVALID: string;
        ERR_DATAVIEW_FILTER_INVALID: string;
    }
    export type IErrors = Partial<_IErrors>;
    export interface _IPagerText extends IIndexer<string> {
        firstText: string;
        lastText: string;
        previousText: string;
        nextText: string;
        pageInfo: string;
        firstPageTip: string;
        prevPageTip: string;
        nextPageTip: string;
        lastPageTip: string;
        showingTip: string;
        showTip: string;
    }
    export type IPagerText = Partial<_IPagerText>;
    export interface _IValidateText extends IIndexer<string> {
        errorInfo: string;
        errorField: string;
    }
    export type IValidateText = Partial<_IValidateText>;
    export interface _IText extends IIndexer<string> {
        txtEdit: string;
        txtAddNew: string;
        txtDelete: string;
        txtCancel: string;
        txtOk: string;
        txtRefresh: string;
        txtAskDelete: string;
        txtSubmitting: string;
        txtSave: string;
        txtClose: string;
        txtField: string;
    }
    export type IText = Partial<_IText>;
    export interface ILocaleText extends IIndexer<any> {
        PAGER: IPagerText;
        VALIDATE: IValidateText;
        TEXT: IText;
    }
    export let ERRS: IErrors;
    export let STRS: ILocaleText;
}
declare module "jriapp_shared/collection/const" {
    export const enum DATE_CONVERSION {
        None = 0,
        ServerLocalToClientLocal = 1,
        UtcToClientLocal = 2
    }
    export const enum DATA_TYPE {
        None = 0,
        String = 1,
        Bool = 2,
        Integer = 3,
        Decimal = 4,
        Float = 5,
        DateTime = 6,
        Date = 7,
        Time = 8,
        Guid = 9,
        Binary = 10
    }
    export const enum FIELD_TYPE {
        None = 0,
        ClientOnly = 1,
        Calculated = 2,
        Navigation = 3,
        RowTimeStamp = 4,
        Object = 5,
        ServerCalculated = 6
    }
    export const enum SORT_ORDER {
        ASC = 0,
        DESC = 1
    }
    export const enum FILTER_TYPE {
        Equals = 0,
        Between = 1,
        StartsWith = 2,
        EndsWith = 3,
        Contains = 4,
        Gt = 5,
        Lt = 6,
        GtEq = 7,
        LtEq = 8,
        NotEq = 9
    }
    export const enum COLL_CHANGE_TYPE {
        Remove = 0,
        Add = 1,
        Reset = 2,
        Remap = 3
    }
    export const enum COLL_CHANGE_REASON {
        None = 0,
        PageChange = 1,
        Sorting = 2,
        Refresh = 3
    }
    export const enum COLL_CHANGE_OPER {
        None = 0,
        Fill = 1,
        AddNew = 2,
        Remove = 3,
        Commit = 4,
        Sort = 5
    }
    export const enum ITEM_STATUS {
        None = 0,
        Added = 1,
        Updated = 2,
        Deleted = 3
    }
    export const enum VALS_VERSION {
        Current = 0,
        Temporary = 1,
        Original = 2
    }
}
declare module "jriapp_shared/collection/int" {
    import { DATE_CONVERSION, DATA_TYPE, SORT_ORDER, FIELD_TYPE, COLL_CHANGE_OPER, COLL_CHANGE_REASON, COLL_CHANGE_TYPE, ITEM_STATUS } from "jriapp_shared/collection/const";
    import { IPromise } from "jriapp_shared/utils/ipromise";
    import { IBaseObject, IErrorNotification, IEditable, ISubmittable, TEventHandler, TPropChangedHandler, IValidationInfo, TPriority, IIndexer } from "jriapp_shared/int";
    export const PROP_NAME: {
        isEditing: string;
        currentItem: string;
        count: string;
        totalCount: string;
        pageCount: string;
        pageSize: string;
        pageIndex: string;
        isUpdating: string;
        isLoading: string;
        isRefreshing: string;
    };
    export const enum ITEM_EVENTS {
        errors_changed = "errors_changed",
        destroyed = "destroyed"
    }
    export interface IFieldInfo {
        fieldName: string;
        isPrimaryKey: number;
        dataType: DATA_TYPE;
        isNullable: boolean;
        isReadOnly: boolean;
        isAutoGenerated: boolean;
        isNeedOriginal: boolean;
        maxLength: number;
        dateConversion: DATE_CONVERSION;
        allowClientDefault: boolean;
        range: string;
        regex: string;
        fieldType: FIELD_TYPE;
        dependentOn: string;
        nested: IFieldInfo[];
        dependents?: string[];
        fullName?: string;
    }
    export interface ICollectionOptions {
        enablePaging: boolean;
        pageSize: number;
    }
    export interface IPermissions {
        canAddRow: boolean;
        canEditRow: boolean;
        canDeleteRow: boolean;
        canRefreshRow: boolean;
    }
    export interface IItemAspect<TItem extends ICollectionItem, TObj extends IIndexer<any>> extends IBaseObject, IErrorNotification, IEditable, ISubmittable {
        getFieldInfo(fieldName: string): IFieldInfo;
        getFieldNames(): string[];
        getErrorString(): string;
        deleteItem(): boolean;
        _setKey(v: string): void;
        _setIsAttached(v: boolean): void;
        raiseErrorsChanged(): void;
        readonly vals: TObj;
        readonly item: TItem;
        readonly key: string;
        readonly coll: ICollection<TItem>;
        readonly status: ITEM_STATUS;
        readonly isUpdating: boolean;
        readonly isEditing: boolean;
        readonly isCanSubmit: boolean;
        readonly isHasChanges: boolean;
        readonly isNew: boolean;
        readonly isDeleted: boolean;
        readonly isEdited: boolean;
        readonly isDetached: boolean;
    }
    export interface ICollectionItem extends IBaseObject {
        readonly _aspect: IItemAspect<ICollectionItem, any>;
        readonly _key: string;
    }
    export interface ICollChangedArgs<TItem extends ICollectionItem> {
        changeType: COLL_CHANGE_TYPE;
        reason: COLL_CHANGE_REASON;
        oper: COLL_CHANGE_OPER;
        items: TItem[];
        old_key?: string;
        new_key?: string;
    }
    export interface ICollFillArgs<TItem extends ICollectionItem> {
        reason: COLL_CHANGE_REASON;
        items: TItem[];
        newItems: TItem[];
    }
    export interface ICollValidateFieldArgs<TItem extends ICollectionItem> {
        readonly item: TItem;
        readonly fieldName: string;
        errors: string[];
    }
    export interface ICollValidateItemArgs<TItem extends ICollectionItem> {
        readonly item: TItem;
        result: IValidationInfo[];
    }
    export interface ICollItemStatusArgs<TItem extends ICollectionItem> {
        item: TItem;
        oldStatus: ITEM_STATUS;
        key: string;
    }
    export interface ICollItemAddedArgs<TItem extends ICollectionItem> {
        item: TItem;
        isAddNewHandled: boolean;
    }
    export interface ICommitChangesArgs<TItem extends ICollectionItem> {
        item: TItem;
        isBegin: boolean;
        isRejected: boolean;
        status: ITEM_STATUS;
    }
    export interface ICollItemArgs<TItem extends ICollectionItem> {
        item: TItem;
    }
    export interface IPageChangingArgs {
        page: number;
        isCancel: boolean;
    }
    export interface ICancellableArgs<TItem extends ICollectionItem> {
        item: TItem;
        isCancel: boolean;
    }
    export interface IItemAddedArgs<TItem extends ICollectionItem> {
        item: TItem;
        isAddNewHandled: boolean;
    }
    export interface ICollEndEditArgs<TItem extends ICollectionItem> {
        item: TItem;
        isCanceled: boolean;
    }
    export interface ICurrentChangingArgs<TItem extends ICollectionItem> {
        newCurrent: TItem;
    }
    export interface ICollectionEvents<TItem extends ICollectionItem> {
        addOnClearing(fn: TEventHandler<ICollection<TItem>, any>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnClearing(nmspace?: string): void;
        addOnCleared(fn: TEventHandler<ICollection<TItem>, any>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnCleared(nmspace?: string): void;
        addOnCollChanged(fn: TEventHandler<ICollection<TItem>, ICollChangedArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnCollChanged(nmspace?: string): void;
        addOnFill(fn: TEventHandler<ICollection<TItem>, ICollFillArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnFill(nmspace?: string): void;
        addOnValidateField(fn: TEventHandler<ICollection<TItem>, ICollValidateFieldArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnValidateField(nmspace?: string): void;
        addOnItemDeleting(fn: TEventHandler<ICollection<TItem>, ICancellableArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnItemDeleting(nmspace?: string): void;
        addOnItemAdding(fn: TEventHandler<ICollection<TItem>, ICancellableArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnItemAdding(nmspace?: string): void;
        addOnItemAdded(fn: TEventHandler<ICollection<TItem>, IItemAddedArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnItemAdded(nmspace?: string): void;
        addOnCurrentChanging(fn: TEventHandler<ICollection<TItem>, ICurrentChangingArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnCurrentChanging(nmspace?: string): void;
        addOnPageChanging(fn: TEventHandler<ICollection<TItem>, IPageChangingArgs>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnPageChanging(nmspace?: string): void;
        addOnErrorsChanged(fn: TEventHandler<ICollection<TItem>, ICollItemArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnErrorsChanged(nmspace?: string): void;
        addOnBeginEdit(fn: TEventHandler<ICollection<TItem>, ICollItemArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnBeginEdit(nmspace?: string): void;
        addOnEndEdit(fn: TEventHandler<ICollection<TItem>, ICollEndEditArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnEndEdit(nmspace?: string): void;
        addOnCommitChanges(fn: TEventHandler<ICollection<TItem>, ICommitChangesArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnCommitChanges(nmspace?: string): void;
        addOnStatusChanged(fn: TEventHandler<ICollection<TItem>, ICollItemStatusArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnStatusChanged(nmspace?: string): void;
        addOnPageIndexChanged(handler: TPropChangedHandler, nmspace?: string, context?: IBaseObject): void;
        addOnPageSizeChanged(handler: TPropChangedHandler, nmspace?: string, context?: IBaseObject): void;
        addOnTotalCountChanged(handler: TPropChangedHandler, nmspace?: string, context?: IBaseObject): void;
        addOnCurrentChanged(handler: TPropChangedHandler, nmspace?: string, context?: IBaseObject): void;
    }
    export interface IEditableCollection<TItem extends ICollectionItem> {
        removeItem(item: TItem): void;
        cancelEdit(): void;
        endEdit(): void;
        addNew(): TItem;
        isEditing: boolean;
        isUpdating: boolean;
        permissions: IPermissions;
    }
    export interface ISimpleCollection<TItem extends ICollectionItem> extends IBaseObject {
        getFieldNames(): string[];
        getFieldInfo(fieldName: string): IFieldInfo;
        getFieldInfos(): IFieldInfo[];
        getFieldMap(): IIndexer<IFieldInfo>;
        getItemByPos(pos: number): TItem;
        getItemByKey(key: string): TItem;
        findByPK(...vals: any[]): TItem;
        moveFirst(skipDeleted?: boolean): boolean;
        movePrev(skipDeleted?: boolean): boolean;
        moveNext(skipDeleted?: boolean): boolean;
        moveLast(skipDeleted?: boolean): boolean;
        goTo(pos: number): boolean;
        forEach(callback: (item: TItem) => void, thisObj?: any): void;
        sort(fieldNames: string[], sortOrder: SORT_ORDER): IPromise<any>;
        sortLocal(fieldNames: string[], sortOrder: SORT_ORDER): IPromise<any>;
        clear(): void;
        items: TItem[];
        currentItem: TItem;
        count: number;
        totalCount: number;
        pageSize: number;
        pageIndex: number;
        pageCount: number;
        isPagingEnabled: boolean;
        isLoading: boolean;
    }
    export interface ICollection<TItem extends ICollectionItem> extends ISimpleCollection<TItem>, IEditableCollection<TItem>, ICollectionEvents<TItem> {
        readonly options: ICollectionOptions;
        readonly uniqueID: string;
    }
    export interface IValueUtils {
        valueToDate(val: string, dtcnv: DATE_CONVERSION, serverTZ: number): Date;
        dateToValue(dt: Date, dtcnv: DATE_CONVERSION, serverTZ: number): string;
        compareVals(v1: any, v2: any, dataType: DATA_TYPE): boolean;
        stringifyValue(v: any, dtcnv: DATE_CONVERSION, dataType: DATA_TYPE, serverTZ: number): string;
        parseValue(v: string, dataType: DATA_TYPE, dtcnv: DATE_CONVERSION, serverTZ: number): any;
    }
    export interface IPropInfo {
        name: string;
        dtype: number;
    }
    export interface IErrors {
        [fieldName: string]: string[];
    }
    export interface IErrorsList {
        [itemKey: string]: IErrors;
    }
    export interface IInternalCollMethods<TItem extends ICollectionItem> {
        setIsLoading(v: boolean): void;
        getEditingItem(): TItem;
        getStrValue(val: any, fieldInfo: IFieldInfo): string;
        onBeforeEditing(item: TItem, isBegin: boolean, isCanceled: boolean): void;
        onEditing(item: TItem, isBegin: boolean, isCanceled: boolean): void;
        onCommitChanges(item: TItem, isBegin: boolean, isRejected: boolean, status: ITEM_STATUS): void;
        onItemDeleting(args: ICancellableArgs<TItem>): boolean;
        onErrorsChanged(args: ICollItemArgs<TItem>): void;
        validateItemField(args: ICollValidateFieldArgs<TItem>): IValidationInfo;
        validateItem(args: ICollValidateItemArgs<TItem>): IValidationInfo[];
    }
}
declare module "jriapp_shared/utils/sysutils" {
    import { BRACKETS } from "jriapp_shared/consts";
    import { ISubmittable, IErrorNotification, IEditable, IPropertyBag, IBaseObject, IValidatable, IValidationError } from "jriapp_shared/int";
    import { ICollection } from "jriapp_shared/collection/int";
    export class SysUtils {
        static isBinding: (obj: any) => boolean;
        static readonly isPropBag: (obj: any) => obj is IPropertyBag;
        static isCollection: (obj: any) => obj is ICollection<any>;
        static getItemByProp: (obj: any, prop: string) => any;
        static isValidationError: (obj: any) => obj is IValidationError;
        static isBaseObj: (obj: any) => obj is IBaseObject;
        static isEditable(obj: any): obj is IEditable;
        static isSubmittable(obj: any): obj is ISubmittable;
        static isErrorNotification(obj: any): obj is IErrorNotification;
        static isValidatable(obj: any): obj is IValidatable;
        static getErrorNotification(obj: any): IErrorNotification;
        static getEditable(obj: any): IEditable;
        static getSubmittable(obj: any): ISubmittable;
        static getBraceLen(val: string, start: number, brace: BRACKETS): number;
        static getPathParts(path: string): string[];
        static getProp(obj: any, prop: string): any;
        static setProp(obj: any, prop: string, val: any): void;
        static resolveOwner(root: any, path: string): any;
        static resolvePath(root: any, path: string): any;
        static resolvePath2(root: any, srcParts: string[]): any;
        static raiseProp(obj: IBaseObject, path: string): void;
    }
}
declare module "jriapp_shared/errors" {
    import { IValidationInfo, IValidationError } from "jriapp_shared/int";
    export class BaseError {
        private _message;
        constructor(message?: string);
        toString(): string;
        get isDummy(): boolean;
        get message(): string;
    }
    export class DummyError extends BaseError {
        private _origError;
        constructor(originalError: any);
        get isDummy(): boolean;
        get origError(): any;
    }
    export class AbortError extends BaseError {
        private _reason;
        constructor(reason?: string);
        get isDummy(): boolean;
        get reason(): string;
    }
    export class AggregateError extends BaseError {
        private _errors;
        constructor(errors?: any[]);
        get errors(): any[];
        get count(): number;
        get message(): string;
        toString(): string;
    }
    export class ValidationError extends BaseError implements IValidationError {
        private _validations;
        private _item;
        constructor(validations: IValidationInfo[], item: any);
        get item(): any;
        get validations(): IValidationInfo[];
    }
}
declare module "jriapp_shared/utils/error" {
    import { AbortError } from "jriapp_shared/errors";
    import { IErrorHandler } from "jriapp_shared/int";
    export class ERROR {
        private static _handlers;
        static addHandler(name: string, handler: IErrorHandler): void;
        static removeHandler(name: string): void;
        static handleError(sender: any, error: any, source: any): boolean;
        static throwDummy(err: any): never;
        static checkIsDummy(error: any): boolean;
        static checkIsAbort(error: any): error is AbortError;
        static reThrow(ex: any, isHandled: boolean): never;
        static abort(reason?: string): never;
    }
}
declare module "jriapp_shared/utils/debug" {
    export class DEBUG {
        static checkStartDebugger(): void;
        static isDebugging(): boolean;
    }
}
declare module "jriapp_shared/utils/eventhelper" {
    import { TPriority, IIndexer, TEventHandler } from "jriapp_shared/int";
    export type TEventNode = {
        context: any;
        fn: TEventHandler;
    };
    export type TEventNodeArray = TEventNode[];
    export interface INamespaceMap {
        [ns: string]: TEventNodeArray;
    }
    export interface IEventList {
        [priority: number]: INamespaceMap;
    }
    export class EventHelper {
        static removeNS(ev: IIndexer<IEventList>, ns?: string): void;
        static add(ev: IIndexer<IEventList>, name: string, handler: TEventHandler, nmspace?: string, context?: object, priority?: TPriority): void;
        static remove(ev: IIndexer<IEventList>, name?: string, nmspace?: string): void;
        static count(ev: IIndexer<IEventList>, name: string): number;
        static raise(sender: any, ev: IIndexer<IEventList>, name: string, args: any): void;
        static raiseProp(sender: any, ev: IIndexer<IEventList>, prop: string, args: any): void;
    }
}
declare module "jriapp_shared/object" {
    import { IBaseObject, TPriority, TEventHandler, TErrorHandler, TPropChangedHandler, IObjectEvents } from "jriapp_shared/int";
    export const objSignature: object;
    export const enum ObjState {
        None = 0,
        Disposing = 1,
        Disposed = 2
    }
    export const enum OBJ_EVENTS {
        error = "error",
        disposed = "disposed"
    }
    export function createObjectEvents(owner: IBaseObject): IObjectEvents;
    export const dummyEvents: IObjectEvents;
    export class ObjectEvents implements IObjectEvents {
        private _events;
        private _owner;
        constructor(owner: IBaseObject);
        canRaise(name: string): boolean;
        on(name: string, handler: TEventHandler, nmspace?: string, context?: object, priority?: TPriority): void;
        off(name?: string, nmspace?: string): void;
        offNS(nmspace?: string): void;
        raise(name: string, args: any): void;
        raiseProp(name: string): void;
        onProp(prop: string, handler: TPropChangedHandler, nmspace?: string, context?: object, priority?: TPriority): void;
        offProp(prop?: string, nmspace?: string): void;
        addOnDisposed(handler: TEventHandler<IBaseObject>, nmspace?: string, context?: object, priority?: TPriority): void;
        offOnDisposed(nmspace?: string): void;
        addOnError(handler: TErrorHandler<IBaseObject>, nmspace?: string, context?: object, priority?: TPriority): void;
        offOnError(nmspace?: string): void;
        get owner(): IBaseObject;
    }
    export class BaseObject implements IBaseObject {
        private _objState;
        private _objEvents;
        constructor();
        protected setDisposing(): void;
        protected _createObjEvents(): IObjectEvents;
        isHasProp(prop: string): boolean;
        handleError(error: any, source: any): boolean;
        getIsDisposed(): boolean;
        getIsStateDirty(): boolean;
        dispose(): void;
        get objEvents(): IObjectEvents<this>;
        get __objSig(): object;
    }
}
declare module "jriapp_shared/utils/queue" {
    import { IPromise } from "jriapp_shared/utils/promise";
    export interface IQueue {
        cancel: (taskId: number) => void;
        enque: (func: () => any) => number;
        execAsync: (func: () => any) => IPromise<any>;
    }
    export function createQueue(interval?: number): IQueue;
}
declare module "jriapp_shared/utils/promise" {
    import { IStatefulDeferred, IStatefulPromise, ITaskQueue, PromiseState, TResolved, IThenable, IPromise, IAbortablePromise, ICancellationToken, ICancellationTokenSource } from "jriapp_shared/utils/ipromise";
    export * from "jriapp_shared/utils/ipromise";
    export function createDefer<T = any>(isSync?: boolean): IStatefulDeferred<T>;
    export function createSyncDefer<T>(): IStatefulDeferred<T>;
    export function getTaskQueue(): ITaskQueue;
    export function whenAll<T>(promises: Array<T | IThenable<T>>): IStatefulPromise<T[]>;
    export function race<T>(promises: IThenable<T>[]): IStatefulPromise<T>;
    export function promiseSerial<T>(funcs: {
        (): IThenable<T>;
    }[]): IStatefulPromise<T[]>;
    export class StatefulPromise<T = any> implements IStatefulPromise<T> {
        private _deferred;
        constructor(fn: (resolve: (res?: TResolved<T>) => void, reject: (err?: any) => void) => void, isSync?: boolean);
        then<TResult1 = T, TResult2 = never>(onFulfilled?: ((value: T) => TResult1 | IThenable<TResult1>) | undefined | null, onRejected?: ((reason: any) => TResult2 | IThenable<TResult2>) | undefined | null): IStatefulPromise<TResult1 | TResult2>;
        catch<TResult = never>(onRejected?: ((reason: any) => TResult | IThenable<TResult>) | undefined | null): IStatefulPromise<T | TResult>;
        finally(onFinally: () => void): IStatefulPromise<T>;
        static all<T>(...promises: Array<T | IThenable<T>>): IStatefulPromise<T[]>;
        static all<T>(promises: Array<T | IThenable<T>>): IStatefulPromise<T[]>;
        static race<T>(...promises: Array<IPromise<T>>): IPromise<T>;
        static race<T>(promises: Array<IPromise<T>>): IPromise<T>;
        static reject<T>(reason?: any, isSync?: boolean): IStatefulPromise<T>;
        static resolve<T>(value?: TResolved<T>, isSync?: boolean): IStatefulPromise<T>;
        state(): PromiseState;
        deferred(): IStatefulDeferred<T>;
    }
    export class CancellationTokenSource implements ICancellationTokenSource {
        private _callbacks;
        private _isCancelled;
        private _reason;
        constructor();
        private _cancel;
        register(fn: (reason?: string) => void): void;
        cancel(reason?: string): void;
        get isCancelled(): boolean;
        get token(): ICancellationToken;
    }
    export class AbortablePromise<T = any> extends StatefulPromise implements IAbortablePromise<T> {
        private _tokenSource;
        private _aborted;
        constructor(fn: (resolve: (res?: TResolved<T>) => void, reject: (err?: any) => void, token: ICancellationToken) => void);
        abort(reason?: string): void;
    }
}
declare module "jriapp_shared/utils/debounce" {
    import { IDisposable, TFunc } from "jriapp_shared/int";
    export class Debounce implements IDisposable {
        private _timer;
        private _interval;
        private _fn;
        constructor(interval?: number);
        dispose(): void;
        enque(fn: TFunc): void;
        cancel(): void;
        get interval(): number;
        getIsDisposed(): boolean;
    }
}
declare module "jriapp_shared/utils/jsonbag" {
    import { IEditable, IValidationInfo, IErrorNotification, TEventHandler, IPropertyBag } from "jriapp_shared/int";
    import { BaseObject } from "jriapp_shared/object";
    export interface IBagErrors {
        [fieldName: string]: string[];
    }
    export interface IFieldValidateArgs<TBag extends IPropertyBag> {
        bag: TBag;
        readonly fieldName: string;
        readonly errors: string[];
    }
    export interface IBagValidateArgs<TBag extends IPropertyBag> {
        readonly bag: TBag;
        readonly result: IValidationInfo[];
    }
    export class JsonBag extends BaseObject implements IEditable, IErrorNotification, IPropertyBag {
        private _json;
        private _jsonChanged;
        private _val;
        private _saveVal;
        private _debounce;
        private _errors;
        constructor(json: string, jsonChanged: (json: string) => void);
        dispose(): void;
        isHasProp(prop: string): boolean;
        addOnValidateBag(fn: TEventHandler<IPropertyBag, IBagValidateArgs<IPropertyBag>>, nmspace?: string, context?: any): void;
        offOnValidateBag(nmspace?: string): void;
        addOnValidateField(fn: TEventHandler<IPropertyBag, IFieldValidateArgs<IPropertyBag>>, nmspace?: string, context?: any): void;
        offOnValidateField(nmspace?: string): void;
        addOnErrorsChanged(fn: TEventHandler<JsonBag, any>, nmspace?: string, context?: any): void;
        offOnErrorsChanged(nmspace?: string): void;
        protected onChanged(): void;
        resetJson(json?: string): void;
        updateJson(): boolean;
        protected _validateBag(): IValidationInfo[];
        protected _validateField(fieldName: string): IValidationInfo;
        protected _onErrorsChanged(): void;
        protected _addErrors(errors: IValidationInfo[]): void;
        protected _addError(fieldName: string, errors: string[], ignoreChangeErrors?: boolean): void;
        protected _removeError(fieldName: string, ignoreChangeErrors?: boolean): boolean;
        protected _removeAllErrors(): void;
        getIsHasErrors(): boolean;
        getFieldErrors(fieldName: string): IValidationInfo[];
        getAllErrors(): IValidationInfo[];
        getIErrorNotification(): IErrorNotification;
        beginEdit(): boolean;
        endEdit(): boolean;
        cancelEdit(): boolean;
        get isEditing(): boolean;
        getProp(name: string): any;
        setProp(name: string, val: any): void;
        get isPropertyBag(): boolean;
        get val(): any;
        get json(): string;
        toString(): string;
    }
}
declare module "jriapp_shared/utils/logger" {
    export class LOGGER {
        static log(str: string): void;
        static warn(str: string): void;
        static error(str: string): void;
    }
}
declare module "jriapp_shared/utils/asyncutils" {
    import { ITaskQueue, IStatefulDeferred, IStatefulPromise, IPromise, IThenable } from "jriapp_shared/utils/ipromise";
    export type TDelayedFunc<T> = () => IPromise<T> | T;
    export class AsyncUtils {
        static createDeferred<T>(isSync?: boolean): IStatefulDeferred<T>;
        static reject<T>(reason?: any, isSync?: boolean): IStatefulPromise<T>;
        static resolve<T>(value?: T, isSync?: boolean): IStatefulPromise<T>;
        static promiseSerial<T>(funcs: {
            (): IPromise<T>;
        }[]): IStatefulPromise<T[]>;
        static whenAll<T>(args: Array<T | IThenable<T>>): IStatefulPromise<T[]>;
        static race<T>(promises: Array<IThenable<T>>): IPromise<T>;
        static getTaskQueue(): ITaskQueue;
        static delay<T = any>(funcORvalue?: TDelayedFunc<T> | T, time?: number): IStatefulPromise<T>;
        static parseJSON<T>(res: string | any): IStatefulPromise<T>;
    }
}
declare module "jriapp_shared/utils/http" {
    import { IAbortablePromise } from "jriapp_shared/utils/ipromise";
    import { IIndexer } from "jriapp_shared/int";
    export class HttpUtils {
        static isStatusOK(status: string | number): boolean;
        private static _getXMLRequest;
        static postAjax(url: string, postData: string, headers?: IIndexer<string>): IAbortablePromise<string>;
        static getAjax(url: string, headers?: IIndexer<string>): IAbortablePromise<string>;
        static defaultHeaders: IIndexer<string>;
        static ajaxTimeOut: number;
    }
}
declare module "jriapp_shared/utils/arrhelper" {
    import { IIndexer } from "jriapp_shared/int";
    export interface IArrayLikeList<T> {
        length: number;
        [index: number]: T;
    }
    export class ArrayHelper {
        static clone<T>(arr: T[]): T[];
        static fromList<T extends U, U>(list: IArrayLikeList<U>): T[];
        static fromList<T>(list: IArrayLikeList<any>): T[];
        static fromList<T>(list: IArrayLikeList<T>): T[];
        static merge<T>(arrays: Array<Array<T>>): Array<T>;
        static distinct(arr: string[]): string[];
        static distinct(arr: number[]): number[];
        static toMap<T extends object>(arr: T[], key: (obj: T) => string): IIndexer<T>;
        static remove(array: any[], obj: any): number;
        static removeIndex(array: any[], index: number): boolean;
        static insert(array: any[], obj: any, pos: number): void;
    }
}
declare module "jriapp_shared/utils/dates" {
    export const enum TIME_KIND {
        YEAR = "year",
        MONTH = "month",
        WEEK = "week",
        DAY = "day",
        HOUR = "hour",
        MINUTE = "minute",
        SECOND = "second"
    }
    export type TIME_RANGE = TIME_KIND.YEAR | TIME_KIND.MONTH | TIME_KIND.WEEK | TIME_KIND.DAY;
    export class DateUtils {
        static isValid(val: string, format?: string): boolean;
        static readonly strToDate: (val: string, format?: string) => Date;
        static strToDatePartial(format?: string): (val: string) => Date;
        static readonly dateToStr: (dt: Date, format?: string) => string;
        static dateToStrPartial(format?: string): (dt: Date) => string;
        static readonly add: (dt: Date, val: number, period: TIME_KIND) => Date;
        static addPartial1(period: TIME_KIND): (dt: Date, val: number) => Date;
        static addPartial2(period: TIME_KIND): (val: number) => (dt: Date) => Date;
        static addPartial3(period: TIME_KIND): (dt: Date) => (val: number) => Date;
        static trim(dt: Date): Date;
        static today(): Date;
        static now(): Date;
        static yesterday(dt?: Date): Date;
        static tomorrow(dt?: Date): Date;
        static startOf(period: TIME_RANGE, dt?: Date): Date;
        static endOf(period: TIME_RANGE, dt?: Date): Date;
    }
}
declare module "jriapp_shared/utils/utils" {
    import { CoreUtils } from "jriapp_shared/utils/coreutils";
    import { DEBUG } from "jriapp_shared/utils/debug";
    import { ERROR } from "jriapp_shared/utils/error";
    import { LOGGER } from "jriapp_shared/utils/logger";
    import { SysUtils } from "jriapp_shared/utils/sysutils";
    import { AsyncUtils } from "jriapp_shared/utils/asyncutils";
    import { HttpUtils } from "jriapp_shared/utils/http";
    import { StringUtils } from "jriapp_shared/utils/strutils";
    import { Checks } from "jriapp_shared/utils/checks";
    import { ArrayHelper } from "jriapp_shared/utils/arrhelper";
    import { ITaskQueue } from "jriapp_shared/utils/ipromise";
    import { DateUtils } from "jriapp_shared/utils/dates";
    export class Utils {
        static readonly check: typeof Checks;
        static readonly str: typeof StringUtils;
        static readonly arr: typeof ArrayHelper;
        static readonly http: typeof HttpUtils;
        static readonly core: typeof CoreUtils;
        static readonly async: typeof AsyncUtils;
        static readonly err: typeof ERROR;
        static readonly log: typeof LOGGER;
        static readonly debug: typeof DEBUG;
        static readonly sys: typeof SysUtils;
        static readonly queue: ITaskQueue;
        static readonly dates: typeof DateUtils;
    }
}
declare module "jriapp_shared/utils/waitqueue" {
    import { IBaseObject } from "jriapp_shared/int";
    import { BaseObject } from "jriapp_shared/object";
    export interface IWaitQueueItem {
        prop: string;
        groupName?: string;
        predicate: (val: any) => boolean;
        action: (...args: any[]) => void;
        actionArgs?: any[];
        lastWins?: boolean;
    }
    export class WaitQueue extends BaseObject {
        private _uniqueID;
        private _owner;
        private _queue;
        constructor(owner: IBaseObject);
        dispose(): void;
        protected _checkQueue(prop: string, value: any): void;
        enQueue(item: IWaitQueueItem): void;
        toString(): string;
        get uniqueID(): string;
        get owner(): IBaseObject;
    }
}
declare module "jriapp_shared/collection/utils" {
    import { IFieldInfo } from "jriapp_shared/collection/int";
    import { IValueUtils } from "jriapp_shared/collection/int";
    export const ValueUtils: IValueUtils;
    export type WalkFieldCB<T> = (fld: IFieldInfo, name: string, parentRes?: T) => T;
    export function fn_walkField<T>(fldName: string, fld: IFieldInfo, cb: WalkFieldCB<T>, parentRes?: T): void;
    export const CollUtils: {
        getObjectField: (name: string, flds: IFieldInfo[]) => IFieldInfo;
        walkField: <T>(fld: IFieldInfo, fn: WalkFieldCB<T>, parentRes?: T) => void;
        walkFields: <T_1>(flds: IFieldInfo[], fn: WalkFieldCB<T_1>, parentRes?: T_1) => void;
        getPKFields(fieldInfos: IFieldInfo[]): IFieldInfo[];
        initVals: (flds: IFieldInfo[], vals: any) => any;
        copyVals: (flds: IFieldInfo[], from: any, to: any) => any;
        objToVals: (flds: IFieldInfo[], obj: any) => any;
        cloneVals: (flds: IFieldInfo[], vals: any) => any;
    };
}
declare module "jriapp_shared/collection/base" {
    import { SORT_ORDER, ITEM_STATUS, COLL_CHANGE_REASON, COLL_CHANGE_OPER } from "jriapp_shared/collection/const";
    import { IFieldInfo } from "jriapp_shared/collection/int";
    import { IPromise } from "jriapp_shared/utils/ipromise";
    import { IIndexer, IValidationInfo, TEventHandler, TPropChangedHandler, IBaseObject, TPriority } from "jriapp_shared/int";
    import { BaseObject } from "jriapp_shared/object";
    import { ICollectionItem, ICollection, ICollectionOptions, IPermissions, IInternalCollMethods, ICollChangedArgs, ICancellableArgs, ICollFillArgs, ICollEndEditArgs, ICollItemArgs, ICollItemStatusArgs, ICollValidateFieldArgs, ICollValidateItemArgs, ICurrentChangingArgs, ICommitChangesArgs, IItemAddedArgs, IPageChangingArgs, IErrors } from "jriapp_shared/collection/int";
    import { ItemAspect } from "jriapp_shared/collection/aspect";
    export class Errors<TItem extends ICollectionItem> {
        private _errors;
        private _owner;
        constructor(owner: BaseCollection<TItem>);
        clear(): void;
        validateItem(item: TItem): IValidationInfo[];
        validateItemField(item: TItem, fieldName: string): IValidationInfo;
        addErrors(item: TItem, errors: IValidationInfo[]): void;
        addError(item: TItem, fieldName: string, errors: string[], ignoreChangeErrors?: boolean): void;
        removeError(item: TItem, fieldName: string, ignoreChangeErrors?: boolean): void;
        removeAllErrors(item: TItem): void;
        getErrors(item: TItem): IErrors;
        onErrorsChanged(item: TItem): void;
        getItemsWithErrors(): TItem[];
    }
    export abstract class BaseCollection<TItem extends ICollectionItem> extends BaseObject implements ICollection<TItem> {
        private _uniqueID;
        private _perms;
        private _options;
        private _errors;
        private _pkInfo;
        private _isLoading;
        private _EditingItem;
        private _totalCount;
        private _pageIndex;
        private _items;
        private _itemsByKey;
        private _currentPos;
        private _isUpdating;
        private _waitQueue;
        private _internal;
        constructor();
        dispose(): void;
        static getEmptyFieldInfo(fieldName: string): IFieldInfo;
        protected _isOwnsItems(): boolean;
        protected _setInternal<T extends IInternalCollMethods<TItem>>(internal: T): void;
        protected _updatePermissions(perms: IPermissions): void;
        protected _getPKFieldInfos(): IFieldInfo[];
        protected _checkCurrentChanging(_newCurrent: TItem): void;
        protected _onCurrentChanging(newCurrent: TItem): void;
        protected _onCurrentChanged(): void;
        protected _onCountChanged(): void;
        protected _onEditingChanged(): void;
        protected _onItemStatusChanged(item: TItem, oldStatus: ITEM_STATUS): void;
        protected _onCollectionChanged(args: ICollChangedArgs<TItem>): void;
        protected _onFillEnd(args: ICollFillArgs<TItem>): void;
        protected _onItemAdding(item: TItem): void;
        protected _onItemAdded(item: TItem): void;
        protected _addNew(item: TItem): number;
        protected _onAddNew(item: TItem): void;
        protected _onRemoved(item: TItem): void;
        protected _onPageSizeChanged(): void;
        protected _onPageChanging(): boolean;
        protected _onPageChanged(): void;
        protected _setCurrentItem(v: TItem): void;
        protected _getEditingItem(): TItem;
        protected _getStrValue(val: any, fieldInfo: IFieldInfo): string;
        protected _onBeforeEditing(item: TItem, isBegin: boolean, isCanceled: boolean): void;
        protected _onEditing(item: TItem, isBegin: boolean, isCanceled: boolean): void;
        protected _onCommitChanges(item: TItem, isBegin: boolean, isRejected: boolean, status: ITEM_STATUS): void;
        protected _validateItem(item: TItem): IValidationInfo[];
        protected _validateItemField(item: TItem, fieldName: string): IValidationInfo;
        protected _onItemDeleting(args: ICancellableArgs<TItem>): boolean;
        protected _clear(reason: COLL_CHANGE_REASON, oper: COLL_CHANGE_OPER): void;
        protected _replaceItems(reason: COLL_CHANGE_REASON, oper: COLL_CHANGE_OPER, items: TItem[]): void;
        protected _appendItem(item: TItem): number;
        protected _remapItem(oldkey: string, newkey: string, item: TItem): void;
        protected _removeItem(item: TItem): number;
        protected _resetCurrent(oldPos: number): void;
        protected _waitForProp(prop: string, callback: () => void, groupName: string): void;
        protected _setIsLoading(v: boolean): void;
        protected abstract _createNew(): TItem;
        abstract itemFactory(aspect: ItemAspect<TItem, any>): TItem;
        abstract getFieldMap(): IIndexer<IFieldInfo>;
        abstract getFieldInfos(): IFieldInfo[];
        _getInternal(): IInternalCollMethods<TItem>;
        _getSortFn(fieldNames: string[], sortOrder: SORT_ORDER): (a: any, b: any) => number;
        isHasProp(prop: string): boolean;
        getFieldInfo(fieldName: string): IFieldInfo;
        getFieldNames(): string[];
        cancelEdit(): void;
        endEdit(): void;
        getItemsWithErrors(): TItem[];
        addNew(): TItem;
        getItemByPos(pos: number): TItem;
        getItemByKey(key: string): TItem;
        findByPK(...vals: any[]): TItem;
        moveFirst(skipDeleted?: boolean): boolean;
        movePrev(skipDeleted?: boolean): boolean;
        moveNext(skipDeleted?: boolean): boolean;
        moveLast(skipDeleted?: boolean): boolean;
        goTo(pos: number): boolean;
        forEach(callback: (item: TItem) => void, thisObj?: any): void;
        removeItem(item: TItem): void;
        sort(fieldNames: string[], sortOrder: SORT_ORDER): IPromise<any>;
        sortLocal(fieldNames: string[], sortOrder: SORT_ORDER): IPromise<any>;
        rejectChanges(): void;
        clear(): void;
        waitForNotLoading(callback: () => void, groupName: string): void;
        toString(): string;
        addOnClearing(fn: TEventHandler<ICollection<TItem>, {
            reason: COLL_CHANGE_REASON;
        }>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnClearing(nmspace?: string): void;
        addOnCleared(fn: TEventHandler<ICollection<TItem>, {
            reason: COLL_CHANGE_REASON;
        }>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnCleared(nmspace?: string): void;
        addOnCollChanged(fn: TEventHandler<ICollection<TItem>, ICollChangedArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnCollChanged(nmspace?: string): void;
        addOnFill(fn: TEventHandler<ICollection<TItem>, ICollFillArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnFill(nmspace?: string): void;
        addOnValidateField(fn: TEventHandler<ICollection<TItem>, ICollValidateFieldArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnValidateField(nmspace?: string): void;
        addOnValidateItem(fn: TEventHandler<ICollection<TItem>, ICollValidateItemArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnValidateItem(nmspace?: string): void;
        addOnItemDeleting(fn: TEventHandler<ICollection<TItem>, ICancellableArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnItemDeleting(nmspace?: string): void;
        addOnItemAdding(fn: TEventHandler<ICollection<TItem>, ICancellableArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnItemAdding(nmspace?: string): void;
        addOnItemAdded(fn: TEventHandler<ICollection<TItem>, IItemAddedArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnItemAdded(nmspace?: string): void;
        addOnCurrentChanging(fn: TEventHandler<ICollection<TItem>, ICurrentChangingArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnCurrentChanging(nmspace?: string): void;
        addOnPageChanging(fn: TEventHandler<ICollection<TItem>, IPageChangingArgs>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnPageChanging(nmspace?: string): void;
        addOnErrorsChanged(fn: TEventHandler<ICollection<TItem>, ICollItemArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnErrorsChanged(nmspace?: string): void;
        addOnBeginEdit(fn: TEventHandler<ICollection<TItem>, ICollItemArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnBeginEdit(nmspace?: string): void;
        addOnEndEdit(fn: TEventHandler<ICollection<TItem>, ICollEndEditArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnEndEdit(nmspace?: string): void;
        addOnBeforeBeginEdit(fn: TEventHandler<ICollection<TItem>, ICollItemArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnBeforeBeginEdit(nmspace?: string): void;
        addOnBeforeEndEdit(fn: TEventHandler<ICollection<TItem>, ICollEndEditArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        removeBeforeOnEndEdit(nmspace?: string): void;
        addOnCommitChanges(fn: TEventHandler<ICollection<TItem>, ICommitChangesArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnCommitChanges(nmspace?: string): void;
        addOnStatusChanged(fn: TEventHandler<ICollection<TItem>, ICollItemStatusArgs<TItem>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnStatusChanged(nmspace?: string): void;
        addOnPageIndexChanged(handler: TPropChangedHandler, nmspace?: string, context?: IBaseObject): void;
        addOnPageSizeChanged(handler: TPropChangedHandler, nmspace?: string, context?: IBaseObject): void;
        addOnTotalCountChanged(handler: TPropChangedHandler, nmspace?: string, context?: IBaseObject): void;
        addOnCurrentChanged(handler: TPropChangedHandler, nmspace?: string, context?: IBaseObject): void;
        get errors(): Errors<TItem>;
        get options(): ICollectionOptions;
        get items(): TItem[];
        get currentItem(): TItem;
        set currentItem(v: TItem);
        get count(): number;
        get totalCount(): number;
        set totalCount(v: number);
        get pageSize(): number;
        set pageSize(v: number);
        get pageIndex(): number;
        set pageIndex(v: number);
        get pageCount(): number;
        get isPagingEnabled(): boolean;
        get isEditing(): boolean;
        get isLoading(): boolean;
        get isUpdating(): boolean;
        set isUpdating(v: boolean);
        get permissions(): IPermissions;
        get uniqueID(): string;
    }
}
declare module "jriapp_shared/collection/validation" {
    import { IFieldInfo } from "jriapp_shared/collection/int";
    import { IValidationInfo } from "jriapp_shared/int";
    export class Validations {
        private static _dtRangeToDate;
        private static checkNumRange;
        private static checkDateRange;
        static checkField(fieldInfo: IFieldInfo, value: any, isNew: boolean): string[];
        static distinct(vals: IValidationInfo[]): IValidationInfo[];
    }
}
declare module "jriapp_shared/collection/aspect" {
    import { ITEM_STATUS, VALS_VERSION } from "jriapp_shared/collection/const";
    import { IFieldInfo } from "jriapp_shared/collection/int";
    import { IVoidPromise } from "jriapp_shared/utils/ipromise";
    import { IIndexer, IValidationInfo, TEventHandler, IErrorNotification } from "jriapp_shared/int";
    import { BaseObject } from "jriapp_shared/object";
    import { ICollectionItem, IItemAspect } from "jriapp_shared/collection/int";
    import { BaseCollection } from "jriapp_shared/collection/base";
    export abstract class ItemAspect<TItem extends ICollectionItem = ICollectionItem, TObj extends IIndexer<any> = IIndexer<any>> extends BaseObject implements IItemAspect<TItem, TObj> {
        private _key;
        private _item;
        private _coll;
        private _flags;
        private _valueBag;
        private _status;
        private _tempVals;
        private _vals;
        constructor(collection: BaseCollection<TItem>, vals: any, key: string, isNew: boolean);
        dispose(): void;
        protected _onErrorsChanged(): void;
        private _getFlag;
        private _setFlag;
        protected _setIsEdited(v: boolean): void;
        protected _setIsCancelling(v: boolean): void;
        protected _cloneVals(): TObj;
        protected _beginEdit(): boolean;
        protected _endEdit(): boolean;
        protected _cancelEdit(): boolean;
        protected _skipValidate(_fieldInfo: IFieldInfo, _val: any): boolean;
        protected _validateItem(): IValidationInfo[];
        protected _validateField(fieldName: string): IValidationInfo;
        protected _validateFields(): IValidationInfo[];
        protected _setStatus(v: ITEM_STATUS): void;
        protected _getValue(name: string, ver: VALS_VERSION): any;
        protected _setValue(name: string, val: any, ver: VALS_VERSION): void;
        protected _setVals(vals: TObj): void;
        protected _storeVals(toVer: VALS_VERSION): void;
        protected _restoreVals(fromVer: VALS_VERSION): void;
        _resetStatus(): void;
        _setKey(v: string): void;
        _setIsAttached(v: boolean): void;
        _setIsRefreshing(v: boolean): void;
        handleError(error: any, source: any): boolean;
        raiseErrorsChanged(): void;
        getFieldInfo(fieldName: string): IFieldInfo;
        getFieldNames(): string[];
        getErrorString(): string;
        submitChanges(): IVoidPromise;
        rejectChanges(): void;
        beginEdit(): boolean;
        endEdit(): boolean;
        cancelEdit(): boolean;
        deleteItem(): boolean;
        getIsHasErrors(): boolean;
        addOnErrorsChanged(fn: TEventHandler<ItemAspect<TItem, TObj>, any>, nmspace?: string, context?: any): void;
        offOnErrorsChanged(nmspace?: string): void;
        getFieldErrors(fieldName: string): IValidationInfo[];
        getAllErrors(): IValidationInfo[];
        getIErrorNotification(): IErrorNotification;
        setCustomVal(name: string, val: any, isOwnVal?: boolean): void;
        getCustomVal(name: string): any;
        toString(): string;
        protected get hasTempVals(): boolean;
        get vals(): TObj;
        get item(): TItem;
        get key(): string;
        get coll(): BaseCollection<TItem>;
        get status(): ITEM_STATUS;
        get isUpdating(): boolean;
        get isEditing(): boolean;
        get isCanSubmit(): boolean;
        get isHasChanges(): boolean;
        get isNew(): boolean;
        get isDeleted(): boolean;
        get isEdited(): boolean;
        get isDetached(): boolean;
        get isRefreshing(): boolean;
        get isCancelling(): boolean;
    }
}
declare module "jriapp_shared/collection/item" {
    import { BaseObject } from "jriapp_shared/object";
    import { ICollectionItem } from "jriapp_shared/collection/int";
    import { ItemAspect } from "jriapp_shared/collection/aspect";
    export class CollectionItem<TAspect extends ItemAspect<ICollectionItem, any>> extends BaseObject implements ICollectionItem {
        private __aspect;
        constructor(aspect: TAspect);
        dispose(): void;
        get _aspect(): TAspect;
        get _key(): string;
        toString(): string;
    }
}
declare module "jriapp_shared/collection/list" {
    import { IIndexer } from "jriapp_shared/int";
    import { COLL_CHANGE_REASON, COLL_CHANGE_OPER } from "jriapp_shared/collection/const";
    import { ICollectionItem, IPropInfo, IFieldInfo } from "jriapp_shared/collection/int";
    import { BaseCollection } from "jriapp_shared/collection/base";
    import { ItemAspect } from "jriapp_shared/collection/aspect";
    export interface IListItem extends ICollectionItem {
        readonly _aspect: ListItemAspect<IListItem, any>;
    }
    export class ListItemAspect<TItem extends IListItem, TObj extends IIndexer<any>> extends ItemAspect<TItem, TObj> {
        _setProp(name: string, val: any): void;
        _getProp(name: string): any;
        toString(): string;
        get list(): BaseList<TItem, TObj>;
    }
    export abstract class BaseList<TItem extends IListItem, TObj extends IIndexer<any>> extends BaseCollection<TItem> {
        private _fieldMap;
        private _fieldInfos;
        private _newKey;
        constructor(props: IPropInfo[]);
        private _updateFieldMap;
        protected _clear(reason: COLL_CHANGE_REASON, oper: COLL_CHANGE_OPER): void;
        protected createItem(obj?: TObj): TItem;
        protected _getNewKey(): string;
        protected _createNew(): TItem;
        getFieldMap(): IIndexer<IFieldInfo>;
        getFieldInfos(): IFieldInfo[];
        fillItems(objArray: TObj[], clearAll?: boolean): void;
        getNewItems(): TItem[];
        resetStatus(): void;
        toArray(): TObj[];
        toString(): string;
    }
}
declare module "jriapp_shared/utils/anylist" {
    import { IPropertyBag, IValidationInfo } from "jriapp_shared/int";
    import { CollectionItem } from "jriapp_shared/collection/item";
    import { IListItem, ListItemAspect, BaseList } from "jriapp_shared/collection/list";
    export { ICollValidateFieldArgs } from "jriapp_shared/collection/int";
    export interface IAnyVal {
        val: any;
    }
    export interface IAnyValItem extends IAnyVal, IListItem, IPropertyBag {
        readonly _aspect: AnyItemAspect;
    }
    export class AnyItemAspect extends ListItemAspect<IAnyValItem, IAnyVal> {
        _validateField(name: string): IValidationInfo;
        protected _cloneVals(): any;
        protected _validateFields(): IValidationInfo[];
        _getProp(name: string): any;
        _setProp(name: string, val: any): void;
        toString(): string;
    }
    export class AnyValListItem extends CollectionItem<AnyItemAspect> implements IAnyValItem {
        isHasProp(prop: string): boolean;
        getProp(name: string): any;
        setProp(name: string, val: any): void;
        get val(): any;
        set val(v: any);
        get isPropertyBag(): boolean;
        get list(): AnyList;
        toString(): string;
    }
    export class AnyList extends BaseList<IAnyValItem, IAnyVal> {
        private _onChanged;
        private _saveVal;
        private _debounce;
        constructor(onChanged: (arr: any[]) => void);
        dispose(): void;
        itemFactory(aspect: AnyItemAspect): AnyValListItem;
        protected createItem(obj?: IAnyVal): IAnyValItem;
        protected onChanged(): void;
        setValues(values: any[]): void;
        toString(): string;
    }
}
declare module "jriapp_shared/utils/jsonarray" {
    import { IValidationInfo, TEventHandler, IPropertyBag } from "jriapp_shared/int";
    import { BaseObject } from "jriapp_shared/object";
    import { JsonBag, IFieldValidateArgs, IBagValidateArgs } from "jriapp_shared/utils/jsonbag";
    import { AnyList, IAnyValItem } from "jriapp_shared/utils/anylist";
    export class JsonArray extends BaseObject {
        private _owner;
        private _pathToArray;
        private _list;
        private _uniqueID;
        constructor(owner: JsonBag, pathToArray: string);
        dispose(): void;
        protected updateArray(arr: any[]): void;
        addOnValidateBag(fn: TEventHandler<this, IBagValidateArgs<IPropertyBag>>, nmspace?: string, context?: any): void;
        offOnValidateBag(nmspace?: string): void;
        addOnValidateField(fn: TEventHandler<this, IFieldValidateArgs<IPropertyBag>>, nmspace?: string, context?: any): void;
        offOnValidateField(nmspace?: string): void;
        protected _validateBag(bag: IAnyValItem): IValidationInfo[];
        protected _validateField(bag: IAnyValItem, fieldName: string): IValidationInfo;
        getArray(): any[];
        get pathToArray(): string;
        get owner(): JsonBag;
        get list(): AnyList;
    }
}
declare module "jriapp_shared/utils/weakmap" {
    import { IWeakMap } from "jriapp_shared/int";
    export function createWeakMap(): IWeakMap;
}
declare module "jriapp_shared/collection/dictionary" {
    import { IIndexer } from "jriapp_shared/int";
    import { IPropInfo } from "jriapp_shared/collection/int";
    import { BaseList, IListItem } from "jriapp_shared/collection/list";
    export abstract class BaseDictionary<TItem extends IListItem, TObj extends IIndexer<any>> extends BaseList<TItem, TObj> {
        private _keyName;
        constructor(keyName: string, props: IPropInfo[]);
        protected createItem(obj?: TObj): TItem;
        protected _onItemAdded(item: TItem): void;
        protected _onRemoved(item: TItem): void;
        get keyName(): string;
        toString(): string;
    }
}
declare module "jriapp_shared/utils/lazy" {
    import { IDisposable } from "jriapp_shared/int";
    export type TValueFactory<T> = () => T;
    export class Lazy<T> implements IDisposable {
        private _val;
        private _factory;
        constructor(factory: TValueFactory<T>);
        dispose(): void;
        get Value(): T;
        get IsValueCreated(): boolean;
        getIsDisposed(): boolean;
    }
}
declare module "jriapp_shared" {
    export * from "jriapp_shared/consts";
    export * from "jriapp_shared/int";
    export * from "jriapp_shared/errors";
    export * from "jriapp_shared/object";
    export * from "jriapp_shared/utils/jsonbag";
    export * from "jriapp_shared/utils/jsonarray";
    export * from "jriapp_shared/utils/dates";
    export { createWeakMap } from "jriapp_shared/utils/weakmap";
    export { STRS as LocaleSTRS, ERRS as LocaleERRS } from "jriapp_shared/lang";
    export { BaseCollection } from "jriapp_shared/collection/base";
    export { CollectionItem } from "jriapp_shared/collection/item";
    export { ItemAspect } from "jriapp_shared/collection/aspect";
    export { ListItemAspect, IListItem, BaseList } from "jriapp_shared/collection/list";
    export { BaseDictionary } from "jriapp_shared/collection/dictionary";
    export { ValidationError } from "jriapp_shared/errors";
    export * from "jriapp_shared/utils/ipromise";
    export { StatefulPromise, AbortablePromise, CancellationTokenSource } from "jriapp_shared/utils/promise";
    export { Utils } from "jriapp_shared/utils/utils";
    export { WaitQueue, IWaitQueueItem } from "jriapp_shared/utils/waitqueue";
    export { Debounce } from "jriapp_shared/utils/debounce";
    export { Lazy, TValueFactory } from "jriapp_shared/utils/lazy";
    export const VERSION = "4.0.0";
}
