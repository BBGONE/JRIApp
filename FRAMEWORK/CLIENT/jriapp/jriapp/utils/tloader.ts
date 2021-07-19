/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { IPromise, LocaleERRS, BaseObject, WaitQueue, Utils } from "jriapp_shared";
import { ITemplateGroupInfo, ITemplateLoaderInfo, IDataProvider, THTMLLoaderFunc, TLoaderFunc, TDocInfo } from "../int";
import { STORE_KEY } from "../consts";


const utils = Utils, { isFunc } = utils.check, { getValue, setValue } = utils.core,
    { format } = utils.str, { createDeferred, reject } = utils.async, ERRS = LocaleERRS, DEBUG = utils.debug,
    LOG = utils.log;

const enum LOADER_EVENTS {
    loaded = "loaded"
}

export function getLoader(root: IDataProvider, name: string): ITemplateLoaderInfo {
    const name2 = STORE_KEY.LOADER + name;
    return getValue(root.getData(), name2);
}

export function registerLoader(root: IDataProvider, name: string, loader: TLoaderFunc): void {
    if (!isFunc(loader)) {
        throw new Error(format(ERRS.ERR_ASSERTION_FAILED, "loader must be a Function"));
    }
    const name2 = STORE_KEY.LOADER + name;
    const info: ITemplateLoaderInfo = { loader: loader, owner: root };
    setValue(root.getData(), name2, info, true);
}

export function registerTemplateGroup(root: IDataProvider, name: string, obj: ITemplateGroupInfo): void {
    const name2 = STORE_KEY.TGROUP + name;
    setValue(root.getData(), name2, obj, true);
}

function getTemplateGroup(root: IDataProvider, name: string): ITemplateGroupInfo {
    const name2 = STORE_KEY.TGROUP + name;
    return getValue(root.getData(), name2);
}

function getGroupName(fullName: string): string {
    const parts: string[] = fullName.split(".");
    if (parts.length > 2) {
        throw new Error(`Invalid template name: ${fullName}`);
    }
    return (parts.length === 1) ? "" : parts[0];
}

export interface ILoaderContext extends IDataProvider {
    getTemplateLoaderInfo: (name: string) => ITemplateLoaderInfo;
}

export class TemplateLoader extends BaseObject {
    private _promises: IPromise<string>[];
    private _waitQueue: WaitQueue;

    constructor() {
        super();
        const self = this;
        this._promises = [];
        this._waitQueue = new WaitQueue(self);
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        const self = this;
        self._promises = [];
        if (!!self._waitQueue) {
            self._waitQueue.dispose();
            self._waitQueue = null;
        }
        super.dispose();
    }
    addOnLoaded(fn: (sender: TemplateLoader, args: { html: string; owner: IDataProvider }) => void, nmspace?: string): void {
        this.objEvents.on(LOADER_EVENTS.loaded, fn, nmspace);
    }
    offOnLoaded(nmspace?: string): void {
        this.objEvents.off(LOADER_EVENTS.loaded, nmspace);
    }
    public waitForNotLoading(callback: (...args: any[]) => any, callbackArgs: any): void {
        this._waitQueue.enQueue({
            prop: "isLoading",
            groupName: null,
            predicate: (val: any) => !val,
            action: callback,
            actionArgs: callbackArgs
        });
    }
    private _onLoaded(html: string, owner: IDataProvider): void {
        this.objEvents.raise(LOADER_EVENTS.loaded, { html: html, owner: owner });
    }
    public loadTemplatesAsync(owner: IDataProvider, loader: THTMLLoaderFunc): IPromise<void> {
        const self = this, promise = loader(), old = self.isLoading;
        self._promises.push(promise);
        if (self.isLoading !== old) {
            self.objEvents.raiseProp("isLoading");
        }
        const res: IPromise<void> = promise.then((html: string) => {
            self._onLoaded(html, owner);
        });

        res.finally(() => {
            utils.arr.remove(self._promises, promise);
            if (!self.isLoading) {
                self.objEvents.raiseProp("isLoading");
            }
        });

        return res;
    }
    // returns a promise resolved with the template's html
    public getTemplateLoader(context: ILoaderContext, name: string): TLoaderFunc {
        const self = this, info: ITemplateLoaderInfo = context.getTemplateLoaderInfo(name);

        if (!!info) {
            return info.loader;
        } else {
            const groupName = getGroupName(name);
            if (!groupName) {
                return null;
            } else {
                // load the group of templates
                const group = getTemplateGroup(context, groupName);
                if (!group) {
                    throw new Error(format(ERRS.ERR_TEMPLATE_GROUP_NOTREGISTERED, groupName));
                }

                return () => {
                    // it prevents double loading
                    if (!group.promise) {
                        // start loading only if no another loading in progress
                        group.promise = self.loadTemplatesAsync(group.owner, group.loader);
                    }

                    const deferred = createDeferred<TDocInfo>(true);

                    group.promise.then(() => {
                        const info: ITemplateLoaderInfo = context.getTemplateLoaderInfo(name);
                        if (!info) {
                            const error = format(ERRS.ERR_TEMPLATE_NOTREGISTERED, name), rejected = reject<TDocInfo>(error, true);
                            // template failed to load, register function which rejects immediately
                            registerLoader(group.owner, name, () => rejected);
                            if (DEBUG.isDebugging()) {
                                LOG.error(error);
                            }
                            throw new Error(error);
                        }

                        const loadPromise = info.loader();

                        loadPromise.then((docInfo) => {
                            deferred.resolve(docInfo);
                        }, (err) => {
                            deferred.reject(err);
                        });
                    }).catch((err) => {
                        deferred.reject(err);
                    });

                    return deferred.promise();
                };
            }
        }
    }
    get isLoading(): boolean {
        return this._promises.length > 0;
    }
}
