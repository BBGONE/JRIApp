import * as RIAPP from "jriapp";
import * as dbMOD from "jriapp_db";

import * as DEMODB from "../demo/demoDB";
import { ResetCommand } from "./commands";
import { DemoApplication } from "./app";

let utils = RIAPP.Utils;

export class ProductsFilter extends RIAPP.BaseObject {
    private _prodNumber: any;
    private _name: string;
    private _parentCategoryID: number;
    private _childCategoryID: number;
    private _selectedCategory: DEMODB.ProductCategory;
    private _selectedModel: DEMODB.ProductModel;
    private _modelID: (number | null)[];
    private _parentCategories: dbMOD.DataView<DEMODB.ProductCategory>;
    private _childCategories: dbMOD.DataView<DEMODB.ProductCategory>;
    private _resetCommand: ResetCommand;
    private _app: DemoApplication;
    private _saleStart1: Date;
    private _saleStart2: Date;
    private _sizes: DEMODB.KeyValDictionary;
    private _size: number;
    // just as an example how several client side dictionaries could be filled in one service call
    private _prodCatDic: DEMODB.KeyValDictionary;
    private _prodModDic: DEMODB.KeyValDictionary;
    private _prodDescDic: DEMODB.KeyValDictionary;

    private _loaded: boolean;

    constructor(app: DemoApplication) {
        super();
        const self = this;
        this._app = app;
        this._prodNumber = null;
        this._name = null;
        this._parentCategoryID = null;
        this._childCategoryID = null;
        this._selectedCategory = null;
        this._selectedModel = null;
        this._modelID = null;
        this._saleStart1 = null;
        this._saleStart2 = null;
        //filters top level product categories
        this._parentCategories = new dbMOD.DataView<DEMODB.ProductCategory>(
            {
                dataSource: this.ProductCategories,
                fn_sort: function (a, b) { return a.ProductCategoryID - b.ProductCategoryID; },
                fn_filter: function (item) { return item.ParentProductCategoryID == null; }
            });


        //filters product categories which have parent category
        this._childCategories = new dbMOD.DataView<DEMODB.ProductCategory>(
            {
                dataSource: this.ProductCategories,
                fn_sort: function (a, b) { return a.ProductCategoryID - b.ProductCategoryID; },
                fn_filter: function (item) { return item.ParentProductCategoryID !== null && item.ParentProductCategoryID == self.parentCategoryID; }
            });
        this._sizes = new DEMODB.KeyValDictionary();
        this._sizes.fillItems([{ key: 0, val: 'EMPTY' }, { key: 1, val: 'NOT EMPTY' }, { key: 2, val: 'SMALL SIZE' }, { key: 3, val: 'BIG SIZE' }], true);
        this._size = null;
        this._resetCommand = new ResetCommand(self);

        this._prodCatDic = new DEMODB.KeyValDictionary();
        this._prodModDic = new DEMODB.KeyValDictionary();
        this._prodDescDic = new DEMODB.KeyValDictionary();

        this._loaded = false;
    }
    _loadCategories() {
        let query = this.ProductCategories.createReadProductCategoryQuery();
        query.orderBy('Name');
        //returns a promise
        return query.load();
    }
    //returns a promise
    _loadProductModels() {
        let query = this.ProductModels.createReadProductModelQuery();
        query.orderBy('Name');
        //returns promise
        return query.load();
    }
    _loadClassifiers(): RIAPP.IPromise<DEMODB.IDEMOCLS> {
        return this.dbContext.serviceMethods.GetClassifiers();
    }
    //returns a promise
    load() {
        // 3 asynchronous requests, we get the promises for each one
        let promise1 = this._loadClassifiers().then((res) => {
            this._prodCatDic.fillItems(res.prodCategory, true);
            this._prodModDic.fillItems(res.prodModel, true);
            this._prodDescDic.fillItems(res.prodDescription, true);
        }), promise2 = this._loadCategories(), promise3 = this._loadProductModels();

        // combine them into one promise - which resolves when all requests are completed
        return utils.async.whenAll<any>([promise1, promise2, promise3]).then(() => {
            this._loaded = true;
            this.objEvents.raise('loaded', {});
            this.reset();
        }, (err) => { this._app.handleError(err, this); });
    }
    addOnLoaded(fn: (sender: this, args: {}) => void, nmspace?: string) {
        this.objEvents.on('loaded', fn, nmspace);
    }
    reset() {
        this.parentCategoryID = null;
        this.childCategoryID = null;
        this.prodNumber = null;
        this.name = null;
        this.modelID = null;
        this.selectedModel = null;
        this.selectedCategory = null;

        this.saleStart1 = null;
        this.saleStart2 = null;
        this.size = null;
    }
    get loaded() {
        return this._loaded;
    }
    // demo dictionaries which are loaded from the service call
    // they can be used for lookups or to bind to select HTML elements to fill the options
    get prodCatDic() { return this._prodCatDic; }
    get prodModDic() { return this._prodModDic; }
    get prodDescDic() { return this._prodDescDic; }

