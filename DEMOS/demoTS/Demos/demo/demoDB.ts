/*
	Generated from: /RIAppDemoServiceEF/code?lang=ts on 2021-07-25 at 13:17
	Don't make manual changes here, they will be lost when this interface will be regenerated!
*/

import * as RIAPP from "jriapp_shared";
import * as dbMOD from "jriapp_db";


//******BEGIN INTERFACE REGION******
export interface IAddressInfo2 {
	AddressID: number;
	AddressLine1: string;
	City: string;
	StateProvince: string;
	CountryRegion: string;
}

/*
	Generated from C# KeyVal model
*/
export interface IKeyVal {
	key: number;
	val: string;
}

export interface IDEMOCLS {
	prodCategory: IKeyVal[];
	prodDescription: IKeyVal[];
	prodModel: IKeyVal[];
}

export interface ITestLookUpProduct {
	ProductID: number;
	Name: string;
}

export enum TestEnum {
	None = 0,
	OK = 1,
	Error = 2,
	Loading = 3
}

/*
	A Class for testing of conversion C# types to typescript
*/
export interface IClientTestModel {
	Key: string;
	SomeProperty1: string;
	SomeProperty2: number[];
	SomeProperty3: string[];
	MoreComplexProperty: ITestLookUpProduct[];
	EnumProperty: TestEnum;
}

/*
	Generated from C# StrKeyVal model
*/
export interface IStrKeyVal {
	key: string;
	val: string;
}

export interface IRadioVal {
	key: string;
	value: string;
	comment: string;
}

/*
	Generated from C# HistoryItem model
*/
export interface IHistoryItem {
	radioValue: string;
	time: Date;
}

/*
	An enum for testing of conversion C# types to typescript
*/
export enum TestEnum2 {
	None = 0,
	One = 1,
	Two = 2,
	Three = 3
}
//******END INTERFACE REGION******

export interface ISvcMethods {
	GetClassifiers: () => RIAPP.IPromise<IDEMOCLS>;
	TestComplexInvoke: (args: {
		info: IAddressInfo2;
		keys: IKeyVal[];
	}) => RIAPP.IPromise<number[]>;
	TestInvoke: (args: {
		param1: number[];
		param2: string;
	}) => RIAPP.IPromise<string>;
}

//******BEGIN LISTS REGION******
export type TTestModelItemAspect = RIAPP.ListItemAspect<TestModelListItem, IClientTestModel>;

export interface TestModelListItem extends IClientTestModel, RIAPP.IListItem {
	readonly _aspect: TTestModelItemAspect;
}

class _TestModelListItem extends RIAPP.CollectionItem<TTestModelItemAspect> implements TestModelListItem {
	get Key(): string { return <string>this._aspect._getProp('Key'); }
	set Key(v: string) { this._aspect._setProp('Key', v); }
	get SomeProperty1(): string { return <string>this._aspect._getProp('SomeProperty1'); }
	set SomeProperty1(v: string) { this._aspect._setProp('SomeProperty1', v); }
	get SomeProperty2(): number[] { return <number[]>this._aspect._getProp('SomeProperty2'); }
	set SomeProperty2(v: number[]) { this._aspect._setProp('SomeProperty2', v); }
	get SomeProperty3(): string[] { return <string[]>this._aspect._getProp('SomeProperty3'); }
	set SomeProperty3(v: string[]) { this._aspect._setProp('SomeProperty3', v); }
	get MoreComplexProperty(): ITestLookUpProduct[] { return <ITestLookUpProduct[]>this._aspect._getProp('MoreComplexProperty'); }
	set MoreComplexProperty(v: ITestLookUpProduct[]) { this._aspect._setProp('MoreComplexProperty', v); }
	get EnumProperty(): TestEnum { return <TestEnum>this._aspect._getProp('EnumProperty'); }
	set EnumProperty(v: TestEnum) { this._aspect._setProp('EnumProperty', v); }

	toString() {
		return '_TestModelListItem';
	}
}

export class TestDictionary extends RIAPP.BaseDictionary<TestModelListItem, IClientTestModel> {
	constructor() {
		super('Key', [{ name: 'Key', dtype: 1 }, { name: 'SomeProperty1', dtype: 1 }, { name: 'SomeProperty2', dtype: 10 }, { name: 'SomeProperty3', dtype: 0 }, { name: 'MoreComplexProperty', dtype: 0 }, { name: 'EnumProperty', dtype: 0 }]);
	}
	// override
	itemFactory(aspect: TTestModelItemAspect): TestModelListItem {
		return new _TestModelListItem(aspect);
	}
	findItem(key: string): TestModelListItem {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString() {
		return 'TestDictionary';
	}
}

export class TestList extends RIAPP.BaseList<TestModelListItem, IClientTestModel> {
	constructor() {
		super([{ name: 'Key', dtype: 1 }, { name: 'SomeProperty1', dtype: 1 }, { name: 'SomeProperty2', dtype: 10 }, { name: 'SomeProperty3', dtype: 0 }, { name: 'MoreComplexProperty', dtype: 0 }, { name: 'EnumProperty', dtype: 0 }]);
	}
	// override
	itemFactory(aspect: TTestModelItemAspect): TestModelListItem {
		return new _TestModelListItem(aspect);
	}
	toString() {
		return 'TestList';
	}
}

export type TKeyValItemAspect = RIAPP.ListItemAspect<KeyValListItem, IKeyVal>;

export interface KeyValListItem extends IKeyVal, RIAPP.IListItem {
	readonly _aspect: TKeyValItemAspect;
}

class _KeyValListItem extends RIAPP.CollectionItem<TKeyValItemAspect> implements KeyValListItem {
	get key(): number { return <number>this._aspect._getProp('key'); }
	set key(v: number) { this._aspect._setProp('key', v); }
	get val(): string { return <string>this._aspect._getProp('val'); }
	set val(v: string) { this._aspect._setProp('val', v); }

	toString() {
		return '_KeyValListItem';
	}
}

export class KeyValDictionary extends RIAPP.BaseDictionary<KeyValListItem, IKeyVal> {
	constructor() {
		super('key', [{ name: 'key', dtype: 3 }, { name: 'val', dtype: 1 }]);
	}
	// override
	itemFactory(aspect: TKeyValItemAspect): KeyValListItem {
		return new _KeyValListItem(aspect);
	}
	findItem(key: number): KeyValListItem {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString() {
		return 'KeyValDictionary';
	}
}

export type TStrKeyValItemAspect = RIAPP.ListItemAspect<StrKeyValListItem, IStrKeyVal>;

export interface StrKeyValListItem extends IStrKeyVal, RIAPP.IListItem {
	readonly _aspect: TStrKeyValItemAspect;
}

class _StrKeyValListItem extends RIAPP.CollectionItem<TStrKeyValItemAspect> implements StrKeyValListItem {
	get key(): string { return <string>this._aspect._getProp('key'); }
	set key(v: string) { this._aspect._setProp('key', v); }
	get val(): string { return <string>this._aspect._getProp('val'); }
	set val(v: string) { this._aspect._setProp('val', v); }

	toString() {
		return '_StrKeyValListItem';
	}
}

export class StrKeyValDictionary extends RIAPP.BaseDictionary<StrKeyValListItem, IStrKeyVal> {
	constructor() {
		super('key', [{ name: 'key', dtype: 1 }, { name: 'val', dtype: 1 }]);
	}
	// override
	itemFactory(aspect: TStrKeyValItemAspect): StrKeyValListItem {
		return new _StrKeyValListItem(aspect);
	}
	findItem(key: string): StrKeyValListItem {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString() {
		return 'StrKeyValDictionary';
	}
}

export type TRadioValItemAspect = RIAPP.ListItemAspect<RadioValListItem, IRadioVal>;

export interface RadioValListItem extends IRadioVal, RIAPP.IListItem {
	readonly _aspect: TRadioValItemAspect;
}

class _RadioValListItem extends RIAPP.CollectionItem<TRadioValItemAspect> implements RadioValListItem {
	get key(): string { return <string>this._aspect._getProp('key'); }
	set key(v: string) { this._aspect._setProp('key', v); }
	get value(): string { return <string>this._aspect._getProp('value'); }
	set value(v: string) { this._aspect._setProp('value', v); }
	get comment(): string { return <string>this._aspect._getProp('comment'); }
	set comment(v: string) { this._aspect._setProp('comment', v); }

