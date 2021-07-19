/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { bootstrapper } from "jriapp/bootstrapper";
import { AnchorElView, IAncorOptions } from "./anchor";

export interface IExpanderOptions extends IAncorOptions {
    expandedsrc?: string;
    collapsedsrc?: string;
    isExpanded?: boolean;
}

export const enum PROP_NAME {
    isExpanded = "isExpanded"
}

const COLLAPSE_IMG = "collapse.jpg", EXPAND_IMG = "expand.jpg";
// const COLLAPSE_IMG = "icon icon-arrow-up", EXPAND_IMG = "icon  icon-arrow-down";

export class ExpanderElView extends AnchorElView {
    private _expandedsrc: string;
    private _collapsedsrc: string;
    private _isExpanded: boolean;

    constructor(el: HTMLAnchorElement, options: IExpanderOptions) {
        const expandedsrc = options.expandedsrc || bootstrapper.getImagePath(COLLAPSE_IMG);
        const collapsedsrc = options.collapsedsrc || bootstrapper.getImagePath(EXPAND_IMG);
        const isExpanded = !!options.isExpanded;
        options.imageSrc = null;
        super(el, options);
        this._expandedsrc = expandedsrc;
        this._collapsedsrc = collapsedsrc;
        this.isExpanded = isExpanded;
    }
    protected refresh(): void {
        if (this.getIsStateDirty()) {
            return;
        }
        this.imageSrc = this._isExpanded ? this._expandedsrc : this._collapsedsrc;
        // this.glyph = this._isExpanded ? this._expandedsrc : this._collapsedsrc;
    }
    protected _onCommandChanged(): void {
        super._onCommandChanged();
        this.invokeCommand();
    }
    protected onClick(): void {
        this.isExpanded = !this.isExpanded;
    }
    // override
    protected _getCommandParam(): any {
        return { isExpanded: this.isExpanded };
    }
    // override
    invokeCommand(): void {
        this.refresh();
        super.invokeCommand();
    }
    toString(): string {
        return "ExpanderElView";
    }
    get isExpanded(): boolean {
        return this._isExpanded;
    }
    set isExpanded(v: boolean) {
        if (this._isExpanded !== v) {
            this._isExpanded = v;
            this.invokeCommand();
            this.objEvents.raiseProp("isExpanded");
        }
    }
}

bootstrapper.registerElView("expander", ExpanderElView);
