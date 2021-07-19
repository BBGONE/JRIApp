/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { BaseObject, LocaleERRS as ERRS, Utils } from "jriapp_shared";
import {
    IContent, IApplication, ITemplate, ITemplateInfo, IConstructorContentOptions, IContentOptions
} from "jriapp/int";
import { DomUtils } from "jriapp/utils/dom";
import { bootstrapper } from "jriapp/bootstrapper";
import { createTemplate } from "jriapp/template";
import { cssStyles } from "../int";

const utils = Utils, { extend } = utils.core, dom = DomUtils, boot = bootstrapper, ERROR = utils.err;

export class TemplateContent extends BaseObject implements IContent {
    private _parentEl: HTMLElement;
    private _template: ITemplate;
    private _templateInfo: ITemplateInfo;
    private _isEditing: boolean;
    private _dataContext: any;
    private _templateID: string;
    private readonly _options: IContentOptions;

    constructor(options: IConstructorContentOptions) {
        super();
        options = extend(
            {
                parentEl: null,
                contentOptions: null,
                dataContext: null,
                isEditing: false,
                appName: null
            }, options);
        this._templateID = null;
        this._parentEl = options.parentEl;
        this._isEditing = options.isEditing;
        this._dataContext = options.dataContext;
        this._templateInfo = options.contentOptions.template;
        this._template = null;
        this._options = options.contentOptions;
        dom.addClass([this._parentEl], cssStyles.content);
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        dom.removeClass([this._parentEl], cssStyles.content);
        const displayInfo = this._options.css;
        if (!!displayInfo && !!displayInfo.readCss) {
            dom.removeClass([this._parentEl], displayInfo.readCss);
        }
        if (!!displayInfo && !!displayInfo.editCss) {
            dom.removeClass([this._parentEl], displayInfo.editCss);
        }
        this.cleanUp();
        this._parentEl = null;
        this._dataContext = null;
        this._templateInfo = null;
        super.dispose();
    }
    protected updateCss(): void {
        const displayInfo = this._options.css, parentEl = this._parentEl;

        if (this._isEditing) {
            if (!!displayInfo) {
                if (!!displayInfo.editCss) {
                    dom.addClass([parentEl], displayInfo.editCss);
                }
                if (!!displayInfo.readCss) {
                    dom.removeClass([parentEl], displayInfo.readCss);
                }
            }
        } else {
            if (!!displayInfo) {
                if (!!displayInfo.readCss) {
                    dom.addClass([parentEl], displayInfo.readCss);
                }
                if (!!displayInfo.editCss) {
                    dom.removeClass([parentEl], displayInfo.editCss);
                }
            }
        }
    }
    private getTemplateID(): string {
        if (!this._templateInfo) {
            throw new Error(ERRS.ERR_TEMPLATE_ID_INVALID);
        }
        const info = this._templateInfo;
        let id = info.readID;
        if (this._isEditing && !!info.editID) {
            id = info.editID;
        }

        if (!id) {
            id = info.editID;
        }

        if (!id) {
            throw new Error(ERRS.ERR_TEMPLATE_ID_INVALID);
        }
        return id;
    }
    private createTemplate(parentEl: HTMLElement): ITemplate {
        const template = createTemplate({ parentEl: parentEl, dataContext: this._dataContext });
        template.templateID = this._templateID;
        return template;
    }
    protected cleanUp(): void {
        if (!!this._template) {
            this._template.dispose();
            this._template = null;
            this._templateID = null;
        }
    }
    render(): void {
        try {
            const id = this.getTemplateID();
            if (this._templateID !== id) {
                this.cleanUp();
                this._templateID = id;
                this._template = this.createTemplate(this.parentEl);
            }
            this.updateCss();
        } catch (ex) {
            ERROR.reThrow(ex, this.handleError(ex, this));
        }
    }
    toString(): string {
        return "TemplateContent";
    }
    get parentEl(): HTMLElement {
        return this._parentEl;
    }
    get template(): ITemplate {
        return this._template;
    }
    get isEditing(): boolean {
        return this._isEditing;
    }
    set isEditing(v) {
        if (this._isEditing !== v) {
            this._isEditing = v;
            this.render();
        }
    }
    get dataContext(): any {
        return this._dataContext;
    }
    set dataContext(v) {
        if (this._dataContext !== v) {
            this._dataContext = v;
            if (!!this._template) {
                this._template.dataContext = this._dataContext;
            }
        }
    }
    get app(): IApplication {
        return boot.app;
    }
}
