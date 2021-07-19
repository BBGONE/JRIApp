/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { Utils, BaseObject, IBaseObject, LocaleERRS as ERRS, TEventHandler, Debounce } from "jriapp_shared";
import { DomUtils } from "jriapp/utils/dom";
import {DATA_ATTR, KEYS } from "jriapp/consts";
import {
    ITemplate, ISelectable,  IViewOptions, ISelectableProvider
} from "jriapp/int";
import { createTemplate } from "jriapp/template";
import { BaseElView } from "./baseview";
import {
    ITEM_STATUS, COLL_CHANGE_TYPE
} from "jriapp_shared/collection/const";
import {
    ICollection, ICollectionItem, ICollChangedArgs
} from "jriapp_shared/collection/int";
import { bootstrapper, selectableProviderWeakMap } from "jriapp/bootstrapper";

const utils = Utils, dom = DomUtils, doc = dom.document, sys = utils.sys,
    { format } = utils.str, { getNewID, extend, Indexer } = utils.core, boot = bootstrapper;

const enum css {
    stackpanel = "ria-stackpanel",
    item = "ria-stackpanel-item",
    horizontal = "ria-horizontal-panel",
    currentItem = "ria-current-item",
    itemDeleted = "ria-item-deleted"
}

const enum ORIENTATION {
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal"
}

interface IMappedItem { el: HTMLElement; template: ITemplate; item: ICollectionItem; }

export type TOrientation = "vertical" | "horizontal";

export interface IStackPanelOptions {
    templateID: string;
    orientation?:TOrientation;
    syncSetDatasource?: boolean;
}

export interface IStackPanelConstructorOptions extends IStackPanelOptions {
    dataSource?: ICollection<ICollectionItem>;
}


const enum PNL_EVENTS {
    item_clicked = "item_clicked"
}

export class StackPanel extends BaseObject implements ISelectableProvider {
    private _el: HTMLElement;
    private _uniqueID: string;
    private _currentItem: ICollectionItem;
    private _itemMap: { [key: string]: IMappedItem; };
    private _options: IStackPanelConstructorOptions;
    private _selectable: ISelectable;
    private _itemTag: string;
    private _isKeyNavigation: boolean;
    private _debounce: Debounce;

