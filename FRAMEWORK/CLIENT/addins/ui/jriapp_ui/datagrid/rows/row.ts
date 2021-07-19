/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { BaseObject, Utils } from "jriapp_shared";
import { ICollectionItem } from "jriapp_shared/collection/int";
import { DomUtils } from "jriapp/utils/dom";
import { css, ROW_POSITION } from "../consts";
import { BaseCell } from "../cells/base";
import { ExpanderCell } from "../cells/expander";
import { DataCell } from "../cells/data";
import { ActionsCell } from "../cells/actions";
import { RowSelectorCell } from "../cells/rowselector";

import { BaseColumn } from "../columns/base";
import { ExpanderColumn } from "../columns/expander";
import { ActionsColumn } from "../columns/actions";
import { RowSelectorColumn } from "../columns/rowselector";

import { DataGrid } from "../datagrid";

const utils = Utils, dom = DomUtils, doc = dom.document, sys = utils.sys,
    { getNewID } = utils.core;

function fnState(row: Row): void {
    const path = row.grid.options.rowStateField,
        val = (!row.item || !path) ? null : sys.resolvePath(row.item, path),
        css = row.grid._getInternal().onRowStateChanged(row, val);
    row._setState(css);
}

export class Row extends BaseObject {
    private _grid: DataGrid;
    private _tr: HTMLTableRowElement;
    private _item: ICollectionItem;
    private _cells: BaseCell<BaseColumn>[];
    private _uniqueID: string;
    private _expanderCell: ExpanderCell;
    private _actionsCell: ActionsCell;
    private _rowSelectorCell: RowSelectorCell;
    private _isDeleted: boolean;
    private _isSelected: boolean;
    private _isDetached: boolean;
    private _stateCss: string;

