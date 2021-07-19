/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    SORT_ORDER, COLL_CHANGE_TYPE, COLL_CHANGE_REASON, COLL_CHANGE_OPER
} from "jriapp_shared/collection/const";
import {
    IPromise, TEventHandler, TPriority, LocaleERRS as ERRS, Debounce, Utils, IIndexer
} from "jriapp_shared";
import {
    ICollection, ICollectionItem, ICollChangedArgs, ICollItemStatusArgs, IFieldInfo, IPermissions
} from "jriapp_shared/collection/int";
import { BaseCollection, Errors } from "jriapp_shared/collection/base";
import { ItemAspect } from "jriapp_shared/collection/aspect";

const utils = Utils, { isFunc } = utils.check, { format } = utils.str, { extend } = utils.core,
    ERROR = utils.err, sys = utils.sys;

const enum VIEW_EVENTS {
    refreshed = "view_refreshed"
}

export interface IDataViewOptions<TItem extends ICollectionItem> {
    dataSource: ICollection<TItem>;
    fn_filter?: (item: TItem) => boolean;
    fn_sort?: (item1: TItem, item2: TItem) => number;
    fn_itemsProvider?: (ds: ICollection<TItem>) => TItem[];
    refreshTimeout?: number;
    // can be used, if we want to delegate sorting to the underlying dataSource, instead of the default sortLocal
    fn_sortHandler?: (this: DataView<TItem>, fieldNames: string[], sortOrder: SORT_ORDER) => IPromise<any>;
}

export class DataView<TItem extends ICollectionItem = ICollectionItem> extends BaseCollection<TItem> {
    private _dataSource: ICollection<TItem>;
    private _fn_filter: (item: TItem) => boolean | null;
    private _fn_sort: (item1: TItem, item2: TItem) => number | null;
    private _fn_itemsProvider: (ds: ICollection<TItem>) => TItem[] | null;
    private _fn_sortHandler: (this: DataView<TItem>, fieldNames: string[], sortOrder: SORT_ORDER) => IPromise<any> | null;
    private _isAddingNew: boolean;
    private _refreshDebounce: Debounce;

