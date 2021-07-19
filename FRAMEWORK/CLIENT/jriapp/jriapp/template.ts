/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { BaseObject, Utils, LocaleERRS, IPromise } from "jriapp_shared";
import { DATA_ATTR } from "./consts";
import {
    ITemplate, ILifeTimeScope, ITemplateEvents, IApplication, IElView, ITemplateElView, TDocInfo
} from "./int";
import { bootstrapper } from "./bootstrapper";
import { Binding } from "binding";
import { ViewChecks } from "./utils/viewchecks";
import { DomUtils } from "./utils/dom";

const utils = Utils, { reject } = utils.async, dom = DomUtils, viewChecks = ViewChecks,
    { isFunc, isThenable } = utils.check, { format } = utils.str,
    arrHelper = utils.arr, sys = utils.sys, boot = bootstrapper, ERRS = LocaleERRS,
    ERROR = utils.err, doc = dom.document;

export const enum css {
   templateContainer = "ria-template-container",
   templateError = "ria-template-error"
}

export interface ITemplateOptions {
    parentEl: HTMLElement | null;
    dataContext?: any;
    templEvents?: ITemplateEvents;
}

export function createTemplate(options: ITemplateOptions): ITemplate {
    return new Template(options);
}

class Template extends BaseObject implements ITemplate {
    private _el: HTMLElement;
    private _lfTime: ILifeTimeScope;
    private _templElView: ITemplateEvents;
    private _isLoaded: boolean;
    private _dataContext: any;
    private _templEvents?: ITemplateEvents;
    private _templateID: string;
    private readonly _removeElOnDispose: boolean;

