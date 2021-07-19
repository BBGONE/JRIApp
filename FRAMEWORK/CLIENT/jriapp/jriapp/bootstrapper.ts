/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    DUMY_ERROR, IIndexer, IBaseObject, IPromise, TErrorHandler,
    TEventHandler, TPriority, LocaleERRS, BaseObject, Utils, ObjectEvents,
    IObjectEvents, createWeakMap, IWeakMap, BRACKETS, StatefulPromise
} from "jriapp_shared";
import { STORE_KEY, SubscribeFlags, DATA_ATTR } from "./consts";
import {
    IApplication, ISelectableProvider, IDataProvider, IConverter, ISvcStore,
    IContentFactoryList, IElViewRegister, IStylesLoader, ISubscriber, TLoaderFunc, TDocInfo
} from "./int";
import { createElViewRegister } from "./elview";
import { createContentFactoryList } from "./content";
import { Defaults } from "defaults";
import { TemplateLoader, registerLoader } from "./utils/tloader";
import { createCssLoader } from "./utils/sloader";
import { PathHelper } from "./utils/path";
import { DomUtils } from "./utils/dom";
import { createQueue } from "jriapp_shared/utils/queue";
import { Helper as ParseHelper } from "./parsing/helper";

const utils = Utils, dom = DomUtils, win = dom.window, doc = win.document,
    { isFunc } = utils.check, { createDeferred, delay, resolve } = utils.async,
    { forEach, getNewID, getValue, setValue, removeValue, Indexer } = utils.core, { fromList } = utils.arr,
    { format, fastTrim } = utils.str, ERROR = utils.err, ERRS = LocaleERRS,
    { isGetExpr, getGetParts, getBraceContent } = ParseHelper;


export const subscribeWeakMap: IWeakMap = createWeakMap(), selectableProviderWeakMap: IWeakMap = createWeakMap();

// Implements polyfill for requestAnimationFrame API && Promise
(function () {
    const win: any = dom.window;

    // check if promise globally available
    if (!("Promise" in win)) {
        win.Promise = StatefulPromise;
    }

    // check if requestAnimationFrame implemented
    if (!win.requestAnimationFrame) {
        let requestAnimationFrame = win.requestAnimationFrame || win.mozRequestAnimationFrame ||
            win.webkitRequestAnimationFrame || win.msRequestAnimationFrame;

        let cancelAnimationFrame = win.cancelAnimationFrame || win.mozCancelAnimationFrame ||
            (win.webkitCancelAnimationFrame || win.webkitCancelRequestAnimationFrame) ||
            win.msCancelAnimationFrame;

        if (!requestAnimationFrame || !cancelAnimationFrame) {
            const queue = createQueue(40);

            requestAnimationFrame = queue.enque;
            cancelAnimationFrame = queue.cancel;
        }

        win.requestAnimationFrame = requestAnimationFrame;
        win.cancelAnimationFrame = cancelAnimationFrame;
    }
})();

const _TEMPLATE_SELECTOR = 'script[type="text/x-template"]';
const _OPTION_SELECTOR = 'script[type="text/x-options"]';
const _stylesLoader: IStylesLoader = createCssLoader();

const eventNames: IIndexer<SubscribeFlags> = {
    click: SubscribeFlags.click,
    change: SubscribeFlags.change,
    keypress: SubscribeFlags.keypress,
    keydown: SubscribeFlags.keydown,
    keyup: SubscribeFlags.keyup,
    input: SubscribeFlags.input
};

const enum GLOB_EVENTS {
    load = "load",
    unload = "unload",
    initialized = "initialize"
}

export interface IInternalBootstrapMethods {
    initialize(): IPromise<Bootstrapper>;
    registerApp(app: IApplication): void;
    unregisterApp(app: IApplication): void;
}

export const enum StartupState {
    None = 0, Initializing = 1, Initialized = 2, Ready = 3, Error = 4, Disposed = 5
}

class _ObjectEvents extends ObjectEvents {
    // override
    on(name: string, handler: TEventHandler, nmspace?: string, context?: IBaseObject, priority?: TPriority): void {
        const owner = <Bootstrapper>this.owner;
        const self = this, isReady = owner.state === StartupState.Ready;
        const isIntialized = (owner.state === StartupState.Initialized || owner.state === StartupState.Ready);

        if ((name === GLOB_EVENTS.load && isReady) || (name === GLOB_EVENTS.initialized && isIntialized)) {
            // when already is ready, immediately raise the event
            utils.queue.enque(() => { handler.apply(self, [self, {}]); });
        } else {
            // subscribe to the event
            super.on(name, handler, nmspace, context, priority);
        }
    }
}

