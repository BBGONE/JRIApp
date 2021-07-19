/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    ITaskQueue, IStatefulDeferred, IStatefulPromise, IPromise, IThenable
} from "./ipromise";
import {
    createDefer, whenAll, race, getTaskQueue, StatefulPromise, promiseSerial
} from "./promise";
import { Checks } from "./checks";

const { isString, isFunc } = Checks, _whenAll = whenAll, _race = race, _getTaskQueue = getTaskQueue, _createDefer = createDefer;

export type TDelayedFunc<T> = () => IPromise<T> | T;

export class AsyncUtils {
    static createDeferred<T>(isSync?: boolean): IStatefulDeferred<T> {
        return _createDefer<T>(isSync);
    }
    static reject<T>(reason?: any, isSync?: boolean): IStatefulPromise<T> {
        return StatefulPromise.reject(reason, isSync);
    }
    static resolve<T>(value?: T, isSync?: boolean): IStatefulPromise<T> {
        return StatefulPromise.resolve(value, isSync);
    }
    /**
     * execute sequentially
     * @param funcs (array of functions which return promises)
     */
    static promiseSerial<T>(funcs: { (): IPromise<T>; }[]): IStatefulPromise<T[]> {
        return promiseSerial(funcs);
    }
    static whenAll<T>(args: Array<T | IThenable<T>>): IStatefulPromise<T[]> {
        return _whenAll(args);
    }
    static race<T>(promises: Array<IThenable<T>>): IPromise<T> {
        return _race(promises);
    }
    static getTaskQueue(): ITaskQueue {
        return _getTaskQueue();
    }
    static delay<T = any>(funcORvalue?: TDelayedFunc<T> | T, time: number = 0): IStatefulPromise<T> {
        return new StatefulPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    if (isFunc(funcORvalue)) {
                        resolve(funcORvalue());
                    } else {
                        resolve(funcORvalue);
                    }
                } catch (err) {
                    reject(err);
                }
            }, time);
        }, true);
    }
    static parseJSON<T>(res: string | any): IStatefulPromise<T>;
    static parseJSON(res: any): IStatefulPromise<any> {
        return AsyncUtils.delay(() => {
            return (isString(res)) ? JSON.parse(res) : res;
        });
    }
}