    constructor(options: ITemplateOptions) {
        super();
        if (options.parentEl === null) {
            const parentEl = doc.createElement('div');
            dom.addClass([parentEl], css.templateContainer);
            this._el = parentEl;
            this._removeElOnDispose = true;
        } else {
            this._el = options.parentEl;
            this._removeElOnDispose = false;
        }
        this._dataContext = options.dataContext;
        this._templEvents = options.templEvents;
        this._isLoaded = false;
        this._lfTime = null;
        this._templateID = null;
        this._templElView = null;
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        this._unloadTemplate();
        if (!!this._el && this._removeElOnDispose) {
            dom.removeNode(this._el);
        }
        this._el = null;
        this._dataContext = null;
        this._templEvents = null;
        super.dispose();
    }
    private _getBindings(): Binding[] {
        return !this._lfTime ? [] : this._lfTime.findAll<Binding>(sys.isBinding);
    }
    private _getTemplateElView(): ITemplateEvents {
        return !this._lfTime ? null : this._lfTime.findFirst<ITemplateElView>(viewChecks.isTemplateElView);
    }
    /**
       * returns a promise which resolves with the loaded template's DOM element
    */
    private _loadAsync(name: string): IPromise<TDocInfo> {
        const self = this, loader = this.app.getTemplateLoader(name);
        let promise: IPromise<TDocInfo>;
        if (isFunc(loader) && isThenable(promise = loader())) {
            return promise;
        } else {
            return reject<TDocInfo>(new Error(format(ERRS.ERR_TEMPLATE_ID_INVALID, self.templateID)));
        }
    }
    private _loadTemplate(): IPromise<HTMLElement> {
        const self = this, id = self.templateID, templateEl = self.el;
        try {
            if (self._isLoaded) {
                self._unloadTemplate();
            }

            if (!!id) {
                return self._loadAsync(id).then((docInfo) => {
                    return self._dataBind(templateEl, docInfo);
                }).catch((err) => {
                    if (!!err && !!err.message) {
                        throw err;
                    } else {
                        throw new Error(format(ERRS.ERR_TEMPLATE_ID_INVALID, self.templateID));
                    }
                });
            } else {
                return reject<HTMLElement>(format(ERRS.ERR_TEMPLATE_ID_INVALID, self.templateID));
            }
        } catch (ex) {
            return reject<HTMLElement>(ex);
        }
    }
    private _onLoading(): void {
        if (!!this._templEvents) {
            this._templEvents.templateLoading(this);
        }
    }
    private _onLoaded(error?: any): void {
        this._templElView = this._getTemplateElView();
        if (!!this._templEvents) {
            this._templEvents.templateLoaded(this, error);
        }
        if (!!this._templElView) {
            this._templElView.templateLoaded(this, error);
        }
    }
    private _unloadTemplate(): void {
        try {
            if (!!this._templEvents) {
                this._templEvents.templateUnLoading(this);
            }
            if (!!this._templElView) {
                this._templElView.templateUnLoading(this);
            }
        } finally {
            this._cleanUp();
        }
    }
    private _dataBind(el: HTMLElement, docInfo: TDocInfo): IPromise<HTMLElement> {
        const self = this;
        if (self.getIsStateDirty()) {
            ERROR.abort();
        }
        if (self._isLoaded) {
            self._unloadTemplate();
        }
        if (!docInfo) {
            throw new Error(format(ERRS.ERR_TEMPLATE_ID_INVALID, self.templateID));
        }

        el.appendChild(docInfo.doc.cloneNode(true));
        self._isLoaded = true;
        dom.removeClass([el], css.templateError);
        
        self._onLoading();

        const promise = self.app._getInternal().bindTemplate(el, this.dataContext, docInfo.required);
        return promise.then((lftm) => {
            if (self.getIsStateDirty()) {
                lftm.dispose();
                ERROR.abort();
            }
            // once all assets are loaded, then no need to check again
            if (!!docInfo.required) {
                docInfo.required = null;
            }
            self._lfTime = lftm;
            self._updateBindingSource();
            self._onLoaded(null);
            return el;
        });
    }
    private _onFail(templateEl: HTMLElement, err: any): void {
        const self = this;
        if (self.getIsStateDirty()) {
            return;
        }
        self._onLoaded(err);
        if (ERROR.checkIsAbort(err)) {
            return;
        }
        dom.setClass([templateEl], css.templateError, false);
        let ex: any;
        if (!!err) {
            if (!!err.message) {
                ex = err;
            } else if (!!err.statusText) {
                ex = new Error(err.statusText);
            } else {
                ex = new Error("error: " + err);
            }
        }
        if (!ex) {
            ex = new Error(format(ERRS.ERR_TEMPLATE_ID_INVALID, self.templateID));
        }
        self.handleError(ex, self);
    }
    private _updateBindingSource(): void {
        const bindings = this._getBindings(), len = bindings.length;
        for (let i = 0; i < len; i += 1) {
            const binding = bindings[i];
            if (!binding.isSourceFixed) {
                binding.source = this.dataContext;
            }
        }
    }
    private _cleanUp(): void {
        if (!!this._lfTime) {
            this._lfTime.dispose();
            this._lfTime = null;
        }

        this._templElView = null;

        if (this._isLoaded) {
            this.el.innerHTML = "";
            this._isLoaded = false;
        }
    }
    // find elements which has specific data-name attribute value
    // returns plain array of elements, or empty array
    findElByDataName(name: string): HTMLElement[] {
        return arrHelper.fromList<HTMLElement>(this._el.querySelectorAll(["*[", DATA_ATTR.DATA_NAME, '="', name, '"]'].join("")));
    }
    findElViewsByDataName(name: string): IElView[] {
        // first return elements with the needed data attributes those are inside template
        const els = this.findElByDataName(name), res: IElView[] = [],
            viewStore = boot.app.viewFactory.store;
        for(const el of els)
        {
            const elView = viewStore.getElView(el);
            if (!!elView) {
                res.push(elView);
            }
        }
        return res;
    }
    toString(): string {
        return "ITemplate";
    }
    get isLoaded(): boolean {
        return this._isLoaded;
    }
    get dataContext(): any {
        return this._dataContext;
    }
    set dataContext(v) {
        if (this._dataContext !== v) {
            this._dataContext = v;
            this._updateBindingSource();
            this.objEvents.raiseProp("dataContext");
        }
    }
    get templateID(): string {
        return this._templateID;
    }
    set templateID(v: string) {
        if (this._templateID !== v) {
            this._templateID = v;
            const el = this.el;
            this._loadTemplate().catch((err) => {
                if (this.getIsStateDirty()) {
                    return;
                }
                this._onFail(el, err);
            });

            this.objEvents.raiseProp("templateID");
        }
    }
    get el(): HTMLElement {
        return this._el;
    }
    get app(): IApplication {
        return bootstrapper.app;
    }
}
