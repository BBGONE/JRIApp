import * as RIAPP from "jriapp";
import * as dbMOD from "jriapp_db";
import * as uiMOD from "jriapp_ui";
import * as COMMON from "./common";

const bootstrapper = RIAPP.bootstrapper, utils = RIAPP.Utils, $ = uiMOD.$, dom = RIAPP.DOM;

function findElemViewInTemplate(template: RIAPP.ITemplate, name: string) {
    //look by data-name attribute value
    const arr = template.findElViewsByDataName(name);
    return (!!arr && arr.length > 0) ? arr[0] : null;
}

function findElemInTemplate(template: RIAPP.ITemplate, name: string) {
    const arr = template.findElByDataName(name);
    return (!!arr && arr.length > 0) ? arr[0] : null;
}

export interface IAutocompleteOptions extends RIAPP.IViewOptions {
    dbContext: dbMOD.DbContext;
    templateId: string;
    fieldName: string;
    dbSetName: string;
    queryName: string;
    minTextLength: number;
    width?: any;
    height?: any;
}

export class AutoCompleteElView extends uiMOD.InputElView<HTMLInputElement> implements RIAPP.ITemplateEvents {
    private _templateId: string;
    private _fieldName: string;
    private _dbSetName: string;
    private _queryName: string;
    private _template: RIAPP.ITemplate;
    protected _gridDataSource: RIAPP.ICollection<RIAPP.ICollectionItem>;
    private _prevText: string;
    private _$dropDown: JQuery;
    private _loadTimeout: any;
    private _dataContext: any;
    private _isLoading: boolean;
    private _width: any;
    private _height: any;
    private _isOpen: boolean;
    private _grid: uiMOD.DataGrid;
    private _btnOk: HTMLElement;
    private _btnCancel: HTMLElement;
    private _dbContext: dbMOD.DbContext;
    private _minTextLength: number;

