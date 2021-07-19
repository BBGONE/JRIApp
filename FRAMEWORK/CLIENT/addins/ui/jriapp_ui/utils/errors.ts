/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { IValidationInfo, LocaleSTRS as STRS, createWeakMap } from "jriapp_shared";
import { SERVICES } from "jriapp/consts";
import { ITooltipService } from "jriapp/int";
import { bootstrapper } from "jriapp/bootstrapper";
import { cssStyles, IUIErrorsService } from "../int";
import { DomUtils } from "jriapp/utils/dom";

const boot = bootstrapper, dom = DomUtils, formMap = createWeakMap();

function addToolTip(el: Element, tip: string, isError?: boolean, pos?: string) {
    const svc = boot.getSvc<ITooltipService>(SERVICES.TOOLTIP_SVC);
    svc.addToolTip(el, tip, isError, pos);
}

function getErrorTipInfo(errors: IValidationInfo[]): string {
    const tip = ["<b>", STRS.VALIDATE.errorInfo, "</b>", "<br/>"];
    for (const info of errors)
    {
        let res = "";
        for (const str of info.errors)
        {
            res = `${res} ${str}`;
        }
        tip.push(res);
        res = "";
    }
    return tip.join("");
}

function getFormErrorTipInfo(errors: IValidationInfo[]): string {
    const tip = ["<b>", STRS.VALIDATE.errorInfo, "</b>", "<ul>"];

    for (const info of errors)
    {
        const fieldName = info.fieldName;
        let res = "";
        if (!!fieldName) {
            res = STRS.VALIDATE.errorField + " " + fieldName;
        }
        for (const str of info.errors)
        {
            if (!!res) {
                res = `${res} -> ${str}`;
            } else {
                res = str;
            }
        }
        tip.push(`<li>${res}</li>`);
        res = "";
    }

    tip.push("</ul>");
    return tip.join("");
}

function setError(el: HTMLElement, isError: boolean): void {
    dom.setClass([el], cssStyles.fieldError, !isError);
}

function addError(el: HTMLElement): void {
    setError(el, true);
}

function removeError(el: HTMLElement): void {
    setError(el, false);
}

class UIErrorsService implements IUIErrorsService  {
    setErrors(el: HTMLElement, errors: IValidationInfo[], toolTip?: string): void {
        if (!!errors && errors.length > 0) {
            addToolTip(el, getErrorTipInfo(errors), true);
            addError(el);
        } else {
            addToolTip(el, toolTip);
            removeError(el);
        }
    }
    setFormErrors(el: HTMLElement, errors: IValidationInfo[]): void {
        let gliph: HTMLElement = formMap.get(el);

        if (!!errors && errors.length > 0) {
            if (!gliph) {
                gliph = dom.fromHTML(`<div data-name="error_info" class="${cssStyles.error}" />`)[0];
                dom.prepend(el, gliph);
                formMap.set(el, gliph);
            }
            addToolTip(gliph, getFormErrorTipInfo(errors), true);
            addError(el);
        } else {
            if (!!gliph) {
                addToolTip(gliph, null);
                formMap.delete(el);
                dom.removeNode(gliph);
            }
            removeError(el);
        }
    }
}

export function createUIErrorsSvc(): IUIErrorsService {
    return new UIErrorsService();
}