export function registerConverter(root: IDataProvider, name: string, obj: IConverter): void {
    const name2 = STORE_KEY.CONVERTER + name;
    if(!getObject(root, name2)) {
        registerObject(root, name2, obj);
    } else {
        throw new Error(format(ERRS.ERR_OBJ_ALREADY_REGISTERED, name));
    }
}
export function getConverter(root: IDataProvider, name: string): IConverter {
    const name2 = STORE_KEY.CONVERTER + name;
    return getObject(root, name2);
}
export function registerSvc(root: IDataProvider, name: string, obj: any): void {
    const name2 = STORE_KEY.SVC + name;
    registerObject(root, name2, obj);
}
export function unregisterSvc(root: IDataProvider, name: string): any {
    const name2 = STORE_KEY.SVC + name;
    return unregisterObject(root, name2);
}
export function getSvc<T = any>(root: IDataProvider, name: string, ...args: any[]): T {
    const name2 = STORE_KEY.SVC + name, obj = getObject(root, name2);
    if (!obj) {
        return null;
    }
    const res = isFunc(obj) ? obj(...args) : obj;
    if (!res) {
        throw new Error(`The factory for service: ${name} have not returned the service`);
    }
    return res;
}
export function getOptions(root: IDataProvider, name: string): string {
    const name2 = STORE_KEY.OPTION + name;
    return getObject(root, name2);
}
export function registerObject(root: IDataProvider, name: string, obj: any): void {
    setValue(root.getData(), name, obj, true);
}
export function unregisterObject(root: IDataProvider, name: string): any {
    return removeValue(root.getData(), name);
}
export function getObject(root: IDataProvider, name: string): any {
    return getValue(root.getData(), name);
}
function registerOptions(root: IDataProvider, name: string, options: string): void {
    const name2 = STORE_KEY.OPTION + name;
    registerObject(root, name2, options);
}
function getRequiredModules(el: DocumentFragment): string[] {
    const elements = fromList(el.children), result: string[] = [];
    for (let i = 0, len = elements.length; i < len; i += 1) {
        const attr = elements[i].getAttribute(DATA_ATTR.DATA_REQUIRE);
        if (!!attr) {
            if (isGetExpr(attr)) {
                const ids = getBraceContent(attr, BRACKETS.ROUND);
                const parts = getGetParts(ids);
                for (const val of parts)
                {
                    if (!!val) {
                        result.push(...val.split(","));
                    }
                }
            } else {
                result.push(...attr.split(","));
            }
        }
    }

    if (result.length === 0) {
        return result;
    }

    const hashMap = Indexer();

    for (const name of result)
    {
        if (!!name) {
            const _name = fastTrim(name);
            if (!!_name) {
                hashMap[_name] = _name;
            }      
        }
    }

    return Object.keys(hashMap);
}

/**
  * This class  has nothing to do with the twitter bootstrap
  * it is used as the Root object of the JRIApp framework
  * it is created when this module is loaded and is a Singleton object
  * its lifetime spans the lifetime of the HTML page
*/
export class Bootstrapper extends BaseObject implements IDataProvider, ISvcStore {
    public static _initFramework() {
        dom.ready(() => {
            bootstrapper._getInternal().initialize();
        });
    }
    private _app: IApplication;
    private _selectedControl: ISelectableProvider;
    private _defaults: Defaults;
    private _templateLoader: TemplateLoader;
    private _bootState: StartupState;
    private _extraData: IIndexer<any>;
    private _internal: IInternalBootstrapMethods;
    private _moduleInits: { (app: IApplication): void; }[];
    private _elViewRegister: IElViewRegister;
    private _contentFactory: IContentFactoryList;
    private _uniqueID: string;

