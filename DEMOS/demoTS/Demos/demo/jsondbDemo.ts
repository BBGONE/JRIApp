import * as RIAPP from "jriapp";
import * as dbMOD from "jriapp_db";

import * as DEMODB from "./demoDB";
import * as COMMON from "common";

const bootstrapper = RIAPP.bootstrapper;

export class CustomerBag extends RIAPP.JsonBag {
    private _addresses: RIAPP.JsonArray = null;
 
    constructor(item: DEMODB.CustomerJSON) {
        super(item.Data, (data: string) => {
            const dbSet = item._aspect.dbSet, saveIsEditing = item._aspect.isEditing;
            if (item.Data !== data) {

                if (!saveIsEditing) {
                    dbSet.isUpdating = true;
                    item._aspect.beginEdit();
                }

                //update data
                item.Data = data;

                if (!saveIsEditing) {
                    item._aspect.endEdit();
                    dbSet.isUpdating = false;
                }
            }
        });

        item.objEvents.onProp("Data", (s, a) => {
            this.resetJson(item.Data);
        }, null, null, RIAPP.TPriority.AboveNormal);

        this.initCustomerValidations();
    }
    private initCustomerValidations(): void {
        const validations = [{
            fieldName: <string>null, fn: (bag: RIAPP.IPropertyBag, errors: string[]) => {
                if (!bag.getProp("[Level1.Level2.Phone]") && !bag.getProp("[Level1.Level2.EmailAddress]")) {
                    errors.push('at least Phone or Email address must be filled');
                }
            }
        },
        {
            fieldName: "[Title]", fn: (bag: RIAPP.IPropertyBag, errors: string[]) => {
                if (!bag.getProp("[Title]")) {
                    errors.push('Title must be filled');
                }
            }
        },
        {
            fieldName: "[Level1.FirstName]", fn: (bag: RIAPP.IPropertyBag, errors: string[]) => {
                if (!bag.getProp("[Level1.FirstName]")) {
                    errors.push('First name must be filled');
                }
            }
        },
        {
            fieldName: "[Level1.LastName]", fn: (bag: RIAPP.IPropertyBag, errors: string[]) => {
                if (!bag.getProp("[Level1.LastName]")) {
                    errors.push('Last name must be filled');
                }
            }
        }];

        //perform all validations
        this.addOnValidateBag((s, args) => {
            let bag = args.bag;
            validations.forEach((val) => {
                let errors: string[] = [];
                val.fn(bag, errors);
                if (errors.length > 0)
                    args.result.push({ fieldName: val.fieldName, errors: errors });
            });
        });

        //validate only specific field
        this.addOnValidateField((s, args) => {
            let bag = args.bag;
            validations.filter((val) => {
                return args.fieldName === val.fieldName;
            }).forEach((val) => {
                val.fn(bag, args.errors);
            });
        });
    }
    private initAddressValidations(addresses: RIAPP.JsonArray): void {
        const validations = [{
            fieldName: "[City]", fn: (bag: RIAPP.IPropertyBag, errors: string[]) => {
                if (!bag.getProp("[City]")) {
                    errors.push('City must be filled');
                }
            }
        },
        {
            fieldName: "[Line1]", fn: (bag: RIAPP.IPropertyBag, errors: string[]) => {
                if (!bag.getProp("[Line1]")) {
                    errors.push('Line1 name must be filled');
                }
            }
        }];

        //perform all validations
        addresses.addOnValidateBag((s, args) => {
            let bag = args.bag;
            validations.forEach((val) => {
                let errors: string[] = [];
                val.fn(bag, errors);
                if (errors.length > 0)
                    args.result.push({ fieldName: val.fieldName, errors: errors });
            });
        });

        //validate only specific field
        addresses.addOnValidateField((s, args) => {
            let bag = args.bag;
            validations.filter((val) => {
                return args.fieldName === val.fieldName;
            }).forEach((val) => {
                val.fn(bag, args.errors);
            });
        });
    }
    dispose() {
        if (this.getIsDisposed())
            return;
        this.setDisposing();
        if (!!this._addresses) {
            this._addresses.dispose();
        }
        this._addresses = null;
        super.dispose();
    }
    get Addresses() {
        if (this.getIsStateDirty())
            return void 0;
        if (!this._addresses) {
            this._addresses = new RIAPP.JsonArray(this, "Addresses");
            this.initAddressValidations(this._addresses);
        }
        return this._addresses.list;
    }
    //just for testing eval in converter param (instead of fixed param value)
    get dateFormat(): string
    {
        return "DD.MM.YYYY HH:mm:ss";
    }
}

