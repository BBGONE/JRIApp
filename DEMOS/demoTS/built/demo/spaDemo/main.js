var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("domainModel", ["require", "exports", "jriapp_shared", "jriapp_db"], function (require, exports, RIAPP, dbMOD) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DbContext = exports.DbSets = exports.SalesOrderHeaderDb = exports.SalesOrderDetailDb = exports.SalesInfoDb = exports.ProductModelDb = exports.ProductCategoryDb = exports.ProductDb = exports.LookUpProductDb = exports.CustomerJSONDb = exports.CustomerAddressDb = exports.CustomerDb = exports.AddressInfoDb = exports.AddressDb = exports.Customer_ComplexProp = exports.Customer_ComplexProp1 = exports.HistoryList = exports.RadioValDictionary = exports.StrKeyValDictionary = exports.KeyValDictionary = exports.TestList = exports.TestDictionary = exports.TestEnum2 = exports.TestEnum = void 0;
    var TestEnum;
    (function (TestEnum) {
        TestEnum[TestEnum["None"] = 0] = "None";
        TestEnum[TestEnum["OK"] = 1] = "OK";
        TestEnum[TestEnum["Error"] = 2] = "Error";
        TestEnum[TestEnum["Loading"] = 3] = "Loading";
    })(TestEnum = exports.TestEnum || (exports.TestEnum = {}));
    var TestEnum2;
    (function (TestEnum2) {
        TestEnum2[TestEnum2["None"] = 0] = "None";
        TestEnum2[TestEnum2["One"] = 1] = "One";
        TestEnum2[TestEnum2["Two"] = 2] = "Two";
        TestEnum2[TestEnum2["Three"] = 3] = "Three";
    })(TestEnum2 = exports.TestEnum2 || (exports.TestEnum2 = {}));
    var _TestModelListItem = (function (_super) {
        __extends(_TestModelListItem, _super);
        function _TestModelListItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(_TestModelListItem.prototype, "Key", {
            get: function () { return this._aspect._getProp('Key'); },
            set: function (v) { this._aspect._setProp('Key', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(_TestModelListItem.prototype, "SomeProperty1", {
            get: function () { return this._aspect._getProp('SomeProperty1'); },
            set: function (v) { this._aspect._setProp('SomeProperty1', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(_TestModelListItem.prototype, "SomeProperty2", {
            get: function () { return this._aspect._getProp('SomeProperty2'); },
            set: function (v) { this._aspect._setProp('SomeProperty2', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(_TestModelListItem.prototype, "SomeProperty3", {
            get: function () { return this._aspect._getProp('SomeProperty3'); },
            set: function (v) { this._aspect._setProp('SomeProperty3', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(_TestModelListItem.prototype, "MoreComplexProperty", {
            get: function () { return this._aspect._getProp('MoreComplexProperty'); },
            set: function (v) { this._aspect._setProp('MoreComplexProperty', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(_TestModelListItem.prototype, "EnumProperty", {
            get: function () { return this._aspect._getProp('EnumProperty'); },
            set: function (v) { this._aspect._setProp('EnumProperty', v); },
            enumerable: false,
            configurable: true
        });
        _TestModelListItem.prototype.toString = function () {
            return '_TestModelListItem';
        };
        return _TestModelListItem;
    }(RIAPP.CollectionItem));
    var TestDictionary = (function (_super) {
        __extends(TestDictionary, _super);
        function TestDictionary() {
            return _super.call(this, 'Key', [{ name: 'Key', dtype: 1 }, { name: 'SomeProperty1', dtype: 1 }, { name: 'SomeProperty2', dtype: 10 }, { name: 'SomeProperty3', dtype: 0 }, { name: 'MoreComplexProperty', dtype: 0 }, { name: 'EnumProperty', dtype: 0 }]) || this;
        }
        TestDictionary.prototype.itemFactory = function (aspect) {
            return new _TestModelListItem(aspect);
        };
        TestDictionary.prototype.findItem = function (key) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        TestDictionary.prototype.toString = function () {
            return 'TestDictionary';
        };
        return TestDictionary;
    }(RIAPP.BaseDictionary));
    exports.TestDictionary = TestDictionary;
    var TestList = (function (_super) {
        __extends(TestList, _super);
        function TestList() {
            return _super.call(this, [{ name: 'Key', dtype: 1 }, { name: 'SomeProperty1', dtype: 1 }, { name: 'SomeProperty2', dtype: 10 }, { name: 'SomeProperty3', dtype: 0 }, { name: 'MoreComplexProperty', dtype: 0 }, { name: 'EnumProperty', dtype: 0 }]) || this;
        }
        TestList.prototype.itemFactory = function (aspect) {
            return new _TestModelListItem(aspect);
        };
        TestList.prototype.toString = function () {
            return 'TestList';
        };
        return TestList;
    }(RIAPP.BaseList));
    exports.TestList = TestList;
    var _KeyValListItem = (function (_super) {
        __extends(_KeyValListItem, _super);
        function _KeyValListItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(_KeyValListItem.prototype, "key", {
            get: function () { return this._aspect._getProp('key'); },
            set: function (v) { this._aspect._setProp('key', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(_KeyValListItem.prototype, "val", {
            get: function () { return this._aspect._getProp('val'); },
            set: function (v) { this._aspect._setProp('val', v); },
            enumerable: false,
            configurable: true
        });
        _KeyValListItem.prototype.toString = function () {
            return '_KeyValListItem';
        };
        return _KeyValListItem;
    }(RIAPP.CollectionItem));
    var KeyValDictionary = (function (_super) {
        __extends(KeyValDictionary, _super);
        function KeyValDictionary() {
            return _super.call(this, 'key', [{ name: 'key', dtype: 3 }, { name: 'val', dtype: 1 }]) || this;
        }
        KeyValDictionary.prototype.itemFactory = function (aspect) {
            return new _KeyValListItem(aspect);
        };
        KeyValDictionary.prototype.findItem = function (key) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        KeyValDictionary.prototype.toString = function () {
            return 'KeyValDictionary';
        };
        return KeyValDictionary;
    }(RIAPP.BaseDictionary));
    exports.KeyValDictionary = KeyValDictionary;
    var _StrKeyValListItem = (function (_super) {
        __extends(_StrKeyValListItem, _super);
        function _StrKeyValListItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(_StrKeyValListItem.prototype, "key", {
            get: function () { return this._aspect._getProp('key'); },
            set: function (v) { this._aspect._setProp('key', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(_StrKeyValListItem.prototype, "val", {
            get: function () { return this._aspect._getProp('val'); },
            set: function (v) { this._aspect._setProp('val', v); },
            enumerable: false,
            configurable: true
        });
        _StrKeyValListItem.prototype.toString = function () {
            return '_StrKeyValListItem';
        };
        return _StrKeyValListItem;
    }(RIAPP.CollectionItem));
    var StrKeyValDictionary = (function (_super) {
        __extends(StrKeyValDictionary, _super);
        function StrKeyValDictionary() {
            return _super.call(this, 'key', [{ name: 'key', dtype: 1 }, { name: 'val', dtype: 1 }]) || this;
        }
        StrKeyValDictionary.prototype.itemFactory = function (aspect) {
            return new _StrKeyValListItem(aspect);
        };
        StrKeyValDictionary.prototype.findItem = function (key) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        StrKeyValDictionary.prototype.toString = function () {
            return 'StrKeyValDictionary';
        };
        return StrKeyValDictionary;
    }(RIAPP.BaseDictionary));
    exports.StrKeyValDictionary = StrKeyValDictionary;
    var _RadioValListItem = (function (_super) {
        __extends(_RadioValListItem, _super);
        function _RadioValListItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(_RadioValListItem.prototype, "key", {
            get: function () { return this._aspect._getProp('key'); },
            set: function (v) { this._aspect._setProp('key', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(_RadioValListItem.prototype, "value", {
            get: function () { return this._aspect._getProp('value'); },
            set: function (v) { this._aspect._setProp('value', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(_RadioValListItem.prototype, "comment", {
            get: function () { return this._aspect._getProp('comment'); },
            set: function (v) { this._aspect._setProp('comment', v); },
            enumerable: false,
            configurable: true
        });
        _RadioValListItem.prototype.toString = function () {
            return '_RadioValListItem';
        };
        return _RadioValListItem;
    }(RIAPP.CollectionItem));
    var RadioValDictionary = (function (_super) {
        __extends(RadioValDictionary, _super);
        function RadioValDictionary() {
            return _super.call(this, 'key', [{ name: 'key', dtype: 1 }, { name: 'value', dtype: 1 }, { name: 'comment', dtype: 1 }]) || this;
        }
        RadioValDictionary.prototype.itemFactory = function (aspect) {
            return new _RadioValListItem(aspect);
        };
        RadioValDictionary.prototype.findItem = function (key) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        RadioValDictionary.prototype.toString = function () {
            return 'RadioValDictionary';
        };
        return RadioValDictionary;
    }(RIAPP.BaseDictionary));
    exports.RadioValDictionary = RadioValDictionary;
    var _HistoryItemListItem = (function (_super) {
        __extends(_HistoryItemListItem, _super);
        function _HistoryItemListItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(_HistoryItemListItem.prototype, "radioValue", {
            get: function () { return this._aspect._getProp('radioValue'); },
            set: function (v) { this._aspect._setProp('radioValue', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(_HistoryItemListItem.prototype, "time", {
            get: function () { return this._aspect._getProp('time'); },
            set: function (v) { this._aspect._setProp('time', v); },
            enumerable: false,
            configurable: true
        });
        _HistoryItemListItem.prototype.toString = function () {
            return '_HistoryItemListItem';
        };
        return _HistoryItemListItem;
    }(RIAPP.CollectionItem));
    var HistoryList = (function (_super) {
        __extends(HistoryList, _super);
        function HistoryList() {
            return _super.call(this, [{ name: 'radioValue', dtype: 1 }, { name: 'time', dtype: 6 }]) || this;
        }
        HistoryList.prototype.itemFactory = function (aspect) {
            return new _HistoryItemListItem(aspect);
        };
        HistoryList.prototype.toString = function () {
            return 'HistoryList';
        };
        return HistoryList;
    }(RIAPP.BaseList));
    exports.HistoryList = HistoryList;
    var Customer_ComplexProp1 = (function (_super) {
        __extends(Customer_ComplexProp1, _super);
        function Customer_ComplexProp1(name, parent) {
            return _super.call(this, name, parent) || this;
        }
        Object.defineProperty(Customer_ComplexProp1.prototype, "EmailAddress", {
            get: function () { return this.getValue('ComplexProp.ComplexProp.EmailAddress'); },
            set: function (v) { this.setValue('ComplexProp.ComplexProp.EmailAddress', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Customer_ComplexProp1.prototype, "Phone", {
            get: function () { return this.getValue('ComplexProp.ComplexProp.Phone'); },
            set: function (v) { this.setValue('ComplexProp.ComplexProp.Phone', v); },
            enumerable: false,
            configurable: true
        });
        Customer_ComplexProp1.prototype.toString = function () {
            return 'Customer_ComplexProp1';
        };
        return Customer_ComplexProp1;
    }(dbMOD.ChildComplexProperty));
    exports.Customer_ComplexProp1 = Customer_ComplexProp1;
    var Customer_ComplexProp = (function (_super) {
        __extends(Customer_ComplexProp, _super);
        function Customer_ComplexProp(name, owner) {
            var _this = _super.call(this, name, owner) || this;
            _this._ComplexProp = null;
            return _this;
        }
        Object.defineProperty(Customer_ComplexProp.prototype, "FirstName", {
            get: function () { return this.getValue('ComplexProp.FirstName'); },
            set: function (v) { this.setValue('ComplexProp.FirstName', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Customer_ComplexProp.prototype, "MiddleName", {
            get: function () { return this.getValue('ComplexProp.MiddleName'); },
            set: function (v) { this.setValue('ComplexProp.MiddleName', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Customer_ComplexProp.prototype, "LastName", {
            get: function () { return this.getValue('ComplexProp.LastName'); },
            set: function (v) { this.setValue('ComplexProp.LastName', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Customer_ComplexProp.prototype, "Name", {
            get: function () { return this.getEntity()._getCalcFieldVal('ComplexProp.Name'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Customer_ComplexProp.prototype, "ComplexProp", {
            get: function () { if (!this._ComplexProp) {
                this._ComplexProp = new Customer_ComplexProp1('ComplexProp', this);
            } return this._ComplexProp; },
            enumerable: false,
            configurable: true
        });
        Customer_ComplexProp.prototype.toString = function () {
            return 'Customer_ComplexProp';
        };
        return Customer_ComplexProp;
    }(dbMOD.RootComplexProperty));
    exports.Customer_ComplexProp = Customer_ComplexProp;
    var AddressEntity = (function (_super) {
        __extends(AddressEntity, _super);
        function AddressEntity(aspect) {
            return _super.call(this, aspect) || this;
        }
        AddressEntity.prototype.toString = function () {
            return 'AddressEntity';
        };
        Object.defineProperty(AddressEntity.prototype, "AddressID", {
            get: function () { return this._aspect._getFieldVal('AddressID'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressEntity.prototype, "AddressLine1", {
            get: function () { return this._aspect._getFieldVal('AddressLine1'); },
            set: function (v) { this._aspect._setFieldVal('AddressLine1', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressEntity.prototype, "AddressLine2", {
            get: function () { return this._aspect._getFieldVal('AddressLine2'); },
            set: function (v) { this._aspect._setFieldVal('AddressLine2', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressEntity.prototype, "City", {
            get: function () { return this._aspect._getFieldVal('City'); },
            set: function (v) { this._aspect._setFieldVal('City', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressEntity.prototype, "StateProvince", {
            get: function () { return this._aspect._getFieldVal('StateProvince'); },
            set: function (v) { this._aspect._setFieldVal('StateProvince', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressEntity.prototype, "CountryRegion", {
            get: function () { return this._aspect._getFieldVal('CountryRegion'); },
            set: function (v) { this._aspect._setFieldVal('CountryRegion', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressEntity.prototype, "PostalCode", {
            get: function () { return this._aspect._getFieldVal('PostalCode'); },
            set: function (v) { this._aspect._setFieldVal('PostalCode', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressEntity.prototype, "rowguid", {
            get: function () { return this._aspect._getFieldVal('rowguid'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressEntity.prototype, "ModifiedDate", {
            get: function () { return this._aspect._getFieldVal('ModifiedDate'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressEntity.prototype, "CustomerAddresses", {
            get: function () { return this._aspect._getNavFieldVal('CustomerAddresses'); },
            enumerable: false,
            configurable: true
        });
        return AddressEntity;
    }(RIAPP.CollectionItem));
    var AddressDb = (function (_super) {
        __extends(AddressDb, _super);
        function AddressDb(dbContext) {
            var _this = this;
            var opts = {
                dbContext: dbContext,
                dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "Address" },
                childAssoc: ([]),
                parentAssoc: ([{ "name": "CustAddrToAddress", "parentDbSetName": "Address", "childDbSetName": "CustomerAddress", "childToParentName": "Address", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "AddressID" }] }, { "name": "OrdersToBillAddr", "parentDbSetName": "Address", "childDbSetName": "SalesOrderHeader", "childToParentName": "Address1", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "BillToAddressID" }] }, { "name": "OrdersToShipAddr", "parentDbSetName": "Address", "childDbSetName": "SalesOrderHeader", "childToParentName": "Address", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "ShipToAddressID" }] }])
            };
            opts.dbSetInfo.fieldInfos = ([{ "fieldName": "AddressID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "AddressLine1", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 60, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "AddressLine2", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 60, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "City", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 30, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "StateProvince", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CountryRegion", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "PostalCode", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 15, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 4, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CustomerAddresses", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "", "nested": null }]);
            _this = _super.call(this, opts) || this;
            return _this;
        }
        AddressDb.prototype.itemFactory = function (aspect) {
            return new AddressEntity(aspect);
        };
        AddressDb.prototype.findEntity = function (addressID) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        AddressDb.prototype.toString = function () {
            return 'AddressDb';
        };
        AddressDb.prototype.createReadAddressByIdsQuery = function (args) {
            var query = this.createQuery('ReadAddressByIds');
            query.params = args;
            return query;
        };
        AddressDb.prototype.createReadAddressQuery = function () {
            return this.createQuery('ReadAddress');
        };
        return AddressDb;
    }(dbMOD.DbSet));
    exports.AddressDb = AddressDb;
    var AddressInfoEntity = (function (_super) {
        __extends(AddressInfoEntity, _super);
        function AddressInfoEntity(aspect) {
            return _super.call(this, aspect) || this;
        }
        AddressInfoEntity.prototype.toString = function () {
            return 'AddressInfoEntity';
        };
        Object.defineProperty(AddressInfoEntity.prototype, "AddressID", {
            get: function () { return this._aspect._getFieldVal('AddressID'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressInfoEntity.prototype, "AddressLine1", {
            get: function () { return this._aspect._getFieldVal('AddressLine1'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressInfoEntity.prototype, "City", {
            get: function () { return this._aspect._getFieldVal('City'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressInfoEntity.prototype, "StateProvince", {
            get: function () { return this._aspect._getFieldVal('StateProvince'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressInfoEntity.prototype, "CountryRegion", {
            get: function () { return this._aspect._getFieldVal('CountryRegion'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressInfoEntity.prototype, "CustomerAddresses", {
            get: function () { return this._aspect._getNavFieldVal('CustomerAddresses'); },
            enumerable: false,
            configurable: true
        });
        return AddressInfoEntity;
    }(RIAPP.CollectionItem));
    var AddressInfoDb = (function (_super) {
        __extends(AddressInfoDb, _super);
        function AddressInfoDb(dbContext) {
            var _this = this;
            var opts = {
                dbContext: dbContext,
                dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "AddressInfo" },
                childAssoc: ([]),
                parentAssoc: ([{ "name": "CustAddrToAddress2", "parentDbSetName": "AddressInfo", "childDbSetName": "CustomerAddress", "childToParentName": "AddressInfo", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "AddressID" }] }])
            };
            opts.dbSetInfo.fieldInfos = ([{ "fieldName": "AddressID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "AddressLine1", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 200, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "City", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 30, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "StateProvince", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CountryRegion", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CustomerAddresses", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "", "nested": null }]);
            _this = _super.call(this, opts) || this;
            return _this;
        }
        AddressInfoDb.prototype.itemFactory = function (aspect) {
            return new AddressInfoEntity(aspect);
        };
        AddressInfoDb.prototype.findEntity = function (addressID) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        AddressInfoDb.prototype.toString = function () {
            return 'AddressInfoDb';
        };
        AddressInfoDb.prototype.createReadAddressInfoQuery = function () {
            return this.createQuery('ReadAddressInfo');
        };
        return AddressInfoDb;
    }(dbMOD.DbSet));
    exports.AddressInfoDb = AddressInfoDb;
    var CustomerEntity = (function (_super) {
        __extends(CustomerEntity, _super);
        function CustomerEntity(aspect) {
            var _this = _super.call(this, aspect) || this;
            _this._ComplexProp = null;
            return _this;
        }
        CustomerEntity.prototype.toString = function () {
            return 'CustomerEntity';
        };
        Object.defineProperty(CustomerEntity.prototype, "CustomerID", {
            get: function () { return this._aspect._getFieldVal('CustomerID'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerEntity.prototype, "NameStyle", {
            get: function () { return this._aspect._getFieldVal('NameStyle'); },
            set: function (v) { this._aspect._setFieldVal('NameStyle', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerEntity.prototype, "Title", {
            get: function () { return this._aspect._getFieldVal('Title'); },
            set: function (v) { this._aspect._setFieldVal('Title', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerEntity.prototype, "Suffix", {
            get: function () { return this._aspect._getFieldVal('Suffix'); },
            set: function (v) { this._aspect._setFieldVal('Suffix', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerEntity.prototype, "CompanyName", {
            get: function () { return this._aspect._getFieldVal('CompanyName'); },
            set: function (v) { this._aspect._setFieldVal('CompanyName', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerEntity.prototype, "SalesPerson", {
            get: function () { return this._aspect._getFieldVal('SalesPerson'); },
            set: function (v) { this._aspect._setFieldVal('SalesPerson', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerEntity.prototype, "PasswordHash", {
            get: function () { return this._aspect._getFieldVal('PasswordHash'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerEntity.prototype, "PasswordSalt", {
            get: function () { return this._aspect._getFieldVal('PasswordSalt'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerEntity.prototype, "rowguid", {
            get: function () { return this._aspect._getFieldVal('rowguid'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerEntity.prototype, "ModifiedDate", {
            get: function () { return this._aspect._getFieldVal('ModifiedDate'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerEntity.prototype, "ComplexProp", {
            get: function () { if (!this._ComplexProp) {
                this._ComplexProp = new Customer_ComplexProp('ComplexProp', this._aspect);
            } return this._ComplexProp; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerEntity.prototype, "AddressCount", {
            get: function () { return this._aspect._getFieldVal('AddressCount'); },
            set: function (v) { this._aspect._setFieldVal('AddressCount', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerEntity.prototype, "CustomerAddresses", {
            get: function () { return this._aspect._getNavFieldVal('CustomerAddresses'); },
            enumerable: false,
            configurable: true
        });
        return CustomerEntity;
    }(RIAPP.CollectionItem));
    var CustomerDb = (function (_super) {
        __extends(CustomerDb, _super);
        function CustomerDb(dbContext) {
            var _this = this;
            var opts = {
                dbContext: dbContext,
                dbSetInfo: { "fieldInfos": [], "enablePaging": true, "pageSize": 25, "dbSetName": "Customer" },
                childAssoc: ([]),
                parentAssoc: ([{ "name": "CustAddrToCustomer", "parentDbSetName": "Customer", "childDbSetName": "CustomerAddress", "childToParentName": "Customer", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "CustomerID", "childField": "CustomerID" }] }, { "name": "OrdersToCustomer", "parentDbSetName": "Customer", "childDbSetName": "SalesOrderHeader", "childToParentName": "Customer", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "CustomerID", "childField": "CustomerID" }] }])
            };
            opts.dbSetInfo.fieldInfos = ([{ "fieldName": "CustomerID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "NameStyle", "isPrimaryKey": 0, "dataType": 2, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Title", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Suffix", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 10, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CompanyName", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 128, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SalesPerson", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 256, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "PasswordHash", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 128, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "PasswordSalt", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 10, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 36, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 4, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ComplexProp", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 5, "dependentOn": "", "nested": [{ "fieldName": "FirstName", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "MiddleName", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "LastName", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Name", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 2, "dependentOn": "ComplexProp.FirstName,ComplexProp.MiddleName,ComplexProp.LastName", "nested": null }, { "fieldName": "ComplexProp", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 5, "dependentOn": "", "nested": [{ "fieldName": "EmailAddress", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "^[_a-z0-9-]\u002B(\\.[_a-z0-9-]\u002B)*@[a-z0-9-]\u002B(\\.[a-z0-9-]\u002B)*(\\.[a-z]{2,4})$", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Phone", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 25, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }] }] }, { "fieldName": "AddressCount", "isPrimaryKey": 0, "dataType": 3, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 6, "dependentOn": "", "nested": null }, { "fieldName": "CustomerAddresses", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "", "nested": null }]);
            _this = _super.call(this, opts) || this;
            return _this;
        }
        CustomerDb.prototype.itemFactory = function (aspect) {
            return new CustomerEntity(aspect);
        };
        CustomerDb.prototype.findEntity = function (customerID) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        CustomerDb.prototype.toString = function () {
            return 'CustomerDb';
        };
        CustomerDb.prototype.createReadCustomerQuery = function (args) {
            var query = this.createQuery('ReadCustomer');
            query.params = args;
            return query;
        };
        CustomerDb.prototype.defineComplexProp_NameField = function (getFunc) { this._defineCalculatedField('ComplexProp.Name', getFunc); };
        return CustomerDb;
    }(dbMOD.DbSet));
    exports.CustomerDb = CustomerDb;
    var CustomerAddressEntity = (function (_super) {
        __extends(CustomerAddressEntity, _super);
        function CustomerAddressEntity(aspect) {
            return _super.call(this, aspect) || this;
        }
        CustomerAddressEntity.prototype.toString = function () {
            return 'CustomerAddressEntity';
        };
        Object.defineProperty(CustomerAddressEntity.prototype, "CustomerID", {
            get: function () { return this._aspect._getFieldVal('CustomerID'); },
            set: function (v) { this._aspect._setFieldVal('CustomerID', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressEntity.prototype, "AddressID", {
            get: function () { return this._aspect._getFieldVal('AddressID'); },
            set: function (v) { this._aspect._setFieldVal('AddressID', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressEntity.prototype, "AddressType", {
            get: function () { return this._aspect._getFieldVal('AddressType'); },
            set: function (v) { this._aspect._setFieldVal('AddressType', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressEntity.prototype, "rowguid", {
            get: function () { return this._aspect._getFieldVal('rowguid'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressEntity.prototype, "ModifiedDate", {
            get: function () { return this._aspect._getFieldVal('ModifiedDate'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressEntity.prototype, "Customer", {
            get: function () { return this._aspect._getNavFieldVal('Customer'); },
            set: function (v) { this._aspect._setNavFieldVal('Customer', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressEntity.prototype, "Address", {
            get: function () { return this._aspect._getNavFieldVal('Address'); },
            set: function (v) { this._aspect._setNavFieldVal('Address', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressEntity.prototype, "AddressInfo", {
            get: function () { return this._aspect._getNavFieldVal('AddressInfo'); },
            set: function (v) { this._aspect._setNavFieldVal('AddressInfo', v); },
            enumerable: false,
            configurable: true
        });
        return CustomerAddressEntity;
    }(RIAPP.CollectionItem));
    var CustomerAddressDb = (function (_super) {
        __extends(CustomerAddressDb, _super);
        function CustomerAddressDb(dbContext) {
            var _this = this;
            var opts = {
                dbContext: dbContext,
                dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "CustomerAddress" },
                childAssoc: ([{ "name": "CustAddrToAddress", "parentDbSetName": "Address", "childDbSetName": "CustomerAddress", "childToParentName": "Address", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "AddressID" }] }, { "name": "CustAddrToAddress2", "parentDbSetName": "AddressInfo", "childDbSetName": "CustomerAddress", "childToParentName": "AddressInfo", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "AddressID" }] }, { "name": "CustAddrToCustomer", "parentDbSetName": "Customer", "childDbSetName": "CustomerAddress", "childToParentName": "Customer", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "CustomerID", "childField": "CustomerID" }] }]),
                parentAssoc: ([])
            };
            opts.dbSetInfo.fieldInfos = ([{ "fieldName": "CustomerID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "AddressID", "isPrimaryKey": 2, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "AddressType", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 16, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 4, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Customer", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "CustomerID", "nested": null }, { "fieldName": "Address", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "AddressID", "nested": null }, { "fieldName": "AddressInfo", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "AddressID", "nested": null }]);
            _this = _super.call(this, opts) || this;
            return _this;
        }
        CustomerAddressDb.prototype.itemFactory = function (aspect) {
            return new CustomerAddressEntity(aspect);
        };
        CustomerAddressDb.prototype.findEntity = function (customerID, addressID) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        CustomerAddressDb.prototype.toString = function () {
            return 'CustomerAddressDb';
        };
        CustomerAddressDb.prototype.createReadAddressForCustomersQuery = function (args) {
            var query = this.createQuery('ReadAddressForCustomers');
            query.params = args;
            return query;
        };
        CustomerAddressDb.prototype.createReadCustomerAddressQuery = function () {
            return this.createQuery('ReadCustomerAddress');
        };
        return CustomerAddressDb;
    }(dbMOD.DbSet));
    exports.CustomerAddressDb = CustomerAddressDb;
    var CustomerJSONEntity = (function (_super) {
        __extends(CustomerJSONEntity, _super);
        function CustomerJSONEntity(aspect) {
            return _super.call(this, aspect) || this;
        }
        CustomerJSONEntity.prototype.toString = function () {
            return 'CustomerJSONEntity';
        };
        Object.defineProperty(CustomerJSONEntity.prototype, "CustomerID", {
            get: function () { return this._aspect._getFieldVal('CustomerID'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerJSONEntity.prototype, "Data", {
            get: function () { return this._aspect._getFieldVal('Data'); },
            set: function (v) { this._aspect._setFieldVal('Data', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerJSONEntity.prototype, "rowguid", {
            get: function () { return this._aspect._getFieldVal('rowguid'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerJSONEntity.prototype, "Customer", {
            get: function () { return this._aspect._getCalcFieldVal('Customer'); },
            enumerable: false,
            configurable: true
        });
        return CustomerJSONEntity;
    }(RIAPP.CollectionItem));
    var CustomerJSONDb = (function (_super) {
        __extends(CustomerJSONDb, _super);
        function CustomerJSONDb(dbContext) {
            var _this = this;
            var opts = {
                dbContext: dbContext,
                dbSetInfo: { "fieldInfos": [], "enablePaging": true, "pageSize": 100, "dbSetName": "CustomerJSON" },
                childAssoc: ([]),
                parentAssoc: ([])
            };
            opts.dbSetInfo.fieldInfos = ([{ "fieldName": "CustomerID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Data", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": false, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 16, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 4, "dependentOn": "", "nested": null }, { "fieldName": "Customer", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 2, "dependentOn": "Data", "nested": null }]);
            _this = _super.call(this, opts) || this;
            return _this;
        }
        CustomerJSONDb.prototype.itemFactory = function (aspect) {
            return new CustomerJSONEntity(aspect);
        };
        CustomerJSONDb.prototype.findEntity = function (customerID) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        CustomerJSONDb.prototype.toString = function () {
            return 'CustomerJSONDb';
        };
        CustomerJSONDb.prototype.createReadCustomerJSONQuery = function () {
            return this.createQuery('ReadCustomerJSON');
        };
        CustomerJSONDb.prototype.defineCustomerField = function (getFunc) { this._defineCalculatedField('Customer', getFunc); };
        return CustomerJSONDb;
    }(dbMOD.DbSet));
    exports.CustomerJSONDb = CustomerJSONDb;
    var LookUpProductEntity = (function (_super) {
        __extends(LookUpProductEntity, _super);
        function LookUpProductEntity(aspect) {
            return _super.call(this, aspect) || this;
        }
        LookUpProductEntity.prototype.toString = function () {
            return 'LookUpProductEntity';
        };
        Object.defineProperty(LookUpProductEntity.prototype, "ProductID", {
            get: function () { return this._aspect._getFieldVal('ProductID'); },
            set: function (v) { this._aspect._setFieldVal('ProductID', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(LookUpProductEntity.prototype, "Name", {
            get: function () { return this._aspect._getFieldVal('Name'); },
            set: function (v) { this._aspect._setFieldVal('Name', v); },
            enumerable: false,
            configurable: true
        });
        return LookUpProductEntity;
    }(RIAPP.CollectionItem));
    var LookUpProductDb = (function (_super) {
        __extends(LookUpProductDb, _super);
        function LookUpProductDb(dbContext) {
            var _this = this;
            var opts = {
                dbContext: dbContext,
                dbSetInfo: { "fieldInfos": [], "enablePaging": true, "pageSize": 100, "dbSetName": "LookUpProduct" },
                childAssoc: ([]),
                parentAssoc: ([])
            };
            opts.dbSetInfo.fieldInfos = ([{ "fieldName": "ProductID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Name", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }]);
            _this = _super.call(this, opts) || this;
            return _this;
        }
        LookUpProductDb.prototype.itemFactory = function (aspect) {
            return new LookUpProductEntity(aspect);
        };
        LookUpProductDb.prototype.findEntity = function (productID) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        LookUpProductDb.prototype.toString = function () {
            return 'LookUpProductDb';
        };
        LookUpProductDb.prototype.createReadProductLookUpQuery = function () {
            return this.createQuery('ReadProductLookUp');
        };
        return LookUpProductDb;
    }(dbMOD.DbSet));
    exports.LookUpProductDb = LookUpProductDb;
    var ProductEntity = (function (_super) {
        __extends(ProductEntity, _super);
        function ProductEntity(aspect) {
            return _super.call(this, aspect) || this;
        }
        ProductEntity.prototype.toString = function () {
            return 'ProductEntity';
        };
        Object.defineProperty(ProductEntity.prototype, "ProductID", {
            get: function () { return this._aspect._getFieldVal('ProductID'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "Name", {
            get: function () { return this._aspect._getFieldVal('Name'); },
            set: function (v) { this._aspect._setFieldVal('Name', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "ProductNumber", {
            get: function () { return this._aspect._getFieldVal('ProductNumber'); },
            set: function (v) { this._aspect._setFieldVal('ProductNumber', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "Color", {
            get: function () { return this._aspect._getFieldVal('Color'); },
            set: function (v) { this._aspect._setFieldVal('Color', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "StandardCost", {
            get: function () { return this._aspect._getFieldVal('StandardCost'); },
            set: function (v) { this._aspect._setFieldVal('StandardCost', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "ListPrice", {
            get: function () { return this._aspect._getFieldVal('ListPrice'); },
            set: function (v) { this._aspect._setFieldVal('ListPrice', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "Size", {
            get: function () { return this._aspect._getFieldVal('Size'); },
            set: function (v) { this._aspect._setFieldVal('Size', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "Weight", {
            get: function () { return this._aspect._getFieldVal('Weight'); },
            set: function (v) { this._aspect._setFieldVal('Weight', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "ProductCategoryID", {
            get: function () { return this._aspect._getFieldVal('ProductCategoryID'); },
            set: function (v) { this._aspect._setFieldVal('ProductCategoryID', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "ProductModelID", {
            get: function () { return this._aspect._getFieldVal('ProductModelID'); },
            set: function (v) { this._aspect._setFieldVal('ProductModelID', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "SellStartDate", {
            get: function () { return this._aspect._getFieldVal('SellStartDate'); },
            set: function (v) { this._aspect._setFieldVal('SellStartDate', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "SellEndDate", {
            get: function () { return this._aspect._getFieldVal('SellEndDate'); },
            set: function (v) { this._aspect._setFieldVal('SellEndDate', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "DiscontinuedDate", {
            get: function () { return this._aspect._getFieldVal('DiscontinuedDate'); },
            set: function (v) { this._aspect._setFieldVal('DiscontinuedDate', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "rowguid", {
            get: function () { return this._aspect._getFieldVal('rowguid'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "ModifiedDate", {
            get: function () { return this._aspect._getFieldVal('ModifiedDate'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "IsActive", {
            get: function () { return this._aspect._getCalcFieldVal('IsActive'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "ThumbnailPhotoFileName", {
            get: function () { return this._aspect._getFieldVal('ThumbnailPhotoFileName'); },
            set: function (v) { this._aspect._setFieldVal('ThumbnailPhotoFileName', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductEntity.prototype, "SalesOrderDetails", {
            get: function () { return this._aspect._getNavFieldVal('SalesOrderDetails'); },
            enumerable: false,
            configurable: true
        });
        return ProductEntity;
    }(RIAPP.CollectionItem));
    var ProductDb = (function (_super) {
        __extends(ProductDb, _super);
        function ProductDb(dbContext) {
            var _this = this;
            var opts = {
                dbContext: dbContext,
                dbSetInfo: { "fieldInfos": [], "enablePaging": true, "pageSize": 25, "dbSetName": "Product" },
                childAssoc: ([]),
                parentAssoc: ([{ "name": "OrdDetailsToProduct", "parentDbSetName": "Product", "childDbSetName": "SalesOrderDetail", "childToParentName": "Product", "parentToChildrenName": "SalesOrderDetails", "onDeleteAction": 0, "fieldRels": [{ "parentField": "ProductID", "childField": "ProductID" }] }])
            };
            opts.dbSetInfo.fieldInfos = ([{ "fieldName": "ProductID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Name", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ProductNumber", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 25, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Color", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 15, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "StandardCost", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ListPrice", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "100,5000", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Size", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 5, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Weight", "isPrimaryKey": 0, "dataType": 4, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 5, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ProductCategoryID", "isPrimaryKey": 0, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ProductModelID", "isPrimaryKey": 0, "dataType": 3, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SellStartDate", "isPrimaryKey": 0, "dataType": 7, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "2000-01-01,2015-01-01", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SellEndDate", "isPrimaryKey": 0, "dataType": 7, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "DiscontinuedDate", "isPrimaryKey": 0, "dataType": 7, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 16, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 4, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "IsActive", "isPrimaryKey": 0, "dataType": 2, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 2, "dependentOn": "SellEndDate", "nested": null }, { "fieldName": "ThumbnailPhotoFileName", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 256, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SalesOrderDetails", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "", "nested": null }]);
            _this = _super.call(this, opts) || this;
            return _this;
        }
        ProductDb.prototype.itemFactory = function (aspect) {
            return new ProductEntity(aspect);
        };
        ProductDb.prototype.findEntity = function (productID) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        ProductDb.prototype.toString = function () {
            return 'ProductDb';
        };
        ProductDb.prototype.createReadProductByIdsQuery = function (args) {
            var query = this.createQuery('ReadProductByIds');
            query.params = args;
            return query;
        };
        ProductDb.prototype.createReadProductQuery = function (args) {
            var query = this.createQuery('ReadProduct');
            query.params = args;
            return query;
        };
        ProductDb.prototype.defineIsActiveField = function (getFunc) { this._defineCalculatedField('IsActive', getFunc); };
        return ProductDb;
    }(dbMOD.DbSet));
    exports.ProductDb = ProductDb;
    var ProductCategoryEntity = (function (_super) {
        __extends(ProductCategoryEntity, _super);
        function ProductCategoryEntity(aspect) {
            return _super.call(this, aspect) || this;
        }
        ProductCategoryEntity.prototype.toString = function () {
            return 'ProductCategoryEntity';
        };
        Object.defineProperty(ProductCategoryEntity.prototype, "ProductCategoryID", {
            get: function () { return this._aspect._getFieldVal('ProductCategoryID'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductCategoryEntity.prototype, "ParentProductCategoryID", {
            get: function () { return this._aspect._getFieldVal('ParentProductCategoryID'); },
            set: function (v) { this._aspect._setFieldVal('ParentProductCategoryID', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductCategoryEntity.prototype, "Name", {
            get: function () { return this._aspect._getFieldVal('Name'); },
            set: function (v) { this._aspect._setFieldVal('Name', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductCategoryEntity.prototype, "rowguid", {
            get: function () { return this._aspect._getFieldVal('rowguid'); },
            set: function (v) { this._aspect._setFieldVal('rowguid', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductCategoryEntity.prototype, "ModifiedDate", {
            get: function () { return this._aspect._getFieldVal('ModifiedDate'); },
            set: function (v) { this._aspect._setFieldVal('ModifiedDate', v); },
            enumerable: false,
            configurable: true
        });
        return ProductCategoryEntity;
    }(RIAPP.CollectionItem));
    var ProductCategoryDb = (function (_super) {
        __extends(ProductCategoryDb, _super);
        function ProductCategoryDb(dbContext) {
            var _this = this;
            var opts = {
                dbContext: dbContext,
                dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "ProductCategory" },
                childAssoc: ([]),
                parentAssoc: ([])
            };
            opts.dbSetInfo.fieldInfos = ([{ "fieldName": "ProductCategoryID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ParentProductCategoryID", "isPrimaryKey": 0, "dataType": 3, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Name", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 16, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 4, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }]);
            _this = _super.call(this, opts) || this;
            return _this;
        }
        ProductCategoryDb.prototype.itemFactory = function (aspect) {
            return new ProductCategoryEntity(aspect);
        };
        ProductCategoryDb.prototype.findEntity = function (productCategoryID) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        ProductCategoryDb.prototype.toString = function () {
            return 'ProductCategoryDb';
        };
        ProductCategoryDb.prototype.createReadProductCategoryQuery = function () {
            return this.createQuery('ReadProductCategory');
        };
        return ProductCategoryDb;
    }(dbMOD.DbSet));
    exports.ProductCategoryDb = ProductCategoryDb;
    var ProductModelEntity = (function (_super) {
        __extends(ProductModelEntity, _super);
        function ProductModelEntity(aspect) {
            return _super.call(this, aspect) || this;
        }
        ProductModelEntity.prototype.toString = function () {
            return 'ProductModelEntity';
        };
        Object.defineProperty(ProductModelEntity.prototype, "ProductModelID", {
            get: function () { return this._aspect._getFieldVal('ProductModelID'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductModelEntity.prototype, "Name", {
            get: function () { return this._aspect._getFieldVal('Name'); },
            set: function (v) { this._aspect._setFieldVal('Name', v); },
            enumerable: false,
            configurable: true
        });
        return ProductModelEntity;
    }(RIAPP.CollectionItem));
    var ProductModelDb = (function (_super) {
        __extends(ProductModelDb, _super);
        function ProductModelDb(dbContext) {
            var _this = this;
            var opts = {
                dbContext: dbContext,
                dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "ProductModel" },
                childAssoc: ([]),
                parentAssoc: ([])
            };
            opts.dbSetInfo.fieldInfos = ([{ "fieldName": "ProductModelID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Name", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }]);
            _this = _super.call(this, opts) || this;
            return _this;
        }
        ProductModelDb.prototype.itemFactory = function (aspect) {
            return new ProductModelEntity(aspect);
        };
        ProductModelDb.prototype.findEntity = function (productModelID) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        ProductModelDb.prototype.toString = function () {
            return 'ProductModelDb';
        };
        ProductModelDb.prototype.createReadProductModelQuery = function () {
            return this.createQuery('ReadProductModel');
        };
        return ProductModelDb;
    }(dbMOD.DbSet));
    exports.ProductModelDb = ProductModelDb;
    var SalesInfoEntity = (function (_super) {
        __extends(SalesInfoEntity, _super);
        function SalesInfoEntity(aspect) {
            return _super.call(this, aspect) || this;
        }
        SalesInfoEntity.prototype.toString = function () {
            return 'SalesInfoEntity';
        };
        Object.defineProperty(SalesInfoEntity.prototype, "SalesPerson", {
            get: function () { return this._aspect._getFieldVal('SalesPerson'); },
            set: function (v) { this._aspect._setFieldVal('SalesPerson', v); },
            enumerable: false,
            configurable: true
        });
        return SalesInfoEntity;
    }(RIAPP.CollectionItem));
    var SalesInfoDb = (function (_super) {
        __extends(SalesInfoDb, _super);
        function SalesInfoDb(dbContext) {
            var _this = this;
            var opts = {
                dbContext: dbContext,
                dbSetInfo: { "fieldInfos": [], "enablePaging": true, "pageSize": 100, "dbSetName": "SalesInfo" },
                childAssoc: ([]),
                parentAssoc: ([])
            };
            opts.dbSetInfo.fieldInfos = ([{ "fieldName": "SalesPerson", "isPrimaryKey": 1, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }]);
            _this = _super.call(this, opts) || this;
            return _this;
        }
        SalesInfoDb.prototype.itemFactory = function (aspect) {
            return new SalesInfoEntity(aspect);
        };
        SalesInfoDb.prototype.findEntity = function (salesPerson) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        SalesInfoDb.prototype.toString = function () {
            return 'SalesInfoDb';
        };
        SalesInfoDb.prototype.createReadSalesInfoQuery = function () {
            return this.createQuery('ReadSalesInfo');
        };
        return SalesInfoDb;
    }(dbMOD.DbSet));
    exports.SalesInfoDb = SalesInfoDb;
    var SalesOrderDetailEntity = (function (_super) {
        __extends(SalesOrderDetailEntity, _super);
        function SalesOrderDetailEntity(aspect) {
            return _super.call(this, aspect) || this;
        }
        SalesOrderDetailEntity.prototype.toString = function () {
            return 'SalesOrderDetailEntity';
        };
        Object.defineProperty(SalesOrderDetailEntity.prototype, "SalesOrderID", {
            get: function () { return this._aspect._getFieldVal('SalesOrderID'); },
            set: function (v) { this._aspect._setFieldVal('SalesOrderID', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderDetailEntity.prototype, "SalesOrderDetailID", {
            get: function () { return this._aspect._getFieldVal('SalesOrderDetailID'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderDetailEntity.prototype, "OrderQty", {
            get: function () { return this._aspect._getFieldVal('OrderQty'); },
            set: function (v) { this._aspect._setFieldVal('OrderQty', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderDetailEntity.prototype, "ProductID", {
            get: function () { return this._aspect._getFieldVal('ProductID'); },
            set: function (v) { this._aspect._setFieldVal('ProductID', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderDetailEntity.prototype, "UnitPrice", {
            get: function () { return this._aspect._getFieldVal('UnitPrice'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderDetailEntity.prototype, "UnitPriceDiscount", {
            get: function () { return this._aspect._getFieldVal('UnitPriceDiscount'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderDetailEntity.prototype, "LineTotal", {
            get: function () { return this._aspect._getFieldVal('LineTotal'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderDetailEntity.prototype, "rowguid", {
            get: function () { return this._aspect._getFieldVal('rowguid'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderDetailEntity.prototype, "ModifiedDate", {
            get: function () { return this._aspect._getFieldVal('ModifiedDate'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderDetailEntity.prototype, "SalesOrderHeader", {
            get: function () { return this._aspect._getNavFieldVal('SalesOrderHeader'); },
            set: function (v) { this._aspect._setNavFieldVal('SalesOrderHeader', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderDetailEntity.prototype, "Product", {
            get: function () { return this._aspect._getNavFieldVal('Product'); },
            set: function (v) { this._aspect._setNavFieldVal('Product', v); },
            enumerable: false,
            configurable: true
        });
        return SalesOrderDetailEntity;
    }(RIAPP.CollectionItem));
    var SalesOrderDetailDb = (function (_super) {
        __extends(SalesOrderDetailDb, _super);
        function SalesOrderDetailDb(dbContext) {
            var _this = this;
            var opts = {
                dbContext: dbContext,
                dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "SalesOrderDetail" },
                childAssoc: ([{ "name": "OrdDetailsToOrder", "parentDbSetName": "SalesOrderHeader", "childDbSetName": "SalesOrderDetail", "childToParentName": "SalesOrderHeader", "parentToChildrenName": "SalesOrderDetails", "onDeleteAction": 1, "fieldRels": [{ "parentField": "SalesOrderID", "childField": "SalesOrderID" }] }, { "name": "OrdDetailsToProduct", "parentDbSetName": "Product", "childDbSetName": "SalesOrderDetail", "childToParentName": "Product", "parentToChildrenName": "SalesOrderDetails", "onDeleteAction": 0, "fieldRels": [{ "parentField": "ProductID", "childField": "ProductID" }] }]),
                parentAssoc: ([])
            };
            opts.dbSetInfo.fieldInfos = ([{ "fieldName": "SalesOrderID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SalesOrderDetailID", "isPrimaryKey": 2, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "OrderQty", "isPrimaryKey": 0, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 2, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ProductID", "isPrimaryKey": 0, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "UnitPrice", "isPrimaryKey": 0, "dataType": 4, "isNullable": true, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "UnitPriceDiscount", "isPrimaryKey": 0, "dataType": 4, "isNullable": true, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "LineTotal", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 17, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 16, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SalesOrderHeader", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "SalesOrderID", "nested": null }, { "fieldName": "Product", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "ProductID", "nested": null }]);
            _this = _super.call(this, opts) || this;
            return _this;
        }
        SalesOrderDetailDb.prototype.itemFactory = function (aspect) {
            return new SalesOrderDetailEntity(aspect);
        };
        SalesOrderDetailDb.prototype.findEntity = function (salesOrderID, salesOrderDetailID) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        SalesOrderDetailDb.prototype.toString = function () {
            return 'SalesOrderDetailDb';
        };
        SalesOrderDetailDb.prototype.createReadSalesOrderDetailQuery = function () {
            return this.createQuery('ReadSalesOrderDetail');
        };
        return SalesOrderDetailDb;
    }(dbMOD.DbSet));
    exports.SalesOrderDetailDb = SalesOrderDetailDb;
    var SalesOrderHeaderEntity = (function (_super) {
        __extends(SalesOrderHeaderEntity, _super);
        function SalesOrderHeaderEntity(aspect) {
            return _super.call(this, aspect) || this;
        }
        SalesOrderHeaderEntity.prototype.toString = function () {
            return 'SalesOrderHeaderEntity';
        };
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "SalesOrderID", {
            get: function () { return this._aspect._getFieldVal('SalesOrderID'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "RevisionNumber", {
            get: function () { return this._aspect._getFieldVal('RevisionNumber'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "OrderDate", {
            get: function () { return this._aspect._getFieldVal('OrderDate'); },
            set: function (v) { this._aspect._setFieldVal('OrderDate', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "DueDate", {
            get: function () { return this._aspect._getFieldVal('DueDate'); },
            set: function (v) { this._aspect._setFieldVal('DueDate', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "ShipDate", {
            get: function () { return this._aspect._getFieldVal('ShipDate'); },
            set: function (v) { this._aspect._setFieldVal('ShipDate', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "Status", {
            get: function () { return this._aspect._getFieldVal('Status'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "OnlineOrderFlag", {
            get: function () { return this._aspect._getFieldVal('OnlineOrderFlag'); },
            set: function (v) { this._aspect._setFieldVal('OnlineOrderFlag', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "SalesOrderNumber", {
            get: function () { return this._aspect._getFieldVal('SalesOrderNumber'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "PurchaseOrderNumber", {
            get: function () { return this._aspect._getFieldVal('PurchaseOrderNumber'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "AccountNumber", {
            get: function () { return this._aspect._getFieldVal('AccountNumber'); },
            set: function (v) { this._aspect._setFieldVal('AccountNumber', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "CustomerID", {
            get: function () { return this._aspect._getFieldVal('CustomerID'); },
            set: function (v) { this._aspect._setFieldVal('CustomerID', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "ShipToAddressID", {
            get: function () { return this._aspect._getFieldVal('ShipToAddressID'); },
            set: function (v) { this._aspect._setFieldVal('ShipToAddressID', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "BillToAddressID", {
            get: function () { return this._aspect._getFieldVal('BillToAddressID'); },
            set: function (v) { this._aspect._setFieldVal('BillToAddressID', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "ShipMethod", {
            get: function () { return this._aspect._getFieldVal('ShipMethod'); },
            set: function (v) { this._aspect._setFieldVal('ShipMethod', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "CreditCardApprovalCode", {
            get: function () { return this._aspect._getFieldVal('CreditCardApprovalCode'); },
            set: function (v) { this._aspect._setFieldVal('CreditCardApprovalCode', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "SubTotal", {
            get: function () { return this._aspect._getFieldVal('SubTotal'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "TaxAmt", {
            get: function () { return this._aspect._getFieldVal('TaxAmt'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "Freight", {
            get: function () { return this._aspect._getFieldVal('Freight'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "TotalDue", {
            get: function () { return this._aspect._getFieldVal('TotalDue'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "Comment", {
            get: function () { return this._aspect._getFieldVal('Comment'); },
            set: function (v) { this._aspect._setFieldVal('Comment', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "rowguid", {
            get: function () { return this._aspect._getFieldVal('rowguid'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "ModifiedDate", {
            get: function () { return this._aspect._getFieldVal('ModifiedDate'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "SalesOrderDetails", {
            get: function () { return this._aspect._getNavFieldVal('SalesOrderDetails'); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "Customer", {
            get: function () { return this._aspect._getNavFieldVal('Customer'); },
            set: function (v) { this._aspect._setNavFieldVal('Customer', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "Address", {
            get: function () { return this._aspect._getNavFieldVal('Address'); },
            set: function (v) { this._aspect._setNavFieldVal('Address', v); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SalesOrderHeaderEntity.prototype, "Address1", {
            get: function () { return this._aspect._getNavFieldVal('Address1'); },
            set: function (v) { this._aspect._setNavFieldVal('Address1', v); },
            enumerable: false,
            configurable: true
        });
        return SalesOrderHeaderEntity;
    }(RIAPP.CollectionItem));
    var SalesOrderHeaderDb = (function (_super) {
        __extends(SalesOrderHeaderDb, _super);
        function SalesOrderHeaderDb(dbContext) {
            var _this = this;
            var opts = {
                dbContext: dbContext,
                dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "SalesOrderHeader" },
                childAssoc: ([{ "name": "OrdersToBillAddr", "parentDbSetName": "Address", "childDbSetName": "SalesOrderHeader", "childToParentName": "Address1", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "BillToAddressID" }] }, { "name": "OrdersToCustomer", "parentDbSetName": "Customer", "childDbSetName": "SalesOrderHeader", "childToParentName": "Customer", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "CustomerID", "childField": "CustomerID" }] }, { "name": "OrdersToShipAddr", "parentDbSetName": "Address", "childDbSetName": "SalesOrderHeader", "childToParentName": "Address", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "ShipToAddressID" }] }]),
                parentAssoc: ([{ "name": "OrdDetailsToOrder", "parentDbSetName": "SalesOrderHeader", "childDbSetName": "SalesOrderDetail", "childToParentName": "SalesOrderHeader", "parentToChildrenName": "SalesOrderDetails", "onDeleteAction": 1, "fieldRels": [{ "parentField": "SalesOrderID", "childField": "SalesOrderID" }] }])
            };
            opts.dbSetInfo.fieldInfos = ([{ "fieldName": "SalesOrderID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "RevisionNumber", "isPrimaryKey": 0, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "OrderDate", "isPrimaryKey": 0, "dataType": 7, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "DueDate", "isPrimaryKey": 0, "dataType": 7, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ShipDate", "isPrimaryKey": 0, "dataType": 7, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Status", "isPrimaryKey": 0, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "OnlineOrderFlag", "isPrimaryKey": 0, "dataType": 2, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SalesOrderNumber", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 25, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "PurchaseOrderNumber", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 25, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "AccountNumber", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 15, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CustomerID", "isPrimaryKey": 0, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ShipToAddressID", "isPrimaryKey": 0, "dataType": 3, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "BillToAddressID", "isPrimaryKey": 0, "dataType": 3, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ShipMethod", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CreditCardApprovalCode", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 15, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SubTotal", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "TaxAmt", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Freight", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "TotalDue", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Comment", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 0, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 16, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SalesOrderDetails", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "", "nested": null }, { "fieldName": "Customer", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "CustomerID", "nested": null }, { "fieldName": "Address", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "ShipToAddressID", "nested": null }, { "fieldName": "Address1", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "BillToAddressID", "nested": null }]);
            _this = _super.call(this, opts) || this;
            return _this;
        }
        SalesOrderHeaderDb.prototype.itemFactory = function (aspect) {
            return new SalesOrderHeaderEntity(aspect);
        };
        SalesOrderHeaderDb.prototype.findEntity = function (salesOrderID) {
            return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
        };
        SalesOrderHeaderDb.prototype.toString = function () {
            return 'SalesOrderHeaderDb';
        };
        SalesOrderHeaderDb.prototype.createReadSalesOrderHeaderQuery = function () {
            return this.createQuery('ReadSalesOrderHeader');
        };
        return SalesOrderHeaderDb;
    }(dbMOD.DbSet));
    exports.SalesOrderHeaderDb = SalesOrderHeaderDb;
    var DbSets = (function (_super) {
        __extends(DbSets, _super);
        function DbSets(dbContext) {
            var _this = _super.call(this, dbContext) || this;
            _this._createDbSet("Address", AddressDb);
            _this._createDbSet("AddressInfo", AddressInfoDb);
            _this._createDbSet("Customer", CustomerDb);
            _this._createDbSet("CustomerAddress", CustomerAddressDb);
            _this._createDbSet("CustomerJSON", CustomerJSONDb);
            _this._createDbSet("LookUpProduct", LookUpProductDb);
            _this._createDbSet("Product", ProductDb);
            _this._createDbSet("ProductCategory", ProductCategoryDb);
            _this._createDbSet("ProductModel", ProductModelDb);
            _this._createDbSet("SalesInfo", SalesInfoDb);
            _this._createDbSet("SalesOrderDetail", SalesOrderDetailDb);
            _this._createDbSet("SalesOrderHeader", SalesOrderHeaderDb);
            return _this;
        }
        Object.defineProperty(DbSets.prototype, "Address", {
            get: function () { return this.getDbSet("Address"); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSets.prototype, "AddressInfo", {
            get: function () { return this.getDbSet("AddressInfo"); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSets.prototype, "Customer", {
            get: function () { return this.getDbSet("Customer"); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSets.prototype, "CustomerAddress", {
            get: function () { return this.getDbSet("CustomerAddress"); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSets.prototype, "CustomerJSON", {
            get: function () { return this.getDbSet("CustomerJSON"); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSets.prototype, "LookUpProduct", {
            get: function () { return this.getDbSet("LookUpProduct"); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSets.prototype, "Product", {
            get: function () { return this.getDbSet("Product"); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSets.prototype, "ProductCategory", {
            get: function () { return this.getDbSet("ProductCategory"); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSets.prototype, "ProductModel", {
            get: function () { return this.getDbSet("ProductModel"); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSets.prototype, "SalesInfo", {
            get: function () { return this.getDbSet("SalesInfo"); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSets.prototype, "SalesOrderDetail", {
            get: function () { return this.getDbSet("SalesOrderDetail"); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSets.prototype, "SalesOrderHeader", {
            get: function () { return this.getDbSet("SalesOrderHeader"); },
            enumerable: false,
            configurable: true
        });
        return DbSets;
    }(dbMOD.DbSets));
    exports.DbSets = DbSets;
    var DbContext = (function (_super) {
        __extends(DbContext, _super);
        function DbContext() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DbContext.prototype._createDbSets = function () {
            return new DbSets(this);
        };
        DbContext.prototype._createAssociations = function () {
            return [{ "name": "CustAddrToAddress", "parentDbSetName": "Address", "childDbSetName": "CustomerAddress", "childToParentName": "Address", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "AddressID" }] }, { "name": "CustAddrToAddress2", "parentDbSetName": "AddressInfo", "childDbSetName": "CustomerAddress", "childToParentName": "AddressInfo", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "AddressID" }] }, { "name": "CustAddrToCustomer", "parentDbSetName": "Customer", "childDbSetName": "CustomerAddress", "childToParentName": "Customer", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "CustomerID", "childField": "CustomerID" }] }, { "name": "OrdDetailsToOrder", "parentDbSetName": "SalesOrderHeader", "childDbSetName": "SalesOrderDetail", "childToParentName": "SalesOrderHeader", "parentToChildrenName": "SalesOrderDetails", "onDeleteAction": 1, "fieldRels": [{ "parentField": "SalesOrderID", "childField": "SalesOrderID" }] }, { "name": "OrdDetailsToProduct", "parentDbSetName": "Product", "childDbSetName": "SalesOrderDetail", "childToParentName": "Product", "parentToChildrenName": "SalesOrderDetails", "onDeleteAction": 0, "fieldRels": [{ "parentField": "ProductID", "childField": "ProductID" }] }, { "name": "OrdersToBillAddr", "parentDbSetName": "Address", "childDbSetName": "SalesOrderHeader", "childToParentName": "Address1", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "BillToAddressID" }] }, { "name": "OrdersToCustomer", "parentDbSetName": "Customer", "childDbSetName": "SalesOrderHeader", "childToParentName": "Customer", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "CustomerID", "childField": "CustomerID" }] }, { "name": "OrdersToShipAddr", "parentDbSetName": "Address", "childDbSetName": "SalesOrderHeader", "childToParentName": "Address", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "ShipToAddressID" }] }];
        };
        DbContext.prototype._createMethods = function () {
            return [{ "methodName": "ReadAddress", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadAddressByIds", "parameters": [{ "name": "addressIDs", "dataType": 3, "isArray": true, "isNullable": false, "dateConversion": 0, "ordinal": 0 }], "methodResult": true, "isQuery": true }, { "methodName": "ReadAddressForCustomers", "parameters": [{ "name": "custIDs", "dataType": 3, "isArray": true, "isNullable": false, "dateConversion": 0, "ordinal": 0 }], "methodResult": true, "isQuery": true }, { "methodName": "ReadAddressInfo", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadCustomer", "parameters": [{ "name": "includeNav", "dataType": 2, "isArray": false, "isNullable": true, "dateConversion": 0, "ordinal": 0 }], "methodResult": true, "isQuery": true }, { "methodName": "ReadCustomerAddress", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadCustomerJSON", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadProduct", "parameters": [{ "name": "param1", "dataType": 3, "isArray": true, "isNullable": false, "dateConversion": 0, "ordinal": 0 }, { "name": "param2", "dataType": 1, "isArray": false, "isNullable": false, "dateConversion": 0, "ordinal": 1 }], "methodResult": true, "isQuery": true }, { "methodName": "ReadProductByIds", "parameters": [{ "name": "productIDs", "dataType": 3, "isArray": true, "isNullable": false, "dateConversion": 0, "ordinal": 0 }], "methodResult": true, "isQuery": true }, { "methodName": "ReadProductCategory", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadProductLookUp", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadProductModel", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadSalesInfo", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadSalesOrderDetail", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadSalesOrderHeader", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "GetClassifiers", "parameters": [], "methodResult": true, "isQuery": false }, { "methodName": "TestComplexInvoke", "parameters": [{ "name": "info", "dataType": 0, "isArray": false, "isNullable": false, "dateConversion": 0, "ordinal": 0 }, { "name": "keys", "dataType": 0, "isArray": true, "isNullable": false, "dateConversion": 0, "ordinal": 1 }], "methodResult": true, "isQuery": false }, { "methodName": "TestInvoke", "parameters": [{ "name": "param1", "dataType": 10, "isArray": false, "isNullable": false, "dateConversion": 0, "ordinal": 0 }, { "name": "param2", "dataType": 1, "isArray": false, "isNullable": false, "dateConversion": 0, "ordinal": 1 }], "methodResult": true, "isQuery": false }];
        };
        return DbContext;
    }(dbMOD.DbContext));
    exports.DbContext = DbContext;
});
define("addressVM", ["require", "exports", "jriapp"], function (require, exports, RIAPP) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AddressVM = void 0;
    var AddressVM = (function (_super) {
        __extends(AddressVM, _super);
        function AddressVM(orderVM) {
            var _this = _super.call(this, orderVM.app) || this;
            var self = _this;
            _this._orderVM = orderVM;
            _this._dbSet = _this.dbSets.Address;
            _this._orderVM.dbSet.addOnFill(function (_s, args) {
                self.loadAddressesForOrders(args.items);
            }, self.uniqueID);
            _this._dbSet.objEvents.onProp('currentItem', function (_s, args) {
                self._onCurrentChanged();
            }, self.uniqueID);
            return _this;
        }
        AddressVM.prototype._onCurrentChanged = function () {
            this.objEvents.raiseProp('currentItem');
        };
        AddressVM.prototype.loadAddressesForOrders = function (orders) {
            var ids1 = orders.map(function (item) {
                return item.ShipToAddressID;
            });
            var ids2 = orders.map(function (item) {
                return item.BillToAddressID;
            });
            var ids = ids1.concat(ids2).filter(function (id) {
                return id !== null;
            });
            return this.load(RIAPP.Utils.arr.distinct(ids), false);
        };
        AddressVM.prototype.load = function (ids, isClearTable) {
            var query = this.dbSet.createReadAddressByIdsQuery({ addressIDs: ids });
            query.isClearPrevData = isClearTable;
            return query.load();
        };
        AddressVM.prototype.clear = function () {
            this.dbSet.clear();
        };
        AddressVM.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            if (!!this._dbSet) {
                this._dbSet.objEvents.offNS(this.uniqueID);
            }
            this._customerDbSet.objEvents.offNS(this.uniqueID);
            this._orderVM.objEvents.offNS(this.uniqueID);
            this._orderVM = null;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(AddressVM.prototype, "_customerDbSet", {
            get: function () { return this._orderVM.customerVM.dbSet; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressVM.prototype, "dbContext", {
            get: function () { return this.app.dbContext; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressVM.prototype, "dbSets", {
            get: function () { return this.dbContext.dbSets; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressVM.prototype, "currentItem", {
            get: function () { return this._dbSet.currentItem; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressVM.prototype, "dbSet", {
            get: function () { return this._dbSet; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressVM.prototype, "orderVM", {
            get: function () { return this._orderVM; },
            enumerable: false,
            configurable: true
        });
        return AddressVM;
    }(RIAPP.ViewModel));
    exports.AddressVM = AddressVM;
});
define("productVM", ["require", "exports", "jriapp"], function (require, exports, RIAPP) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProductVM = void 0;
    var ProductVM = (function (_super) {
        __extends(ProductVM, _super);
        function ProductVM(orderDetailVM) {
            var _this = _super.call(this, orderDetailVM.app) || this;
            var self = _this;
            _this._orderDetailVM = orderDetailVM;
            _this._dbSet = _this.dbSets.Product;
            _this._customerDbSet.addOnCleared(function (s, a) {
                self.clear();
            }, self.uniqueID);
            _this._orderDetailVM.dbSet.addOnFill(function (_s, args) {
                self.loadProductsForOrderDetails(args.items);
            }, self.uniqueID);
            _this._dbSet.objEvents.onProp('currentItem', function (_s, args) {
                self._onCurrentChanged();
            }, self.uniqueID);
            return _this;
        }
        ProductVM.prototype._onCurrentChanged = function () {
            this.objEvents.raiseProp('currentItem');
        };
        ProductVM.prototype.clear = function () {
            this.dbSet.clear();
        };
        ProductVM.prototype.loadProductsForOrderDetails = function (orderDetails) {
            var ids = orderDetails.map(function (item) {
                return item.ProductID;
            }).filter(function (id) {
                return id !== null;
            });
            return this.load(RIAPP.Utils.arr.distinct(ids), false);
        };
        ProductVM.prototype.load = function (ids, isClearTable) {
            var query = this.dbSet.createReadProductByIdsQuery({ productIDs: ids });
            query.isClearPrevData = isClearTable;
            return query.load();
        };
        ProductVM.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            if (!!this._dbSet) {
                this._dbSet.objEvents.offNS(this.uniqueID);
            }
            this._customerDbSet.objEvents.offNS(this.uniqueID);
            this._orderDetailVM.objEvents.offNS(this.uniqueID);
            this._orderDetailVM = null;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(ProductVM.prototype, "_customerDbSet", {
            get: function () { return this._orderDetailVM.orderVM.customerVM.dbSet; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductVM.prototype, "dbContext", {
            get: function () { return this.app.dbContext; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductVM.prototype, "dbSets", {
            get: function () { return this.dbContext.dbSets; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductVM.prototype, "currentItem", {
            get: function () { return this._dbSet.currentItem; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ProductVM.prototype, "dbSet", {
            get: function () { return this._dbSet; },
            enumerable: false,
            configurable: true
        });
        return ProductVM;
    }(RIAPP.ViewModel));
    exports.ProductVM = ProductVM;
});
define("orderDetVM", ["require", "exports", "jriapp", "productVM"], function (require, exports, RIAPP, productVM_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OrderDetailVM = void 0;
    var utils = RIAPP.Utils;
    var OrderDetailVM = (function (_super) {
        __extends(OrderDetailVM, _super);
        function OrderDetailVM(orderVM) {
            var _this = _super.call(this, orderVM.app) || this;
            var self = _this;
            _this._dbSet = _this.dbSets.SalesOrderDetail;
            _this._orderVM = orderVM;
            _this._currentOrder = null;
            _this._orderVM.dbSet.addOnCleared(function (s, a) {
                self.clear();
            }, self.uniqueID);
            _this._dbSet.objEvents.onProp('currentItem', function (_s, args) {
                self._onCurrentChanged();
            }, self.uniqueID);
            _this._productVM = new productVM_1.ProductVM(_this);
            return _this;
        }
        OrderDetailVM.prototype._onCurrentChanged = function () {
            this.objEvents.raiseProp('currentItem');
        };
        OrderDetailVM.prototype.load = function () {
            this.clear();
            if (!this.currentOrder || this.currentOrder._aspect.isNew) {
                var deferred = utils.async.createDeferred();
                deferred.reject();
                return deferred.promise();
            }
            var query = this.dbSet.createQuery('ReadSalesOrderDetail');
            query.where('SalesOrderID', 0, [this.currentOrder.SalesOrderID]);
            query.orderBy('SalesOrderDetailID');
            return query.load();
        };
        OrderDetailVM.prototype.clear = function () {
            this.dbSet.clear();
        };
        OrderDetailVM.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            if (!!this._dbSet) {
                this._dbSet.objEvents.offNS(this.uniqueID);
            }
            this.currentOrder = null;
            this._productVM.dispose();
            this._orderVM.dbSet.objEvents.offNS(this.uniqueID);
            this._orderVM.objEvents.offNS(this.uniqueID);
            this._orderVM = null;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(OrderDetailVM.prototype, "dbContext", {
            get: function () { return this.app.dbContext; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderDetailVM.prototype, "dbSets", {
            get: function () { return this.dbContext.dbSets; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderDetailVM.prototype, "currentItem", {
            get: function () { return this._dbSet.currentItem; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderDetailVM.prototype, "dbSet", {
            get: function () { return this._dbSet; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderDetailVM.prototype, "currentOrder", {
            get: function () { return this._currentOrder; },
            set: function (v) {
                if (v !== this._currentOrder) {
                    this._currentOrder = v;
                    this.objEvents.raiseProp('currentOrder');
                    this.load();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderDetailVM.prototype, "orderVM", {
            get: function () { return this._orderVM; },
            enumerable: false,
            configurable: true
        });
        return OrderDetailVM;
    }(RIAPP.ViewModel));
    exports.OrderDetailVM = OrderDetailVM;
});
define("orderVM", ["require", "exports", "jriapp", "domainModel", "gridEvents", "addressVM", "orderDetVM"], function (require, exports, RIAPP, DEMODB, gridEvents_1, addressVM_1, orderDetVM_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OrderVM = void 0;
    var utils = RIAPP.Utils, dates = utils.dates;
    var OrderVM = (function (_super) {
        __extends(OrderVM, _super);
        function OrderVM(customerVM) {
            var _this = _super.call(this, customerVM.app) || this;
            var self = _this;
            _this._customerVM = customerVM;
            _this._dbSet = _this.dbSets.SalesOrderHeader;
            _this._currentCustomer = null;
            _this._gridEvents = new gridEvents_1.OrderGridEvents(_this);
            _this._selectedTabIndex = null;
            _this._orderStatuses = new DEMODB.KeyValDictionary();
            _this._orderStatuses.fillItems([{ key: 0, val: 'New Order' }, { key: 1, val: 'Status 1' },
                { key: 2, val: 'Status 2' }, { key: 3, val: 'Status 3' },
                { key: 4, val: 'Status 4' }, { key: 5, val: 'Completed Order' }], true);
            _this._tabs = null;
            _this._customerVM.objEvents.on('row_expanded', function (_s, args) {
                if (args.isExpanded) {
                    self.currentCustomer = args.customer;
                }
                else {
                    self.currentCustomer = null;
                }
            }, self.uniqueID);
            _this._dbSet.objEvents.onProp('currentItem', function (_s, args) {
                self._onCurrentChanged();
            }, self.uniqueID);
            _this._dbSet.addOnItemDeleting(function (_s, args) {
                if (!confirm('Are you sure that you want to delete the order?'))
                    args.isCancel = true;
            }, self.uniqueID);
            _this._dbSet.addOnItemAdded(function (_s, args) {
                var item = args.item;
                item.Customer = self.currentCustomer;
                item.OrderDate = new Date();
                item.DueDate = dates.add(new Date(), 7, "day");
                item.OnlineOrderFlag = false;
            }, self.uniqueID);
            _this._addNewCommand = new RIAPP.Command(function () {
                self._dbSet.addNew();
            });
            _this._addressVM = new addressVM_1.AddressVM(_this);
            _this._orderDetailVM = new orderDetVM_1.OrderDetailVM(_this);
            return _this;
        }
        OrderVM.prototype.addTabs = function (tabs) {
            this._tabs = tabs;
        };
        OrderVM.prototype.removeTabs = function () {
            this._tabs = null;
        };
        OrderVM.prototype.onTabSelected = function (tabs) {
            this._selectedTabIndex = tabs.tabIndex;
            this.objEvents.raiseProp('selectedTabIndex');
            if (this._selectedTabIndex == 2) {
                this._orderDetailVM.currentOrder = this.dbSet.currentItem;
            }
        };
        OrderVM.prototype._onGridPageChanged = function () {
        };
        OrderVM.prototype._onGridRowSelected = function (item) {
        };
        OrderVM.prototype._onGridRowExpanded = function (item) {
            this.objEvents.raise('row_expanded', { order: item, isExpanded: true });
            if (!!this._tabs)
                this.onTabSelected(this._tabs);
        };
        OrderVM.prototype._onGridRowCollapsed = function (item) {
            this.objEvents.raise('row_expanded', { order: item, isExpanded: false });
        };
        OrderVM.prototype._onCurrentChanged = function () {
            this.objEvents.raiseProp('currentItem');
        };
        OrderVM.prototype.clear = function () {
            this.dbSet.clear();
        };
        OrderVM.prototype.load = function () {
            this.clear();
            if (!this.currentCustomer || this.currentCustomer._aspect.isNew) {
                var deferred = utils.async.createDeferred();
                deferred.reject();
                return deferred.promise();
            }
            var query = this.dbSet.createReadSalesOrderHeaderQuery();
            query.where('CustomerID', 0, [this.currentCustomer.CustomerID]);
            query.orderBy('OrderDate').thenBy('SalesOrderID');
            return query.load();
        };
        OrderVM.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            if (!!this._dbSet) {
                this._dbSet.objEvents.offNS(this.uniqueID);
            }
            this.currentCustomer = null;
            this._gridEvents.dispose();
            this._gridEvents = null;
            this._addressVM.dispose();
            this._addressVM = null;
            this._orderDetailVM.dispose();
            this._orderDetailVM = null;
            this._customerVM = null;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(OrderVM.prototype, "dbContext", {
            get: function () { return this.app.dbContext; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderVM.prototype, "dbSets", {
            get: function () { return this.dbContext.dbSets; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderVM.prototype, "currentItem", {
            get: function () { return this._dbSet.currentItem; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderVM.prototype, "dbSet", {
            get: function () { return this._dbSet; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderVM.prototype, "addNewCommand", {
            get: function () { return this._addNewCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderVM.prototype, "orderStatuses", {
            get: function () { return this._orderStatuses; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderVM.prototype, "currentCustomer", {
            get: function () { return this._currentCustomer; },
            set: function (v) {
                if (v !== this._currentCustomer) {
                    this._currentCustomer = v;
                    this.objEvents.raiseProp('currentCustomer');
                    this.load();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderVM.prototype, "customerVM", {
            get: function () { return this._customerVM; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderVM.prototype, "orderDetailsVM", {
            get: function () { return this._orderDetailVM; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderVM.prototype, "selectedTabIndex", {
            get: function () { return this._selectedTabIndex; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderVM.prototype, "tabsEvents", {
            get: function () { return this; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(OrderVM.prototype, "gridEvents", {
            get: function () { return this._gridEvents; },
            enumerable: false,
            configurable: true
        });
        return OrderVM;
    }(RIAPP.ViewModel));
    exports.OrderVM = OrderVM;
});
define("gridEvents", ["require", "exports", "jriapp"], function (require, exports, RIAPP) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OrderGridEvents = exports.CustomerGridEvents = void 0;
    var CustomerGridEvents = (function (_super) {
        __extends(CustomerGridEvents, _super);
        function CustomerGridEvents(customerVM) {
            var _this = _super.call(this) || this;
            _this._customerVM = customerVM;
            _this._doFocus = null;
            return _this;
        }
        CustomerGridEvents.prototype.regFocusGridFunc = function (doFocus) {
            this._doFocus = doFocus;
        };
        CustomerGridEvents.prototype.onDataPageChanged = function () {
            this._customerVM._onGridPageChanged();
        };
        CustomerGridEvents.prototype.onRowSelected = function (item) {
            this._customerVM._onGridRowSelected(item);
        };
        CustomerGridEvents.prototype.onRowExpanded = function (item) {
            this._customerVM._onGridRowExpanded(item);
        };
        CustomerGridEvents.prototype.onRowCollapsed = function (item) {
            this._customerVM._onGridRowCollapsed(item);
        };
        CustomerGridEvents.prototype.focusGrid = function () {
            if (!!this._doFocus)
                this._doFocus();
        };
        CustomerGridEvents.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            this._doFocus = null;
            _super.prototype.dispose.call(this);
        };
        return CustomerGridEvents;
    }(RIAPP.BaseObject));
    exports.CustomerGridEvents = CustomerGridEvents;
    var OrderGridEvents = (function (_super) {
        __extends(OrderGridEvents, _super);
        function OrderGridEvents(orderVM) {
            var _this = _super.call(this) || this;
            _this._orderVM = orderVM;
            _this._doFocus = null;
            return _this;
        }
        OrderGridEvents.prototype.regFocusGridFunc = function (doFocus) {
            this._doFocus = doFocus;
        };
        OrderGridEvents.prototype.onDataPageChanged = function () {
            this._orderVM._onGridPageChanged();
        };
        OrderGridEvents.prototype.onRowSelected = function (item) {
            this._orderVM._onGridRowSelected(item);
        };
        OrderGridEvents.prototype.onRowExpanded = function (item) {
            this._orderVM._onGridRowExpanded(item);
        };
        OrderGridEvents.prototype.onRowCollapsed = function (item) {
            this._orderVM._onGridRowCollapsed(item);
        };
        OrderGridEvents.prototype.focusGrid = function () {
            if (!!this._doFocus)
                this._doFocus();
        };
        OrderGridEvents.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            this._doFocus = null;
            _super.prototype.dispose.call(this);
        };
        return OrderGridEvents;
    }(RIAPP.BaseObject));
    exports.OrderGridEvents = OrderGridEvents;
});
define("animation", ["require", "exports", "jriapp"], function (require, exports, RIAPP) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initModule = exports.SlideAnimation = exports.FadeAnimation = void 0;
    var utils = RIAPP.Utils;
    var FadeAnimation = (function (_super) {
        __extends(FadeAnimation, _super);
        function FadeAnimation(isAnimateFirstShow, duration) {
            var _this = _super.call(this) || this;
            _this._$animatedEl = null;
            _this._effect = 'fade';
            _this._duration = !!duration ? duration : 1000;
            return _this;
        }
        FadeAnimation.prototype.beforeShow = function (template, isFirstShow) {
        };
        FadeAnimation.prototype.show = function (template, isFirstShow) {
            this.stop();
            this._$animatedEl = $(template.el.parentElement);
            this._$animatedEl.hide();
            var deffered = utils.async.createDeferred();
            this._$animatedEl.show(this._effect, this._duration, function () {
                deffered.resolve();
            });
            return deffered.promise();
        };
        FadeAnimation.prototype.beforeHide = function (template) {
            this.stop();
            this._$animatedEl = $(template.el.parentElement);
        };
        FadeAnimation.prototype.hide = function (template) {
            var deffered = utils.async.createDeferred();
            this._$animatedEl.hide(this._effect, this._duration, function () {
                deffered.resolve();
            });
            return deffered.promise();
        };
        FadeAnimation.prototype.stop = function () {
            if (!!this._$animatedEl)
                this._$animatedEl.finish();
        };
        Object.defineProperty(FadeAnimation.prototype, "isAnimateFirstShow", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        FadeAnimation.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            try {
                this.stop();
                this._$animatedEl = null;
            }
            finally {
                _super.prototype.dispose.call(this);
            }
        };
        return FadeAnimation;
    }(RIAPP.BaseObject));
    exports.FadeAnimation = FadeAnimation;
    var SlideAnimation = (function (_super) {
        __extends(SlideAnimation, _super);
        function SlideAnimation(isAnimateFirstShow, duration) {
            var _this = _super.call(this) || this;
            _this._$animatedEl = null;
            _this._effect = 'slide';
            _this._duration = !!duration ? duration : 1000;
            return _this;
        }
        SlideAnimation.prototype.beforeShow = function (template, isFirstShow) {
        };
        SlideAnimation.prototype.show = function (template, isFirstShow) {
            this.stop();
            this._$animatedEl = $(template.el.parentElement);
            var deffered = utils.async.createDeferred();
            this._$animatedEl.show(this._effect, this._duration, function () {
                deffered.resolve();
            });
            return deffered.promise();
        };
        SlideAnimation.prototype.beforeHide = function (template) {
            this.stop();
            this._$animatedEl = $(template.el.parentElement);
        };
        SlideAnimation.prototype.hide = function (template) {
            var deffered = utils.async.createDeferred();
            this._$animatedEl.hide(this._effect, this._duration, function () {
                deffered.resolve();
            });
            return deffered.promise();
        };
        SlideAnimation.prototype.stop = function () {
            if (!!this._$animatedEl)
                this._$animatedEl.finish();
        };
        Object.defineProperty(SlideAnimation.prototype, "isAnimateFirstShow", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        SlideAnimation.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            try {
                this.stop();
                this._$animatedEl = null;
            }
            finally {
                _super.prototype.dispose.call(this);
            }
        };
        return SlideAnimation;
    }(RIAPP.BaseObject));
    exports.SlideAnimation = SlideAnimation;
    function initModule(app) {
        return {};
    }
    exports.initModule = initModule;
});
define("routes", ["require", "exports", "jriapp", "animation"], function (require, exports, RIAPP, ANIMATION) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AddressRoute = exports.CustDetRoute = exports.MainRoute = void 0;
    var MainRoute = (function (_super) {
        __extends(MainRoute, _super);
        function MainRoute() {
            var _this = _super.call(this) || this;
            _this._custTemplName = 'custGroup.SPAcustTemplate';
            _this._custDetTemplName = 'custGroup.SPAcustDetailTemplate';
            _this._viewName = _this._custTemplName;
            _this._animation = new ANIMATION.FadeAnimation(true);
            return _this;
        }
        MainRoute.prototype.goToAllCust = function () {
            this.viewName = this.custTemplName;
        };
        MainRoute.prototype.goToCustDet = function () {
            this.viewName = this.custDetTemplName;
        };
        MainRoute.prototype.reset = function () {
            this.viewName = this._custTemplName;
        };
        Object.defineProperty(MainRoute.prototype, "animation", {
            get: function () { return this._animation; },
            set: function (v) {
                if (v !== this._animation) {
                    this._animation = v;
                    this.objEvents.raiseProp('animation');
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MainRoute.prototype, "viewName", {
            get: function () { return this._viewName; },
            set: function (v) {
                if (v !== this._viewName) {
                    this._viewName = v;
                    this.objEvents.raiseProp('viewName');
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MainRoute.prototype, "custTemplName", {
            get: function () { return this._custTemplName; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MainRoute.prototype, "custDetTemplName", {
            get: function () { return this._custDetTemplName; },
            enumerable: false,
            configurable: true
        });
        return MainRoute;
    }(RIAPP.BaseObject));
    exports.MainRoute = MainRoute;
    var CustDetRoute = (function (_super) {
        __extends(CustDetRoute, _super);
        function CustDetRoute() {
            var _this = _super.call(this) || this;
            _this._infoTemplName = 'custInfoGroup.customerInfo';
            _this._adrTemplName = 'custAdrGroup.customerAddr';
            _this._viewName = _this._infoTemplName;
            _this._animation = new ANIMATION.SlideAnimation(false);
            return _this;
        }
        CustDetRoute.prototype.goToCustInfo = function () {
            this.viewName = this.infoTemplName;
        };
        CustDetRoute.prototype.goToAdrInfo = function () {
            this.viewName = this.adrTemplName;
        };
        CustDetRoute.prototype.reset = function () {
            this.viewName = this._infoTemplName;
        };
        Object.defineProperty(CustDetRoute.prototype, "animation", {
            get: function () { return this._animation; },
            set: function (v) {
                if (v !== this._animation) {
                    this._animation = v;
                    this.objEvents.raiseProp('animation');
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustDetRoute.prototype, "viewName", {
            get: function () { return this._viewName; },
            set: function (v) {
                if (v !== this._viewName) {
                    this._viewName = v;
                    this.objEvents.raiseProp('viewName');
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustDetRoute.prototype, "infoTemplName", {
            get: function () { return this._infoTemplName; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustDetRoute.prototype, "adrTemplName", {
            get: function () { return this._adrTemplName; },
            enumerable: false,
            configurable: true
        });
        return CustDetRoute;
    }(RIAPP.BaseObject));
    exports.CustDetRoute = CustDetRoute;
    var AddressRoute = (function (_super) {
        __extends(AddressRoute, _super);
        function AddressRoute() {
            var _this = _super.call(this) || this;
            _this._linkAdrTemplate = 'custAdrGroup.linkAdrTemplate';
            _this._newAdrTemplate = 'custAdrGroup.newAdrTemplate';
            _this._viewName = _this._linkAdrTemplate;
            return _this;
        }
        AddressRoute.prototype.goToLinkAdr = function () {
            this.viewName = this.linkAdrTemplate;
        };
        AddressRoute.prototype.goToNewAdr = function () {
            this.viewName = this.newAdrTemplate;
        };
        Object.defineProperty(AddressRoute.prototype, "viewName", {
            get: function () { return this._viewName; },
            set: function (v) {
                if (v !== this._viewName) {
                    this._viewName = v;
                    this.objEvents.raiseProp('viewName');
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressRoute.prototype, "linkAdrTemplate", {
            get: function () { return this._linkAdrTemplate; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddressRoute.prototype, "newAdrTemplate", {
            get: function () { return this._newAdrTemplate; },
            enumerable: false,
            configurable: true
        });
        return AddressRoute;
    }(RIAPP.BaseObject));
    exports.AddressRoute = AddressRoute;
});
define("addAddressVM", ["require", "exports", "jriapp", "jriapp_db", "jriapp_ui", "common", "routes"], function (require, exports, RIAPP, dbMOD, uiMOD, COMMON, routes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AddAddressVM = void 0;
    var utils = RIAPP.Utils;
    var AddAddressVM = (function (_super) {
        __extends(AddAddressVM, _super);
        function AddAddressVM(customerAddressVM) {
            var _this = _super.call(this, customerAddressVM.app) || this;
            var self = _this;
            _this._customerAddressVM = customerAddressVM;
            _this._addressInfosDb = _this.dbContext.dbSets.AddressInfo;
            _this._currentCustomer = self._customerAddressVM.currentCustomer;
            _this._searchToolTip = 'enter any address part then press search button';
            _this._newAddress = null;
            _this._dataGrid = null;
            _this._searchString = null;
            _this._uiAddressRoute = new routes_1.AddressRoute();
            _this._dialogVM = new uiMOD.DialogVM(self.app);
            var dialogOptions = {
                templateID: 'custAdrGroup.addAddressTemplate',
                width: 950,
                height: 600,
                title: 'add new customer address',
                submitOnOK: true,
                fn_OnClose: function (dialog) {
                    if (dialog.result != 'ok') {
                        if (!!self._newAddress) {
                            self._cancelAddNewAddress();
                        }
                        self.dbContext.rejectChanges();
                    }
                    self._addressInfosDb.clear();
                    self.searchString = null;
                },
                fn_OnOK: function (dialog) {
                    if (self.uiAddressRoute.viewName != self.uiAddressRoute.newAdrTemplate) {
                        return 0;
                    }
                    if (!self._newAddress._aspect.endEdit())
                        return 1;
                    var custAdress = self._customerAddressVM._addNewCustAddress(self._newAddress);
                    custAdress._aspect.endEdit();
                    self._newAddress = null;
                    self.uiAddressRoute.goToLinkAdr();
                    self.objEvents.raiseProp('newAddress');
                    return 1;
                },
                fn_OnCancel: function (dialog) {
                    if (self.uiAddressRoute.viewName != self.uiAddressRoute.newAdrTemplate) {
                        return 0;
                    }
                    if (!!self._newAddress) {
                        self._cancelAddNewAddress();
                    }
                    return 1;
                }
            };
            _this._dialogVM.createDialog('addressDialog', dialogOptions);
            _this._addressInfosView = new dbMOD.DataView({
                dataSource: _this._addressInfosDb,
                fn_sort: function (a, b) { return a.AddressID - b.AddressID; },
                fn_filter: function (item) {
                    return !item.CustomerAddresses.some(function (CustAdr) {
                        return self._currentCustomer === CustAdr.Customer;
                    });
                }
            });
            _this._addressInfosView.isPagingEnabled = true;
            _this._addressInfosView.pageSize = 50;
            _this._addressInfosView.objEvents.onProp('currentItem', function (_s, args) {
                self.objEvents.raiseProp('currentAddressInfo');
                self._linkCommand.raiseCanExecuteChanged();
            }, self.uniqueID);
            _this._customerAddressVM.objEvents.onProp('currentCustomer', function (_s, args) {
                self._currentCustomer = self._customerAddressVM.currentCustomer;
                self.objEvents.raiseProp('customer');
                self._addNewCommand.raiseCanExecuteChanged();
            }, self.uniqueID);
            _this.custAdressView.objEvents.onProp('currentItem', function (_s, args) {
                self._unLinkCommand.raiseCanExecuteChanged();
            }, self.uniqueID);
            _this._addNewCommand = new RIAPP.Command(function (param) {
                try {
                    var opts = utils.core.merge(param, { width: 950, height: 600 });
                    var dialog = self._dialogVM.showDialog('addressDialog', self);
                    dialog.width = opts.width;
                    dialog.height = opts.height;
                }
                catch (ex) {
                    self.handleError(ex, self);
                }
            }, function () {
                return !!self.customer;
            });
            _this._execSearchCommand = new RIAPP.Command(function () {
                self.loadAddressInfos();
            });
            _this._addNewAddressCommand = new RIAPP.Command(function () {
                self._addNewAddress();
            });
            _this._linkCommand = new RIAPP.Command(function () {
                self._linkAddress();
            }, function () {
                return !!self._addressInfosView.currentItem;
            });
            _this._unLinkCommand = new RIAPP.Command(function () {
                self._unLinkAddress();
            }, function () {
                return !!self.custAdressView.currentItem;
            });
            return _this;
        }
        AddAddressVM.prototype._addGrid = function (grid) {
            if (!!this._dataGrid)
                this._removeGrid();
            this._dataGrid = grid;
        };
        AddAddressVM.prototype._removeGrid = function () {
            if (!this._dataGrid)
                return;
            this._dataGrid.objEvents.offNS(this.uniqueID);
            this._dataGrid = null;
        };
        AddAddressVM.prototype._cancelAddNewAddress = function () {
            var self = this;
            self._newAddress._aspect.cancelEdit();
            self._newAddress._aspect.rejectChanges();
            self._newAddress = null;
            self.uiAddressRoute.goToLinkAdr();
            self.objEvents.raiseProp('newAddress');
        };
        AddAddressVM.prototype._addNewAddress = function () {
            this._newAddress = this._customerAddressVM._addNewAddress();
            this.uiAddressRoute.goToNewAdr();
            this.objEvents.raiseProp('newAddress');
        };
        AddAddressVM.prototype._linkAddress = function () {
            var self = this, adrInfo = this.currentAddressInfo, adrView = self.custAdressView;
            if (!adrInfo) {
                alert('_linkAddress error: adrInfoEntity is null');
                return;
            }
            var adrID = adrInfo.AddressID;
            var existedAddr = adrView.items.some(function (item) {
                return item.AddressID === adrID;
            });
            if (existedAddr) {
                alert('Customer already has this address!');
                return;
            }
            var promise = this._customerAddressVM._loadAddresses([adrID], false);
            promise.then(function (res) {
                var address = self._customerAddressVM.addressesDb.findEntity(adrID);
                if (!!address) {
                    self._customerAddressVM._addNewCustAddress(address);
                    self._removeAddressRP(adrID);
                }
            });
        };
        AddAddressVM.prototype._unLinkAddress = function () {
            var item = this.custAdressView.currentItem;
            if (!item) {
                return;
            }
            var id = item.AddressID;
            if (item._aspect.deleteItem())
                this._addAddressRP(id);
        };
        AddAddressVM.prototype._addAddressRP = function (addressID) {
            if (this._checkAddressInRP(addressID)) {
                var deferred = utils.async.createDeferred();
                deferred.reject();
                return deferred.promise();
            }
            var self = this, query = this._addressInfosDb.createReadAddressInfoQuery();
            query.isClearPrevData = false;
            query.where('AddressID', 0, [addressID]);
            var promise = query.load();
            promise.then(function () {
                self._checkAddressInRP(addressID);
            });
            return promise;
        };
        AddAddressVM.prototype._checkAddressInRP = function (addressID) {
            var item = this._addressInfosDb.findEntity(addressID);
            if (!!item) {
                this._addressInfosView.appendItems([item]);
                this._addressInfosView.currentItem = item;
                if (!!this._dataGrid)
                    this._dataGrid.scrollToCurrent(0);
            }
            return !!item;
        };
        AddAddressVM.prototype._removeAddressRP = function (addressID) {
            var item = this._addressInfosView.findByPK(addressID);
            if (!!item) {
                this._addressInfosView.removeItem(item);
            }
        };
        AddAddressVM.prototype.loadAddressInfos = function () {
            var query = this._addressInfosDb.createReadAddressInfoQuery();
            query.isClearPrevData = true;
            COMMON.addTextQuery(query, 'AddressLine1', '%' + this.searchString + '%');
            query.orderBy('AddressLine1');
            return query.load();
        };
        AddAddressVM.prototype.submitChanges = function () { return this.dbContext.submitChanges(); };
        AddAddressVM.prototype.rejectChanges = function () { };
        AddAddressVM.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            if (!!this._addressInfosDb) {
                this._addressInfosDb.objEvents.offNS(this.uniqueID);
                this._addressInfosDb.clear();
                this._addressInfosDb = null;
            }
            if (!!this._addressInfosView) {
                this._addressInfosView.dispose();
                this._addressInfosView = null;
            }
            this.custAdressView.objEvents.offNS(this.uniqueID);
            if (!!this._customerAddressVM) {
                this._customerAddressVM.objEvents.offNS(this.uniqueID);
                this._customerAddressVM = null;
            }
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(AddAddressVM.prototype, "dbContext", {
            get: function () { return this.app.dbContext; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "dbSets", {
            get: function () { return this.dbContext.dbSets; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "isCanSubmit", {
            get: function () { return true; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "addressInfosDb", {
            get: function () { return this._addressInfosDb; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "addressInfosView", {
            get: function () { return this._addressInfosView; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "addressesView", {
            get: function () { return this._customerAddressVM.addressesView; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "custAdressView", {
            get: function () { return this._customerAddressVM.custAdressView; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "currentAddressInfo", {
            get: function () { return this._addressInfosView.currentItem; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "searchString", {
            get: function () { return this._searchString; },
            set: function (v) {
                if (this._searchString !== v) {
                    this._searchString = v;
                    this.objEvents.raiseProp('searchString');
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "addNewCommand", {
            get: function () { return this._addNewCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "execSearchCommand", {
            get: function () { return this._execSearchCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "addNewAddressCommand", {
            get: function () { return this._addNewAddressCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "linkCommand", {
            get: function () { return this._linkCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "unLinkCommand", {
            get: function () { return this._unLinkCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "newAddress", {
            get: function () { return this._newAddress; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "customer", {
            get: function () { return this._currentCustomer; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "grid", {
            get: function () { return this._dataGrid; },
            set: function (v) {
                if (!!v)
                    this._addGrid(v);
                else
                    this._removeGrid();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "searchToolTip", {
            get: function () { return this._searchToolTip; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AddAddressVM.prototype, "uiAddressRoute", {
            get: function () { return this._uiAddressRoute; },
            enumerable: false,
            configurable: true
        });
        return AddAddressVM;
    }(RIAPP.ViewModel));
    exports.AddAddressVM = AddAddressVM;
});
define("custAddressVM", ["require", "exports", "jriapp", "jriapp_db", "addAddressVM"], function (require, exports, RIAPP, dbMOD, addAddressVM_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CustomerAddressVM = void 0;
    var CustomerAddressVM = (function (_super) {
        __extends(CustomerAddressVM, _super);
        function CustomerAddressVM(customerVM) {
            var _this = _super.call(this, customerVM.app) || this;
            var self = _this;
            _this._customerVM = customerVM;
            _this._addAddressVM = null;
            _this._currentCustomer = self._customerVM.currentItem;
            _this._addressesDb = _this.dbSets.Address;
            _this._custAdressDb = _this.dbSets.CustomerAddress;
            _this._custAdressDb.addOnItemDeleting(function (_s, args) {
                if (!confirm('Are you sure that you want to unlink Address from this customer?'))
                    args.isCancel = true;
            }, self.uniqueID);
            _this._custAdressDb.addOnBeginEdit(function (_s, args) {
                var item = args.item;
                var address = item.Address;
                if (!!address)
                    address._aspect.beginEdit();
            }, self.uniqueID);
            _this._custAdressDb.addOnEndEdit(function (_s, args) {
                var item = args.item;
                var address = item.Address;
                if (!args.isCanceled) {
                    if (!!address)
                        address._aspect.endEdit();
                }
                else {
                    if (address)
                        address._aspect.cancelEdit();
                }
            }, self.uniqueID);
            _this._addressesDb.addOnItemDeleting(function (_s, args) {
                if (!confirm('Are you sure that you want to delete the Customer\'s Address?'))
                    args.isCancel = true;
            }, self.uniqueID);
            _this._addressesView = new dbMOD.DataView({
                dataSource: _this._addressesDb,
                fn_sort: function (a, b) { return a.AddressID - b.AddressID; },
                fn_filter: function (item) {
                    if (!self._currentCustomer)
                        return false;
                    return item.CustomerAddresses.some(function (ca) {
                        return self._currentCustomer === ca.Customer;
                    });
                },
                fn_itemsProvider: function (ds) {
                    if (!self._currentCustomer)
                        return [];
                    var custAdrs = self._currentCustomer.CustomerAddresses;
                    return custAdrs.map(function (m) {
                        return m.Address;
                    }).filter(function (address) {
                        return !!address;
                    });
                }
            });
            _this._custAdressView.addOnViewRefreshed(function (s, a) {
                self._addressesView.refresh();
            }, self.uniqueID);
            _this._customerVM.objEvents.onProp('currentItem', function (_s, args) {
                self._currentCustomer = self._customerVM.currentItem;
                self.objEvents.raiseProp('currentCustomer');
            }, self.uniqueID);
            return _this;
        }
        CustomerAddressVM.prototype._loadAddresses = function (addressIDs, isClearTable) {
            var query = this._addressesDb.createReadAddressByIdsQuery({ addressIDs: addressIDs });
            query.isClearPrevData = isClearTable;
            return query.load();
        };
        CustomerAddressVM.prototype._addNewAddress = function () {
            var adr = this.addressesView.addNew();
            return adr;
        };
        CustomerAddressVM.prototype._addNewCustAddress = function (address) {
            var cust = this.currentCustomer;
            var ca = this.custAdressView.addNew();
            ca.CustomerID = cust.CustomerID;
            ca.AddressType = "Main Office";
            ca.Address = address;
            ca._aspect.endEdit();
            return ca;
        };
        CustomerAddressVM.prototype.load = function (customers) {
            var custArr = customers || [];
            var custIDs = custArr.map(function (item) {
                return item.CustomerID;
            });
            var query = this._custAdressDb.createReadAddressForCustomersQuery({ custIDs: custIDs });
            query.load();
        };
        CustomerAddressVM.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            if (!!this._addressesDb) {
                this._addressesDb.objEvents.offNS(this.uniqueID);
            }
            if (!!this._custAdressDb) {
                this._custAdressDb.objEvents.offNS(this.uniqueID);
            }
            if (!!this._customerVM) {
                this._customerVM.objEvents.offNS(this.uniqueID);
            }
            if (!!this._custAdressView) {
                this._custAdressView.objEvents.offNS(this.uniqueID);
            }
            if (this._addAddressVM) {
                this._addAddressVM.dispose();
                this._addAddressVM = null;
            }
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(CustomerAddressVM.prototype, "_custAdressView", {
            get: function () { return this._customerVM.custAdressView; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressVM.prototype, "dbContext", {
            get: function () { return this.app.dbContext; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressVM.prototype, "dbSets", {
            get: function () { return this.dbContext.dbSets; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressVM.prototype, "addressesDb", {
            get: function () { return this._addressesDb; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressVM.prototype, "custAdressDb", {
            get: function () { return this._custAdressDb; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressVM.prototype, "addressesView", {
            get: function () { return this._addressesView; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressVM.prototype, "custAdressView", {
            get: function () { return this._custAdressView; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressVM.prototype, "addAddressVM", {
            get: function () {
                if (!this._addAddressVM) {
                    this._addAddressVM = new addAddressVM_1.AddAddressVM(this);
                }
                return this._addAddressVM;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerAddressVM.prototype, "currentCustomer", {
            get: function () { return this._currentCustomer; },
            enumerable: false,
            configurable: true
        });
        return CustomerAddressVM;
    }(RIAPP.ViewModel));
    exports.CustomerAddressVM = CustomerAddressVM;
});
define("customerVM", ["require", "exports", "jriapp", "jriapp_db", "gridEvents", "routes", "custAddressVM", "orderVM"], function (require, exports, RIAPP, dbMOD, gridEvents_2, routes_2, custAddressVM_1, orderVM_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CustomerVM = void 0;
    var CustomerVM = (function (_super) {
        __extends(CustomerVM, _super);
        function CustomerVM(app) {
            var _this = _super.call(this, app) || this;
            var self = _this;
            _this._dbSet = _this.dbSets.Customer;
            _this._dbSet.isSubmitOnDelete = true;
            _this._propWatcher = new RIAPP.PropWatcher();
            _this._uiMainRoute = new routes_2.MainRoute();
            _this._uiCustDetRoute = new routes_2.CustDetRoute();
            _this._uiMainRoute.objEvents.onProp('viewName', function (sender) {
                self._uiCustDetRoute.reset();
                if (sender.viewName === sender.custTemplName) {
                    setTimeout(function () {
                        if (!!self._gridEvents) {
                            self._gridEvents.focusGrid();
                        }
                    }, 0);
                }
            });
            _this._gridEvents = new gridEvents_2.CustomerGridEvents(_this);
            _this._dbSet.addOnItemDeleting(function (_s, args) {
                if (!confirm('Are you sure that you want to delete customer?'))
                    args.isCancel = true;
            }, self.uniqueID);
            _this._dbSet.addOnPageIndexChanged(function (_s, args) {
                self.objEvents.raise('page_changed', {});
            }, self.uniqueID);
            _this._dbSet.addOnItemAdded(function (s, args) {
                args.item.NameStyle = false;
                args.item.ComplexProp.LastName = "Dummy1";
                args.item.ComplexProp.FirstName = "Dummy2";
            });
            _this._editCommand = new RIAPP.Command(function () {
                self.currentItem._aspect.beginEdit();
            }, function () {
                return !!self.currentItem;
            });
            _this._endEditCommand = new RIAPP.Command(function () {
                if (self.currentItem._aspect.endEdit())
                    self.dbContext.submitChanges();
            }, function () {
                return !!self.currentItem;
            });
            _this._cancelEditCommand = new RIAPP.Command(function () {
                self.currentItem._aspect.cancelEdit();
                self.dbContext.rejectChanges();
            }, function () {
                return !!self.currentItem;
            });
            _this._addNewCommand = new RIAPP.Command(function () {
                self._dbSet.addNew();
            });
            _this._saveCommand = new RIAPP.Command(function () {
                self.dbContext.submitChanges();
            }, function () {
                return self.dbContext.isHasChanges;
            });
            _this._undoCommand = new RIAPP.Command(function () {
                self.dbContext.rejectChanges();
            }, function () {
                return self.dbContext.isHasChanges;
            });
            _this._loadCommand = new RIAPP.Command(function () {
                self.load();
            });
            _this._switchViewCommand = new RIAPP.Command(function (param) {
                self.uiMainRoute.viewName = param;
            });
            _this._switchDetViewCommand = new RIAPP.Command(function (param) {
                self.uiCustDetRoute.viewName = param;
            });
            _this._propWatcher.addPropWatch(self.dbContext, 'isHasChanges', function () {
                self._saveCommand.raiseCanExecuteChanged();
                self._undoCommand.raiseCanExecuteChanged();
            });
            _this._propWatcher.addPropWatch(_this._dbSet, 'currentItem', function () {
                self._editCommand.raiseCanExecuteChanged();
                self._endEditCommand.raiseCanExecuteChanged();
                self._cancelEditCommand.raiseCanExecuteChanged();
                self._onCurrentChanged();
            });
            _this._dbSet.addOnCleared(function () {
                self.dbSets.CustomerAddress.clear();
                self.dbSets.Address.clear();
            }, self.uniqueID);
            var custAssoc = self.dbContext.associations.getCustAddrToCustomer();
            _this._custAdressView = new dbMOD.ChildDataView({
                association: custAssoc,
                fn_sort: function (a, b) { return a.AddressID - b.AddressID; }
            });
            _this._ordersVM = new orderVM_1.OrderVM(_this);
            _this._customerAddressVM = new custAddressVM_1.CustomerAddressVM(_this);
            return _this;
        }
        CustomerVM.prototype._onCurrentChanged = function () {
            this._custAdressView.parentItem = this._dbSet.currentItem;
            this.objEvents.raiseProp('currentItem');
        };
        CustomerVM.prototype._onGridPageChanged = function () {
        };
        CustomerVM.prototype._onGridRowSelected = function (item) {
        };
        CustomerVM.prototype._onGridRowExpanded = function (item) {
            this.objEvents.raise('row_expanded', { customer: item, isExpanded: true });
        };
        CustomerVM.prototype._onGridRowCollapsed = function (item) {
            this.objEvents.raise('row_expanded', { customer: item, isExpanded: false });
        };
        CustomerVM.prototype.load = function () {
            var query = this._dbSet.createReadCustomerQuery({ includeNav: true });
            query.pageSize = 50;
            query.orderBy('ComplexProp.LastName').thenBy('ComplexProp.MiddleName').thenBy('ComplexProp.FirstName');
            return this.dbContext.load(query);
        };
        CustomerVM.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            this._propWatcher.dispose();
            this._propWatcher = null;
            if (!!this._dbSet) {
                this._dbSet.objEvents.offNS(this.uniqueID);
            }
            this._gridEvents.dispose();
            this._gridEvents = null;
            this._ordersVM.dispose();
            this._ordersVM = null;
            this._customerAddressVM.dispose();
            this._customerAddressVM = null;
            this._custAdressView.dispose();
            this._custAdressView = null;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(CustomerVM.prototype, "dbContext", {
            get: function () { return this.app.dbContext; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "dbSets", {
            get: function () { return this.dbContext.dbSets; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "dbSet", {
            get: function () { return this._dbSet; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "currentItem", {
            get: function () { return this._dbSet.currentItem; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "editCommand", {
            get: function () { return this._editCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "endEditCommand", {
            get: function () { return this._endEditCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "cancelEditCommand", {
            get: function () { return this._cancelEditCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "addNewCommand", {
            get: function () { return this._addNewCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "saveCommand", {
            get: function () { return this._saveCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "undoCommand", {
            get: function () { return this._undoCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "loadCommand", {
            get: function () { return this._loadCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "ordersVM", {
            get: function () { return this._ordersVM; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "custAdressView", {
            get: function () { return this._custAdressView; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "customerAddressVM", {
            get: function () { return this._customerAddressVM; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "switchViewCommand", {
            get: function () { return this._switchViewCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "switchDetViewCommand", {
            get: function () { return this._switchDetViewCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "uiMainRoute", {
            get: function () { return this._uiMainRoute; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "uiCustDetRoute", {
            get: function () { return this._uiCustDetRoute; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CustomerVM.prototype, "gridEvents", {
            get: function () { return this._gridEvents; },
            enumerable: false,
            configurable: true
        });
        return CustomerVM;
    }(RIAPP.ViewModel));
    exports.CustomerVM = CustomerVM;
});
define("app", ["require", "exports", "jriapp", "domainModel", "common", "customerVM"], function (require, exports, RIAPP, DEMODB, common_1, customerVM_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DemoApplication = void 0;
    var DemoApplication = (function (_super) {
        __extends(DemoApplication, _super);
        function DemoApplication(options) {
            var _this = _super.call(this, options) || this;
            _this._dbContext = null;
            _this._errorVM = null;
            _this._customerVM = null;
            return _this;
        }
        DemoApplication.prototype.onStartUp = function () {
            var self = this, options = self.options;
            this._dbContext = new DEMODB.DbContext();
            this._dbContext.initialize({ serviceUrl: options.service_url, permissions: options.permissionInfo });
            function toText(str) {
                if (str === null)
                    return '';
                else
                    return str;
            }
            ;
            this._dbContext.dbSets.Customer.defineComplexProp_NameField(function (item) {
                return toText(item.ComplexProp.LastName) + '  ' + toText(item.ComplexProp.MiddleName) + '  ' + toText(item.ComplexProp.FirstName);
            });
            this.registerSvc("$dbContext", this._dbContext);
            this._errorVM = new common_1.ErrorViewModel(this);
            this._customerVM = new customerVM_1.CustomerVM(this);
            function handleError(sender, data) {
                self._handleError(sender, data);
            }
            ;
            this.objEvents.addOnError(handleError);
            this._dbContext.objEvents.addOnError(handleError);
            _super.prototype.onStartUp.call(this);
        };
        DemoApplication.prototype._handleError = function (sender, data) {
            debugger;
            data.isHandled = true;
            this.errorVM.error = data.error;
            this.errorVM.showDialog();
        };
        DemoApplication.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            var self = this;
            try {
                self._errorVM.dispose();
                self._customerVM.dispose();
                self._dbContext.dispose();
            }
            finally {
                _super.prototype.dispose.call(this);
            }
        };
        Object.defineProperty(DemoApplication.prototype, "dbContext", {
            get: function () { return this._dbContext; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DemoApplication.prototype, "errorVM", {
            get: function () { return this._errorVM; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DemoApplication.prototype, "customerVM", {
            get: function () { return this._customerVM; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DemoApplication.prototype, "TEXT", {
            get: function () { return RIAPP.LocaleSTRS.TEXT; },
            enumerable: false,
            configurable: true
        });
        return DemoApplication;
    }(RIAPP.Application));
    exports.DemoApplication = DemoApplication;
});
define("gridElView", ["require", "exports", "jriapp_ui"], function (require, exports, uiMOD) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initModule = exports.GridElView = void 0;
    var GridElView = (function (_super) {
        __extends(GridElView, _super);
        function GridElView(el, options) {
            var _this = _super.call(this, el, options) || this;
            var self = _this, grid = self.grid;
            if (!!grid) {
                grid.addOnPageChanged(function (s, a) {
                    self._onGridPageChanged();
                }, self.uniqueID);
                grid.addOnRowSelected(function (s, a) {
                    self._onGridRowSelected(a.row);
                }, self.uniqueID);
                grid.addOnRowExpanded(function (s, a) {
                    self._onGridRowExpanded(a.collapsedRow, a.expandedRow, a.isExpanded);
                }, self.uniqueID);
            }
            return _this;
        }
        GridElView.prototype._onGridPageChanged = function () {
            if (!!this._myGridEvents) {
                this._myGridEvents.onDataPageChanged();
            }
        };
        GridElView.prototype._onGridRowSelected = function (row) {
            if (!!this._myGridEvents) {
                this._myGridEvents.onRowSelected(row.item);
            }
        };
        GridElView.prototype._onGridRowExpanded = function (oldRow, row, isExpanded) {
            if (!!this._myGridEvents) {
                if (isExpanded) {
                    this._myGridEvents.onRowExpanded(row.item);
                }
                else {
                    this._myGridEvents.onRowCollapsed(oldRow.item);
                }
            }
        };
        GridElView.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            if (!!this._myGridEvents) {
                this._myGridEvents.regFocusGridFunc(null);
            }
            this._myGridEvents = null;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(GridElView.prototype, "myGridEvents", {
            get: function () { return this._myGridEvents; },
            set: function (v) {
                var self = this;
                if (this._myGridEvents !== v) {
                    if (!!this._myGridEvents) {
                        this._myGridEvents.regFocusGridFunc(null);
                    }
                    this._myGridEvents = v;
                    this.objEvents.raiseProp('myGridEvents');
                    if (!!this._myGridEvents) {
                        this._myGridEvents.regFocusGridFunc(function () {
                            if (!!self.grid) {
                                self.grid.focus();
                            }
                        });
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        return GridElView;
    }(uiMOD.DataGridElView));
    exports.GridElView = GridElView;
    function initModule(app) {
        app.registerElView('my_grid', GridElView);
    }
    exports.initModule = initModule;
});
define("prodAutocomplete", ["require", "exports", "autocomplete"], function (require, exports, AUTOCOMPLETE) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initModule = exports.ProductAutoComplete = void 0;
    var ProductAutoComplete = (function (_super) {
        __extends(ProductAutoComplete, _super);
        function ProductAutoComplete(el, options) {
            var _this = _super.call(this, el, options) || this;
            var self = _this;
            _this._lastLoadedID = null;
            _this._lookupSource = _this._getDbContext().getDbSet('Product');
            _this._lookupSource.addOnCollChanged(function (_s, args) {
                self._updateValue();
            }, self.uniqueID);
            return _this;
        }
        ProductAutoComplete.prototype._updateSelection = function () {
            if (!!this.dataContext) {
                var id = this.currentSelection;
                this.getDataContext().ProductID = id;
            }
        };
        ProductAutoComplete.prototype._onHide = function () {
            this._updateValue();
            _super.prototype._onHide.call(this);
        };
        ProductAutoComplete.prototype._updateValue = function () {
            if (!this.dataContext) {
                this.value = '';
                return;
            }
            var productID = this.getDataContext().ProductID, product = this._lookupSource.findEntity(productID);
            if (!!product) {
                this.value = product.Name;
            }
            else {
                this.value = '';
                if (this._lastLoadedID !== productID) {
                    this._lastLoadedID = productID;
                    var query = this._lookupSource.createReadProductByIdsQuery({ productIDs: [productID] });
                    query.isClearPrevData = false;
                    query.load();
                }
            }
        };
        ProductAutoComplete.prototype.setDataContext = function (v) {
            var old = this.getDataContext(), self = this;
            if (old !== v) {
                var dxt = v;
                if (!!dxt) {
                    dxt.objEvents.onProp('ProductID', function (_s, a) {
                        self._updateValue();
                    }, this.uniqueID);
                }
                _super.prototype.setDataContext.call(this, v);
                self._updateValue();
            }
        };
        ProductAutoComplete.prototype.getDataContext = function () { return _super.prototype.getDataContext.call(this); };
        Object.defineProperty(ProductAutoComplete.prototype, "currentSelection", {
            get: function () {
                if (!!this.gridDataSource.currentItem) {
                    return this.gridDataSource.currentItem['ProductID'];
                }
                else {
                    return null;
                }
            },
            enumerable: false,
            configurable: true
        });
        return ProductAutoComplete;
    }(AUTOCOMPLETE.AutoCompleteElView));
    exports.ProductAutoComplete = ProductAutoComplete;
    function initModule(app) {
        app.registerElView('productAutocomplete', ProductAutoComplete);
    }
    exports.initModule = initModule;
    ;
});
define("main", ["require", "exports", "jriapp", "app", "common", "autocomplete", "gridElView", "prodAutocomplete"], function (require, exports, RIAPP, app_1, COMMON, AUTOCOMPLETE, GRIDELVIEW, PRODAUTOCOMPLETE) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.start = void 0;
    RIAPP.bootstrapper.objEvents.addOnError(function (_, args) {
        debugger;
        alert(args.error.message);
    });
    function start(options) {
        options.modulesInits = {
            "COMMON": COMMON.initModule,
            "AUTOCOMPLETE": AUTOCOMPLETE.initModule,
            "GRIDELVIEW": GRIDELVIEW.initModule,
            "PRODAUTOCOMPLETE": PRODAUTOCOMPLETE.initModule
        };
        return RIAPP.bootstrapper.startApp(function () {
            return new app_1.DemoApplication(options);
        }, function (app) {
            app.registerTemplateGroup('custGroup', options.spa_template1_url);
            app.registerTemplateGroup('custInfoGroup', options.spa_template2_url);
            app.registerTemplateGroup('custAdrGroup', options.spa_template3_url);
        }).then(function (app) {
            return app.customerVM.load();
        });
    }
    exports.start = start;
});
