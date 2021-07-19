/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    Utils, IErrorHandler, IPromise, DummyError, BaseObject
} from "jriapp_shared";
import { DATA_ATTR, ELVIEW_NM, BindScope } from "./consts";
import {
    IElViewFactory, IElView, ILifeTimeScope, IBindArgs,
    TBindingOptions, IDataBindingService, IModuleLoader, IApplication
} from "./int";
import { LifeTimeScope } from "./utils/lifetime";
import { DomUtils } from "./utils/dom";
import { create as createModulesLoader } from "./utils/mloader";
import { getBindingOptions, Binding } from "./binding";
import { ViewChecks } from "./utils/viewchecks";
import { Parser } from "./utils/parser";

const utils = Utils, { createDeferred } = utils.async, viewChecks = ViewChecks, dom = DomUtils,
    { startsWith } = utils.str, parser = Parser, { forEach } = utils.core, { toMap } = utils.arr;

export function createDataBindSvc(app: IApplication): IDataBindingService {
    return new DataBindingService(app);
}

interface IBindable {
    el: HTMLElement;
    needToBind: boolean;
    dataForm: boolean;
    bindings: string[];
    elView: IElView;
}

interface IBindElViewArgs {
    readonly bind: IBindable;
    readonly lftm: ILifeTimeScope;
    readonly dataContext: any;
}


function toBindable(el: HTMLElement): IBindable {
    let attr: Attr;
    const allAttrs = el.attributes, res: IBindable = {
        el: el,
        needToBind: false,
        dataForm: false,
        bindings: [],
        elView: null
    };
    const n = allAttrs.length;
    let dataViewName: string, hasOptions = false;
    for (let i = 0; i < n; i++) {
        attr = allAttrs[i];
        if (startsWith(attr.name, DATA_ATTR.DATA_BIND)) {
            res.bindings.push(attr.value);
        }
        if (attr.name === DATA_ATTR.DATA_VIEW) {
            dataViewName = attr.value;
        }
        if (attr.name === DATA_ATTR.DATA_VIEW_OPTIONS) {
            hasOptions = true;
        }
    }

    if (dataViewName === ELVIEW_NM.DataForm) {
        res.dataForm = true;
    }
    res.needToBind = !!dataViewName || hasOptions || res.bindings.length > 0;
    return res.needToBind? res : null;
 }

function getBindables(scope: Document | HTMLElement): IBindable[] {
    const result: IBindable[] = [], allElems = dom.queryAll<HTMLElement>(scope, "*");
    for (const el of allElems)
    {
        const res: IBindable = toBindable(el);
        if (!!res) {
            result.push(res);
        }
    }

    return result;
}

function filterBindables(scope: Document | HTMLElement, bindElems: IBindable[]): IBindable[] {
    // select all dataforms inside the scope
    const forms = bindElems.filter((bindElem) => {
        return !!bindElem.dataForm;
    }).map((bindElem) => {
        return bindElem.el;
        });

    if (forms.length === 0) {
        return bindElems;
    }
    // skip all the bindings inside dataforms (because a dataform performs databinding itself in its own scope)
    // check if the element inside of any dataform in the forms array
    return bindElems.filter((bindElem) => {
        return !viewChecks.isInNestedForm(scope, forms, bindElem.el);
    });
}

class DataBindingService extends BaseObject implements IDataBindingService, IErrorHandler {
    private _root: Document | HTMLElement;
    private _elViewFactory: IElViewFactory;
    private _objLifeTime: ILifeTimeScope;
    private _mloader: IModuleLoader;
    private _app: IApplication;

    constructor(app: IApplication) {
        super();
        this._app = app;
        this._root = app.appRoot;
        this._elViewFactory = app.viewFactory;
        this._objLifeTime = null;
        this._mloader = createModulesLoader();
    }
    dispose(): void {
        this._cleanUp();
        this._elViewFactory = null;
        this._mloader = null;
        this._app = null;
        super.dispose();
    }
    private _cleanUp(): void {
        if (!!this._objLifeTime) {
            this._objLifeTime.dispose();
            this._objLifeTime = null;
        }
    }
    private _bindElView(args: IBindElViewArgs): void {
        const self = this, { elView, bindings } = args.bind, dataContext = args.dataContext;

        // then create databinding if element has data-bind attribute
        if (bindings?.length > 0) {
            const bindInfos = parser.parseBindings(bindings);

            try {
                // it signals that we start settings the bindings
                elView.bindingState = 1;

                for (const bindInfo of bindInfos) {
                    const op = getBindingOptions(bindInfo, elView, dataContext);
                    const binding = self.bind(op);
                    args.lftm.addObj(binding);
                }
            }
            finally {
                // when all bindings are created it is set to zero
                elView.bindingState = 0;
            }
        }
    }
    bindTemplate(templateEl: HTMLElement, dataContext: any, required: string[] | null): IPromise<ILifeTimeScope> {
        const self = this;
        let res: IPromise<ILifeTimeScope>;
        if (!!required && required.length > 0) {
            res = self._mloader.load(required).then(() => {
                return self.bindElements({
                    scope: templateEl,
                    bind: BindScope.Template,
                    dataContext: dataContext
                });
            });
        } else {
            res = self.bindElements({
                scope: templateEl,
                bind: BindScope.Template,
                dataContext: dataContext
            });
        }

        res.catch((err) => {
            utils.queue.enque(() => {
                self.handleError(err, self);
            });
        });

        return res;
    }
    bindElements(args: IBindArgs): IPromise<ILifeTimeScope> {
        const self = this, defer = createDeferred<ILifeTimeScope>(true), scope = args.scope,
            lftm: ILifeTimeScope = new LifeTimeScope();

        
        try {
            const bindElems: IBindable[] = getBindables(scope);
            
            // skip all the bindings inside dataforms (because a dataform performs databinding itself in its own scope)
            const bindables: IBindable[] = filterBindables(scope, bindElems);

            for (const bindElem of bindables)
            {
                const factory = self._elViewFactory;
                let elView = factory.getElView(bindElem.el);
                if (!elView) {
                    const info = factory.getElementViewInfo(bindElem.el, args.dataContext);
                    elView = factory.createElView(info);
                    lftm.addObj(elView);
                }
                bindElem.elView = elView;
            }

            const viewsArr = bindables.map((bindElem) => {
                self._bindElView({
                    bind: bindElem,
                    lftm: lftm,
                    dataContext: args.dataContext
                });
                return bindElem.elView;
            }).filter((v) => !!v.viewMounted);

            const viewMap = toMap(viewsArr, (v) => v.uniqueID);
            forEach(viewMap, (_n, v) => { v.viewMounted(); });

            defer.resolve(lftm);
        } catch (err) {
            lftm.dispose();
            self.handleError(err, self);
            setTimeout(() => {
                defer.reject(new DummyError(err));
            }, 0);
        }

        return defer.promise();
    }
    setUpBindings(): IPromise<void>{
        const bindScope = this._root, dataContext = this._app, self = this;
        this._cleanUp();
        const promise = this.bindElements({
            scope: bindScope,
            bind: BindScope.Application,
            dataContext: dataContext
        });

        return promise.then((lftm: ILifeTimeScope) => {
            if (self.getIsStateDirty()) {
                lftm.dispose();
                return;
            }
            self._objLifeTime = lftm;
        });
    }
    bind(opts: TBindingOptions): Binding {
        return new Binding(opts);
    }
 }
