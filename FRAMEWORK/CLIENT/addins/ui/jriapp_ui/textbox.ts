/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { IViewOptions } from "jriapp/int";
import { DomUtils } from "jriapp/utils/dom";
import { SubscribeFlags } from "jriapp/consts";
import { bootstrapper, subscribeWeakMap } from "jriapp/bootstrapper";
import { InputElView } from "./input";

const dom = DomUtils, subscribeMap = subscribeWeakMap;

const enum TXTBOX_EVENTS {
    keypress = "keypress"
}

export interface ITextBoxOptions extends IViewOptions {
    updateOnKeyUp?: boolean;
    updateOnInput?: boolean;
}

export type TKeyPressArgs = {
    keyCode: number;
    value: string;
    isCancel: boolean;
};

export class TextBoxElView<TElement extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement> extends InputElView<TElement> {
    constructor(el: TElement, options: ITextBoxOptions) {
        super(el, options);
        const self = this;
        if (this.isDelegationOn) {
            subscribeMap.set(el, this);

            if (!!options.updateOnInput) {
                dom.events.on(el, "input", (e) => {
                    e.stopPropagation();
                    self.handle_change(e);
                }, this.uniqueID);
            } else {
                this._setIsSubcribed(SubscribeFlags.change);
            }

            this._setIsSubcribed(SubscribeFlags.keypress);
            if (!!options.updateOnKeyUp) {
                this._setIsSubcribed(SubscribeFlags.keyup);
            }
        } else {
            dom.events.on(el, "keypress", (e) => {
                self.handle_keypress(e);
            }, this.uniqueID);

            if (!!options.updateOnInput) {
                dom.events.on(el, "input", (e) => {
                    e.stopPropagation();
                    self.handle_change(e);
                }, this.uniqueID);
            }
            else
            {
                dom.events.on(el, "change", (e) => {
                    e.stopPropagation();
                    self.handle_change(e);
                }, this.uniqueID);
            }

            if (!!options.updateOnKeyUp) {
                dom.events.on(el, "keyup", (e) => {
                    self.handle_keyup(e);
                }, this.uniqueID);
            }
        }
    }
    handle_change(_e: Event): boolean {
        this.objEvents.raiseProp("value");
        // stop propagation
        return true;
    }
    handle_keypress(e: KeyboardEvent): boolean {
        const args: TKeyPressArgs = {
            keyCode: e.which,
            value: (<TElement>e.target).value,
            isCancel: false
        };
        this.objEvents.raise(TXTBOX_EVENTS.keypress, args);
        if (args.isCancel) {
            e.preventDefault();
        }
        // stop propagation
        return true;
    }
    handle_keyup(_e: KeyboardEvent): void {
        this.objEvents.raiseProp("value");
    }
    addOnKeyPress(fn: (sender: TextBoxElView<TElement>, args: TKeyPressArgs) => void, nmspace?: string) {
        this.objEvents.on(TXTBOX_EVENTS.keypress, fn, nmspace);
    }
    offOnKeyPress(nmspace?: string) {
        this.objEvents.off(TXTBOX_EVENTS.keypress, nmspace);
    }
    toString() {
        return "TextBoxElView";
    }
    get color() {
        return this.el.style.color;
    }
    set color(v) {
        const x = this.el.style.color;
        if (v !== x) {
            this.el.style.color = v;
            this.objEvents.raiseProp("color");
        }
    }
}

bootstrapper.registerElView("input:text", TextBoxElView);
