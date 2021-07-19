/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { DomUtils } from "jriapp/utils/dom";
import { SubscribeFlags } from "jriapp/consts";
import { bootstrapper, subscribeWeakMap } from "jriapp/bootstrapper";
import { cssStyles } from "./int";
import { CommandElView, ICommandViewOptions } from "./command";

const dom = DomUtils, boot = bootstrapper, subscribeMap = subscribeWeakMap;

export interface IAncorOptions extends ICommandViewOptions {
    imageSrc?: string;
    glyph?: string;
}

export class AnchorElView extends CommandElView<HTMLAnchorElement> {
    private _imageSrc: string;
    private _glyph: string;
    private _image: HTMLImageElement;
    private _span: HTMLSpanElement;

    constructor(el: HTMLAnchorElement, options: IAncorOptions) {
        super(el, options);
        const self = this;
        this._imageSrc = null;
        this._image = null;
        this._span = null;
        this._glyph = null;

        if (!!options.imageSrc) {
            this.imageSrc = options.imageSrc;
        }

        if (!!options.glyph) {
            this.glyph = options.glyph;
        }

        dom.addClass([el], cssStyles.commandLink);
        if (this.isDelegationOn) {
            subscribeMap.set(el, this);
            this._setIsSubcribed(SubscribeFlags.click);
        } else {
            dom.events.on(el, "click", (e) => {
                self.handle_click(e);
            }, this.uniqueID);
        }
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        dom.removeClass([this.el], cssStyles.commandLink);
        this.imageSrc = null;
        this.glyph = null;
        super.dispose();
    }
    handle_click(e: Event): boolean {
        if (this.stopPropagation) {
            e.stopPropagation();
        }
        if (this.preventDefault) {
            e.preventDefault();
        }
        this.onClick();
        return this.stopPropagation;
    }
    protected onClick(): void {
        this.invokeCommand();
    }
    protected _updateImage(src: string): void {
        const el = this.el;
        if (this._imageSrc === src) {
            return;
        }
        this._imageSrc = src;

        if (!!this._image && !src) {
            dom.removeNode(this._image);
            this._image = null;
            return;
        }

        if (!!src) {
            if (!this._image) {
                el.innerHTML = "";
                this._image = new Image();
                el.appendChild(this._image);
            }

            this._image.src = src;
        }
    }
    protected _updateGlyph(glyph: string): void {
        const el = this.el;

        if (this._glyph === glyph) {
            return;
        }
        const oldGlyph = this._glyph;
        this._glyph = glyph;

        if (!!oldGlyph && !glyph) {
            dom.removeNode(this._span);
            return;
        }

        if (!!glyph) {
            if (!this._span) {
                el.innerHTML = "";
                this._span = dom.document.createElement("span");
                el.appendChild(this._span);
            }

            if (!!oldGlyph) {
                dom.removeClass([this._span], oldGlyph);
            }
            dom.addClass([this._span], glyph);
        }
    }
    toString(): string {
        return "AnchorElView";
    }
    get imageSrc(): string { return this._imageSrc; }
    set imageSrc(v: string) {
        const x = this._imageSrc;
        if (x !== v) {
            this._updateImage(v);
            this.objEvents.raiseProp("imageSrc");
        }
    }
    get glyph(): string { return this._glyph; }
    set glyph(v: string) {
        const x = this._glyph;
        if (x !== v) {
            this._updateGlyph(v);
            this.objEvents.raiseProp("glyph");
        }
    }
    get html(): string {
        return this.el.innerHTML;
    }
    set html(v: string) {
        const x = this.el.innerHTML;
        v = (!v) ? "" : ("" + v);
        if (x !== v) {
            this.el.innerHTML = v;
            this.objEvents.raiseProp("html");
        }
    }
    get text(): string {
        return this.el.textContent;
    }
    set text(v: string) {
        const x = this.el.textContent;
        v = (!v) ? "" : ("" + v);
        if (x !== v) {
            this.el.textContent = v;
            this.objEvents.raiseProp("text");
        }
    }
    get href(): string {
        return this.el.href;
    }
    set href(v: string) {
        const x = this.href;
        v = (!v) ? "" : ("" + v);
        if (x !== v) {
            this.el.href = v;
            this.objEvents.raiseProp("href");
        }
    }
}

boot.registerElView("a", AnchorElView);
boot.registerElView("abutton", AnchorElView);
