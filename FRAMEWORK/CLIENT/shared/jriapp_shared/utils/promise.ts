/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    IStatefulDeferred, IStatefulPromise, ITaskQueue, PromiseState, TResolved,
    IThenable, IPromise, IAbortablePromise, ICancellationToken, ICancellationTokenSource
} from "./ipromise";
import { ERROR } from "./error";
import { AbortError } from "../errors";
import { Checks } from "./checks";
import { createQueue, IQueue } from "./queue";

export * from "./ipromise";

const { _undefined, isFunc, isThenable, isArray } = Checks;
let taskQueue: TaskQueue = null;

export function createDefer<T = any>(isSync?: boolean): IStatefulDeferred<T> {
    return new StatefulPromise<T>(null, isSync).deferred();
}

export function createSyncDefer<T>(): IStatefulDeferred<T> {
    return createDefer<T>(true);
}

export function getTaskQueue(): ITaskQueue {
    if (!taskQueue) {
        taskQueue = new TaskQueue();
    }
    return taskQueue;
}

export function whenAll<T>(promises: Array<T | IThenable<T>>): IStatefulPromise<T[]> {
    const results: T[] = [], resolved: IThenable<T> = createDefer<T>().resolve(null);
    const merged: any = promises.reduce((acc: IThenable<T>, p: T | IThenable<T>) => acc.then(() => p).then((r: T) => { results.push(r); return r; })
        , resolved);
    return merged.then(() => results);
}

export function race<T>(promises: IThenable<T>[]): IStatefulPromise<T> {
    return new StatefulPromise((res, rej) => {
        promises.forEach(p => p.then(res).then(_undefined, rej));
    });
}

/**
 * Sequentially executes functions which return promises
   instead  it returns a promise which have a result - an array of results of the promises
 * @param funcs (array of functions which return promises)
 */
export function promiseSerial<T>(funcs: { (): IThenable<T>; }[]): IStatefulPromise<T[]> {
    return funcs.reduce((promise, func) => promise.then(result => func().then((res) => result.concat(res))),
        StatefulPromise.resolve<T[]>([]));
}

function dispatch(isSync: boolean, task: () => void): void {
    if (!isSync) {
        getTaskQueue().enque(task);
    }
    else {
        task();
    }
}

class TaskQueue implements ITaskQueue {
    private _queue: IQueue;

    constructor() {
        this._queue = createQueue(0);
    }

    enque(task: () => void): number {
        return this._queue.enque(task);
    }

    cancel(taskId: number): void {
       this._queue.cancel(taskId);
    }
}

class Callback {
    private readonly _isSync: boolean;
    private readonly _successCB: any;
    private readonly _errorCB: any;
    private readonly _deferred: IStatefulDeferred<any>;

    constructor(isSync: boolean, successCB: any, errorCB: any) {
        this._isSync = isSync;
        this._successCB = successCB;
        this._errorCB = errorCB;
        this._deferred = new StatefulPromise<any>(null, isSync).deferred();
    }

    resolve(value: any, defer: boolean): void {
        if (!isFunc(this._successCB)) {
            this._deferred.resolve(value);
            return;
        }

        if (!defer) {
            this._dispatch(this._successCB, value);
        } else {
            dispatch(this._isSync, () => this._dispatch(this._successCB, value));
        }
    }
    reject(error: any, defer: boolean): void {
        if (!isFunc(this._errorCB)) {
            this._deferred.reject(error);
            return;
        }

        if (!defer) {
            this._dispatch(this._errorCB, error);
        } else {
            dispatch(this._isSync, () => this._dispatch(this._errorCB, error));
        }
    }
    private _dispatch(callback: (arg: any) => any, arg: any): void {
        try {
            const result = callback(arg);
            this._deferred.resolve(result);
        } catch (err) {
            this._deferred.reject(err);
        }
    }

    get deferred(): IStatefulDeferred<any> {
        return this._deferred;
    }
}

