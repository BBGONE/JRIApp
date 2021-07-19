/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { Utils, LocaleERRS, createWeakMap, IWeakMap } from "jriapp_shared";

const utils = Utils, { isFunc, isString, isNt } = utils.check, arrHelper = utils.arr,
    { format } = utils.str, debug = utils.debug, ERRS = LocaleERRS;

// stores listener and event name
export type TEventNode = { fn: THandlerFunc; name: string; useCapture?: boolean };

export type TEventNodeArray = TEventNode[];

export interface INamespaceMap {
    [ns: string]: TEventNodeArray;
}

export type TEventList = INamespaceMap;
export type TDomElement = Element | Document | Window;
export type TEventsArgs = {
    nmspace?: string;
    useCapture?: boolean;
};

// used for delegation to match the element
export type TEventsDelegateArgs = {
    nmspace: string;
    matchElement: (el: Element) => boolean;
};

export type TEventsArgsOrNamespace = TEventsArgs | string | TEventsDelegateArgs;
export type THandlerFunc = (evt: any) => void;

export class EventWrap<TEvent extends Event = Event> {
    private _ev: TEvent;
    private _target: EventTarget | null;
    private _cancelBubble: boolean;

    constructor(ev: TEvent, target: EventTarget | null) {
        this._ev = ev;
        this._target = target;
        this._cancelBubble = false;
    }
    get type(): string {
        return this._ev.type;
    }
    get target(): EventTarget | null {
        return this._target;
    }
    get bubbles(): boolean {
        return this._ev.bubbles;
    }
    get defaultPrevented(): boolean {
        return this._ev.defaultPrevented;
    }
    get cancelable(): boolean {
        return this._ev.cancelable;
    }
    get isTrusted(): boolean {
        return this._ev.isTrusted;
    }
    get returnValue(): boolean {
        return this._ev.returnValue;
    }
    set returnValue(v: boolean) {
        this._ev.returnValue = v;
    }
    get srcElement(): EventTarget | null {
        return this._ev.srcElement;
    }
    get eventPhase(): number {
        return this._ev.eventPhase;
    }
    get cancelBubble(): boolean {
        return this._cancelBubble;
    }
    set cancelBubble(v: boolean) {
        if (!!v) {
            this._cancelBubble = v;
            this._ev.stopPropagation();
        }
    }
    get timeStamp(): number {
        return this._ev.timeStamp;
    }
    get currentTarget(): EventTarget {
        return this._ev.currentTarget;
    }
    get originalEvent(): TEvent {
        return this._ev;
    }
    get AT_TARGET(): number {
        return this._ev.AT_TARGET;
    }
    get BUBBLING_PHASE(): number {
        return this._ev.BUBBLING_PHASE;
    }
    get CAPTURING_PHASE(): number {
        return this._ev.CAPTURING_PHASE;
    }

    preventDefault(): void {
        this._ev.preventDefault();
    }
    stopPropagation(): void {
        this._ev.stopPropagation();
        this._cancelBubble = true;
    }
    stopImmediatePropagation(): void {
        this._ev.stopImmediatePropagation();
    }
}

class EventHelper {
    static Node(handler: THandlerFunc, name: string, useCapture?: boolean): TEventNode {
        return { fn: handler, name: name, useCapture: useCapture };
    }
    static add(ev: TEventList, name: string, handler: THandlerFunc, nmspace: string, useCapture?: boolean): void {
        if (!ev) {
            debug.checkStartDebugger();
            throw new Error(format(ERRS.ERR_ASSERTION_FAILED, "ev is a valid object"));
        }
        if (!isFunc(handler)) {
            throw new Error(ERRS.ERR_EVENT_INVALID_FUNC);
        }

        if (!name) {
            throw new Error(format(ERRS.ERR_EVENT_INVALID, "[Empty]"));
        }

        const ns = !nmspace ? "*" : "" + nmspace;

        let list = ev[ns];
        const node: TEventNode = EventHelper.Node(handler, name, useCapture);

        if (!list) {
            ev[ns] = list = [];
        }

        list.push(node);
    }
    static getNS(ev: TEventList, ns: string): TEventNodeArray {
        if (!ev) {
            return [];
        }
        const res: TEventNodeArray = [], list = ev[ns];
        if (!list) {
            return res;
        }
        for (let k = 0; k < list.length; ++k) {
            res.push(list[k]);
        }
        return res;
    }
    static removeNS(ev: TEventList, name: string, ns: string): TEventNodeArray {
        if (!ev) {
            return [];
        }
        const res: TEventNodeArray = [], list = ev[ns];
        if (!list) {
            return res;
        }

        if (!name) {
            delete ev[ns];
            return list;
        }

        const newArr: TEventNodeArray = [];
        for (let k = 0; k < list.length; ++k) {
            if (list[k].name === name) {
                res.push(list[k]);
            } else {
                newArr.push(list[k]);
            }
        }

        if (newArr.length > 0) {
            ev[ns] = newArr;
        } else {
            delete ev[ns];
        }

        return res;
    }
    static remove(ev: TEventList, name?: string, nmspace?: string): TEventNodeArray {
        if (!ev) {
            return [];
        }
        const ns = !nmspace ? "*" : "" + nmspace, arr: TEventNodeArray[] = [];

        if (ns === "*") {
            const nsKeys = Object.keys(ev);
            for (let i = 0; i < nsKeys.length; ++i) {
                arr.push(EventHelper.removeNS(ev, name, nsKeys[i]));
            }
            // return merged array
            return arrHelper.merge(arr);
        } else {
            return EventHelper.removeNS(ev, name, ns);
        }
    }
    static toArray(ev: TEventList): TEventNodeArray {
        if (!ev) {
            return [];
        }
        const nsKeys = Object.keys(ev), arr: TEventNodeArray[] = [];
        for (let i = 0; i < nsKeys.length; ++i) {
            arr.push(EventHelper.getNS(ev, nsKeys[i]));
        }

        // return merged array
        return arrHelper.merge(arr);
    }
    static getDelegateListener(root: TDomElement, isMatch: (el: TDomElement) => boolean, listener: THandlerFunc): (event: Event) => void {
        const res = (event: Event): void => {
            let target: TDomElement = <any>event.target;
            // go up to the parent node
            while (!!target && target !== root) {
                if (isMatch(target)) {
                    const eventWrap = new EventWrap(event, target);
                    listener.apply(target, [eventWrap]);
                    //check for stopping propagation
                    if (eventWrap.cancelBubble) {
                        return;
                    }
                }
                target = (<Element><any>target).parentElement;
            }
        };
        return res;
    }
}

