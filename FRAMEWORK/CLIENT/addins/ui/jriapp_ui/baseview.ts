/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { Utils, BaseObject, IPropertyBag, IValidationInfo, IValidatable, TFunc } from "jriapp_shared";
import { DomUtils } from "jriapp/utils/dom";
import { ViewChecks } from "jriapp/utils/viewchecks";
import { SERVICES, DATA_ATTR, SubscribeFlags } from "jriapp/consts";
import { IElView, IElViewStore, IApplication, IViewOptions, ISubscriber, ITooltipService } from "jriapp/int";
import { bootstrapper, subscribeWeakMap } from "jriapp/bootstrapper";
import { ICommand } from "jriapp/mvvm";
import { EventBag, EVENT_CHANGE_TYPE, IEventChangedArgs } from "./utils/eventbag";
import { PropertyBag } from "./utils/propbag";
import { CSSBag } from "./utils/cssbag";
import { IViewErrorsService } from "jriapp/int";

export { IEventChangedArgs, EVENT_CHANGE_TYPE };

const utils = Utils, { getNewID } = utils.core, dom = DomUtils, { _undefined } = utils.check,
    boot = bootstrapper, viewChecks = ViewChecks, subscribeMap = subscribeWeakMap;

viewChecks.isElView = (obj: any): obj is IElView => {
    return !!obj && obj instanceof BaseElView;
};

export function addToolTip(el: Element, tip: string, isError?: boolean, pos?: string) {
    const svc = boot.getSvc<ITooltipService>(SERVICES.TOOLTIP_SVC);
    svc.addToolTip(el, tip, isError, pos);
}

function getErrorsService(): IViewErrorsService {
    return boot.getSvc(SERVICES.UIERRORS_SVC);
}

interface IElViewState extends IViewOptions {
    _eventBag: EventBag;
    _propBag: IPropertyBag;
    _classBag: IPropertyBag;
    // saves old display before making display: none
    _display: string;
    _errors: IValidationInfo[];
}

export class BaseElView<TElement extends HTMLElement = HTMLElement> extends BaseObject implements IElView, ISubscriber, IValidatable {
    private _uniqueID: string;
    private _el: TElement;
    private _subscribeFlags: number;
    private _viewState: IElViewState;
    private _bindingState: number;
    private _bindCompleteList: TFunc[];