	toString() {
		return '_RadioValListItem';
	}
}

export class RadioValDictionary extends RIAPP.BaseDictionary<RadioValListItem, IRadioVal> {
	constructor() {
		super('key', [{ name: 'key', dtype: 1 }, { name: 'value', dtype: 1 }, { name: 'comment', dtype: 1 }]);
	}
	// override
	itemFactory(aspect: TRadioValItemAspect): RadioValListItem {
		return new _RadioValListItem(aspect);
	}
	findItem(key: string): RadioValListItem {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString() {
		return 'RadioValDictionary';
	}
}

export type THistoryItemItemAspect = RIAPP.ListItemAspect<HistoryItemListItem, IHistoryItem>;

export interface HistoryItemListItem extends IHistoryItem, RIAPP.IListItem {
	readonly _aspect: THistoryItemItemAspect;
}

class _HistoryItemListItem extends RIAPP.CollectionItem<THistoryItemItemAspect> implements HistoryItemListItem {
	get radioValue(): string { return <string>this._aspect._getProp('radioValue'); }
	set radioValue(v: string) { this._aspect._setProp('radioValue', v); }
	get time(): Date { return <Date>this._aspect._getProp('time'); }
	set time(v: Date) { this._aspect._setProp('time', v); }

	toString() {
		return '_HistoryItemListItem';
	}
}

export class HistoryList extends RIAPP.BaseList<HistoryItemListItem, IHistoryItem> {
	constructor() {
		super([{ name: 'radioValue', dtype: 1 }, { name: 'time', dtype: 6 }]);
	}
	// override
	itemFactory(aspect: THistoryItemItemAspect): HistoryItemListItem {
		return new _HistoryItemListItem(aspect);
	}
	toString() {
		return 'HistoryList';
	}
}
//******END LISTS REGION******

//******BEGIN COMPLEX TYPES REGION*****
export interface ICustomer_ComplexProp1 {
	EmailAddress: string;
	Phone: string;
}

export class Customer_ComplexProp1 extends dbMOD.ChildComplexProperty implements ICustomer_ComplexProp1 {

	constructor(name: string, parent: dbMOD.BaseComplexProperty) {
		super(name, parent);

	}
	get EmailAddress(): string { return this.getValue('ComplexProp.ComplexProp.EmailAddress'); }
	set EmailAddress(v: string) { this.setValue('ComplexProp.ComplexProp.EmailAddress', v); }
	get Phone(): string { return this.getValue('ComplexProp.ComplexProp.Phone'); }
	set Phone(v: string) { this.setValue('ComplexProp.ComplexProp.Phone', v); }
	toString() {
		return 'Customer_ComplexProp1';
	}
}

export interface ICustomer_ComplexProp {
	FirstName: string;
	MiddleName: string;
	LastName: string;
	readonly Name: string;
	readonly ComplexProp: ICustomer_ComplexProp1;
}

export class Customer_ComplexProp extends dbMOD.RootComplexProperty implements ICustomer_ComplexProp {
	private _ComplexProp: Customer_ComplexProp1;

