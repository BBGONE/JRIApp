/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    Utils, BaseObject, LocaleERRS as ERRS, TEventHandler, Debounce
} from "jriapp_shared";
import { DomUtils } from "jriapp/utils/dom";
import {
    ITEM_STATUS, COLL_CHANGE_TYPE
} from "jriapp_shared/collection/const";
import {
    ICollection, ICollectionItem, ICollChangedArgs
} from "jriapp_shared/collection/int";
import { SubscribeFlags } from "jriapp/consts";
import { IViewOptions, ISubscriber } from "jriapp/int";
import { bootstrapper, subscribeWeakMap } from "jriapp/bootstrapper";
import { BaseElView } from "./baseview";

const utils = Utils, dom = DomUtils, doc = dom.document, sys = utils.sys,
    { _undefined, isString, isNt } = utils.check, { forEach, extend, getNewID, Indexer } = utils.core, boot = bootstrapper, subscribeMap = subscribeWeakMap;

export interface IOptionStateProvider {
    getCSS(item: ICollectionItem, itemIndex: number, val: any): string;
}

export interface IOptionTextProvider {
    getText(item: ICollectionItem, itemIndex: number, text: string): string;
}

export interface IListBoxOptions {
    valuePath: string;
    textPath: string;
    statePath?: string;
    emptyOptionText?: string;
    noEmptyOption?: boolean;
    syncSetDatasource?: boolean;
    nodelegate?: boolean;
}

export interface IListBoxConstructorOptions extends IListBoxOptions {
    dataSource?: ICollection<ICollectionItem>;
}

export interface IMappedItem {
    item: ICollectionItem;
    op: HTMLOptionElement;
}

const enum LISTBOX_EVENTS {
    refreshed = "refreshed"
}

function fn_Str(v: any): string {
    return (isNt(v)) ? "" : ("" + v);
}

export class ListBox extends BaseObject implements ISubscriber {
    private _el: HTMLSelectElement;
    private _uniqueID: string;
    private _isRefreshing: boolean;
    private _selectedValue: any;
    private _keyMap: { [key: string]: IMappedItem; };
    private _valMap: { [val: string]: IMappedItem; };
    private _options: IListBoxConstructorOptions;
    private _fnState: (data: IMappedItem) => void;
    private _textProvider: IOptionTextProvider;
    private _stateProvider: IOptionStateProvider;
    private _savedVal: any;
    private _dsDebounce: Debounce;
    private _txtDebounce: Debounce;
    private _stDebounce: Debounce;
    private _changeDebounce: Debounce;
    private _fnCheckSelected: () => void;
    private _isDSFilled: boolean;

