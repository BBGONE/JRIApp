import * as RIAPP from "jriapp";
import * as dbMOD from "jriapp_db";
import * as FOLDERBROWSER_SVC from "./folderBrowserSvc";
import * as COMMON from "common";
import { ExProps, infoType } from "./ExProps";

let bootstrapper = RIAPP.bootstrapper, utils = RIAPP.Utils;

export interface IMainOptions extends RIAPP.IAppOptions {
    service_url: string;
    permissionInfo?: dbMOD.IPermissionsInfo;
    styles: string[];
}

export interface IOptions {
    service_url: string;
    permissionInfo?: dbMOD.IPermissionsInfo;
    includeFiles: boolean;
}

export interface IFolderBrowserOptions {
    service_url: string;
    permissionInfo?: dbMOD.IPermissionsInfo;
}

class RootDataView extends dbMOD.DataView<FOLDERBROWSER_SVC.FileSystemObject> {
}


export class FolderBrowser extends RIAPP.ViewModel<DemoApplication> {
    private _dbSet: FOLDERBROWSER_SVC.FileSystemObjectDb;
    private _collapseCommand: RIAPP.ICommand;
    private _reloadCommand: RIAPP.ICommand;
    private _rootView: dbMOD.DataView<FOLDERBROWSER_SVC.FileSystemObject>;

    constructor(app: DemoApplication, options: IFolderBrowserOptions) {
        super(app);
        const self = this;
        self._dbSet = self.dbContext.dbSets.FileSystemObject;

        self._collapseCommand = new RIAPP.Command(() => {
            self.collapse();
        });

        self._reloadCommand = new RIAPP.Command(() => {
            self.loadAll();
        });

        self.dbContext.dbSets.FileSystemObject.definefullPathField(function (item) {
            return self.getFullPath(item);
        });

        self.dbContext.dbSets.FileSystemObject.defineExtraPropsField(function (item) {
            let res = <ExProps>item._aspect.getCustomVal("exprop");
            if (!res) {
                res = new ExProps(item, self.dbContext);
                item._aspect.setCustomVal("exprop", res);
                res.addOnClicked((s, a) => { self._onItemClicked(a.item); });
                res.addOnDblClicked((s, a) => { self._onItemDblClicked(a.item); });
            }

            return res;
        });

        this._rootView = this.createDataView();
    }
    protected _onItemClicked(item: FOLDERBROWSER_SVC.FileSystemObject) {
        alert("clicked item: " + item.fullPath);
    }
    protected _onItemDblClicked(item: FOLDERBROWSER_SVC.FileSystemObject) {
        alert("double clicked item: " + item.fullPath);
    }
    private _getFullPath(item: FOLDERBROWSER_SVC.FileSystemObject, path: string): string {
        const self = this
        let part: string;
        if (utils.check.isNt(path))
            path = '';
        if (!path)
            part = '';
        else
            part = '\\' + path;
        let parent = <FOLDERBROWSER_SVC.FileSystemObject>self.dbContext.associations.getChildToParent().getParentItem(item);
        if (!parent) {
            return item.Name + part;
        }
        else {
            return self._getFullPath(parent, item.Name + part);
        }
    }
    private getFullPath(item: FOLDERBROWSER_SVC.FileSystemObject) {
        return this._getFullPath(item, null);
    }
    private createDataView() {
        const self = this;
        let res = new RootDataView(
            {
                dataSource: self._dbSet,
                fn_filter: (item) => {
                    //console.log(item.Level);
                    return item.Level == 0;
                }
            });
        return res;
    }
    collapse() {
        const self = this;
        let items = self._dbSet.items.filter((item) => {
            return (item.Level > 0);
        });

        items.forEach((item) => {
            item._aspect.deleteItem();
        });

        self._dbSet.acceptChanges();
        self._dbSet.items.forEach((item) => {
            let exProps = <ExProps>item._aspect.getCustomVal("exprop");
            if (!exProps)
                return;
            exProps.refreshCss();
        });
    }
    loadRootFolder() {
        const self = this, query = self._dbSet.createReadRootQuery({ includeFiles: false, infoType: infoType });
        query.isClearPrevData = true;
        let promise = query.load();
        promise.then(function (res) {
            //self._rootView.refresh();
        });
        return promise;
    }
    loadAll() {
        const self = this, query = self._dbSet.createReadAllQuery({ includeFiles: false, infoType: infoType });
        query.isClearPrevData = true;
        let promise = query.load();
        return promise;
    }
    dispose() {
        if (this.getIsDisposed())
            return;
        this.setDisposing();
        super.dispose();
    }
    get dbContext() { return this.app.dbContext; }
    get collapseCommand() { return this._collapseCommand; }
    get reloadCommand() { return this._reloadCommand; }
    get dbSet() { return this._dbSet; }
    get rootView() { return this._rootView; }
}

export class DemoApplication extends RIAPP.Application<IMainOptions> {
    private _errorVM: COMMON.ErrorViewModel;
    private _fbrowserVM: FolderBrowser;
    private _dbContext: FOLDERBROWSER_SVC.DbContext;

    constructor(options: IMainOptions) {
        super(options);
        this._errorVM = null;
        this._fbrowserVM = null;
    }
    onStartUp() {
        const self = this, options: IMainOptions = self.options;
        self._dbContext = new FOLDERBROWSER_SVC.DbContext();
        self._dbContext.initialize({
            serviceUrl: options.service_url,
            permissions: options.permissionInfo
        });

        this._errorVM = new COMMON.ErrorViewModel(this);
        this._fbrowserVM = new FolderBrowser(this, { service_url: options.service_url, permissionInfo: options.permissionInfo });

        //here we could process application's errors
        this.objEvents.addOnError(function (_s, data) {
            debugger;
            data.isHandled = true;
            self.errorVM.error = data.error;
            self.errorVM.showDialog();
        });
        super.onStartUp();
    }
    //really, the dispose method is redundant here because application lives till the page lives
    dispose() {
        if (this.getIsDisposed())
            return;
        this.setDisposing();
        const self = this;
        try {
            self._errorVM.dispose();
            self._fbrowserVM.dispose();
        } finally {
            super.dispose();
        }
    }
    get errorVM() { return this._errorVM; }
    get TEXT() { return RIAPP.LocaleSTRS.TEXT; }
    get fbrowserVM() { return this._fbrowserVM; }
    get dbContext() { return this._dbContext; }
}

//bootstrapper error handler - the last resort (typically display message to the user)
RIAPP.bootstrapper.objEvents.addOnError(function (_s, args) {
    debugger;
    alert(args.error.message);
});

export function start(mainOptions: IMainOptions): RIAPP.IPromise<DemoApplication> {
    mainOptions.modulesInits = {
        "COMMON": COMMON.initModule
    };
    //an example  how to load styles dynamically
    //we could load  them statically but it is for example.
    bootstrapper.stylesLoader.loadStyles(mainOptions.styles);
    //create and start application here
    return bootstrapper.startApp(() => {
        return new DemoApplication(mainOptions);
    }, (thisApp) => { });
}