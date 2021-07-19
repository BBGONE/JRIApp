/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { IThenable } from "./ipromise";
const GUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const _undefined: undefined = void (0);

function isNt(a: any): a is void {
    return (a === null || a === _undefined);
}

function isFunc(a: any): a is (...args: any[]) => any {
    return (isNt(a)) ? false : ((typeof a === "function") || (typeof a === "object" && a instanceof Function));
}

function isString(a: any): a is string {
    return (isNt(a)) ? false : ((typeof a === "string") || (typeof a === "object" && a instanceof String));
}

function isNumber(a: any): a is Number {
    return (isNt(a)) ? false : (typeof a === "number" || (typeof a === "object" && a instanceof Number));
}

export class Checks {
    static readonly _undefined: undefined = _undefined;
    static isHasProp(obj: any, prop: string): boolean {
        return (!obj) ? false : (prop in obj);
    }
    static isNull(a: any): a is void {
        return a === null;
    }
    static isUndefined(a: any): a is void {
        return a === _undefined;
    }
    static readonly isNt: (a: any) => a is void = isNt;
    static isObject(a: any): boolean {
        return (isNt(a)) ? false : (typeof a === "object");
    }
    static isPlainObject(a: any): boolean {
        if (!!a && typeof a == 'object') {
            const proto = Object.getPrototypeOf(a);
            return proto === Object.prototype || proto === null;
        }

        return false;
    }
    static readonly isString: (a: any) => a is string = isString;
    static readonly isFunc: (a: any) => a is (...args: any[]) => any = isFunc;
    static isBoolean(a: any): a is boolean {
        return (isNt(a)) ? false : ((typeof a === "boolean") || (typeof a === "object" && a instanceof Boolean));
    }
    static isDate(a: any): a is Date {
        return (isNt(a)) ? false : (typeof a === "object" && a instanceof Date);
    }
    static readonly isNumber: (a: any) => a is Number = isNumber;
    static isNumeric(a: any): a is Number {
        return isNumber(a) || (isString(a) && !isNaN(Number(a)));
    }
    static isBoolString(a: any): boolean {
        return (isNt(a)) ? false : (a === "true" || a === "false");
    }
    static isGuid(a: any): boolean {
        return isString(a) && GUID_RX.test(a);
    }
    static isArray<T>(a: any): a is Array<T> {
        return (!a) ? false : Array.isArray(a);
    }
    static isThenable(a: any): a is IThenable<any> {
        return (!a) ? false : ((typeof (a) === "object") && isFunc(a.then));
    }
}