/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    Utils, IBaseObject, IEditable, IErrorNotification,
    IValidationInfo, IPromise, BaseObject, LocaleERRS as ERRS
} from "jriapp_shared";
import { IFieldInfo } from "jriapp_shared/collection/int";
import { DomUtils } from "jriapp/utils/dom";
import { DATA_ATTR, ELVIEW_NM, BindScope, SERVICES } from "jriapp/consts";
import { ViewChecks } from "jriapp/utils/viewchecks";
import { IContent, IElView, ILifeTimeScope, IViewOptions, IApplication } from "jriapp/int";
import { bootstrapper } from "jriapp/bootstrapper";
import { cssStyles, IFormErrorsService } from "./int";
import { BaseElView } from "./baseview";

import { Binding } from "jriapp/binding";
import { parseContentAttr } from "./content/int";

const utils = Utils, dom = DomUtils, { isFunc } = utils.check, { getNewID } = utils.core,
    { format } = utils.str, sys = utils.sys, boot = bootstrapper, viewChecks = ViewChecks,
    { reject: _reject } = utils.async;

viewChecks.isDataForm = (el: Element) => {
    if (!el) {
        return false;
    }
    const attr = el.getAttribute(DATA_ATTR.DATA_VIEW);
    return (!attr) ? false : (attr === ELVIEW_NM.DataForm);
};

viewChecks.isInsideDataForm = (el: Element) => {
    if (!el) {
        return false;
    }

    const parent = el.parentElement;
    if (!!parent) {
        if (!viewChecks.isDataForm(parent)) {
            return viewChecks.isInsideDataForm(parent);
        } else {
            return true;
        }
    }

    return false;
};

// check if the element inside of any dataform in the forms array
viewChecks.isInNestedForm = (root: any, forms: Element[], el: Element) => {
    const len = forms.length;
    if (len === 0) {
        return false;
    }
    let oNode = el.parentElement;

    while (!!oNode) {
        for (let i = 0; i < len; i += 1) {
            if (oNode === forms[i]) {
                // we found the form to be among the parents
                return true;
            }
        }

        if (!!root && oNode === root) {
            // reached up to the root
            return false;
        }

        // try parent element
        oNode = oNode.parentElement;
    }

    return false;
};

/*
       in case of dataforms nesting, element's parent dataform can be nested dataform
       this function returns element dataform
*/
viewChecks.getParentDataForm = (rootForm: HTMLElement, el: HTMLElement) => {
    if (!el) {
        return null;
    }
    const parent = el.parentElement;
    if (!!parent) {
        if (parent === rootForm) {
            return rootForm;
        }
        if (viewChecks.isDataForm(parent)) {
            return parent;
        } else {
            return viewChecks.getParentDataForm(rootForm, parent);
        }
    }

    return null;
};

function getFieldInfo(obj: any, fieldName: string): IFieldInfo {
    if (!obj) {
        return null;
    }
    if (!!obj._aspect && isFunc(obj._aspect.getFieldInfo)) {
        return obj._aspect.getFieldInfo(fieldName);
    } else if (isFunc(obj.getFieldInfo)) {
        return obj.getFieldInfo(fieldName);
    } else {
        return null;
    }
}

function getErrorsService(): IFormErrorsService {
    return boot.getSvc(SERVICES.UIERRORS_SVC);
}

export interface IFormOptions {
    formErrorsService?: IFormErrorsService;
}

export class DataForm extends BaseObject {
    private static _DATA_FORM_SELECTOR = ["*[", DATA_ATTR.DATA_VIEW, "='", ELVIEW_NM.DataForm, "']"].join("");
    private static _DATA_CONTENT_SELECTOR = ["*[", DATA_ATTR.DATA_CONTENT, "]:not([", DATA_ATTR.DATA_COLUMN, "])"].join("");
    private _el: HTMLElement;
    private _uniqueID: string;
    private _dataContext: IBaseObject;
    private _errorsService: IFormErrorsService;
    private _isEditing: boolean;
    private _content: IContent[];
    private _lfTime: ILifeTimeScope;
    private _contentCreated: boolean;
    private _editable: IEditable;
    private _errNotification: IErrorNotification;
    private _parentDataForm: IElView;
    private _contentPromise: IPromise;

