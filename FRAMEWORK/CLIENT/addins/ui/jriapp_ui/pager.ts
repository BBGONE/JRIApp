/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    Utils, BaseObject, LocaleERRS as ERRS, LocaleSTRS as STRS, Debounce, IValidationInfo
} from "jriapp_shared";
import { DATA_ATTR } from "jriapp/consts";
import { DomUtils } from "jriapp/utils/dom";
import { IViewOptions, ISelectable, ISelectableProvider } from "jriapp/int";
import { addToolTip } from "./baseview";
import { BaseElView } from "./baseview";
import { COLL_CHANGE_REASON, COLL_CHANGE_TYPE } from "jriapp_shared/collection/const";
import { ICollection, ICollectionItem } from "jriapp_shared/collection/int";
import { bootstrapper, selectableProviderWeakMap } from "jriapp/bootstrapper";

const utils = Utils, dom = DomUtils, doc = dom.document, sys = utils.sys,
    { format } = utils.str, { getNewID, extend } = utils.core, boot = bootstrapper;
const _STRS = STRS.PAGER;

const enum css {
    interval = "ria-pager-interval",
    pager = "ria-pager",
    info = "ria-pager-info",
    page = "ria-pager-page",
    currentPage = "ria-pager-current-page",
    otherPage = "ria-pager-other-page"
}

export interface IPagerOptions {
    showTip?: boolean;
    showInfo?: boolean;
    showNumbers?: boolean;
    showFirstAndLast?: boolean;
    showPreviousAndNext?: boolean;
    useSlider?: boolean;
    hideOnSinglePage?: boolean;
    sliderSize?: number;
    dataSource?: ICollection<ICollectionItem>;
}

function _removeToolTips(toolTips: Element[]): void {
    for (const el of toolTips)
    {
        addToolTip(el, null);
    }
}

export class Pager extends BaseObject implements ISelectableProvider {
    private _el: HTMLElement;
    private _uniqueID: string;
    private _options: IPagerOptions;
    private _rowsPerPage: number;
    private _rowCount: number;
    private _currentPage: number;
    private _pageDebounce: Debounce;
    private _dsDebounce: Debounce;
    // saves old display before making display: none
    private _display: string;
    //an array of elements to which the toolTips are added
    private _toolTips: Element[];
    private _parentControl: ISelectableProvider;