    get prodNumber() { return this._prodNumber; }
    set prodNumber(v) {
        if (this._prodNumber != v) {
            this._prodNumber = v;
            this.objEvents.raiseProp('prodNumber');
        }
    }
    get name() { return this._name; }
    set name(v) {
        if (this._name != v) {
            this._name = v;
            this.objEvents.raiseProp('name');
        }
    }
    get parentCategoryID() { return this._parentCategoryID; }
    set parentCategoryID(v) {
        if (this._parentCategoryID != v) {
            this._parentCategoryID = v;
            this.objEvents.raiseProp('parentCategoryID');
            this._childCategories.refresh();
        }
    }
    get childCategoryID() { return this._childCategoryID; }
    set childCategoryID(v) {
        if (this._childCategoryID != v) {
            this._childCategoryID = v;
            this.objEvents.raiseProp('childCategoryID');
        }
    }
    get modelID(): (number | null)[] { return this._modelID; }
    set modelID(v) {
        if (this._modelID != v) {
            this._modelID = v;
            this.objEvents.raiseProp('modelID');
        }
    }
    get saleStart1() { return this._saleStart1; }
    set saleStart1(v) {
        if (this._saleStart1 != v) {
            this._saleStart1 = v;
            this.objEvents.raiseProp('saleStart1');
        }
    }
    get saleStart2() { return this._saleStart2; }
    set saleStart2(v) {
        if (this._saleStart2 != v) {
            this._saleStart2 = v;
            this.objEvents.raiseProp('saleStart2');
        }
    }
    get dbSets() { return this.dbContext.dbSets; }
    get ParentCategories() { return this._parentCategories; }
    get ChildCategories() { return this._childCategories; }
    get ProductModels() { return this.dbSets.ProductModel; }
    get ProductCategories() { return this.dbSets.ProductCategory; }
    get resetCommand() { return this._resetCommand; }
    get searchTextToolTip() { return "Use placeholder <span style='font-size: larger'><b>%</b></span><br/> for searching by part of the value"; }
    get selectedCategory() { return this._selectedCategory; }
    set selectedCategory(v) {
        if (this._selectedCategory != v) {
            this._selectedCategory = v;
            this.objEvents.raiseProp('selectedCategory');
        }
    }
    get selectedModel() { return this._selectedModel; }
    set selectedModel(v) {
        if (this._selectedModel != v) {
            this._selectedModel = v;
            this.objEvents.raiseProp('selectedModel');
        }
    }
    get sizes() { return this._sizes; }
    get size() { return this._size; }
    set size(v) {
        if (this._size != v) {
            this._size = v;
            this.objEvents.raiseProp('size');
        }
    }
    set modelData(data: {
        names: dbMOD.IFieldName[];
        rows: dbMOD.IRowData[];
    }) { this.ProductModels.fillData(data); }
    set categoryData(data: {
        names: dbMOD.IFieldName[];
        rows: dbMOD.IRowData[];
    }) { this.ProductCategories.fillData(data); }
    get dbContext() { return this._app.dbContext; }
}