    constructor(el: HTMLElement, options: IStackPanelConstructorOptions) {
        super();
        const self = this;
        options = <IStackPanelConstructorOptions>extend(
            {
                el: null,
                dataSource: null,
                templateID: null,
                orientation: ORIENTATION.VERTICAL,
                syncSetDatasource: false
            }, options);

        if (!!options.dataSource && !sys.isCollection(options.dataSource)) {
            throw new Error(ERRS.ERR_STACKPNL_DATASRC_INVALID);
        }
        if (!options.templateID) {
            throw new Error(ERRS.ERR_STACKPNL_TEMPLATE_INVALID);
        }
        this._options = options;
        this._el = el;
        dom.addClass([el], css.stackpanel);
        const eltag = el.tagName.toLowerCase();
        this._itemTag = (eltag === "ul" || eltag === "ol") ? "li" : "div";

        if (this.orientation === ORIENTATION.HORIZONTAL) {
            dom.addClass([el], css.horizontal);
        }
        this._debounce = new Debounce();
        this._uniqueID = getNewID("pnl");
        this._isKeyNavigation = false;
        this._currentItem = null;
        this._itemMap = Indexer();
        this._selectable = {
            onKeyDown: (key: number, event: Event) => {
                self._onKeyDown(key, event);
            },
            onKeyUp: (key: number, event: Event) => {
                self._onKeyUp(key, event);
            }
        };

        dom.events.on(el, "click", (e) => {
            const el = <HTMLElement>e.target, mappedItem: IMappedItem = dom.getData(el, "data");
            self._onItemClicked(mappedItem.el, mappedItem.item);
        }, {
                nmspace: this.uniqueID,
                // using delegation
                matchElement: (el: Element) => {
                    const attr = el.getAttribute(DATA_ATTR.DATA_EVENT_SCOPE),
                        tag = el.tagName.toLowerCase();
                    return self.uniqueID === attr && tag === self._itemTag;
                }
            });

        selectableProviderWeakMap.set(el, this);
        const ds = this._options.dataSource;
        this.setDataSource(ds);
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        selectableProviderWeakMap.delete(this._el);
        this._debounce.dispose();
        this._unbindDS();
        this._clearContent();
        dom.removeClass([this._el], css.stackpanel);
        if (this.orientation === ORIENTATION.HORIZONTAL) {
            dom.removeClass([this.el], css.horizontal);
        }
        dom.events.offNS(this._el, this.uniqueID);
        this._currentItem = null;
        this._itemMap = Indexer();
        this._options = <any>Indexer();
        super.dispose();
    }
    protected _onKeyDown(key: number, event: Event): void {
        const ds = this.dataSource, self = this;
        if (!ds) {
            return;
        }
        if (this.orientation === ORIENTATION.HORIZONTAL) {
            switch (key) {
                case KEYS.left:
                    event.preventDefault();
                    this._isKeyNavigation = true;
                    if (ds.movePrev(true)) {
                        self.scrollToItem(ds.currentItem, true);
                    }
                    break;
                case KEYS.right:
                    event.preventDefault();
                    this._isKeyNavigation = true;
                    if (ds.moveNext(true)) {
                        self.scrollToItem(ds.currentItem, false);
                    }
                    break;
            }
        } else {
            switch (key) {
                case KEYS.up:
                    event.preventDefault();
                    this._isKeyNavigation = true;
                    if (ds.movePrev(true)) {
                        self.scrollToItem(ds.currentItem, true);
                    }
                    break;
                case KEYS.down:
                    event.preventDefault();
                    this._isKeyNavigation = true;
                    if (ds.moveNext(true)) {
                        self.scrollToItem(ds.currentItem, false);
                    }
                    break;
            }
        }
        this._isKeyNavigation = false;
    }
    protected _onKeyUp(_key: number, _event: Event): void {
    }
    protected _updateCurrent(item: ICollectionItem, withScroll: boolean): void {
        const self = this, old = self._currentItem;
        let mappedItem: IMappedItem;
        if (old !== item) {
            this._currentItem = item;
            if (!!old) {
                mappedItem = self._itemMap[old._key];
                if (!!mappedItem) {
                    dom.removeClass([mappedItem.el], css.currentItem);
                }
            }
            if (!!item) {
                mappedItem = self._itemMap[item._key];
                if (!!mappedItem) {
                    dom.addClass([mappedItem.el], css.currentItem);
                    if (withScroll && !this._isKeyNavigation) {
                        this.scrollToCurrent(false);
                    }
                }
            }
            this.objEvents.raiseProp("currentItem");
        }
    }
    protected _onDSCurrentChanged(): void {
        const ds = this.dataSource, cur = ds.currentItem;
        this._updateCurrent(cur, !!cur);
    }
    protected _onDSCollectionChanged(_: any, args: ICollChangedArgs<ICollectionItem>): void {
        const self = this;
        switch (args.changeType) {
            case COLL_CHANGE_TYPE.Reset:
                {
                    self._refresh();
                }
                break;
            case COLL_CHANGE_TYPE.Add:
                {
                    self._appendItems(args.items);
                }
                break;
            case COLL_CHANGE_TYPE.Remove:
                {
                    for (const item of args.items)
                    {
                        self._removeItem(item);
                    }
                }
                break;
            case COLL_CHANGE_TYPE.Remap:
                {
                    const mappedItem = self._itemMap[args.old_key];
                    if (!!mappedItem) {
                        delete self._itemMap[args.old_key];
                        self._itemMap[args.new_key] = mappedItem;
                    }
                }
                break;
            default:
                throw new Error(format(ERRS.ERR_COLLECTION_CHANGETYPE_INVALID, args.changeType));
        }
    }
    protected _onItemStatusChanged(item: ICollectionItem, oldStatus: ITEM_STATUS): void {
        const newStatus = item._aspect.status, obj = this._itemMap[item._key];
        if (!obj) {
            return;
        }
        if (newStatus === ITEM_STATUS.Deleted) {
            dom.addClass([obj.el], css.itemDeleted);
        } else if (oldStatus === ITEM_STATUS.Deleted) {
            dom.removeClass([obj.el], css.itemDeleted);
        }
    }
    protected _createTemplate(item: ICollectionItem, parentEl: HTMLElement): ITemplate {
        const template = createTemplate({ parentEl: parentEl, dataContext: item });
        template.templateID = this.templateID;
        return template;
    }
    protected _appendItems(newItems: ICollectionItem[]): void {
     const self = this, docFr = doc.createDocumentFragment();
        newItems.forEach((item) => {
            // a row for item already exists?
            if (!!self._itemMap[item._key]) {
                return;
            }
            self._appendItem(docFr, item);
        });
        self.el.appendChild(docFr);
    }
    protected _appendItem(parent: Node, item: ICollectionItem): void {
        const self = this, itemElem = doc.createElement(this._itemTag);
        dom.addClass([itemElem], css.item);
        itemElem.setAttribute(DATA_ATTR.DATA_EVENT_SCOPE, this.uniqueID);
        parent.appendChild(itemElem);
        const mappedItem: IMappedItem = { el: itemElem, template: null, item: item };
        dom.setData(itemElem, "data", mappedItem);
        self._itemMap[item._key] = mappedItem;
        mappedItem.template = self._createTemplate(item, mappedItem.el);
    }
    protected _bindDS():void {
        const self = this, ds = this.dataSource;
        if (!ds) {
            return;
        }
        ds.addOnCollChanged(self._onDSCollectionChanged, self._uniqueID, self);
        ds.addOnCurrentChanged(self._onDSCurrentChanged, self._uniqueID, self);
        ds.addOnStatusChanged((_, args) => {
            self._onItemStatusChanged(args.item, args.oldStatus);
        }, self._uniqueID);
    }
    protected _unbindDS():void {
        const self = this, ds = this.dataSource;
        if (!ds) {
            return;
        }
        ds.objEvents.offNS(self._uniqueID);
    }
    protected _onItemClicked(_div: HTMLElement, item: ICollectionItem): void {
        this._updateCurrent(item, false);
        this.dataSource.currentItem = item;
        this.objEvents.raise(PNL_EVENTS.item_clicked, { item: item });
    }
    protected _clearContent(): void {
        const self = this, keys = Object.keys(self._itemMap);
        if (keys.length === 0) {
            return;
        }
        self._el.innerHTML = "";
        for(const key of keys)
        {
            self._removeItemByKey(key);
        }
    }
    protected _removeItemByKey(key: string): void {
        const self = this, mappedItem = self._itemMap[key];
        if (!mappedItem) {
            return;
        }
        delete self._itemMap[key];
        mappedItem.template.dispose();
        mappedItem.template = null;
        dom.removeNode(mappedItem.el);
    }
    protected _removeItem(item: ICollectionItem): void {
        this._removeItemByKey(item._key);
    }
    protected _refresh(): void {
        const ds = this.dataSource, self = this;
        this._clearContent();
        if (!ds) {
            return;
        }
        const docFr = doc.createDocumentFragment();
        for (const item of ds.items)
        {
            self._appendItem(docFr, item);
        }
        self.el.appendChild(docFr);
    }
    protected setDataSource(v: ICollection<ICollectionItem>) {
        this._unbindDS();
        this._options.dataSource = v;
        const fn_init = () => {
            const ds = this._options.dataSource;
            if (!!ds && !ds.getIsStateDirty()) {
                this._bindDS();
                this._refresh();
            } else {
                this._clearContent();
            }
        };

        if (!!this._options.syncSetDatasource) {
            fn_init();
        } else {
            this._debounce.enque(fn_init);
        }
    }
    addOnItemClicked(fn: TEventHandler<StackPanel, { item: ICollectionItem; }>, nmspace?: string, context?: IBaseObject): void {
        this.objEvents.on(PNL_EVENTS.item_clicked, fn, nmspace, context);
    }
    offOnItemClicked(nmspace?: string): void {
        this.objEvents.off(PNL_EVENTS.item_clicked, nmspace);
    }
    getDivElementByItem(item: ICollectionItem): HTMLElement {
        const mappedItem = this._itemMap[item._key];
        return (!mappedItem) ? null : mappedItem.el;
    }
    scrollToItem(item: ICollectionItem, isUp?: boolean): void {
        if (!item) {
            return;
        }
        const mappedItem = this._itemMap[item._key];
        if (!mappedItem) {
            return;
        }
        // mappedItem.el.scrollIntoView(false);

        const isVert = this.orientation === ORIENTATION.VERTICAL, pnl = mappedItem.el, viewport = this._el,
            viewportRect = viewport.getBoundingClientRect(),  pnlRect = pnl.getBoundingClientRect(),
            viewPortSize = isVert ? viewport.clientHeight : viewport.clientWidth,
            itemSize = isVert ? pnl.offsetHeight : pnl.offsetWidth,
            currentPos = isVert ? viewport.scrollTop : viewport.scrollLeft,
            offsetDiff = isVert ? (currentPos + pnlRect.top - viewportRect.top) : (currentPos + pnlRect.left - viewportRect.left);

        const contentSize = Math.min(itemSize, viewPortSize);
        const offset = viewPortSize - contentSize;
        let pos = !isUp ? Math.floor(offsetDiff - offset + 1) : Math.floor(offsetDiff - 1);

        // console.log(format("pos: {0} currentPos: {1} offsetDiff: {2} (offsetDiff - offset): {3} offset: {4} viewPortSize: {5} contentSize:{6} isUp: {7}",
            // pos, currentPos, offsetDiff, (offsetDiff - offset), offset, viewPortSize, contentSize, isUp));

        if (pos < 0) {
            pos = 0;
        }

        if ((currentPos < offsetDiff && currentPos > (offsetDiff - offset))) {
            return;
        }

        if (isVert) {
            this._el.scrollTop = pos;
        } else {
            this._el.scrollLeft = pos;
        }
    }
    scrollToCurrent(isUp?: boolean): void {
        this.scrollToItem(this._currentItem, isUp);
    }
    focus(): void {
        this.scrollToCurrent(true);
        boot.selectedControl = this;
    }
    toString(): string {
        return "StackPanel";
    }
    get selectable(): ISelectable {
        return this._selectable;
    }
    get el(): HTMLElement {
        return this._el;
    }
    get uniqueID(): string {
        return this._uniqueID;
    }
    get orientation(): TOrientation {
        return this._options.orientation;
    }
    get templateID(): string {
        return this._options.templateID;
    }
    get dataSource(): ICollection<ICollectionItem> {
        return this._options.dataSource;
    }
    set dataSource(v) {
        if (v !== this.dataSource) {
            this.setDataSource(v);
            this.objEvents.raiseProp("dataSource");
        }
    }
    get currentItem(): ICollectionItem {
        return this._currentItem;
    }
}

