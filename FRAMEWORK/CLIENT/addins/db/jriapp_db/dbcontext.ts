/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { DATA_TYPE, COLL_CHANGE_REASON } from "jriapp_shared/collection/const";
import {
    IIndexer, IPromise, IBaseObject, TEventHandler, TErrorHandler, LocaleERRS as ERRS,
    BaseObject, Utils, WaitQueue, Lazy, IStatefulPromise, IAbortablePromise, PromiseState } from "jriapp_shared";
import { ValueUtils } from "jriapp_shared/collection/utils";
import {
    IEntityItem, IRefreshRequest, IRefreshResponse, IQueryResult, IQueryInfo, IAssociationInfo, IAssocConstructorOptions,
    IPermissionsInfo, IInvokeRequest, IInvokeResponse, IQueryRequest, IQueryResponse, ITrackAssoc,
    IChangeRequest, IChangeResponse, IRowInfo, ISubset
} from "./int";
import { DATA_OPER, REFRESH_MODE } from "./const";
import { TDbSet } from "./dbset";
import { DbSets, TDbSetCreatingArgs } from "./dbsets";
import { Association } from "./association";
import { TDataQuery } from "./dataquery";
import {
    AccessDeniedError, ConcurrencyError, SvcValidationError,
    DataOperationError, SubmitError
} from "./error";

const utils = Utils, http = utils.http, { isArray, isNt, isFunc, isString } = utils.check,
    { format, endsWith } = utils.str, { getTimeZoneOffset, merge, Indexer } = utils.core, ERROR = utils.err,
    { stringifyValue } = ValueUtils, { delay, createDeferred } = utils.async;

const enum DATA_SVC_METH {
    Invoke = "invoke",
    Query = "query",
    Permissions = "permissions",
    Submit = "save",
    Refresh = "refresh"
}

function fn_checkError(svcError: { name: string; message?: string; }, oper: DATA_OPER) {
    if (!svcError || ERROR.checkIsDummy(svcError)) {
        return;
    }
    switch (svcError.name) {
        case "AccessDeniedException":
            throw new AccessDeniedError(ERRS.ERR_ACCESS_DENIED, oper);
        case "ConcurrencyException":
            throw new ConcurrencyError(ERRS.ERR_CONCURRENCY, oper);
        case "ValidationException":
            throw new SvcValidationError(format(ERRS.ERR_SVC_VALIDATION,
                svcError.message), oper);
        case "DomainServiceException":
            throw new DataOperationError(format(ERRS.ERR_SVC_ERROR,
                svcError.message), oper);
        default:
            throw new DataOperationError(format(ERRS.ERR_UNEXPECTED_SVC_ERROR,
                svcError.message), oper);
    }
}

export interface IInternalDbxtMethods {
    onItemRefreshed(res: IRefreshResponse, item: IEntityItem): void;
    refreshItem(item: IEntityItem): IStatefulPromise<IEntityItem>;
    getQueryInfo(name: string): IQueryInfo;
    onDbSetHasChangesChanged(eSet: TDbSet): void;
    load(query: TDataQuery, reason: COLL_CHANGE_REASON): IStatefulPromise<IQueryResult<IEntityItem>>;
}

interface IRequestPromise {
    req: IAbortablePromise<any>;
    operType: DATA_OPER;
    name: string;
}

const enum DBCTX_EVENTS {
    SUBMITTING = "submitting",
    SUBMITTED = "submitted",
    SUBMIT_ERROR = "submit_error",
    DBSET_CREATING = "dbset_creating"
}

export type TSubmitErrArgs = { error: any, isHandled: boolean, context: IIndexer<any> };
export type TSubmittingArgs = { isCancelled: boolean, context: IIndexer<any> };
export type TSubmittedArgs = { context: IIndexer<any> };

export abstract class DbContext<TDbSets extends DbSets = DbSets, TMethods = any, TAssoc = any> extends BaseObject {
    private _requestHeaders: IIndexer<string>;
    private _requests: IRequestPromise[];
    private _initState: IStatefulPromise<any>;
    private _dbSets: TDbSets;
    private _svcMethods: TMethods;
    private _assoc: TAssoc;
    private _arrAssoc: Association[];
    private _queryInfo: { [queryName: string]: IQueryInfo; };
    private _serviceUrl: string;
    private _isSubmiting: boolean;
    private _isHasChanges: boolean;
    private _pendingSubmit: { promise: IPromise; };
    private _serverTimezone: number;
    private _waitQueue: WaitQueue;
    private _internal: IInternalDbxtMethods;