    constructor(grid: DataGrid, options: {
        item: ICollectionItem;
    }) {
        super();
        const item = options.item;
        this._grid = grid;
        this._tr = null;
        this._item = item;
        this._cells = [];
        this._uniqueID = getNewID("tr");
        this._expanderCell = null;
        this._actionsCell = null;
        this._rowSelectorCell = null;
        this._isDeleted = false;
        this._isSelected = false;
        this._isDetached = false;
        this._stateCss = null;
        this._isDeleted = item._aspect.isDeleted;
        this._loadDOM();
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        const grid = this._grid;
        if (!!grid) {
            if (!this._isDetached) {
                grid._getInternal().removeRow(this);
            }
        }
        this._unloadDOM();
        this._item = null;
        this._grid = null;
        super.dispose();
    }
    private _createCells(): void {
        const self = this, cols = self.columns, len = cols.length;
        for (let i = 0; i < len; i += 1) {
            self._cells.push(self._createCell(cols[i], i));
        }
    }
    private _createCell(col: BaseColumn, num: number): BaseCell<BaseColumn> {
        const self = this;
        let cell: BaseCell<BaseColumn>;

        if (col instanceof ExpanderColumn) {
            this._expanderCell = new ExpanderCell({ row: self, column: col, num: num });
            cell = this._expanderCell;
        } else if (col instanceof ActionsColumn) {
            this._actionsCell = new ActionsCell({ row: self, column: col, num: num });
            cell = this._actionsCell;
        } else if (col instanceof RowSelectorColumn) {
            this._rowSelectorCell = new RowSelectorCell({ row: self, column: col, num: num });
            cell = this._rowSelectorCell;
        } else {
            cell = new DataCell({ row: self, column: col, num: num });
        }
        return cell;
    }
    protected _loadDOM(): void {
        if (!!this._tr) {
            return;
        }
        const self = this, tr = doc.createElement("tr");
        this._tr = tr;
        if (this._isDeleted) {
            dom.addClass([tr], css.rowDeleted);
        }
        this._createCells();
        if (!!this._item) {
            if (!!this.isHasStateField) {
                this._item.objEvents.onProp(this._grid.options.rowStateField, () => {
                    fnState(self);
                }, this._uniqueID);
            }
            fnState(self);
        }
    }
    protected _unloadDOM(): void {
        if (!this._tr) {
            return;
        }
        this._item.objEvents.offNS(this._uniqueID);
        dom.removeNode(this._tr);
        const cells = this._cells, len = cells.length;
        for (let i = 0; i < len; i += 1) {
            cells[i].dispose();
        }
        this._cells = [];
        this._expanderCell = null;
        this._rowSelectorCell = null;
        this._actionsCell = null;
        this._tr = null;
    }
    _setState(css: string): void {
        if (this._stateCss !== css) {
            const arr: string[] = [];
            if (!!this._stateCss) {
                arr.push("-" + this._stateCss);
            }
            this._stateCss = css;
            if (!!this._stateCss) {
                arr.push("+" + this._stateCss);
            }
            dom.setClasses([this.tr], arr);
        }
    }
    _onBeginEdit(): void {
        this._cells.forEach((cell) => {
            if (cell instanceof DataCell) {
                (<DataCell>cell)._beginEdit();
            }
        });
        if (!!this._actionsCell) {
            this._actionsCell.update();
        }
    }
    _onEndEdit(isCanceled: boolean): void {
        this._cells.forEach((cell) => {
            if (cell instanceof DataCell) {
                (<DataCell>cell)._endEdit(isCanceled);
            }
        });
        if (!!this._actionsCell) {
            this._actionsCell.update();
        }
    }
    beginEdit(): boolean {
        return this._item._aspect.beginEdit();
    }
    endEdit(): boolean {
        return this._item._aspect.endEdit();
    }
    cancelEdit(): boolean {
        return this._item._aspect.cancelEdit();
    }
    deleteRow(): boolean {
        return this._item._aspect.deleteItem();
    }
    updateErrorState(): void {
        // TODO: add implementation to show explanation of error
        const hasErrors = this._item._aspect.getIsHasErrors();
        dom.setClass([this._tr], css.rowError, !hasErrors);
    }
    updateUIState(): void {
        fnState(this);
    }
    scrollIntoView(animate?: boolean, pos?: ROW_POSITION): void {
        this.grid.scrollToRow({ row: this, animate: animate, pos: pos });
    }
    toString(): string {
        return "Row";
    }
    get rect(): ClientRect {
        return this.tr.getBoundingClientRect();
    }
    get height(): number {
        return this.tr.offsetHeight;
    }
    get width(): number {
        return this.tr.offsetWidth;
    }
    get tr(): HTMLTableRowElement {
        return this._tr;
    }
    get grid(): DataGrid {
        return this._grid;
    }
    get item(): ICollectionItem {
        return this._item;
    }
    get cells(): BaseCell<BaseColumn>[] {
        return this._cells;
    }
    get columns(): BaseColumn[] {
        return this._grid.columns;
    }
    get uniqueID(): string {
        return this._uniqueID;
    }
    get itemKey(): string {
        return (!this._item) ? null : this._item._key;
    }
    get isCurrent(): boolean {
        return this.grid.currentItem === this.item;
    }
    get isSelected(): boolean {
        return this._isSelected;
    }
    set isSelected(v: boolean) {
        if (this._isSelected !== v) {
            this._isSelected = v;
            if (!!this._rowSelectorCell) {
                this._rowSelectorCell.checked = this._isSelected;
            }
            this.objEvents.raiseProp("isSelected");
            this.grid._getInternal().onRowSelectionChanged(this);
        }
    }
    get isExpanded(): boolean {
        return this.grid._getInternal().isRowExpanded(this);
    }
    set isExpanded(v: boolean) {
        if (v !== this.isExpanded) {
            if (!v && this.isExpanded) {
                this.grid._getInternal().expandDetails(this, false);
            } else if (v) {
                this.grid._getInternal().expandDetails(this, true);
            }
        }
    }
    get expanderCell(): ExpanderCell {
        return this._expanderCell;
    }
    get actionsCell(): ActionsCell {
        return this._actionsCell;
    }
    get rowSelectorCell(): RowSelectorCell {
        return this._rowSelectorCell;
    }
    get isDeleted(): boolean {
        return this._isDeleted;
    }
    set isDeleted(v: boolean) {
        if (this._isDeleted !== v) {
            this._isDeleted = v;
            if (this._isDeleted) {
                this.isExpanded = false;
            }
            dom.setClass([this._tr], css.rowDeleted, !this._isDeleted);
        }
    }
    get isDetached(): boolean {
        return this._isDetached;
    }
    set isDetached(v: boolean) {
        this._isDetached = v;
    }
    get isEditing(): boolean {
        return !!this._item && this._item._aspect.isEditing;
    }
    get isHasStateField(): boolean {
        return !!this._grid.options.rowStateField;
    }
}
