/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { IAbortablePromise, ICancellationToken, TResolved } from "./ipromise";
import { IIndexer } from "../int";
import { StringUtils } from "./strUtils";
import { DummyError } from "../errors";
import { CoreUtils } from "./coreutils";
import { AbortablePromise } from "./promise";

const { forEach, merge, Indexer } = CoreUtils, { startsWith, fastTrim } = StringUtils;

export class HttpUtils {
    public static isStatusOK(status: string | number): boolean {
        const chk = fastTrim("" + status);
        return chk.length === 3 && startsWith(chk, "2");
    }
    private static _getXMLRequest(url: string,
        method: string,
        deferred: {
            resolve: (res?: TResolved<string>) => void;
            reject: (err?: any) => void;
            token?: ICancellationToken;
        },
        headers?: IIndexer<string>): XMLHttpRequest {
        const req = new XMLHttpRequest();
        req.open(method, url, true);
        req.responseType = "text";

        deferred.token?.register(() => { req.abort(); });

        req.onload = function () {
            const status = "" + req.status;
            if (status === "200") {
                const res: string = req.response;
                deferred.resolve(res);
            } else {
                if (HttpUtils.isStatusOK(status)) {
                    deferred.reject(new DummyError(new Error(`Status: "${status}" loading from URL: "${url}"`)));
                } else {
                    deferred.reject(new Error(`Error: "${status}" to load from URL: "${url}"`));
                }
            }
        };
        req.onerror = function () {
            deferred.reject(new Error(`Error: "${req.status}" to load from URL: "${url}"`));
        };
        req.ontimeout = function () {
            deferred.reject(new Error(`Error: "Request Timeout" to load from URL: "${url}"`));
        };
        req.onabort = function () {
            deferred.reject(new Error(`HTTP Request Operation Aborted for URL: "${url}"`));
        };
        req.timeout = HttpUtils.ajaxTimeOut * 1000;
        let _headers = <IIndexer<string>>merge(HttpUtils.defaultHeaders);
        _headers = merge(headers, _headers);
        forEach(_headers, (name, val) => {
            req.setRequestHeader(name, val);
        });
        return req;
    }

    static postAjax(url: string, postData: string, headers?: IIndexer<string>): IAbortablePromise<string> {
        const _headers = <IIndexer<string>>merge(headers, { "Content-Type": "application/json; charset=utf-8" });
        return new AbortablePromise<string>((resolve, reject, token) => {
            const req = HttpUtils._getXMLRequest(url, "POST", { resolve, reject, token }, _headers);
            req.send(postData);
        });
    }
    static getAjax(url: string, headers?: IIndexer<string>): IAbortablePromise<string> {
        return new AbortablePromise<string>((resolve, reject, token) => {
            const req = HttpUtils._getXMLRequest(url, "GET", { resolve, reject, token }, headers);
            req.send(null);
        });
    }
    static defaultHeaders: IIndexer<string> = Indexer();
    static ajaxTimeOut: number = 600;
}
