/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { bootstrapper } from "jriapp/bootstrapper";
import { BaseElView } from "./baseview";

export class SpanElView extends BaseElView {
    toString(): string {
        return "SpanElView";
    }
    get text(): string {
        return this.el.textContent;
    }
    set text(v: string) {
        const el = this.el, x = el.textContent, str = "" + v;
        v = (v === null ? "" : str);
        if (x !== v) {
            el.textContent = v;
            this.objEvents.raiseProp("text");
            this.objEvents.raiseProp("value");
        }
    }
    get value(): string {
        return this.text;
    }
    set value(v: string) {
        this.text = v;
    }
    get html(): string {
        return this.el.innerHTML;
    }
    set html(v: string) {
        const el = this.el, x = this.el.innerHTML, str = "" + v;
        v = v === null ? "" : str;
        if (x !== v) {
            el.innerHTML = v;
            this.objEvents.raiseProp("html");
        }
    }
}

bootstrapper.registerElView("span", SpanElView);
