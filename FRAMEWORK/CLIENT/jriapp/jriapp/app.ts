/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    APP_NAME, IIndexer, TEventHandler, IPromise, TErrorHandler,
    IBaseObject, LocaleERRS, BaseObject, Utils, IThenable
} from "jriapp_shared";
import { STORE_KEY } from "./consts";
import {
    IElViewFactory, IViewType, IApplication,
    TBindingOptions, IAppOptions, IInternalAppMethods, IConverter, ITemplateGroupInfo, ITemplateLoaderInfo,
    IDataBindingService, IBinding, IBindArgs, TLoaderFunc, THTMLLoaderFunc, TDocInfo
} from "./int";
import {
    bootstrapper, getOptions, registerSvc, unregisterSvc, getSvc, registerConverter, getConverter,
    getObject, registerObject, unregisterObject
} from "./bootstrapper";
import { DomUtils } from "./utils/dom";
import { getLoader, registerLoader, registerTemplateGroup } from "./utils/tloader";
import { createElViewFactory } from "./elview";
import { createDataBindSvc } from "./databindsvc";

const utils = Utils, dom = DomUtils, doc = dom.document, { format } = utils.str,
    { isThenable } = utils.check, boot = bootstrapper, sys = utils.sys, ERRS = LocaleERRS,
    { forEach, getNewID, memoize, Indexer } = utils.core, { createDeferred, resolve, reject } = utils.async, http = utils.http;

const enum APP_EVENTS {
    startup = "startup"
}

const enum AppState { None, Starting, Started, Disposed, Error }

export class Application<TOptions extends IAppOptions = any> extends BaseObject implements IApplication {
    private _UC: any;
    private _moduleInits: IIndexer<(app: IApplication) => void>;
    private _uniqueID: string;
    private _objMaps: any[];
    private _appName: string;
    private _extraData: IIndexer<any>;
    private _dataBindingService: IDataBindingService;
    private _viewFactory: IElViewFactory;
    private _internal: IInternalAppMethods;
    private _appState: AppState;
    private _options: TOptions;

