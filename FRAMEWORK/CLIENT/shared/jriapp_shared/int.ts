/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { DEBUG_LEVEL } from "./consts";
import { IVoidPromise } from "./utils/ipromise";

// config global variable can be used using this interface
export interface IConfig {
    debugLevel?: DEBUG_LEVEL;
}

// get global config variable
export const Config: IConfig = jriapp_config || {};
export let DebugLevel = (!Config.debugLevel) ? DEBUG_LEVEL.NONE : Config.debugLevel;

export type TEventHandler<T = any, U = any> = (sender: T, args: U) => void;
export type TErrorArgs = { error: any; source: any; isHandled: boolean; };
export type TErrorHandler<T = any> = (sender: T, args: TErrorArgs) => void;
export type TPropChangedHandler<T = any> = (sender: T, args: { property: string; }) => void;
export type TFunc<T = any> = { (...args: any[]): T; };
export type TAnyConstructor<T> = new (...args: any[]) => T;

export interface IDisposable {
    dispose(): void;
    getIsDisposed(): boolean;
}

export interface IIndexer<T> {
    [name: string]: T;
}

export interface IErrorHandler {
    handleError(error: any, source: any): boolean;
}

export interface IPropertyBag extends IBaseObject {
    getProp(name: string): any;
    setProp(name: string, val: any): void;
    isPropertyBag: boolean;
}

export const enum TPriority {
    Normal = 0, AboveNormal = 1, High = 2
}

export type PropertyNames<T> = keyof T | "*" | "[*]";

export interface IEvents<T = any> {
    canRaise(name: string): boolean;
    on(name: string, handler: TEventHandler<T, any>, nmspace?: string, context?: object, priority?: TPriority): void;
    off(name?: string, nmspace?: string): void;
    // remove event handlers by their namespace
    offNS(nmspace?: string): void;
    raise(name: string, args: any): void;
    raiseProp(name: PropertyNames<T>): void;
    // to subscribe for changes on all properties, pass in the prop parameter: '*'
    onProp(prop: PropertyNames<T>, handler: TPropChangedHandler<T>, nmspace?: string, context?: object, priority?: TPriority): void;
    offProp(prop?: PropertyNames<T>, nmspace?: string): void;
}

export interface IBaseObject extends IErrorHandler, IDisposable {
    getIsStateDirty(): boolean;
    isHasProp(prop: string): boolean;
    readonly objEvents: IObjectEvents;
}

export interface IObjectEvents<T = any> extends IEvents<T> {
    addOnError(handler: TErrorHandler<T>, nmspace?: string, context?: object, priority?: TPriority): void;
    offOnError(nmspace?: string): void;
    addOnDisposed(handler: TEventHandler<T, any>, nmspace?: string, context?: object, priority?: TPriority): void;
    offOnDisposed(nmspace?: string): void;
    readonly owner: T;
}

export interface IEditable extends IBaseObject {
    beginEdit(): boolean;
    endEdit(): boolean;
    cancelEdit(): boolean;
    readonly isEditing: boolean;
}

export interface ISubmittable extends IBaseObject {
    submitChanges(): IVoidPromise;
    rejectChanges(): void;
    readonly isCanSubmit: boolean;
}

export interface IValidationInfo {
    readonly fieldName: string;
    errors: string[];
}

export interface IValidatable {
    validationErrors: IValidationInfo[];
}

export interface IValidationError {
    readonly item: any;
    readonly validations: IValidationInfo[];
}

export interface IErrorNotification extends IBaseObject {
    getIsHasErrors(): boolean;
    addOnErrorsChanged(fn: TEventHandler, nmspace?: string, context?: any): void;
    offOnErrorsChanged(nmspace?: string): void;
    getFieldErrors(fieldName: string): IValidationInfo[];
    getAllErrors(): IValidationInfo[];
    getIErrorNotification(): IErrorNotification;
}

export interface IWeakMap {
    set(key: any, value: any): IWeakMap;
    get(key: any): any;
    delete(key: any): boolean;
    has(key: any): boolean;
}

export interface WeakMapConstructor {
    new (): IWeakMap;
}