    constructor(el: HTMLSelectElement, options: IListBoxConstructorOptions) {
        super();
        const self = this;
        options = extend(
            {
                dataSource: null,
                valuePath: null,
                textPath: null,
                statePath: null,
                syncSetDatasource: false,
                nodelegate: false
            }, options);
        if (!!options.dataSource && !sys.isCollection(options.dataSource)) {
            throw new Error(ERRS.ERR_LISTBOX_DATASRC_INVALID);
        }
        this._el = el;
        this._options = options;
        this._uniqueID = getNewID("lst");
        this._isDSFilled = false;
        this._textProvider = null;
        this._stateProvider = null;
        this._isRefreshing = false;
        this._selectedValue = null;
        this._dsDebounce = new Debounce();
        this._stDebounce = new Debounce();
        this._txtDebounce = new Debounce();
        this._changeDebounce = new Debounce();
        this._keyMap = Indexer();
        this._valMap = Indexer();
        this._savedVal = _undefined;
        this._fnState = (data: IMappedItem) => {
            if (!data || !data.item || data.item.getIsStateDirty()) {
                return;
            }
            const item = data.item, path = self.statePath,
                val = !path ? null : sys.resolvePath(item, path), spr = self._stateProvider;
            data.op.className = !spr ? "" : spr.getCSS(item, data.op.index, val);
        };
        if (!this._options.nodelegate) {
            subscribeMap.set(el, this);
        } else {
            dom.events.on(el, "change", (e) => this.handle_change(e), this._uniqueID);            
        }
        const ds = this._options.dataSource;
        this.setDataSource(ds);
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        if (!this._options.nodelegate) {
            subscribeMap.delete(this._el);
        }
        dom.events.offNS(this._el, this._uniqueID);
        this._dsDebounce.dispose();
        this._stDebounce.dispose();
        this._txtDebounce.dispose();
        this._changeDebounce.dispose();
        this._fnCheckSelected = null;
        this._unbindDS();
        this._clear();
        this._el = null;
        this._selectedValue = _undefined;
        this._savedVal = _undefined;
        this._options = <any>{};
        this._textProvider = null;
        this._stateProvider = null;
        this._isDSFilled = false;
        super.dispose();
    }
    private _bindDS(): void {
        const self = this, ds = this.dataSource;
        if (!ds) {
            return;
        }
        ds.addOnCollChanged(self._onDSCollectionChanged, self._uniqueID, self);
        ds.addOnBeginEdit((_, args) => {
            self._onEdit(args.item, true, false);
        }, self._uniqueID);
        ds.addOnEndEdit((_, args) => {
            self._onEdit(args.item, false, args.isCanceled);
        }, self._uniqueID);
        ds.addOnStatusChanged((_, args) => {
            self._onStatusChanged(args.item, args.oldStatus);
        }, self._uniqueID);
        ds.addOnCommitChanges((_, args) => {
            self._onCommitChanges(args.item, args.isBegin, args.isRejected, args.status);
        }, self._uniqueID);
    }
    private _unbindDS(): void {
        const self = this, ds = this.dataSource;
        if (!ds) {
            return;
        }
        ds.objEvents.offNS(self._uniqueID);
    }
    private _addOption(item: ICollectionItem, first: boolean): IMappedItem {
        const key = !item ? "" : item._key;
        if (!!this._keyMap[key]) {
            return null;
        }

        const selEl = this.el;
        let text = "";
        if (!item) {
            if (isString(this._options.emptyOptionText)) {
                text = this._options.emptyOptionText;
            }
        } else {
            text = this._getText(item, selEl.options.length);
        }
        const val = fn_Str(this._getValue(item));
        const oOption = doc.createElement("option");
        oOption.text = text;
        oOption.value = key;
        const data: IMappedItem = { item: item, op: oOption };
        this._keyMap[key] = data;
        if (!!val) {
            this._valMap[val] = data;
        }
        if (!!first) {
            if (selEl.options.length < 2) {
                selEl.add(oOption, null);
            } else {
                const firstOp = <any>selEl.options[1];
                selEl.add(oOption, firstOp);
            }
        } else {
            selEl.add(oOption, null);
        }

        if (!!item) {
            if (!!this.statePath) {
                item.objEvents.onProp(this.statePath, this._fnState, this._uniqueID);
            }
            this._fnState(data);
        }

        return data;
    }
    private _mapByValue(): void {
        const self = this;
        this._valMap = Indexer();
        forEach(this._keyMap, (key) => {
            const data = self._keyMap[key], val = fn_Str(self._getValue(data.item));
            if (!!val) {
                self._valMap[val] = data;
            }
        });
    }
    private _resetText(): void {
        const self = this;
        forEach(this._keyMap, (key) => {
            const data = self._keyMap[key];
            data.op.text = self._getText(data.item, data.op.index);
        });
    }
    private _resetState(): void {
        const self = this;
        forEach(this._keyMap, (key) => {
            self._fnState(self._keyMap[key]);
        });
    }
    private _removeOption(item: ICollectionItem): void {
        if (!!item) {
            const key = item._key, data = this._keyMap[key];
            if (!data) {
                return;
            }

            item.objEvents.offNS(this._uniqueID);
            this.el.remove(data.op.index);
            const val = fn_Str(this._getValue(item));
            delete this._keyMap[key];
            if (!!val) {
                delete this._valMap[val];
            }

            const curVal = this.getByIndex(this.selectedIndex);
            const v = (!curVal ? null : this._getValue(curVal.item));
            this._selectedValue = v;
            this.updateSelected(v);
        }
    }
    private _clear(): void {
        const self = this, keys = Object.keys(self._keyMap);
        for (const key of keys)
        {
            const data = self._keyMap[key];
            if (!!data && !!data.item) {
                data.item.objEvents.offNS(self._uniqueID);
            }
        }
        this.el.options.length = 0;
        this._keyMap = Indexer();
        this._valMap = Indexer();
    }
    private _refresh(): void {
        const self = this, ds = this.dataSource;
        this.beginTrackSelected();
        this._isRefreshing = true;
        try {
            this._clear();
            if (!this._options.noEmptyOption) {
                this._addOption(null, false);
            }
            let cnt = 0;
            if (!!ds) {
                for (const item of ds.items)
                {
                    self._addOption(item, false);
                    ++cnt;
                }
            }

            if (this._isDSFilled && !isNt(this._selectedValue) && !this.getByValue(this._selectedValue)) {
                this.selectedValue = null;
            } else {
                self.updateSelected(this._selectedValue);
            }

            if (cnt > 0) {
                this._isDSFilled = true;
            }

        } finally {
            self._isRefreshing = false;
            this.endTrackSelected();
        }

        this.objEvents.raise(LISTBOX_EVENTS.refreshed, {});
    }
    protected _onSelectedChanged(): void {
        const data: IMappedItem = this.getByIndex(this.selectedIndex);
        if (!data) {
            this.selectedValue = null;
            return;
        }

        const newVal = this._getValue(data.item);
        this.selectedValue = newVal;
    }
    protected _getValue(item: ICollectionItem): any {
        if (!item) {
            return null;
        }

        if (!!this._options.valuePath) {
            return sys.resolvePath(item, this._options.valuePath);
        } else {
            return null;
        }
    }
    protected _getText(item: ICollectionItem, index: number): string {
        let res = "";
        if (!item) {
            return res;
        }

        if (!!this._options.textPath) {
            const t = sys.resolvePath(item, this._options.textPath);
            res = fn_Str(t);
        } else {
            res = fn_Str(this._getValue(item));
        }

        return (!this._textProvider) ? res : this._textProvider.getText(item, index, res);
    }
    protected _onDSCollectionChanged(_: any, args: ICollChangedArgs<ICollectionItem>) {
        const self = this;
        this.beginTrackSelected();
        try {
            switch (args.changeType) {
                case COLL_CHANGE_TYPE.Reset:
                    {
                        this._refresh();
                    }
                    break;
                case COLL_CHANGE_TYPE.Add:
                    {
                        for (const item of args.items)
                        {
                            self._addOption(item, item._aspect.isNew);
                        }
                    }
                    break;
                case COLL_CHANGE_TYPE.Remove:
                    {
                        for (const item of args.items)
                        {
                            self._removeOption(item);
                        }

                        if (!!self._textProvider) {
                            self._resetText();
                        }
                    }
                    break;
                case COLL_CHANGE_TYPE.Remap:
                    {
                        const data = self._keyMap[args.old_key];
                        if (!!data) {
                            delete self._keyMap[args.old_key];
                            self._keyMap[args.new_key] = data;
                            data.op.value = args.new_key;
                        }
                    }
                    break;
            }
        } finally {
            this.endTrackSelected();
        }
    }
    protected _onEdit(item: ICollectionItem, isBegin: boolean, isCanceled: boolean) {
        const self = this;
        if (isBegin) {
            this.beginTrackSelected();
            this._savedVal = this._getValue(item);
        } else {
            try {
                if (!isCanceled) {
                    const oldVal = this._savedVal;
                    this._savedVal = _undefined;
                    const key = item._key, data = self._keyMap[key];
                    if (!!data) {
                        data.op.text = self._getText(item, data.op.index);
                        const val = this._getValue(item);
                        if (oldVal !== val) {
                            if (!isNt(oldVal)) {
                                delete self._valMap[fn_Str(oldVal)];
                            }
                            if (!isNt(val)) {
                                self._valMap[fn_Str(val)] = data;
                            }
                        }
                    } else {
                        if (!isNt(oldVal)) {
                            delete self._valMap[fn_Str(oldVal)];
                        }
                    }
                }
            } finally {
                this.endTrackSelected();
            }
        }
    }
    protected _onStatusChanged(item: ICollectionItem, _oldStatus: ITEM_STATUS) {
        const newStatus = item._aspect.status;
        this.beginTrackSelected();
        if (newStatus === ITEM_STATUS.Deleted) {
            this._removeOption(item);
            if (!!this._textProvider) {
                // need to reset text due to the index changes
                this._resetText();
            }
        }
        this.endTrackSelected();
    }
    protected _onCommitChanges(item: ICollectionItem, isBegin: boolean, isRejected: boolean, status: ITEM_STATUS) {
        const self = this;
        if (isBegin) {
            this.beginTrackSelected();

            if (isRejected && status === ITEM_STATUS.Added) {
                return;
            } else if (!isRejected && status === ITEM_STATUS.Deleted) {
                return;
            }

            this._savedVal = this._getValue(item);
        } else {
            const oldVal = this._savedVal;
            this._savedVal = _undefined;
            // delete is rejected
            if (isRejected && status === ITEM_STATUS.Deleted) {
                this._addOption(item, true);
                this.endTrackSelected();
                return;
            }

            try {
                const val = this._getValue(item), data = self._keyMap[item._key];
                if (oldVal !== val) {
                    if (!isNt(oldVal)) {
                        delete self._valMap[fn_Str(oldVal)];
                    }

                    if (!!data && !isNt(val)) {
                        self._valMap[fn_Str(val)] = data;
                    }
                }

                if (!!data) {
                    data.op.text = self._getText(item, data.op.index);
                }
            } finally {
                this.endTrackSelected();
            }
        }
    }
    protected getItemIndex(item: ICollectionItem): number {
        if (!item || item.getIsStateDirty()) {
            return -1;
        }
        const data: IMappedItem = this._keyMap[item._key];
        return (!data) ? -1 : data.op.index;
    }
    protected getByValue(val: any): IMappedItem {
        if (isNt(val)) {
            return null;
        }
        const key = fn_Str(val);
        const data: IMappedItem = this._valMap[key];
        return (!data) ? null : data;
    }
    protected getByIndex(index: number): IMappedItem {
        if (index >= 0 && index < this.el.length) {
            const op: HTMLOptionElement = <HTMLOptionElement>this.el.options[index], key = op.value;
            return this._keyMap[key];
        }
        return null;
    }
    protected updateSelected(v: any): void {
        const data: IMappedItem = (isNt(v) ? null : this.getByValue(v));
        const index = (!data ? 0 : data.op.index), oldRefreshing = this._isRefreshing;
        this._isRefreshing = true;
        try {
            this.selectedIndex = index;
        } finally {
            this._isRefreshing = oldRefreshing;
        }
    }
    protected beginTrackSelected(): void {
        // if already set then return
        if (!!this._fnCheckSelected) {
            return;
        }
        const self = this, prevVal = fn_Str(self.selectedValue), prevItem = self.selectedItem;
        this._fnCheckSelected = () => {
            // reset function
            self._fnCheckSelected = null;
            const newVal = fn_Str(self.selectedValue), newItem = self.selectedItem;
            if (prevVal !== newVal) {
                self.objEvents.raiseProp("selectedValue");
            }
            if (prevItem !== newItem) {
                self.objEvents.raiseProp("selectedItem");
            }
        };
    }
    protected endTrackSelected(): void {
        this._changeDebounce.enque(() => {
            const fn = this._fnCheckSelected;
            this._fnCheckSelected = null;
            if (!!fn) {
                fn();
            }
        });
    }
    protected setIsEnabled(el: HTMLSelectElement, v: boolean): void {
        el.disabled = !v;
    }
    protected getIsEnabled(el: HTMLSelectElement): boolean {
        return !el.disabled;
    }
    protected setDataSource(v: ICollection<ICollectionItem>): void {
        this._isDSFilled = false;
        this.beginTrackSelected();
        this._unbindDS();
        this._options.dataSource = v;
        const fn_init = () => {
            try {
                const ds = this._options.dataSource;
                this._txtDebounce.cancel();
                this._stDebounce.cancel();

                if (!!ds && !ds.getIsStateDirty()) {
                    this._bindDS();
                    this._refresh();
                } else {
                    this._clear();
                    if (!this._options.noEmptyOption) {
                        this._addOption(null, false);
                    }
                }
            } finally {
                this.endTrackSelected();
            }
        };

        if (!!this._options.syncSetDatasource) {
            fn_init();
        } else {
            this._dsDebounce.enque(fn_init);
        }
    }
    protected get selectedIndex(): number {
        return (!this.el || this.el.length == 0) ? -1 : this.el.selectedIndex;
    }
    protected set selectedIndex(v: number) {
        if (!!this.el && this.el.length > v && this.selectedIndex !== v) {
            this.el.selectedIndex = v;
        }
    }
    isSubscribed(flag: SubscribeFlags): boolean {
        return !this._options.nodelegate && flag === SubscribeFlags.change;
    }
    handle_change(_e: Event): boolean {
        if (this._isRefreshing) {
            return true;
        }
        this._onSelectedChanged();
        return true;
    }
    addOnRefreshed(fn: TEventHandler<ListBox, {}>, nmspace?: string, context?: any): void {
        this.objEvents.on(LISTBOX_EVENTS.refreshed, fn, nmspace, context);
    }
    offOnRefreshed(nmspace?: string): void {
        this.objEvents.off(LISTBOX_EVENTS.refreshed, nmspace);
    }
    getText(val: any): string {
        const data: IMappedItem = this.getByValue(val);
        return (!data) ? "" : data.op.text;
    }
    toString(): string {
        return "ListBox";
    }
    get dataSource(): ICollection<ICollectionItem> {
        return this._options.dataSource;
    }
    set dataSource(v) {
        if (this.dataSource !== v) {
            this.setDataSource(v);
            this.objEvents.raiseProp("dataSource");
        }
    }
    get selectedValue(): any {
        return (!isNt(this._selectedValue) && !this.getByValue(this._selectedValue)) ? _undefined : this._selectedValue;
    }
    set selectedValue(v) {
        if (this._selectedValue !== v) {
            const oldItem = this.selectedItem;
            this._selectedValue = v;
            this.updateSelected(v);
            this._fnCheckSelected = null;
            this.objEvents.raiseProp("selectedValue");
            if (oldItem !== this.selectedItem) {
                this.objEvents.raiseProp("selectedItem");
            }
        }
    }
    get selectedItem(): ICollectionItem {
        const item: IMappedItem = this.getByValue(this._selectedValue);
        return (!item ? null : item.item);
    }
    set selectedItem(v: ICollectionItem) {
        const newVal = this._getValue(v), oldItem = this.selectedItem;
        if (this._selectedValue !== newVal) {
            this._selectedValue = newVal;
            const item = this.getByValue(newVal);
            this.selectedIndex = (!item ? 0 : item.op.index);
            this._fnCheckSelected = null;
            this.objEvents.raiseProp("selectedValue");
            if (oldItem !== this.selectedItem) {
                this.objEvents.raiseProp("selectedItem");
            }
        }
    }
    get valuePath(): string {
        return this._options.valuePath;
    }
    set valuePath(v: string) {
        if (v !== this.valuePath) {
            this._options.valuePath = v;
            this._mapByValue();
            this.objEvents.raiseProp("valuePath");
        }
    }
    get textPath(): string {
        return this._options.textPath;
    }
    set textPath(v: string) {
        if (v !== this.textPath) {
            this._options.textPath = v;
            this._resetText();
            this.objEvents.raiseProp("textPath");
        }
    }
    get statePath(): string {
        return this._options.statePath;
    }
    get isEnabled(): boolean {
        return this.getIsEnabled(this.el);
    }
    set isEnabled(v) {
        if (v !== this.isEnabled) {
            this.setIsEnabled(this.el, v);
            this.objEvents.raiseProp("isEnabled");
        }
    }
    get textProvider(): IOptionTextProvider {
        return this._textProvider;
    }
    set textProvider(v: IOptionTextProvider) {
        if (v !== this._textProvider) {
            this._textProvider = v;
            this._txtDebounce.enque(() => {
                this._resetText();
            });
            this.objEvents.raiseProp("textProvider");
        }
    }
    get stateProvider(): IOptionStateProvider {
        return this._stateProvider;
    }
    set stateProvider(v: IOptionStateProvider) {
        if (v !== this._stateProvider) {
            this._stateProvider = v;
            this._stDebounce.enque(() => {
                this._resetState();
            });
            this.objEvents.raiseProp("stateProvider");
        }
    }
    get el(): HTMLSelectElement {
        return this._el;
    }
}

