import * as RIAPP from "jriapp";
import * as dbMOD from "jriapp_db";
import * as uiMOD from "jriapp_ui";

import * as DEMODB from "./domainModel";
import { DemoApplication } from "./app";
import { IMyGridEvents, OrderGridEvents } from "./gridEvents";
import { CustomerVM } from "./customerVM";
import { AddressVM } from "./addressVM";
import { OrderDetailVM } from "./orderDetVM";

const utils = RIAPP.Utils, dates = utils.dates;

export class OrderVM extends RIAPP.ViewModel<DemoApplication> implements uiMOD.ITabsEvents {
    private _customerVM: CustomerVM;
    private _dbSet: DEMODB.SalesOrderHeaderDb;
    private _currentCustomer: DEMODB.Customer;
    private _gridEvents: IMyGridEvents<DEMODB.SalesOrderHeader>;
    private _selectedTabIndex: number;
    private _orderStatuses: DEMODB.KeyValDictionary;
    private _addNewCommand: RIAPP.ICommand;
    private _addressVM: AddressVM;
    private _orderDetailVM: OrderDetailVM;
    private _tabs: uiMOD.ITabs;

    constructor(customerVM: CustomerVM) {
        super(customerVM.app);
        const self = this;
        this._customerVM = customerVM;
        this._dbSet = this.dbSets.SalesOrderHeader;
        this._currentCustomer = null;
        this._gridEvents = new OrderGridEvents(this);
        this._selectedTabIndex = null;
        this._orderStatuses = new DEMODB.KeyValDictionary();
        this._orderStatuses.fillItems([{ key: 0, val: 'New Order' }, { key: 1, val: 'Status 1' },
        { key: 2, val: 'Status 2' }, { key: 3, val: 'Status 3' },
        { key: 4, val: 'Status 4' }, { key: 5, val: 'Completed Order' }], true);
        this._tabs = null;

        //loads the data only when customer's row is expanded
        this._customerVM.objEvents.on('row_expanded', function (_s, args) {
            if (args.isExpanded) {
                self.currentCustomer = args.customer;
            }
            else {
                self.currentCustomer = null;
            }
        }, self.uniqueID);

        this._dbSet.objEvents.onProp('currentItem', function (_s, args) {
            self._onCurrentChanged();
        }, self.uniqueID);

        this._dbSet.addOnItemDeleting(function (_s, args) {
            if (!confirm('Are you sure that you want to delete the order?'))
                args.isCancel = true;
        }, self.uniqueID);


        this._dbSet.addOnItemAdded(function (_s, args) {
            const item = args.item;
            item.Customer = self.currentCustomer;
            item.OrderDate = new Date();
            item.DueDate = dates.add(new Date(), 7, RIAPP.TIME_KIND.DAY);
            item.OnlineOrderFlag = false;
        }, self.uniqueID);


        //adds new order - uses dialog to fill the data
        this._addNewCommand = new RIAPP.Command(function () {
            //the dialog shown by the datagrid
            self._dbSet.addNew();
        });

        this._addressVM = new AddressVM(this);
        this._orderDetailVM = new OrderDetailVM(this);
    }
    //#begin uiMOD.ITabsEvents
    addTabs(tabs: uiMOD.ITabs): void {
        this._tabs = tabs;
    }
    removeTabs(): void {
        this._tabs = null;
    }
    onTabSelected(tabs: uiMOD.ITabs): void {
        this._selectedTabIndex = tabs.tabIndex;
        this.objEvents.raiseProp('selectedTabIndex');

        if (this._selectedTabIndex == 2) {
            //load details only when the tab which contains the details grid is selected
            this._orderDetailVM.currentOrder = this.dbSet.currentItem;
        }
    }
    //#end uiMOD.ITabsEvents

    _onGridPageChanged() {
    }
    _onGridRowSelected(item: DEMODB.SalesOrderHeader) {
    }
    _onGridRowExpanded(item: DEMODB.SalesOrderHeader) {
        this.objEvents.raise('row_expanded', { order: item, isExpanded: true });
        if (!!this._tabs)
            this.onTabSelected(this._tabs);
    }
    _onGridRowCollapsed(item: DEMODB.SalesOrderHeader) {
        this.objEvents.raise('row_expanded', { order: item, isExpanded: false });
    }

    protected _onCurrentChanged() {
        this.objEvents.raiseProp('currentItem');
    }
    clear() {
        this.dbSet.clear();
    }
    //returns promise
    load() {
        //explicitly clear before every load
        this.clear();
        if (!this.currentCustomer || this.currentCustomer._aspect.isNew) {
            let deferred = utils.async.createDeferred<dbMOD.IQueryResult<DEMODB.SalesOrderHeader>>();
            deferred.reject();
            return deferred.promise();
        }
        let query = this.dbSet.createReadSalesOrderHeaderQuery();
        query.where('CustomerID', RIAPP.FILTER_TYPE.Equals, [this.currentCustomer.CustomerID]);
        query.orderBy('OrderDate').thenBy('SalesOrderID');
        return query.load();
    }
    dispose() {
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
        super.dispose();
    }
    get dbContext() { return this.app.dbContext; }
    get dbSets() { return this.dbContext.dbSets; }
    get currentItem() { return this._dbSet.currentItem; }
    get dbSet() { return this._dbSet; }
    get addNewCommand() { return this._addNewCommand; }
    get orderStatuses() { return this._orderStatuses; }
    get currentCustomer() { return this._currentCustomer; }
    set currentCustomer(v: DEMODB.Customer) {
        if (v !== this._currentCustomer) {
            this._currentCustomer = v;
            this.objEvents.raiseProp('currentCustomer');
            this.load();
        }
    }
    get customerVM() { return this._customerVM; }
    get orderDetailsVM() { return this._orderDetailVM; }
    get selectedTabIndex() { return this._selectedTabIndex; }
    get tabsEvents(): uiMOD.ITabsEvents { return this; }
    get gridEvents() { return this._gridEvents; }
}