    constructor(el: HTMLElement, options: IPagerOptions) {
        super();
        options = extend(
            {
                dataSource: null,
                showTip: true,
                showInfo: false,
                showNumbers: true,
                showPreviousAndNext: false,
                useSlider: true,
                hideOnSinglePage: true,
                sliderSize: 10
            }, options);
        const self = this;
        this._display = null;
        if (!!options.dataSource && !sys.isCollection(options.dataSource)) {
            throw new Error(ERRS.ERR_PAGER_DATASRC_INVALID);
        }
        this._options = options;
        //no use to have a sliderSize < 3
        options.sliderSize = options.sliderSize < 3 ? 3 : options.sliderSize;

        this._el = el;
        this._uniqueID = getNewID("pgr");
        this._rowsPerPage = 0;
        this._rowCount = 0;
        this._currentPage = 1;
        this._toolTips = [];
        this._pageDebounce = new Debounce();
        this._dsDebounce = new Debounce();

        dom.events.on(el, "click", (e) => {
            e.preventDefault();
            const a = <HTMLElement>e.target, page = parseInt(a.getAttribute("data-page"), 10);
            self._pageDebounce.enque(() => {
                self.currentPage = page;
                self._dsDebounce.enque(() => {
                    if (!!self.dataSource) {
                        self.dataSource.pageIndex = page - 1;
                    }
                });
            });
        }, {
                nmspace: this._uniqueID,
                // using delegation
                matchElement: (el: Element) => {
                    const attr = el.getAttribute(DATA_ATTR.DATA_EVENT_SCOPE);
                    return self._uniqueID === attr;
                }
            });

        this._bindDS();
        selectableProviderWeakMap.set(el, this);
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        selectableProviderWeakMap.delete(this._el);
        this.parentControl = null;
        this._pageDebounce.dispose();
        this._dsDebounce.dispose();
        this._unbindDS();
        this._clearContent();
        dom.events.offNS(this._el, this._uniqueID);
        this._el = null;
        this._options = <any>{};
        super.dispose();
    }
    protected _addToolTip(el: Element, tip: string): void {
        addToolTip(el, tip);
        if (!!tip) {
            this._toolTips.push(el);
        }
    }
    protected _createElement(tag: string): HTMLElement {
        return doc.createElement(tag);
    }
    protected _clearContent(): void {
        this._el.innerHTML = "";
        _removeToolTips(this._toolTips);
        this._toolTips = [];
    }
    protected render(): void {
        const div = doc.createElement("div"), docFr = doc.createDocumentFragment(), oldToolTips = this._toolTips;
        this._toolTips = [];
        dom.addClass([div], css.pager);

        if (this.rowsPerPage <= 0) {
            return;
        }

        const rowCount = this.rowCount, currentPage = this.currentPage,
            pageCount = this.pageCount;

        if (rowCount > 0) {
            if (this.showPreviousAndNext && !(this.hideOnSinglePage && (pageCount === 1))) {
                docFr.appendChild(this._createFirst());
                docFr.appendChild(this._createPrevious());
                docFr.appendChild(this._createCurrent());
                docFr.appendChild(this._createNext());
                docFr.appendChild(this._createLast());
            }

            if (this.showNumbers && currentPage > 0 && !(this.hideOnSinglePage && (pageCount === 1))) {
                const sliderSize = this.sliderSize;
                let start = 1, end = pageCount, half: number, above: number, below: number;

                if (this.useSlider && (sliderSize > 0) && (sliderSize < (pageCount - 3))) {
                    half = Math.floor(((sliderSize - 1) / 2));
                    above = (currentPage + half) + ((sliderSize - 1) % 2);
                    below = (currentPage - half);

                    if (below < 1) {
                        above += (1 - below);
                        below = 1;
                    }

                    if (above > pageCount) {
                        below -= (above - pageCount);

                        if (below < 1) {
                            below = 1;
                        }

                        above = pageCount;
                    }

                    start = below;
                    end = above;
                }
                let _start = start === 1 ? 2 : start;
                let _end = end === pageCount ? end - 1 : end;

                if (1 === currentPage) {
                    docFr.appendChild(this._createCurrent());
                } else {
                    docFr.appendChild(this._createOther(1));
                }

                if (_start > 2) {
                    if (_start === 3) {
                        docFr.appendChild(this._createOther(2));
                    } else {
                        docFr.appendChild(this._createInterval());
                    }
                }

                for (let i = _start; i <= _end; i++) {
                    if (i === currentPage) {
                        docFr.appendChild(this._createCurrent());
                    } else {
                        docFr.appendChild(this._createOther(i));
                    }
                }

                if (_end < (pageCount - 1)) {
                    if (_end === (pageCount - 2)) {
                        docFr.appendChild(this._createOther(pageCount - 1));
                    } else {
                        docFr.appendChild(this._createInterval());
                    }
                }

                if (pageCount === currentPage) {
                    docFr.appendChild(this._createCurrent());
                } else {
                    docFr.appendChild(this._createOther(pageCount));
                }
            } // if (this.showNumbers)
        }

        if (this.showInfo && rowCount > 0 && currentPage > 0) {
            const rowsPerPage = this.rowsPerPage,
                start = rowCount === 0 ? 0 : (((currentPage - 1) * rowsPerPage) + 1),
                end = rowCount === 0 ? 0 : ((currentPage === pageCount) ? rowCount : (currentPage * rowsPerPage));

            const span = this._createElement("span");
            const info = format(_STRS.pageInfo, start, end, rowCount);
            dom.addClass([span], css.info);
            span.innerHTML = info;
            const spacer = this._createElement("span");
            spacer.innerHTML = "&nbsp;&nbsp;";
            docFr.appendChild(spacer);
            docFr.appendChild(span);
        }
        div.appendChild(docFr);

        const old = this._el.firstChild;
        if (!old) {
            this._el.appendChild(div);
        } else {
            this._el.replaceChild(div, this._el.firstChild);
        }
        _removeToolTips(oldToolTips);
    }
    protected _onPageSizeChanged(ds: ICollection<ICollectionItem>): void {
        this.rowsPerPage = ds.pageSize;
    }
    protected _onPageIndexChanged(ds: ICollection<ICollectionItem>): void {
        this.currentPage = ds.pageIndex + 1;
    }
    protected _onTotalCountChanged(ds: ICollection<ICollectionItem>): void {
        this.rowCount = ds.totalCount;
    }
    protected _bindDS(): void {
        const self = this, ds = this.dataSource;
        if (!ds) {
            return;
        }
        ds.addOnCollChanged((_, args) => {
            switch (args.changeType) {
                case COLL_CHANGE_TYPE.Reset:
                    {
                        if (args.reason !== COLL_CHANGE_REASON.PageChange) {
                            self._reset();
                        }
                    }
                    break;
            }
        }, self._uniqueID);
        ds.addOnPageIndexChanged(self._onPageIndexChanged, self._uniqueID, self);
        ds.addOnPageSizeChanged(self._onPageSizeChanged, self._uniqueID, self);
        ds.addOnTotalCountChanged(self._onTotalCountChanged, self._uniqueID, self);
        this._reset();
    }
    protected _unbindDS(): void {
        const self = this, ds = this.dataSource;
        if (!ds) {
            return;
        }
        ds.objEvents.offNS(self._uniqueID);
    }
    protected _reset(): void {
        const ds = this.dataSource;
        if (!ds) {
            this._currentPage = 1;
            this._rowsPerPage = 100;
            this._rowCount = 0;
            this.render();
            return;
        }
        this._currentPage = ds.pageIndex + 1;
        this._rowsPerPage = ds.pageSize;
        this._rowCount = ds.totalCount;
        this.render();
    }
    protected _createLink(text: string): HTMLElement {
        const a = this._createElement("a");
        a.textContent = ("" + text);
        a.setAttribute("href", "javascript:void(0)");
        return a;
    }
    private _addScope(el: Element, page: number): void {
        el.setAttribute(DATA_ATTR.DATA_EVENT_SCOPE, this._uniqueID);
        el.setAttribute("data-page", "" + page);
    }
    protected _createFirst(): HTMLElement {
        const span = this._createElement("span");

        if (this.showTip) {
            const tip = _STRS.firstPageTip;
            this._addToolTip(span, tip);
        }
        const a = this._createLink(_STRS.firstText);
        dom.addClass([span], css.page);
        dom.addClass([span], css.otherPage);
        span.appendChild(a);
        this._addScope(span, 1);
        return span;
    }
    protected _createPrevious(): HTMLElement {
        const span = this._createElement("span");
        let previousPage = this.currentPage - 1;
        if (previousPage < 1) {
            previousPage = 1;
        }
        if (this.showTip) {
            const tip = format(_STRS.prevPageTip, previousPage);
            this._addToolTip(span, tip);
        }
        const a = this._createLink(_STRS.previousText);
        dom.addClass([span], css.page);
        dom.addClass([span], css.otherPage);
        span.appendChild(a);
        this._addScope(span, previousPage);
        return span;
    }
    protected _createCurrent(): HTMLElement {
        const span = this._createElement("span"), currentPage = this.currentPage;

        span.textContent = ("" + currentPage);

        if (this.showTip) {
            this._addToolTip(span, this._buildTip(currentPage));
        }
        dom.addClass([span], css.page);
        dom.addClass([span], css.currentPage);
        return span;
    }
    protected _createInterval(): HTMLElement {
        const span = this._createElement("span");
        dom.addClass([span], css.interval);
        span.textContent = ("...");
        return span;
    }
    protected _createOther(page: number): HTMLElement {
        const span = this._createElement("span");

        if (this.showTip) {
            const tip = this._buildTip(page);
            this._addToolTip(span, tip);
        }

        const a = this._createLink("" + page);
        dom.addClass([span], css.page);
        dom.addClass([span], css.otherPage);
        span.appendChild(a);
        this._addScope(span, page);
        return span;
    }
    protected _createNext(): HTMLElement {
        const span = this._createElement("span"), pageCount = this.pageCount;
        let nextPage = this.currentPage + 1;
        if (nextPage > pageCount) {
            nextPage = pageCount;
        }
        if (this.showTip) {
            const tip = format(_STRS.nextPageTip, nextPage);
            this._addToolTip(span, tip);
        }
        const a = this._createLink(_STRS.nextText);
        dom.addClass([span], css.page);
        dom.addClass([span], css.otherPage);
        span.appendChild(a);
        this._addScope(span, nextPage);
        return span;
    }
    protected _createLast(): HTMLElement {
        const span = this._createElement("span");

        if (this.showTip) {
            const tip = _STRS.lastPageTip;
            this._addToolTip(span, tip);
        }
        const a = this._createLink(_STRS.lastText);
        dom.addClass([span], css.page);
        dom.addClass([span], css.otherPage);
        span.appendChild(a);
        this._addScope(span, this.pageCount);
        return span;
    }
    protected _buildTip(page: number): string {
        const rowsPerPage = this.rowsPerPage, rowCount = this.rowCount,
            start = (((page - 1) * rowsPerPage) + 1),
            end = (page === this.pageCount) ? rowCount : (page * rowsPerPage);
        let tip = "";

        if (page === this.currentPage) {
            tip = format(_STRS.showingTip, start, end, rowCount);
        } else {
            tip = format(_STRS.showTip, start, end, rowCount);
        }
        return tip;
    }
    protected setDataSource(v: ICollection<ICollectionItem>): void {
        this._unbindDS();
        this._options.dataSource = v;
        this._bindDS();
    }
    toString(): string {
        return "Pager";
    }
    get el(): HTMLElement {
        return this._el;
    }
    get dataSource(): ICollection<ICollectionItem> {
        return this._options.dataSource;
    }
    set dataSource(v: ICollection<ICollectionItem>) {
        if (v !== this.dataSource) {
            this.setDataSource(v);
            this.objEvents.raiseProp("dataSource");
        }
    }
    get pageCount(): number {
        const rowCount = this.rowCount, rowsPerPage = this.rowsPerPage;
        let result: number;

        if ((rowCount === 0) || (rowsPerPage === 0)) {
            return 0;
        }

        if ((rowCount % rowsPerPage) === 0) {
            return (rowCount / rowsPerPage);
        } else {
            result = (rowCount / rowsPerPage);
            result = Math.floor(result) + 1;
            return result;
        }
    }
    get rowCount(): number {
        return this._rowCount;
    }
    set rowCount(v: number) {
        if (this._rowCount !== v) {
            this._rowCount = v;
            this.render();
            this.objEvents.raiseProp("rowCount");
        }
    }
    get rowsPerPage(): number {
        return this._rowsPerPage;
    }
    set rowsPerPage(v: number) {
        if (this._rowsPerPage !== v) {
            this._rowsPerPage = v;
            this.render();
        }
    }
    get currentPage(): number {
        return this._currentPage;
    }
    set currentPage(v: number) {
        if (this._currentPage !== v) {
            this._currentPage = v;
            this.render();
            this.objEvents.raiseProp("currentPage");
        }
    }
    get useSlider(): boolean {
        return this._options.useSlider;
    }
    set useSlider(v: boolean) {
        if (this.useSlider !== v) {
            this._options.useSlider = v;
            this.render();
        }
    }
    get sliderSize(): number {
        return this._options.sliderSize;
    }
    set sliderSize(v: number) {
        if (this.sliderSize !== v) {
            this._options.sliderSize = v;
            this.render();
        }
    }
    get hideOnSinglePage(): boolean {
        return this._options.hideOnSinglePage;
    }
    set hideOnSinglePage(v: boolean) {
        if (this.hideOnSinglePage !== v) {
            this._options.hideOnSinglePage = v;
            this.render();
        }
    }
    get showTip(): boolean {
        return this._options.showTip;
    }
    set showTip(v: boolean) {
        if (this.showTip !== v) {
            this._options.showTip = v;
            this.render();
        }
    }
    get showInfo(): boolean {
        return this._options.showInfo;
    }
    set showInfo(v: boolean) {
        if (this._options.showInfo !== v) {
            this._options.showInfo = v;
            this.render();
        }
    }
    get showPreviousAndNext(): boolean {
        return this._options.showPreviousAndNext;
    }
    set showPreviousAndNext(v: boolean) {
        if (this.showPreviousAndNext !== v) {
            this._options.showPreviousAndNext = v;
            this.render();
        }
    }
    get showNumbers(): boolean {
        return this._options.showNumbers;
    }
    set showNumbers(v: boolean) {
        if (this.showNumbers !== v) {
            this._options.showNumbers = v;
            this.render();
        }
    }
    get isVisible(): boolean {
        const v = this.el.style.display;
        return !(v === "none");
    }
    set isVisible(v: boolean) {
        v = !!v;
        if (v !== this.isVisible) {
            if (!v) {
                this._display = this.el.style.display;
                // if saved display is none, then don't store it
                if (this._display === "none") {
                    this._display = null;
                }
                this.el.style.display = "none";
            } else {
                this.el.style.display = (!this._display ? "" : this._display);
            }
            this.objEvents.raiseProp("isVisible");
        }
    }
    get selectable(): ISelectable {
        return !this._parentControl ? null : this._parentControl.selectable;
    }
    get parentControl(): ISelectableProvider {
        return this._parentControl;
    }
    set parentControl(v: ISelectableProvider) {
        if (this._parentControl !== v) {
            this._parentControl = v;
            this.objEvents.raiseProp("parentControl");
        }
    }
}

export interface IPagerViewOptions extends IPagerOptions, IViewOptions {
}

export class PagerElView extends BaseElView implements ISelectableProvider {
    private _pager: Pager;

    constructor(el: HTMLElement, options: IPagerViewOptions) {
        super(el, options);
        const self = this;
        this._pager = new Pager(el, options);
        self._pager.objEvents.onProp("*", (_, args) => {
            switch (args.property) {
                case "dataSource":
                case "parentControl":
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
        if (!this._pager.getIsStateDirty()) {
            this._pager.dispose();
        }
        super.dispose();
    }
    // override
    protected _setErrors(_el: HTMLElement, _errors: IValidationInfo[]): void {
        // noop
    }
    toString(): string {
        return "PagerElView";
    }
    get dataSource(): ICollection<ICollectionItem> {
        return this._pager.dataSource;
    }
    set dataSource(v) {
        this._pager.dataSource = v;
    }
    get pager(): Pager {
        return this._pager;
    }
    get selectable(): ISelectable {
        return this._pager.selectable;
    }
    get parentControl(): ISelectableProvider {
        return this._pager.parentControl;
    }
    set parentControl(v: ISelectableProvider) {
        this._pager.parentControl = v;
    }
}

boot.registerElView("pager", PagerElView);
