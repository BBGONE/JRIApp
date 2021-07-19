/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { IValidationInfo, Utils } from "jriapp_shared";
import { IViewOptions } from "jriapp/int";
import { DomUtils } from "jriapp/utils/dom";
import { SubscribeFlags } from "jriapp/consts";
import { bootstrapper, subscribeWeakMap } from "jriapp/bootstrapper";
import { cssStyles } from "./int";
import { InputElView } from "./input";

const dom = DomUtils, { isNt } = Utils.check, boot = bootstrapper, subscribeMap = subscribeWeakMap;

export interface ICheckBoxViewOptions extends IViewOptions {
    name?: string;
}

export class CheckBoxElView extends InputElView<HTMLInputElement> {
    private _checked: boolean;
    private _hidden: HTMLInputElement | null | undefined;

    constructor(chk: HTMLInputElement, options?: ICheckBoxViewOptions) {
        super(chk, options);
        const self = this;
        this._checked = null;
        chk.checked = false;

        if (this.isDelegationOn) {
            subscribeMap.set(this.el, this);
            this._setIsSubcribed(SubscribeFlags.change);
        } else {
            dom.events.on(this.el, "change", (e) => {
                e.stopPropagation();
                self.handle_change(e);
            }, this.uniqueID);
        }
        if (!!options.name) {
            const hidden = dom.document.createElement("input");
            hidden.type = "hidden";
            hidden.name = options.name;
            dom.insertBefore(hidden, chk);
            this._hidden = hidden;
        }
        this._updateState();
    }
    dispose() {
        if (this.getIsDisposed())
            return;
        this.setDisposing();
        if (!!this._hidden) {
            dom.removeNode(this._hidden);
            this._hidden = null;
        }
        super.dispose();
    }
    handle_change(_e: Event): boolean {
        const chk = this.el;
        if (this.checked !== chk.checked) {
            this.checked = chk.checked;
        }
        // stop propagation
        return true;
    }
    protected _updateState(): void {
        dom.setClass([this.el], cssStyles.checkedNull, !isNt(this.checked));
    }
    // override
    protected _setErrors(el: HTMLElement, errors: IValidationInfo[]): void {
        const parent = el.parentElement;
        const mainEl = (!!parent && parent.tagName.toLowerCase() === "label") ? parent : el;
        super._setErrors(mainEl, errors);
    }
    toString(): string {
        return "CheckBoxElView";
    }
    get checked(): boolean {
        return this._checked;
    }
    set checked(v: boolean) {
        if (this._checked !== v) {
            this._checked = v;
            const chk = this.el;
            chk.checked = !!v;
            this._updateState();
            if (!!this._hidden) {
                this._hidden.value = !!this._checked ? "1" : (isNt(this._checked)? "" : "0");
            }
            this.objEvents.raiseProp("checked");
        }
    }
}

boot.registerElView("input:checkbox", CheckBoxElView);
boot.registerElView("checkbox", CheckBoxElView);
