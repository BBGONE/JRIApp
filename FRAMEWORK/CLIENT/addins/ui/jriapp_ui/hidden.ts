/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { bootstrapper } from "jriapp/bootstrapper";
import { InputElView } from "./input";

export class HiddenElView extends InputElView<HTMLInputElement> {
    toString(): string {
        return "HiddenElView";
    }
}

bootstrapper.registerElView("input:hidden", HiddenElView);