class Deferred<T = any> implements IStatefulDeferred<T> {
    private readonly _promise: IStatefulPromise<T>;
    private readonly _isSync: boolean;
    private _stack: Array<Callback>;
    private _state: PromiseState;
    private _value: T;
    private _error: any;

    constructor(promise: IStatefulPromise<T>, isSync: boolean = false) {
        this._promise = promise;
        this._isSync = isSync;
        this._value = _undefined;
        this._error = _undefined;
        this._state = PromiseState.Pending;
        this._stack = [];
    }

    private _resolve(value: any): IStatefulDeferred<T> {
        let pending = true;
        try {
            if (isThenable(value)) {
                if (value === this._promise) {
                    throw new TypeError("recursive resolution");
                }
                const fnThen = value.then;
                this._state = PromiseState.ResolutionInProgress;

                fnThen.call(value,
                    (result: any): void => {
                        if (pending) {
                            pending = false;
                            this._resolve(result);
                        }
                    },
                    (error: any): void => {
                        if (pending) {
                            pending = false;
                            this._reject(error);
                        }
                    }
                );
            } else {
                this._state = PromiseState.ResolutionInProgress;

                dispatch(this._isSync, () => {
                    this._state = PromiseState.Resolved;
                    this._value = value;

                    const stackSize = this._stack.length;
                    for (let i = 0; i < stackSize; i++) {
                        this._stack[i].resolve(value, false);
                    }

                    this._stack.splice(0, stackSize);
                });
            }
        } catch (err) {
            if (pending) {
                this._reject(err);
            }
        }

        return this;
    }
    private _reject(error?: any): IStatefulDeferred<T> {
        this._state = PromiseState.ResolutionInProgress;

        dispatch(this._isSync, () => {
            this._state = PromiseState.Rejected;
            this._error = error;

            const stackSize = this._stack.length;
            for (let i = 0; i < stackSize; i++) {
                this._stack[i].reject(error, false);
            }

            this._stack.splice(0, stackSize);
        });

        return this;
    }
    _then(successCB: any, errorCB: any): any {
        if (!isFunc(successCB) && !isFunc(errorCB)) {
            return this._promise;
        }

        const cb = new Callback(this._isSync, successCB, errorCB);

        switch (this._state) {
            case PromiseState.Pending:
            case PromiseState.ResolutionInProgress:
                this._stack.push(cb);
                break;

            case PromiseState.Resolved:
                cb.resolve(this._value, true);
                break;

            case PromiseState.Rejected:
                cb.reject(this._error, true);
                break;
        }

        return cb.deferred.promise();
    }

    resolve(value?: TResolved<T>): IStatefulPromise<T> {
        if (this._state !== PromiseState.Pending) {
            return this.promise();
        }
        return this._resolve(value).promise();
    }

    reject(error?: any): IStatefulPromise<T> {
        if (this._state !== PromiseState.Pending) {
            return this.promise();
        }
        return this._reject(error).promise();
    }

    promise(): IStatefulPromise<T> {
        return this._promise;
    }

    state(): PromiseState {
        return this._state;
    }
}

export class StatefulPromise<T = any> implements IStatefulPromise<T> {
    private _deferred: Deferred<T>;

    constructor(fn: (resolve: (res?: TResolved<T>) => void, reject: (err?: any) => void) => void, isSync: boolean = false) {
        const deferred = new Deferred<T>(this, isSync);
        this._deferred = deferred;
        if (!!fn) {
            getTaskQueue().enque(() => {
                fn((res?: T) => deferred.resolve(res), (err?: any) => deferred.reject(err));
            });
        }
    }

    then<TResult1 = T, TResult2 = never>(
        onFulfilled?: ((value: T) => TResult1 | IThenable<TResult1>) | undefined | null,
        onRejected?: ((reason: any) => TResult2 | IThenable<TResult2>) | undefined | null
    ): IStatefulPromise<TResult1 | TResult2> {
        return this._deferred._then(onFulfilled, onRejected);
    }

