import * as RIAPP from "jriapp";
import * as dbMOD from "jriapp_db";
import * as uiMOD from "jriapp_ui";
import * as FOLDERBROWSER_SVC from "./folderBrowserSvc";
import * as COMMON from "common";

let bootstrapper = RIAPP.bootstrapper, utils = RIAPP.Utils, coreUtils = RIAPP.Utils.core, $ = uiMOD.$;
declare let DTNodeStatus_Ok: any;

export interface IMainOptions extends RIAPP.IAppOptions {
    service_url: string;
    permissionInfo?: dbMOD.IPermissionsInfo;
}

export interface IOptions {
    service_url: string;
    permissionInfo?: dbMOD.IPermissionsInfo;
    includeFiles: boolean;
}

export interface IFolderBrowserOptions {
    service_url: string;
    permissionInfo?: dbMOD.IPermissionsInfo;
    includeFiles: boolean;
    $tree: JQuery;
}

export class FolderBrowser extends RIAPP.ViewModel<DemoApplication> {
    _includeFiles: boolean;
    _$tree: JQuery;
    _$treeRoot: any;
    _dbSet: FOLDERBROWSER_SVC.FileSystemObjectDb;
    _loadRootCommand: RIAPP.ICommand;
    private _infotype: string;

    constructor(app: DemoApplication, options: IFolderBrowserOptions) {
        super(app);
        const self = this;
        self._includeFiles = options.includeFiles;
        self._$tree = options.$tree;
        this._infotype = null;
        self._dbSet = self.dbContext.dbSets.FileSystemObject;

        self._loadRootCommand = new RIAPP.Command(() => {
            self.loadRootFolder();
        });

        this._createDynaTree();
    }
    addOnNodeSelected(fn: (sender: FolderBrowser, args: { item: FOLDERBROWSER_SVC.FileSystemObject; }) => void, namespace?: string) {
        this.objEvents.on('node_selected', fn, namespace);
    }
    private _createDynaTree() {
        const self = this;
        (<any>this._$tree).dynatree({
            onActivate: function (node: any) {
                self.objEvents.raise('node_selected', { item: node.data.item });
            },
            onClick: function (node: any, event: any) {
            },
            onDblClick: function (node: any, event: any) {
            },
            onExpand: function (flag: any, node: any) {
                if (!flag) {
                    node.visit(function (child: any) {
                        let item = <FOLDERBROWSER_SVC.FileSystemObject>child.data.item;
                        if (!item)
                            return;
                        item._aspect.deleteItem();
                    }, false);

                    //remove all child nodes when node collapsed
                    node.removeChildren();
                    self.dbContext.acceptChanges();
                }
            },
            onLazyRead: function (node: any) {
                self.loadChildren(node.data.item).then(function () {
                    self._addItemsToNode(node, node.data.item.Children);
                    node.setLazyNodeStatus(DTNodeStatus_Ok);
                });
            }
        });
        this._$treeRoot = (<any>this._$tree).dynatree("getRoot");
    }
    loadRootFolder() {
        const self = this, query = self._dbSet.createReadRootQuery({ includeFiles: self._includeFiles, infoType: self.infotype });
        query.isClearPrevData = true;
        let promise = query.load();
        promise.then(function (res) {
            self._onLoaded(res.fetchedItems);
        });
        return promise;
    }
    loadChildren(item: FOLDERBROWSER_SVC.FileSystemObject) {
        const self = this, query = self._dbSet.createReadChildrenQuery({ parentKey: item.Key, level: item.Level + 1, path: item.fullPath, includeFiles: self._includeFiles, infoType: self.infotype });
        query.isClearPrevData = false;
        let promise = query.load();
        promise.then(function (res) {
            self._onLoaded(res.fetchedItems);
        });
        return promise;
    }
    private _onLoaded(fetchedItems: FOLDERBROWSER_SVC.FileSystemObject[]) {
        const self = this;
        try {
            let topLevel = fetchedItems.filter(function (item) {
                return item.Level == 0;
            });
            if (topLevel.length > 0) {
                self._addItemsToTree(topLevel);
            }
        }
        catch (ex) {
            utils.err.reThrow(ex, self.handleError(ex, self))
        }
    }
    private _addItemsToNode(node: any, items: FOLDERBROWSER_SVC.FileSystemObject[]) {
        let arr = items.map(function (item) {
            return { title: item.Name, isLazy: item.HasSubDirs, isFolder: item.IsFolder, item: item };
        });
        node.removeChildren();
        node.addChild(arr);
    }
    private _addItemsToTree(items: FOLDERBROWSER_SVC.FileSystemObject[]) {
        this._addItemsToNode(this._$treeRoot, items);
    }
    dispose() {
        if (this.getIsDisposed())
            return;
        this.setDisposing();
        if (!!this._$treeRoot)
            this._$treeRoot.removeChildren();
        super.dispose();
    }
    get dbContext() { return this.app.dbContext; }
    get loadRootCommand() { return this._loadRootCommand; }
    get infotype() { return this._infotype; }
    set infotype(v) { if (this._infotype !== v) { this._infotype = v; this.objEvents.raiseProp('infotype'); } }
    get dbSet() { return this._dbSet; }
}

