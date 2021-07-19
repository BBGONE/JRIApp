/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    BaseObject, Utils, IIndexer, LocaleERRS, createWeakMap, IWeakMap
} from "jriapp_shared";
import { DATA_ATTR } from "./consts";
import {
    IElViewStore, IElView, IViewType, IDataProvider, IViewOptions, IElViewInfo,
    IElViewFactory, IElViewRegister
} from "./int";
import { getObject, registerObject } from "./bootstrapper";
import { Parser } from "./utils/parser";

const utils = Utils, { Indexer } = utils.core, { format } = utils.str, parser = Parser, ERRS = LocaleERRS;

export function createElViewFactory(register: IElViewRegister): IElViewFactory {
    return new ElViewFactory(register);
}

export function createElViewRegister(next?: IElViewRegister): IElViewRegister {
    return new ElViewRegister(next);
}

class ElViewRegister implements IElViewRegister, IDataProvider {
    private _exports: IIndexer<any>;
    private _next: IElViewRegister;

    constructor(next?: IElViewRegister) {
        this._exports = Indexer();
        this._next = next;
    }
    dispose(): void {
        this._exports = Indexer();
    }
    registerElView(name: string, vwType: IViewType): void {
        if (!getObject(this, name)) {
            registerObject(this, name, vwType);
        } else {
            throw new Error(utils.str.format(ERRS.ERR_OBJ_ALREADY_REGISTERED, name));
        }
    }
    getElViewType(name: string): IViewType {
        let res = getObject(this, name);
        if (!res && !!this._next) {
            res = this._next.getElViewType(name);
        }
        return res;
    }
    getData(): IIndexer<any> {
        return this._exports;
    }
}

class ElViewStore implements IElViewStore {
    private readonly _weakmap: IWeakMap;

    constructor() {
        this._weakmap = createWeakMap();
    }
    dispose(): void {
    }
    // get element view associated with HTML element(if any)
    getElView(el: HTMLElement): IElView {
        return this._weakmap.get(el);
    }
    // store association of HTML element with its element View
    setElView(el: HTMLElement, view?: IElView): void {
        if (!view) {
            this._weakmap.delete(el);
        } else {
            this._weakmap.set(el, view);
        }
    }
}

class ElViewFactory extends BaseObject implements IElViewFactory {
    private _store: IElViewStore;
    private _register: IElViewRegister;

    constructor(register: IElViewRegister) {
        super();
        this._store = new ElViewStore();
        this._register = createElViewRegister(register);
    }
    dispose(): void {
        if (!this._store) {
            return;
        }
        this._store.dispose();
        this._register.dispose();
        this._store = null;
        this._register = null;
        super.dispose();
    }
    createElView(viewInfo: IElViewInfo): IElView {
        let viewType: IViewType, elView: IElView;
        const { el, options, name } = viewInfo;

        if (!!name) {
            viewType = this._register.getElViewType(name);
            if (!viewType) {
                throw new Error(format(ERRS.ERR_ELVIEW_NOT_REGISTERED, name));
            }
        }
        if (!viewType) {
            let nodeNm = el.nodeName.toLowerCase(), attrType: string;
            switch (nodeNm) {
                case "input":
                    {
                        attrType = el.getAttribute("type");
                        nodeNm = nodeNm + ":" + attrType;
                        viewType = this._register.getElViewType(nodeNm);
                    }
                    break;
                default:
                    viewType = this._register.getElViewType(nodeNm);
                    break;
            }

            if (!viewType) {
                throw new Error(format(ERRS.ERR_ELVIEW_NOT_CREATED, nodeNm));
            }
        }

        try {
            elView = new viewType(el, options || {});
        } catch (e) {
            // ensure clean up
            this._store.setElView(el, null);
            throw e;
        }
        return elView;
    }
    getElView(el: HTMLElement): IElView {
        return this.store.getElView(el);
    }
    getElementViewInfo(el: HTMLElement, dataContext: any = null): IElViewInfo {
        let viewName: string = null;
        if (el.hasAttribute(DATA_ATTR.DATA_VIEW)) {
            const attr = el.getAttribute(DATA_ATTR.DATA_VIEW);
            if (!!attr && attr !== "default") {
                viewName = attr;
            }
        }
        let options: IViewOptions;
        if (el.hasAttribute(DATA_ATTR.DATA_VIEW_OPTIONS)) {
            const attr = el.getAttribute(DATA_ATTR.DATA_VIEW_OPTIONS);
            options = <IViewOptions>parser.parseViewOptions(attr, dataContext);
        } else {
            options = Indexer();
        }
       
        return { el: el, name: viewName, options: options };
    }
    get store(): IElViewStore {
        return this._store;
    }
    get register(): IElViewRegister {
        return this._register;
    }
}
