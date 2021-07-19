/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { bootstrapper } from "jriapp/bootstrapper";
import { TextBoxElView, ITextBoxOptions } from "./textbox";


export interface ITextAreaOptions extends ITextBoxOptions {
     wrap?: string;
}

export class TextAreaElView extends TextBoxElView<HTMLTextAreaElement> {
    constructor(el: HTMLTextAreaElement, options: ITextAreaOptions) {
        super(el, options);
        if (!!options.wrap) {
            el.wrap = options.wrap;
        }
    }
    toString(): string {
        return "TextAreaElView";
    }
    get wrap(): string {
        return this.el.wrap;
    }
    set wrap(v: string) {
        const x = this.wrap;
        if (x !== v) {
            this.el.wrap = v;
            this.objEvents.raiseProp("wrap");
        }
    }
}

bootstrapper.registerElView("textarea", TextAreaElView);
