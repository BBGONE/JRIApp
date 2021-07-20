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
define(["require", "exports", "jriapp", "jriapp_db", "./folderBrowserSvc", "common", "./ExProps"], function (require, exports, RIAPP, dbMOD, FOLDERBROWSER_SVC, COMMON, ExProps_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.start = exports.DemoApplication = exports.FolderBrowser = void 0;
    var bootstrapper = RIAPP.bootstrapper, utils = RIAPP.Utils;
    var RootDataView = (function (_super) {
        __extends(RootDataView, _super);
        function RootDataView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return RootDataView;
    }(dbMOD.DataView));
    var FolderBrowser = (function (_super) {
        __extends(FolderBrowser, _super);
        function FolderBrowser(app, options) {
            var _this = _super.call(this, app) || this;
            var self = _this;
            self._dbSet = self.dbContext.dbSets.FileSystemObject;
            self._collapseCommand = new RIAPP.Command(function () {
                self.collapse();
            });
            self._reloadCommand = new RIAPP.Command(function () {
                self.loadAll();
            });
            self.dbContext.dbSets.FileSystemObject.definefullPathField(function (item) {
                return self.getFullPath(item);
            });
            self.dbContext.dbSets.FileSystemObject.defineExtraPropsField(function (item) {
                var res = item._aspect.getCustomVal("exprop");
                if (!res) {
                    res = new ExProps_1.ExProps(item, self.dbContext);
                    item._aspect.setCustomVal("exprop", res);
                    res.addOnClicked(function (s, a) { self._onItemClicked(a.item); });
                    res.addOnDblClicked(function (s, a) { self._onItemDblClicked(a.item); });
                }
                return res;
            });
            _this._rootView = _this.createDataView();
            return _this;
        }
        FolderBrowser.prototype._onItemClicked = function (item) {
            alert("clicked item: " + item.fullPath);
        };
        FolderBrowser.prototype._onItemDblClicked = function (item) {
            alert("double clicked item: " + item.fullPath);
        };
        FolderBrowser.prototype._getFullPath = function (item, path) {
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
        FolderBrowser.prototype.getFullPath = function (item) {
            return this._getFullPath(item, null);
        };
        FolderBrowser.prototype.createDataView = function () {
            var self = this;
            var res = new RootDataView({
                dataSource: self._dbSet,
                fn_filter: function (item) {
                    return item.Level == 0;
                }
            });
            return res;
        };
        FolderBrowser.prototype.collapse = function () {
            var self = this;
            var items = self._dbSet.items.filter(function (item) {
                return (item.Level > 0);
            });
            items.forEach(function (item) {
                item._aspect.deleteItem();
            });
            self._dbSet.acceptChanges();
            self._dbSet.items.forEach(function (item) {
                var exProps = item._aspect.getCustomVal("exprop");
                if (!exProps)
                    return;
                exProps.refreshCss();
            });
        };
        FolderBrowser.prototype.loadRootFolder = function () {
            var self = this, query = self._dbSet.createReadRootQuery({ includeFiles: false, infoType: ExProps_1.infoType });
            query.isClearPrevData = true;
            var promise = query.load();
            promise.then(function (res) {
            });
            return promise;
        };
        FolderBrowser.prototype.loadAll = function () {
            var self = this, query = self._dbSet.createReadAllQuery({ includeFiles: false, infoType: ExProps_1.infoType });
            query.isClearPrevData = true;
            var promise = query.load();
            return promise;
        };
        FolderBrowser.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(FolderBrowser.prototype, "dbContext", {
            get: function () { return this.app.dbContext; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FolderBrowser.prototype, "collapseCommand", {
            get: function () { return this._collapseCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FolderBrowser.prototype, "reloadCommand", {
            get: function () { return this._reloadCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FolderBrowser.prototype, "dbSet", {
            get: function () { return this._dbSet; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FolderBrowser.prototype, "rootView", {
            get: function () { return this._rootView; },
            enumerable: false,
            configurable: true
        });
        return FolderBrowser;
    }(RIAPP.ViewModel));
    exports.FolderBrowser = FolderBrowser;
    var DemoApplication = (function (_super) {
        __extends(DemoApplication, _super);
        function DemoApplication(options) {
            var _this = _super.call(this, options) || this;
            _this._errorVM = null;
            _this._fbrowserVM = null;
            return _this;
        }
        DemoApplication.prototype.onStartUp = function () {
            var self = this, options = self.options;
            self._dbContext = new FOLDERBROWSER_SVC.DbContext();
            self._dbContext.initialize({
                serviceUrl: options.service_url,
                permissions: options.permissionInfo
            });
            this._errorVM = new COMMON.ErrorViewModel(this);
            this._fbrowserVM = new FolderBrowser(this, { service_url: options.service_url, permissionInfo: options.permissionInfo });
            this.objEvents.addOnError(function (_s, data) {
                debugger;
                data.isHandled = true;
                self.errorVM.error = data.error;
                self.errorVM.showDialog();
            });
            _super.prototype.onStartUp.call(this);
        };
        DemoApplication.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            var self = this;
            try {
                self._errorVM.dispose();
                self._fbrowserVM.dispose();
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
        Object.defineProperty(DemoApplication.prototype, "fbrowserVM", {
            get: function () { return this._fbrowserVM; },
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
        bootstrapper.stylesLoader.loadStyles(mainOptions.styles);
        return bootstrapper.startApp(function () {
            return new DemoApplication(mainOptions);
        }, function (thisApp) { });
    }
    exports.start = start;
});
