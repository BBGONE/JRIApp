/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { IDisposable, TFunc } from "../int";
import { getTaskQueue } from "./promise";
import { ERROR } from "./error";

const error = ERROR, win = window;

export class Debounce implements IDisposable {
    private _timer: number;
    private _interval: number;
    private _fn: TFunc;

    constructor(interval: number = 0) {
        this._timer = null;
        this._interval = interval;
        this._fn = null;
    }
    dispose(): void {
        this.cancel();
        this._timer = void 0;
    }
    enque(fn: TFunc): void {
        // important, no error (just return with no action)!!!
        if (this.getIsDisposed()) {
            return;
        }
        if (!fn) {
            throw new Error("Debounce: Invalid Operation");
        }
        // the last wins
        this._fn = fn;


        if (!!this._interval && !!this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }

        if (!this._timer) {
            const callback = () => {
                const fn = this._fn;
                this._timer = null;
                this._fn = null;

                if (!!fn) {
                    try {
                        fn();
                    } catch (err) {
                        error.handleError(win, err, win);
                    }
                }
            };

            if (!this._interval) {
                this._timer = getTaskQueue().enque(callback);
            } else {
                this._timer = setTimeout(callback, this._interval);
            }
        }
    }
    cancel(): void {
        if (!!this._timer) {
            if (!this._interval) {
                getTaskQueue().cancel(this._timer);
            } else {
                clearTimeout(this._timer);
            }
        }
        this._timer = null;
        this._fn = null;
    }
    get interval(): number {
        return this._interval;
    }
    getIsDisposed(): boolean {
        return this._timer === void 0;
    }
}