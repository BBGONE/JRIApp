/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { IDatepicker } from "jriapp/int";
import { SERVICES } from "jriapp/consts";
import { bootstrapper } from "jriapp/bootstrapper";
import { TextBoxElView, ITextBoxOptions } from "./textbox";

const boot = bootstrapper;

export interface IDatePickerOptions extends ITextBoxOptions {
    datepicker?: any;
}

export class DatePickerElView extends TextBoxElView {
    constructor(el: HTMLInputElement, options: IDatePickerOptions) {
        super(el, options);
        const datepicker = boot.getSvc<IDatepicker>(SERVICES.DATEPICKER_SVC);
        if (!datepicker) {
            throw new Error("IDatepicker service is not registered");
        }
        datepicker.attachTo(el, options.datepicker, (datetext) => {
            el.value = datetext;
            this.objEvents.raiseProp("value");
        });
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        const datepicker = boot.getSvc<IDatepicker>(SERVICES.DATEPICKER_SVC);
        if (!datepicker) {
            throw new Error("IDatepicker service is not registered");
        }
        datepicker.detachFrom(this.el);
        super.dispose();
    }
    toString(): string {
        return "DatePickerElView";
    }
}

boot.registerElView("datepicker", DatePickerElView);