    constructor(el: HTMLElement, options: IFormOptions) {
        super();
        const self = this;
        this._el = el;
        this._uniqueID = getNewID("frm");
        this._dataContext = null;
        this._errorsService = !options.formErrorsService ? getErrorsService() : options.formErrorsService;
        dom.addClass([el], cssStyles.dataform);
        this._isEditing = false;
        this._content = [];
        this._lfTime = null;
        this._contentCreated = false;
        this._editable = null;
        this._errNotification = null;
        this._parentDataForm = null;
        this._contentPromise = null;

        const parent = viewChecks.getParentDataForm(null, el);
        // if this form is nested inside another dataform
        // subscribe for parent's dispose event
        if (!!parent) {
            self._parentDataForm = this.app.viewFactory.getElView(parent);
            self._parentDataForm.objEvents.addOnDisposed(() => {
                // dispose itself if parent form is destroyed
                if (!self.getIsStateDirty()) {
                    self.dispose();
                }
            }, self._uniqueID);
        }
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        this._setErrors(null);
        this._clearContent();
        dom.removeClass([this.el], cssStyles.dataform);
        this._unbindDS();
        const parentDataForm = this._parentDataForm;
        this._parentDataForm = null;
        if (!!parentDataForm && !parentDataForm.getIsStateDirty()) {
            parentDataForm.objEvents.offNS(this._uniqueID);
        }
        this._dataContext = null;
        this._errorsService = null;
        this._contentCreated = false;
        this._contentPromise = null;
        this._el = null;
        super.dispose();
    }
    private _getBindings(): Binding[] {
        return !this._lfTime ? [] : this._lfTime.findAll<Binding>(sys.isBinding);
    }
    private _createContent(): IPromise {
        const dctx: any = this._dataContext, self = this;
        if (!dctx) {
            return _reject<void>("DataForm's DataContext is not set");
        }
        const contentElements = utils.arr.fromList<HTMLElement>(this._el.querySelectorAll(DataForm._DATA_CONTENT_SELECTOR)),
            isEditing = this.isEditing;

        // select all dataforms inside the scope
        const forms = utils.arr.fromList<HTMLElement>(this._el.querySelectorAll(DataForm._DATA_FORM_SELECTOR));

        for (const el of contentElements)
        {
            // checks - the element is not inside a nested dataform
            if (!viewChecks.isInNestedForm(self._el, forms, el)) {
                const attr = el.getAttribute(DATA_ATTR.DATA_CONTENT),
                    op = parseContentAttr(attr);
                if (!!op.fieldName && !op.fieldInfo) {
                    op.fieldInfo = getFieldInfo(dctx, op.fieldName);
                    if (!op.fieldInfo) {
                        throw new Error(format(ERRS.ERR_DBSET_INVALID_FIELDNAME, "", op.fieldName));
                    }
                }

                const contentType = boot.contentFactory.getContentType(op);
                const content = new contentType({ parentEl: el, contentOptions: op, dataContext: dctx, isEditing: isEditing });
                self._content.push(content);
                content.render();
            }
        }

        const promise = self.app._getInternal().bindElements({
            scope: this._el,
            bind: BindScope.DataForm,
            dataContext: dctx
        });

        return promise.then((lftm: ILifeTimeScope) => {
            if (self.getIsStateDirty()) {
                lftm.dispose();
                return;
            }

            self._lfTime = lftm;
            const bindings = self._getBindings();
            for (const binding of bindings)
            {
                if (!binding.isSourceFixed) {
                    binding.source = dctx;
                }
            }
            self._contentCreated = true;
        });
    }
    private _updateCreatedContent(): void {
        const dctx: any = this._dataContext, self = this;
        try {
            for (const content of this._content)
            {
                content.dataContext = dctx;
                content.isEditing = self.isEditing;
            }

            const bindings = this._getBindings();
            for (const binding of bindings)
            {
                if (!binding.isSourceFixed) {
                    binding.source = dctx;
                }
            }
        } catch (ex) {
            utils.err.reThrow(ex, this.handleError(ex, this));
        }
    }
    private _updateContent(): void {
        const self = this;
        try {
            if (self._contentCreated) {
                self._updateCreatedContent();
            } else {
                if (!!self._contentPromise) {
                    self._contentPromise.then(() => {
                        if (self.getIsStateDirty()) {
                            return;
                        }
                        self._updateCreatedContent();
                    }, (err) => {
                        if (self.getIsStateDirty()) {
                            return;
                        }
                        self.handleError(err, self);
                    });
                } else {
                    self._contentPromise = self._createContent();
                }
            }
        } catch (ex) {
            utils.err.reThrow(ex, self.handleError(ex, self));
        }
    }
    private _onDSErrorsChanged(): void {
        if (!!this._errNotification) {
            const errors = this._errNotification.getAllErrors();
            this._setErrors(errors);
        }
    }
    private _bindDS(): void {
        const dataContext = this._dataContext, self = this;
        if (!dataContext) {
            return;
        }

        if (!!dataContext) {
            this._editable = sys.getEditable(dataContext);
            this._errNotification = sys.getErrorNotification(dataContext);
        }

        dataContext.objEvents.addOnDisposed(() => {
            self.dataContext = null;
        }, self._uniqueID);

        if (!!this._editable) {
            this._editable.objEvents.onProp("isEditing", self._onIsEditingChanged, self._uniqueID, self);
        }

        if (!!this._errNotification) {
            this._errNotification.addOnErrorsChanged(self._onDSErrorsChanged, self._uniqueID, self);
        }
    }
    private _unbindDS(): void {
        const dataContext = this._dataContext;
        this._setErrors(null);
        if (!!dataContext && !dataContext.getIsStateDirty()) {
            dataContext.objEvents.offNS(this._uniqueID);
            if (!!this._editable) {
                this._editable.objEvents.offNS(this._uniqueID);
            }
            if (!!this._errNotification) {
                this._errNotification.offOnErrorsChanged(this._uniqueID);
            }
        }
        this._editable = null;
        this._errNotification = null;
    }
    private _clearContent(): void {
        for (const content of this._content)
        {
            content.dispose();
        }
        this._content = [];
        if (!!this._lfTime) {
            this._lfTime.dispose();
            this._lfTime = null;
        }
        this._contentCreated = false;
    }
    protected _setErrors(errors: IValidationInfo[]): void {
        this._errorsService.setFormErrors(this.el, errors);
    }
    protected _onIsEditingChanged(): void {
        this.isEditing = this._editable.isEditing;
    }
    toString(): string {
        return "DataForm";
    }
    get app(): IApplication {
        return boot.app;
    }
    get el(): HTMLElement {
        return this._el;
    }
    get dataContext(): IBaseObject {
        return this._dataContext;
    }
    set dataContext(v: IBaseObject) {
        if (v === this._dataContext) {
            return;
        }

        if (!!v && !sys.isBaseObj(v)) {
            throw new Error(ERRS.ERR_DATAFRM_DCTX_INVALID);
        }

        this._unbindDS();
        this._dataContext = v;

        this._bindDS();
        this._updateContent();
        if (!!this._dataContext) {
            if (!!this._editable && this._isEditing !== this._editable.isEditing) {
                this.isEditing = this._editable.isEditing;
            }
            if (!!this._errNotification) {
                this._onDSErrorsChanged();
            }
        }

        this.objEvents.raiseProp("dataContext");
    }
    get isEditing(): boolean {
        return this._isEditing;
    }
    set isEditing(v: boolean) {
        const dataContext = this._dataContext;
        if (!dataContext) {
            return;
        }
        const isEditing = this._isEditing;
        let editable: IEditable;

        if (!!this._editable) {
            editable = this._editable;
        }

        if (!editable && v !== isEditing) {
            this._isEditing = v;
            this._updateContent();
            this.objEvents.raiseProp("isEditing");
            return;
        }


        if (v !== isEditing && !!editable) {
            try {
                if (v) {
                    editable.beginEdit();
                } else {
                    editable.endEdit();
                }
            } catch (ex) {
                utils.err.reThrow(ex, this.handleError(ex, dataContext));
            }
        }

        if (!!editable && editable.isEditing !== isEditing) {
            this._isEditing = editable.isEditing;
            this._updateContent();
            this.objEvents.raiseProp("isEditing");
        }
    }
}

export interface IFormViewOptions extends IFormOptions, IViewOptions {
}

export class DataFormElView extends BaseElView {
    private _form: DataForm;

    constructor(el: HTMLElement, options: IFormViewOptions) {
        super(el, options);
        const self = this;
        this._form = new DataForm(el, options);
        this._form.objEvents.onProp("dataContext", () => {
            self.objEvents.raiseProp("dataContext");
        }, this.uniqueID);
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        if (!this._form.getIsStateDirty()) {
            this._form.dispose();
        }
        super.dispose();
    }
    // override
    protected _setErrors(_el: HTMLElement, _errors: IValidationInfo[]): void {
        // noop
    }
    toString(): string {
        return "DataFormElView";
    }
    get dataContext(): IBaseObject {
        return this._form.dataContext;
    }
    set dataContext(v: IBaseObject) {
        if (this.dataContext !== v) {
            this._form.dataContext = v;
        }
    }
    get form(): DataForm {
        return this._form;
    }
}

boot.registerElView(ELVIEW_NM.DataForm, DataFormElView);
