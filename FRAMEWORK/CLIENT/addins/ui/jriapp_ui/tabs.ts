/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { Utils } from "jriapp_shared";
import { $, JQueryUtils } from "./utils/jquery";
import { IViewOptions } from "jriapp/int";
import { bootstrapper } from "jriapp/bootstrapper";
import { BaseElView } from "./baseview";

const utils = Utils, coreUtils = utils.core;

export interface ITabs {
    readonly uniqueID: string;
    readonly el: HTMLElement;
    tabIndex: number;
    isVisible: boolean;
    dataName: string;
    css: string;
}

export interface ITabsEvents {
    addTabs(tabs: ITabs): void;
    removeTabs(): void;
    onTabSelected(tabs: ITabs): void;
}

export class TabsElView extends BaseElView implements ITabs {
    private _tabOpts: any;
    private _tabsEvents: ITabsEvents;
    private _tabsCreated: boolean;

    constructor(el: HTMLElement, options: IViewOptions) {
        super(el, options);
        this._tabOpts = options;
        this._tabsEvents = null;
        this._tabsCreated = false;
        this._createTabs();
    }
    protected _createTabs() {
        const $el = $(this.el), self = this;
        let tabOpts = {
            activate: () => {
                if (!!self._tabsEvents) {
                    self._tabsEvents.onTabSelected(self);
                }
                self.objEvents.raiseProp("tabIndex");
            }
        };
        tabOpts = coreUtils.extend(tabOpts, self._tabOpts);
        (<any>$el).tabs(tabOpts);
        utils.queue.enque(() => {
            if (self.getIsStateDirty()) {
                return;
            }
            self._tabsCreated = true;
            self._onTabsCreated();
            self.objEvents.raiseProp("tabIndex");
        });
    }
    protected _destroyTabs() {
        const $el = $(this.el);
        JQueryUtils.dispose$Plugin($el, "tabs");
        this._tabsCreated = false;
        if (!!this._tabsEvents) {
            this._tabsEvents.removeTabs();
        }

    }
    protected _onTabsCreated() {
        const self = this;
        if (!!self._tabsEvents) {
            self._tabsEvents.addTabs(self);
        }
        if (!!self._tabsEvents) {
            self._tabsEvents.onTabSelected(self);
        }
    }
    dispose() {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        this._destroyTabs();
        this._tabsEvents = null;
        super.dispose();
    }
    toString() {
        return "TabsElView";
    }
    get tabsEvents() { return this._tabsEvents; }
    set tabsEvents(v) {
        const old = this._tabsEvents;
        if (v !== old) {
            if (!!old) {
                old.removeTabs();
            }
            this._tabsEvents = v;
            this.objEvents.raiseProp("tabsEvents");
            if (this._tabsCreated) {
                this._onTabsCreated();
            }
        }
    }
    get tabIndex(): number {
        const $el = <any>$(this.el);
        return $el.tabs("option", "active");
    }
    set tabIndex(v: number) {
        const $el = <any>$(this.el);
        $el.tabs("option", "active", v);
    }
}

bootstrapper.registerElView("tabs", TabsElView);