export interface IStackPanelViewOptions extends IStackPanelOptions, IViewOptions {
}

export interface IPanelEvents {
    onItemClicked(item: ICollectionItem): void;
}

export class StackPanelElView extends BaseElView implements ISelectableProvider {
    private _panel: StackPanel;
    private _panelEvents: IPanelEvents;

    constructor(el: HTMLElement, options: IStackPanelViewOptions) {
        super(el, options);
        const self = this;
        this._panelEvents = null;
        this._panel = new StackPanel(el, <IStackPanelConstructorOptions>options);
        this._panel.addOnItemClicked((_, args) => {
            if (!!self._panelEvents) {
                self._panelEvents.onItemClicked(args.item);
            }
        }, this.uniqueID);
        this._panel.objEvents.onProp("*", (_, args) => {
            switch (args.property) {
                case "dataSource":
                    self.objEvents.raiseProp(args.property);
                    break;
            }
        }, self.uniqueID);
    }
    dispose() {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        if (!this._panel.getIsStateDirty()) {
            this._panel.dispose();
        }
        this._panelEvents = null;
        super.dispose();
    }
    toString() {
        return "StackPanelElView";
    }
    get dataSource(): ICollection<ICollectionItem> {
        return this._panel.dataSource;
    }
    set dataSource(v: ICollection<ICollectionItem>) {
        this._panel.dataSource = v;
    }
    get panelEvents() {
        return this._panelEvents;
    }
    set panelEvents(v) {
        const old = this._panelEvents;
        if (v !== old) {
            this._panelEvents = v;
            this.objEvents.raiseProp("panelEvents");
        }
    }
    get panel() {
        return this._panel;
    }
    get selectable(): ISelectable {
        return this._panel.selectable;
    }
}

boot.registerElView("stackpanel", StackPanelElView);
boot.registerElView("ul", StackPanelElView);
boot.registerElView("ol", StackPanelElView);
