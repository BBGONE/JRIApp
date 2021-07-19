/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { BaseElView } from "./baseview";

export class InputElView<TElement extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement> extends BaseElView<TElement> {
    toString(): string {
        return "InputElView";
    }
    get isDisabled(): boolean {
        return this.el.disabled;
    }
    set isDisabled(v: boolean) {
        const el = this.el;
        if (v !== el.disabled) {
            el.disabled = v;
            this.objEvents.raiseProp("isDisabled");
            this.objEvents.raiseProp("isEnabled");
        }
    }
    get isEnabled(): boolean {
        return !this.isDisabled;
    }
    set isEnabled(v: boolean) {
        this.isDisabled = !v;
    }
    get value(): string {
        return this.el.value;
    }
    set value(v: string) {
        const x = this.value, str = "" + v;
        v = (!v) ? "" : str;
        if (x !== v) {
            this.el.value = v;
            this.objEvents.raiseProp("value");
        }
    }
}
