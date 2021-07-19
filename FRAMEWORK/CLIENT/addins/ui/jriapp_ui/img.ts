/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { bootstrapper } from "jriapp/bootstrapper";
import { BaseElView } from "./baseview";

export class ImgElView extends BaseElView<HTMLImageElement> {
    toString(): string {
        return "ImgElView";
    }
    get src(): string {
        return this.el.src;
    }
    set src(v: string) {
        const x = this.src;
        if (x !== v) {
            this.el.src = v;
            this.objEvents.raiseProp("src");
        }
    }
}

bootstrapper.registerElView("img", ImgElView);