    constructor(el: HTMLInputElement, options: IAutocompleteOptions) {
        super(el, options);
        const self = this;
        this._templateId = options.templateId;
        this._fieldName = options.fieldName;
        this._dbSetName = options.dbSetName;
        this._queryName = options.queryName;
        this._dbContext = options.dbContext;
        this._minTextLength = (!!options.minTextLength) ? options.minTextLength : 1;
        this._template = null;
        this._gridDataSource = null;
        this._prevText = null;
        this._template = null;
        this._$dropDown = null;
        this._loadTimeout = null;
        this._dataContext = null;
        this._isLoading = false;
        this._grid = null;
        this._btnOk = null;
        this._btnCancel = null;
        this._width = options.width || '200px';
        this._height = options.height || '330px';
        const $el = $(this.el);

        $el.on('change.' + this.uniqueID, function (e) {
            e.stopPropagation();
            self._onTextChange();
            self.objEvents.raiseProp('value');
        });
        $el.on('keyup.' + this.uniqueID, function (e) {
            e.stopPropagation();
            self._onKeyUp((<any>e.target).value, e.keyCode);
            self._onKeyPress(e.keyCode);
        });
        $el.on('keypress.' + this.uniqueID, function (e) {
            e.stopPropagation();
        });

        this._isOpen = false;
        this._createGridDataSource();
        const parentEl = dom.document.createElement("div");
        this._template = this._createTemplate(parentEl);
        this._$dropDown = $(parentEl);
        this._$dropDown.css({
            "position": "absolute",
            "z-index": "10000",
            "left": "-2000px",
            "top": "-1000px",
            "background-color": "white",
            "border": "1px solid gray",
            "width": this._width,
            "height": this._height
        });
        dom.document.body.appendChild(parentEl);
    }
    templateLoading(template: RIAPP.ITemplate): void {
        //noop
    }
    templateLoaded(template: RIAPP.ITemplate, error?: any): void {
        if (this.getIsStateDirty() || error)
            return;
        const self = this, gridElView = <uiMOD.DataGridElView>findElemViewInTemplate(template, 'lookupGrid');
        if (!!gridElView) {
            this._grid = gridElView.grid;
        }
        this._btnOk = findElemInTemplate(template, 'btnOk');
        this._btnCancel = findElemInTemplate(template, 'btnCancel');
        $(this._btnOk).click(() => {
            self._updateSelection();
            self._hide();
        });
        $(this._btnCancel).click(() => {
            self._hide();
        });
    }
    templateUnLoading(template: RIAPP.ITemplate): void {
    }
    protected _createGridDataSource(): void {
        this._gridDataSource = this._getDbContext().getDbSet(this._dbSetName);
        if (!this._gridDataSource) {
            throw new Error(utils.str.format('dbContext does not contain dbSet with the name: {0}', this._dbSetName))
        }
    }
    protected _getDbContext(): dbMOD.DbContext {
        return this._dbContext;
    }
    protected _createTemplate(parentEl: HTMLElement): RIAPP.ITemplate {
        const t = RIAPP.createTemplate({ parentEl: parentEl, dataContext: this, templEvents: this });
        t.templateID = this._templateId;
        return t;
    }
    protected _onTextChange(): void {
    }
    protected _onKeyUp(text: string, keyCode: number): void {
        const self = this;
        clearTimeout(this._loadTimeout);
        if (!!text && text.length >= self._minTextLength) {
            this._loadTimeout = setTimeout(function () {
                if (self.getIsStateDirty()) {
                    return;
                }

                if (self._prevText != text) {
                    self._prevText = text;
                    if (!((keyCode === RIAPP.KEYS.esc) || (keyCode == RIAPP.KEYS.enter))) {
                        if (!self._isOpen) {
                            self._open();
                        }
                        self.load(text);
                    }
                }
            }, 500);
        } else {
            self.gridDataSource.clear();
        }
    }
    protected _onKeyPress(keyCode: number): boolean {
        if (keyCode === RIAPP.KEYS.enter) {
            this._updateSelection();
        }

        if (keyCode === RIAPP.KEYS.esc || keyCode === RIAPP.KEYS.tab || keyCode === RIAPP.KEYS.enter) {
            this._hideAsync();
            return true;
        }
        return false;
    }
    protected _hideAsync(): RIAPP.IPromise<void> {
        const self = this;
        return utils.async.delay(() => {
            self._hide();
        }, 100);
    }
    protected _updateSelection(): void {
        this.value = this.currentSelection;
    }
    protected _updatePosition(): void {
        (<any>this._$dropDown).position(<any>{
            my: "left top",
            at: "left bottom",
            of: $(this.el),
            offset: "0 0"
        });
    }
    protected _onShow(): void {
        this.objEvents.raise('show', {});
    }
    protected _onHide(): void {
        this.objEvents.raise('hide', {});
        this.objEvents.raiseProp("value");
    }
    protected _open(): void {
        if (this._isOpen)
            return;
        const self = this;

        if (!!this._grid) {
            const dlg = this._$dropDown.get(0), txtEl = self.el;

            $(dom.document).on('mousedown.' + this.uniqueID, function (e) {
                if (!(dom.isContained(e.target, dlg) || dom.isContained(e.target, txtEl))) {
                    self._hideAsync();
                }
            });

            this._grid.addOnCellDblClicked(function (s, a) {
                self._updateSelection();
                self._hide();
            }, this.uniqueID);

            bootstrapper.selectedControl = self._grid;

            $(dom.document).on('keyup.' + this.uniqueID, function (e) {
                if (bootstrapper.selectedControl === self._grid) {
                    if (self._onKeyPress(e.which))
                        e.stopPropagation();
                }
            });

            this._grid.dataSource = this.gridDataSource;
        }
        
        this._updatePosition();
        this._isOpen = true;
        this._onShow();
    }
    protected _hide(): void {
        if (!this._isOpen)
            return;
        $(dom.document).off('.' + this.uniqueID);
        if (!!this._grid) {
            this._grid.objEvents.offNS(this.uniqueID);
        }
        this._$dropDown.css({ left: "-2000px" });
        if (!!this._grid) {
            this._grid.dataSource = null;
        }
        this._isOpen = false;
        this._onHide();
    }
    protected getDataContext(): RIAPP.IBaseObject {
        return this._dataContext;
    }
    protected setDataContext(v: RIAPP.IBaseObject): void {
        const old: RIAPP.IBaseObject = this._dataContext;
        if (this._dataContext !== v) {
            if (!!old) {
                old.objEvents.offNS(this.uniqueID);
            }
            this._dataContext = v;
            this.objEvents.raiseProp('dataContext');
            if (!this._dataContext) {
                this._hideAsync();
            }
        }
    }
    load(str: string): void {
        const self = this, query = (<dbMOD.TDbSet>this.gridDataSource).createQuery(this._queryName);
        query.pageSize = 50;
        query.isClearPrevData = true;
        COMMON.addTextQuery(query, this._fieldName, str + '%');
        query.orderBy(this._fieldName);
        this._isLoading = true;
        this.objEvents.raiseProp('isLoading');
        query.load().finally(function() {
            self._isLoading = false;
            self.objEvents.raiseProp('isLoading');
        });
    }
    dispose(): void {
        if (this.getIsDisposed())
            return;
        this.setDisposing();
        this._hide();
        $(this.el).off('.' + this.uniqueID);
        if (!!this._grid) {
            this._grid = null;
        }
        if (!!this._template) {
            this._template.dispose();
            this._template = null;
            this._$dropDown = null;
        }
        this._gridDataSource = null;
        this._dataContext = null;
        super.dispose();
    }
    //field name for lookup in dbSet
    get fieldName(): string {
        return this._fieldName;
    }
    get templateId(): string {
        return this._templateId;
    }
    get currentSelection(): any {
        if (this._gridDataSource.currentItem) {
            return (<any>this._gridDataSource.currentItem)[this._fieldName];
        } else {
            return null;
        }
    }
    //template instance of drop down area (which contains datagrid) under textbox
    get template(): RIAPP.ITemplate {
        return this._template;
    }
    //Entity which is databound to the textbox
    get dataContext(): RIAPP.IBaseObject {
        return this.getDataContext();
    }
    set dataContext(v) {
        this.setDataContext(v);
    }
    //dbSet for a datagrid's dataSource (for lookup values)
    get gridDataSource(): RIAPP.ICollection<RIAPP.ICollectionItem> {
        return this._gridDataSource;
    }
    get value(): string {
        return (<HTMLInputElement>this.el).value;
    }
    set value(v: string) {
        const x = this.value, str = "" + v;
        v = (!v) ? "" : str;
        if (x !== v) {
            this.el.value = v;
            this._prevText = v;
            this.objEvents.raiseProp("value");
        }
    }
    get isLoading(): boolean {
        return this._isLoading;
    }
}

//this function is executed when an application which uses this namespace is created
export function initModule(app: RIAPP.Application) {
    app.registerElView('autocomplete', AutoCompleteElView);
}