export class CustomerViewModel extends RIAPP.ViewModel<DemoApplication> {
    private _dbSet: DEMODB.CustomerJSONDb;
    private _addNewCommand: RIAPP.ICommand;
    private _addNewAddrCommand: RIAPP.ICommand;
    private _saveCommand: RIAPP.ICommand;
    private _undoCommand: RIAPP.ICommand;
    private _loadCommand: RIAPP.ICommand;
    private _propWatcher: RIAPP.PropWatcher;

    constructor(app: DemoApplication) {
        super(app);
        const self = this;
        this._dbSet = this.dbSets.CustomerJSON;
        this._propWatcher = new RIAPP.PropWatcher();
     
        //when currentItem property changes, invoke our viewmodel's method
        this._dbSet.objEvents.onProp('currentItem', function (_s, data) {
            self._onCurrentChanged();
        }, self.uniqueID);

        //if we need to confirm the deletion, this is how it is done
        this._dbSet.addOnItemDeleting(function (_s, args) {
            if (!confirm('Are you sure that you want to delete ' + args.item.CustomerID + ' ?'))
                args.isCancel = true;
        }, self.uniqueID);


        //auto submit changes when an entity is deleted
        this._dbSet.isSubmitOnDelete = true;

        //adds new product - uses dialog to enter the data
        this._addNewCommand = new RIAPP.Command(function () {
            //grid will show the edit dialog, because we set grid options isHandleAddNew:true
            //see the options for the grid on the HTML demo page
            let item = self._dbSet.addNew();
            item.Data = JSON.stringify({});
            //P.S. - grids editor options also has submitOnOK:true, which means
            //on clicking OK button all changes are submitted to the service
        });

        this._addNewAddrCommand = new RIAPP.Command(() => {
            const curCustomer = <CustomerBag>self.currentItem.Customer;
            curCustomer.Addresses.addNew();
        }, () => {
            return !!self.currentItem;
        });

        this._saveCommand = new RIAPP.Command(() => {
            self.dbContext.submitChanges();
        }, () => {
            //the command is enabled when there are pending changes
            return self.dbContext.isHasChanges;
        });

        //with typed "this" inside the callbacks
        this._undoCommand = new RIAPP.Command(() => {
            this.dbContext.rejectChanges();
        }, () => {
            //the command is enabled when there are pending changes
            return this.dbContext.isHasChanges;
        });

        //the property watcher helps us handling properties changes
        //more convenient than using addOnPropertyChange
        this._propWatcher.addPropWatch(self.dbContext, 'isHasChanges', function (prop) {
            self._saveCommand.raiseCanExecuteChanged();
            self._undoCommand.raiseCanExecuteChanged();
        });

        //loads data from the server for the products (with typed "this" inside the callback)
        this._loadCommand = new RIAPP.Command(() => {
            this.load();
        });

        this._dbSet.defineCustomerField(function (item) {
            let bag = <CustomerBag>item._aspect.getCustomVal("jsonBag");
            if (!bag) {
                bag = new CustomerBag(item);
                item._aspect.setCustomVal("jsonBag", bag);
            }
            return bag;
        });
    }
    protected _onCurrentChanged() {
        this._addNewAddrCommand.raiseCanExecuteChanged();
        this.objEvents.raiseProp('currentItem');
    }
    load() {
        let query = this.dbSet.createReadCustomerJSONQuery();
        query.pageSize = 50;
        query.orderBy('CustomerID');
        return query.load();
    }
    dispose() {
        if (this.getIsDisposed())
            return;
        this.setDisposing();
        if (!!this._dbSet) {
            this._dbSet.objEvents.offNS(this.uniqueID);
        }
        super.dispose();
    }
    get dbSet() { return this._dbSet; }
    get addNewCommand() { return this._addNewCommand; }
    get addNewAddrCommand() { return this._addNewAddrCommand; }
    get saveCommand() { return this._saveCommand; }
    get undoCommand() { return this._undoCommand; }
    get dbContext() { return this.app.dbContext; }
    get dbSets() { return this.dbContext.dbSets; }
    get currentItem() { return this._dbSet.currentItem; }
    get loadCommand() { return this._loadCommand; }
}