    constructor() {
        super();
        const self = this;
        this._initState = null;
        this._requestHeaders = Indexer();
        this._requests = [];
        this._dbSets = null;
        this._svcMethods = <TMethods>{};
        this._assoc = <TAssoc>{};
        this._arrAssoc = [];
        this._queryInfo = Indexer();
        this._serviceUrl = null;
        this._isSubmiting = false;
        this._isHasChanges = false;
        this._pendingSubmit = null;
        // at first init it with client side timezone
        this._serverTimezone = getTimeZoneOffset();
        this._waitQueue = new WaitQueue(this);
        this._internal = {
            onItemRefreshed: (res: IRefreshResponse, item: IEntityItem) => {
                self._onItemRefreshed(res, item);
            },
            refreshItem: (item: IEntityItem) => {
                return self._refreshItem(item);
            },
            getQueryInfo: (name: string) => {
                return self._getQueryInfo(name);
            },
            onDbSetHasChangesChanged: (eSet: TDbSet) => {
                self._onDbSetHasChangesChanged(eSet);
            },
            load: (query: TDataQuery, reason: COLL_CHANGE_REASON) => {
                return self._load(query, reason);
            }
        };
        this.objEvents.onProp("isSubmiting", () => {
            self.objEvents.raiseProp("isBusy");
        });
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        this.abortRequests();
        this._waitQueue.dispose();
        this._waitQueue = null;
        for (const assoc of this._arrAssoc)
        {
            assoc.dispose();
        }
        this._arrAssoc = [];
        this._assoc = <TAssoc>{};
        this._dbSets.dispose();
        this._dbSets = null;
        this._svcMethods = <TMethods>{};
        this._queryInfo = Indexer();
        this._serviceUrl = null;
        this._initState = null;
        this._isSubmiting = false;
        this._isHasChanges = false;
        super.dispose();
    }
    protected abstract _createDbSets(): TDbSets;
    protected abstract _createAssociations(): IAssociationInfo[];
    protected abstract _createMethods(): IQueryInfo[];
    protected _checkDisposed(): void {
        if (this.getIsStateDirty()) {
            ERROR.abort("dbContext is disposed");
        }
    }
    protected _initDbSets(): void {
        if (this.isInitialized) {
            throw new Error(ERRS.ERR_DOMAIN_CONTEXT_INITIALIZED);
        }
        this._dbSets = this._createDbSets();
        this._dbSets.addOnDbSetCreating((_, args) => {
            this.objEvents.raise(DBCTX_EVENTS.DBSET_CREATING, args);
        });
        const associations = this._createAssociations();
        this._initAssociations(associations);
        const methods = this._createMethods();
        this._initMethods(methods);
    }
    protected _initAssociations(associations: IAssociationInfo[]): void {
        const self = this;
        for (const assoc of associations)
        {
            self._initAssociation(assoc);
        }
    }
    protected _initMethods(methods: IQueryInfo[]): void {
        const self = this;
        for (const method of methods)
        {
            if (method.isQuery) {
                self._queryInfo[method.methodName] = method;
            } else {
                // service method info
                self._initMethod(method);
            }
        }
    }
    protected _updatePermissions(info: IPermissionsInfo): void {
        this._serverTimezone = info.serverTimezone;
        info.permissions.forEach((perms) => {
            const dbSet = this.findDbSet(perms.dbSetName);
            if (!!dbSet) {
                dbSet._getInternal().updatePermissions(perms);
            }
        });
    }
    protected _initAssociation(assoc: IAssociationInfo): void {
        const self = this, options: IAssocConstructorOptions = {
            dbContext: self,
            parentName: assoc.parentDbSetName,
            childName: assoc.childDbSetName,
            onDeleteAction: assoc.onDeleteAction,
            parentKeyFields: assoc.fieldRels.map((f) => f.parentField),
            childKeyFields: assoc.fieldRels.map((f) => f.childField),
            parentToChildrenName: assoc.parentToChildrenName,
            childToParentName: assoc.childToParentName,
            name: assoc.name
        }, name = `get${assoc.name}`;

        const lazy = new Lazy<Association>(() => {
            const res = new Association(options);
            self._arrAssoc.push(res);
            return res;
        });

        (<any>this._assoc)[name] = () => lazy.Value;
    }
    protected _initMethod(methodInfo: IQueryInfo): void {
        const self = this;
        // function expects method parameters
        (<any>this._svcMethods)[methodInfo.methodName] = (args: { [paramName: string]: any; }) => {
            return self._invokeMethod(methodInfo, args).then((res) => {
                self._checkDisposed();
                if (!res) {
                    throw new Error(format(ERRS.ERR_UNEXPECTED_SVC_ERROR, "operation result is empty"));
                }
                fn_checkError(res.error, DATA_OPER.Invoke);
                return res.result;
            }).catch((err) => {
                self._onDataOperError(err, DATA_OPER.Invoke);
                ERROR.throwDummy(err);
            });
        };
    }
    protected _addRequestPromise(req: IAbortablePromise<any>, operType: DATA_OPER, name?: string): void {
        const self = this, item: IRequestPromise = { req: req, operType: operType, name: name },
            cnt = self._requests.length, oldBusy = this.isBusy;

        self._requests.push(item);
        req.finally(() => {
            if (self.getIsStateDirty()) {
                return;
            }
            const oldBusy = self.isBusy;
            utils.arr.remove(self._requests, item);
            self.objEvents.raiseProp("requestCount");
            if (oldBusy !== self.isBusy) {
                self.objEvents.raiseProp("isBusy");
            }
        });
        if (cnt !== self._requests.length) {
            self.objEvents.raiseProp("requestCount");
        }
        if (oldBusy !== self.isBusy) {
            self.objEvents.raiseProp("isBusy");
        }
    }
    protected _tryAbortRequest(operType: DATA_OPER[], name: string): void {
        const reqs = this._requests.filter((req) => { return req.name === name && operType.indexOf(req.operType) > -1; });
        reqs.forEach((r) => { r.req.abort(); });
    }
    protected _getMethodParams(methodInfo: IQueryInfo, args: { [paramName: string]: any; }): IInvokeRequest {
        const self = this, methodName: string = methodInfo.methodName,
            data: IInvokeRequest = { methodName: methodName, paramInfo: { parameters: [] } },
            paramInfos = methodInfo.parameters;

        if (!args) {
            args = Indexer();
        }

        for (const pinfo of paramInfos) {
            let val = args[pinfo.name];
            if (!pinfo.isNullable && !pinfo.isArray && !(pinfo.dataType === DATA_TYPE.String || pinfo.dataType === DATA_TYPE.Binary) && isNt(val)) {
                throw new Error(format(ERRS.ERR_SVC_METH_PARAM_INVALID, pinfo.name, val, methodInfo.methodName));
            }
            if (isFunc(val)) {
                throw new Error(format(ERRS.ERR_SVC_METH_PARAM_INVALID, pinfo.name, val, methodInfo.methodName));
            }
            if (pinfo.isArray && !isNt(val) && !isArray(val)) {
                val = [val];
            }

            let value: string = null;
            // byte arrays are optimized for serialization
            if (pinfo.dataType === DATA_TYPE.Binary && isArray(val)) {
                value = JSON.stringify(val);
            } else if (isArray(val)) {
                const arr: string[] = [];
                for (const _val of val) {
                    // first convert all values to string
                    arr.push(stringifyValue(_val, pinfo.dateConversion, pinfo.dataType, self.serverTimezone));
                }

                value = JSON.stringify(arr);
            } else {
                value = stringifyValue(val, pinfo.dateConversion, pinfo.dataType, self.serverTimezone);
            }

            data.paramInfo.parameters.push({ name: pinfo.name, value: value });
        }

        return data;
    }
    protected _invokeMethod(methodInfo: IQueryInfo, args: { [paramName: string]: any; }): IStatefulPromise<IInvokeResponse> {
        const self = this;
        return delay<string>(() => {
            self._checkDisposed();
            const data = self._getMethodParams(methodInfo, args);
            return JSON.stringify(data);
        }).then((postData) => {
            self._checkDisposed();
            const invokeUrl = this._getUrl(DATA_SVC_METH.Invoke),
                reqPromise = http.postAjax(invokeUrl, postData, self.requestHeaders);
            self._addRequestPromise(reqPromise, DATA_OPER.Invoke);

            return reqPromise;
        }).then((res: string) => {
            return <IInvokeResponse>JSON.parse(res);
        });
    }
    protected _loadFromCache(query: TDataQuery, reason: COLL_CHANGE_REASON): IStatefulPromise<IQueryResult<IEntityItem>> {
        const self = this;
        return delay<IQueryResult<IEntityItem>>(() => {
            self._checkDisposed();
            const dbSet = query.dbSet;
            return dbSet._getInternal().fillFromCache({ reason: reason, query: query });
        });
    }
    protected _loadSubsets(subsets: ISubset[], refreshOnly: boolean = false, isClearAll: boolean = false): void {
        const self = this, isHasSubsets = isArray(subsets) && subsets.length > 0;
        if (!isHasSubsets) {
            return;
        }

        for (const subset of subsets)
        {
            const dbSet = self.getDbSet(subset.dbSetName);
            if (!refreshOnly) {
                dbSet.fillData(subset, !isClearAll);
            } else {
                dbSet.refreshData(subset);
            }
        }
    }
    protected _onLoaded(response: IQueryResponse, query: TDataQuery, reason: COLL_CHANGE_REASON): IStatefulPromise<IQueryResult<IEntityItem>> {
        const self = this;
        return delay<IQueryResult<IEntityItem>>(() => {
            self._checkDisposed();
            if (isNt(response)) {
                throw new Error(format(ERRS.ERR_UNEXPECTED_SVC_ERROR, "null result"));
            }
            const dbSetName = response.dbSetName, dbSet = self.getDbSet(dbSetName);
            if (isNt(dbSet)) {
                throw new Error(format(ERRS.ERR_DBSET_NAME_INVALID, dbSetName));
            }
            fn_checkError(response.error, DATA_OPER.Query);
            const isClearAll = (!!query && query.isClearPrevData);
            return dbSet._getInternal().fillFromService(
                {
                    res: response,
                    reason: reason,
                    query: query,
                    onFillEnd: () => { self._loadSubsets(response.subsets, false, isClearAll); }
                });
        });
    }
    protected _dataSaved(response: IChangeResponse, context: IIndexer<any>): void {
        const self = this;
        try {
            try {
                fn_checkError(response.error, DATA_OPER.Submit);
            } catch (ex) {
                const submitted: IEntityItem[] = [], notvalid: IEntityItem[] = [];
                response.dbSets.forEach((jsDB) => {
                    const dbSet = self._dbSets.getDbSet(jsDB.dbSetName);
                    for (const row of jsDB.rows)
                    {
                        const item = dbSet.getItemByKey(row.clientKey);
                        if (!item) {
                            throw new Error(format(ERRS.ERR_KEY_IS_NOTFOUND, row.clientKey));
                        }
                        submitted.push(item);
                        if (!!row.invalid) {
                            dbSet._getInternal().setItemInvalid(row);
                            notvalid.push(item);
                        }
                    }
                });
                throw new SubmitError(ex, submitted, notvalid);
            }

            response.dbSets.forEach((jsDB) => {
                self._dbSets.getDbSet(jsDB.dbSetName)._getInternal().commitChanges(jsDB.rows);
            });
        } catch (ex) {
            self._onSubmitError(ex, context);
            ERROR.throwDummy(ex);
        }
    }
    protected _getChanges(): IChangeRequest {
        const request: IChangeRequest = { dbSets: [], trackAssocs: [] };
        this._dbSets.arrDbSets.forEach((dbSet) => {
            dbSet.endEdit();
            const changes: IRowInfo[] = dbSet._getInternal().getChanges();
            if (changes.length === 0) {
                return;
            }
            // it is needed to apply updates in parent-child relationship order on the server
            // and provides child to parent map of the keys for the new entities
            const trackAssoc: ITrackAssoc[] = dbSet._getInternal().getTrackAssocInfo(),
                jsDB = { dbSetName: dbSet.dbSetName, rows: changes };
            request.dbSets.push(jsDB);
            request.trackAssocs = request.trackAssocs.concat(trackAssoc);
        });
        return request;
    }
    protected _getUrl(action: string): string {
        let loadUrl = this.serviceUrl;
        if (!endsWith(loadUrl, "/")) {
            loadUrl = loadUrl + "/";
        }
        loadUrl = loadUrl + [action, ""].join("/");
        return loadUrl;
    }
    protected _onDataOperError(ex: any, oper: DATA_OPER): boolean {
        if (ERROR.checkIsDummy(ex)) {
            return true;
        }
        const err: DataOperationError = (ex instanceof DataOperationError) ? ex : new DataOperationError(ex, oper);
        return this.handleError(err, this);
    }
    protected _onSubmitError(error: any, context: IIndexer<any>): void {
        if (ERROR.checkIsDummy(error)) {
            return;
        }
        const args: TSubmitErrArgs = { error: error, isHandled: false, context: context };
        this.objEvents.raise(DBCTX_EVENTS.SUBMIT_ERROR, args);
        if (!args.isHandled) {
            // this.rejectChanges();
            this._onDataOperError(error, DATA_OPER.Submit);
        }
    }
    protected _onSubmitting(context: IIndexer<any>): boolean {
        const submittingArgs: TSubmittingArgs = { isCancelled: false, context: context };
        this.objEvents.raise(DBCTX_EVENTS.SUBMITTING, submittingArgs);
        return !submittingArgs.isCancelled;
    }
    protected _onSubmitted(context: IIndexer<any>): void {
        this.objEvents.raise(DBCTX_EVENTS.SUBMITTED, { context: context } as TSubmittedArgs);
    }
    protected waitForNotBusy(callback: () => void): void {
        this._waitQueue.enQueue({
            prop: "isBusy",
            groupName: null,
            predicate: (val: any) => {
                return !val;
            },
            action: callback,
            actionArgs: []
        });
    }
    protected waitForNotSubmiting(callback: () => void): void {
        this._waitQueue.enQueue({
            prop: "isSubmiting",
            predicate: (val: any) => {
                return !val;
            },
            action: callback,
            actionArgs: [],
            groupName: "submit",
            lastWins: true
        });
    }
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
    }): void {
        const self = this;
        context.fn_onStart();

        delay<IQueryResult<IEntityItem>>(() => {
            self._checkDisposed();

            const oldQuery = context.dbSet.query,
                loadPageCount = context.loadPageCount,
                isPagingEnabled = context.isPagingEnabled;

            let range: { start: number; end: number; cnt: number; }, pageCount = 1,
                pageIndex = context.pageIndex;
            // restore pageIndex if it was changed while loading
            context.query.pageIndex = pageIndex;
            context.dbSet._getInternal().beforeLoad(context.query, oldQuery);
            // sync pageIndex
            pageIndex = context.query.pageIndex;

            if (loadPageCount > 1 && isPagingEnabled) {
                if (context.query._getInternal().isPageCached(pageIndex)) {
                    return self._loadFromCache(context.query, context.reason);
                } else {
                    range = context.query._getInternal().getCache().getNextRange(pageIndex);
                    pageIndex = range.start;
                    pageCount = range.cnt;
                }
            }

            const requestInfo: IQueryRequest = {
                dbSetName: context.dbSetName,
                pageIndex: context.query.isPagingEnabled ? pageIndex : -1,
                pageSize: context.query.pageSize,
                pageCount: pageCount,
                isIncludeTotalCount: context.query.isIncludeTotalCount,
                filterInfo: context.query.filterInfo,
                sortInfo: context.query.sortInfo,
                paramInfo: self._getMethodParams(context.query._getInternal().getQueryInfo(), context.query.params).paramInfo,
                queryName: context.query.queryName
            };

            const reqPromise = http.postAjax(self._getUrl(DATA_SVC_METH.Query), JSON.stringify(requestInfo), self.requestHeaders);
            self._addRequestPromise(reqPromise, DATA_OPER.Query, requestInfo.dbSetName);

            return reqPromise.then((res: string) => {
                return <IQueryResponse>JSON.parse(res);
            }).then((response: IQueryResponse) => {
                self._checkDisposed();
                return self._onLoaded(response, context.query, context.reason);
            });
        }).then((loadRes) => {
            self._checkDisposed();
            context.fn_onOK(loadRes);
        }).catch((err) => {
            context.fn_onErr(err);
        });
    }
    protected _onItemRefreshed(res: IRefreshResponse, item: IEntityItem): void {
        try {
            fn_checkError(res.error, DATA_OPER.Refresh);
            if (!res.rowInfo) {
                item._aspect.dbSet.removeItem(item);
                item.dispose();
                throw new Error(ERRS.ERR_ITEM_DELETED_BY_ANOTHER_USER);
            } else {
                item._aspect._refreshValues(res.rowInfo, REFRESH_MODE.MergeIntoCurrent);
            }
        } catch (ex) {
            this._onDataOperError(ex, DATA_OPER.Refresh);
            ERROR.throwDummy(ex);
        }
    }
    protected _loadRefresh(args: {
        item: IEntityItem;
        dbSet: TDbSet;
        fn_onStart: () => void;
        fn_onEnd: () => void;
        fn_onErr: (ex: any) => void;
        fn_onOK: (res: IRefreshResponse) => void;
    }): IStatefulPromise {
        const self = this;
        args.fn_onStart();

        return delay().then(() => {
            self._checkDisposed();

            const request: IRefreshRequest = {
                dbSetName: args.item._aspect.dbSetName,
                rowInfo: args.item._aspect._getRowInfo()
            };

            args.item._aspect._checkCanRefresh();
            const url = self._getUrl(DATA_SVC_METH.Refresh),
                reqPromise = http.postAjax(url, JSON.stringify(request), self.requestHeaders);

            self._addRequestPromise(reqPromise, DATA_OPER.Refresh);
            return reqPromise;
        }).then((res: string) => {
            return <IRefreshResponse>JSON.parse(res);
        }).then((res: IRefreshResponse) => {
            self._checkDisposed();
            args.fn_onOK(res);
        }).catch((err) => {
            args.fn_onErr(err);
        });
    }
    protected _refreshItem(item: IEntityItem): IStatefulPromise<IEntityItem> {
        const self = this, deferred = createDeferred<IEntityItem>();
        const context = {
            item: item,
            dbSet: item._aspect.dbSet,
            fn_onStart: () => {
                context.item._aspect._setIsRefreshing(true);
                context.dbSet._getInternal().setIsLoading(true);
            },
            fn_onEnd: () => {
                context.dbSet._getInternal().setIsLoading(false);
                context.item._aspect._setIsRefreshing(false);
            },
            fn_onErr: (ex: any) => {
                try {
                    context.fn_onEnd();
                    self._onDataOperError(ex, DATA_OPER.Refresh);
                } finally {
                    deferred.reject();
                }
            },
            fn_onOK: (res: IRefreshResponse) => {
                try {
                    self._onItemRefreshed(res, item);
                    context.fn_onEnd();
                } finally {
                    deferred.resolve(item);
                }
            }
        };

        context.dbSet.waitForNotBusy(() => {
            try {
                self._checkDisposed();
                self._loadRefresh(context);
            } catch (err) {
                context.fn_onErr(err);
            }
        }, item._key);
        return deferred.promise();
    }
    protected _getQueryInfo(name: string): IQueryInfo {
        return this._queryInfo[name];
    }
    protected _onDbSetHasChangesChanged(dbSet: TDbSet): void {
        const old = this._isHasChanges;
        this._isHasChanges = false;
        if (dbSet.isHasChanges) {
            this._isHasChanges = true;
        } else {
            const len = this._dbSets.arrDbSets.length;
            for (let i = 0; i < len; i += 1) {
                const test = this._dbSets.arrDbSets[i];
                if (test.isHasChanges) {
                    this._isHasChanges = true;
                    break;
                }
            }
        }
        if (this._isHasChanges !== old) {
            this.objEvents.raiseProp("isHasChanges");
        }
    }
    protected _load(query: TDataQuery, reason: COLL_CHANGE_REASON): IStatefulPromise<IQueryResult<IEntityItem>> {
        if (!query) {
            throw new Error(ERRS.ERR_DB_LOAD_NO_QUERY);
        }

        const self = this, deferred = createDeferred<IQueryResult<IEntityItem>>();
        let prevQuery: any = null;

        const context = {
            query: query,
            reason: reason,
            loadPageCount: query.loadPageCount,
            pageIndex: query.pageIndex,
            isPagingEnabled: query.isPagingEnabled,
            dbSetName: query.dbSetName,
            dbSet: self.getDbSet(query.dbSetName),
            fn_onStart: () => {
                context.dbSet._getInternal().setIsLoading(true);
                if (context.query.isForAppend) {
                    prevQuery = context.dbSet.query;
                }
            },
            fn_onEnd: () => {
                if (context.query.isForAppend) {
                    context.dbSet._getInternal().setQuery(prevQuery);
                    context.query.dispose();
                }
                context.dbSet._getInternal().setIsLoading(false);
            },
            fn_onOK: (res: IQueryResult<IEntityItem>) => {
                try {
                    context.fn_onEnd();
                } finally {
                    deferred.resolve(res);
                }
            },
            fn_onErr: (ex: any) => {
                try {
                    context.fn_onEnd();
                    self._onDataOperError(ex, DATA_OPER.Query);
                } finally {
                    deferred.reject();
                }
            }
        };

        if (query.isClearPrevData) {
            self._tryAbortRequest([DATA_OPER.Query, DATA_OPER.Refresh], context.dbSetName);
        }

        context.dbSet.waitForNotBusy(() => {
            try {
                self._checkDisposed();
                self._loadInternal(context);
            } catch (err) {
                context.fn_onErr(err);
            }
        }, query.isClearPrevData ? context.dbSetName : null);

        return deferred.promise();
    }
    protected _submitChanges(args: {
        fn_onStart: () => void;
        fn_onEnd: () => void;
        fn_onErr: (ex: any) => void;
        fn_onOk: () => void;
    }, context: IIndexer<any>): void {
        const self = this, noChanges = "NO_CHANGES";
       
        args.fn_onStart();

        delay<IChangeRequest>(() => {
            self._checkDisposed();
            const res = self._getChanges();
            if (res.dbSets.length === 0) {
                ERROR.abort(noChanges);
            }
            return res;
        }).then((changes) => {
            const reqPromise = http.postAjax(self._getUrl(DATA_SVC_METH.Submit), JSON.stringify(changes), self.requestHeaders);
            self._addRequestPromise(reqPromise, DATA_OPER.Submit);
            return reqPromise;
        }).then((res: string) => {
            return <IChangeResponse>JSON.parse(res);
        }).then((res: IChangeResponse) => {
            self._checkDisposed();
            self._dataSaved(res, context);
            if (!!res.subsets) {
                self._loadSubsets(res.subsets, true);
            }
        }).then(() => {
            self._checkDisposed();
            args.fn_onOk();
        }).catch((er) => {
            if (!self.getIsStateDirty() && ERROR.checkIsAbort(er) && er.reason === noChanges) {
                args.fn_onOk();
            } else {
                args.fn_onErr(er);
            }
        });
    }
    _getInternal(): IInternalDbxtMethods {
        return this._internal;
    }
    initialize(options: {
        serviceUrl: string;
        permissions?: IPermissionsInfo;
    }): IPromise {
        if (!!this._initState) {
            return this._initState;
        }
        const self = this, opts = merge(options, {
            serviceUrl: <string>null,
            permissions: <IPermissionsInfo>null
        });
        if (!isString(opts.serviceUrl)) {
            throw new Error(format(ERRS.ERR_PARAM_INVALID, "serviceUrl", opts.serviceUrl));
        }
        this._serviceUrl = opts.serviceUrl;
        this._initDbSets();

        this._initState = delay<IPermissionsInfo>(() => {
            if (!!opts.permissions) {
                return opts.permissions;
            } else {
                // initialize by obtaining metadata from the data service by ajax call
                const loadUrl = this._getUrl(DATA_SVC_METH.Permissions);
                const ajaxPromise = http.getAjax(loadUrl, self.requestHeaders);
                this._addRequestPromise(ajaxPromise, DATA_OPER.Init);
                return ajaxPromise.then((permissions: string) => {
                    return <IPermissionsInfo>JSON.parse(permissions);
                });
            }
        }).then((res: IPermissionsInfo) => {
            self._checkDisposed();
            self._updatePermissions(res);
            self.objEvents.raiseProp("isInitialized");
        }).catch((err) => {
            self._onDataOperError(err, DATA_OPER.Init);
            ERROR.throwDummy(err);
        });

        return this._initState;
    }
    addOnDisposed(handler: TEventHandler<DbContext, any>, nmspace?: string, context?: object): void {
        this.objEvents.addOnDisposed(handler, nmspace, context);
    }
    offOnDisposed(nmspace?: string): void {
        this.objEvents.offOnDisposed(nmspace);
    }
    addOnError(handler: TErrorHandler<DbContext>, nmspace?: string, context?: object): void {
        this.objEvents.addOnError(handler, nmspace, context);
    }
    offOnError(nmspace?: string): void {
        this.objEvents.offOnError(nmspace);
    }
    addOnSubmitting(fn: TEventHandler<DbContext, TSubmittingArgs>, nmspace?: string, context?: IBaseObject): void {
        this.objEvents.on(DBCTX_EVENTS.SUBMITTING, fn, nmspace, context);
    }
    offOnSubmitting(nmspace?: string): void {
        this.objEvents.off(DBCTX_EVENTS.SUBMITTING, nmspace);
    }
    addOnSubmitted(fn: TEventHandler<DbContext, TSubmittedArgs>, nmspace?: string, context?: IBaseObject): void {
        this.objEvents.on(DBCTX_EVENTS.SUBMITTED, fn, nmspace, context);
    }
    offOnSubmitted(nmspace?: string): void {
        this.objEvents.off(DBCTX_EVENTS.SUBMITTED, nmspace);
    }
    addOnSubmitError(fn: TEventHandler<DbContext, TSubmitErrArgs>, nmspace?: string, context?: IBaseObject): void {
        this.objEvents.on(DBCTX_EVENTS.SUBMIT_ERROR, fn, nmspace, context);
    }
    offOnSubmitError(nmspace?: string): void {
        this.objEvents.off(DBCTX_EVENTS.SUBMIT_ERROR, nmspace);
    }
    addOnDbSetCreating(fn: TEventHandler<this, TDbSetCreatingArgs>, nmspace?: string, context?: IBaseObject): void {
        this.objEvents.on(DBCTX_EVENTS.DBSET_CREATING, fn, nmspace, context);
    }
    offOnDbSetCreating(nmspace?: string): void {
        this.objEvents.off(DBCTX_EVENTS.DBSET_CREATING, nmspace);
    }
    getDbSet(name: string): TDbSet {
        return this._dbSets.getDbSet(name);
    }
    findDbSet(name: string): TDbSet {
        return this._dbSets.findDbSet(name);
    }
    getAssociation(name: string): Association {
        const name2 = `get${name}`, fn: () => Association = (<any>this._assoc)[name2];
        if (!fn) {
            throw new Error(format(ERRS.ERR_ASSOC_NAME_INVALID, name));
        }
        return fn();
    }
    submitChanges(): IPromise {
        const self = this;
        // don't submit when another submit is already in the queue
        if (!!this._pendingSubmit) {
            return this._pendingSubmit.promise;
        }

        const deferred = createDeferred<void>(), submitState = { promise: deferred.promise() };
        this._pendingSubmit = submitState;
        const context = Indexer(), args = {
            fn_onStart: () => {
                if (!self._isSubmiting) {
                    self._isSubmiting = true;
                    self.objEvents.raiseProp("isSubmiting");
                }
                // allow to post new submit
                self._pendingSubmit = null;
            },
            fn_onEnd: () => {
                if (self._isSubmiting) {
                    self._isSubmiting = false;
                    self.objEvents.raiseProp("isSubmiting");
                }
            },
            fn_onErr: (ex: any) => {
                try {
                    args.fn_onEnd();
                    self._onSubmitError(ex, context);
                } finally {
                    deferred.reject();
                }
            },
            fn_onOk: () => {
                try {
                    args.fn_onEnd();
                } finally {
                    deferred.resolve();
                    self._onSubmitted(context);
                }
            }
        };

        utils.queue.enque(() => {
            self.waitForNotBusy(() => {
                try {
                    self._checkDisposed();
                    if (self._onSubmitting(context)) {
                        self._submitChanges(args, context);
                    }
                } catch (err) {
                    args.fn_onErr(err);
                }
            });
        });

        return submitState.promise;
    }
    load(query: TDataQuery): IStatefulPromise<IQueryResult<IEntityItem>> {
        return this._load(query, COLL_CHANGE_REASON.None);
    }
    acceptChanges(): void {
        this._dbSets.arrDbSets.forEach((dbSet) => {
            dbSet.acceptChanges();
        });
    }
    rejectChanges(): void {
        this._dbSets.arrDbSets.forEach((dbSet) => {
            dbSet.rejectChanges();
        });
    }
    abortRequests(reason?: string, operType?: DATA_OPER): void {
        if (isNt(operType)) {
            operType = DATA_OPER.None;
        }
        const arr: IRequestPromise[] = this._requests.filter((a) => {
            return operType === DATA_OPER.None ? true : (a.operType === operType);
        });

        for (let i = 0; i < arr.length; i += 1) {
            const promise = arr[i];
            promise.req.abort(reason);
        }
    }
    get associations(): TAssoc {
        return this._assoc;
    }
    get serviceMethods(): TMethods {
        return this._svcMethods;
    }
    get dbSets(): TDbSets {
        return this._dbSets;
    }
    get serviceUrl(): string {
        return this._serviceUrl;
    }
    get isInitialized(): boolean {
        return !!this._initState && this._initState.state() === PromiseState.Resolved;
    }
    get isBusy(): boolean {
        return (this.requestCount > 0) || this.isSubmiting;
    }
    get isSubmiting(): boolean {
        return this._isSubmiting;
    }
    get serverTimezone(): number {
        return this._serverTimezone;
    }
    get isHasChanges(): boolean {
        return this._isHasChanges;
    }
    get requestCount(): number {
        return this._requests.length;
    }
    get requestHeaders(): IIndexer<string> {
        return this._requestHeaders;
    }
    set requestHeaders(v: IIndexer<string>) {
        this._requestHeaders = v;
    }
}