	constructor(name: string, owner: dbMOD.EntityAspect<dbMOD.IEntityItem, any, DbContext>) {
		super(name, owner);
		this._ComplexProp = null;

	}
	get FirstName(): string { return this.getValue('ComplexProp.FirstName'); }
	set FirstName(v: string) { this.setValue('ComplexProp.FirstName', v); }
	get MiddleName(): string { return this.getValue('ComplexProp.MiddleName'); }
	set MiddleName(v: string) { this.setValue('ComplexProp.MiddleName', v); }
	get LastName(): string { return this.getValue('ComplexProp.LastName'); }
	set LastName(v: string) { this.setValue('ComplexProp.LastName', v); }
	get Name(): string { return this.getEntity()._getCalcFieldVal('ComplexProp.Name'); }
	get ComplexProp(): ICustomer_ComplexProp1 { if (!this._ComplexProp) { this._ComplexProp = new Customer_ComplexProp1('ComplexProp', this); } return this._ComplexProp; }
	toString() {
		return 'Customer_ComplexProp';
	}
}
//******END COMPLEX TYPES REGION******

export interface IAddress {
	readonly AddressID: number;
	AddressLine1: string;
	AddressLine2: string | null;
	City: string;
	StateProvince: string;
	CountryRegion: string;
	PostalCode: string;
	readonly rowguid: string;
	readonly ModifiedDate: Date;
}

export type TAddressAspect = dbMOD.EntityAspect<Address, IAddress, DbContext>;

export interface Address extends IAddress, dbMOD.IEntityItem {
	readonly _aspect: TAddressAspect;
	readonly CustomerAddresses: CustomerAddress[];
}

class AddressEntity extends RIAPP.CollectionItem<TAddressAspect> implements Address {
	constructor(aspect: TAddressAspect) {
		super(aspect);
	}
	toString() {
		return 'AddressEntity';
	}
	get AddressID(): number { return this._aspect._getFieldVal('AddressID'); }
	get AddressLine1(): string { return this._aspect._getFieldVal('AddressLine1'); }
	set AddressLine1(v: string) { this._aspect._setFieldVal('AddressLine1', v); }
	get AddressLine2(): string | null { return this._aspect._getFieldVal('AddressLine2'); }
	set AddressLine2(v: string | null) { this._aspect._setFieldVal('AddressLine2', v); }
	get City(): string { return this._aspect._getFieldVal('City'); }
	set City(v: string) { this._aspect._setFieldVal('City', v); }
	get StateProvince(): string { return this._aspect._getFieldVal('StateProvince'); }
	set StateProvince(v: string) { this._aspect._setFieldVal('StateProvince', v); }
	get CountryRegion(): string { return this._aspect._getFieldVal('CountryRegion'); }
	set CountryRegion(v: string) { this._aspect._setFieldVal('CountryRegion', v); }
	get PostalCode(): string { return this._aspect._getFieldVal('PostalCode'); }
	set PostalCode(v: string) { this._aspect._setFieldVal('PostalCode', v); }
	get rowguid(): string { return this._aspect._getFieldVal('rowguid'); }
	get ModifiedDate(): Date { return this._aspect._getFieldVal('ModifiedDate'); }
	get CustomerAddresses(): CustomerAddress[] { return this._aspect._getNavFieldVal('CustomerAddresses'); }
}

export class AddressDb extends dbMOD.DbSet<Address, IAddress, DbContext>
{
	constructor(dbContext: DbContext) {
		var opts: dbMOD.IDbSetConstuctorOptions = {
			dbContext: dbContext,
			dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "Address" },
			childAssoc: ([]),
			parentAssoc: ([{ "name": "CustAddrToAddress", "parentDbSetName": "Address", "childDbSetName": "CustomerAddress", "childToParentName": "Address", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "AddressID" }] }, { "name": "OrdersToBillAddr", "parentDbSetName": "Address", "childDbSetName": "SalesOrderHeader", "childToParentName": "Address1", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "BillToAddressID" }] }, { "name": "OrdersToShipAddr", "parentDbSetName": "Address", "childDbSetName": "SalesOrderHeader", "childToParentName": "Address", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "ShipToAddressID" }] }])
		};
		opts.dbSetInfo.fieldInfos = ([{ "fieldName": "AddressID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "AddressLine1", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 60, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "AddressLine2", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 60, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "City", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 30, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "StateProvince", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CountryRegion", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "PostalCode", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 15, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 4, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CustomerAddresses", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "", "nested": null }]);
		super(opts);
	}
	// override
	itemFactory(aspect: TAddressAspect): Address {
		return new AddressEntity(aspect);
	}
	findEntity(addressID: number): Address {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString(): string {
		return 'AddressDb';
	}
	createReadAddressByIdsQuery(args?: {
		addressIDs: number[];
	}): dbMOD.DataQuery<Address, IAddress> {
		var query = this.createQuery('ReadAddressByIds');
		query.params = args;
		return query;
	}
	createReadAddressQuery(): dbMOD.DataQuery<Address, IAddress> {
		return this.createQuery('ReadAddress');
	}

}

export interface IAddressInfo {
	readonly AddressID: number;
	readonly AddressLine1: string | null;
	readonly City: string | null;
	readonly StateProvince: string | null;
	readonly CountryRegion: string | null;
}

export type TAddressInfoAspect = dbMOD.EntityAspect<AddressInfo, IAddressInfo, DbContext>;

export interface AddressInfo extends IAddressInfo, dbMOD.IEntityItem {
	readonly _aspect: TAddressInfoAspect;
	readonly CustomerAddresses: CustomerAddress[];
}

class AddressInfoEntity extends RIAPP.CollectionItem<TAddressInfoAspect> implements AddressInfo {
	constructor(aspect: TAddressInfoAspect) {
		super(aspect);
	}
	toString() {
		return 'AddressInfoEntity';
	}
	get AddressID(): number { return this._aspect._getFieldVal('AddressID'); }
	get AddressLine1(): string | null { return this._aspect._getFieldVal('AddressLine1'); }
	get City(): string | null { return this._aspect._getFieldVal('City'); }
	get StateProvince(): string | null { return this._aspect._getFieldVal('StateProvince'); }
	get CountryRegion(): string | null { return this._aspect._getFieldVal('CountryRegion'); }
	get CustomerAddresses(): CustomerAddress[] { return this._aspect._getNavFieldVal('CustomerAddresses'); }
}

export class AddressInfoDb extends dbMOD.DbSet<AddressInfo, IAddressInfo, DbContext>
{
	constructor(dbContext: DbContext) {
		var opts: dbMOD.IDbSetConstuctorOptions = {
			dbContext: dbContext,
			dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "AddressInfo" },
			childAssoc: ([]),
			parentAssoc: ([{ "name": "CustAddrToAddress2", "parentDbSetName": "AddressInfo", "childDbSetName": "CustomerAddress", "childToParentName": "AddressInfo", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "AddressID" }] }])
		};
		opts.dbSetInfo.fieldInfos = ([{ "fieldName": "AddressID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "AddressLine1", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 200, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "City", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 30, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "StateProvince", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CountryRegion", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CustomerAddresses", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "", "nested": null }]);
		super(opts);
	}
	// override
	itemFactory(aspect: TAddressInfoAspect): AddressInfo {
		return new AddressInfoEntity(aspect);
	}
	findEntity(addressID: number): AddressInfo {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString(): string {
		return 'AddressInfoDb';
	}
	createReadAddressInfoQuery(): dbMOD.DataQuery<AddressInfo, IAddressInfo> {
		return this.createQuery('ReadAddressInfo');
	}

}

export interface ICustomer {
	readonly CustomerID: number;
	NameStyle: boolean;
	Title: string | null;
	Suffix: string | null;
	CompanyName: string | null;
	SalesPerson: string | null;
	readonly PasswordHash: string;
	readonly PasswordSalt: string;
	readonly rowguid: string;
	readonly ModifiedDate: Date;
	readonly ComplexProp: ICustomer_ComplexProp;
	AddressCount: number | null;
}

export type TCustomerAspect = dbMOD.EntityAspect<Customer, ICustomer, DbContext>;

export interface Customer extends ICustomer, dbMOD.IEntityItem {
	readonly _aspect: TCustomerAspect;
	readonly CustomerAddresses: CustomerAddress[];
}

class CustomerEntity extends RIAPP.CollectionItem<TCustomerAspect> implements Customer {
	private _ComplexProp: Customer_ComplexProp;
	constructor(aspect: TCustomerAspect) {
		super(aspect);
		this._ComplexProp = null;
	}
	toString() {
		return 'CustomerEntity';
	}
	get CustomerID(): number { return this._aspect._getFieldVal('CustomerID'); }
	get NameStyle(): boolean { return this._aspect._getFieldVal('NameStyle'); }
	set NameStyle(v: boolean) { this._aspect._setFieldVal('NameStyle', v); }
	get Title(): string | null { return this._aspect._getFieldVal('Title'); }
	set Title(v: string | null) { this._aspect._setFieldVal('Title', v); }
	get Suffix(): string | null { return this._aspect._getFieldVal('Suffix'); }
	set Suffix(v: string | null) { this._aspect._setFieldVal('Suffix', v); }
	get CompanyName(): string | null { return this._aspect._getFieldVal('CompanyName'); }
	set CompanyName(v: string | null) { this._aspect._setFieldVal('CompanyName', v); }
	get SalesPerson(): string | null { return this._aspect._getFieldVal('SalesPerson'); }
	set SalesPerson(v: string | null) { this._aspect._setFieldVal('SalesPerson', v); }
	get PasswordHash(): string { return this._aspect._getFieldVal('PasswordHash'); }
	get PasswordSalt(): string { return this._aspect._getFieldVal('PasswordSalt'); }
	get rowguid(): string { return this._aspect._getFieldVal('rowguid'); }
	get ModifiedDate(): Date { return this._aspect._getFieldVal('ModifiedDate'); }
	get ComplexProp(): ICustomer_ComplexProp { if (!this._ComplexProp) { this._ComplexProp = new Customer_ComplexProp('ComplexProp', this._aspect); } return this._ComplexProp; }
	get AddressCount(): number | null { return this._aspect._getFieldVal('AddressCount'); }
	set AddressCount(v: number | null) { this._aspect._setFieldVal('AddressCount', v); }
	get CustomerAddresses(): CustomerAddress[] { return this._aspect._getNavFieldVal('CustomerAddresses'); }
}

export class CustomerDb extends dbMOD.DbSet<Customer, ICustomer, DbContext>
{
	constructor(dbContext: DbContext) {
		var opts: dbMOD.IDbSetConstuctorOptions = {
			dbContext: dbContext,
			dbSetInfo: { "fieldInfos": [], "enablePaging": true, "pageSize": 25, "dbSetName": "Customer" },
			childAssoc: ([]),
			parentAssoc: ([{ "name": "CustAddrToCustomer", "parentDbSetName": "Customer", "childDbSetName": "CustomerAddress", "childToParentName": "Customer", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "CustomerID", "childField": "CustomerID" }] }, { "name": "OrdersToCustomer", "parentDbSetName": "Customer", "childDbSetName": "SalesOrderHeader", "childToParentName": "Customer", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "CustomerID", "childField": "CustomerID" }] }])
		};
		opts.dbSetInfo.fieldInfos = ([{ "fieldName": "CustomerID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "NameStyle", "isPrimaryKey": 0, "dataType": 2, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Title", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Suffix", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 10, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CompanyName", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 128, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SalesPerson", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 256, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "PasswordHash", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 128, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "PasswordSalt", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 10, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 36, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 4, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ComplexProp", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 5, "dependentOn": "", "nested": [{ "fieldName": "FirstName", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "MiddleName", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "LastName", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Name", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 2, "dependentOn": "ComplexProp.FirstName,ComplexProp.MiddleName,ComplexProp.LastName", "nested": null }, { "fieldName": "ComplexProp", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 5, "dependentOn": "", "nested": [{ "fieldName": "EmailAddress", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "^[_a-z0-9-]\u002B(\\.[_a-z0-9-]\u002B)*@[a-z0-9-]\u002B(\\.[a-z0-9-]\u002B)*(\\.[a-z]{2,4})$", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Phone", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 25, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }] }] }, { "fieldName": "AddressCount", "isPrimaryKey": 0, "dataType": 3, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 6, "dependentOn": "", "nested": null }, { "fieldName": "CustomerAddresses", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "", "nested": null }]);
		super(opts);
	}
	// override
	itemFactory(aspect: TCustomerAspect): Customer {
		return new CustomerEntity(aspect);
	}
	findEntity(customerID: number): Customer {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString(): string {
		return 'CustomerDb';
	}
	createReadCustomerQuery(args?: {
		includeNav?: boolean;
	}): dbMOD.DataQuery<Customer, ICustomer> {
		var query = this.createQuery('ReadCustomer');
		query.params = args;
		return query;
	}
	defineComplexProp_NameField(getFunc: (item: Customer) => string | null) { this._defineCalculatedField('ComplexProp.Name', getFunc); }
}

export interface ICustomerAddress {
	CustomerID: number;
	AddressID: number;
	AddressType: string;
	readonly rowguid: string;
	readonly ModifiedDate: Date;
}

export type TCustomerAddressAspect = dbMOD.EntityAspect<CustomerAddress, ICustomerAddress, DbContext>;

export interface CustomerAddress extends ICustomerAddress, dbMOD.IEntityItem {
	readonly _aspect: TCustomerAddressAspect;
	Customer: Customer;
	Address: Address;
	AddressInfo: AddressInfo;
}