    constructor(options: IDataViewOptions<TItem>) {
        super();
        if (!sys.isCollection(options.dataSource)) {
            throw new Error(ERRS.ERR_DATAVIEW_DATASRC_INVALID);
        }
        if (!!options.fn_filter && !isFunc(options.fn_filter)) {
            throw new Error(ERRS.ERR_DATAVIEW_FILTER_INVALID);
        }
        this._refreshDebounce = new Debounce(options.refreshTimeout || 0);
        this._dataSource = options.dataSource;
        this._fn_filter = options.fn_filter || null;
        this._fn_sort = options.fn_sort || null;
        this._fn_itemsProvider = options.fn_itemsProvider || null;
        this._fn_sortHandler = options.fn_sortHandler || null;
        this._isAddingNew = false;
        this._bindDS();
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        this._refreshDebounce.dispose();
        this._unbindDS();
        this._dataSource = null;
        this._fn_filter = null;
        this._fn_sort = null;
        this._fn_sortHandler = null;
        super.dispose();
    }
    // override
    protected _isOwnsItems(): boolean {
        return false;
    }
    // override
    protected _onAddNew(item: TItem): void {
        const args = {
            changeType: COLL_CHANGE_TYPE.Add,
            reason: COLL_CHANGE_REASON.None,
            oper: COLL_CHANGE_OPER.AddNew,
            items: [item],
            new_key: item._key
        };
        this._onCollectionChanged(args);
    }
    protected _filterForPaging(items: TItem[]): TItem[] {
        // let taken = 0, skipped = 0;
        const len = items.length, skip = this.pageSize * this.pageIndex, take = this.pageSize;
        const start = skip, end = len > (start + take) ? (start + take) : len;
        if (start >= len) {
            return [];
        }
        
        /*
        for (const item of items) {
            if (skipped < skip) {
                skipped += 1;
            } else {
                if (taken < take) {
                    result.push(item);
                    taken += 1;
                } else {
                    break;
                }
            }
        }
        */
        const result = items.slice(start, end);
        return result;
    }
    protected _onViewRefreshed(args: {}): void {
        this.objEvents.raise(VIEW_EVENTS.refreshed, args);
    }
    protected _refresh(reason: COLL_CHANGE_REASON): void {
        this._refreshDebounce.enque(() => {
            this._refreshSync(reason);
        });
    }
    protected _refreshSync(reason: COLL_CHANGE_REASON): void {
        if (this.getIsStateDirty()) {
            return;
        }
        try {
            let items: TItem[];
            const ds = this._dataSource;
            if (!ds || ds.getIsStateDirty()) {
                this.clear();
                this._onViewRefreshed({});
                return;
            }

            if (!!this._fn_itemsProvider) {
                items = this._fn_itemsProvider(ds);
            } else {
                items = ds.items;
            }

            if (!!this._fn_filter) {
                items = items.filter(this._fn_filter);
            }

            if (!!this._fn_sort) {
                items = items.sort(this._fn_sort);
            }
            this._fillItems({ items: items, reason: reason, clear: true, isAppend: false });
            this._onViewRefreshed({});
        } catch (ex) {
            ERROR.reThrow(ex, this.handleError(ex, this));
        }
    }
    protected _fillItems(data: {
        items: TItem[];
        reason: COLL_CHANGE_REASON;
        clear: boolean;
        isAppend: boolean;
    }): TItem[] {
        data = extend({
            items: [],
            reason: COLL_CHANGE_REASON.Refresh,
            clear: true,
            isAppend: false
        }, data);

        const self = this, newItems: TItem[] = [], items: TItem[] = [], isClearAll = !!data.clear;

        if (!!isClearAll) {
            this._clear(data.reason, COLL_CHANGE_OPER.Fill);
        }

        const _items = (this.isPagingEnabled && !data.isAppend) ? this._filterForPaging(data.items) : data.items;

        for (const item of _items) {
            const oldItem = self.getItemByKey(item._key);
            if (!oldItem) {
                self._appendItem(item);
                newItems.push(item);
                items.push(item);
            } else {
                items.push(oldItem);
            }
        }

        if (newItems.length > 0) {
            this._onCountChanged();
        }

        if (isClearAll) {
            this.totalCount = data.items.length;
        } else {
            this.totalCount = this.totalCount + newItems.length;
        }

        this._onCollectionChanged({
            changeType: COLL_CHANGE_TYPE.Reset,
            reason: data.reason,
            oper: COLL_CHANGE_OPER.Fill,
            items: newItems
        });

        this._onFillEnd({
            items: items,
            newItems: newItems,
            reason: data.reason
        });

        if (isClearAll) {
            this.moveFirst();
        }

        return newItems;
    }
    protected _onDSCollectionChanged(_: any, args: ICollChangedArgs<TItem>): void {
        const self = this;
        switch (args.changeType) {
            case COLL_CHANGE_TYPE.Reset:
                this._refresh(COLL_CHANGE_REASON.Refresh);
                break;
            case COLL_CHANGE_TYPE.Add:
                {
                    if (!this._isAddingNew) {
                        const items: TItem[] = (!self._fn_filter) ? args.items : args.items.filter(self._fn_filter);
                        if (items.length > 0) {
                            self.appendItems(items);
                        }
                    }
                }
                break;
            case COLL_CHANGE_TYPE.Remove:
                {
                    for (const item of args.items) {
                        const _item = self.getItemByKey(item._key);
                        if (!!_item) {
                            self.removeItem(_item);
                        }
                    }
                }
                break;
            case COLL_CHANGE_TYPE.Remap:
                {
                    const item = self.getItemByKey(args.old_key);
                    if (!!item) {
                        self._remapItem(args.old_key, args.new_key, item);
                        self._onCollectionChanged(args);
                    }
                }
                break;
            default:
                throw new Error(format(ERRS.ERR_COLLECTION_CHANGETYPE_INVALID, args.changeType));
        }
    }
    protected _onDSStatusChanged(_: any, args: ICollItemStatusArgs<TItem>): void {
        const self = this, item = args.item, key = args.key, oldStatus = args.oldStatus, canFilter = !!self._fn_filter;

        if (!self.getItemByKey(key)) {
            if (canFilter) {
                const isOk = self._fn_filter(item);
                if (isOk) {
                    self.appendItems([item]);
                }
            }
        } else {
            self._onItemStatusChanged(item, oldStatus);
            if (canFilter) {
                const isOk = self._fn_filter(item);
                if (!isOk) {
                    self.removeItem(item);
                }
            }
        }
    }
    protected _bindDS(): void {
        const self = this, ds = this._dataSource;
        if (!ds) {
            return;
        }
        ds.addOnCollChanged(self._onDSCollectionChanged, self.uniqueID, self, TPriority.AboveNormal);
        ds.addOnBeginEdit((_, args) => {
            if (!!self.getItemByKey(args.item._key)) {
                self._onEditing(args.item, true, false);
            }
        }, self.uniqueID, null, TPriority.AboveNormal);
        ds.addOnEndEdit((_, args) => {
            let isOk: boolean;
            const item = args.item, canFilter = !!self._fn_filter;
            if (!self.getItemByKey(item._key)) {
                if (!args.isCanceled && canFilter) {
                    isOk = self._fn_filter(item);
                    if (isOk) {
                        self.appendItems([item]);
                    }
                }
            } else {
                self._onEditing(item, false, args.isCanceled);
                if (!args.isCanceled && canFilter) {
                    isOk = self._fn_filter(item);
                    if (!isOk) {
                        self.removeItem(item);
                    }
                }
            }
        }, self.uniqueID, null, TPriority.AboveNormal);
        ds.addOnErrorsChanged((_, args) => {
            if (!!self.getItemByKey(args.item._key)) {
                self._getInternal().onErrorsChanged(args);
            }
        }, self.uniqueID, null, TPriority.AboveNormal);
        ds.addOnStatusChanged(self._onDSStatusChanged, self.uniqueID, self, TPriority.AboveNormal);

        ds.addOnItemDeleting((_, args) => {
            if (!!self.getItemByKey(args.item._key)) {
                self._onItemDeleting(args);
            }
        }, self.uniqueID, null, TPriority.AboveNormal);
        ds.addOnItemAdded((_, args) => {
            if (self._isAddingNew) {
                if (!self.getItemByKey(args.item._key)) {
                    self._addNew(args.item);
                }
                self.currentItem = args.item;
                self._onEditing(args.item, true, false);
                self._onItemAdded(args.item);
            }
        }, self.uniqueID, null, TPriority.AboveNormal);
        ds.addOnItemAdding((_, args) => {
            if (self._isAddingNew) {
                self._onItemAdding(args.item);
            }
        }, self.uniqueID, null, TPriority.AboveNormal);
    }
    protected _unbindDS(): void {
        const self = this, ds = this._dataSource;
        if (!ds) {
            return;
        }
        ds.objEvents.offNS(self.uniqueID);
    }
    protected _checkCurrentChanging(newCurrent: TItem): void {
        const ds = this._dataSource;
        try {
            const item = (<BaseCollection<TItem>>ds)._getInternal().getEditingItem();
            if (!!item && newCurrent !== item) {
                ds.endEdit();
            }
        } catch (ex) {
            ds.cancelEdit();
            ERROR.reThrow(ex, this.handleError(ex, this));
        }
    }
    protected _onPageChanged(): void {
        this._refresh(COLL_CHANGE_REASON.PageChange);
    }
    protected _clear(reason: COLL_CHANGE_REASON, oper: COLL_CHANGE_OPER = COLL_CHANGE_OPER.None): void {
        super._clear(reason, oper);
        if (reason !== COLL_CHANGE_REASON.PageChange) {
            this.pageIndex = 0;
        }
        if (reason !== COLL_CHANGE_REASON.PageChange && reason !== COLL_CHANGE_REASON.Sorting) {
            this.totalCount = 0;
        }
    }
    // override
    itemFactory(_aspect: ItemAspect<TItem, any>): TItem {
        throw new Error("Not implemented");
    }
    // override
    protected _createNew(): TItem {
        throw new Error("Not implemented");
    }
    _getStrValue(val: any, fieldInfo: IFieldInfo): string {
        return (<BaseCollection<TItem>>this._dataSource)._getInternal().getStrValue(val, fieldInfo);
    }
    // override
    getFieldNames(): string[] {
        return this._dataSource.getFieldNames();
    }
    // override
    getFieldInfo(fieldName: string): IFieldInfo {
        return this._dataSource.getFieldInfo(fieldName);
    }
    // override
    getFieldInfos(): IFieldInfo[] {
        return this._dataSource.getFieldInfos();
    }
    // override
    getFieldMap(): IIndexer<IFieldInfo> {
        return this._dataSource.getFieldMap();
    }
    addOnViewRefreshed(fn: TEventHandler<DataView<TItem>, any>, nmspace?: string): void {
        this.objEvents.on(VIEW_EVENTS.refreshed, fn, nmspace);
    }
    offOnViewRefreshed(nmspace?: string): void {
        this.objEvents.off(VIEW_EVENTS.refreshed, nmspace);
    }
    appendItems(items: TItem[]): TItem[] {
        if (this.getIsStateDirty()) {
            return [];
        }
        return this._fillItems({ items: items, reason: COLL_CHANGE_REASON.None, clear: false, isAppend: true });
    }
    addNew(): TItem {
        let item: TItem = null;
        this._isAddingNew = true;
        try {
            item = this._dataSource.addNew();
        } finally {
            this._isAddingNew = false;
        }
        return item;
    }
    removeItem(item: TItem): void {
        const oldPos = this._removeItem(item);
        if (oldPos < 0) {
            return;
        }
        this.errors.removeAllErrors(item);
        this.totalCount = this.totalCount - 1;
        this._resetCurrent(oldPos);
    }
    sort(fieldNames: string[], sortOrder: SORT_ORDER): IPromise<any> {
        if (!!this._fn_sortHandler) {
            return this._fn_sortHandler(fieldNames, sortOrder);
        } else {
            return this.sortLocal(fieldNames, sortOrder);
        }
    }
    sortLocal(fieldNames: string[], sortOrder: SORT_ORDER): IPromise<any> {
        this._fn_sort = this._getSortFn(fieldNames, sortOrder);
        return utils.async.delay(() => this._refreshSync(COLL_CHANGE_REASON.Sorting));
    }
    clear(): void {
        this._clear(COLL_CHANGE_REASON.Refresh, COLL_CHANGE_OPER.None);
    }
    refresh(): void {
        this._refresh(COLL_CHANGE_REASON.Refresh);
    }
    syncRefresh(): void {
        this._refreshSync(COLL_CHANGE_REASON.Refresh);
    }
    get errors(): Errors<TItem> {
        return (<BaseCollection<TItem>>this._dataSource).errors;
    }
    get dataSource(): ICollection<TItem> {
        return this._dataSource;
    }
    get isPagingEnabled(): boolean {
        return this.options.enablePaging;
    }
    set isPagingEnabled(v: boolean) {
        if (this.options.enablePaging !== v) {
            this.options.enablePaging = v;
            this.objEvents.raiseProp("isPagingEnabled");
            this._refresh(COLL_CHANGE_REASON.None);
        }
    }
    get permissions(): IPermissions {
        return this._dataSource.permissions;
    }
    get fn_filter(): (item: TItem) => boolean {
        return this._fn_filter;
    }
    set fn_filter(v) {
        if (this._fn_filter !== v) {
            this._fn_filter = v;
            this._refresh(COLL_CHANGE_REASON.None);
        }
    }
    get fn_sort(): (item1: TItem, item2: TItem) => number {
        return this._fn_sort;
    }
    set fn_sort(v) {
        if (this._fn_sort !== v) {
            this._fn_sort = v;
            this._refresh(COLL_CHANGE_REASON.Sorting);
        }
    }
    get fn_itemsProvider(): (ds: ICollection<TItem>) => TItem[] {
        return this._fn_itemsProvider;
    }
    set fn_itemsProvider(v) {
        if (this._fn_itemsProvider !== v) {
            this._fn_itemsProvider = v;
            this._refresh(COLL_CHANGE_REASON.Refresh);
        }
    }
    get fn_sortHandler(): (this: DataView<TItem>, fieldNames: string[], sortOrder: SORT_ORDER) => IPromise<any> | null {
        return this._fn_sortHandler;
    }
    set fn_sortHandler(v) {
        if (this._fn_sortHandler !== v) {
            this._fn_sortHandler = v;
            this._refresh(COLL_CHANGE_REASON.Refresh);
        }
    }
    toString(): string {
        return !this.dataSource ? "DataView" : ("DataView For " + this.dataSource.toString()); 
    }
}

export type TDataView = DataView;
