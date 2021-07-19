import * as RIAPP from "jriapp";
import * as dbMOD from "jriapp_db";

import * as DEMODB from "../demo/demoDB";
import * as COMMON from "common";
import * as HEADER from "header";
import * as  SSEVENTS from "ssevents"
import * as  WEBSOCK from "websocket"

import { ProductViewModel } from "./productVM";
import { UploadThumbnailVM } from "./uploads";

export interface IMainOptions extends RIAPP.IAppOptions {
    service_url: string;
    permissionInfo?: dbMOD.IPermissionsInfo;
    upload_thumb_url: string;
    templates_url: string;
    productEditTemplate_url: string;
    modelData: any;
    categoryData: any;
    sse_url: string;
    sse_clientID: string;
}

//strongly typed aplication's class
export class DemoApplication extends RIAPP.Application<IMainOptions> {
    private _dbContext: DEMODB.DbContext;
    private _errorVM: COMMON.ErrorViewModel;
    private _headerVM: HEADER.HeaderVM;
    private _productVM: ProductViewModel;
    private _uploadVM: UploadThumbnailVM;
    private _sseVM: SSEVENTS.SSEventsVM;
    private _sseMessage: string;
    private _websockVM: WEBSOCK.WebSocketsVM;

    constructor(options: IMainOptions) {
        super(options);
        this._dbContext = null;
        this._errorVM = null;
        this._headerVM = null;
        this._productVM = null;
        this._uploadVM = null;
        this._sseVM = null;
        this._websockVM = null;
    }
    onStartUp() {
        const self = this, options: IMainOptions = self.options;
        this._dbContext = new DEMODB.DbContext();
        this._dbContext.addOnDbSetCreating((s, a) => {
            console.log("DbSet: %s is creating", a.name);
        });
        this._dbContext.initialize({ serviceUrl: options.service_url, permissions: options.permissionInfo });
        this._dbContext.dbSets.Product.defineIsActiveField(function (item) {
            return !item.SellEndDate;
        });
        this._errorVM = new COMMON.ErrorViewModel(this);
        this._headerVM = new HEADER.HeaderVM(this);
        this._productVM = new ProductViewModel(this);
        this._uploadVM = new UploadThumbnailVM(this, options.upload_thumb_url);
        function handleError(sender: any, data: any) {
            self._handleError(sender, data);
        };
        //here we could process application's errors
        this.objEvents.addOnError(handleError);
        this._dbContext.objEvents.addOnError(handleError);
        //instead of server side events i added websocket

        if (!!options.sse_url && SSEVENTS.SSEventsVM.isSupported()) {
            this._sseVM = new SSEVENTS.SSEventsVM(options.sse_url, options.sse_clientID);
            this._sseVM.addOnMessage((s, a) => { self._sseMessage = a.data.message; self.objEvents.raiseProp('sseMessage'); });
            this._sseVM.objEvents.addOnError(handleError);
        }


        if (WEBSOCK.WebSocketsVM.isSupported()) {
            this._websockVM = new WEBSOCK.WebSocketsVM(WEBSOCK.WebSocketsVM.createUrl(81, 'PollingService', false));
            this._websockVM.addOnMessage(this._onWebsockMsg, this.uniqueID, this);
            this._websockVM.objEvents.addOnError(handleError);
        }

        //adding event handler for our custom event
        this._uploadVM.addOnFilesUploaded(function (s, a) {
            //need to update ThumbnailPhotoFileName
            a.product._aspect.refresh();
        });

        super.onStartUp();
    }
    private _handleError(sender: any, data: any) {
        debugger;
        data.isHandled = true;
        this.errorVM.error = data.error;
        this.errorVM.showDialog();
    }
    private _onWebsockMsg(sender: WEBSOCK.WebSocketsVM, args: { message: string; data: any; }) {
        this._sseMessage = args.data.message; this.objEvents.raiseProp('sseMessage');
    }
    //really, the dispose method is redundant here because the application lives while the page lives
    dispose() {
        if (this.getIsDisposed())
            return;
        this.setDisposing();
        const self = this;
        try {
            self._errorVM.dispose();
            self._headerVM.dispose();
            self._productVM.dispose();
            self._uploadVM.dispose();
            self._dbContext.dispose();
            if (!!self._sseVM)
                self._sseVM.dispose();
        } finally {
            super.dispose();
        }
    }
    get dbContext() { return this._dbContext; }
    get errorVM() { return this._errorVM; }
    get headerVM() { return this._headerVM; }
    get productVM() { return this._productVM; }
    get uploadVM() { return this._uploadVM; }
    //server side events and websocket
    get sseMessage() { return this._sseMessage; }
    get sseVM() { return this._sseVM; }
    get websockVM() { return this._websockVM; }
}