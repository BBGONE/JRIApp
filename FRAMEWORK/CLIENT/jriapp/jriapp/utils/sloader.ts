/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    IIndexer, Utils, IStatefulPromise, PromiseState
} from "jriapp_shared";
import { AsyncUtils } from "jriapp_shared/utils/asyncutils";
import { DomUtils } from "./dom";
import { IStylesLoader } from "../int";
import { PathHelper } from "./path";

const { resolve: _resolve, whenAll: _whenAll, createDeferred } = AsyncUtils, utils = Utils,
    dom = DomUtils, arrHelper = utils.arr, doc = dom.document, head = doc.head || doc.getElementsByTagName("head")[0];
let _stylesLoader: IStylesLoader = null;
export const frameworkCss = "jriapp.css";

export function createCssLoader(): IStylesLoader {
    if (!_stylesLoader) {
        _stylesLoader = new StylesLoader();
    }
    return _stylesLoader;
}

function whenAll(promises: IStatefulPromise<any>[]): IStatefulPromise<any> {
    if (!promises) {
        return _resolve<void>(void 0, true);
    }
    if (promises.length === 1) {
        return promises[0];
    }
    let resolved = 0;
    const cnt = promises.length;
    for (let i = 0; i < cnt; i += 1) {
        if (promises[i].state() === PromiseState.Resolved) {
            ++resolved;
        }
    }

    return (resolved === cnt) ? _resolve<void>(void 0, true) : _whenAll(promises);
}

function createLink(url: string) {
    const link = doc.createElement("link");

    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;

    return link;
}

export interface IUrlParts {
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    hash: string;
    search: string;
}

// load css styles on demand
class StylesLoader implements IStylesLoader {
    private _loadedCSS: IIndexer<IStatefulPromise<string>>;

    constructor() {
        this._loadedCSS = <IIndexer<IStatefulPromise<string>>>{};
    }
    private isStyleSheetLoaded(url: string): boolean {
        const testUrl = PathHelper.getUrlParts(url);
        const arr = arrHelper.fromList(doc.styleSheets);
        for (let i = 0; i < arr.length; i += 1) {
            const cssUrl = PathHelper.getUrlParts(arr[i].href);
            if (cssUrl.hostname === testUrl.hostname && cssUrl.pathname === testUrl.pathname) {
                return true;
            }
        }

        return false;
    }
    private loadByLink(url: string, fnOnload: (err: any) => void): void {
        const link = createLink(url);
        link.onload = function () {
            fnOnload(null);
        };
        link.onerror = function () {
            fnOnload("Error loading: " + url);
        };
        head.appendChild(link);
    }
    private load(url: string, load: (err: any) => void): void {
        this.loadByLink(url, load);
    };
    private static ensureCssExt(name: string): string {
        return name.search(/\.(css|less|scss)$/i) === -1 ? name + ".css" : name;
    }
    loadStyle(url: string): IStatefulPromise<string> {
        url = PathHelper.appendBust(url);
        const cssUrl = PathHelper.getNormalizedUrl(url);

        // test if we already are loading this css file
        let cssPromise = this._loadedCSS[cssUrl];
        if (!!cssPromise) {
            return cssPromise;
        }
        const deferred = createDeferred<string>(true);
        cssPromise = deferred.promise();

        if (this.isStyleSheetLoaded(url)) {
            deferred.resolve(url);
            this._loadedCSS[cssUrl] = cssPromise;
            return cssPromise;
        }

        this.load(url, (err: any) => {
            if (!!err) {
                deferred.reject(err);
            } else {
                deferred.resolve(url);
            }
        });

        this._loadedCSS[cssUrl] = cssPromise;
        return cssPromise;
    }
    loadStyles(urls: string[]): IStatefulPromise<any> {
        const promises = <IStatefulPromise<string>[]>[];

        for (let i = 0; i < urls.length; i += 1) {
            promises.push(this.loadStyle(urls[i]));
        }
        return whenAll(promises);
    }
    loadOwnStyle(cssName?: string): IStatefulPromise<string> {
        cssName = cssName || frameworkCss;
        const cssUrl = PathHelper.getFrameworkCssPath() + StylesLoader.ensureCssExt(cssName);
        return this.loadStyle(cssUrl);
    }
    whenAllLoaded(): IStatefulPromise<any> {
        const obj = this._loadedCSS, names = Object.keys(obj), promises: IStatefulPromise<any>[] = [];
        for (let name of names) {
            promises.push(obj[name]);
        }
        return whenAll(promises);
    }
}