class CustomerAddressEntity extends RIAPP.CollectionItem<TCustomerAddressAspect> implements CustomerAddress {
	constructor(aspect: TCustomerAddressAspect) {
		super(aspect);
	}
	toString() {
		return 'CustomerAddressEntity';
	}
	get CustomerID(): number { return this._aspect._getFieldVal('CustomerID'); }
	set CustomerID(v: number) { this._aspect._setFieldVal('CustomerID', v); }
	get AddressID(): number { return this._aspect._getFieldVal('AddressID'); }
	set AddressID(v: number) { this._aspect._setFieldVal('AddressID', v); }
	get AddressType(): string { return this._aspect._getFieldVal('AddressType'); }
	set AddressType(v: string) { this._aspect._setFieldVal('AddressType', v); }
	get rowguid(): string { return this._aspect._getFieldVal('rowguid'); }
	get ModifiedDate(): Date { return this._aspect._getFieldVal('ModifiedDate'); }
	get Customer(): Customer { return this._aspect._getNavFieldVal('Customer'); }
	set Customer(v: Customer) { this._aspect._setNavFieldVal('Customer', v); }
	get Address(): Address { return this._aspect._getNavFieldVal('Address'); }
	set Address(v: Address) { this._aspect._setNavFieldVal('Address', v); }
	get AddressInfo(): AddressInfo { return this._aspect._getNavFieldVal('AddressInfo'); }
	set AddressInfo(v: AddressInfo) { this._aspect._setNavFieldVal('AddressInfo', v); }
}

export class CustomerAddressDb extends dbMOD.DbSet<CustomerAddress, ICustomerAddress, DbContext>
{
	constructor(dbContext: DbContext) {
		var opts: dbMOD.IDbSetConstuctorOptions = {
			dbContext: dbContext,
			dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "CustomerAddress" },
			childAssoc: ([{ "name": "CustAddrToAddress", "parentDbSetName": "Address", "childDbSetName": "CustomerAddress", "childToParentName": "Address", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "AddressID" }] }, { "name": "CustAddrToAddress2", "parentDbSetName": "AddressInfo", "childDbSetName": "CustomerAddress", "childToParentName": "AddressInfo", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "AddressID" }] }, { "name": "CustAddrToCustomer", "parentDbSetName": "Customer", "childDbSetName": "CustomerAddress", "childToParentName": "Customer", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "CustomerID", "childField": "CustomerID" }] }]),
			parentAssoc: ([])
		};
		opts.dbSetInfo.fieldInfos = ([{ "fieldName": "CustomerID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "AddressID", "isPrimaryKey": 2, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "AddressType", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 16, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 4, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Customer", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "CustomerID", "nested": null }, { "fieldName": "Address", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "AddressID", "nested": null }, { "fieldName": "AddressInfo", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "AddressID", "nested": null }]);
		super(opts);
	}
	// override
	itemFactory(aspect: TCustomerAddressAspect): CustomerAddress {
		return new CustomerAddressEntity(aspect);
	}
	findEntity(customerID: number, addressID: number): CustomerAddress {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString(): string {
		return 'CustomerAddressDb';
	}
	createReadAddressForCustomersQuery(args?: {
		custIDs: number[];
	}): dbMOD.DataQuery<CustomerAddress, ICustomerAddress> {
		var query = this.createQuery('ReadAddressForCustomers');
		query.params = args;
		return query;
	}
	createReadCustomerAddressQuery(): dbMOD.DataQuery<CustomerAddress, ICustomerAddress> {
		return this.createQuery('ReadCustomerAddress');
	}

}

export interface ICustomerJSON {
	readonly CustomerID: number;
	Data: string;
	readonly rowguid: string;
}

export type TCustomerJSONAspect = dbMOD.EntityAspect<CustomerJSON, ICustomerJSON, DbContext>;

export interface CustomerJSON extends ICustomerJSON, dbMOD.IEntityItem {
	readonly _aspect: TCustomerJSONAspect;
	readonly Customer: any | null;
}

class CustomerJSONEntity extends RIAPP.CollectionItem<TCustomerJSONAspect> implements CustomerJSON {
	constructor(aspect: TCustomerJSONAspect) {
		super(aspect);
	}
	toString() {
		return 'CustomerJSONEntity';
	}
	get CustomerID(): number { return this._aspect._getFieldVal('CustomerID'); }
	get Data(): string { return this._aspect._getFieldVal('Data'); }
	set Data(v: string) { this._aspect._setFieldVal('Data', v); }
	get rowguid(): string { return this._aspect._getFieldVal('rowguid'); }
	get Customer(): any | null { return this._aspect._getCalcFieldVal('Customer'); }
}

