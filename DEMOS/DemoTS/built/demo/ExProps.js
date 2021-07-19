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
define(["require", "exports", "jriapp", "jriapp_db"], function (require, exports, RIAPP, dbMOD) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExProps = exports.infoType = void 0;
    exports.infoType = "BASE_ROOT";
    var ChildDataView = (function (_super) {
        __extends(ChildDataView, _super);
        function ChildDataView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ChildDataView;
    }(dbMOD.ChildDataView));
    var ExProps = (function (_super) {
        __extends(ExProps, _super);
        function ExProps(item, dbContext) {
            var _this = _super.call(this) || this;
            var self = _this;
            _this._item = item;
            _this._dbContext = dbContext;
            _this._childView = null;
            if (item.HasSubDirs) {
                _this._childView = _this.createChildView();
            }
            _this._dbSet = item._aspect.dbSet;
            self._toggleCommand = new RIAPP.Command(function () {
                if (!self.childView)
                    return;
                if (self.childView.count <= 0) {
                    self.loadChildren();
                }
                else {
                    self.childView.items.forEach(function (item) {
                        item._aspect.deleteItem();
                    });
                    self._dbSet.acceptChanges();
                    self.refreshCss();
                }
            }, function () {
                return !!self.childView;
            });
            self._clickCommand = new RIAPP.Command(function () {
                if (!!self._clickTimeOut) {
                    clearTimeout(self._clickTimeOut);
                    self._clickTimeOut = null;
                    self.objEvents.raise('dblclicked', { item: self._item });
                }
                else {
                    self._clickTimeOut = setTimeout(function () {
                        self._clickTimeOut = null;
                        self.objEvents.raise('clicked', { item: self._item });
                    }, 350);
                }
            });
            return _this;
        }
        ExProps.prototype.addOnClicked = function (fn, nmspace) {
            this.objEvents.on('clicked', fn, nmspace);
        };
        ExProps.prototype.offOnClicked = function (nmspace) {
            this.objEvents.off('clicked', nmspace);
        };
        ExProps.prototype.addOnDblClicked = function (fn, nmspace) {
            this.objEvents.on('dblclicked', fn, nmspace);
        };
        ExProps.prototype.offOnDblClicked = function (nmspace) {
            this.objEvents.off('dblclicked', nmspace);
        };
        ExProps.prototype.createChildView = function () {
            var self = this;
            var dvw = new ChildDataView({
                association: self._dbContext.associations.getChildToParent(),
                parentItem: self._item,
                explicitRefresh: true
            });
            dvw.addOnFill(function (s, a) {
                self.refreshCss();
            });
            dvw.syncRefresh();
            return dvw;
        };
        ExProps.prototype.loadChildren = function () {
            var self = this, query = self._dbSet.createReadChildrenQuery({ parentKey: self.item.Key, level: self.item.Level + 1, path: self.item.fullPath, includeFiles: false, infoType: exports.infoType });
            query.isClearPrevData = false;
            var promise = query.load();
            return promise;
        };
        ExProps.prototype.dispose = function () {
            if (this.getIsDisposed())
                return;
            this.setDisposing();
            var self = this;
            clearTimeout(self._clickTimeOut);
            if (!!this._childView) {
                this._childView.parentItem = null;
                this._childView.dispose();
                this._childView = null;
            }
            this._dbSet = null;
            this._dbContext = null;
            this._item = null;
            _super.prototype.dispose.call(this);
        };
        ExProps.prototype.refreshCss = function () {
            this.objEvents.raiseProp('css1');
            this.objEvents.raiseProp('css2');
        };
        Object.defineProperty(ExProps.prototype, "item", {
            get: function () { return this._item; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ExProps.prototype, "childView", {
            get: function () { return this._childView; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ExProps.prototype, "toggleCommand", {
            get: function () { return this._toggleCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ExProps.prototype, "clickCommand", {
            get: function () { return this._clickCommand; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ExProps.prototype, "css1", {
            get: function () {
                var children_css = this.item.HasSubDirs ? ' dynatree-has-children' : '';
                var folder_css = this.item.IsFolder ? ' dynatree-folder' : '';
                var css = '';
                if (!this._childView)
                    css = 'dynatree-node dynatree-exp dynatree-ico-cf';
                else
                    css = this._childView.count > 0 ? 'dynatree-node dynatree-exp-e dynatree-ico-ef' : 'dynatree-node dynatree-exp dynatree-ico-cf';
                css += children_css;
                css += folder_css;
                return css;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ExProps.prototype, "css2", {
            get: function () {
                return this.item.HasSubDirs ? 'dynatree-expander' : 'dynatree-connector';
            },
            enumerable: false,
            configurable: true
        });
        return ExProps;
    }(RIAPP.BaseObject));
    exports.ExProps = ExProps;
});