const helper = EventHelper;

const weakmap: IWeakMap = createWeakMap();

function isDelegateArgs(a: any): a is TEventsDelegateArgs {
    return (!a) ? false : isFunc(a.matchElement);
}

export class DomEvents {
    static on(el: TDomElement, evType: "abort", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "activate", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "beforeactivate", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "beforedeactivate", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "blur", listener: (ev: FocusEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "canplay", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "canplaythrough", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "change", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "click", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "contextmenu", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "dblclick", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "deactivate", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "drag", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "dragend", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "dragenter", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "dragleave", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "dragover", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "dragstart", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "drop", listener: (ev: DragEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "durationchange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "emptied", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "ended", listener: (ev: MediaStreamErrorEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "error", listener: (ev: ErrorEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "focus", listener: (ev: FocusEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "fullscreenchange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "fullscreenerror", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "input", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "invalid", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "keydown", listener: (ev: KeyboardEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "keypress", listener: (ev: KeyboardEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "keyup", listener: (ev: KeyboardEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "load", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "loadeddata", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "loadedmetadata", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "loadstart", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "mousedown", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "mousemove", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "mouseout", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "mouseover", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "mouseup", listener: (ev: MouseEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "mousewheel", listener: (ev: WheelEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "pause", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "play", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "playing", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "pointercancel", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "pointerdown", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "pointerenter", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "pointerleave", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "pointerlockchange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "pointerlockerror", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "pointermove", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "pointerout", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "pointerover", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "pointerup", listener: (ev: PointerEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "progress", listener: (ev: ProgressEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "ratechange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "readystatechange", listener: (ev: ProgressEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "reset", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "scroll", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "seeked", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "seeking", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "select", listener: (ev: UIEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "selectionchange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "selectstart", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "stalled", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "stop", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "submit", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "suspend", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "timeupdate", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "touchcancel", listener: (ev: TouchEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "touchend", listener: (ev: TouchEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "touchmove", listener: (ev: TouchEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "touchstart", listener: (ev: TouchEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "volumechange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "waiting", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "webkitfullscreenchange", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "webkitfullscreenerror", listener: (ev: Event) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: "wheel", listener: (ev: WheelEvent) => any, args?: TEventsArgsOrNamespace): void;
    static on(el: TDomElement, evType: string, listener: (ev: EventWrap) => any, args: TEventsDelegateArgs): void;
    static on(el: TDomElement, evType: string, listener: EventListenerOrEventListenerObject, args?: TEventsArgsOrNamespace): void;
    // on implementation
    static on(el: TDomElement, evType: string, listener: THandlerFunc, args?: TEventsArgsOrNamespace): void {
        let events: TEventList = weakmap.get(el), ns: string, useCapture: boolean = false;
        if (!events) {
            events = <any>{};
            weakmap.set(el, events);
        }

        if (!!args) {
            if (isString(args)) {
                ns = args;
            } else if (isDelegateArgs(args)) {
                ns = args.nmspace;
                listener = helper.getDelegateListener(el, args.matchElement, listener);
            } else {
                ns = args.nmspace;
                useCapture = !!args.useCapture;
            }
        }

        helper.add(events, evType, listener, ns, useCapture);
        el.addEventListener(evType, listener, useCapture);
    }
    static off(el: TDomElement, evType?: string, nmspace?: string, useCapture?: boolean): void {
        const ev: TEventList = weakmap.get(el);
        if (!ev) {
            return;
        }
        const handlers = helper.remove(ev, evType, nmspace);
        for (let i = 0; i < handlers.length; i += 1) {
            const handler = handlers[i];
            if (isNt(useCapture) || (useCapture === handler.useCapture)) {
                el.removeEventListener(handler.name, handler.fn, handler.useCapture);
            }
        }
    }
    static offNS(el: TDomElement, nmspace?: string): void {
        DomEvents.off(el, null, nmspace);
    }
}
