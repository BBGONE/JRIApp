/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { IIndexer, IBaseObject, LocaleERRS as ERRS, Utils } from "jriapp_shared";
import { DomUtils } from "jriapp/utils/dom";
import { SORT_ORDER } from "jriapp_shared/collection/const";
import { IExternallyCachable, IContentConstructor } from "jriapp/int";
import { bootstrapper } from "jriapp/bootstrapper";

import { css } from "../consts";
import { BaseColumn, ICellInfo } from "./base";
import { DataGrid } from "../datagrid";

const utils = Utils, { Indexer, forEach } = utils.core, dom = DomUtils, boot = bootstrapper;

export class DataColumn extends BaseColumn {
    private _sortOrder: SORT_ORDER;
    private _objCache: IIndexer<IBaseObject>;
    private _contentType: IContentConstructor;
 
    constructor(grid: DataGrid, options: ICellInfo) {
        super(grid, options);
        // the DataCell caches here listbox (for the LookupContent)
        // so not to create it for every cell - it is only one per column!
        this._objCache = Indexer();
        this._contentType = null;
        let colClass: string = css.dataColumn;
        this._sortOrder = null;
        if (this.isSortable) {
            colClass += (" " + css.colSortable);
        }
        dom.addClass([this.col], colClass);
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        const self = this;
        this._contentType = null;
        forEach(self._objCache, (key) => {
            self._objCache[key].dispose();
        });
        self._objCache = null;
        super.dispose();
    }
    protected _onColumnClicked(): void {
        if (this.isSortable && !!this.sortMemberName) {
            const sortOrd = this._sortOrder;
            this.grid._getInternal().resetColumnsSort();

            this.sortOrder = (sortOrd === SORT_ORDER.ASC) ? SORT_ORDER.DESC : SORT_ORDER.ASC;
            this.grid.sortByColumn(this);
        }
    }
    protected _cacheObject(key: string, obj: IBaseObject): void {
        this._objCache[key] = obj;
    }
    protected _getCachedObject(key: string): IBaseObject {
        return this._objCache[key];
    }
    protected _getInitContentFn(): (content: IExternallyCachable) => void {
        const self = this;
        return (content: IExternallyCachable) => {
            content.addOnObjectCreated((_, args) => {
                self._cacheObject(args.objectKey, args.result);
                args.isCachedExternally = !!self._getCachedObject(args.objectKey);
            });
            content.addOnObjectNeeded((_, args) => {
                args.result = self._getCachedObject(args.objectKey);
            });
        };
    }
    updateContentOptions(): void {
        const contentOptions = this.options.content;
        if (!!contentOptions.fieldName) {
            contentOptions.fieldInfo = this.grid.dataSource.getFieldInfo(contentOptions.fieldName);
            if (!contentOptions.fieldInfo) {
                throw new Error(utils.str.format(ERRS.ERR_DBSET_INVALID_FIELDNAME, "", contentOptions.fieldName));
            }
        }
        this._contentType = boot.contentFactory.getContentType(contentOptions);
        if (boot.contentFactory.isExternallyCachable(this._contentType)) {
            contentOptions.initContentFn = this._getInitContentFn();
        }
        if (this.grid.isHasEditor) {
            // disable inrow editing if the grid has an editor
            contentOptions.readOnly = true;
        }
    }
    toString(): string {
        return "DataColumn";
    }
    get contentType(): IContentConstructor {
        return this._contentType;
    }
    get isSortable(): boolean {
        return !!(this.options.sortable);
    }
    get sortMemberName(): string {
        return this.options.sortMemberName;
    }
    get sortOrder(): SORT_ORDER {
        return this._sortOrder;
    }
    set sortOrder(v: SORT_ORDER) {
        if (this._sortOrder !== v) {
            this._sortOrder = v;
            const styles = [(v === SORT_ORDER.ASC ? "+" : "-") + css.colSortAsc, (v === SORT_ORDER.DESC ? "+" : "-") + css.colSortDesc];
            dom.setClasses([this.col], styles);
            this.objEvents.raiseProp("sortOrder");
        }
    }
}
