/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { bootstrapper } from "jriapp/bootstrapper";
import { SpanElView } from "./span";

const boot = bootstrapper;

export class BlockElView extends SpanElView {
    toString(): string {
        return "BlockElView";
    }
    get width(): number {
        return this.el.offsetWidth;
    }
    set width(v: number) {
        const x = this.width;
        if (v !== x) {
            this.el.style.width = v + "px";
            this.objEvents.raiseProp("width");
        }
    }
    get height(): number {
        return this.el.offsetHeight;
    }
    set height(v: number) {
        const x = this.height;
        if (v !== x) {
            this.el.style.height = v + "px";
            this.objEvents.raiseProp("height");
        }
    }
}

boot.registerElView("block", BlockElView);
boot.registerElView("div", BlockElView);
boot.registerElView("section", BlockElView);
