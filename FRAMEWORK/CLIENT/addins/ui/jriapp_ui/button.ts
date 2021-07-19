/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { DomUtils } from "jriapp/utils/dom";
import { SubscribeFlags } from "jriapp/consts";
import { bootstrapper, subscribeWeakMap } from "jriapp/bootstrapper";
import { CommandElView, ICommandViewOptions } from "./command";

const boot = bootstrapper, dom = DomUtils, subscribeMap = subscribeWeakMap;

export class ButtonElView extends CommandElView<HTMLButtonElement | HTMLInputElement> {
    private _isButton: boolean;

    constructor(el: HTMLButtonElement | HTMLInputElement, options: ICommandViewOptions) {
        super(el, options);
        const self = this;
        this._isButton = this.el.tagName.toLowerCase() === "button";
        if (this.isDelegationOn) {
            subscribeMap.set(el, this);
            this._setIsSubcribed(SubscribeFlags.click);
        } else {
            dom.events.on(el, "click", (e) => {
                self.handle_click(e);
            }, this.uniqueID);
        }
    }
    handle_click(e: Event): boolean {
        if (this.stopPropagation) {
            e.stopPropagation();
        }
        if (this.preventDefault) {
            e.preventDefault();
        }
        this.onClick();

        return this.stopPropagation;
    }
    onClick(): void {
        this.invokeCommand();
    }
    toString(): string {
        return "ButtonElView";
    }
    get value(): string {
        return this._isButton ? (<HTMLButtonElement>this.el).textContent : (<HTMLInputElement>this.el).value;
    }
    set value(v: string) {
        const x = this.value;
        v = (!v) ? "" : ("" + v);
        if (x !== v) {
            if (this._isButton) {
                (<HTMLButtonElement>this.el).textContent = v;
            } else {
                (<HTMLInputElement>this.el).value = v;
            }

            this.objEvents.raiseProp("value");
        }
    }
    get text(): string {
        return this.el.textContent;
    }
    set text(v: string) {
        const x = this.el.textContent;
        v = (!v) ? "" : ("" + v);
        if (x !== v) {
            this.el.textContent = v;
            this.objEvents.raiseProp("text");
        }
    }
    get html(): string {
        return this._isButton ? (<HTMLButtonElement>this.el).innerHTML : (<HTMLInputElement>this.el).value;
    }
    set html(v: string) {
        const x = this.html;
        v = (!v) ? "" : ("" + v);
        if (x !== v) {
            if (this._isButton) {
                (<HTMLButtonElement>this.el).innerHTML = v;
            } else {
                (<HTMLInputElement>this.el).value = v;
            }
            this.objEvents.raiseProp("html");
        }
    }
}

boot.registerElView("input:button", ButtonElView);
boot.registerElView("input:submit", ButtonElView);
boot.registerElView("button", ButtonElView);
