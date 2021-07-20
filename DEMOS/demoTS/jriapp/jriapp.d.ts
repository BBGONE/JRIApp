declare module "jriapp/consts" {
    export const enum SERVICES {
        TOOLTIP_SVC = "ITooltipService",
        DATEPICKER_SVC = "IDatepicker",
        UIERRORS_SVC = "IUIErrorsService"
    }
    export const enum BINDING_MODE {
        OneTime = 0,
        OneWay = 1,
        TwoWay = 2,
        BackWay = 3
    }
    export const enum STORE_KEY {
        SVC = "svc.",
        CONVERTER = "cnv.",
        OBJECT = "obj.",
        OPTION = "opt.",
        LOADER = "ldr.",
        TGROUP = "tgrp."
    }
    export const enum DATA_ATTR {
        DATA_BIND = "data-bind",
        DATA_VIEW = "data-view",
        DATA_VIEW_OPTIONS = "data-view-options",
        DATA_EVENT_SCOPE = "data-scope",
        DATA_ITEM_KEY = "data-key",
        DATA_CONTENT = "data-content",
        DATA_COLUMN = "data-column",
        DATA_NAME = "data-name",
        DATA_REQUIRE = "data-require"
    }
    export const enum KEYS {
        backspace = 8,
        tab = 9,
        enter = 13,
        esc = 27,
        space = 32,
        pageUp = 33,
        pageDown = 34,
        end = 35,
        home = 36,
        left = 37,
        up = 38,
        right = 39,
        down = 40,
        del = 127
    }
    export const enum ELVIEW_NM {
        DataForm = "dataform"
    }
    export const enum LOADER_GIF {
        Small = "loader2.gif",
        Default = "loader.gif"
    }
    export const enum BindScope {
        Application = 0,
        Template = 1,
        DataForm = 2
    }
    export const enum BindTo {
        Source = 0,
        Target = 1
    }
    export const enum SubscribeFlags {
        delegationOn = 0,
        click = 1,
        change = 2,
        keypress = 3,
        keydown = 4,
        keyup = 5,
        input = 6
    }
}
declare module "jriapp/int" {
    import { BINDING_MODE, BindTo, SubscribeFlags, BindScope } from "jriapp/consts";
    import { IBaseObject, IDisposable, IIndexer, IPromise, IErrorHandler, IConfig, TEventHandler, IValidationInfo } from "jriapp_shared";
    import { IFieldInfo } from "jriapp_shared/collection/int";
    export interface IJRIAppConfig extends IConfig {
        cssPath?: string;
        frameworkPath?: string;
        frameworkJS?: string;
        bust?: string;
    }
    export const Config: IJRIAppConfig;
    export class ButtonCss {
        static Edit: string;
        static Delete: string;
        static OK: string;
        static Cancel: string;
    }
    export interface ILifeTimeScope extends IBaseObject {
        addObj(b: IBaseObject): void;
        removeObj(b: IBaseObject): void;
        getObjs(): IBaseObject[];
        findAll<TObj extends IBaseObject>(predicate: (obj: IBaseObject) => boolean): TObj[];
        findFirst<TObj extends IBaseObject>(predicate: (obj: IBaseObject) => boolean): TObj;
    }
    export interface ISubscriber {
        isSubscribed(flag: SubscribeFlags): boolean;
    }
    export interface IDatepicker {
        datepickerRegion: string;
        dateFormat: string;
        attachTo(el: HTMLElement, options?: any, onSelect?: (dateText?: string) => void): void;
        detachFrom(el: HTMLElement): void;
        parseDate(str: string): Date;
        formatDate(date: Date): string;
    }
    export interface ISelectable {
        onKeyDown(key: number, event: Event): void;
        onKeyUp(key: number, event: Event): void;
    }
    export interface ISelectableProvider {
        readonly selectable: ISelectable;
    }
    export interface IDataProvider {
        getData(): IIndexer<any>;
    }
    export interface ISvcStore {
        getSvc<T>(name: string): T;
        getSvc(name: string): any;
    }
    export type TDocInfo = {
        doc: DocumentFragment;
        required: string[] | null;
    };
    export type THTMLLoaderFunc = () => IPromise<string>;
    export type TLoaderFunc = () => IPromise<TDocInfo>;
    export interface ITemplateLoaderInfo {
        loader: TLoaderFunc;
        owner: IDataProvider;
    }
    export interface ITemplateGroupInfo {
        name: string;
        url: string;
        loader: THTMLLoaderFunc;
        promise: IPromise<void>;
        owner: IDataProvider;
    }
    export interface IUnResolvedBindingArgs {
        bindTo: BindTo;
        root: any;
        path: string;
        propName: string;
    }
    export interface ITemplate extends IBaseObject {
        findElByDataName(name: string): HTMLElement[];
        findElViewsByDataName(name: string): IElView[];
        isLoaded: boolean;
        dataContext: any;
        templateID: string;
        el: HTMLElement;
        app: IApplication;
    }
    export interface ITemplateEvents {
        templateLoading(template: ITemplate): void;
        templateLoaded(template: ITemplate, error?: any): void;
        templateUnLoading(template: ITemplate): void;
    }
    export interface IViewErrorsService {
        setErrors(el: HTMLElement, errors: IValidationInfo[], toolTip?: string): void;
    }
    export interface IViewOptions {
        css?: string;
        tip?: string;
        nodelegate?: boolean;
        errorsService?: IViewErrorsService;
    }
    export interface IElViewStore {
        getElView(el: HTMLElement): IElView;
        setElView(el: HTMLElement, view?: IElView): void;
        dispose(): void;
    }
    export interface IElViewRegister {
        registerElView(name: string, vwType: IViewType): void;
        getElViewType(name: string): IViewType;
        dispose(): void;
    }
    export interface IElViewInfo {
        readonly el: HTMLElement;
        readonly name: string;
        readonly options: IViewOptions;
    }
    export interface IElViewFactory {
        getElementViewInfo(el: HTMLElement, dataContext: any): IElViewInfo;
        createElView(viewInfo: IElViewInfo): IElView;
        getElView(el: HTMLElement): IElView;
        store: IElViewStore;
        register: IElViewRegister;
        dispose(): void;
    }
    export interface IViewType {
        new (el: HTMLElement, options: IViewOptions): IElView;
    }
    export interface IElView extends IBaseObject {
        readonly el: HTMLElement;
        readonly app: IApplication;
        readonly uniqueID: string;
        bindingState: number;
        viewMounted?: () => void;
    }
    export interface ITemplateElView extends IElView, ITemplateEvents {
    }
    export interface IConverter {
        convertToSource(val: any, param: any, dataContext: any): any;
        convertToTarget(val: any, param: any, dataContext: any): any;
    }
    export interface IBinding extends IBaseObject {
        target: IBaseObject;
        source: IBaseObject;
        targetPath: string[];
        sourcePath: string[];
        sourceValue: any;
        targetValue: any;
        readonly isSourceFixed: boolean;
        readonly mode: BINDING_MODE;
        readonly converter: IConverter;
        readonly param: any;
        isDisabled: boolean;
        updateTarget(): void;
        updateSource(): void;
    }
    export interface IBindArgs {
        readonly scope: Document | HTMLElement;
        readonly bind: BindScope;
        readonly dataContext: any;
    }
    export interface IDataBindingService extends IDisposable {
        bindTemplate(templateEl: HTMLElement, dataContext: any, required: string[] | null): IPromise<ILifeTimeScope>;
        bindElements(args: IBindArgs): IPromise<ILifeTimeScope>;
        setUpBindings(): IPromise<void>;
        bind(opts: TBindingOptions): IBinding;
    }
    export type TBindingOptions = {
        targetPath: string;
        sourcePath?: string;
        target?: IBaseObject;
        source?: any;
        isSourceFixed?: boolean;
        mode?: BINDING_MODE;
        converter?: IConverter;
        param?: any;
        isBind?: boolean;
    };
    export type TBindingMode = "OneTime" | "OneWay" | "TwoWay" | "BackWay";
    export type TBindingInfo = {
        targetPath: string;
        sourcePath?: string;
        to?: string;
        target?: any;
        source?: any;
        mode?: TBindingMode;
        converter?: any;
        param?: any;
        isBind?: boolean;
    };
    export interface IExternallyCachable {
        addOnObjectCreated(fn: (sender: any, args: {
            objectKey: string;
            result: IBaseObject;
            isCachedExternally: boolean;
        }) => void, nmspace?: string): void;
        addOnObjectNeeded(fn: (sender: any, args: {
            objectKey: string;
            result: IBaseObject;
        }) => void, nmspace?: string): void;
    }
    export interface IContent extends IBaseObject {
        isEditing: boolean;
        dataContext: any;
        render(): void;
    }
    export interface IContentConstructor {
        new (options: IConstructorContentOptions): IContent;
    }
    export interface ITemplateInfo {
        readID?: string;
        editID?: string;
    }
    export interface IContentOptions {
        name: string;
        readOnly: boolean;
        initContentFn: (content: IExternallyCachable) => void;
        fieldInfo: IFieldInfo;
        css: {
            readCss?: string;
            editCss?: string;
            elReadCss?: string;
            elEditCss?: string;
        };
        template: ITemplateInfo;
        fieldName: string;
        options: any;
    }
    export interface IConstructorContentOptions {
        parentEl: HTMLElement;
        contentOptions: IContentOptions;
        dataContext: any;
        isEditing: boolean;
    }
    export interface IContentFactory {
        getContentType(options: IContentOptions): IContentConstructor;
        isExternallyCachable(contentType: IContentConstructor): boolean;
    }
    export interface IContentFactoryList extends IContentFactory {
        addFactory(factoryGetter: TFactoryGetter): void;
    }
    export type TFactoryGetter = (nextFactory?: IContentFactory) => IContentFactory;
    export interface ITooltipService {
        addToolTip(el: Element, tip: string, isError?: boolean, pos?: string): void;
    }
    export interface IStylesLoader {
        loadStyle(url: string): IPromise<any>;
        loadStyles(urls: string[]): IPromise<any>;
        loadOwnStyle(cssName?: string): IPromise<string>;
        whenAllLoaded(): IPromise<any>;
    }
    export interface IModuleLoader {
        load(names: string[]): IPromise<void>;
        whenAllLoaded(): IPromise<void>;
    }
    export interface IInternalAppMethods extends IDataProvider {
        bindTemplate(templateEl: HTMLElement, dataContext: any, required: string[] | null): IPromise<ILifeTimeScope>;
        bindElements(args: IBindArgs): IPromise<ILifeTimeScope>;
        getTemplateLoaderInfo(name: string): ITemplateLoaderInfo;
    }
    export interface IApplication extends IErrorHandler, IDataProvider, IBaseObject {
        _getInternal(): IInternalAppMethods;
        addOnStartUp(fn: TEventHandler<IApplication, any>, nmspace?: string, context?: IBaseObject): void;
        offOnStartUp(nmspace?: string): void;
        registerElView(name: string, vwType: IViewType): void;
        registerConverter(name: string, obj: IConverter): void;
        getConverter(name: string): IConverter;
        registerSvc(name: string, obj: any): void;
        getSvc<T = any>(name: string, ...args: any[]): T;
        registerObject(name: string, obj: any): void;
        getObject<T = any>(name: string): T;
        loadTemplates(url: string): IPromise<void>;
        registerTemplateLoader(name: string, loader: THTMLLoaderFunc): void;
        getTemplateLoader(name: string): TLoaderFunc;
        registerTemplateGroup(name: string, url: string): void;
        getOptions(name: string): string;
        bind(opts: TBindingOptions): IBinding;
        startUp(onStartUp?: (app: IApplication) => any): IPromise<IApplication>;
        readonly uniqueID: string;
        readonly appName: string;
        readonly appRoot: Document | HTMLElement;
        readonly viewFactory: IElViewFactory;
    }
    export interface IAppOptions {
        modulesInits?: IIndexer<(app: IApplication) => void>;
        appRoot?: Document | HTMLElement;
    }
}
declare module "jriapp/parsing/int" {
    export const getRX: RegExp, spaceRX: RegExp;
    export const enum TOKEN {
        DELIMETER1 = ":",
        DELIMETER2 = "=",
        COMMA = ",",
        THIS = "this.",
        PARAM = "param",
        TARGET_PATH = "targetPath",
        BIND = "bind",
        GET = "get",
        DATE = "date",
        INJECT = "inject"
    }
    export const enum TAG {
        NONE = "",
        LITERAL = "0",
        BIND = "1",
        GET = "2",
        DATE = "3",
        INJECT = "4",
        BRACE = "5",
        INDEXER = "6"
    }
    export const enum PARSE_TYPE {
        NONE = 0,
        BINDING = 1,
        VIEW = 2
    }
    export const enum DATES {
        NOW = "now",
        TODAY = "today",
        TOMORROW = "tomorrow",
        YESTERDAY = "yesterday"
    }
    export const THIS_LEN: number;
    export interface IKeyVal {
        tag?: TAG;
        key: string;
        val: any;
    }
}
declare module "jriapp/parsing/helper" {
    import { BRACKETS } from "jriapp_shared";
    import { TAG, IKeyVal, PARSE_TYPE } from "jriapp/parsing/int";
    export class Funcs {
        static setKeyVal(kv: IKeyVal, start: number, end: number, val: string, isKey: boolean, isLit: boolean): void;
        static getDate(val: string | null | undefined, format: string | undefined): Date;
        static getTag(val: string, start: number, end: number): TAG;
        static checkVal(kv: IKeyVal): boolean;
        static getKeyVals(val: string): IKeyVal[];
        static reduceKeyVal(kv: IKeyVal, parseType: PARSE_TYPE, dataContext: any, res: any): void;
        static getExprArgs(expr: string): Array<string | object>;
    }
    export class Helper {
        static getCurlyBraceParts(val: string): string[];
        static getBraceContent(val: string, brace: BRACKETS): string;
        static getSvc(id: string, ...args: any[]): any;
        static isGetExpr(val: string): boolean;
        static getGetParts(str: string): string[];
        static getOptions(id: string): string;
        static parseGetExpr(parseType: PARSE_TYPE, strExpr: string, dataContext: any): object;
        static parseOptions(parseType: PARSE_TYPE, parts: string[], dataContext: any): object;
        static parseOption(parseType: PARSE_TYPE, part: string, dataContext: any): object;
    }
}
declare module "jriapp/utils/parser" {
    import { TBindingInfo } from "jriapp/int";
    export class Parser {
        static parseOptions(options: string): object;
        static parseBindings(bindings: string[]): TBindingInfo[];
        static parseViewOptions(options: string, dataContext: any): object;
    }
}
declare module "jriapp/elview" {
    import { IElViewFactory, IElViewRegister } from "jriapp/int";
    export function createElViewFactory(register: IElViewRegister): IElViewFactory;
    export function createElViewRegister(next?: IElViewRegister): IElViewRegister;
}
declare module "jriapp/content" {
    import { IContentFactoryList } from "jriapp/int";
    export function createContentFactoryList(): IContentFactoryList;
}
declare module "jriapp/defaults" {
    import { BaseObject } from "jriapp_shared";
    import { ButtonCss } from "jriapp/int";
    export type TButtonCss = typeof ButtonCss;
    export class Defaults extends BaseObject {
        private _imagesPath;
        private _dateFormat;
        private _dateTimeFormat;
        private _timeFormat;
        private _decimalPoint;
        private _thousandSep;
        private _decPrecision;
        constructor();
        toString(): string;
        get dateFormat(): string;
        set dateFormat(v: string);
        get timeFormat(): string;
        set timeFormat(v: string);
        get dateTimeFormat(): string;
        set dateTimeFormat(v: string);
        get imagesPath(): string;
        set imagesPath(v: string);
        get decimalPoint(): string;
        set decimalPoint(v: string);
        get thousandSep(): string;
        set thousandSep(v: string);
        get decPrecision(): number;
        set decPrecision(v: number);
        get ButtonsCSS(): TButtonCss;
    }
}
declare module "jriapp/utils/tloader" {
    import { IPromise, BaseObject } from "jriapp_shared";
    import { ITemplateGroupInfo, ITemplateLoaderInfo, IDataProvider, THTMLLoaderFunc, TLoaderFunc } from "jriapp/int";
    export function getLoader(root: IDataProvider, name: string): ITemplateLoaderInfo;
    export function registerLoader(root: IDataProvider, name: string, loader: TLoaderFunc): void;
    export function registerTemplateGroup(root: IDataProvider, name: string, obj: ITemplateGroupInfo): void;
    export interface ILoaderContext extends IDataProvider {
        getTemplateLoaderInfo: (name: string) => ITemplateLoaderInfo;
    }
    export class TemplateLoader extends BaseObject {
        private _promises;
        private _waitQueue;
        constructor();
        dispose(): void;
        addOnLoaded(fn: (sender: TemplateLoader, args: {
            html: string;
            owner: IDataProvider;
        }) => void, nmspace?: string): void;
        offOnLoaded(nmspace?: string): void;
        waitForNotLoading(callback: (...args: any[]) => any, callbackArgs: any): void;
        private _onLoaded;
        loadTemplatesAsync(owner: IDataProvider, loader: THTMLLoaderFunc): IPromise<void>;
        getTemplateLoader(context: ILoaderContext, name: string): TLoaderFunc;
        get isLoading(): boolean;
    }
}
declare module "jriapp/utils/domevents" {
    export type TEventNode = {
        fn: THandlerFunc;
        name: string;
        useCapture?: boolean;
    };
    export type TEventNodeArray = TEventNode[];
    export interface INamespaceMap {
        [ns: string]: TEventNodeArray;
    }
    export type TEventList = INamespaceMap;
    export type TDomElement = Element | Document | Window;
    export type TEventsArgs = {
        nmspace?: string;
        useCapture?: boolean;
    };
    export type TEventsDelegateArgs = {
        nmspace: string;
        matchElement: (el: Element) => boolean;
    };
    export type TEventsArgsOrNamespace = TEventsArgs | string | TEventsDelegateArgs;
    export type THandlerFunc = (evt: any) => void;
    export class EventWrap<TEvent extends Event = Event> {
        private _ev;
        private _target;
        private _cancelBubble;
        constructor(ev: TEvent, target: EventTarget | null);
        get type(): string;
        get target(): EventTarget | null;
        get bubbles(): boolean;
        get defaultPrevented(): boolean;
        get cancelable(): boolean;
        get isTrusted(): boolean;
        get returnValue(): boolean;
        set returnValue(v: boolean);
        get srcElement(): EventTarget | null;
        get eventPhase(): number;
        get cancelBubble(): boolean;
        set cancelBubble(v: boolean);
        get timeStamp(): number;
        get currentTarget(): EventTarget;
        get originalEvent(): TEvent;
        get AT_TARGET(): number;
        get BUBBLING_PHASE(): number;
        get CAPTURING_PHASE(): number;
        preventDefault(): void;
        stopPropagation(): void;
        stopImmediatePropagation(): void;
    }
    export class DomEvents {
        static on(el: TDomElement, evType: "abort", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "activate", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "beforeactivate", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "beforedeactivate", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "blur", listener: (ev: FocusEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "canplay", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "canplaythrough", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "change", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "click", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "contextmenu", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "dblclick", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "deactivate", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "drag", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "dragend", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "dragenter", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "dragleave", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "dragover", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "dragstart", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "drop", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "durationchange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "emptied", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "ended", listener: (ev: MediaStreamErrorEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "error", listener: (ev: ErrorEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "focus", listener: (ev: FocusEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "fullscreenchange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "fullscreenerror", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "input", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "invalid", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "keydown", listener: (ev: KeyboardEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "keypress", listener: (ev: KeyboardEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "keyup", listener: (ev: KeyboardEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "load", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "loadeddata", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "loadedmetadata", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "loadstart", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "mousedown", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "mousemove", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "mouseout", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "mouseover", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "mouseup", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "mousewheel", listener: (ev: WheelEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "pause", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "play", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "playing", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "pointercancel", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "pointerdown", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "pointerenter", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "pointerleave", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "pointerlockchange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "pointerlockerror", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "pointermove", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "pointerout", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "pointerover", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "pointerup", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "progress", listener: (ev: ProgressEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "ratechange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "readystatechange", listener: (ev: ProgressEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "reset", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "scroll", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "seeked", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "seeking", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "select", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "selectionchange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "selectstart", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "stalled", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "stop", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "submit", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "suspend", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "timeupdate", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "touchcancel", listener: (ev: TouchEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "touchend", listener: (ev: TouchEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "touchmove", listener: (ev: TouchEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "touchstart", listener: (ev: TouchEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "volumechange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "waiting", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "webkitfullscreenchange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "webkitfullscreenerror", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: "wheel", listener: (ev: WheelEvent) => any, args?: TEventsArgsOrNamespace): void;
        static on(el: TDomElement, evType: string, listener: (ev: EventWrap) => any, args: TEventsDelegateArgs): void;
        static on(el: TDomElement, evType: string, listener: EventListenerOrEventListenerObject, args?: TEventsArgsOrNamespace): void;
        static off(el: TDomElement, evType?: string, nmspace?: string, useCapture?: boolean): void;
        static offNS(el: TDomElement, nmspace?: string): void;
    }
}
declare module "jriapp/utils/dom" {
    import { TFunc } from "jriapp_shared";
    import { DomEvents } from "jriapp/utils/domevents";
    export type TCheckDOMReady = (closure: TFunc) => void;
    export class DomUtils {
        static readonly window: Window;
        static readonly document: Document;
        static readonly ready: TCheckDOMReady;
        static readonly events: typeof DomEvents;
        static isTemplateTagAvailable(): boolean;
        static getData(el: Node, key: string): any;
        static setData(el: Node, key: string, val: any): void;
        static removeData(el: Node, key?: string): void;
        static isContained(node: Node, container: Node): boolean;
        static getDocFragment(html: string): DocumentFragment;
        static fromHTML(html: string): HTMLElement[];
        static queryAll<T>(root: Document | Element, selector: string): T[];
        static queryOne<T extends Element>(root: Document | Element, selector: string): T;
        static append(parent: Node, children: Node[]): void;
        static prepend(parent: Node, child: Node): void;
        static removeNode(node: Node): void;
        static insertAfter(node: Node, refNode: Node): void;
        static insertBefore(node: Node, refNode: Node): Node;
        static wrap(elem: Element, wrapper: Element): void;
        static unwrap(elem: Element): void;
        private static getClassMap;
        static setClasses(elems: Element[], classes: string[]): void;
        static setClass(elems: Element[], css: string, remove?: boolean): void;
        static addClass(elems: Element[], css: string): void;
        static removeClass(elems: Element[], css: string): void;
    }
}
declare module "jriapp/utils/path" {
    export const frameworkJS: string;
    export interface IUrlParts {
        protocol: string;
        host: string;
        hostname: string;
        port: string;
        pathname: string;
        hash: string;
        search: string;
    }
    export class PathHelper {
        private static _anchor;
        static appendBust(url: string): string;
        static appendSearch(url: string, search: string): string;
        static getNormalizedUrl(url: string): string;
        static getUrlParts(url: string): IUrlParts;
        static getParentUrl(url: string): string;
        static getFrameworkPath(): string;
        static getFrameworkCssPath(): string;
        static getFrameworkImgPath(): string;
    }
}
declare module "jriapp/utils/sloader" {
    import { IStylesLoader } from "jriapp/int";
    export const frameworkCss = "jriapp.css";
    export function createCssLoader(): IStylesLoader;
    export interface IUrlParts {
        protocol: string;
        host: string;
        hostname: string;
        port: string;
        pathname: string;
        hash: string;
        search: string;
    }
}
declare module "jriapp/bootstrapper" {
    import { IIndexer, IBaseObject, IPromise, TErrorHandler, TEventHandler, BaseObject, IObjectEvents, IWeakMap } from "jriapp_shared";
    import { IApplication, ISelectableProvider, IDataProvider, IConverter, ISvcStore, IContentFactoryList, IElViewRegister, IStylesLoader } from "jriapp/int";
    import { Defaults } from "jriapp/defaults";
    import { TemplateLoader } from "jriapp/utils/tloader";
    export const subscribeWeakMap: IWeakMap, selectableProviderWeakMap: IWeakMap;
    export interface IInternalBootstrapMethods {
        initialize(): IPromise<Bootstrapper>;
        registerApp(app: IApplication): void;
        unregisterApp(app: IApplication): void;
    }
    export const enum StartupState {
        None = 0,
        Initializing = 1,
        Initialized = 2,
        Ready = 3,
        Error = 4,
        Disposed = 5
    }
    export function registerConverter(root: IDataProvider, name: string, obj: IConverter): void;
    export function getConverter(root: IDataProvider, name: string): IConverter;
    export function registerSvc(root: IDataProvider, name: string, obj: any): void;
    export function unregisterSvc(root: IDataProvider, name: string): any;
    export function getSvc<T = any>(root: IDataProvider, name: string, ...args: any[]): T;
    export function getOptions(root: IDataProvider, name: string): string;
    export function registerObject(root: IDataProvider, name: string, obj: any): void;
    export function unregisterObject(root: IDataProvider, name: string): any;
    export function getObject(root: IDataProvider, name: string): any;
    export class Bootstrapper extends BaseObject implements IDataProvider, ISvcStore {
        static _initFramework(): void;
        private _app;
        private _selectedControl;
        private _defaults;
        private _templateLoader;
        private _bootState;
        private _extraData;
        private _internal;
        private _moduleInits;
        private _elViewRegister;
        private _contentFactory;
        private _uniqueID;
        constructor();
        dispose(): void;
        private _bindGlobalEvents;
        private _onTemplateLoaded;
        private _processOptions;
        private _processTemplates;
        private _processTemplate;
        protected _createObjEvents(): IObjectEvents;
        private _init;
        private _initialize;
        private _registerApp;
        private _unregisterApp;
        private _destroyApp;
        private _waitLoaded;
        _getInternal(): IInternalBootstrapMethods;
        addOnDisposed(handler: TEventHandler<Bootstrapper, any>, nmspace?: string, context?: object): void;
        offOnDisposed(nmspace?: string): void;
        addOnError(handler: TErrorHandler<Bootstrapper>, nmspace?: string, context?: object): void;
        offOnError(nmspace?: string): void;
        addOnLoad(fn: TEventHandler<Bootstrapper, any>, nmspace?: string, context?: IBaseObject): void;
        addOnUnLoad(fn: TEventHandler<Bootstrapper, any>, nmspace?: string, context?: IBaseObject): void;
        addOnInitialize(fn: TEventHandler<Bootstrapper, any>, nmspace?: string, context?: IBaseObject): void;
        addModuleInit(fn: (app: IApplication) => void): boolean;
        getData(): IIndexer<any>;
        init(onInit: (bootstrap: Bootstrapper) => void): void;
        startApp<TApp extends IApplication>(appFactory: () => TApp, onStartUp?: (app: TApp) => void): IPromise<TApp>;
        registerSvc(name: string, obj: any): void;
        unregisterSvc(name: string): void;
        getSvc<T = any>(name: string, ...args: any[]): T;
        getOptions(name: string): string;
        registerConverter(name: string, obj: IConverter): void;
        registerElView(name: string, elViewType: any): void;
        getImagePath(imageName: string): string;
        loadOwnStyle(name: string): IPromise<string>;
        toString(): string;
        get app(): IApplication;
        get stylesLoader(): IStylesLoader;
        get elViewRegister(): IElViewRegister;
        get contentFactory(): IContentFactoryList;
        get templateLoader(): TemplateLoader;
        get selectedControl(): ISelectableProvider;
        set selectedControl(v: ISelectableProvider);
        get defaults(): Defaults;
        get isReady(): boolean;
        get state(): StartupState;
    }
    export const bootstrapper: Bootstrapper;
}
declare module "jriapp/utils/viewchecks" {
    import { IElView, ITemplateElView } from "jriapp/int";
    export class ViewChecks {
        static isElView: (obj: any) => obj is IElView;
        static isTemplateElView: (obj: any) => obj is ITemplateElView;
        static isDataForm: (el: Element) => boolean;
        static isInsideDataForm: (el: Element) => boolean;
        static isInNestedForm: (root: any, forms: Element[], el: Element) => boolean;
        static getParentDataForm: (rootForm: HTMLElement, el: HTMLElement) => HTMLElement;
    }
}
declare module "jriapp/converter" {
    import { IConverter } from "jriapp/int";
    export const NUM_CONV: {
        None: number;
        Integer: number;
        Decimal: number;
        Float: number;
        SmallInt: number;
    };
    export class BaseConverter implements IConverter {
        convertToSource(val: any, _param: any, _dataContext: any): any;
        convertToTarget(val: any, _param: any, _dataContext: any): any;
    }
    export let baseConverter: BaseConverter;
    export class DateConverter implements IConverter {
        convertToSource(val: any, _param: any, dataContext: any): Date;
        convertToTarget(val: any, _param: any, dataContext: any): string;
        toString(): string;
    }
    export class DateTimeConverter implements IConverter {
        convertToSource(val: string, param: string, _dataContext: any): Date;
        convertToTarget(val: Date, param: string, _dataContext: any): string;
        toString(): string;
    }
    export class NumberConverter implements IConverter {
        convertToSource(val: any, param: any, _dataContext: any): number;
        convertToTarget(val: any, param: any, _dataContext: any): string;
        toString(): string;
    }
    export class IntegerConverter implements IConverter {
        convertToSource(val: any, _param: any, dataContext: any): number;
        convertToTarget(val: any, _param: any, dataContext: any): string;
        toString(): string;
    }
    export class SmallIntConverter implements IConverter {
        convertToSource(val: any, _param: any, dataContext: any): number;
        convertToTarget(val: any, _param: any, dataContext: any): string;
        toString(): string;
    }
    export class DecimalConverter implements IConverter {
        convertToSource(val: any, _param: any, dataContext: any): number;
        convertToTarget(val: any, _param: any, dataContext: any): string;
        toString(): string;
    }
    export class FloatConverter implements IConverter {
        convertToSource(val: any, _param: any, dataContext: any): number;
        convertToTarget(val: any, _param: any, dataContext: any): string;
        toString(): string;
    }
    export class NotConverter implements IConverter {
        convertToSource(val: any, _param: any, _dataContext: any): boolean;
        convertToTarget(val: any, _param: any, _dataContext: any): boolean;
    }
}
declare module "jriapp/binding" {
    import { IBaseObject, BaseObject } from "jriapp_shared";
    import { BINDING_MODE } from "jriapp/consts";
    import { TBindingInfo, TBindingOptions, IBinding, IConverter, IApplication } from "jriapp/int";
    export function getBindingOptions(bindInfo: TBindingInfo, defTarget: IBaseObject, dataContext: any): TBindingOptions;
    export class Binding extends BaseObject implements IBinding {
        private _state;
        private _mode;
        private _converter;
        private _param;
        private _isBindParam;
        private _srcPath;
        private _tgtPath;
        private _srcFixed;
        private _pathItems;
        private _uniqueID;
        private _srcEnd;
        private _tgtEnd;
        private _source;
        private _target;
        private _umask;
        private _cntUtgt;
        private _cntUSrc;
        constructor(options: TBindingOptions);
        dispose(): void;
        private _update;
        private _onSrcErrChanged;
        private _getTgtChangedFn;
        private _getSrcChangedFn;
        private _addOnPropChanged;
        private _parseSrc;
        private _parseSrc2;
        private _parseTgt;
        private _parseTgt2;
        private _setPathItem;
        private _cleanUp;
        protected _setTarget(value: any): boolean;
        protected _setSource(value: any): boolean;
        updateTarget(): void;
        updateSource(): void;
        toString(): string;
        get uniqueID(): string;
        get target(): IBaseObject;
        set target(v: IBaseObject);
        get source(): any;
        set source(v: any);
        get targetPath(): string[];
        get sourcePath(): string[];
        get sourceValue(): any;
        set sourceValue(v: any);
        get targetValue(): any;
        set targetValue(v: any);
        get isSourceFixed(): boolean;
        get mode(): BINDING_MODE;
        get converter(): IConverter;
        get param(): any;
        get isDisabled(): boolean;
        set isDisabled(v: boolean);
        get app(): IApplication;
    }
}
declare module "jriapp/template" {
    import { ITemplate, ITemplateEvents } from "jriapp/int";
    export const enum css {
        templateContainer = "ria-template-container",
        templateError = "ria-template-error"
    }
    export interface ITemplateOptions {
        parentEl: HTMLElement | null;
        dataContext?: any;
        templEvents?: ITemplateEvents;
    }
    export function createTemplate(options: ITemplateOptions): ITemplate;
}
declare module "jriapp/utils/lifetime" {
    import { IBaseObject, BaseObject } from "jriapp_shared";
    import { ILifeTimeScope } from "jriapp/int";
    export class LifeTimeScope extends BaseObject implements ILifeTimeScope {
        private _objs;
        constructor();
        dispose(): void;
        addObj(b: IBaseObject): void;
        removeObj(b: IBaseObject): void;
        getObjs(): IBaseObject[];
        findAll<TObj extends IBaseObject>(predicate: (obj: IBaseObject) => boolean): TObj[];
        findFirst<TObj extends IBaseObject>(predicate: (obj: IBaseObject) => boolean): TObj;
        toString(): string;
    }
}
declare module "jriapp/utils/propwatcher" {
    import { IBaseObject, BaseObject } from "jriapp_shared";
    export class PropWatcher extends BaseObject {
        private _uniqueID;
        private _objs;
        constructor();
        dispose(): void;
        static create(): PropWatcher;
        addPropWatch(obj: IBaseObject, prop: string, fnOnChange: (prop: string) => void): void;
        addWatch(obj: IBaseObject, props: string[], fnOnChange: (prop: string) => void): void;
        removeWatch(obj: IBaseObject): void;
        toString(): string;
        get uniqueID(): string;
    }
}
declare module "jriapp/mvvm" {
    import { BaseObject, IBaseObject, TEventHandler, TErrorHandler } from "jriapp_shared";
    import { IApplication } from "jriapp/int";
    export interface IExecutor<TParam = any> {
        execute: (param: TParam) => void;
    }
    export interface ICommand<TParam = any> extends IExecutor<TParam> {
        canExecute: (param: TParam) => boolean;
        raiseCanExecuteChanged: () => void;
        addOnCanExecuteChanged(fn: (sender: ICommand<TParam>, args: any) => void, nmspace?: string, context?: IBaseObject): void;
        offOnCanExecuteChanged(nmspace?: string): void;
    }
    export type Action<TParam = any> = (param: TParam) => void;
    export type Predicate<TParam = any> = (param: TParam) => boolean;
    export class Command<TParam = any> extends BaseObject implements ICommand<TParam> {
        private _action;
        private _predicate;
        private _uniqueID;
        constructor(fnAction: Action<TParam>, fnCanExecute?: Predicate<TParam>);
        dispose(): void;
        protected _canExecute(param: TParam): boolean;
        protected _execute(param: TParam): void;
        addOnCanExecuteChanged(fn: (sender: this, args: any) => void, nmspace?: string, context?: IBaseObject): void;
        offOnCanExecuteChanged(nmspace?: string): void;
        canExecute(param: TParam): boolean;
        execute(param: TParam): void;
        raiseCanExecuteChanged(): void;
        toString(): string;
        get uniqueID(): string;
    }
    export abstract class BaseCommand<TOwner, TParam = any> extends Command<TParam> {
        private _owner;
        constructor(owner: TOwner);
        dispose(): void;
        protected _canExecute(param: TParam): boolean;
        protected _execute(param: TParam): void;
        protected abstract action(param: TParam): void;
        protected abstract isCanExecute(param: TParam): boolean;
        get owner(): TOwner;
    }
    export class ViewModel<TApp extends IApplication = IApplication> extends BaseObject {
        private _uniqueID;
        private _app;
        constructor(app: TApp);
        addOnDisposed(handler: TEventHandler<ViewModel<TApp>, any>, nmspace?: string, context?: object): void;
        offOnDisposed(nmspace?: string): void;
        addOnError(handler: TErrorHandler<ViewModel<TApp>>, nmspace?: string, context?: object): void;
        offOnError(nmspace?: string): void;
        toString(): string;
        get uniqueID(): string;
        get app(): TApp;
    }
}
declare module "jriapp/utils/mloader" {
    import { IModuleLoader } from "jriapp/int";
    export function create(): IModuleLoader;
}
declare module "jriapp/databindsvc" {
    import { IDataBindingService, IApplication } from "jriapp/int";
    export function createDataBindSvc(app: IApplication): IDataBindingService;
}
declare module "jriapp/app" {
    import { IIndexer, TEventHandler, IPromise, TErrorHandler, IBaseObject, BaseObject } from "jriapp_shared";
    import { IElViewFactory, IViewType, IApplication, TBindingOptions, IAppOptions, IInternalAppMethods, IConverter, IBinding, TLoaderFunc, THTMLLoaderFunc } from "jriapp/int";
    export class Application<TOptions extends IAppOptions = any> extends BaseObject implements IApplication {
        private _UC;
        private _moduleInits;
        private _uniqueID;
        private _objMaps;
        private _appName;
        private _extraData;
        private _dataBindingService;
        private _viewFactory;
        private _internal;
        private _appState;
        private _options;
        constructor(options?: TOptions);
        dispose(): void;
        private _cleanUpObjMaps;
        private _initAppModules;
        private _getTemplateLoaderInfo;
        protected onStartUp(): any;
        _getInternal(): IInternalAppMethods;
        addOnDisposed(handler: TEventHandler<IApplication, any>, nmspace?: string, context?: object): void;
        offOnDisposed(nmspace?: string): void;
        addOnError(handler: TErrorHandler<IApplication>, nmspace?: string, context?: object): void;
        offOnError(nmspace?: string): void;
        addOnStartUp(fn: TEventHandler<IApplication, any>, nmspace?: string, context?: IBaseObject): void;
        offOnStartUp(nmspace?: string): void;
        getData(): IIndexer<any>;
        bind(opts: TBindingOptions): IBinding;
        registerConverter(name: string, obj: IConverter): void;
        getConverter(name: string): IConverter;
        registerSvc(name: string, obj: any): void;
        unregisterSvc(name: string): void;
        getSvc<T = any>(name: string, ...args: any[]): T;
        registerElView(name: string, vwType: IViewType): void;
        registerObject(name: string, obj: any): void;
        getObject<T = any>(name: string): T;
        startUp(onStartUp?: (app: IApplication) => any): IPromise<IApplication>;
        loadTemplates(url: string): IPromise<void>;
        registerTemplateLoader(name: string, loader: THTMLLoaderFunc): void;
        registerTemplateById(name: string, templateId: string): void;
        getTemplateLoader(name: string): TLoaderFunc;
        registerTemplateGroup(name: string, url: string): void;
        getOptions(name: string): string;
        toString(): string;
        get uniqueID(): string;
        get options(): TOptions;
        get appName(): string;
        get appRoot(): Document | HTMLElement;
        get viewFactory(): IElViewFactory;
        get UC(): any;
        get app(): IApplication;
    }
}
declare module "jriapp" {
    export * from "jriapp_shared";
    export * from "jriapp_shared/collection/const";
    export * from "jriapp_shared/collection/int";
    export * from "jriapp_shared/utils/jsonbag";
    export { StatefulPromise } from "jriapp_shared/utils/promise";
    export { KEYS, BINDING_MODE, BindTo, SubscribeFlags } from "jriapp/consts";
    export { IAppOptions, IApplication, TBindingMode, ITemplate, ITemplateEvents, IBinding, TBindingInfo, TBindingOptions, IConverter, IContentFactory, IDatepicker, IElView, ITooltipService, ISelectable, ISelectableProvider, ILifeTimeScope, ITemplateGroupInfo, ITemplateInfo, IViewOptions, ISubscriber } from "jriapp/int";
    export { DomUtils as DOM } from "jriapp/utils/dom";
    export { ViewChecks } from "jriapp/utils/viewchecks";
    export { BaseConverter } from "jriapp/converter";
    export { bootstrapper, subscribeWeakMap, selectableProviderWeakMap } from "jriapp/bootstrapper";
    export { Binding } from "jriapp/binding";
    export { createTemplate, ITemplateOptions } from "jriapp/template";
    export { LifeTimeScope } from "jriapp/utils/lifetime";
    export { PropWatcher } from "jriapp/utils/propwatcher";
    export { ViewModel, BaseCommand, Command, ICommand } from "jriapp/mvvm";
    export { Application } from "jriapp/app";
    export const VERSION = "4.0.0";
}
