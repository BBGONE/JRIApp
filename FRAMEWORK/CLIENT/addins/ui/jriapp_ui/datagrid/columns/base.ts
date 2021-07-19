/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { BaseObject, Utils } from "jriapp_shared";
import { DomUtils } from "jriapp/utils/dom";
import { IContentOptions, ITemplateEvents, ITemplate } from "jriapp/int";
import { createTemplate } from "jriapp/template";
import { addToolTip } from "../../baseview";
import { selectableProviderWeakMap } from "jriapp/bootstrapper";

import { css } from "../consts";
import { DataGrid } from "../datagrid";

const utils = Utils, dom = DomUtils, doc = dom.document, { getNewID } = utils.core;

export interface IColumnInfo {
    "type"?: string;
    title?: string;
    sortable?: boolean;
    sortMemberName?: string;
    colCellCss?: string;
    rowCellCss?: string;
    width?: any;
    content?: IContentOptions;
    tip?: string;
    templateID?: string;
}

export interface ICellInfo {
    th: HTMLTableHeaderCellElement;
    colInfo: IColumnInfo;
}

export class BaseColumn extends BaseObject implements ITemplateEvents {
    private _grid: DataGrid;
    private _th: HTMLTableHeaderCellElement;
    private _options: IColumnInfo;
    private _isSelected: boolean;
    private _uniqueID: string;
    private _col: HTMLDivElement;
    private _template: ITemplate;

    constructor(grid: DataGrid, options: ICellInfo) {
        super();
        const self = this;
        this._grid = grid;
        this._th = options.th;
        this._options = options.colInfo;
        this._isSelected = false;
        this._uniqueID = getNewID("th");
        const col = doc.createElement("div");
        this._col = col;

        dom.addClass([col], css.column);

        if (!!this._options.colCellCss) {
            dom.addClass([col], this._options.colCellCss);
        }

        this._grid._getInternal().getHeader().appendChild(col);
        selectableProviderWeakMap.set(this._col, this._grid);

        // a click on column itself
        dom.events.on(this._col, "click", () => {
            grid._getInternal().setCurrentColumn(self);
            self._onColumnClicked();
        }, this.uniqueID);

        if (!!this._options.width) {
            this._th.style.width = this._options.width;
        }

        if (!!this._options.templateID) {
            this._template = createTemplate({ parentEl: col, templEvents: this });
            this._template.templateID = this._options.templateID;
        } else if (!!this._options.title) {
            col.innerHTML = this._options.title;
        }

        if (!!this._options.tip) {
            addToolTip(col, this._options.tip, false, "bottom center");
        }
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        selectableProviderWeakMap.delete(this._col);
        dom.events.offNS(this.grid.table, this.uniqueID);

        if (!!this._options.tip) {
            addToolTip(this._col, null);
        }

        if (!!this._template) {
            this._template.dispose();
            this._template = null;
        }
        dom.events.offNS(this._col, this.uniqueID);
        this._col = null;
        this._th = null;
        this._grid = null;
        this._options = null;
        super.dispose();
    }
    templateLoading(_template: ITemplate): void {
        // noop
    }
    templateLoaded(_template: ITemplate, _error?: any): void {
        // noop
    }
    templateUnLoading(_template: ITemplate): void {
        // noop
    }
    scrollIntoView(isUp: boolean): void {
        if (this.getIsStateDirty()) {
            return;
        }
        this._col.scrollIntoView(!!isUp);
    }
    updateWidth(): void {
        this._col.style.width = this._th.offsetWidth + "px";
    }
    protected _onColumnClicked(): void {
    }
    toString(): string {
        return "BaseColumn";
    }
    get uniqueID(): string {
        return this._uniqueID;
    }
    get width(): number {
        return this._th.offsetWidth;
    }
    get th(): HTMLTableHeaderCellElement {
        return this._th;
    }
    get col(): HTMLDivElement {
        return this._col;
    }
    get grid(): DataGrid {
        return this._grid;
    }
    get options(): IColumnInfo {
        return this._options;
    }
    get title(): string {
        return this._options.title;
    }
    get isSelected(): boolean {
        return this._isSelected;
    }
    set isSelected(v: boolean) {
        if (!!this._col && this._isSelected !== v) {
            this._isSelected = v;
            dom.setClass([this._col], css.columnSelected, !this._isSelected);
        }
    }
}
