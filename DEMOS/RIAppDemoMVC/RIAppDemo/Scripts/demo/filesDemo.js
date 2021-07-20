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
define(["require", "exports", "jriapp", "jriapp_ui", "./folderBrowserSvc", "common"], function (require, exports, RIAPP, uiMOD, FOLDERBROWSER_SVC, COMMON) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.start = exports.DemoApplication = exports.FolderBrowserVM = exports.FolderBrowser = void 0;
    var bootstrapper = RIAPP.bootstrapper, utils = RIAPP.Utils, coreUtils = RIAPP.Utils.core, $ = uiMOD.$;
    var FolderBrowser = (function (_super) {
        __extends(FolderBrowser, _super);
        function FolderBrowser(app, options) {
            var _this = _super.call(this, app) || this;
            var self = _this;
            self._includeFiles = options.includeFiles;
            self._$tree = options.$tree;
            _this._infotype = null;
            self._dbSet = self.dbContext.dbSets.FileSystemObject;
            self._loadRootCommand = new RIAPP.Command(function () {
                self.loadRootFolder();
            });
            _this._createDynaTree();
            return _this;
        }
        FolderBrowser.prototype.addOnNodeSelected = function (fn, namespace) {
            this.objEvents.on('node_selected', fn, namespace);
        };
        FolderBrowser.prototype._createDynaTree = function () {
            var self = this;
            this._$tree.dynatree({
                onActivate: function (node) {
                    self.objEvents.raise('node_selected', { item: node.data.item });
                },
                onClick: function (node, event) {
                },
                onDblClick: function (node, event) {
                },
                onExpand: function (flag, node) {
                    if (!flag) {
                        node.visit(function (child) {
                            var item = child.data.item;
                            if (!item)
                                return;
                            item._aspect.deleteItem();
                        }, false);
                        node.removeChildren();
                        self.dbContext.acceptChanges();
                    }
                },
                onLazyRead: function (node) {
                    self.loadChildren(node.data.item).then(function () {
                        self._addItemsToNode(node, node.data.item.Children);
                        node.setLazyNodeStatus(DTNodeStatus_Ok);
                    });
                }
            });
            this._$treeRoot = this._$tree.dynatree("getRoot");
        };
        FolderBrowser.prototype.loadRootFolder = function () {
            var self = this, query = self._dbSet.createReadRootQuery({ includeFiles: self._includeFiles, infoType: self.infotype });
            query.isClearPrevData = true;
            var promise = query.load();
            promise.then(function (res) {
                self._onLoaded(res.fetchedItems);
            });
            return promise;
        };
        FolderBrowser.prototype.loadChildren = function (item) {
            var self = this, query = self._dbSet.createReadChildrenQuery({ parentKey: item.Key, level: item.Level + 1, path: item.fullPath, includeFiles: self._includeFiles, infoType: self.infotype });
            query.isClearPrevData = false;
            var promise = query.load();
            promise.then(function (res) {
                self._onLoaded(res.fetchedItems);
            });
            return promise;
        };
        FolderBrowser.prototype._onLoaded = function (fetchedItems) {
            var self = this;
            try {
                var topLevel = fetchedItems.filter(function (item) {
                    return item.Level == 0;
                });
                if (topLevel.length > 0) {
                    self._addItemsToTree(topLevel);
                }
            }
            catch (ex) {
                utils.err.reThrow(ex, self.handleError(ex, self));
            }
        };
        FolderBrowser.prototype._addItemsToNode = function (node, items) {
            var arr = items.map(function (item) {
                return { title: item.Name, isLazy: item.HasSubDirs, isFolder: item.IsFolder, item: item };
            });
            node.removeChildren();
            node.addChild(arr);
        };
        FolderBrowser.prototype._addItemsToTree = function (items) {
            this._addItemsToNode(this._$treeRoot, items);
        };
        FolderBrowser.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            if (!!this._$treeRoot)
                this._$treeRoot.removeChildren();
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(FolderBrowser.prototype, "dbContext", {
            get: function () { return this.app.dbContext; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FolderBrowser.prototype, "loadRootCommand", {
            get: function () { return this._loadRootCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FolderBrowser.prototype, "infotype", {
            get: function () { return this._infotype; },
            set: function (v) { if (this._infotype !== v) {
                this._infotype = v;
                this.objEvents.raiseProp('infotype');
            } },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FolderBrowser.prototype, "dbSet", {
            get: function () { return this._dbSet; },
            enumerable: false,
            configurable: true
        });
        return FolderBrowser;
    }(RIAPP.ViewModel));
    exports.FolderBrowser = FolderBrowser;
    function fn_getTemplateElement(template, name) {
        var t = template;
        var els = t.findElByDataName(name);
        if (els.length < 1)
            return null;
        return els[0];
    }
    ;
    var FolderBrowserVM = (function (_super) {
        __extends(FolderBrowserVM, _super);
        function FolderBrowserVM(app, options) {
            var _this = _super.call(this, app) || this;
            var self = _this;
            _this._selectedItem = null;
            _this._dialogVM = new uiMOD.DialogVM(app);
            _this._folderBrowser = null;
            _this._options = options;
            _this._infotype = null;
            var title = self._options.includeFiles ? 'Выбор файла' : 'Выбор папки';
            var dialogOptions = {
                templateID: 'treeTemplate',
                width: 650,
                height: 700,
                title: title,
                fn_OnTemplateCreated: function (template) {
                    var $tree = $(fn_getTemplateElement(template, 'tree'));
                    var options = coreUtils.merge(self._options, { $tree: $tree });
                    self._folderBrowser = new FolderBrowser(app, options);
                    self._folderBrowser.addOnNodeSelected(function (s, a) {
                        self.selectedItem = a.item;
                    }, self.uniqueID);
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
            _this._dialogVM.createDialog('folderBrowser', dialogOptions);
            _this._dialogCommand = new RIAPP.Command(function () {
                try {
                    self.showDialog();
                }
                catch (ex) {
                    self.handleError(ex, self);
                }
            });
            return _this;
        }
        FolderBrowserVM.prototype.addOnItemSelected = function (fn, namespace) {
            this.objEvents.on('item_selected', fn, namespace);
        };
        FolderBrowserVM.prototype._onSelected = function (item, fullPath) {
            this.objEvents.raise('item_selected', { fullPath: fullPath });
        };
        FolderBrowserVM.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            var self = this;
            if (!!self._folderBrowser) {
                self._folderBrowser.dispose();
                self._folderBrowser = null;
            }
            if (!!self._dialogVM) {
                self._dialogVM.dispose();
                self._dialogVM = null;
            }
            _super.prototype.dispose.call(this);
        };
        FolderBrowserVM.prototype.showDialog = function () {
            this._dialogVM.showDialog('folderBrowser', this);
        };
        Object.defineProperty(FolderBrowserVM.prototype, "folderBrowser", {
            get: function () { return this._folderBrowser; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FolderBrowserVM.prototype, "selectedItem", {
            get: function () { return this._selectedItem; },
            set: function (v) {
                if (v !== this._selectedItem) {
                    this._selectedItem = v;
                    this.objEvents.raiseProp('selectedItem');
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FolderBrowserVM.prototype, "dialogCommand", {
            get: function () { return this._dialogCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FolderBrowserVM.prototype, "includeFiles", {
            get: function () { return this._options.includeFiles; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FolderBrowserVM.prototype, "infotype", {
            get: function () { return this._infotype; },
            set: function (v) { if (this._infotype !== v) {
                this._infotype = v;
                this.objEvents.raiseProp('infotype');
            } },
            enumerable: false,
            configurable: true
        });
        return FolderBrowserVM;
    }(RIAPP.ViewModel));
    exports.FolderBrowserVM = FolderBrowserVM;
    var DemoApplication = (function (_super) {
        __extends(DemoApplication, _super);
        function DemoApplication(options) {
            var _this = _super.call(this, options) || this;
            _this._errorVM = null;
            _this._fbrowserVM1 = null;
            _this._fbrowserVM2 = null;
            _this._selectedPath = null;
            return _this;
        }
        DemoApplication.prototype.onStartUp = function () {
            var self = this, options = self.options;
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
            this._fbrowserVM1.addOnItemSelected(function (s, a) {
                self._selectedPath = s.infotype + '\\' + a.fullPath;
                self.objEvents.raiseProp('selectedPath');
            });
            this._fbrowserVM2.addOnItemSelected(function (s, a) {
                self._selectedPath = s.infotype + '\\' + a.fullPath;
                self.objEvents.raiseProp('selectedPath');
            });
            this.objEvents.addOnError(function (_s, data) {
                debugger;
                data.isHandled = true;
                self.errorVM.error = data.error;
                self.errorVM.showDialog();
            });
            _super.prototype.onStartUp.call(this);
        };
        DemoApplication.prototype._getFullPath = function (item, path) {
            var self = this;
            var part;
            if (utils.check.isNt(path))
                path = '';
            if (!path)
                part = '';
            else
                part = '\\' + path;
            var parent = self.dbContext.associations.getChildToParent().getParentItem(item);
            if (!parent) {
                return item.Name + part;
            }
            else {
                return self._getFullPath(parent, item.Name + part);
            }
        };
        DemoApplication.prototype.getFullPath = function (item) {
            return this._getFullPath(item, null);
        };
        DemoApplication.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            var self = this;
            try {
                self._errorVM.dispose();
                self._fbrowserVM1.dispose();
                self._fbrowserVM2.dispose();
            }
            finally {
                _super.prototype.dispose.call(this);
            }
        };
        Object.defineProperty(DemoApplication.prototype, "errorVM", {
            get: function () { return this._errorVM; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DemoApplication.prototype, "TEXT", {
            get: function () { return RIAPP.LocaleSTRS.TEXT; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DemoApplication.prototype, "fbrowserVM1", {
            get: function () { return this._fbrowserVM1; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DemoApplication.prototype, "fbrowserVM2", {
            get: function () { return this._fbrowserVM2; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DemoApplication.prototype, "selectedPath", {
            get: function () { return this._selectedPath; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DemoApplication.prototype, "dbContext", {
            get: function () { return this._dbContext; },
            enumerable: false,
            configurable: true
        });
        return DemoApplication;
    }(RIAPP.Application));
    exports.DemoApplication = DemoApplication;
    RIAPP.bootstrapper.objEvents.addOnError(function (_s, args) {
        debugger;
        alert(args.error.message);
    });
    function start(mainOptions) {
        mainOptions.modulesInits = {
            "COMMON": COMMON.initModule
        };
        bootstrapper.startApp(function () {
            return new DemoApplication(mainOptions);
        }, function (thisApp) { });
    }
    exports.start = start;
});
