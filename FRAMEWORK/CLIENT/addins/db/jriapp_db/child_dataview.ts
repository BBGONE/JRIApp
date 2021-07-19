/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { Utils } from "jriapp_shared";
import { COLL_CHANGE_REASON } from "jriapp_shared/collection/const";
import { ICollection } from "jriapp_shared/collection/int";
import { IEntityItem } from "./int";
import { Association } from "./association";
import { DataView, IDataViewOptions } from "./dataview";

const utils = Utils, coreUtils = utils.core;

export interface IChildDataViewOptions<TItem extends IEntityItem> {
    association: Association;
    fn_filter?: (item: TItem) => boolean;
    fn_sort?: (item1: TItem, item2: TItem) => number;
    parentItem?: IEntityItem;
    explicitRefresh?: boolean;
}

export class ChildDataView<TItem extends IEntityItem = IEntityItem> extends DataView<TItem> {
    private _setParent: (parent: IEntityItem) => void;
    private _getParent: () => IEntityItem;
    private _association: Association;

    constructor(options: IChildDataViewOptions<TItem>) {
        let parentItem: IEntityItem = !options.parentItem ? null : options.parentItem;
        const assoc = options.association,
            opts = <IDataViewOptions<TItem>>coreUtils.extend({
                dataSource: <ICollection<TItem>>null,
                fn_itemsProvider: <(ds: ICollection<TItem>) => TItem[]>null,
                fn_filter: <(item: TItem) => boolean>null
            }, options),
            oldFilter = opts.fn_filter;

        opts.dataSource = <ICollection<TItem>><any>assoc.childDS;
        opts.fn_itemsProvider = () => {
            if (!parentItem) {
                return [];
            }
            return <TItem[]>assoc.getChildItems(parentItem);
        };
        opts.fn_filter = (item) => {
            const isPC = assoc.isParentChild(parentItem, item);
            return isPC && (!oldFilter ? true : oldFilter(item));
        };
        opts.refreshTimeout = 350;
        super(opts);
        const self = this;
        
        this._getParent = () => {
            if (self.getIsStateDirty()) {
                return null;
            }
            return parentItem;
        };
        this._setParent = (v: IEntityItem) => {
            if (self.getIsStateDirty()) {
                return;
            }
            if (parentItem !== v) {
                parentItem = v;

                if (self.items.length > 0) {
                    self.clear();
                    self._onViewRefreshed({});
                }

                self._refresh(COLL_CHANGE_REASON.Refresh);
                self.objEvents.raiseProp("parentItem");
            }
        };
        this._association = assoc;
        if (!!parentItem && !options.explicitRefresh) {
            const queue = utils.async.getTaskQueue();
            queue.enque(() => {
                self._refreshSync(COLL_CHANGE_REASON.None);
            });
        }
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        this._setParent(null);
        this._association = null;
        super.dispose();
    }
    toString(): string {
        return !this._association ? "ChildDataView" : ("ChildDataView for " + this._association.toString());
    }
    get parentItem(): IEntityItem {
        return this._getParent();
    }
    set parentItem(v: IEntityItem) {
        this._setParent(v);
    }
    get association(): Association {
        return this._association;
    }
}

export type TChildDataView = ChildDataView;