function fn_getTemplateElement(template: RIAPP.ITemplate, name: string) {
    let t = template;
    let els = t.findElByDataName(name);
    if (els.length < 1)
        return null;
    return els[0];
};

export class FolderBrowserVM extends RIAPP.ViewModel<DemoApplication> {
    _selectedItem: FOLDERBROWSER_SVC.FileSystemObject;
    _dialogVM: uiMOD.DialogVM;
    _folderBrowser: FolderBrowser;
    _options: IOptions;
    _dialogCommand: RIAPP.ICommand;
    _infotype: string;

    constructor(app: DemoApplication, options: IOptions) {
        super(app);
        const self: FolderBrowserVM = this;
        this._selectedItem = null;
        //we defined this custom type in common.js
        this._dialogVM = new uiMOD.DialogVM(app);
        this._folderBrowser = null;
        this._options = options;
        this._infotype = null;
        let title = self._options.includeFiles ? 'Выбор файла' : 'Выбор папки';
        let dialogOptions: uiMOD.IDialogConstructorOptions = {
            templateID: 'treeTemplate',
            width: 650,
            height: 700,
            title: title,
            fn_OnTemplateCreated: function (template) {
                //executed in the context of the dialog
                let $tree = $(fn_getTemplateElement(template, 'tree'));
                let options = <IFolderBrowserOptions>coreUtils.merge(self._options, { $tree: $tree });
                self._folderBrowser = new FolderBrowser(app, options);
                self._folderBrowser.addOnNodeSelected(function (s, a) {
                    self.selectedItem = a.item;
                }, self.uniqueID)
                self.objEvents.raiseProp('folderBrowser');
            },
            fn_OnShow: function (dialog) {
                self.selectedItem = null;
                self._folderBrowser.infotype = self.infotype;
                self._folderBrowser.loadRootFolder();
            },
            fn_OnClose: function (dialog) {
                if (dialog.result == 'ok' && !!self._selectedItem) {
                    self._onSelected(self._selectedItem, self._selectedItem.fullPath);
                }
            }
        };

        this._dialogVM.createDialog('folderBrowser', dialogOptions);

        this._dialogCommand = new RIAPP.Command(() => {
            try {
                self.showDialog();
            } catch (ex) {
                self.handleError(ex, self);
            }
        });
    }
    addOnItemSelected(fn: (sender: FolderBrowserVM, args: { fullPath: string }) => void, namespace?: string) {
        this.objEvents.on('item_selected', fn, namespace);
    }
    _onSelected(item: RIAPP.ICollectionItem, fullPath: string) {
        this.objEvents.raise('item_selected', { fullPath: fullPath });
    }
    dispose() {
        if (this.getIsDisposed())
            return;
        this.setDisposing();
        const self = this;
        if (!!self._folderBrowser) {
            self._folderBrowser.dispose();
            self._folderBrowser = null;
        }
        if (!!self._dialogVM) {
            self._dialogVM.dispose();
            self._dialogVM = null;
        }
        super.dispose();
    }
    showDialog() {
        this._dialogVM.showDialog('folderBrowser', this);
    }
    get folderBrowser() { return this._folderBrowser; }
    get selectedItem() { return this._selectedItem; }
    set selectedItem(v) {
        if (v !== this._selectedItem) {
            this._selectedItem = v;
            this.objEvents.raiseProp('selectedItem');
        }
    }
    get dialogCommand() { return this._dialogCommand; }
    get includeFiles() { return this._options.includeFiles; }
    get infotype() { return this._infotype; }
    set infotype(v) { if (this._infotype !== v) { this._infotype = v; this.objEvents.raiseProp('infotype'); } }
}

