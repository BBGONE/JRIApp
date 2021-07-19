/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { Utils, IIndexer, IPromise, IDeferred } from "jriapp_shared";
import { IModuleLoader, Config as config } from "../int";
import { createCssLoader as createCSSLoader } from "./sloader";

const utils = Utils, { forEach, Indexer } = utils.core, { startsWith } = utils.str,
    { reject: _reject, resolve: _resolve, whenAll: _whenAll, createDeferred } = utils.async,
    arrHelper = utils.arr, CSSPrefix = "css!";

let _moduleLoader: IModuleLoader = null;

export function create(): IModuleLoader {
    if (!_moduleLoader) {
        _moduleLoader = new ModuleLoader();
    }
    return _moduleLoader;
}

const enum LOAD_STATE {
    NONE = 0, LOADING = 1, LOADED = 2
}

interface IModuleLoad {
    name: string;
    err: any;
    state: LOAD_STATE;
    defered: IDeferred<any>;
}

function whenAll(loads: IModuleLoad[]): IPromise<any> {
    if (!loads || loads.length === 0) {
        return _resolve<void>(void 0, true);
    }
    if (loads.length === 1) {
        return loads[0].defered.promise();
    }

    const cnt = loads.length;
    let resolved = 0, err: any = null;
    for (let i = 0; i < cnt; i += 1) {
        if (loads[i].state === LOAD_STATE.LOADED) {
            ++resolved;
            if (!!loads[i].err) {
                err = loads[i].err;
            }
        }
    }

    if (resolved === cnt) {
        return !err ? _resolve<void>(void 0, true) : _reject(err);
    } else {
        return _whenAll(loads.map((load) => {
            return load.defered.promise();
        }));
    }
}

class ModuleLoader implements IModuleLoader {
    private _loads: IIndexer<IModuleLoad>;
    private _cssLoads: IIndexer<IModuleLoad>;

    constructor() {
        this._loads = Indexer();
        this._cssLoads = Indexer();
    }
    load(names: string[]): IPromise<void> {
        const self = this;

        // load CSS too if they are in the array
        const cssNames = names.filter((val) => { return self.isCSS(val); }), cssLoads = self.loadCSS(cssNames),
            modNames = names.filter((val) => { return !self.isCSS(val); }), forLoad = modNames.filter((val) => {
                return !self._loads[val];
            });

        if (forLoad.length > 0) {
            forLoad.forEach((name) => {
                const load = {
                    name: name,
                    err: null,
                    state: LOAD_STATE.LOADING,
                    defered: createDeferred<any>(true)
                } as IModuleLoad;
                self._loads[name] = load;
                // dynamic import thanks to typescript
                import(name).then(() => {
                    load.state = LOAD_STATE.LOADED;
                    load.defered.resolve();
                }, (err: any) => {
                    load.state = LOAD_STATE.LOADED;
                    load.err = err;
                    load.defered.reject(`Error loading modules: ${"" + err}`);
                });
            });
        }

        const loads = arrHelper.merge<IModuleLoad>([modNames.map((name) => {
            return self._loads[name];
        }), cssLoads]);

        return whenAll(loads);
    }
    whenAllLoaded(): IPromise<void> {
        const loads: IModuleLoad[] = [];
        forEach(this._loads, (_, val) => {
            loads.push(val);
        });
        return whenAll(loads);
    }

    private loadCSS(names: string[]): IModuleLoad[] {
        const self = this, forLoad = names.filter((val) => {
            return !self._cssLoads[val];
        }), urls = forLoad.map((val) => {
            return self.getUrl(val);
        });

        if (forLoad.length > 0) {
            const cssLoader = createCSSLoader();

            forLoad.forEach((name) => {
                self._cssLoads[name] = {
                    name: name,
                    err: null,
                    state: LOAD_STATE.LOADING,
                    defered: createDeferred<any>(true)
                };
            });

            cssLoader.loadStyles(urls).then(() => {
                forLoad.forEach((name) => {
                    const load = self._cssLoads[name];
                    load.state = LOAD_STATE.LOADED;
                    load.defered.resolve();
                });
            }, (err) => {
                forLoad.forEach((name) => {
                    const load = self._cssLoads[name];
                    load.state = LOAD_STATE.LOADED;
                    load.err = err;
                    load.defered.reject(err);
                });
            });
        }

        const loads = names.map((name) => {
            return self._cssLoads[name];
        });
        return loads;
    }
    private isCSS(name: string): boolean {
        return !!name && startsWith(name, CSSPrefix);
    }
    private getUrl(name: string): string {
        if (this.isCSS(name)) {
            name = name.substr(CSSPrefix.length);
        }

        let url = config.cssPath || "";
        // append slash (if not present)
        url = url.replace(/\/?$/, '/');
        // convert the name to url
        return `${url}${name}`;
    }
}