export interface IMainOptions extends RIAPP.IAppOptions {
    service_url: string;
    permissionInfo?: dbMOD.IPermissionsInfo;
}

//strongly typed aplication's class
export class DemoApplication extends RIAPP.Application<IMainOptions> {
    private _dbContext: DEMODB.DbContext;
    private _errorVM: COMMON.ErrorViewModel;
    private _customerVM: CustomerViewModel;

    constructor(options: IMainOptions) {
        super(options);
        this._dbContext = null;
        this._errorVM = null;
        this._customerVM = null;
    }
    onStartUp() {
        const self = this, options: IMainOptions = self.options;
        this._dbContext = new DEMODB.DbContext();
        this._dbContext.initialize({ serviceUrl: options.service_url, permissions: options.permissionInfo });
        this._errorVM = new COMMON.ErrorViewModel(this);
        this._customerVM = new CustomerViewModel(this);
        function handleError(sender: any, data: any) {
            self._handleError(sender, data);
        };
        //here we could process application's errors
        this.objEvents.addOnError(handleError);
        this._dbContext.objEvents.addOnError(handleError);

        super.onStartUp();
    }
    private _handleError(sender: any, data: any) {
        debugger;
        data.isHandled = true;
        this.errorVM.error = data.error;
        this.errorVM.showDialog();
    }
    //really, the dispose method is redundant here because the application lives while the page lives
    dispose() {
        if (this.getIsDisposed())
            return;
        this.setDisposing();
        const self = this;
        try {
            self._errorVM.dispose();
            self._customerVM.dispose();
            self._dbContext.dispose();
        } finally {
            super.dispose();
        }
    }
    get dbContext() { return this._dbContext; }
    get errorVM() { return this._errorVM; }
    get customerVM() { return this._customerVM; }
    //just for testing eval in converter param (instead of fixed param value)
    get dateFormat(): string {
        return "MM.DD.YYYY HH:mm:ss";
    }
}

//bootstrapper error handler - the last resort (typically display message to the user)
bootstrapper.objEvents.addOnError(function (_s, args) {
    debugger;
    alert(args.error.message);
    args.isHandled = true;
});

export function start(options: IMainOptions) {

    options.modulesInits = {
        "COMMON": COMMON.initModule
    };

    bootstrapper.init((bootstrapper) => {
        //replace default buttons styles with something custom
        const ButtonsCSS = bootstrapper.defaults.ButtonsCSS;
        ButtonsCSS.Edit = 'icon icon-pencil';
        ButtonsCSS.Delete = 'icon icon-trash';
        ButtonsCSS.OK = 'icon icon-ok';
        ButtonsCSS.Cancel = 'icon icon-remove';
    });

    //create and start application here
    return bootstrapper.startApp(() => {
        return new DemoApplication(options);
    }, (app) => { }).then((app) => {
        return app.customerVM.load();
    });
}