export class DemoApplication extends RIAPP.Application<IMainOptions> {
    private _errorVM: COMMON.ErrorViewModel;
    private _fbrowserVM1: FolderBrowserVM;
    private _fbrowserVM2: FolderBrowserVM;
    private _selectedPath: string;
    private _dbContext: FOLDERBROWSER_SVC.DbContext;

    constructor(options: IMainOptions) {
        super(options);
        this._errorVM = null;
        this._fbrowserVM1 = null;
        this._fbrowserVM2 = null;
        this._selectedPath = null;
    }
    onStartUp() {
        const self = this, options: IMainOptions = self.options;
        self._dbContext = new FOLDERBROWSER_SVC.DbContext();
        self._dbContext.initialize({
            serviceUrl: options.service_url,
            permissions: options.permissionInfo
        });
        self._dbContext.dbSets.FileSystemObject.definefullPathField(function (item) {
            return self.getFullPath(item);
        });

        self._dbContext.dbSets.FileSystemObject.defineExtraPropsField(function (item) {
            return null;
        });

        this._errorVM = new COMMON.ErrorViewModel(this);
        this._fbrowserVM1 = new FolderBrowserVM(this, { service_url: options.service_url, permissionInfo: options.permissionInfo, includeFiles: false });
        this._fbrowserVM2 = new FolderBrowserVM(this, { service_url: options.service_url, permissionInfo: options.permissionInfo, includeFiles: true });
        this._fbrowserVM1.infotype = "BASE_ROOT";
        this._fbrowserVM2.infotype = "BASE_ROOT";
        this._fbrowserVM1.addOnItemSelected((s, a) => {
            self._selectedPath = s.infotype + '\\' + a.fullPath;
            self.objEvents.raiseProp('selectedPath');
        });
        this._fbrowserVM2.addOnItemSelected((s, a) => {
            self._selectedPath = s.infotype + '\\' + a.fullPath;
            self.objEvents.raiseProp('selectedPath');
        });
        //here we could process application's errors
        this.objEvents.addOnError(function (_s, data) {
            debugger;
            data.isHandled = true;
            self.errorVM.error = data.error;
            self.errorVM.showDialog();
        });
        super.onStartUp();
    }
    private _getFullPath(item: FOLDERBROWSER_SVC.FileSystemObject, path: string): string {
        const self = this;
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
    getFullPath(item: FOLDERBROWSER_SVC.FileSystemObject) {
        return this._getFullPath(item, null);
    }
    //really, the dispose method is redundant here because application lives till the page lives
    dispose() {
        if (this.getIsDisposed())
            return;
        this.setDisposing();
        const self = this;
        try {
            self._errorVM.dispose();
            self._fbrowserVM1.dispose();
            self._fbrowserVM2.dispose();
        } finally {
            super.dispose();
        }
    }
    get errorVM() { return this._errorVM; }
    get TEXT() { return RIAPP.LocaleSTRS.TEXT; }
    get fbrowserVM1() { return this._fbrowserVM1; }
    get fbrowserVM2() { return this._fbrowserVM2; }
    get selectedPath() { return this._selectedPath; }
    get dbContext() { return this._dbContext; }
}

//bootstrapper error handler - the last resort (typically display message to the user)
RIAPP.bootstrapper.objEvents.addOnError(function (_s, args) {
    debugger;
    alert(args.error.message);
});

export function start(mainOptions: IMainOptions) {
    mainOptions.modulesInits = {
        "COMMON": COMMON.initModule
    };

    //create and start application here
    bootstrapper.startApp(() => {
        return new DemoApplication(mainOptions);
    }, (thisApp) => { });
}