    constructor() {
        super();
        const self = this;
        if (!!bootstrapper) {
            throw new Error(ERRS.ERR_GLOBAL_SINGLTON);
        }
        this._bootState = StartupState.None;
        this._app = null;
        this._selectedControl = null;
        this._uniqueID = getNewID("app");

        // exported types
        this._extraData = Indexer();
        this._moduleInits = [];
        this._templateLoader = null;
        this._templateLoader = new TemplateLoader();
        this._templateLoader.addOnLoaded((_, a) => {
            self._onTemplateLoaded(a.html, a.owner);
        });
        this._templateLoader.objEvents.addOnError((_, a) => {
            return self.handleError(a.error, a.source);
        });
        this._elViewRegister = createElViewRegister(null);
        this._contentFactory = createContentFactoryList();
        this._internal = {
            initialize: () => {
                return self._initialize();
            },
            registerApp: (app: IApplication) => {
                self._registerApp(app);
            },
            unregisterApp: (app: IApplication) => {
                self._unregisterApp(app);
            }
        };
        this._defaults = new Defaults();
        this.defaults.imagesPath = PathHelper.getFrameworkImgPath();
        // load jriapp.css (it will load only if it is not loaded yet)
        _stylesLoader.loadOwnStyle();
        ERROR.addHandler("*", this);
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        const self = this;
        self.objEvents.off();
        self._destroyApp();
        self._extraData = Indexer();
        if (self._templateLoader !== null) {
            self._templateLoader.dispose();
            self._templateLoader = null;
        }
        self._elViewRegister.dispose();
        self._elViewRegister = null;
        self._contentFactory = null;
        self._moduleInits = [];
        dom.events.offNS(doc, this._uniqueID);
        dom.events.offNS(win, this._uniqueID);
        win.onerror = null;
        ERROR.removeHandler("*");
        this._bootState = StartupState.Disposed;
        super.dispose();
    }
    private _bindGlobalEvents(): void {
        const self = this, subscribeMap = subscribeWeakMap, selectableMap = selectableProviderWeakMap;

        // when clicked outside any Selectable Element View set focusedElView to null
        dom.events.on(doc, "click", (e) => {
            let target: Element | HTMLDocument = <any>e.target;
            // go up to the parent node
            while (!!target && target !== doc) {
                const obj = selectableMap.get(target);
                if (!!obj) {
                    //set as current selectable
                    self.selectedControl = obj;
                    return;
                }
                target = (<Element><any>target).parentElement;
            }
            // set to null if it's not inside a selectable
            self.selectedControl = null;
        }, this._uniqueID);

        // event delegation - capturing delegated events
        forEach(eventNames, ((name, flag) => {
            const fn_name = "handle_" + name;
            dom.events.on(doc, name, (e) => {
                const obj: any = subscribeMap.get(e.target);
                if (isFunc(obj[fn_name])) {
                    // stop propagation if the handler returns true
                    e.cancelBubble = !!(obj[fn_name](e.originalEvent));
                }
            }, {
                    nmspace: this._uniqueID,
                    matchElement: (el: Element) => {
                        const obj: ISubscriber = subscribeMap.get(el);
                        return !!obj && !!obj.isSubscribed(flag);
                    }
                });
        }));

        dom.events.on(doc, "keydown", (e) => {
            if (!!self._selectedControl) {
                const selectable = self._selectedControl.selectable;
                if (!!selectable) {
                    selectable.onKeyDown(e.which, e);
                }
            }
        }, this._uniqueID);
        dom.events.on(doc, "keyup", (e) => {
            if (!!self._selectedControl) {
                const selectable = self._selectedControl.selectable;
                if (!!selectable) {
                    selectable.onKeyUp(e.which, e);
                }
            }
        }, this._uniqueID);

        dom.events.on(win, "beforeunload", () => {
            self.objEvents.raise(GLOB_EVENTS.unload, {});
        }, this._uniqueID);

        // this is a way to attach for correct work in firefox
        win.onerror = (msg: any, url: string, linenumber: number) => {
            if (!!msg && msg.toString().indexOf(DUMY_ERROR) > -1) {
                return true;
            }
            alert("Error: " + msg + "\nURL: " + url + "\nLine Number: " + linenumber);
            return false;
        };
    }
    private _onTemplateLoaded(html: string, owner: IDataProvider): void {
        const divEl = doc.createElement("div");
        divEl.innerHTML = html;
        this._processOptions(owner, divEl);
        this._processTemplates(owner, divEl);
    }
    private _processOptions(owner: IDataProvider, root: HTMLElement | HTMLDocument): void {
        const jsons = dom.queryAll<Element>(root, _OPTION_SELECTOR);
        for (const el of jsons)
        {
            const name = el.getAttribute("id");
            if (!name) {
                throw new Error(ERRS.ERR_OPTIONS_HAS_NO_ID);
            }
            registerOptions(owner, name, el.innerHTML);
        }
    }
    private _processTemplates(owner: IDataProvider, root: HTMLElement | HTMLDocument): void {
        const self = this, templates = dom.queryAll<Element>(root, _TEMPLATE_SELECTOR);
        for (const el of templates)
        {
            const name = el.getAttribute("id");
            if (!name) {
                throw new Error(ERRS.ERR_TEMPLATE_HAS_NO_ID);
            }
            const html = el.innerHTML;
            self._processTemplate(owner, name, html);
        }
    }
    private _processTemplate(owner: IDataProvider, name: string, html: string): void {
        const frag = dom.getDocFragment(fastTrim(html)), required = getRequiredModules(frag);

        const res = resolve<TDocInfo>({ doc: frag, required: required }, true), loader: TLoaderFunc = () => res;
        // template already loaded, register function which returns the template immediately
        registerLoader(owner, name, loader);
    }
    // override
    protected _createObjEvents(): IObjectEvents {
        return new _ObjectEvents(this);
    }
    private _init(): IPromise<Bootstrapper> {
        const self = this;
        const promise: IPromise<Bootstrapper> = self.stylesLoader.whenAllLoaded().then(() => {
            if (self._bootState !== StartupState.None) {
                throw new Error("Invalid operation: bootState !== BootstrapState.None");
            }

            self._bootState = StartupState.Initializing;

            self._bindGlobalEvents();

            self._bootState = StartupState.Initialized;
            self.objEvents.raise(GLOB_EVENTS.initialized, {});
            self.objEvents.off(GLOB_EVENTS.initialized);

            return delay(() => {
                if (self.getIsStateDirty()) {
                    throw new Error("Bootstrap is in destroyed state");
                }
                self._processOptions(self, doc);
                self._processTemplates(self, doc);
                self._bootState = StartupState.Ready;
                self.objEvents.raiseProp("isReady");
                return self;
            });
        });

        const res = promise.then((boot) => {
            if (boot._bootState !== StartupState.Ready) {
                throw new Error("Invalid operation: bootState !== BootstrapState.Ready");
            }
            boot.objEvents.raise(GLOB_EVENTS.load, {});
            boot.objEvents.off(GLOB_EVENTS.load);
            return boot;
        });

        return res;
    }
    private _initialize(): IPromise<Bootstrapper> {
        const self = this;
        return self._init().then((_) => {
            return self;
        }, (err) => {
            self._bootState = StartupState.Error;
            return ERROR.reThrow(err, this.handleError(err, self));
        });
    }
    private _registerApp(app: IApplication): void {
        if (!!this._app) {
            throw new Error("Application already registered");
        }
        this._app = app;
        ERROR.addHandler(app.appName, app);
    }
    private _unregisterApp(app: IApplication): void {
        if (!this._app || this._app.appName !== app.appName) {
            throw new Error("Invalid operation");
        }

        try {
            ERROR.removeHandler(app.appName);
        } finally {
            this._app = null;
        }
    }
    private _destroyApp(): void {
        const self = this, app = self._app;
        if (!!app && !app.getIsStateDirty()) {
            app.dispose();
        }
    }
    private _waitLoaded(onLoad: (bootstrap: Bootstrapper) => void): void {
        const self = this;

        self.init(() => {
            self.addOnLoad(() => {
                setTimeout(() => {
                    try {
                        onLoad(self);
                    } catch (err) {
                        ERROR.reThrow(err, self.handleError(err, self));
                    }
                }, 0);
            });
        });
    }
    _getInternal(): IInternalBootstrapMethods {
        return this._internal;
    }
    addOnDisposed(handler: TEventHandler<Bootstrapper, any>, nmspace?: string, context?: object): void {
        this.objEvents.addOnDisposed(handler, nmspace, context);
    }
    offOnDisposed(nmspace?: string): void {
        this.objEvents.offOnDisposed(nmspace);
    }
    addOnError(handler: TErrorHandler<Bootstrapper>, nmspace?: string, context?: object): void {
        this.objEvents.addOnError(handler, nmspace, context);
    }
    offOnError(nmspace?: string): void {
        this.objEvents.offOnError(nmspace);
    }
    addOnLoad(fn: TEventHandler<Bootstrapper, any>, nmspace?: string, context?: IBaseObject) {
        this.objEvents.on(GLOB_EVENTS.load, fn, nmspace, context);
    }
    addOnUnLoad(fn: TEventHandler<Bootstrapper, any>, nmspace?: string, context?: IBaseObject) {
        this.objEvents.on(GLOB_EVENTS.unload, fn, nmspace, context);
    }
    addOnInitialize(fn: TEventHandler<Bootstrapper, any>, nmspace?: string, context?: IBaseObject) {
        this.objEvents.on(GLOB_EVENTS.initialized, fn, nmspace, context);
    }
    addModuleInit(fn: (app: IApplication) => void): boolean {
        if (this._moduleInits.filter((val) => { return val === fn; }).length === 0) {
            this._moduleInits.push(fn);
            return true;
        }
        return false;
    }
    getData(): IIndexer<any> {
        return this._extraData;
    }
    init(onInit: (bootstrap: Bootstrapper) => void): void {
        const self = this;
        self.addOnInitialize(() => {
            setTimeout(() => {
                try {
                    onInit(self);
                } catch (err) {
                    ERROR.reThrow(err, self.handleError(err, self));
                }
            }, 0);
        });
    }
    // starting application - use onStartUp callback to setUp handlers on objects, create viewModels and etc.
    // all  that we need to do before setting up databindings
    // returns Promise
    startApp<TApp extends IApplication>(appFactory: () => TApp, onStartUp?: (app: TApp) => void): IPromise<TApp> {
        const self = this, deferred = createDeferred<TApp>(), promise = deferred.promise();

        self._waitLoaded(() => {
            try {
                const app = appFactory();
                deferred.resolve(<IPromise<TApp>>app.startUp(onStartUp));
            } catch (err) {
                deferred.reject(err);
            }
        });

        const res = promise.then((app) => {
            return app;
        }, (err) => {
            return ERROR.reThrow(err, self.handleError(err, self));
        });

        return res;
    }
    registerSvc(name: string, obj: any): void {
        registerSvc(this, name, obj);
    }
    unregisterSvc(name: string): void {
        unregisterSvc(this, name);
    }
    getSvc<T = any>(name: string, ...args: any[]): T {
        const obj = getSvc(this, name, ...args);
        if (!obj) {
            throw new Error(`The service: ${name} is not registered`);
        }
        return obj;
    }
    getOptions(name: string): string {
        const res = getOptions(this, name);
        if (!res) {
            throw new Error(format(ERRS.ERR_OPTIONS_NOTREGISTERED, name));
        }
        return res;
    }
    registerConverter(name: string, obj: IConverter): void {
        registerConverter(this, name, obj);
    }
    registerElView(name: string, elViewType: any): void {
        this._elViewRegister.registerElView(name, elViewType);
    }
    getImagePath(imageName: string): string {
        const images = this.defaults.imagesPath;
        return images + imageName;
    }
    // Loads CSS placed in Framework's styles directory (it needs just file name)
    // if no name provided it loads jriapp.css
    loadOwnStyle(name: string): IPromise<string> {
        return this.stylesLoader.loadOwnStyle(name);
    }
    toString(): string {
        return "JRIApp Bootstrap";
    }
    get app(): IApplication {
        return this._app;
    }
    get stylesLoader(): IStylesLoader {
        return _stylesLoader;
    }
    get elViewRegister(): IElViewRegister {
        return this._elViewRegister;
    }
    get contentFactory(): IContentFactoryList {
        return this._contentFactory;
    }
    get templateLoader(): TemplateLoader {
        return this._templateLoader;
    }
    get selectedControl(): ISelectableProvider {
        return this._selectedControl;
    }
    set selectedControl(v: ISelectableProvider) {
        if (this._selectedControl !== v) {
            this._selectedControl = v;
            this.objEvents.raiseProp("selectedControl");
        }
    }
    get defaults(): Defaults {
        return this._defaults;
    }
    get isReady(): boolean {
        return this._bootState === StartupState.Ready;
    }
    get state(): StartupState {
        return this._bootState;
    }
}

export const bootstrapper = new Bootstrapper();