export interface IListBoxViewOptions extends IListBoxOptions, IViewOptions {
}

export class ListBoxElView extends BaseElView {
    private _listBox: ListBox;

    constructor(el: HTMLSelectElement, options: IListBoxViewOptions) {
        super(el, options);
        const self = this;
        self._listBox = new ListBox(el, <IListBoxConstructorOptions>options);
        self._listBox.objEvents.onProp("*", (_, args) => {
            switch (args.property) {
                case "dataSource":
                case "isEnabled":
                case "selectedValue":
                case "selectedItem":
                case "valuePath":
                case "textPath":
                case "textProvider":
                case "stateProvider":
                    self.objEvents.raiseProp(args.property);
                    break;
            }
        }, self.uniqueID);
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        if (!this._listBox.getIsStateDirty()) {
            this._listBox.dispose();
        }
        super.dispose();
    }
    toString(): string {
        return "ListBoxElView";
    }
    addOnRefreshed(fn: TEventHandler<ListBox, {}>, nmspace?: string, context?: any): void {
        this._listBox.objEvents.on(LISTBOX_EVENTS.refreshed, fn, nmspace, context);
    }
    offOnRefreshed(nmspace?: string): void {
        this._listBox.objEvents.off(LISTBOX_EVENTS.refreshed, nmspace);
    }
    getText(val: any): string {
        return this._listBox.getText(val);
    }
    get isEnabled(): boolean {
        return !(<HTMLSelectElement>this.el).disabled;
    }
    set isEnabled(v: boolean) {
        v = !v;
        if (v !== !this.isEnabled) {
            (<HTMLSelectElement>this.el).disabled = v;
            this.objEvents.raiseProp("isEnabled");
        }
    }
    get dataSource(): ICollection<ICollectionItem> {
        return this._listBox.dataSource;
    }
    set dataSource(v: ICollection<ICollectionItem>) {
        const self = this;
        if (self.dataSource !== v) {
            self._listBox.dataSource = v;
        }
    }
    get selectedValue(): any {
        return (this.getIsStateDirty()) ? _undefined : this._listBox.selectedValue;
    }
    set selectedValue(v) {
        if (this._listBox.selectedValue !== v) {
            this._listBox.selectedValue = v;
        }
    }
    get selectedItem(): ICollectionItem {
        return (this.getIsStateDirty()) ? _undefined : this._listBox.selectedItem;
    }
    set selectedItem(v: ICollectionItem) {
        this._listBox.selectedItem = v;
    }
    get valuePath(): string {
        return this._listBox.valuePath;
    }
    set valuePath(v: string) {
        this._listBox.valuePath = v;
    }
    get textPath(): string {
        return this._listBox.textPath;
    }
    set textPath(v: string) {
        this._listBox.textPath = v;
    }
    get textProvider(): IOptionTextProvider {
        return this._listBox.textProvider;
    }
    set textProvider(v: IOptionTextProvider) {
        this._listBox.textProvider = v;
    }
    get stateProvider(): IOptionStateProvider {
        return this._listBox.stateProvider;
    }
    set stateProvider(v: IOptionStateProvider) {
        this._listBox.stateProvider = v;
    }
    get listBox(): ListBox {
        return this._listBox;
    }
}


boot.registerElView("select", ListBoxElView);