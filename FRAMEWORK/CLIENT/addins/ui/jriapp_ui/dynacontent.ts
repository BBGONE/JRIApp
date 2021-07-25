/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { Utils, IPromise, Debounce } from "jriapp_shared";
import { ITemplate, ITemplateEvents, IViewOptions } from "jriapp/int";
import { DomUtils } from "jriapp/utils/dom";
import { createTemplate } from "jriapp/template";
import { bootstrapper } from "jriapp/bootstrapper";
import { BaseElView } from "./baseview";

const utils = Utils, sys = utils.sys, dom = DomUtils;

export interface IDynaContentAnimation {
    beforeShow(template: ITemplate, isFirstShow: boolean): void;
    show(template: ITemplate, isFirstShow: boolean): IPromise;
    beforeHide(template: ITemplate): void;
    hide(template: ITemplate): IPromise;
    stop(): void;
    isAnimateFirstShow: boolean;
}

export type TDynaContentViewChangeArgs = {
    sender: DynaContentElView,
    previousView: string,
    currentView: string
};

export interface IDynaContentEvents {
    viewChanged(args: TDynaContentViewChangeArgs): void;
}

export interface IDynaContentOptions extends IViewOptions {
    templateID?: string;
    animation?: IDynaContentAnimation;
    viewEvents?: IDynaContentEvents;
    dataContext?: any;
}

export class DynaContentElView extends BaseElView implements ITemplateEvents {
    private _dataContext: any;
    private _prevTemplateID: string;
    private _templateID: string;
    private _template: ITemplate;
    private _animation: IDynaContentAnimation;
    private _tDebounce: Debounce;
    private _dsDebounce: Debounce;
    private _viewEvents: IDynaContentEvents;

    constructor(el: HTMLElement, options: IDynaContentOptions) {
        super(el, options);
        this._tDebounce = new Debounce();
        this._dsDebounce = new Debounce();
        this._dataContext = null;
        this._prevTemplateID = null;
        this._templateID = null;
        this._template = null;
        this._animation = !options.animation ? null : options.animation;
        this._viewEvents = !options.viewEvents ? null : options.viewEvents;
        if (!!options.dataContext) {
            this._setDataContext(options.dataContext);
        }
        if (!!options.templateID) {
            this._setTemplateID(null, options.templateID);
        }
    }
    protected _setDataContext(dataContext: any) {
        this._dataContext = dataContext;
        this._dsDebounce.enque(() => {
            const ds = this._dataContext;
            if (!!this._template) {
                this._template.dataContext = ds;
            }
        });
    }
    protected _setTemplateID(oldTemplateID: string, templateID: string) {
        this._prevTemplateID = oldTemplateID;
        this._templateID = templateID;
        this._tDebounce.enque(() => {
            this._templateChanging(oldTemplateID, templateID);
        });
    }
    protected _onViewChanged(args: TDynaContentViewChangeArgs): void {
        this._viewEvents?.viewChanged(args);
    }
    templateLoading(template: ITemplate): void {
        if (this.getIsStateDirty()) {
            return;
        }
        const isFirstShow = !this._prevTemplateID,
            canShow = !!this._animation && (this._animation.isAnimateFirstShow || (!this._animation.isAnimateFirstShow && !isFirstShow));

        if (canShow) {
            this._animation.beforeShow(template, isFirstShow);
        }
    }
    templateLoaded(template: ITemplate, _error?: any): void {
        if (this.getIsStateDirty()) {
            return;
        }
        if (!dom.isContained(template.el, this.el)) {
            this.el.appendChild(template.el);
        }
        const isFirstShow = !this._prevTemplateID,
            canShow = !!this._animation && (this._animation.isAnimateFirstShow || (!this._animation.isAnimateFirstShow && !isFirstShow)),
            viewChangedArgs = { sender: this, previousView: this._prevTemplateID, currentView: this.templateID };

        if (canShow) {
            this._animation.show(template, isFirstShow).then(() => this._onViewChanged(viewChangedArgs));
        }
        else {
            this._onViewChanged(viewChangedArgs);
        }
    }
    templateUnLoading(_template: ITemplate): void {
        // noop
    }
    private _templateChanging(_oldName: string, newName: string) {
        const self = this;
        try {
            if (!newName && !!self._template) {
                if (!!self._animation && self._template.isLoaded) {
                    self._animation.stop();
                    self._animation.beforeHide(self._template);
                    self._animation.hide(self._template).finally(() => {
                        if (self.getIsStateDirty()) {
                            return;
                        }
                        self._template.dispose();
                        self._template = null;
                        self.objEvents.raiseProp("template");

                    });
                } else {
                    self._template.dispose();
                    self._template = null;
                    self.objEvents.raiseProp("template");
                }
                return;
            }

            if (!self._template) {
                self._template = createTemplate({
                    parentEl: null,
                    dataContext: self._dataContext,
                    templEvents: self
                });
                self._template.templateID = newName;
                self.objEvents.raiseProp("template");
                return;
            }
            if (!!self._animation && self._template.isLoaded) {
                self._animation.stop();
                self._animation.beforeHide(self._template);
                self._animation.hide(self._template).finally(() => {
                    if (self.getIsStateDirty()) {
                        return;
                    }
                    self._template.templateID = newName;
                });
            } else {
                self._template.templateID = newName;
            }
        } catch (ex) {
            utils.err.reThrow(ex, self.handleError(ex, self));
        }
    }
    dispose() {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        this._tDebounce.dispose();
        this._dsDebounce.dispose();
        const a = this._animation;
        this._animation = null;
        const t = this._template;
        this._template = null;
        this._viewEvents = null;

        if (sys.isBaseObj(a)) {
            a.dispose();
        }
        if (!!t) {
            t.dispose();
        }
        this._dataContext = null;
        super.dispose();
    }
    get template() { return this._template; }
    get templateID() {
        return this._templateID;
    }
    set templateID(v: string) {
        const self = this, old = self._templateID;
        if (old !== v) {
            this._setTemplateID(old, v);
            this.objEvents.raiseProp("templateID");
        }
    }
    get dataContext() { return this._dataContext; }
    set dataContext(v) {
        if (this._dataContext !== v) {
            this._setDataContext(v);
            this.objEvents.raiseProp("dataContext");
        }
    }
    get animation() { return this._animation; }
    set animation(v) {
        if (this._animation !== v) {
            this._animation = v;
            this.objEvents.raiseProp("animation");
        }
    }
    get viewEvents() { return this._viewEvents; }
    set viewEvents(v) {
        if (this._viewEvents !== v) {
            this._viewEvents = v;
            this.objEvents.raiseProp("viewEvents");
        }
    }
}

bootstrapper.registerElView("dynacontent", DynaContentElView);
