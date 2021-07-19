/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { Utils } from "jriapp_shared";
import { bootstrapper } from "jriapp/bootstrapper";
import { CheckBoxElView } from "./checkbox";

const { isNt } = Utils.check;

export class RadioElView extends CheckBoxElView {
    toString(): string {
        return "RadioElView";
    }
    get value(): string {
        return this.el.value;
    }
    set value(v: string) {
        const strv = isNt(v) ? "" : ("" + v);
        if (strv !== this.value) {
            this.el.value = strv;
            this.objEvents.raiseProp("value");
        }
    }
    get name(): string {
        return this.el.name;
    }
}

bootstrapper.registerElView("input:radio", RadioElView);
