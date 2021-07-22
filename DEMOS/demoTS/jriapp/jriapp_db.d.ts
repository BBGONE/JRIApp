declare module "jriapp_db/const" {
    export const enum FLAGS {
        None = 0,
        Changed = 1,
        Setted = 2,
        Refreshed = 4
    }
    export const enum REFRESH_MODE {
        NONE = 0,
        RefreshCurrent = 1,
        MergeIntoCurrent = 2,
        CommitChanges = 3
    }
    export const enum DELETE_ACTION {
        NoAction = 0,
        Cascade = 1,
        SetNulls = 2
    }
    export const enum DATA_OPER {
        None = 0,
        Submit = 1,
        Query = 2,
        Invoke = 3,
        Refresh = 4,
        Init = 5
    }
}
declare module "jriapp_db/datacache" {
    import { BaseObject } from "jriapp_shared";
    import { TDataQuery } from "jriapp_db/dataquery";
    import { IEntityItem, ICachedPage } from "jriapp_db/int";
    export class DataCache extends BaseObject {
        private _query;
        private _pages;
        private _itemsByKey;
        private _totalCount;
        constructor(query: TDataQuery);
        dispose(): void;
        private _getPrevPageIndex;
        getNextRange(pageIndex: number): {
            start: number;
            end: number;
            cnt: number;
        };
        clear(): void;
        getPage(pageIndex: number): ICachedPage;
        getPageItems(pageIndex: number): IEntityItem[];
        setPageItems(pageIndex: number, items: IEntityItem[]): void;
        fill(startIndex: number, items: IEntityItem[]): void;
        deletePage(pageIndex: number): void;
        hasPage(pageIndex: number): boolean;
        getItemByKey(key: string): IEntityItem;
        toString(): string;
        get _pageCount(): number;
        get pageSize(): number;
        get loadPageCount(): number;
        get totalCount(): number;
        set totalCount(v: number);
        get cacheSize(): number;
    }
}
declare module "jriapp_db/dataquery" {
    import { FILTER_TYPE, SORT_ORDER } from "jriapp_shared/collection/const";
    import { IStatefulPromise, BaseObject } from "jriapp_shared";
    import { IFieldInfo } from "jriapp_shared/collection/int";
    import { IEntityItem, IQueryInfo, IFilterInfo, ISortInfo, IQueryResult } from "jriapp_db/int";
    import { DataCache } from "jriapp_db/datacache";
    import { DbSet } from "jriapp_db/dbset";
    import { DbContext } from "jriapp_db/dbcontext";
    export interface IInternalQueryMethods {
        clearCache(): void;
        getCache(): DataCache;
        isPageCached(pageIndex: number): boolean;
        updateCache(pageIndex: number, items: IEntityItem[]): void;
        getQueryInfo(): IQueryInfo;
    }
    export class DataQuery<TItem extends IEntityItem = IEntityItem, TObj = any> extends BaseObject {
        private _dbSet;
        private _queryInfo;
        private _filterInfo;
        private _sortInfo;
        private _isIncludeTotalCount;
        private _isClearPrevData;
        private _pageSize;
        private _pageIndex;
        private _params;
        private _loadPageCount;
        private _isClearCacheOnEveryLoad;
        private _isForAppend;
        private _dataCache;
        private _cacheInvalidated;
        private _internal;
        private _isPagingEnabled;
        constructor(dbSet: DbSet<TItem, TObj, DbContext>, queryInfo: IQueryInfo);
        dispose(): void;
        private _addSort;
        private _addFilterItem;
        private _resetCacheInvalidated;
        private _clearCache;
        private _getCache;
        private _isPageCached;
        private _updateCache;
        _getInternal(): IInternalQueryMethods;
        where(fieldName: string, operand: FILTER_TYPE, value: any, checkFieldName?: boolean): this;
        and(fieldName: string, operand: FILTER_TYPE, value: any, checkFieldName?: boolean): this;
        orderBy(fieldName: string, sortOrder?: SORT_ORDER): this;
        thenBy(fieldName: string, sortOrder?: SORT_ORDER): this;
        clearSort(): this;
        clearFilter(): this;
        clearParams(): this;
        getFieldInfo(fieldName: string): IFieldInfo;
        getFieldNames(): string[];
        load(): IStatefulPromise<IQueryResult<TItem>>;
        toString(): string;
        get serverTimezone(): number;
        get dbSet(): DbSet<TItem, TObj, DbContext>;
        get dbSetName(): string;
        get queryName(): string;
        get filterInfo(): IFilterInfo;
        get sortInfo(): ISortInfo;
        get isIncludeTotalCount(): boolean;
        set isIncludeTotalCount(v: boolean);
        get isClearPrevData(): boolean;
        set isClearPrevData(v: boolean);
        get pageSize(): number;
        set pageSize(v: number);
        get pageIndex(): number;
        set pageIndex(v: number);
        get params(): {
            [name: string]: any;
        };
        set params(v: {
            [name: string]: any;
        });
        get isPagingEnabled(): boolean;
        set isPagingEnabled(v: boolean);
        get loadPageCount(): number;
        set loadPageCount(v: number);
        get isClearCacheOnEveryLoad(): boolean;
        set isClearCacheOnEveryLoad(v: boolean);
        get isForAppend(): boolean;
        set isForAppend(v: boolean);
        get isCacheValid(): boolean;
    }
    export type TDataQuery = DataQuery;
}
declare module "jriapp_db/dbset" {
    import { SORT_ORDER, COLL_CHANGE_REASON, COLL_CHANGE_OPER, ITEM_STATUS } from "jriapp_shared/collection/const";
    import { IIndexer, TEventHandler, IBaseObject, IPromise, TPriority } from "jriapp_shared";
    import { IInternalCollMethods, IFieldInfo } from "jriapp_shared/collection/int";
    import { BaseCollection } from "jriapp_shared/collection/base";
    import { IFieldName, IEntityItem, IRowInfo, ITrackAssoc, IQueryResponse, IPermissions, IDbSetConstuctorOptions, ICalcFieldImpl, INavFieldImpl, IQueryResult, IRowData, IDbSetLoadedArgs } from "jriapp_db/int";
    import { REFRESH_MODE } from "jriapp_db/const";
    import { DataQuery, TDataQuery } from "jriapp_db/dataquery";
    import { DbContext } from "jriapp_db/dbcontext";
    import { EntityAspect } from "jriapp_db/entity_aspect";
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
    export interface IDbSetConstructor<TItem extends IEntityItem, TObj> {
        new (dbContext: DbContext): DbSet<TItem, TObj, DbContext>;
    }
    export abstract class DbSet<TItem extends IEntityItem = IEntityItem, TObj extends IIndexer<any> = IIndexer<any>, TDbContext extends DbContext = DbContext> extends BaseCollection<TItem> {
        private _dbContext;
        private _isSubmitOnDelete;
        private _trackAssoc;
        private _fieldMap;
        private _fieldInfos;
        private _trackAssocMap;
        private _childAssocMap;
        private _parentAssocMap;
        private _changeCount;
        private _changeCache;
        protected _navfldMap: {
            [fieldName: string]: INavFieldImpl<TItem>;
        };
        protected _calcfldMap: {
            [fieldName: string]: ICalcFieldImpl<TItem>;
        };
        protected _ignorePageChanged: boolean;
        protected _query: DataQuery<TItem, TObj>;
        private _pageDebounce;
        private _dbSetName;
        private _pkFields;
        private _isPageFilled;
        private _newKey;
        constructor(opts: IDbSetConstuctorOptions);
        dispose(): void;
        abstract itemFactory(aspect: EntityAspect<TItem, TObj, TDbContext>): TItem;
        handleError(error: any, source: any): boolean;
        protected _mapAssocFields(): void;
        protected _doNavigationField(opts: IDbSetConstuctorOptions, fieldInfo: IFieldInfo): INavFieldImpl<TItem>;
        protected _doCalculatedField(_opts: IDbSetConstuctorOptions, fieldInfo: IFieldInfo): ICalcFieldImpl<TItem>;
        protected _refreshValues(path: string, item: IEntityItem, values: any[], names: IFieldName[], rm: REFRESH_MODE): void;
        protected _applyFieldVals(vals: any, path: string, values: any[], names: IFieldName[]): void;
        protected _getNewKey(): string;
        protected _onItemAdded(item: TItem): void;
        protected _createNew(): TItem;
        protected _clear(reason: COLL_CHANGE_REASON, oper: COLL_CHANGE_OPER): void;
        protected _onPageChanging(): boolean;
        protected _onPageChanged(): void;
        protected _onPageSizeChanged(): void;
        protected _defineCalculatedField(fullName: string, getFunc: (item: TItem) => any): void;
        protected _getStrValue(val: any, fieldInfo: IFieldInfo): string;
        protected _getKeyValue(vals: any): string;
        protected _getCalcFieldVal(fieldName: string, item: TItem): any;
        protected _getNavFieldVal(fieldName: string, item: TItem): any;
        protected _setNavFieldVal(fieldName: string, item: TItem, value: any): void;
        protected _beforeLoad(query: DataQuery<TItem, TObj>, oldQuery: DataQuery<TItem, TObj>): void;
        protected _getChildToParentNames(childFieldName: string): string[];
        protected _afterFill(result: IQueryResult<TItem>, isClearAll?: boolean): void;
        protected _fillFromService(info: IFillFromServiceArgs): IQueryResult<TItem>;
        protected _fillFromCache(args: IFillFromCacheArgs): IQueryResult<TItem>;
        protected _commitChanges(rows: IRowInfo[]): void;
        protected _setItemInvalid(row: IRowInfo): TItem;
        protected _getChanges(): IRowInfo[];
        protected _getTrackAssocInfo(): ITrackAssoc[];
        protected _addToChanged(item: TItem): void;
        protected _removeFromChanged(key: string): void;
        protected _setQuery(query: DataQuery<TItem, TObj>): void;
        protected _onItemStatusChanged(item: TItem, oldStatus: ITEM_STATUS): void;
        protected _onRemoved(item: TItem): void;
        protected _onLoaded(items: TItem[]): void;
        protected _destroyQuery(): void;
        protected _getNames(): IFieldName[];
        getFieldMap(): IIndexer<IFieldInfo>;
        getFieldInfos(): IFieldInfo[];
        createEntityFromObj(obj: TObj, key?: string): TItem;
        createEntityFromData(row: IRowData, fieldNames: IFieldName[]): TItem;
        _getInternal(): IInternalDbSetMethods<TItem, TObj>;
        refreshData(data: {
            names: IFieldName[];
            rows: IRowData[];
        }): void;
        fillData(data: {
            names: IFieldName[];
            rows: IRowData[];
        }, isAppend?: boolean): IQueryResult<TItem>;
        fillItems(data: TObj[], isAppend?: boolean): IQueryResult<TItem>;
        addOnLoaded(fn: TEventHandler<DbSet<TItem, TObj, TDbContext>, IDbSetLoadedArgs<TObj>>, nmspace?: string, context?: IBaseObject, priority?: TPriority): void;
        offOnLoaded(nmspace?: string): void;
        waitForNotBusy(callback: () => void, groupName: string): void;
        getFieldInfo(fieldName: string): IFieldInfo;
        sort(fieldNames: string[], sortOrder: SORT_ORDER): IPromise<any>;
        acceptChanges(): void;
        rejectChanges(): void;
        deleteOnSubmit(item: TItem): void;
        clear(): void;
        createQuery(name: string): DataQuery<TItem, TObj>;
        toString(): string;
        get dbContext(): TDbContext;
        get dbSetName(): string;
        get query(): DataQuery<TItem, TObj>;
        get isHasChanges(): boolean;
        get cacheSize(): number;
        get isSubmitOnDelete(): boolean;
        set isSubmitOnDelete(v: boolean);
        get isBusy(): boolean;
    }
    export type TDbSet = DbSet;
}
declare module "jriapp_db/dbsets" {
    import { BaseObject, TEventHandler, IBaseObject } from "jriapp_shared";
    import { IEntityItem } from "jriapp_db/int";
    import { DbContext } from "jriapp_db/dbcontext";
    import { IDbSetConstructor, TDbSet } from "jriapp_db/dbset";
    export type TDbSetCreatingArgs = {
        name: string;
        dbSetType: IDbSetConstructor<IEntityItem, any>;
    };
    export class DbSets extends BaseObject {
        private _dbContext;
        private _dbSets;
        private _arrDbSets;
        constructor(dbContext: DbContext);
        dispose(): void;
        protected _dbSetCreated(dbSet: TDbSet): void;
        protected _createDbSet(name: string, dbSetType: IDbSetConstructor<IEntityItem, any>): void;
        addOnDbSetCreating(fn: TEventHandler<this, TDbSetCreatingArgs>, nmspace?: string, context?: IBaseObject): void;
        offOnDbSetCreating(nmspace?: string): void;
        get dbSetNames(): string[];
        get arrDbSets(): TDbSet[];
        findDbSet(name: string): TDbSet;
        getDbSet(name: string): TDbSet;
    }
}
declare module "jriapp_db/association" {
    import { BaseObject, IIndexer } from "jriapp_shared";
    import { ITEM_STATUS } from "jriapp_shared/collection/const";
    import { ICollChangedArgs, IFieldInfo } from "jriapp_shared/collection/int";
    import { DELETE_ACTION } from "jriapp_db/const";
    import { IAssocConstructorOptions, IEntityItem } from "jriapp_db/int";
    import { TDbSet } from "jriapp_db/dbset";
    export class Association extends BaseObject {
        private _uniqueID;
        private _name;
        private _dbContext;
        private _onDeleteAction;
        private _parentDS;
        private _childDS;
        private _parentFldInfos;
        private _childFldInfos;
        private _parentToChildrenName;
        private _childToParentName;
        private _parentMap;
        private _childMap;
        private _saveParentFKey;
        private _saveChildFKey;
        private _debounce;
        private _notifyBound;
        private _changed;
        constructor(options: IAssocConstructorOptions);
        dispose(): void;
        handleError(error: any, source: any): boolean;
        protected _bindParentDS(): void;
        protected _bindChildDS(): void;
        protected _onParentCollChanged(args: ICollChangedArgs<IEntityItem>): void;
        protected _onParentEdit(item: IEntityItem, isBegin: boolean, isCanceled: boolean): void;
        protected _onParentCommitChanges(item: IEntityItem, isBegin: boolean, isRejected: boolean, status: ITEM_STATUS): void;
        protected _storeParentFKey(item: IEntityItem): void;
        protected _checkParentFKey(item: IEntityItem): void;
        protected _onParentStatusChanged(item: IEntityItem, _oldStatus: ITEM_STATUS): void;
        protected _onChildCollChanged(args: ICollChangedArgs<IEntityItem>): void;
        protected _notifyChildrenChanged(changed: string[]): void;
        protected _notifyParentChanged(changed: string[]): void;
        protected _notifyChanged(changedPkeys: string[], changedCkeys: string[]): void;
        private _notify;
        protected _onChildEdit(item: IEntityItem, isBegin: boolean, isCanceled: boolean): void;
        protected _onChildCommitChanges(item: IEntityItem, isBegin: boolean, isRejected: boolean, status: ITEM_STATUS): void;
        protected _storeChildFKey(item: IEntityItem): void;
        protected _checkChildFKey(item: IEntityItem): void;
        protected _onChildStatusChanged(item: IEntityItem, _oldStatus: ITEM_STATUS): void;
        protected _getItemKey(finf: IFieldInfo[], ds: TDbSet, item: IEntityItem): string;
        protected _resetChildMap(): void;
        protected _resetParentMap(): void;
        protected _unMapChildItem(item: IEntityItem): string;
        protected _unMapParentItem(item: IEntityItem): string;
        protected _mapParentItems(items: IEntityItem[]): string[];
        protected _onChildrenChanged(fkey: string, parent: IEntityItem): void;
        protected _onParentChanged(fkey: string, map: IIndexer<IEntityItem>): void;
        protected _mapChildren(items: IEntityItem[]): string[];
        protected _unbindParentDS(): void;
        protected _unbindChildDS(): void;
        protected refreshParentMap(): string[];
        protected refreshChildMap(): string[];
        getParentFKey(item: IEntityItem): string;
        getChildFKey(item: IEntityItem): string;
        isParentChild(parent: IEntityItem, child: IEntityItem): boolean;
        getChildItems(parent: IEntityItem): IEntityItem[];
        getParentItem(item: IEntityItem): IEntityItem;
        toString(): string;
        get name(): string;
        get parentToChildrenName(): string;
        get childToParentName(): string;
        get parentDS(): TDbSet;
        get childDS(): TDbSet;
        get parentFldInfos(): IFieldInfo[];
        get childFldInfos(): IFieldInfo[];
        get onDeleteAction(): DELETE_ACTION;
    }
}
declare module "jriapp_db/error" {
    import { BaseError } from "jriapp_shared";
    import { IEntityItem } from "jriapp_db/int";
    import { DATA_OPER } from "jriapp_db/const";
    export class DataOperationError extends BaseError {
        private _operationName;
        protected _origError: any;
        constructor(originalError: any, operationName: DATA_OPER);
        get operationName(): DATA_OPER;
        get origError(): any;
    }
    export class AccessDeniedError extends DataOperationError {
    }
    export class ConcurrencyError extends DataOperationError {
    }
    export class SvcValidationError extends DataOperationError {
    }
    export class SubmitError extends DataOperationError {
        private _allSubmitted;
        private _notValidated;
        constructor(origError: any, allSubmitted: IEntityItem[], notValidated: IEntityItem[]);
        get allSubmitted(): IEntityItem[];
        get notValidated(): IEntityItem[];
    }
}
declare module "jriapp_db/dbcontext" {
    import { COLL_CHANGE_REASON } from "jriapp_shared/collection/const";
    import { IIndexer, IPromise, IBaseObject, TEventHandler, TErrorHandler, BaseObject, IStatefulPromise, IAbortablePromise } from "jriapp_shared";
    import { IEntityItem, IRefreshResponse, IQueryResult, IQueryInfo, IAssociationInfo, IPermissionsInfo, IInvokeRequest, IInvokeResponse, IQueryResponse, IChangeRequest, IChangeResponse, ISubset } from "jriapp_db/int";
    import { DATA_OPER } from "jriapp_db/const";
    import { TDbSet } from "jriapp_db/dbset";
    import { DbSets, TDbSetCreatingArgs } from "jriapp_db/dbsets";
    import { Association } from "jriapp_db/association";
    import { TDataQuery } from "jriapp_db/dataquery";
    export interface IInternalDbxtMethods {
        onItemRefreshed(res: IRefreshResponse, item: IEntityItem): void;
        refreshItem(item: IEntityItem): IStatefulPromise<IEntityItem>;
        getQueryInfo(name: string): IQueryInfo;
        onDbSetHasChangesChanged(eSet: TDbSet): void;
        load(query: TDataQuery, reason: COLL_CHANGE_REASON): IStatefulPromise<IQueryResult<IEntityItem>>;
    }
    export type TSubmitErrArgs = {
        error: any;
        isHandled: boolean;
        context: IIndexer<any>;
    };
    export type TSubmittingArgs = {
        isCancelled: boolean;
        context: IIndexer<any>;
    };
    export type TSubmittedArgs = {
        context: IIndexer<any>;
    };
    export abstract class DbContext<TDbSets extends DbSets = DbSets, TMethods = any, TAssoc = any> extends BaseObject {
        private _requestHeaders;
        private _requests;
        private _initState;
        private _dbSets;
        private _svcMethods;
        private _assoc;
        private _arrAssoc;
        private _queryInfo;
        private _serviceUrl;
        private _isSubmiting;
        private _isHasChanges;
        private _pendingSubmit;
        private _serverTimezone;
        private _waitQueue;
        private _internal;
        constructor();
        dispose(): void;
        protected abstract _createDbSets(): TDbSets;
        protected abstract _createAssociations(): IAssociationInfo[];
        protected abstract _createMethods(): IQueryInfo[];
        protected _checkDisposed(): void;
        protected _initDbSets(): void;
        protected _initAssociations(associations: IAssociationInfo[]): void;
        protected _initMethods(methods: IQueryInfo[]): void;
        protected _updatePermissions(info: IPermissionsInfo): void;
        protected _initAssociation(assoc: IAssociationInfo): void;
        protected _initMethod(methodInfo: IQueryInfo): void;
        protected _addRequestPromise(req: IAbortablePromise<any>, operType: DATA_OPER, name?: string): void;
        protected _tryAbortRequest(operType: DATA_OPER[], name: string): void;
        protected _getMethodParams(methodInfo: IQueryInfo, args: {
            [paramName: string]: any;
        }): IInvokeRequest;
        protected _invokeMethod(methodInfo: IQueryInfo, args: {
            [paramName: string]: any;
        }): IStatefulPromise<IInvokeResponse>;
        protected _loadFromCache(query: TDataQuery, reason: COLL_CHANGE_REASON): IStatefulPromise<IQueryResult<IEntityItem>>;
        protected _loadSubsets(subsets: ISubset[], refreshOnly?: boolean, isClearAll?: boolean): void;
        protected _onLoaded(response: IQueryResponse, query: TDataQuery, reason: COLL_CHANGE_REASON): IStatefulPromise<IQueryResult<IEntityItem>>;
        protected _dataSaved(response: IChangeResponse, context: IIndexer<any>): void;
        protected _getChanges(): IChangeRequest;
        protected _getUrl(action: string): string;
        protected _onDataOperError(ex: any, oper: DATA_OPER): boolean;
        protected _onSubmitError(error: any, context: IIndexer<any>): void;
        protected _onSubmitting(context: IIndexer<any>): boolean;
        protected _onSubmitted(context: IIndexer<any>): void;
        protected waitForNotBusy(callback: () => void): void;
        protected waitForNotSubmiting(callback: () => void): void;
        protected _loadInternal(context: {
            query: TDataQuery;
            reason: COLL_CHANGE_REASON;
            loadPageCount: number;
            pageIndex: number;
            isPagingEnabled: boolean;
            dbSetName: string;
            dbSet: TDbSet;
            fn_onStart: () => void;
            fn_onEnd: () => void;
            fn_onOK: (res: IQueryResult<IEntityItem>) => void;
            fn_onErr: (ex: any) => void;
        }): void;
        protected _onItemRefreshed(res: IRefreshResponse, item: IEntityItem): void;
        protected _loadRefresh(args: {
            item: IEntityItem;
            dbSet: TDbSet;
            fn_onStart: () => void;
            fn_onEnd: () => void;
            fn_onErr: (ex: any) => void;
            fn_onOK: (res: IRefreshResponse) => void;
        }): IStatefulPromise;
        protected _refreshItem(item: IEntityItem): IStatefulPromise<IEntityItem>;
        protected _getQueryInfo(name: string): IQueryInfo;
        protected _onDbSetHasChangesChanged(dbSet: TDbSet): void;
        protected _load(query: TDataQuery, reason: COLL_CHANGE_REASON): IStatefulPromise<IQueryResult<IEntityItem>>;
        protected _submitChanges(args: {
            fn_onStart: () => void;
            fn_onEnd: () => void;
            fn_onErr: (ex: any) => void;
            fn_onOk: () => void;
        }, context: IIndexer<any>): void;
        _getInternal(): IInternalDbxtMethods;
        initialize(options: {
            serviceUrl: string;
            permissions?: IPermissionsInfo;
        }): IPromise;
        addOnDisposed(handler: TEventHandler<DbContext, any>, nmspace?: string, context?: object): void;
        offOnDisposed(nmspace?: string): void;
        addOnError(handler: TErrorHandler<DbContext>, nmspace?: string, context?: object): void;
        offOnError(nmspace?: string): void;
        addOnSubmitting(fn: TEventHandler<DbContext, TSubmittingArgs>, nmspace?: string, context?: IBaseObject): void;
        offOnSubmitting(nmspace?: string): void;
        addOnSubmitted(fn: TEventHandler<DbContext, TSubmittedArgs>, nmspace?: string, context?: IBaseObject): void;
        offOnSubmitted(nmspace?: string): void;
        addOnSubmitError(fn: TEventHandler<DbContext, TSubmitErrArgs>, nmspace?: string, context?: IBaseObject): void;
        offOnSubmitError(nmspace?: string): void;
        addOnDbSetCreating(fn: TEventHandler<this, TDbSetCreatingArgs>, nmspace?: string, context?: IBaseObject): void;
        offOnDbSetCreating(nmspace?: string): void;
        getDbSet(name: string): TDbSet;
        findDbSet(name: string): TDbSet;
        getAssociation(name: string): Association;
        submitChanges(): IPromise;
        load(query: TDataQuery): IStatefulPromise<IQueryResult<IEntityItem>>;
        acceptChanges(): void;
        rejectChanges(): void;
        abortRequests(reason?: string, operType?: DATA_OPER): void;
        get associations(): TAssoc;
        get serviceMethods(): TMethods;
        get dbSets(): TDbSets;
        get serviceUrl(): string;
        get isInitialized(): boolean;
        get isBusy(): boolean;
        get isSubmiting(): boolean;
        get serverTimezone(): number;
        get isHasChanges(): boolean;
        get requestCount(): number;
        get requestHeaders(): IIndexer<string>;
        set requestHeaders(v: IIndexer<string>);
    }
}
declare module "jriapp_db/entity_aspect" {
    import { ITEM_STATUS, VALS_VERSION } from "jriapp_shared/collection/const";
    import { IBaseObject, IPromise, IIndexer, IStatefulPromise } from "jriapp_shared";
    import { IFieldInfo } from "jriapp_shared/collection/int";
    import { ItemAspect } from "jriapp_shared/collection/aspect";
    import { REFRESH_MODE } from "jriapp_db/const";
    import { DbContext } from "jriapp_db/dbcontext";
    import { IEntityItem, IValueChange, IRowInfo } from "jriapp_db/int";
    import { DbSet } from "jriapp_db/dbset";
    export class EntityAspect<TItem extends IEntityItem = IEntityItem, TObj extends IIndexer<any> = IIndexer<any>, TDbContext extends DbContext = DbContext> extends ItemAspect<TItem, TObj> {
        private _srvKey;
        private _origVals;
        private _savedStatus;
        private _disposables;
        constructor(dbSet: DbSet<TItem, TObj, TDbContext>, vals: TObj, key: string, isNew: boolean);
        dispose(): void;
        protected _getValue(name: string, ver: VALS_VERSION): any;
        protected _setValue(name: string, val: any, ver: VALS_VERSION): void;
        protected _storeVals(toVer: VALS_VERSION): void;
        protected _restoreVals(fromVer: VALS_VERSION): void;
        protected _onFieldChanged(fieldName: string, fieldInfo?: IFieldInfo): void;
        protected _getValueChange(fullName: string, fieldInfo: IFieldInfo, changedOnly: boolean): IValueChange;
        protected _getValueChanges(changedOnly: boolean): IValueChange[];
        protected _fldChanging(_fieldName: string, _fieldInfo: IFieldInfo, _oldV: any, _newV: any): boolean;
        protected _skipValidate(fieldInfo: IFieldInfo, val: any): boolean;
        protected _beginEdit(): boolean;
        protected _endEdit(): boolean;
        protected _cancelEdit(): boolean;
        protected _setStatus(v: ITEM_STATUS): void;
        _addDisposable(obj: IBaseObject): void;
        _updateKeys(key: string): void;
        _checkCanRefresh(): void;
        _refreshValue(val: any, fullName: string, refreshMode: REFRESH_MODE): void;
        _refreshValues(rowInfo: IRowInfo, refreshMode: REFRESH_MODE): void;
        _getRowInfo(): IRowInfo;
        _getCalcFieldVal(fieldName: string): any;
        _getNavFieldVal(fieldName: string): any;
        _setNavFieldVal(fieldName: string, value: any): void;
        _clearFieldVal(fieldName: string): void;
        _getFieldVal(fieldName: string): any;
        _setFieldVal(fieldName: string, val: any): boolean;
        _setSrvKey(v: string): void;
        _acceptChanges(rowInfo?: IRowInfo): void;
        deleteItem(): boolean;
        deleteOnSubmit(): boolean;
        acceptChanges(): void;
        rejectChanges(): void;
        submitChanges(): IPromise;
        refresh(): IStatefulPromise<TItem>;
        toString(): string;
        protected get hasOrigVals(): boolean;
        get srvKey(): string;
        get isCanSubmit(): boolean;
        get dbSetName(): string;
        get serverTimezone(): number;
        get dbSet(): DbSet<TItem, TObj, TDbContext>;
    }
}
declare module "jriapp_db/int" {
    import { DATE_CONVERSION, FILTER_TYPE, DATA_TYPE, SORT_ORDER, COLL_CHANGE_REASON } from "jriapp_shared/collection/const";
    import { ICollectionItem, IPermissions as ICollPermissions, IFieldInfo } from "jriapp_shared/collection/int";
    import { DELETE_ACTION } from "jriapp_db/const";
    import { EntityAspect } from "jriapp_db/entity_aspect";
    import { DbContext } from "jriapp_db/dbcontext";
    export interface IFieldName {
        n: string;
        p: IFieldName[];
    }
    export interface IEntityItem extends ICollectionItem {
        readonly _aspect: EntityAspect<IEntityItem, any, DbContext>;
    }
    export interface IKV {
        key: string;
        val: any;
    }
    export interface ICachedPage {
        keys: string[];
        pageIndex: number;
    }
    export interface IQueryParamInfo {
        readonly dataType: DATA_TYPE;
        readonly dateConversion: DATE_CONVERSION;
        readonly isArray: boolean;
        readonly isNullable: boolean;
        readonly name: string;
        readonly ordinal: number;
    }
    export interface IQueryInfo {
        isQuery: boolean;
        methodName: string;
        methodResult: boolean;
        parameters: IQueryParamInfo[];
    }
    export interface IValueChange {
        val: any;
        orig: any;
        fieldName: string;
        flags: number;
        nested: IValueChange[];
    }
    export interface IValidationErrorInfo {
        fieldName: string;
        message: string;
    }
    export interface IRowInfo {
        values: IValueChange[];
        changeType: number;
        serverKey: string;
        clientKey: string;
        error: string;
        invalid?: IValidationErrorInfo[];
    }
    export interface IPermissions extends ICollPermissions {
        dbSetName: string;
    }
    export interface IPermissionsInfo {
        serverTimezone: number;
        permissions: IPermissions[];
    }
    export interface IParamInfo {
        parameters: {
            name: string;
            value: any;
        }[];
    }
    export interface IErrorInfo {
        name: string;
        message: string;
    }
    export interface ISubset {
        names: IFieldName[];
        rows: IRowData[];
        dbSetName: string;
    }
    export interface IInvokeRequest {
        methodName: string;
        paramInfo: IParamInfo;
    }
    export interface IInvokeResponse {
        result: any;
        error: IErrorInfo;
    }
    export interface IRefreshRequest {
        dbSetName: string;
        rowInfo: IRowInfo;
    }
    export interface IRefreshResponse {
        dbSetName: string;
        rowInfo: IRowInfo;
        error: {
            name: string;
            message: string;
        };
    }
    export interface IDbSetConstuctorOptions {
        dbContext: DbContext;
        dbSetInfo: IDbSetInfo;
        childAssoc: IAssociationInfo[];
        parentAssoc: IAssociationInfo[];
    }
    export interface IDbSetLoadedArgs<TObj> {
        vals: TObj[];
    }
    export interface IAssocConstructorOptions {
        dbContext: DbContext;
        parentName: string;
        childName: string;
        onDeleteAction: DELETE_ACTION;
        parentKeyFields: string[];
        childKeyFields: string[];
        parentToChildrenName: string;
        childToParentName: string;
        name: string;
    }
    export interface IAssociationInfo {
        childDbSetName: string;
        childToParentName: string;
        name: string;
        onDeleteAction: number;
        parentDbSetName: string;
        parentToChildrenName: string;
        fieldRels: {
            childField: string;
            parentField: string;
        }[];
    }
    export interface IDbSetInfo {
        dbSetName: string;
        enablePaging: boolean;
        pageSize: number;
        fieldInfos: IFieldInfo[];
    }
    export interface IMetadata {
        associations: IAssociationInfo[];
        dbSets: IDbSetInfo[];
        methods: IQueryInfo[];
        serverTimezone: number;
    }
    export interface ITrackAssoc {
        assocName: string;
        parentKey: string;
        childKey: string;
    }
    export interface IChangeRequest {
        dbSets: {
            dbSetName: string;
            rows: IRowInfo[];
        }[];
        trackAssocs: ITrackAssoc[];
    }
    export interface IChangeResponse {
        dbSets: {
            dbSetName: string;
            rows: IRowInfo[];
        }[];
        error: {
            name: string;
            message: string;
        };
        subsets: ISubset[] | null | undefined;
    }
    export interface IFilterInfo {
        filterItems: {
            fieldName: string;
            kind: FILTER_TYPE;
            values: any[];
        }[];
    }
    export interface ISortInfo {
        sortItems: {
            fieldName: string;
            sortOrder: SORT_ORDER;
        }[];
    }
    export interface IQueryRequest {
        dbSetName: string;
        pageIndex: number;
        pageSize: number;
        pageCount: number;
        isIncludeTotalCount: boolean;
        filterInfo: IFilterInfo;
        sortInfo: ISortInfo;
        paramInfo: IParamInfo;
        queryName: string;
    }
    export interface IRowData {
        k: string;
        v: any[];
    }
    export interface IQueryResult<TItem extends IEntityItem> {
        fetchedItems: TItem[];
        items: TItem[];
        newItems: TItem[];
        reason: COLL_CHANGE_REASON;
        outOfBandData: any;
    }
    export interface IQueryResponse {
        names: IFieldName[];
        rows: IRowData[];
        dbSetName: string;
        pageIndex: number;
        pageCount: number;
        totalCount: number;
        extraInfo: any;
        error: IErrorInfo;
        subsets: ISubset[] | null | undefined;
    }
    export interface ICalcFieldImpl<TItem extends IEntityItem> {
        getFunc: (item: TItem) => any;
    }
    export interface INavFieldImpl<TItem extends IEntityItem> {
        getFunc: (item: TItem) => any;
        setFunc: (v: any, item: TItem) => void;
    }
}
declare module "jriapp_db/dataview" {
    import { SORT_ORDER, COLL_CHANGE_REASON, COLL_CHANGE_OPER } from "jriapp_shared/collection/const";
    import { IPromise, TEventHandler, IIndexer } from "jriapp_shared";
    import { ICollection, ICollectionItem, ICollChangedArgs, ICollItemStatusArgs, IFieldInfo, IPermissions } from "jriapp_shared/collection/int";
    import { BaseCollection, Errors } from "jriapp_shared/collection/base";
    import { ItemAspect } from "jriapp_shared/collection/aspect";
    export interface IDataViewOptions<TItem extends ICollectionItem> {
        dataSource: ICollection<TItem>;
        fn_filter?: (item: TItem) => boolean;
        fn_sort?: (item1: TItem, item2: TItem) => number;
        fn_itemsProvider?: (ds: ICollection<TItem>) => TItem[];
        refreshTimeout?: number;
        fn_sortHandler?: (this: DataView<TItem>, fieldNames: string[], sortOrder: SORT_ORDER) => IPromise<any>;
    }
    export class DataView<TItem extends ICollectionItem = ICollectionItem> extends BaseCollection<TItem> {
        private _dataSource;
        private _fn_filter;
        private _fn_sort;
        private _fn_itemsProvider;
        private _fn_sortHandler;
        private _isAddingNew;
        private _refreshDebounce;
        constructor(options: IDataViewOptions<TItem>);
        dispose(): void;
        protected _isOwnsItems(): boolean;
        protected _onAddNew(item: TItem): void;
        protected _filterForPaging(items: TItem[]): TItem[];
        protected _onViewRefreshed(args: {}): void;
        protected _refresh(reason: COLL_CHANGE_REASON): void;
        protected _refreshSync(reason: COLL_CHANGE_REASON): void;
        protected _fillItems(data: {
            items: TItem[];
            reason: COLL_CHANGE_REASON;
            clear: boolean;
            isAppend: boolean;
        }): TItem[];
        protected _onDSCollectionChanged(_: any, args: ICollChangedArgs<TItem>): void;
        protected _onDSStatusChanged(_: any, args: ICollItemStatusArgs<TItem>): void;
        protected _bindDS(): void;
        protected _unbindDS(): void;
        protected _checkCurrentChanging(newCurrent: TItem): void;
        protected _onPageChanged(): void;
        protected _clear(reason: COLL_CHANGE_REASON, oper?: COLL_CHANGE_OPER): void;
        itemFactory(_aspect: ItemAspect<TItem, any>): TItem;
        protected _createNew(): TItem;
        _getStrValue(val: any, fieldInfo: IFieldInfo): string;
        getFieldNames(): string[];
        getFieldInfo(fieldName: string): IFieldInfo;
        getFieldInfos(): IFieldInfo[];
        getFieldMap(): IIndexer<IFieldInfo>;
        addOnViewRefreshed(fn: TEventHandler<DataView<TItem>, any>, nmspace?: string): void;
        offOnViewRefreshed(nmspace?: string): void;
        appendItems(items: TItem[]): TItem[];
        addNew(): TItem;
        removeItem(item: TItem): void;
        sort(fieldNames: string[], sortOrder: SORT_ORDER): IPromise<any>;
        sortLocal(fieldNames: string[], sortOrder: SORT_ORDER): IPromise<any>;
        clear(): void;
        refresh(): void;
        syncRefresh(): void;
        get errors(): Errors<TItem>;
        get dataSource(): ICollection<TItem>;
        get isPagingEnabled(): boolean;
        set isPagingEnabled(v: boolean);
        get permissions(): IPermissions;
        get fn_filter(): (item: TItem) => boolean;
        set fn_filter(v: (item: TItem) => boolean);
        get fn_sort(): (item1: TItem, item2: TItem) => number;
        set fn_sort(v: (item1: TItem, item2: TItem) => number);
        get fn_itemsProvider(): (ds: ICollection<TItem>) => TItem[];
        set fn_itemsProvider(v: (ds: ICollection<TItem>) => TItem[]);
        get fn_sortHandler(): (this: DataView<TItem>, fieldNames: string[], sortOrder: SORT_ORDER) => IPromise<any> | null;
        set fn_sortHandler(v: (this: DataView<TItem>, fieldNames: string[], sortOrder: SORT_ORDER) => IPromise<any> | null);
        toString(): string;
    }
    export type TDataView = DataView;
}
declare module "jriapp_db/child_dataview" {
    import { IEntityItem } from "jriapp_db/int";
    import { Association } from "jriapp_db/association";
    import { DataView } from "jriapp_db/dataview";
    export interface IChildDataViewOptions<TItem extends IEntityItem> {
        association: Association;
        fn_filter?: (item: TItem) => boolean;
        fn_sort?: (item1: TItem, item2: TItem) => number;
        parentItem?: IEntityItem;
        explicitRefresh?: boolean;
    }
    export class ChildDataView<TItem extends IEntityItem = IEntityItem> extends DataView<TItem> {
        private _setParent;
        private _getParent;
        private _association;
        constructor(options: IChildDataViewOptions<TItem>);
        dispose(): void;
        toString(): string;
        get parentItem(): IEntityItem;
        set parentItem(v: IEntityItem);
        get association(): Association;
    }
    export type TChildDataView = ChildDataView;
}
declare module "jriapp_db/complexprop" {
    import { IErrorNotification, IValidationInfo, TEventHandler, BaseObject, IBaseObject } from "jriapp_shared";
    import { IFieldInfo } from "jriapp_shared/collection/int";
    import { IEntityItem } from "jriapp_db/int";
    import { EntityAspect } from "jriapp_db/entity_aspect";
    import { DbContext } from "jriapp_db/dbcontext";
    export abstract class BaseComplexProperty extends BaseObject implements IErrorNotification {
        private _name;
        constructor(name: string);
        getName(): string;
        abstract _addDisposable(obj: IBaseObject): void;
        abstract _getFullPath(path: string): string;
        abstract setValue(fullName: string, value: any): void;
        abstract getValue(fullName: string): any;
        abstract getFieldInfo(): IFieldInfo;
        abstract getProperties(): IFieldInfo[];
        abstract getFullPath(name: string): string;
        abstract getEntity(): EntityAspect<IEntityItem, any, DbContext>;
        getPropertyByName(name: string): IFieldInfo;
        getIsHasErrors(): boolean;
        addOnErrorsChanged(fn: TEventHandler<BaseComplexProperty, any>, nmspace?: string, context?: any): void;
        offOnErrorsChanged(nmspace?: string): void;
        getFieldErrors(fieldName: string): IValidationInfo[];
        getAllErrors(): IValidationInfo[];
        getIErrorNotification(): IErrorNotification;
    }
    export class RootComplexProperty extends BaseComplexProperty {
        private _entity;
        constructor(name: string, owner: EntityAspect);
        _addDisposable(obj: IBaseObject): void;
        _getFullPath(path: string): string;
        setValue(fullName: string, value: any): void;
        getValue(fullName: string): any;
        getFieldInfo(): IFieldInfo;
        getProperties(): IFieldInfo[];
        getEntity(): EntityAspect;
        getFullPath(name: string): string;
    }
    export class ChildComplexProperty extends BaseComplexProperty {
        private _parent;
        constructor(name: string, parent: BaseComplexProperty);
        _addDisposable(obj: IBaseObject): void;
        _getFullPath(path: string): string;
        setValue(fullName: string, value: any): void;
        getValue(fullName: string): any;
        getFieldInfo(): IFieldInfo;
        getProperties(): IFieldInfo[];
        getParent(): BaseComplexProperty;
        getRootProperty(): RootComplexProperty;
        getFullPath(name: string): string;
        getEntity(): EntityAspect;
    }
}
declare module "jriapp_db" {
    export { IFieldName, IEntityItem, IPermissions, IQueryResult, IDbSetLoadedArgs, IErrorInfo, IMetadata, IDbSetConstuctorOptions, IValidationErrorInfo, IPermissionsInfo, IFilterInfo, ISortInfo, IRowData, IAssociationInfo, IQueryInfo } from "jriapp_db/int";
    export { DbSet, TDbSet, IDbSetConstructor, IInternalDbSetMethods } from "jriapp_db/dbset";
    export * from "jriapp_db/dataview";
    export * from "jriapp_db/child_dataview";
    export * from "jriapp_db/association";
    export { REFRESH_MODE, DELETE_ACTION, DATA_OPER, FLAGS } from "jriapp_db/const";
    export * from "jriapp_db/dbcontext";
    export * from "jriapp_db/dbsets";
    export * from "jriapp_db/dataquery";
    export * from "jriapp_db/entity_aspect";
    export * from "jriapp_db/error";
    export * from "jriapp_db/complexprop";
    export const VERSION = "3.0.9";
}
