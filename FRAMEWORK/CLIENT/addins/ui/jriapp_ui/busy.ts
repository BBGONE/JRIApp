/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { Utils } from "jriapp_shared";
import { $ } from "./utils/jquery";
import { LOADER_GIF } from "jriapp/consts";
import { IViewOptions } from "jriapp/int";
import { bootstrapper } from "jriapp/bootstrapper";
import { DomUtils } from "jriapp/utils/dom";


import { BaseElView } from "./baseview";

const { isNt } = Utils.check, boot = bootstrapper, dom = DomUtils;

export interface IBusyViewOptions extends IViewOptions {
    img?: string;
    delay?: number | string;
}

export class BusyElView extends BaseElView {
    private _delay: number;
    private _timeOut: number;
    private _loaderPath: string;
    private _img: HTMLImageElement;
    private _isBusy: boolean;

    constructor(el: HTMLElement, options: IBusyViewOptions) {
        super(el, options);
        let img: string;
        if (!!options.img) {
            img = options.img;
        } else {
            img = LOADER_GIF.Default;
        }
        this._delay = 400;
        this._timeOut = null;
        if (!isNt(options.delay)) {
            this._delay = parseInt("" + options.delay);
        }
        this._loaderPath = bootstrapper.getImagePath(img);
        this._img = new Image();
        this._img.style.position = "absolute";
        this._img.style.display = "none";
        this._img.style.zIndex = "10000";
        this._img.src = this._loaderPath;
        this.el.appendChild(this._img);
        this._isBusy = false;
    }
    dispose() {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        if (!!this._timeOut) {
            clearTimeout(this._timeOut);
            this._timeOut = null;
        }
        dom.removeNode(this._img);
        super.dispose();
    }
    toString() {
        return "BusyElView";
    }
    get isBusy() { return this._isBusy; }
    set isBusy(v) {
        const self = this, fn = () => {
            self._timeOut = null;
            self._img.style.display = "";
            $(self._img).position({
                // "my": "right top",
                // "at": "left bottom",
                "of": $(self.el)
            });
        };

        if (v !== self._isBusy) {
            self._isBusy = v;
            if (self._isBusy) {
                if (!!self._timeOut) {
                    clearTimeout(self._timeOut);
                    self._timeOut = null;
                }

                self._timeOut = setTimeout(fn, self._delay);
            } else {
                if (!!self._timeOut) {
                    clearTimeout(self._timeOut);
                    self._timeOut = null;
                } else {
                    self._img.style.display = "none";
                }
            }
            self.objEvents.raiseProp("isBusy");
        }
    }
    get delay() { return this._delay; }
    set delay(v) {
        if (v !== this._delay) {
            this._delay = v;
            this.objEvents.raiseProp("delay");
        }
    }
}

boot.registerElView("busy", BusyElView);
boot.registerElView("busy_indicator", BusyElView);