    catch<TResult = never>(
        onRejected?: ((reason: any) => TResult | IThenable<TResult>) | undefined | null
    ): IStatefulPromise<T | TResult> {
        return this._deferred._then(_undefined, onRejected);
    }

    finally(onFinally: () => void): IStatefulPromise<T> {
        return this._deferred._then((res: any) => {
            onFinally();
            return res;
        }, (err: any) => {
            onFinally();
            return StatefulPromise.reject(err);
        });
    }

    static all<T>(...promises: Array<T | IThenable<T>>): IStatefulPromise<T[]>;

    static all<T>(promises: Array<T | IThenable<T>>): IStatefulPromise<T[]>;

    static all<T>(...args: Array<any>): IStatefulPromise<T[]> {
        return (args.length === 1 && isArray(args[0])) ? whenAll(<any>args[0]) : whenAll(args);
    }

    static race<T>(...promises: Array<IPromise<T>>): IPromise<T>;

    static race<T>(promises: Array<IPromise<T>>): IPromise<T>;

    static race<T>(...args: Array<any>): IPromise<T> {
        return (args.length === 1 && isArray(args[0])) ? race(<any>args[0]) : race(args);
    }

    static reject<T>(reason?: any, isSync?: boolean): IStatefulPromise<T> {
        const deferred = createDefer<T>(isSync);
        deferred.reject(reason);
        return deferred.promise();
    }

    static resolve<T>(value?: TResolved<T>, isSync?: boolean): IStatefulPromise<T> {
        const deferred = createDefer<T>(isSync);
        deferred.resolve(value);
        return deferred.promise();
    }

    state(): PromiseState {
        return this._deferred.state();
    }

    deferred(): IStatefulDeferred<T> {
        return this._deferred;
    }
}

export class CancellationTokenSource implements ICancellationTokenSource {
    private _callbacks: { (reason?: string): void }[];
    private _isCancelled: boolean;
    private _reason: string;

    constructor() {
        this._callbacks = [];
        this._isCancelled = false;
        this._reason = "";
    }
    private _cancel():void {
        const callbacks = this._callbacks;
        this._callbacks = [];
        const reason = this._reason;

        getTaskQueue().enque(() => {
            for (const callback of callbacks) {
                callback(reason);
            }
        });
    }

    register(fn: (reason?: string) => void) {
        this._callbacks.push(fn);
        if (this._isCancelled) {
            this._cancel();
        }
    }
    cancel(reason?: string) {
        if (this._isCancelled) {
            return;
        }
        this._isCancelled = true;
        this._reason = reason;
        this._cancel();
    }
    get isCancelled(): boolean {
        return this._isCancelled;
    }
    get token(): ICancellationToken {
        return this;
    }
}

export class AbortablePromise<T = any> extends StatefulPromise implements IAbortablePromise<T> {
    private _tokenSource: ICancellationTokenSource | null;
    private _aborted: boolean;

    constructor(fn: (resolve: (res?: TResolved<T>) => void, reject: (err?: any) => void, token: ICancellationToken) => void) {
        super(null, false);
        this._tokenSource = null;
        this._aborted = false;

        if (!!fn) {
            this._tokenSource = new CancellationTokenSource();
            const self = this, deferred = self.deferred(), tokenSource = self._tokenSource;

            self.catch((err) => {
                if (!!self._tokenSource && ERROR.checkIsAbort(err)) {
                    self._tokenSource.cancel();
                }
            }).finally(() => {
                self._tokenSource = null;
            });

            getTaskQueue().enque(() => {
                fn((res?: T) => deferred.resolve(res), (err?: any) => deferred.reject(err), tokenSource.token);
            });
        }
    }

    abort(reason?: string): void {
        const self = this;
        if (!self._aborted) {
            self._aborted = true;
            self.deferred().reject(new AbortError(reason));
        }
    }
}
