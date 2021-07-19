/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { DomUtils } from "jriapp/utils/dom";
import { DATA_ATTR } from "jriapp/consts";

import { css } from "../consts";
import { BaseCell, ICellOptions } from "./base";
import { RowSelectorColumn } from "../columns/rowselector";

const dom = DomUtils, doc = dom.document;

export class RowSelectorCell extends BaseCell<RowSelectorColumn> {
    private _chk: HTMLInputElement;

    constructor(options: ICellOptions) {
        super(options);
        dom.addClass([this.td], css.rowSelector);
        const label = doc.createElement("label");
        const chk = doc.createElement("input");
        chk.type = "checkbox";
        chk.checked = false;
        chk.className = css.rowSelector;
        label.className = css.rowSelector;
        chk.setAttribute(DATA_ATTR.DATA_EVENT_SCOPE, this.column.uniqueID);
        label.appendChild(chk);
        label.appendChild(doc.createElement("span"));
        this.td.appendChild(label);
        this._chk = chk;
        dom.setData(chk, "cell", this);
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        dom.removeData(this._chk);
        super.dispose();
    }
    get isDisabled(): boolean {
        return this._chk.disabled;
    }
    set isDisabled(v: boolean) {
        const el = this._chk;
        if (v !== el.disabled) {
            el.disabled = v;

            if (v) {
                this.checked = false;
            }
            this.objEvents.raiseProp("isDisabled");
        }
    }
    get checked(): boolean {
        return this._chk.checked;
    }
    set checked(v: boolean) {
        const bv = !!v;
        if (!this.isDisabled && bv !== this._chk.checked) {
            this._chk.checked = bv;
        }
    }
    toString(): string {
        return "RowSelectorCell";
    }
}