export class CustomerJSONDb extends dbMOD.DbSet<CustomerJSON, ICustomerJSON, DbContext>
{
	constructor(dbContext: DbContext) {
		var opts: dbMOD.IDbSetConstuctorOptions = {
			dbContext: dbContext,
			dbSetInfo: { "fieldInfos": [], "enablePaging": true, "pageSize": 100, "dbSetName": "CustomerJSON" },
			childAssoc: ([]),
			parentAssoc: ([])
		};
		opts.dbSetInfo.fieldInfos = ([{ "fieldName": "CustomerID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Data", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": false, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 16, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 4, "dependentOn": "", "nested": null }, { "fieldName": "Customer", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 2, "dependentOn": "Data", "nested": null }]);
		super(opts);
	}
	// override
	itemFactory(aspect: TCustomerJSONAspect): CustomerJSON {
		return new CustomerJSONEntity(aspect);
	}
	findEntity(customerID: number): CustomerJSON {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString(): string {
		return 'CustomerJSONDb';
	}
	createReadCustomerJSONQuery(): dbMOD.DataQuery<CustomerJSON, ICustomerJSON> {
		return this.createQuery('ReadCustomerJSON');
	}
	defineCustomerField(getFunc: (item: CustomerJSON) => any | null) { this._defineCalculatedField('Customer', getFunc); }
}

export interface ILookUpProduct {
	ProductID: number;
	Name: string;
}

export type TLookUpProductAspect = dbMOD.EntityAspect<LookUpProduct, ILookUpProduct, DbContext>;

export interface LookUpProduct extends ILookUpProduct, dbMOD.IEntityItem {
	readonly _aspect: TLookUpProductAspect;
}

class LookUpProductEntity extends RIAPP.CollectionItem<TLookUpProductAspect> implements LookUpProduct {
	constructor(aspect: TLookUpProductAspect) {
		super(aspect);
	}
	toString() {
		return 'LookUpProductEntity';
	}
	get ProductID(): number { return this._aspect._getFieldVal('ProductID'); }
	set ProductID(v: number) { this._aspect._setFieldVal('ProductID', v); }
	get Name(): string { return this._aspect._getFieldVal('Name'); }
	set Name(v: string) { this._aspect._setFieldVal('Name', v); }
}

export class LookUpProductDb extends dbMOD.DbSet<LookUpProduct, ILookUpProduct, DbContext>
{
	constructor(dbContext: DbContext) {
		var opts: dbMOD.IDbSetConstuctorOptions = {
			dbContext: dbContext,
			dbSetInfo: { "fieldInfos": [], "enablePaging": true, "pageSize": 100, "dbSetName": "LookUpProduct" },
			childAssoc: ([]),
			parentAssoc: ([])
		};
		opts.dbSetInfo.fieldInfos = ([{ "fieldName": "ProductID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Name", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }]);
		super(opts);
	}
	// override
	itemFactory(aspect: TLookUpProductAspect): LookUpProduct {
		return new LookUpProductEntity(aspect);
	}
	findEntity(productID: number): LookUpProduct {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString(): string {
		return 'LookUpProductDb';
	}
	createReadProductLookUpQuery(): dbMOD.DataQuery<LookUpProduct, ILookUpProduct> {
		return this.createQuery('ReadProductLookUp');
	}

}

export interface IProduct {
	readonly ProductID: number;
	Name: string;
	ProductNumber: string;
	Color: string | null;
	StandardCost: number;
	ListPrice: number;
	Size: string | null;
	Weight: number | null;
	ProductCategoryID: number;
	ProductModelID: number | null;
	SellStartDate: Date;
	SellEndDate: Date | null;
	DiscontinuedDate: Date | null;
	readonly rowguid: string;
	readonly ModifiedDate: Date;
	ThumbnailPhotoFileName: string | null;
}

export type TProductAspect = dbMOD.EntityAspect<Product, IProduct, DbContext>;

export interface Product extends IProduct, dbMOD.IEntityItem {
	readonly _aspect: TProductAspect;
	readonly IsActive: boolean | null;
	readonly SalesOrderDetails: SalesOrderDetail[];
}

class ProductEntity extends RIAPP.CollectionItem<TProductAspect> implements Product {
	constructor(aspect: TProductAspect) {
		super(aspect);
	}
	toString() {
		return 'ProductEntity';
	}
	get ProductID(): number { return this._aspect._getFieldVal('ProductID'); }
	get Name(): string { return this._aspect._getFieldVal('Name'); }
	set Name(v: string) { this._aspect._setFieldVal('Name', v); }
	get ProductNumber(): string { return this._aspect._getFieldVal('ProductNumber'); }
	set ProductNumber(v: string) { this._aspect._setFieldVal('ProductNumber', v); }
	get Color(): string | null { return this._aspect._getFieldVal('Color'); }
	set Color(v: string | null) { this._aspect._setFieldVal('Color', v); }
	get StandardCost(): number { return this._aspect._getFieldVal('StandardCost'); }
	set StandardCost(v: number) { this._aspect._setFieldVal('StandardCost', v); }
	get ListPrice(): number { return this._aspect._getFieldVal('ListPrice'); }
	set ListPrice(v: number) { this._aspect._setFieldVal('ListPrice', v); }
	get Size(): string | null { return this._aspect._getFieldVal('Size'); }
	set Size(v: string | null) { this._aspect._setFieldVal('Size', v); }
	get Weight(): number | null { return this._aspect._getFieldVal('Weight'); }
	set Weight(v: number | null) { this._aspect._setFieldVal('Weight', v); }
	get ProductCategoryID(): number { return this._aspect._getFieldVal('ProductCategoryID'); }
	set ProductCategoryID(v: number) { this._aspect._setFieldVal('ProductCategoryID', v); }
	get ProductModelID(): number | null { return this._aspect._getFieldVal('ProductModelID'); }
	set ProductModelID(v: number | null) { this._aspect._setFieldVal('ProductModelID', v); }
	get SellStartDate(): Date { return this._aspect._getFieldVal('SellStartDate'); }
	set SellStartDate(v: Date) { this._aspect._setFieldVal('SellStartDate', v); }
	get SellEndDate(): Date | null { return this._aspect._getFieldVal('SellEndDate'); }
	set SellEndDate(v: Date | null) { this._aspect._setFieldVal('SellEndDate', v); }
	get DiscontinuedDate(): Date | null { return this._aspect._getFieldVal('DiscontinuedDate'); }
	set DiscontinuedDate(v: Date | null) { this._aspect._setFieldVal('DiscontinuedDate', v); }
	get rowguid(): string { return this._aspect._getFieldVal('rowguid'); }
	get ModifiedDate(): Date { return this._aspect._getFieldVal('ModifiedDate'); }
	get IsActive(): boolean | null { return this._aspect._getCalcFieldVal('IsActive'); }
	get ThumbnailPhotoFileName(): string | null { return this._aspect._getFieldVal('ThumbnailPhotoFileName'); }
	set ThumbnailPhotoFileName(v: string | null) { this._aspect._setFieldVal('ThumbnailPhotoFileName', v); }
	get SalesOrderDetails(): SalesOrderDetail[] { return this._aspect._getNavFieldVal('SalesOrderDetails'); }
}

export class ProductDb extends dbMOD.DbSet<Product, IProduct, DbContext>
{
	constructor(dbContext: DbContext) {
		var opts: dbMOD.IDbSetConstuctorOptions = {
			dbContext: dbContext,
			dbSetInfo: { "fieldInfos": [], "enablePaging": true, "pageSize": 25, "dbSetName": "Product" },
			childAssoc: ([]),
			parentAssoc: ([{ "name": "OrdDetailsToProduct", "parentDbSetName": "Product", "childDbSetName": "SalesOrderDetail", "childToParentName": "Product", "parentToChildrenName": "SalesOrderDetails", "onDeleteAction": 0, "fieldRels": [{ "parentField": "ProductID", "childField": "ProductID" }] }])
		};
		opts.dbSetInfo.fieldInfos = ([{ "fieldName": "ProductID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Name", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ProductNumber", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 25, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Color", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 15, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "StandardCost", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ListPrice", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "100,5000", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Size", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 5, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Weight", "isPrimaryKey": 0, "dataType": 4, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 5, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ProductCategoryID", "isPrimaryKey": 0, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ProductModelID", "isPrimaryKey": 0, "dataType": 3, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SellStartDate", "isPrimaryKey": 0, "dataType": 7, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "2000-01-01,2015-01-01", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SellEndDate", "isPrimaryKey": 0, "dataType": 7, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "DiscontinuedDate", "isPrimaryKey": 0, "dataType": 7, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 16, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 4, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "IsActive", "isPrimaryKey": 0, "dataType": 2, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 2, "dependentOn": "SellEndDate", "nested": null }, { "fieldName": "ThumbnailPhotoFileName", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 256, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SalesOrderDetails", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "", "nested": null }]);
		super(opts);
	}
	// override
	itemFactory(aspect: TProductAspect): Product {
		return new ProductEntity(aspect);
	}
	findEntity(productID: number): Product {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString(): string {
		return 'ProductDb';
	}
	createReadProductByIdsQuery(args?: {
		productIDs: number[];
	}): dbMOD.DataQuery<Product, IProduct> {
		var query = this.createQuery('ReadProductByIds');
		query.params = args;
		return query;
	}
	createReadProductQuery(args?: {
		param1: number[];
		param2: string;
	}): dbMOD.DataQuery<Product, IProduct> {
		var query = this.createQuery('ReadProduct');
		query.params = args;
		return query;
	}
	defineIsActiveField(getFunc: (item: Product) => boolean | null) { this._defineCalculatedField('IsActive', getFunc); }
}

export interface IProductCategory {
	readonly ProductCategoryID: number;
	ParentProductCategoryID: number | null;
	Name: string;
	rowguid: string;
	ModifiedDate: Date;
}

export type TProductCategoryAspect = dbMOD.EntityAspect<ProductCategory, IProductCategory, DbContext>;

export interface ProductCategory extends IProductCategory, dbMOD.IEntityItem {
	readonly _aspect: TProductCategoryAspect;
}

class ProductCategoryEntity extends RIAPP.CollectionItem<TProductCategoryAspect> implements ProductCategory {
	constructor(aspect: TProductCategoryAspect) {
		super(aspect);
	}
	toString() {
		return 'ProductCategoryEntity';
	}
	get ProductCategoryID(): number { return this._aspect._getFieldVal('ProductCategoryID'); }
	get ParentProductCategoryID(): number | null { return this._aspect._getFieldVal('ParentProductCategoryID'); }
	set ParentProductCategoryID(v: number | null) { this._aspect._setFieldVal('ParentProductCategoryID', v); }
	get Name(): string { return this._aspect._getFieldVal('Name'); }
	set Name(v: string) { this._aspect._setFieldVal('Name', v); }
	get rowguid(): string { return this._aspect._getFieldVal('rowguid'); }
	set rowguid(v: string) { this._aspect._setFieldVal('rowguid', v); }
	get ModifiedDate(): Date { return this._aspect._getFieldVal('ModifiedDate'); }
	set ModifiedDate(v: Date) { this._aspect._setFieldVal('ModifiedDate', v); }
}

export class ProductCategoryDb extends dbMOD.DbSet<ProductCategory, IProductCategory, DbContext>
{
	constructor(dbContext: DbContext) {
		var opts: dbMOD.IDbSetConstuctorOptions = {
			dbContext: dbContext,
			dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "ProductCategory" },
			childAssoc: ([]),
			parentAssoc: ([])
		};
		opts.dbSetInfo.fieldInfos = ([{ "fieldName": "ProductCategoryID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ParentProductCategoryID", "isPrimaryKey": 0, "dataType": 3, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Name", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 16, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 4, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }]);
		super(opts);
	}
	// override
	itemFactory(aspect: TProductCategoryAspect): ProductCategory {
		return new ProductCategoryEntity(aspect);
	}
	findEntity(productCategoryID: number): ProductCategory {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString(): string {
		return 'ProductCategoryDb';
	}
	createReadProductCategoryQuery(): dbMOD.DataQuery<ProductCategory, IProductCategory> {
		return this.createQuery('ReadProductCategory');
	}

}

export interface IProductModel {
	readonly ProductModelID: number;
	Name: string;
}

export type TProductModelAspect = dbMOD.EntityAspect<ProductModel, IProductModel, DbContext>;

export interface ProductModel extends IProductModel, dbMOD.IEntityItem {
	readonly _aspect: TProductModelAspect;
}

class ProductModelEntity extends RIAPP.CollectionItem<TProductModelAspect> implements ProductModel {
	constructor(aspect: TProductModelAspect) {
		super(aspect);
	}
	toString() {
		return 'ProductModelEntity';
	}
	get ProductModelID(): number { return this._aspect._getFieldVal('ProductModelID'); }
	get Name(): string { return this._aspect._getFieldVal('Name'); }
	set Name(v: string) { this._aspect._setFieldVal('Name', v); }
}

export class ProductModelDb extends dbMOD.DbSet<ProductModel, IProductModel, DbContext>
{
	constructor(dbContext: DbContext) {
		var opts: dbMOD.IDbSetConstuctorOptions = {
			dbContext: dbContext,
			dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "ProductModel" },
			childAssoc: ([]),
			parentAssoc: ([])
		};
		opts.dbSetInfo.fieldInfos = ([{ "fieldName": "ProductModelID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Name", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }]);
		super(opts);
	}
	// override
	itemFactory(aspect: TProductModelAspect): ProductModel {
		return new ProductModelEntity(aspect);
	}
	findEntity(productModelID: number): ProductModel {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString(): string {
		return 'ProductModelDb';
	}
	createReadProductModelQuery(): dbMOD.DataQuery<ProductModel, IProductModel> {
		return this.createQuery('ReadProductModel');
	}

}

export interface ISalesInfo {
	SalesPerson: string;
}

export type TSalesInfoAspect = dbMOD.EntityAspect<SalesInfo, ISalesInfo, DbContext>;

export interface SalesInfo extends ISalesInfo, dbMOD.IEntityItem {
	readonly _aspect: TSalesInfoAspect;
}

class SalesInfoEntity extends RIAPP.CollectionItem<TSalesInfoAspect> implements SalesInfo {
	constructor(aspect: TSalesInfoAspect) {
		super(aspect);
	}
	toString() {
		return 'SalesInfoEntity';
	}
	get SalesPerson(): string { return this._aspect._getFieldVal('SalesPerson'); }
	set SalesPerson(v: string) { this._aspect._setFieldVal('SalesPerson', v); }
}

export class SalesInfoDb extends dbMOD.DbSet<SalesInfo, ISalesInfo, DbContext>
{
	constructor(dbContext: DbContext) {
		var opts: dbMOD.IDbSetConstuctorOptions = {
			dbContext: dbContext,
			dbSetInfo: { "fieldInfos": [], "enablePaging": true, "pageSize": 100, "dbSetName": "SalesInfo" },
			childAssoc: ([]),
			parentAssoc: ([])
		};
		opts.dbSetInfo.fieldInfos = ([{ "fieldName": "SalesPerson", "isPrimaryKey": 1, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }]);
		super(opts);
	}
	// override
	itemFactory(aspect: TSalesInfoAspect): SalesInfo {
		return new SalesInfoEntity(aspect);
	}
	findEntity(salesPerson: string): SalesInfo {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString(): string {
		return 'SalesInfoDb';
	}
	createReadSalesInfoQuery(): dbMOD.DataQuery<SalesInfo, ISalesInfo> {
		return this.createQuery('ReadSalesInfo');
	}

}

export interface ISalesOrderDetail {
	SalesOrderID: number;
	readonly SalesOrderDetailID: number;
	OrderQty: number;
	ProductID: number;
	readonly UnitPrice: number | null;
	readonly UnitPriceDiscount: number | null;
	readonly LineTotal: number;
	readonly rowguid: string;
	readonly ModifiedDate: Date;
}

export type TSalesOrderDetailAspect = dbMOD.EntityAspect<SalesOrderDetail, ISalesOrderDetail, DbContext>;

export interface SalesOrderDetail extends ISalesOrderDetail, dbMOD.IEntityItem {
	readonly _aspect: TSalesOrderDetailAspect;
	SalesOrderHeader: SalesOrderHeader;
	Product: Product;
}

class SalesOrderDetailEntity extends RIAPP.CollectionItem<TSalesOrderDetailAspect> implements SalesOrderDetail {
	constructor(aspect: TSalesOrderDetailAspect) {
		super(aspect);
	}
	toString() {
		return 'SalesOrderDetailEntity';
	}
	get SalesOrderID(): number { return this._aspect._getFieldVal('SalesOrderID'); }
	set SalesOrderID(v: number) { this._aspect._setFieldVal('SalesOrderID', v); }
	get SalesOrderDetailID(): number { return this._aspect._getFieldVal('SalesOrderDetailID'); }
	get OrderQty(): number { return this._aspect._getFieldVal('OrderQty'); }
	set OrderQty(v: number) { this._aspect._setFieldVal('OrderQty', v); }
	get ProductID(): number { return this._aspect._getFieldVal('ProductID'); }
	set ProductID(v: number) { this._aspect._setFieldVal('ProductID', v); }
	get UnitPrice(): number | null { return this._aspect._getFieldVal('UnitPrice'); }
	get UnitPriceDiscount(): number | null { return this._aspect._getFieldVal('UnitPriceDiscount'); }
	get LineTotal(): number { return this._aspect._getFieldVal('LineTotal'); }
	get rowguid(): string { return this._aspect._getFieldVal('rowguid'); }
	get ModifiedDate(): Date { return this._aspect._getFieldVal('ModifiedDate'); }
	get SalesOrderHeader(): SalesOrderHeader { return this._aspect._getNavFieldVal('SalesOrderHeader'); }
	set SalesOrderHeader(v: SalesOrderHeader) { this._aspect._setNavFieldVal('SalesOrderHeader', v); }
	get Product(): Product { return this._aspect._getNavFieldVal('Product'); }
	set Product(v: Product) { this._aspect._setNavFieldVal('Product', v); }
}

export class SalesOrderDetailDb extends dbMOD.DbSet<SalesOrderDetail, ISalesOrderDetail, DbContext>
{
	constructor(dbContext: DbContext) {
		var opts: dbMOD.IDbSetConstuctorOptions = {
			dbContext: dbContext,
			dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "SalesOrderDetail" },
			childAssoc: ([{ "name": "OrdDetailsToOrder", "parentDbSetName": "SalesOrderHeader", "childDbSetName": "SalesOrderDetail", "childToParentName": "SalesOrderHeader", "parentToChildrenName": "SalesOrderDetails", "onDeleteAction": 1, "fieldRels": [{ "parentField": "SalesOrderID", "childField": "SalesOrderID" }] }, { "name": "OrdDetailsToProduct", "parentDbSetName": "Product", "childDbSetName": "SalesOrderDetail", "childToParentName": "Product", "parentToChildrenName": "SalesOrderDetails", "onDeleteAction": 0, "fieldRels": [{ "parentField": "ProductID", "childField": "ProductID" }] }]),
			parentAssoc: ([])
		};
		opts.dbSetInfo.fieldInfos = ([{ "fieldName": "SalesOrderID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SalesOrderDetailID", "isPrimaryKey": 2, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "OrderQty", "isPrimaryKey": 0, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 2, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ProductID", "isPrimaryKey": 0, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "UnitPrice", "isPrimaryKey": 0, "dataType": 4, "isNullable": true, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "UnitPriceDiscount", "isPrimaryKey": 0, "dataType": 4, "isNullable": true, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "LineTotal", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": true, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 17, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 16, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SalesOrderHeader", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "SalesOrderID", "nested": null }, { "fieldName": "Product", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "ProductID", "nested": null }]);
		super(opts);
	}
	// override
	itemFactory(aspect: TSalesOrderDetailAspect): SalesOrderDetail {
		return new SalesOrderDetailEntity(aspect);
	}
	findEntity(salesOrderID: number, salesOrderDetailID: number): SalesOrderDetail {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString(): string {
		return 'SalesOrderDetailDb';
	}
	createReadSalesOrderDetailQuery(): dbMOD.DataQuery<SalesOrderDetail, ISalesOrderDetail> {
		return this.createQuery('ReadSalesOrderDetail');
	}

}

export interface ISalesOrderHeader {
	readonly SalesOrderID: number;
	readonly RevisionNumber: number;
	OrderDate: Date;
	DueDate: Date;
	ShipDate: Date | null;
	readonly Status: number;
	OnlineOrderFlag: boolean;
	readonly SalesOrderNumber: string;
	readonly PurchaseOrderNumber: string | null;
	AccountNumber: string | null;
	CustomerID: number;
	ShipToAddressID: number | null;
	BillToAddressID: number | null;
	ShipMethod: string;
	CreditCardApprovalCode: string | null;
	readonly SubTotal: number;
	readonly TaxAmt: number;
	readonly Freight: number;
	readonly TotalDue: number;
	Comment: string | null;
	readonly rowguid: string;
	readonly ModifiedDate: Date;
}

export type TSalesOrderHeaderAspect = dbMOD.EntityAspect<SalesOrderHeader, ISalesOrderHeader, DbContext>;

export interface SalesOrderHeader extends ISalesOrderHeader, dbMOD.IEntityItem {
	readonly _aspect: TSalesOrderHeaderAspect;
	readonly SalesOrderDetails: SalesOrderDetail[];
	Customer: Customer;
	Address: Address;
	Address1: Address;
}

class SalesOrderHeaderEntity extends RIAPP.CollectionItem<TSalesOrderHeaderAspect> implements SalesOrderHeader {
	constructor(aspect: TSalesOrderHeaderAspect) {
		super(aspect);
	}
	toString() {
		return 'SalesOrderHeaderEntity';
	}
	get SalesOrderID(): number { return this._aspect._getFieldVal('SalesOrderID'); }
	get RevisionNumber(): number { return this._aspect._getFieldVal('RevisionNumber'); }
	get OrderDate(): Date { return this._aspect._getFieldVal('OrderDate'); }
	set OrderDate(v: Date) { this._aspect._setFieldVal('OrderDate', v); }
	get DueDate(): Date { return this._aspect._getFieldVal('DueDate'); }
	set DueDate(v: Date) { this._aspect._setFieldVal('DueDate', v); }
	get ShipDate(): Date | null { return this._aspect._getFieldVal('ShipDate'); }
	set ShipDate(v: Date | null) { this._aspect._setFieldVal('ShipDate', v); }
	get Status(): number { return this._aspect._getFieldVal('Status'); }
	get OnlineOrderFlag(): boolean { return this._aspect._getFieldVal('OnlineOrderFlag'); }
	set OnlineOrderFlag(v: boolean) { this._aspect._setFieldVal('OnlineOrderFlag', v); }
	get SalesOrderNumber(): string { return this._aspect._getFieldVal('SalesOrderNumber'); }
	get PurchaseOrderNumber(): string | null { return this._aspect._getFieldVal('PurchaseOrderNumber'); }
	get AccountNumber(): string | null { return this._aspect._getFieldVal('AccountNumber'); }
	set AccountNumber(v: string | null) { this._aspect._setFieldVal('AccountNumber', v); }
	get CustomerID(): number { return this._aspect._getFieldVal('CustomerID'); }
	set CustomerID(v: number) { this._aspect._setFieldVal('CustomerID', v); }
	get ShipToAddressID(): number | null { return this._aspect._getFieldVal('ShipToAddressID'); }
	set ShipToAddressID(v: number | null) { this._aspect._setFieldVal('ShipToAddressID', v); }
	get BillToAddressID(): number | null { return this._aspect._getFieldVal('BillToAddressID'); }
	set BillToAddressID(v: number | null) { this._aspect._setFieldVal('BillToAddressID', v); }
	get ShipMethod(): string { return this._aspect._getFieldVal('ShipMethod'); }
	set ShipMethod(v: string) { this._aspect._setFieldVal('ShipMethod', v); }
	get CreditCardApprovalCode(): string | null { return this._aspect._getFieldVal('CreditCardApprovalCode'); }
	set CreditCardApprovalCode(v: string | null) { this._aspect._setFieldVal('CreditCardApprovalCode', v); }
	get SubTotal(): number { return this._aspect._getFieldVal('SubTotal'); }
	get TaxAmt(): number { return this._aspect._getFieldVal('TaxAmt'); }
	get Freight(): number { return this._aspect._getFieldVal('Freight'); }
	get TotalDue(): number { return this._aspect._getFieldVal('TotalDue'); }
	get Comment(): string | null { return this._aspect._getFieldVal('Comment'); }
	set Comment(v: string | null) { this._aspect._setFieldVal('Comment', v); }
	get rowguid(): string { return this._aspect._getFieldVal('rowguid'); }
	get ModifiedDate(): Date { return this._aspect._getFieldVal('ModifiedDate'); }
	get SalesOrderDetails(): SalesOrderDetail[] { return this._aspect._getNavFieldVal('SalesOrderDetails'); }
	get Customer(): Customer { return this._aspect._getNavFieldVal('Customer'); }
	set Customer(v: Customer) { this._aspect._setNavFieldVal('Customer', v); }
	get Address(): Address { return this._aspect._getNavFieldVal('Address'); }
	set Address(v: Address) { this._aspect._setNavFieldVal('Address', v); }
	get Address1(): Address { return this._aspect._getNavFieldVal('Address1'); }
	set Address1(v: Address) { this._aspect._setNavFieldVal('Address1', v); }
}

export class SalesOrderHeaderDb extends dbMOD.DbSet<SalesOrderHeader, ISalesOrderHeader, DbContext>
{
	constructor(dbContext: DbContext) {
		var opts: dbMOD.IDbSetConstuctorOptions = {
			dbContext: dbContext,
			dbSetInfo: { "fieldInfos": [], "enablePaging": false, "pageSize": 100, "dbSetName": "SalesOrderHeader" },
			childAssoc: ([{ "name": "OrdersToBillAddr", "parentDbSetName": "Address", "childDbSetName": "SalesOrderHeader", "childToParentName": "Address1", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "BillToAddressID" }] }, { "name": "OrdersToCustomer", "parentDbSetName": "Customer", "childDbSetName": "SalesOrderHeader", "childToParentName": "Customer", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "CustomerID", "childField": "CustomerID" }] }, { "name": "OrdersToShipAddr", "parentDbSetName": "Address", "childDbSetName": "SalesOrderHeader", "childToParentName": "Address", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "ShipToAddressID" }] }]),
			parentAssoc: ([{ "name": "OrdDetailsToOrder", "parentDbSetName": "SalesOrderHeader", "childDbSetName": "SalesOrderDetail", "childToParentName": "SalesOrderHeader", "parentToChildrenName": "SalesOrderDetails", "onDeleteAction": 1, "fieldRels": [{ "parentField": "SalesOrderID", "childField": "SalesOrderID" }] }])
		};
		opts.dbSetInfo.fieldInfos = ([{ "fieldName": "SalesOrderID", "isPrimaryKey": 1, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "RevisionNumber", "isPrimaryKey": 0, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "OrderDate", "isPrimaryKey": 0, "dataType": 7, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "DueDate", "isPrimaryKey": 0, "dataType": 7, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ShipDate", "isPrimaryKey": 0, "dataType": 7, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Status", "isPrimaryKey": 0, "dataType": 3, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "OnlineOrderFlag", "isPrimaryKey": 0, "dataType": 2, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SalesOrderNumber", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 25, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "PurchaseOrderNumber", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 25, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "AccountNumber", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 15, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CustomerID", "isPrimaryKey": 0, "dataType": 3, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ShipToAddressID", "isPrimaryKey": 0, "dataType": 3, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "BillToAddressID", "isPrimaryKey": 0, "dataType": 3, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 4, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ShipMethod", "isPrimaryKey": 0, "dataType": 1, "isNullable": false, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 50, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "CreditCardApprovalCode", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 15, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SubTotal", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "TaxAmt", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Freight", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "TotalDue", "isPrimaryKey": 0, "dataType": 4, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "Comment", "isPrimaryKey": 0, "dataType": 1, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": 0, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "rowguid", "isPrimaryKey": 0, "dataType": 9, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 16, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "ModifiedDate", "isPrimaryKey": 0, "dataType": 6, "isNullable": false, "isReadOnly": true, "isAutoGenerated": true, "isNeedOriginal": true, "maxLength": 8, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 0, "dependentOn": "", "nested": null }, { "fieldName": "SalesOrderDetails", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "", "nested": null }, { "fieldName": "Customer", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "CustomerID", "nested": null }, { "fieldName": "Address", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "ShipToAddressID", "nested": null }, { "fieldName": "Address1", "isPrimaryKey": 0, "dataType": 0, "isNullable": true, "isReadOnly": false, "isAutoGenerated": false, "isNeedOriginal": true, "maxLength": -1, "dateConversion": 0, "allowClientDefault": false, "range": "", "regex": "", "fieldType": 3, "dependentOn": "BillToAddressID", "nested": null }]);
		super(opts);
	}
	// override
	itemFactory(aspect: TSalesOrderHeaderAspect): SalesOrderHeader {
		return new SalesOrderHeaderEntity(aspect);
	}
	findEntity(salesOrderID: number): SalesOrderHeader {
		return this.findByPK(RIAPP.Utils.arr.fromList(arguments));
	}
	toString(): string {
		return 'SalesOrderHeaderDb';
	}
	createReadSalesOrderHeaderQuery(): dbMOD.DataQuery<SalesOrderHeader, ISalesOrderHeader> {
		return this.createQuery('ReadSalesOrderHeader');
	}

}

export interface IAssocs {
	getCustAddrToAddress: () => dbMOD.Association;
	getCustAddrToAddress2: () => dbMOD.Association;
	getCustAddrToCustomer: () => dbMOD.Association;
	getOrdDetailsToOrder: () => dbMOD.Association;
	getOrdDetailsToProduct: () => dbMOD.Association;
	getOrdersToBillAddr: () => dbMOD.Association;
	getOrdersToCustomer: () => dbMOD.Association;
	getOrdersToShipAddr: () => dbMOD.Association;
}


export class DbSets extends dbMOD.DbSets {
	constructor(dbContext: DbContext) {
		super(dbContext);
		this._createDbSet("Address", AddressDb);
		this._createDbSet("AddressInfo", AddressInfoDb);
		this._createDbSet("Customer", CustomerDb);
		this._createDbSet("CustomerAddress", CustomerAddressDb);
		this._createDbSet("CustomerJSON", CustomerJSONDb);
		this._createDbSet("LookUpProduct", LookUpProductDb);
		this._createDbSet("Product", ProductDb);
		this._createDbSet("ProductCategory", ProductCategoryDb);
		this._createDbSet("ProductModel", ProductModelDb);
		this._createDbSet("SalesInfo", SalesInfoDb);
		this._createDbSet("SalesOrderDetail", SalesOrderDetailDb);
		this._createDbSet("SalesOrderHeader", SalesOrderHeaderDb);
	}
	get Address() { return <AddressDb>this.getDbSet("Address"); }
	get AddressInfo() { return <AddressInfoDb>this.getDbSet("AddressInfo"); }
	get Customer() { return <CustomerDb>this.getDbSet("Customer"); }
	get CustomerAddress() { return <CustomerAddressDb>this.getDbSet("CustomerAddress"); }
	get CustomerJSON() { return <CustomerJSONDb>this.getDbSet("CustomerJSON"); }
	get LookUpProduct() { return <LookUpProductDb>this.getDbSet("LookUpProduct"); }
	get Product() { return <ProductDb>this.getDbSet("Product"); }
	get ProductCategory() { return <ProductCategoryDb>this.getDbSet("ProductCategory"); }
	get ProductModel() { return <ProductModelDb>this.getDbSet("ProductModel"); }
	get SalesInfo() { return <SalesInfoDb>this.getDbSet("SalesInfo"); }
	get SalesOrderDetail() { return <SalesOrderDetailDb>this.getDbSet("SalesOrderDetail"); }
	get SalesOrderHeader() { return <SalesOrderHeaderDb>this.getDbSet("SalesOrderHeader"); }
}

export class DbContext extends dbMOD.DbContext<DbSets, ISvcMethods, IAssocs>
{
	protected _createDbSets(): DbSets {
		return new DbSets(this);
	}
	protected _createAssociations(): dbMOD.IAssociationInfo[] {
		return [{ "name": "CustAddrToAddress", "parentDbSetName": "Address", "childDbSetName": "CustomerAddress", "childToParentName": "Address", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "AddressID" }] }, { "name": "CustAddrToAddress2", "parentDbSetName": "AddressInfo", "childDbSetName": "CustomerAddress", "childToParentName": "AddressInfo", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "AddressID" }] }, { "name": "CustAddrToCustomer", "parentDbSetName": "Customer", "childDbSetName": "CustomerAddress", "childToParentName": "Customer", "parentToChildrenName": "CustomerAddresses", "onDeleteAction": 0, "fieldRels": [{ "parentField": "CustomerID", "childField": "CustomerID" }] }, { "name": "OrdDetailsToOrder", "parentDbSetName": "SalesOrderHeader", "childDbSetName": "SalesOrderDetail", "childToParentName": "SalesOrderHeader", "parentToChildrenName": "SalesOrderDetails", "onDeleteAction": 1, "fieldRels": [{ "parentField": "SalesOrderID", "childField": "SalesOrderID" }] }, { "name": "OrdDetailsToProduct", "parentDbSetName": "Product", "childDbSetName": "SalesOrderDetail", "childToParentName": "Product", "parentToChildrenName": "SalesOrderDetails", "onDeleteAction": 0, "fieldRels": [{ "parentField": "ProductID", "childField": "ProductID" }] }, { "name": "OrdersToBillAddr", "parentDbSetName": "Address", "childDbSetName": "SalesOrderHeader", "childToParentName": "Address1", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "BillToAddressID" }] }, { "name": "OrdersToCustomer", "parentDbSetName": "Customer", "childDbSetName": "SalesOrderHeader", "childToParentName": "Customer", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "CustomerID", "childField": "CustomerID" }] }, { "name": "OrdersToShipAddr", "parentDbSetName": "Address", "childDbSetName": "SalesOrderHeader", "childToParentName": "Address", "parentToChildrenName": null, "onDeleteAction": 0, "fieldRels": [{ "parentField": "AddressID", "childField": "ShipToAddressID" }] }];
	}
	protected _createMethods(): dbMOD.IQueryInfo[] {
		return [{ "methodName": "ReadAddress", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadAddressByIds", "parameters": [{ "name": "addressIDs", "dataType": 3, "isArray": true, "isNullable": false, "dateConversion": 0, "ordinal": 0 }], "methodResult": true, "isQuery": true }, { "methodName": "ReadAddressForCustomers", "parameters": [{ "name": "custIDs", "dataType": 3, "isArray": true, "isNullable": false, "dateConversion": 0, "ordinal": 0 }], "methodResult": true, "isQuery": true }, { "methodName": "ReadAddressInfo", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadCustomer", "parameters": [{ "name": "includeNav", "dataType": 2, "isArray": false, "isNullable": true, "dateConversion": 0, "ordinal": 0 }], "methodResult": true, "isQuery": true }, { "methodName": "ReadCustomerAddress", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadCustomerJSON", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadProduct", "parameters": [{ "name": "param1", "dataType": 3, "isArray": true, "isNullable": false, "dateConversion": 0, "ordinal": 0 }, { "name": "param2", "dataType": 1, "isArray": false, "isNullable": false, "dateConversion": 0, "ordinal": 1 }], "methodResult": true, "isQuery": true }, { "methodName": "ReadProductByIds", "parameters": [{ "name": "productIDs", "dataType": 3, "isArray": true, "isNullable": false, "dateConversion": 0, "ordinal": 0 }], "methodResult": true, "isQuery": true }, { "methodName": "ReadProductCategory", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadProductLookUp", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadProductModel", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadSalesInfo", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadSalesOrderDetail", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "ReadSalesOrderHeader", "parameters": [], "methodResult": true, "isQuery": true }, { "methodName": "GetClassifiers", "parameters": [], "methodResult": true, "isQuery": false }, { "methodName": "TestComplexInvoke", "parameters": [{ "name": "info", "dataType": 0, "isArray": false, "isNullable": false, "dateConversion": 0, "ordinal": 0 }, { "name": "keys", "dataType": 0, "isArray": true, "isNullable": false, "dateConversion": 0, "ordinal": 1 }], "methodResult": true, "isQuery": false }, { "methodName": "TestInvoke", "parameters": [{ "name": "param1", "dataType": 10, "isArray": false, "isNullable": false, "dateConversion": 0, "ordinal": 0 }, { "name": "param2", "dataType": 1, "isArray": false, "isNullable": false, "dateConversion": 0, "ordinal": 1 }], "methodResult": true, "isQuery": false }];
	}
}