    constructor(el: TElement, options?: IViewOptions) {
        super();
        this._el = el;
        this._bindingState = 0;
        this._bindCompleteList = null;
            
        options = options || {};
        const state: IElViewState = {
            tip: !options.tip ? null : options.tip,
            css: !options.css ? null : options.css,
            errorsService: !options.errorsService ? null : options.errorsService,
            _eventBag: null,
            _propBag: null,
            _classBag: null,
            _display: null,
            _errors: null
        };
        this._uniqueID = getNewID("elv");
        this._viewState = state;
        this._subscribeFlags = !options.nodelegate ? 1 : 0;

        if (!!state.css) {
            dom.addClass([el], state.css);
        }
        this._applyToolTip();
        this._getStore().setElView(el, this);
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        try {
            dom.events.offNS(this.el, this.uniqueID);
            this.validationErrors = null;
            addToolTip(this.el, null);

            if (this._subscribeFlags !== 0) {
                subscribeMap.delete(this.el);
                this._subscribeFlags = 0;
            }
            if (!!this._viewState._eventBag) {
                this._viewState._eventBag.dispose();
            }
            if (!!this._viewState._propBag) {
                this._viewState._propBag.dispose();
            }
            if (!!this._viewState._classBag) {
                this._viewState._classBag.dispose();
            }
            this._viewState = <any>{};
        } finally {
            this._getStore().setElView(this.el, null);
            super.dispose();
        }
    }
    private _getStore(): IElViewStore {
        return this.app.viewFactory.store;
    }
    private _onBindCompleted(): void {
        if (!this._bindCompleteList) {
            return;
        }

        try {
            for (const fn of this._bindCompleteList) {
                fn();
            }
        }
        finally {
            this._bindCompleteList = null;
        }
    }
    protected _onEventChanged(args: IEventChangedArgs): void {
        switch (args.changeType) {
            case EVENT_CHANGE_TYPE.Added:
                this._onEventAdded(args.name, args.newVal);
                break;
            case EVENT_CHANGE_TYPE.Deleted:
                this._onEventDeleted(args.name, args.oldVal);
                break;
        }
    }
    protected _onEventAdded(name: string, _newVal: ICommand): void {
        const self = this;
        if (this.getIsStateDirty()) {
            return;
        }
        dom.events.on(this.el, name, (e) => {
            if (!!self._viewState._eventBag) {
                self._viewState._eventBag.trigger(name, e);
            }
        }, this.uniqueID);
    }
    protected _onEventDeleted(name: string, _oldVal: ICommand): void {
        dom.events.off(this.el, name, this.uniqueID);
    }
    protected _applyToolTip(): void {
        if (!!this.toolTip) {
            addToolTip(this.el, this.toolTip);
        }
    }
    protected _setIsSubcribed(flag: SubscribeFlags): void {
        this._subscribeFlags |= (1 << flag);
    }
    protected _setErrors(el: HTMLElement, errors: IValidationInfo[]): void {
        this._viewState._errors = errors;
        const errSvc = !this._viewState.errorsService ? getErrorsService() : this._viewState.errorsService;
        errSvc.setErrors(el, errors, this.toolTip);
    }
    protected _registerOnBindCompleted(fn: TFunc): void {
        if (!this._bindCompleteList) {
            this._bindCompleteList = [fn];
        } else {
            this._bindCompleteList.push(fn);
        }
    }
    isSubscribed(flag: SubscribeFlags): boolean {
        return !!(this._subscribeFlags & (1 << flag));
    }
    toString(): string {
        return "BaseElView";
    }
    get el(): TElement {
        return this._el;
    }
    get uniqueID(): string {
        return this._uniqueID;
    }
    get isVisible(): boolean {
        const v = this.el.style.display;
        return !(v === "none");
    }
    set isVisible(v: boolean) {
        v = !!v;
        if (v !== this.isVisible) {
            if (!v) {
                this._viewState._display = this.el.style.display;
                // if saved display is none, then don't store it
                if (this._viewState._display === "none") {
                    this._viewState._display = null;
                }
                this.el.style.display = "none";
            } else {
                this.el.style.display = (!this._viewState._display ? "" : this._viewState._display);
            }
            this.objEvents.raiseProp("isVisible");
        }
    }
    get validationErrors(): IValidationInfo[] {
        return this._viewState._errors;
    }
    set validationErrors(v: IValidationInfo[]) {
        if (!this.getIsDisposed() && this._viewState._errors !== v) {
            this._setErrors(this.el, v);
            this.objEvents.raiseProp("validationErrors");
        }
    }
    get dataName(): string {
        return this._el.getAttribute(DATA_ATTR.DATA_NAME);
    }
    get toolTip(): string {
        return this._viewState.tip;
    }
    set toolTip(v: string) {
        if (this.toolTip !== v) {
            this._viewState.tip = v;
            addToolTip(this.el, v);
            this.objEvents.raiseProp("toolTip");
        }
    }
    // exposes commands to databind directly to the underlying HtmlElement's events
    get events(): IPropertyBag {
        if (!this._viewState._eventBag) {
            if (this.getIsStateDirty()) {
                return _undefined;
            }
            this._viewState._eventBag = new EventBag((_, a) => {
                this._onEventChanged(a);
            });
        }
        return this._viewState._eventBag;
    }
    // exposes All HTML Element properties to databind directly to them
    get props(): IPropertyBag {
        if (!this._viewState._propBag) {
            if (this.getIsStateDirty()) {
                return _undefined;
            }
            this._viewState._propBag = new PropertyBag(this.el);
        }
        return this._viewState._propBag;
    }
    // exposes All CSS Classes to databind directly to them
    get classes(): IPropertyBag {
        if (!this._viewState._classBag) {
            if (this.getIsStateDirty()) {
                return _undefined;
            }
            this._viewState._classBag = new CSSBag(this.el);
        }
        return this._viewState._classBag;
    }
    get isDelegationOn(): boolean {
        return !!(this._subscribeFlags & (1 << SubscribeFlags.delegationOn));
    }
    get css(): string {
        return this._viewState.css;
    }
    set css(v: string) {
        const arr: string[] = [];
        if (this.css !== v) {
            if (!!this.css) {
                arr.push("-" + this.css);
            }
            this._viewState.css = v;
            if (!!this.css) {
                arr.push("+" + this.css);
            }

            dom.setClasses([this._el], arr);
            this.objEvents.raiseProp("css");
        }
    }
    get bindingState(): number {
        return this._bindingState;
    }
    /*
     * it is set automatically by the databinding service when it binds properties on this element view
     * usage: inside some property setter it is checked that bindingState == 1, which means the bindings are currently set
     * in there we can register a function which is executed when the databinding is completed
     * example:  if (this.bindingState === 1) this._registerOnBindCompleted(()=> this.doSomething(););
     * it could be useful in components like combobox, which have several properties to databind
     * and is needed to know the moment when they are all set and ready to be used
     * p.s. - for this purpose the viewMounted method can be used as well
    */
    set bindingState(v: number) {
        if (this._bindingState !== v) {
            this._bindingState = v;
            if (this._bindingState === 0 && !!this._bindCompleteList) {
                this._onBindCompleted();
            }
        }
    }
    get app(): IApplication {
        return boot.app;
    }
}

// it is registered by two names
boot.registerElView("generic", BaseElView);
boot.registerElView("baseview", BaseElView);