    constructor(options?: TOptions) {
        super();
        if (!options) {
            options = <any>Indexer();
        }
        const self = this, moduleInits = options.modulesInits || <IIndexer<(app: IApplication) => void>>Indexer(), appName = APP_NAME;
        this._appName = appName;
        this._options = options;
        if (!!boot.app) {
            throw new Error(format(ERRS.ERR_APP_NAME_NOT_UNIQUE, appName));
        }
        this._uniqueID = getNewID("app");
        this._appState = AppState.None;
        this._moduleInits = moduleInits;
        this._viewFactory = createElViewFactory(boot.elViewRegister);
        this._dataBindingService = createDataBindSvc(this);

        this._objMaps = [];
        // registered exported types
        this._extraData = Indexer();
        this._UC = Indexer();
        this._internal = {
            bindTemplate: (templateEl: HTMLElement, dataContext: any, required: string[] | null) => {
                return self._dataBindingService.bindTemplate(templateEl, dataContext, required);
            },
            bindElements: (args: IBindArgs) => {
                return self._dataBindingService.bindElements(args);
            },
            getTemplateLoaderInfo: (name: string) => {
                return self._getTemplateLoaderInfo(name);
            },
            getData: () => {
                return self._extraData;
            }
        };

        boot._getInternal().registerApp(<IApplication>this);
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        const self = this;
        try {
            self._appState = AppState.Disposed;
            boot._getInternal().unregisterApp(<IApplication>self);
            self._cleanUpObjMaps();
            self._dataBindingService.dispose();
            self._dataBindingService = null;
            self._viewFactory.dispose();
            self._extraData = Indexer();
            self._moduleInits = Indexer();
            self._UC = Indexer();
            self._options = null;
            self._viewFactory = null;
        } finally {
            super.dispose();
        }
    }
    private _cleanUpObjMaps(): void {
        const self = this;
        for (const objMap of this._objMaps)
        {
            forEach(objMap, (name) => {
                const obj = objMap[name];
                if (sys.isBaseObj(obj)) {
                    if (!obj.getIsDisposed()) {
                        obj.objEvents.offNS(self.uniqueID);
                    }
                }
            });
        }
        this._objMaps = [];
    }
    private _initAppModules() : void {
        const self = this, keys = Object.keys(self._moduleInits);
        keys.forEach((key) => {
            const initFn = self._moduleInits[key];
            initFn(<IApplication>self);
        });
    }
    private _getTemplateLoaderInfo(name: string): ITemplateLoaderInfo {
        let res: ITemplateLoaderInfo = getLoader(this, name);
        if (!res) {
            res = getLoader(boot, name);
        }
        return res;
    }
    /**
    can be overriden in derived classes
    it can return a promise when it's needed
    */
    protected onStartUp(): any {
    }
    _getInternal(): IInternalAppMethods {
        return this._internal;
    }
    addOnDisposed(handler: TEventHandler<IApplication, any>, nmspace?: string, context?: object): void {
        this.objEvents.addOnDisposed(handler, nmspace, context);
    }
    offOnDisposed(nmspace?: string): void {
        this.objEvents.offOnDisposed(nmspace);
    }
    addOnError(handler: TErrorHandler<IApplication>, nmspace?: string, context?: object): void {
        this.objEvents.addOnError(handler, nmspace, context);
    }
    offOnError(nmspace?: string): void {
        this.objEvents.offOnError(nmspace);
    }
    addOnStartUp(fn: TEventHandler<IApplication, any>, nmspace?: string, context?: IBaseObject): void {
        this.objEvents.on(APP_EVENTS.startup, fn, nmspace, context);
    }
    offOnStartUp(nmspace?: string): void {
        this.objEvents.off(APP_EVENTS.startup, nmspace);
    }
    getData(): IIndexer<any> {
        return this._extraData;
    }
    bind(opts: TBindingOptions): IBinding {
        return this._dataBindingService.bind(opts);
    }
    registerConverter(name: string, obj: IConverter): void {
        registerConverter(this, name, obj);
    }
    getConverter(name: string): IConverter {
        let res = getConverter(this, name);
        if (!res) {
            res = getConverter(boot, name);
        }
        if (!res) {
            throw new Error(format(ERRS.ERR_CONVERTER_NOTREGISTERED, name));
        }
        return res;
    }
    registerSvc(name: string, obj: any): void {
        registerSvc(this, name, obj);
    }
    unregisterSvc(name: string): void {
        unregisterSvc(this, name);
    }
    getSvc<T = any>(name: string, ...args: any[]): T {
        let obj = getSvc(this, name, ...args);
        if (!obj) {
            obj = getSvc(boot, name, ...args);
        }
        if (!obj) {
            throw new Error(`The service: ${name} is not registered`);
        }
        return obj;
    }
    registerElView(name: string, vwType: IViewType): void {
        this._viewFactory.register.registerElView(name, vwType);
    }
    /**
      registers instances of objects, so they can be retrieved later anywhere in the application's code
      similar to the dependency injection container - you can later obtain the registerd object with the getObject function
    */
    registerObject(name: string, obj: any): void {
        const self = this, name2 = STORE_KEY.OBJECT + name;
        if (sys.isBaseObj(obj)) {
            obj.objEvents.addOnDisposed(() => {
                unregisterObject(self, name2);
            }, self.uniqueID);
        }
        const objMap = registerObject(self, name2, obj);
        if (this._objMaps.indexOf(objMap) < 0) {
            this._objMaps.push(objMap);
        }
    }
    getObject<T = any>(name: string): T {
        const name2 = STORE_KEY.OBJECT + name, res = getObject(this, name2);
        return res;
    }
    /**
    set up application - use onStartUp callback to setUp handlers on objects, create viewModels and etc.
    all  that we need to do before setting up databindings
    */
    startUp(onStartUp?: (app: IApplication) => any): IPromise<IApplication> {
        const self = this, deferred = createDeferred<IApplication>();

        if (this._appState !== AppState.None) {
            return deferred.reject(new Error("Application can not be started when state != AppState.None"));
        }

        const fnStartApp = () => {
            try {
                self._initAppModules();
                const onStartupRes1: any = self.onStartUp();
                let setupPromise1: IThenable<void>;
                if (isThenable(onStartupRes1)) {
                    setupPromise1 = onStartupRes1;
                } else {
                    setupPromise1 = createDeferred<void>().resolve();
                }

                const promise = setupPromise1.then(() => {
                    self.objEvents.raise(APP_EVENTS.startup, {});
                    const onStartupRes2: any = (!!onStartUp) ? onStartUp.apply(self, [self]) : null;
                    let setupPromise2: IThenable<any>;

                    if (isThenable(onStartupRes2))  {
                        setupPromise2 = onStartupRes2.then(() => {
                            return self._dataBindingService.setUpBindings();
                        }, (err) => {
                            deferred.reject(err);
                            throw err;
                        });
                    } else {
                        setupPromise2 = self._dataBindingService.setUpBindings();
                    }

                    return setupPromise2;
                });



                // resolved with an application instance
                promise.then(() => {
                    deferred.resolve(<IApplication>self);
                }, (err) => {
                    deferred.reject(err);
                });
            } catch (ex) {
                deferred.reject(ex);
            }
        };

        this._appState = AppState.Starting;

        const promise = deferred.promise().then(() => {
            self._appState = AppState.Started;
            return <IApplication>self;
        }, (err) => {
            self._appState = AppState.Error;
            throw err;
        });

        try {
            if (!!onStartUp && !utils.check.isFunc(onStartUp)) {
                throw new Error(ERRS.ERR_APP_SETUP_INVALID);
            }

            // wait until all templates have been loaded (if any)
            boot.templateLoader.waitForNotLoading(fnStartApp, null);
        } catch (ex) {
            deferred.reject(ex);
        }

        return promise;
    }
    // loads a group of templates from the server
    loadTemplates(url: string): IPromise<void> {
        return boot.templateLoader.loadTemplatesAsync(this, () => http.getAjax(url));
    }
    // loader must load template and return promise which resolves with the loaded DocumentFragment
    registerTemplateLoader(name: string, loader: THTMLLoaderFunc): void {
        const fn: TLoaderFunc = memoize(() => {
            return loader().then(html => { return { doc: dom.getDocFragment(html), required: null }; });
        });
        registerLoader(this, name, fn);
    }
    // register loading a template from html element by its id value
    registerTemplateById(name: string, templateId: string): void {
        const fn: TLoaderFunc = memoize(() => {
            const el = dom.queryOne<Element>(doc, "#" + templateId);
            if (!el) {
                throw new Error(format(ERRS.ERR_TEMPLATE_ID_INVALID, templateId));
            }
            return resolve<TDocInfo>({ doc: dom.getDocFragment(el.innerHTML), required: null }, true);
        });

        registerLoader(this, name, fn);
    }
    getTemplateLoader(name: string): TLoaderFunc {
        let res = boot.templateLoader.getTemplateLoader(this._getInternal(), name);
        if (!res) {
            res = () => { return reject<TDocInfo>(new Error(format(ERRS.ERR_TEMPLATE_NOTREGISTERED, name))); };
        }
        return res;
    }
    registerTemplateGroup(name: string, url: string): void {
        const group: ITemplateGroupInfo = {
            name: name,
            url: url,
            loader: () => {
                return http.getAjax(group.url);
            },
            promise: null,
            owner: this
        };
        registerTemplateGroup(this, name, group);
    }
    getOptions(name: string): string {
        let res = getOptions(this, name);
        if (!res) {
            res = getOptions(boot, name);
        }
        if (!res) {
            throw new Error(format(ERRS.ERR_OPTIONS_NOTREGISTERED, name));
        }
        return res;
    }
    toString(): string {
        return "Application: " + this.appName;
    }
    get uniqueID(): string {
        return this._uniqueID;
    }
    get options(): TOptions {
        return this._options;
    }
    get appName(): string {
        return this._appName;
    }
    get appRoot(): Document | HTMLElement {
        return (!this._options || !this._options.appRoot) ? doc : this._options.appRoot;
    }
    get viewFactory(): IElViewFactory {
        return this._viewFactory;
    }
    // Namespace for attaching custom user code (functions and objects - anything)
    get UC(): any {
        return this._UC;
    }
    get app(): IApplication {
        return this;
    }
}
