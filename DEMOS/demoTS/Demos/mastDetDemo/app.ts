import * as RIAPP from "jriapp";
import * as dbMOD from "jriapp_db";
import * as uiMOD from "jriapp_ui";

import * as DEMODB from "../demo/demoDB";
import * as COMMON from "common";
import { CustomerVM } from "./customerVM";

export interface IMainOptions extends RIAPP.IAppOptions {
    service_url: string;
    permissionInfo?: dbMOD.IPermissionsInfo;
}

export class DemoApplication extends RIAPP.Application<IMainOptions> {
    private _dbContext: DEMODB.DbContext;
    private _errorVM: COMMON.ErrorViewModel;
    private _customerVM: CustomerVM;

    constructor(options: IMainOptions) {
        super(options);
        const self = this;
        this._dbContext = null;
        this._errorVM = null;
        this._customerVM = null;
    }
    onStartUp() {
        const self = this, options: IMainOptions = self.options;
        this._dbContext = new DEMODB.DbContext();
        this._dbContext.initialize({ serviceUrl: options.service_url, permissions: options.permissionInfo });
        function toText(str: any) {
            if (str === null)
                return '';
            else
                return str;
        };

        this._dbContext.dbSets.Customer.defineComplexProp_NameField(function (item) {
            //executed in the context of the entity
            return toText(item.ComplexProp.LastName) + '  ' + toText(item.ComplexProp.MiddleName) + '  ' + toText(item.ComplexProp.FirstName);
        });
        this.registerSvc("$dbContext", this._dbContext);
        this._errorVM = new COMMON.ErrorViewModel(this);
        this._customerVM = new CustomerVM(this);

        function handleError(sender: any, data: any) {
            self._handleError(sender, data);
        };
        //here we could process application's errors
        this.objEvents.addOnError(handleError);
        this._dbContext.objEvents.addOnError(handleError);

        //testing returning  a promise from this method
        /*
        let deferred = RIAPP.Utils.async.createDeferred();
        setTimeout(() => {
            deferred.resolve();
            //deferred.reject(new Error("TEST ERROR"));
        }, 10000);
        return deferred.promise();
        */
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
    get TEXT() { return RIAPP.LocaleSTRS.TEXT; }
}