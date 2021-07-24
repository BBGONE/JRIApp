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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
define("jriapp_db/const", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DATA_OPER = exports.DELETE_ACTION = exports.REFRESH_MODE = exports.FLAGS = void 0;
    var FLAGS;
    (function (FLAGS) {
        FLAGS[FLAGS["None"] = 0] = "None";
        FLAGS[FLAGS["Changed"] = 1] = "Changed";
        FLAGS[FLAGS["Setted"] = 2] = "Setted";
        FLAGS[FLAGS["Refreshed"] = 4] = "Refreshed";
    })(FLAGS = exports.FLAGS || (exports.FLAGS = {}));
    var REFRESH_MODE;
    (function (REFRESH_MODE) {
        REFRESH_MODE[REFRESH_MODE["NONE"] = 0] = "NONE";
        REFRESH_MODE[REFRESH_MODE["RefreshCurrent"] = 1] = "RefreshCurrent";
        REFRESH_MODE[REFRESH_MODE["MergeIntoCurrent"] = 2] = "MergeIntoCurrent";
        REFRESH_MODE[REFRESH_MODE["CommitChanges"] = 3] = "CommitChanges";
    })(REFRESH_MODE = exports.REFRESH_MODE || (exports.REFRESH_MODE = {}));
    var DELETE_ACTION;
    (function (DELETE_ACTION) {
        DELETE_ACTION[DELETE_ACTION["NoAction"] = 0] = "NoAction";
        DELETE_ACTION[DELETE_ACTION["Cascade"] = 1] = "Cascade";
        DELETE_ACTION[DELETE_ACTION["SetNulls"] = 2] = "SetNulls";
    })(DELETE_ACTION = exports.DELETE_ACTION || (exports.DELETE_ACTION = {}));
    var DATA_OPER;
    (function (DATA_OPER) {
        DATA_OPER[DATA_OPER["None"] = 0] = "None";
        DATA_OPER[DATA_OPER["Submit"] = 1] = "Submit";
        DATA_OPER[DATA_OPER["Query"] = 2] = "Query";
        DATA_OPER[DATA_OPER["Invoke"] = 3] = "Invoke";
        DATA_OPER[DATA_OPER["Refresh"] = 4] = "Refresh";
        DATA_OPER[DATA_OPER["Init"] = 5] = "Init";
    })(DATA_OPER = exports.DATA_OPER || (exports.DATA_OPER = {}));
});
define("jriapp_db/datacache", ["require", "exports", "jriapp_shared"], function (require, exports, jriapp_shared_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataCache = void 0;
    var utils = jriapp_shared_1.Utils, isNt = utils.check.isNt, _a = utils.core, forEach = _a.forEach, Indexer = _a.Indexer;
    var DataCache = (function (_super) {
        __extends(DataCache, _super);
        function DataCache(query) {
            var _this = _super.call(this) || this;
            _this._query = query;
            _this._pages = Indexer();
            _this._itemsByKey = Indexer();
            _this._totalCount = 0;
            return _this;
        }
        DataCache.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this.clear();
            _super.prototype.dispose.call(this);
        };
        DataCache.prototype._getPrevPageIndex = function (currentPageIndex) {
            var pageIndex = -1;
            forEach(this._pages, function (_, page) {
                var cachePageIndex = page.pageIndex;
                if (cachePageIndex > pageIndex && cachePageIndex < currentPageIndex) {
                    pageIndex = cachePageIndex;
                }
            });
            return pageIndex;
        };
        DataCache.prototype.getNextRange = function (pageIndex) {
            var half = Math.floor(((this.loadPageCount - 1) / 2));
            var above = (pageIndex + half) + ((this.loadPageCount - 1) % 2);
            var below = (pageIndex - half);
            var prev = this._getPrevPageIndex(pageIndex);
            if (below < 0) {
                above += (0 - below);
                below = 0;
            }
            if (below <= prev) {
                above += (prev - below + 1);
                below += (prev - below + 1);
            }
            if (this._pageCount > this.loadPageCount && above > (this._pageCount - 1)) {
                below -= (above - (this._pageCount - 1));
                if (below < 0) {
                    below = 0;
                }
                above = this._pageCount - 1;
            }
            if (below <= prev) {
                above += (prev - below + 1);
                below += (prev - below + 1);
            }
            var cnt = above - below + 1;
            if (cnt < this.loadPageCount) {
                above += this.loadPageCount - cnt;
                cnt = above - below + 1;
            }
            var start = below;
            var end = above;
            return { start: start, end: end, cnt: cnt };
        };
        DataCache.prototype.clear = function () {
            this._pages = Indexer();
            this._itemsByKey = Indexer();
        };
        DataCache.prototype.getPage = function (pageIndex) {
            return this._pages[pageIndex];
        };
        DataCache.prototype.getPageItems = function (pageIndex) {
            var page = this.getPage(pageIndex);
            if (!page) {
                return [];
            }
            var dbSet = this._query.dbSet, keyMap = this._itemsByKey;
            var res = page.keys.map(function (key) {
                var kv = keyMap[key];
                return (!kv) ? null : dbSet.createEntityFromObj(kv.val, kv.key);
            }).filter(function (item) { return !!item; });
            return res;
        };
        DataCache.prototype.setPageItems = function (pageIndex, items) {
            this.deletePage(pageIndex);
            if (items.length === 0) {
                return;
            }
            var kvs = items.map(function (item) { return { key: item._key, val: item._aspect.vals }; });
            var page = { keys: kvs.map(function (kv) { return kv.key; }), pageIndex: pageIndex };
            this._pages[pageIndex] = page;
            var keyMap = this._itemsByKey, len = kvs.length;
            for (var j = 0; j < len; j += 1) {
                var kv = kvs[j];
                keyMap[kv.key] = kv;
            }
        };
        DataCache.prototype.fill = function (startIndex, items) {
            var len = items.length, pageSize = this.pageSize;
            for (var i = 0; i < this.loadPageCount; i += 1) {
                var pageItems = [], pgstart = (i * pageSize);
                if (pgstart >= len) {
                    break;
                }
                for (var j = 0; j < pageSize; j += 1) {
                    var k = pgstart + j;
                    if (k < len) {
                        pageItems.push(items[k]);
                    }
                    else {
                        break;
                    }
                }
                this.setPageItems(startIndex + i, pageItems);
            }
        };
        DataCache.prototype.deletePage = function (pageIndex) {
            var page = this.getPage(pageIndex);
            if (!page) {
                return;
            }
            var keys = page.keys;
            for (var j = 0; j < keys.length; j += 1) {
                delete this._itemsByKey[keys[j]];
            }
            delete this._pages[pageIndex];
        };
        DataCache.prototype.hasPage = function (pageIndex) {
            return !!this.getPage(pageIndex);
        };
        DataCache.prototype.getItemByKey = function (key) {
            var kv = this._itemsByKey[key];
            if (!kv) {
                return null;
            }
            return this._query.dbSet.createEntityFromObj(kv.val, kv.key);
        };
        DataCache.prototype.toString = function () {
            return "DataCache";
        };
        Object.defineProperty(DataCache.prototype, "_pageCount", {
            get: function () {
                var rowCount = this.totalCount, rowPerPage = this.pageSize;
                var result = 0;
                if ((rowCount === 0) || (rowPerPage === 0)) {
                    return result;
                }
                if ((rowCount % rowPerPage) === 0) {
                    result = (rowCount / rowPerPage);
                }
                else {
                    result = (rowCount / rowPerPage);
                    result = Math.floor(result) + 1;
                }
                return result;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataCache.prototype, "pageSize", {
            get: function () {
                return this._query.pageSize;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataCache.prototype, "loadPageCount", {
            get: function () {
                return this._query.loadPageCount;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataCache.prototype, "totalCount", {
            get: function () {
                return this._totalCount;
            },
            set: function (v) {
                if (isNt(v)) {
                    v = 0;
                }
                if (v !== this._totalCount) {
                    this._totalCount = v;
                    this.objEvents.raiseProp("totalCount");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataCache.prototype, "cacheSize", {
            get: function () {
                var indexes = Object.keys(this._pages);
                return indexes.length;
            },
            enumerable: false,
            configurable: true
        });
        return DataCache;
    }(jriapp_shared_1.BaseObject));
    exports.DataCache = DataCache;
});
define("jriapp_db/dataquery", ["require", "exports", "jriapp_shared", "jriapp_shared/collection/utils", "jriapp_db/datacache"], function (require, exports, jriapp_shared_2, utils_1, datacache_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataQuery = void 0;
    var utils = jriapp_shared_2.Utils, _a = utils.check, isNt = _a.isNt, isArray = _a.isArray, isDate = _a.isDate, format = utils.str.format, Indexer = utils.core.Indexer, arrHelper = utils.arr, valUtils = utils_1.ValueUtils;
    var DataQuery = (function (_super) {
        __extends(DataQuery, _super);
        function DataQuery(dbSet, queryInfo) {
            var _this = _super.call(this) || this;
            var self = _this;
            _this._dbSet = dbSet;
            _this._queryInfo = queryInfo;
            _this._filterInfo = { filterItems: [] };
            _this._sortInfo = { sortItems: [] };
            _this._isIncludeTotalCount = true;
            _this._isClearPrevData = true;
            _this._pageSize = dbSet.pageSize;
            _this._pageIndex = dbSet.pageIndex;
            _this._params = Indexer();
            _this._loadPageCount = 1;
            _this._isClearCacheOnEveryLoad = true;
            _this._isForAppend = false;
            _this._dataCache = null;
            _this._cacheInvalidated = false;
            _this._isPagingEnabled = dbSet.isPagingEnabled;
            _this._internal = {
                clearCache: function () {
                    self._clearCache();
                },
                getCache: function () {
                    return self._getCache();
                },
                isPageCached: function (pageIndex) {
                    return self._isPageCached(pageIndex);
                },
                updateCache: function (pageIndex, items) {
                    self._updateCache(pageIndex, items);
                },
                getQueryInfo: function () {
                    return self._queryInfo;
                }
            };
            return _this;
        }
        DataQuery.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this._clearCache();
            _super.prototype.dispose.call(this);
        };
        DataQuery.prototype._addSort = function (fieldName, sortOrder) {
            var ord = !isNt(sortOrder) ? sortOrder : 0;
            var sortItem = { fieldName: fieldName, sortOrder: ord };
            this._sortInfo.sortItems.push(sortItem);
            this._cacheInvalidated = true;
        };
        DataQuery.prototype._addFilterItem = function (fieldName, operand, value, checkFieldName) {
            if (checkFieldName === void 0) { checkFieldName = true; }
            var fkind = 0, vals = [];
            var stz = this.serverTimezone;
            if (!isArray(value)) {
                vals = [value];
            }
            else {
                vals = value;
            }
            var tmpVals = arrHelper.clone(vals);
            var fld = null;
            if (checkFieldName) {
                fld = this.getFieldInfo(fieldName);
            }
            if (!!fld) {
                vals = tmpVals.map(function (v) { return valUtils.stringifyValue(v, fld.dateConversion, fld.dataType, stz); });
            }
            else {
                vals = tmpVals.map(function (v) { return valUtils.stringifyValue(v, 0, isDate(v) ? 7 : 0, stz); });
            }
            switch (operand) {
                case 0:
                case 9:
                case 2:
                case 3:
                case 4:
                case 5:
                case 7:
                case 6:
                case 8:
                    fkind = operand;
                    break;
                case 1:
                    fkind = operand;
                    if (value.length !== 2) {
                        throw new Error(jriapp_shared_2.LocaleERRS.ERR_QUERY_BETWEEN);
                    }
                    break;
                default:
                    throw new Error(format(jriapp_shared_2.LocaleERRS.ERR_QUERY_OPERATOR_INVALID, operand));
            }
            var filterItem = { fieldName: fieldName, kind: fkind, values: vals };
            this._filterInfo.filterItems.push(filterItem);
            this._cacheInvalidated = true;
        };
        DataQuery.prototype._resetCacheInvalidated = function () {
            this._cacheInvalidated = false;
        };
        DataQuery.prototype._clearCache = function () {
            if (!!this._dataCache) {
                this._dataCache.dispose();
                this._dataCache = null;
            }
            this._resetCacheInvalidated();
        };
        DataQuery.prototype._getCache = function () {
            if (!this._dataCache) {
                this._dataCache = new datacache_1.DataCache(this);
            }
            return this._dataCache;
        };
        DataQuery.prototype._isPageCached = function (pageIndex) {
            if (!this._dataCache) {
                return false;
            }
            return this._dataCache.hasPage(pageIndex);
        };
        DataQuery.prototype._updateCache = function (pageIndex, items) {
            var cache = this._dataCache;
            if (!cache) {
                return;
            }
            cache.setPageItems(pageIndex, items);
        };
        DataQuery.prototype._getInternal = function () {
            return this._internal;
        };
        DataQuery.prototype.where = function (fieldName, operand, value, checkFieldName) {
            if (checkFieldName === void 0) { checkFieldName = true; }
            this._addFilterItem(fieldName, operand, value, checkFieldName);
            return this;
        };
        DataQuery.prototype.and = function (fieldName, operand, value, checkFieldName) {
            if (checkFieldName === void 0) { checkFieldName = true; }
            this._addFilterItem(fieldName, operand, value, checkFieldName);
            return this;
        };
        DataQuery.prototype.orderBy = function (fieldName, sortOrder) {
            this._addSort(fieldName, sortOrder);
            return this;
        };
        DataQuery.prototype.thenBy = function (fieldName, sortOrder) {
            this._addSort(fieldName, sortOrder);
            return this;
        };
        DataQuery.prototype.clearSort = function () {
            this._sortInfo.sortItems = [];
            this._cacheInvalidated = true;
            return this;
        };
        DataQuery.prototype.clearFilter = function () {
            this._filterInfo.filterItems = [];
            this._cacheInvalidated = true;
            return this;
        };
        DataQuery.prototype.clearParams = function () {
            this._params = Indexer();
            this._cacheInvalidated = true;
            return this;
        };
        DataQuery.prototype.getFieldInfo = function (fieldName) {
            return this._dbSet.getFieldInfo(fieldName);
        };
        DataQuery.prototype.getFieldNames = function () {
            return this._dbSet.getFieldNames();
        };
        DataQuery.prototype.load = function () {
            return this.dbSet.dbContext.load(this);
        };
        DataQuery.prototype.toString = function () {
            return "DataQuery";
        };
        Object.defineProperty(DataQuery.prototype, "serverTimezone", {
            get: function () {
                return this._dbSet.dbContext.serverTimezone;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "dbSet", {
            get: function () {
                return this._dbSet;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "dbSetName", {
            get: function () {
                return this._dbSet.dbSetName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "queryName", {
            get: function () {
                return this._queryInfo.methodName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "filterInfo", {
            get: function () {
                return this._filterInfo;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "sortInfo", {
            get: function () {
                return this._sortInfo;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "isIncludeTotalCount", {
            get: function () {
                return this._isIncludeTotalCount && !this.isForAppend;
            },
            set: function (v) {
                this._isIncludeTotalCount = v;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "isClearPrevData", {
            get: function () {
                return this._isClearPrevData && !this.isForAppend;
            },
            set: function (v) {
                this._isClearPrevData = v;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "pageSize", {
            get: function () {
                return this._pageSize;
            },
            set: function (v) {
                if (this._pageSize !== v) {
                    this._pageSize = v;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "pageIndex", {
            get: function () {
                return this._pageIndex;
            },
            set: function (v) {
                if (this._pageIndex !== v) {
                    this._pageIndex = v;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "params", {
            get: function () {
                return this._params;
            },
            set: function (v) {
                if (this._params !== v) {
                    this._params = v;
                    this._cacheInvalidated = true;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "isPagingEnabled", {
            get: function () {
                return this._isPagingEnabled && !this.isForAppend;
            },
            set: function (v) {
                this._isPagingEnabled = v;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "loadPageCount", {
            get: function () {
                return this.isForAppend ? 1 : this._loadPageCount;
            },
            set: function (v) {
                if (v < 1) {
                    v = 1;
                }
                if (this._loadPageCount !== v) {
                    this._loadPageCount = v;
                    if (v === 1 || this.isForAppend) {
                        this._clearCache();
                    }
                    this.objEvents.raiseProp("loadPageCount");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "isClearCacheOnEveryLoad", {
            get: function () {
                return this._isClearCacheOnEveryLoad || this.isForAppend;
            },
            set: function (v) {
                if (this._isClearCacheOnEveryLoad !== v) {
                    this._isClearCacheOnEveryLoad = v;
                    this.objEvents.raiseProp("isClearCacheOnEveryLoad");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "isForAppend", {
            get: function () {
                return this._isForAppend;
            },
            set: function (v) {
                if (this._isForAppend !== v) {
                    this._isForAppend = v;
                    this.objEvents.raiseProp("isForAppend");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataQuery.prototype, "isCacheValid", {
            get: function () {
                return !!this._dataCache && !this._cacheInvalidated && !this.isForAppend;
            },
            enumerable: false,
            configurable: true
        });
        return DataQuery;
    }(jriapp_shared_2.BaseObject));
    exports.DataQuery = DataQuery;
});
define("jriapp_db/dbset", ["require", "exports", "jriapp_shared", "jriapp_shared/collection/base", "jriapp_shared/collection/utils", "jriapp_db/dataquery", "jriapp_db/entity_aspect"], function (require, exports, jriapp_shared_3, base_1, utils_2, dataquery_1, entity_aspect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DbSet = void 0;
    var utils = jriapp_shared_3.Utils, _a = utils.check, isArray = _a.isArray, isNt = _a.isNt, format = utils.str.format, _b = utils.core, getValue = _b.getValue, setValue = _b.setValue, merge = _b.merge, forEach = _b.forEach, Indexer = _b.Indexer, ERROR = utils.err, parseValue = utils_2.ValueUtils.parseValue, stringifyValue = utils_2.ValueUtils.stringifyValue, getPKFields = utils_2.CollUtils.getPKFields, walkField = utils_2.CollUtils.walkField, walkFields = utils_2.CollUtils.walkFields, objToVals = utils_2.CollUtils.objToVals, initVals = utils_2.CollUtils.initVals, getObjectField = utils_2.CollUtils.getObjectField;
    function doFieldDependences(dbSet, info) {
        if (!info.dependentOn) {
            return;
        }
        var deps = info.dependentOn.split(",");
        for (var _i = 0, deps_1 = deps; _i < deps_1.length; _i++) {
            var depOn = deps_1[_i];
            var depOnFld = dbSet.getFieldInfo(depOn);
            if (!depOnFld) {
                throw new Error(format(jriapp_shared_3.LocaleERRS.ERR_CALC_FIELD_DEFINE, depOn));
            }
            if (info === depOnFld) {
                throw new Error(format(jriapp_shared_3.LocaleERRS.ERR_CALC_FIELD_SELF_DEPEND, depOn));
            }
            if (depOnFld.dependents.indexOf(info.fullName) < 0) {
                depOnFld.dependents.push(info.fullName);
            }
        }
    }
    var DBSET_EVENTS;
    (function (DBSET_EVENTS) {
        DBSET_EVENTS["loaded"] = "dbset_loaded";
    })(DBSET_EVENTS || (DBSET_EVENTS = {}));
    var DbSet = (function (_super) {
        __extends(DbSet, _super);
        function DbSet(opts) {
            var _this = _super.call(this) || this;
            var self = _this, dbContext = opts.dbContext, dbSetInfo = opts.dbSetInfo, fieldInfos = dbSetInfo.fieldInfos;
            _this._dbContext = dbContext;
            _this._dbSetName = dbSetInfo.dbSetName;
            _this.options.enablePaging = dbSetInfo.enablePaging;
            _this.options.pageSize = dbSetInfo.pageSize;
            _this._query = null;
            _this._isSubmitOnDelete = false;
            _this._navfldMap = Indexer();
            _this._calcfldMap = Indexer();
            _this._fieldMap = Indexer();
            _this._fieldInfos = fieldInfos;
            _this._pkFields = getPKFields(fieldInfos);
            _this._isPageFilled = false;
            _this._newKey = 0;
            _this._pageDebounce = new jriapp_shared_3.Debounce(400);
            _this._trackAssoc = Indexer();
            _this._trackAssocMap = Indexer();
            _this._childAssocMap = Indexer();
            _this._parentAssocMap = Indexer();
            _this._changeCount = 0;
            _this._changeCache = Indexer();
            _this._ignorePageChanged = false;
            for (var _i = 0, fieldInfos_1 = fieldInfos; _i < fieldInfos_1.length; _i++) {
                var f = fieldInfos_1[_i];
                self._fieldMap[f.fieldName] = f;
                walkField(f, function (fld, fullName) {
                    fld.dependents = [];
                    fld.fullName = fullName;
                });
            }
            walkFields(fieldInfos, function (fld, fullName) {
                if (fld.fieldType === 3) {
                    setValue(self._navfldMap, fullName, self._doNavigationField(opts, fld), true);
                }
                else if (fld.fieldType === 2) {
                    setValue(self._calcfldMap, fullName, self._doCalculatedField(opts, fld), true);
                }
            });
            self._mapAssocFields();
            var extraInternal = {
                getCalcFieldVal: function (fieldName, item) {
                    return self._getCalcFieldVal(fieldName, item);
                },
                getNavFieldVal: function (fieldName, item) {
                    return self._getNavFieldVal(fieldName, item);
                },
                setNavFieldVal: function (fieldName, item, value) {
                    self._setNavFieldVal(fieldName, item, value);
                },
                beforeLoad: function (query, oldQuery) {
                    self._beforeLoad(query, oldQuery);
                },
                updatePermissions: function (perms) {
                    self._updatePermissions(perms);
                },
                getChildToParentNames: function (childFieldName) {
                    return self._getChildToParentNames(childFieldName);
                },
                fillFromService: function (info) {
                    return self._fillFromService(info);
                },
                fillFromCache: function (info) {
                    return self._fillFromCache(info);
                },
                commitChanges: function (rows) {
                    self._commitChanges(rows);
                },
                setItemInvalid: function (row) {
                    return self._setItemInvalid(row);
                },
                getChanges: function () {
                    return self._getChanges();
                },
                getTrackAssocInfo: function () {
                    return self._getTrackAssocInfo();
                },
                addToChanged: function (item) {
                    self._addToChanged(item);
                },
                removeFromChanged: function (key) {
                    self._removeFromChanged(key);
                },
                onItemStatusChanged: function (item, oldStatus) {
                    self._onItemStatusChanged(item, oldStatus);
                },
                setQuery: function (query) {
                    self._setQuery(query);
                }
            };
            var internal = _this._getInternal();
            _this._setInternal(merge(extraInternal, internal));
            _this.dbContext.objEvents.onProp("isSubmiting", function () {
                self.objEvents.raiseProp("isBusy");
            }, _this.dbSetName);
            _this.objEvents.onProp("isLoading", function () {
                self.objEvents.raiseProp("isBusy");
            });
            return _this;
        }
        DbSet.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this._pageDebounce.dispose();
            this._pageDebounce = null;
            this.clear();
            var dbContext = this.dbContext;
            this._dbContext = null;
            if (!!dbContext) {
                dbContext.objEvents.offNS(this.dbSetName);
            }
            this._navfldMap = Indexer();
            this._calcfldMap = Indexer();
            _super.prototype.dispose.call(this);
        };
        DbSet.prototype.handleError = function (error, source) {
            return (!this._dbContext) ? _super.prototype.handleError.call(this, error, source) : this._dbContext.handleError(error, source);
        };
        DbSet.prototype._mapAssocFields = function () {
            var trackAssoc = this._trackAssoc, tasKeys = Object.keys(trackAssoc), trackAssocMap = this._trackAssocMap;
            var len = tasKeys.length;
            for (var i = 0; i < len; i += 1) {
                var assoc = trackAssoc[tasKeys[i]], len2 = assoc.fieldRels.length;
                for (var j = 0; j < len2; j += 1) {
                    var frel = assoc.fieldRels[j];
                    if (!isArray(trackAssocMap[frel.childField])) {
                        trackAssocMap[frel.childField] = [assoc.childToParentName];
                    }
                    else {
                        trackAssocMap[frel.childField].push(assoc.childToParentName);
                    }
                }
            }
        };
        DbSet.prototype._doNavigationField = function (opts, fieldInfo) {
            var self = this, result = {
                getFunc: function (_item) {
                    throw new Error("Navigation get function for the field: " + fieldInfo.fieldName + " is not implemented");
                },
                setFunc: function (_v, _item) {
                    throw new Error("Navigation set function for the field: " + fieldInfo.fieldName + " is not implemented");
                }
            };
            var isChild = true, assocs = opts.childAssoc.filter(function (a) {
                return a.childToParentName === fieldInfo.fieldName;
            });
            if (assocs.length === 0) {
                assocs = opts.parentAssoc.filter(function (a) {
                    return a.parentToChildrenName === fieldInfo.fieldName;
                });
                isChild = false;
            }
            if (assocs.length !== 1) {
                throw new Error(format(jriapp_shared_3.LocaleERRS.ERR_PARAM_INVALID_TYPE, "assocs", "Array"));
            }
            var assocName = assocs[0].name;
            fieldInfo.isReadOnly = true;
            if (isChild) {
                fieldInfo.isReadOnly = false;
                self._childAssocMap[assocs[0].childToParentName] = assocs[0];
                for (var _i = 0, _a = assocs[0].fieldRels; _i < _a.length; _i++) {
                    var frel = _a[_i];
                    var childFld = self.getFieldInfo(frel.childField);
                    if (!fieldInfo.isReadOnly && (childFld.isReadOnly && !childFld.allowClientDefault)) {
                        fieldInfo.isReadOnly = true;
                    }
                }
                result.getFunc = function (item) {
                    var assoc = self.dbContext.getAssociation(assocName);
                    return assoc.getParentItem(item);
                };
                if (!fieldInfo.isReadOnly) {
                    self._trackAssoc[assocName] = assocs[0];
                    result.setFunc = function (v, item) {
                        var assoc = self.dbContext.getAssociation(assocName);
                        if (!!v) {
                            if ((v._aspect.dbSetName !== assoc.parentDS.dbSetName)) {
                                throw new Error(format(jriapp_shared_3.LocaleERRS.ERR_PARAM_INVALID_TYPE, "value", assoc.parentDS.dbSetName));
                            }
                            if (v._aspect.isNew) {
                                item._aspect._setFieldVal(fieldInfo.fieldName, v._key);
                            }
                            else {
                                var len = assoc.childFldInfos.length;
                                for (var i = 0; i < len; i += 1) {
                                    item[assoc.childFldInfos[i].fieldName] = v[assoc.parentFldInfos[i].fieldName];
                                }
                            }
                        }
                        else {
                            var oldKey = item._aspect._getFieldVal(fieldInfo.fieldName);
                            if (!!oldKey) {
                                item._aspect._setFieldVal(fieldInfo.fieldName, null);
                            }
                            var len = assoc.childFldInfos.length;
                            for (var i = 0; i < len; i += 1) {
                                item[assoc.childFldInfos[i].fieldName] = null;
                            }
                        }
                    };
                }
            }
            else {
                self._parentAssocMap[assocs[0].parentToChildrenName] = assocs[0];
                result.getFunc = function (item) {
                    return self.dbContext.getAssociation(assocName).getChildItems(item);
                };
            }
            return result;
        };
        DbSet.prototype._doCalculatedField = function (_opts, fieldInfo) {
            var self = this, result = {
                getFunc: function (_item) { throw new Error(format("Calculated field:'{0}' is not initialized", fieldInfo.fieldName)); }
            };
            fieldInfo.isReadOnly = true;
            if (!!fieldInfo.dependentOn) {
                doFieldDependences(self, fieldInfo);
            }
            return result;
        };
        DbSet.prototype._refreshValues = function (path, item, values, names, rm) {
            var self = this, dependents = utils.core.Indexer();
            values.forEach(function (value, index) {
                var name = names[index], fieldName = path + name.n, fld = self.getFieldInfo(fieldName);
                if (!fld) {
                    throw new Error(format(jriapp_shared_3.LocaleERRS.ERR_DBSET_INVALID_FIELDNAME, self.dbSetName, fieldName));
                }
                if (fld.fieldType === 5) {
                    self._refreshValues(fieldName + ".", item, value, name.p, rm);
                }
                else {
                    item._aspect._refreshValue(value, fieldName, rm, dependents);
                }
            });
            item._aspect._updateDependents(dependents);
        };
        DbSet.prototype._applyFieldVals = function (vals, path, values, names) {
            var self = this, stz = self.dbContext.serverTimezone;
            values.forEach(function (value, index) {
                var name = names[index], fieldName = path + name.n, fld = self.getFieldInfo(fieldName);
                if (!fld) {
                    throw new Error(format(jriapp_shared_3.LocaleERRS.ERR_DBSET_INVALID_FIELDNAME, self.dbSetName, fieldName));
                }
                if (fld.fieldType === 5) {
                    self._applyFieldVals(vals, fieldName + ".", value, name.p);
                }
                else {
                    var val = parseValue(value, fld.dataType, fld.dateConversion, stz);
                    setValue(vals, fieldName, val, false);
                }
            });
        };
        DbSet.prototype._getNewKey = function () {
            var key = "clkey_" + this._newKey;
            this._newKey += 1;
            return key;
        };
        DbSet.prototype._onItemAdded = function (item) {
            _super.prototype._onItemAdded.call(this, item);
            this._addToChanged(item);
        };
        DbSet.prototype._createNew = function () {
            return this.createEntityFromData(null, null);
        };
        DbSet.prototype._clear = function (reason, oper) {
            try {
                _super.prototype._clear.call(this, reason, oper);
            }
            finally {
                this._newKey = 0;
                this._isPageFilled = false;
            }
        };
        DbSet.prototype._onPageChanging = function () {
            var res = _super.prototype._onPageChanging.call(this);
            if (!res) {
                return res;
            }
            this.rejectChanges();
            var query = this.query;
            if (!!query && query.loadPageCount > 1 && this._isPageFilled) {
                query._getInternal().updateCache(this.pageIndex, this.items);
            }
            return res;
        };
        DbSet.prototype._onPageChanged = function () {
            var self = this;
            this._isPageFilled = false;
            this.cancelEdit();
            _super.prototype._onPageChanged.call(this);
            if (this._ignorePageChanged) {
                return;
            }
            self.query.pageIndex = self.pageIndex;
            self._pageDebounce.enque(function () {
                self.dbContext._getInternal().load(self.query, 1);
            });
        };
        DbSet.prototype._onPageSizeChanged = function () {
            _super.prototype._onPageSizeChanged.call(this);
            if (!!this._query) {
                this._query.pageSize = this.pageSize;
            }
        };
        DbSet.prototype._defineCalculatedField = function (fullName, getFunc) {
            var calcDef = getValue(this._calcfldMap, fullName);
            if (!calcDef) {
                throw new Error(format(jriapp_shared_3.LocaleERRS.ERR_PARAM_INVALID, "calculated fieldName", fullName));
            }
            calcDef.getFunc = getFunc;
        };
        DbSet.prototype._getStrValue = function (val, fieldInfo) {
            var dcnv = fieldInfo.dateConversion, stz = this.dbContext.serverTimezone;
            return stringifyValue(val, dcnv, fieldInfo.dataType, stz);
        };
        DbSet.prototype._getKeyValue = function (vals) {
            var pkFlds = this._pkFields, len = pkFlds.length;
            if (len === 1) {
                var val = getValue(vals, pkFlds[0].fieldName);
                if (isNt(val)) {
                    throw new Error("Empty key field value for: " + pkFlds[0].fieldName);
                }
                return this._getStrValue(val, pkFlds[0]);
            }
            else {
                var pkVals = [];
                for (var i = 0; i < len; i += 1) {
                    var val = getValue(vals, pkFlds[i].fieldName);
                    if (isNt(val)) {
                        throw new Error("Empty key field value for: " + pkFlds[i].fieldName);
                    }
                    var strval = this._getStrValue(val, pkFlds[i]);
                    pkVals.push(strval);
                }
                return pkVals.join(";");
            }
        };
        DbSet.prototype._getCalcFieldVal = function (fieldName, item) {
            try {
                var val = getValue(this._calcfldMap, fieldName);
                return val.getFunc.call(item, item);
            }
            catch (err) {
                ERROR.reThrow(err, this.handleError(err, this));
            }
        };
        DbSet.prototype._getNavFieldVal = function (fieldName, item) {
            var val = getValue(this._navfldMap, fieldName);
            return val.getFunc.call(item, item);
        };
        DbSet.prototype._setNavFieldVal = function (fieldName, item, value) {
            var val = getValue(this._navfldMap, fieldName);
            val.setFunc.call(item, value, item);
        };
        DbSet.prototype._beforeLoad = function (query, oldQuery) {
            if (!!query.isForAppend) {
                query.pageSize = this.pageSize;
                query.pageIndex = this.pageIndex;
                this._query = query;
            }
            else {
                if (oldQuery !== query) {
                    query.pageIndex = 0;
                    this._query = query;
                    if (!!oldQuery) {
                        oldQuery.dispose();
                    }
                }
                if (query.pageSize !== this.pageSize) {
                    this._ignorePageChanged = true;
                    try {
                        this.pageIndex = 0;
                        this.pageSize = query.pageSize;
                    }
                    finally {
                        this._ignorePageChanged = false;
                    }
                }
                if (query.pageIndex !== this.pageIndex) {
                    this._ignorePageChanged = true;
                    try {
                        this.pageIndex = query.pageIndex;
                    }
                    finally {
                        this._ignorePageChanged = false;
                    }
                }
                if (!query.isCacheValid) {
                    query._getInternal().clearCache();
                }
            }
        };
        DbSet.prototype._getChildToParentNames = function (childFieldName) { return this._trackAssocMap[childFieldName]; };
        DbSet.prototype._afterFill = function (result, isClearAll) {
            var self = this;
            if (!isNt(result.fetchedItems)) {
                this._onLoaded(result.fetchedItems);
            }
            this._onCollectionChanged({
                changeType: !isClearAll ? 1 : 2,
                reason: result.reason,
                oper: 1,
                items: result.newItems
            });
            this._onFillEnd({
                items: result.items,
                newItems: result.newItems,
                reason: result.reason
            });
            this._isPageFilled = true;
            if (!!isClearAll) {
                self.moveFirst();
            }
        };
        DbSet.prototype._fillFromService = function (info) {
            var self = this, res = info.res, fieldNames = res.names, rows = res.rows || [], isPagingEnabled = this.isPagingEnabled, query = info.query;
            var isClearAll = true;
            if (!!query && !query.getIsStateDirty()) {
                isClearAll = query.isClearPrevData;
                if (query.isClearCacheOnEveryLoad) {
                    query._getInternal().clearCache();
                }
                if (isClearAll) {
                    this._clear(info.reason, 1);
                }
            }
            var fetchedItems = rows.map(function (row) {
                var key = row.k;
                if (!key) {
                    throw new Error(jriapp_shared_3.LocaleERRS.ERR_KEY_IS_EMPTY);
                }
                var item = self.getItemByKey(key);
                if (!item) {
                    item = self.createEntityFromData(row, fieldNames);
                }
                else {
                    self._refreshValues("", item, row.v, fieldNames, 1);
                }
                return item;
            });
            var _fetchedItems = fetchedItems;
            if (!!query && !query.getIsStateDirty()) {
                if (query.isIncludeTotalCount && !isNt(res.totalCount)) {
                    this.totalCount = res.totalCount;
                }
                if (query.loadPageCount > 1 && isPagingEnabled) {
                    var dataCache = query._getInternal().getCache();
                    if (query.isIncludeTotalCount && !isNt(res.totalCount)) {
                        dataCache.totalCount = res.totalCount;
                    }
                    dataCache.fill(res.pageIndex, fetchedItems);
                    _fetchedItems = dataCache.getPageItems(query.pageIndex);
                }
            }
            var newItems = [], items = [];
            for (var _i = 0, _fetchedItems_1 = _fetchedItems; _i < _fetchedItems_1.length; _i++) {
                var item = _fetchedItems_1[_i];
                var oldItem = self.getItemByKey(item._key);
                if (!oldItem) {
                    self._appendItem(item);
                    newItems.push(item);
                    items.push(item);
                    item._aspect._setIsAttached(true);
                }
                else {
                    items.push(oldItem);
                }
            }
            if (newItems.length > 0) {
                this._onCountChanged();
            }
            var result = {
                newItems: newItems,
                fetchedItems: fetchedItems,
                items: items,
                reason: info.reason,
                outOfBandData: info.res.extraInfo
            };
            info.onFillEnd();
            this._afterFill(result, isClearAll);
            return result;
        };
        DbSet.prototype._fillFromCache = function (args) {
            var query = args.query;
            if (!query) {
                throw new Error(format(jriapp_shared_3.LocaleERRS.ERR_ASSERTION_FAILED, "query is not null"));
            }
            if (query.getIsStateDirty()) {
                throw new Error(format(jriapp_shared_3.LocaleERRS.ERR_ASSERTION_FAILED, "query not destroyed"));
            }
            var dataCache = query._getInternal().getCache(), arr = dataCache.getPageItems(query.pageIndex);
            this._replaceItems(args.reason, 1, arr);
            var items = [];
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var item = arr_1[_i];
                items.push(item);
            }
            if (items.length > 0) {
                this._onCountChanged();
            }
            var result = {
                newItems: items,
                fetchedItems: null,
                items: items,
                reason: args.reason,
                outOfBandData: null
            };
            this._afterFill(result, true);
            return result;
        };
        DbSet.prototype._commitChanges = function (rows) {
            var self = this;
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var rowInfo = rows_1[_i];
                var oldKey = rowInfo.clientKey, newKey = rowInfo.serverKey, item = self.getItemByKey(oldKey);
                if (!item) {
                    throw new Error(format(jriapp_shared_3.LocaleERRS.ERR_KEY_IS_NOTFOUND, oldKey));
                }
                var itemStatus = item._aspect.status;
                item._aspect._acceptChanges(rowInfo);
                if (itemStatus === 1) {
                    item._aspect._updateKeys(rowInfo.serverKey);
                    self._remapItem(oldKey, newKey, item);
                    self._onCollectionChanged({
                        changeType: 3,
                        reason: 0,
                        oper: 4,
                        items: [item],
                        old_key: oldKey,
                        new_key: newKey
                    });
                }
            }
        };
        DbSet.prototype._setItemInvalid = function (row) {
            var item = this.getItemByKey(row.clientKey), errors = Indexer();
            row.invalid.forEach(function (err) {
                if (!err.fieldName) {
                    err.fieldName = "*";
                }
                if (isArray(errors[err.fieldName])) {
                    errors[err.fieldName].push(err.message);
                }
                else {
                    errors[err.fieldName] = [err.message];
                }
            });
            var res = [];
            forEach(errors, function (fieldName, err) {
                res.push({ fieldName: fieldName, errors: err });
            });
            this.errors.addErrors(item, res);
            return item;
        };
        DbSet.prototype._getChanges = function () {
            var changes = [], csh = this._changeCache;
            forEach(csh, function (_key, item) {
                changes.push(item._aspect._getRowInfo());
            });
            return changes;
        };
        DbSet.prototype._getTrackAssocInfo = function () {
            var self = this, res = [], csh = this._changeCache, trackAssoc = self._trackAssoc;
            forEach(csh, function (_key, item) {
                forEach(trackAssoc, function (assocName, assocInfo) {
                    var parentKey = item._aspect._getFieldVal(assocInfo.childToParentName), childKey = item._key;
                    if (!!parentKey && !!childKey) {
                        res.push({ assocName: assocName, parentKey: parentKey, childKey: childKey });
                    }
                });
            });
            return res;
        };
        DbSet.prototype._addToChanged = function (item) {
            if (item._aspect.isDetached) {
                return;
            }
            if (!this._changeCache[item._key]) {
                this._changeCache[item._key] = item;
                this._changeCount += 1;
                if (this._changeCount === 1) {
                    this.objEvents.raiseProp("isHasChanges");
                }
            }
        };
        DbSet.prototype._removeFromChanged = function (key) {
            if (!key) {
                return;
            }
            if (!!this._changeCache[key]) {
                delete this._changeCache[key];
                this._changeCount -= 1;
                if (this._changeCount === 0) {
                    this.objEvents.raiseProp("isHasChanges");
                }
            }
        };
        DbSet.prototype._setQuery = function (query) {
            this._query = query;
        };
        DbSet.prototype._onItemStatusChanged = function (item, oldStatus) {
            var _this = this;
            _super.prototype._onItemStatusChanged.call(this, item, oldStatus);
            if (item._aspect.isDeleted && this.isSubmitOnDelete) {
                this.dbContext.submitChanges().catch(function (_err) {
                    utils.queue.enque(function () {
                        _this.dbContext.rejectChanges();
                    });
                });
            }
        };
        DbSet.prototype._onRemoved = function (item) {
            this._removeFromChanged(item._key);
            _super.prototype._onRemoved.call(this, item);
        };
        DbSet.prototype._onLoaded = function (items) {
            if (this.objEvents.canRaise("dbset_loaded")) {
                var vals = items.map(function (item) { return item._aspect.vals; });
                this.objEvents.raise("dbset_loaded", { vals: vals });
            }
        };
        DbSet.prototype._destroyQuery = function () {
            var query = this._query;
            this._query = null;
            if (!!query) {
                query.dispose();
            }
        };
        DbSet.prototype._getNames = function () {
            var fieldInfos = this.getFieldInfos(), names = [];
            walkFields(fieldInfos, function (fld, _fullName, arr) {
                if (fld.fieldType === 5) {
                    var res = [];
                    arr.push({
                        n: fld.fieldName, p: res
                    });
                    return res;
                }
                else {
                    var isOK = fld.fieldType === 0 || fld.fieldType === 4 || fld.fieldType === 6;
                    if (isOK) {
                        arr.push({
                            n: fld.fieldName, p: null
                        });
                    }
                    return arr;
                }
            }, names);
            return names;
        };
        DbSet.prototype.getFieldMap = function () {
            return this._fieldMap;
        };
        DbSet.prototype.getFieldInfos = function () {
            return this._fieldInfos;
        };
        DbSet.prototype.createEntityFromObj = function (obj, key) {
            var isNew = !obj, vals = objToVals(this.getFieldInfos(), obj), _key = isNew ? this._getNewKey() : (!key ? this._getKeyValue(vals) : key);
            var aspect = new entity_aspect_1.EntityAspect(this, vals, _key, isNew);
            return aspect.item;
        };
        DbSet.prototype.createEntityFromData = function (row, fieldNames) {
            var vals = initVals(this.getFieldInfos(), {}), isNew = !row;
            if (!!row) {
                this._applyFieldVals(vals, "", row.v, fieldNames);
            }
            var aspect = new entity_aspect_1.EntityAspect(this, vals, isNew ? this._getNewKey() : row.k, isNew);
            return aspect.item;
        };
        DbSet.prototype._getInternal = function () {
            return _super.prototype._getInternal.call(this);
        };
        DbSet.prototype.refreshData = function (data) {
            for (var _i = 0, _a = data.rows; _i < _a.length; _i++) {
                var row = _a[_i];
                var key = row.k;
                if (!key) {
                    throw new Error(jriapp_shared_3.LocaleERRS.ERR_KEY_IS_EMPTY);
                }
                var item = this.getItemByKey(key);
                if (!!item) {
                    this._refreshValues("", item, row.v, data.names, 1);
                }
            }
        };
        DbSet.prototype.fillData = function (data, isAppend) {
            var self = this, reason = 0;
            this._destroyQuery();
            var isClearAll = !isAppend;
            if (isClearAll) {
                self._clear(reason, 1);
            }
            var fetchedItems = data.rows.map(function (row) {
                var key = row.k;
                if (!key) {
                    throw new Error(jriapp_shared_3.LocaleERRS.ERR_KEY_IS_EMPTY);
                }
                var item = self.getItemByKey(key);
                if (!item) {
                    item = self.createEntityFromData(row, data.names);
                }
                else {
                    self._refreshValues("", item, row.v, data.names, 1);
                }
                return item;
            });
            var newItems = [], items = [];
            fetchedItems.forEach(function (item) {
                var oldItem = self.getItemByKey(item._key);
                if (!oldItem) {
                    self._appendItem(item);
                    newItems.push(item);
                    items.push(item);
                    item._aspect._setIsAttached(true);
                }
                else {
                    items.push(oldItem);
                }
            });
            if (newItems.length > 0) {
                this._onCountChanged();
            }
            this.totalCount = fetchedItems.length;
            var result = {
                newItems: newItems,
                fetchedItems: fetchedItems,
                items: items,
                reason: 0,
                outOfBandData: null
            };
            this._afterFill(result, isClearAll);
            return result;
        };
        DbSet.prototype.fillItems = function (data, isAppend) {
            var self = this, reason = 0;
            this._destroyQuery();
            var isClearAll = !isAppend;
            if (isClearAll) {
                self._clear(reason, 1);
            }
            var fetchedItems = data.map(function (obj) {
                return self.createEntityFromObj(obj);
            });
            var newItems = [], items = [];
            fetchedItems.forEach(function (item) {
                var oldItem = self.getItemByKey(item._key);
                if (!oldItem) {
                    self._appendItem(item);
                    newItems.push(item);
                    items.push(item);
                    item._aspect._setIsAttached(true);
                }
                else {
                    items.push(oldItem);
                }
            });
            if (newItems.length > 0) {
                this._onCountChanged();
            }
            this.totalCount = fetchedItems.length;
            var result = {
                newItems: newItems,
                fetchedItems: fetchedItems,
                items: items,
                reason: 0,
                outOfBandData: null
            };
            this._afterFill(result, isClearAll);
            return result;
        };
        DbSet.prototype.addOnLoaded = function (fn, nmspace, context, priority) {
            this.objEvents.on("dbset_loaded", fn, nmspace, context, priority);
        };
        DbSet.prototype.offOnLoaded = function (nmspace) {
            this.objEvents.off("dbset_loaded", nmspace);
        };
        DbSet.prototype.waitForNotBusy = function (callback, groupName) {
            this._waitForProp("isBusy", callback, groupName);
        };
        DbSet.prototype.getFieldInfo = function (fieldName) {
            var parts = fieldName.split(".");
            var fld = this._fieldMap[parts[0]];
            if (!fld) {
                throw new Error(format(jriapp_shared_3.LocaleERRS.ERR_DBSET_INVALID_FIELDNAME, this.dbSetName, fieldName));
            }
            if (parts.length === 1) {
                return fld;
            }
            if (fld.fieldType === 5) {
                for (var i = 1; i < parts.length; i += 1) {
                    fld = getObjectField(parts[i], fld.nested);
                }
                return fld;
            }
            else if (fld.fieldType === 3) {
                var assoc = this._childAssocMap[fld.fieldName];
                if (!!assoc) {
                    var parentDB = this.dbContext.getDbSet(assoc.parentDbSetName);
                    return parentDB.getFieldInfo(parts.slice(1).join("."));
                }
            }
            throw new Error(format(jriapp_shared_3.LocaleERRS.ERR_DBSET_INVALID_FIELDNAME, this.dbSetName, fieldName));
        };
        DbSet.prototype.sort = function (fieldNames, sortOrder) {
            var self = this, query = self.query;
            if (!isNt(query)) {
                query.clearSort();
                for (var i = 0; i < fieldNames.length; i += 1) {
                    switch (i) {
                        case 0:
                            query.orderBy(fieldNames[i], sortOrder);
                            break;
                        default:
                            query.thenBy(fieldNames[i], sortOrder);
                            break;
                    }
                }
                query.isClearPrevData = true;
                query.pageIndex = 0;
                return self.dbContext._getInternal().load(query, 2);
            }
            else {
                return _super.prototype.sort.call(this, fieldNames, sortOrder);
            }
        };
        DbSet.prototype.acceptChanges = function () {
            if (!this.isHasChanges) {
                return;
            }
            var csh = this._changeCache;
            forEach(csh, function (key) {
                var item = csh[key];
                item._aspect.acceptChanges();
            });
            if (this.isHasChanges) {
                throw new Error("Invalid Operation: the changes are left after the acceptChanges operation");
            }
        };
        DbSet.prototype.rejectChanges = function () {
            if (!this.isHasChanges) {
                return;
            }
            var csh = this._changeCache;
            forEach(csh, function (key) {
                var item = csh[key];
                item._aspect.rejectChanges();
            });
            if (this.isHasChanges) {
                throw new Error("Invalid Operation: the changes are left after the rejectChanges operation");
            }
        };
        DbSet.prototype.deleteOnSubmit = function (item) {
            item._aspect.deleteOnSubmit();
        };
        DbSet.prototype.clear = function () {
            this._destroyQuery();
            _super.prototype.clear.call(this);
        };
        DbSet.prototype.createQuery = function (name) {
            var queryInfo = this.dbContext._getInternal().getQueryInfo(name);
            if (!queryInfo) {
                throw new Error(format(jriapp_shared_3.LocaleERRS.ERR_QUERY_NAME_NOTFOUND, name));
            }
            return new dataquery_1.DataQuery(this, queryInfo);
        };
        DbSet.prototype.toString = function () {
            return this.dbSetName;
        };
        Object.defineProperty(DbSet.prototype, "dbContext", {
            get: function () {
                return this._dbContext;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSet.prototype, "dbSetName", {
            get: function () {
                return this._dbSetName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSet.prototype, "query", {
            get: function () {
                return this._query;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSet.prototype, "isHasChanges", {
            get: function () {
                return this._changeCount > 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSet.prototype, "cacheSize", {
            get: function () {
                var query = this._query;
                if (!!query && query.isCacheValid) {
                    var dataCache = query._getInternal().getCache();
                    return dataCache.cacheSize;
                }
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSet.prototype, "isSubmitOnDelete", {
            get: function () {
                return this._isSubmitOnDelete;
            },
            set: function (v) {
                if (this._isSubmitOnDelete !== v) {
                    this._isSubmitOnDelete = !!v;
                    this.objEvents.raiseProp("isSubmitOnDelete");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSet.prototype, "isBusy", {
            get: function () {
                return this.isLoading || this.dbContext.isSubmiting;
            },
            enumerable: false,
            configurable: true
        });
        return DbSet;
    }(base_1.BaseCollection));
    exports.DbSet = DbSet;
});
define("jriapp_db/dbsets", ["require", "exports", "jriapp_shared"], function (require, exports, jriapp_shared_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DbSets = void 0;
    var utils = jriapp_shared_4.Utils, Indexer = utils.core.Indexer, format = utils.str.format;
    var DBSETS_EVENTS;
    (function (DBSETS_EVENTS) {
        DBSETS_EVENTS["DBSET_CREATING"] = "dbset_creating";
    })(DBSETS_EVENTS || (DBSETS_EVENTS = {}));
    var DbSets = (function (_super) {
        __extends(DbSets, _super);
        function DbSets(dbContext) {
            var _this = _super.call(this) || this;
            _this._dbContext = dbContext;
            _this._arrDbSets = [];
            _this._dbSets = Indexer();
            return _this;
        }
        DbSets.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            for (var _i = 0, _a = this._arrDbSets; _i < _a.length; _i++) {
                var dbSet = _a[_i];
                dbSet.dispose();
            }
            this._arrDbSets = [];
            this._dbSets = null;
            this._dbContext = null;
            _super.prototype.dispose.call(this);
        };
        DbSets.prototype._dbSetCreated = function (dbSet) {
            var _this = this;
            this._arrDbSets.push(dbSet);
            dbSet.objEvents.onProp("isHasChanges", function (sender) {
                _this._dbContext._getInternal().onDbSetHasChangesChanged(sender);
            });
        };
        DbSets.prototype._createDbSet = function (name, dbSetType) {
            var self = this, dbContext = this._dbContext;
            if (!!self._dbSets[name]) {
                throw new Error(utils.str.format("DbSet: {0} is already created", name));
            }
            self._dbSets[name] = new jriapp_shared_4.Lazy(function () {
                var args = { name: name, dbSetType: dbSetType };
                self.objEvents.raise("dbset_creating", args);
                var res = new args.dbSetType(dbContext);
                self._dbSetCreated(res);
                return res;
            });
        };
        DbSets.prototype.addOnDbSetCreating = function (fn, nmspace, context) {
            this.objEvents.on("dbset_creating", fn, nmspace, context);
        };
        DbSets.prototype.offOnDbSetCreating = function (nmspace) {
            this.objEvents.off("dbset_creating", nmspace);
        };
        Object.defineProperty(DbSets.prototype, "dbSetNames", {
            get: function () {
                return Object.keys(this._dbSets);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbSets.prototype, "arrDbSets", {
            get: function () {
                return this._arrDbSets;
            },
            enumerable: false,
            configurable: true
        });
        DbSets.prototype.findDbSet = function (name) {
            var res = this._dbSets[name];
            if (!res) {
                return null;
            }
            return res.Value;
        };
        DbSets.prototype.getDbSet = function (name) {
            var dbSet = this.findDbSet(name);
            if (!dbSet) {
                throw new Error(format(jriapp_shared_4.LocaleERRS.ERR_DBSET_NAME_INVALID, name));
            }
            return dbSet;
        };
        return DbSets;
    }(jriapp_shared_4.BaseObject));
    exports.DbSets = DbSets;
});
define("jriapp_db/association", ["require", "exports", "jriapp_shared"], function (require, exports, jriapp_shared_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Association = void 0;
    var utils = jriapp_shared_5.Utils, format = utils.str.format, _a = utils.core, getNewID = _a.getNewID, extend = _a.extend, Indexer = _a.Indexer, arrHelper = utils.arr;
    var Association = (function (_super) {
        __extends(Association, _super);
        function Association(options) {
            var _this = _super.call(this) || this;
            var self = _this;
            _this._uniqueID = getNewID("ass");
            var opts = extend({
                dbContext: null,
                parentName: "",
                childName: "",
                parentKeyFields: [],
                childKeyFields: [],
                parentToChildrenName: null,
                childToParentName: null,
                name: _this._uniqueID,
                onDeleteAction: 0
            }, options);
            _this._name = opts.name;
            _this._dbContext = opts.dbContext;
            _this._onDeleteAction = opts.onDeleteAction;
            _this._parentDS = opts.dbContext.getDbSet(opts.parentName);
            _this._childDS = opts.dbContext.getDbSet(opts.childName);
            _this._parentFldInfos = opts.parentKeyFields.map(function (name) {
                return self._parentDS.getFieldInfo(name);
            });
            _this._childFldInfos = opts.childKeyFields.map(function (name) {
                return self._childDS.getFieldInfo(name);
            });
            _this._parentToChildrenName = opts.parentToChildrenName;
            _this._childToParentName = opts.childToParentName;
            _this._parentMap = Indexer();
            _this._childMap = Indexer();
            _this._bindParentDS();
            var changed1 = _this._mapParentItems(_this._parentDS.items);
            _this._bindChildDS();
            var changed2 = _this._mapChildren(_this._childDS.items);
            _this._saveParentFKey = null;
            _this._saveChildFKey = null;
            _this._debounce = new jriapp_shared_5.Debounce();
            _this._changed = Indexer();
            _this._notifyBound = self._notify.bind(self);
            self._notifyParentChanged(changed1);
            self._notifyChildrenChanged(changed2);
            return _this;
        }
        Association.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this._debounce.dispose();
            this._debounce = null;
            this._changed = Indexer();
            this._unbindParentDS();
            this._unbindChildDS();
            this._parentMap = null;
            this._childMap = null;
            this._parentFldInfos = null;
            this._childFldInfos = null;
            _super.prototype.dispose.call(this);
        };
        Association.prototype.handleError = function (error, source) {
            return (!this._dbContext) ? _super.prototype.handleError.call(this, error, source) : this._dbContext.handleError(error, source);
        };
        Association.prototype._bindParentDS = function () {
            var self = this, ds = this._parentDS;
            if (!ds) {
                return;
            }
            ds.addOnCollChanged(function (_, args) {
                self._onParentCollChanged(args);
            }, self._uniqueID, null, 2);
            ds.addOnBeginEdit(function (_, args) {
                self._onParentEdit(args.item, true, false);
            }, self._uniqueID, null, 2);
            ds.addOnEndEdit(function (_, args) {
                self._onParentEdit(args.item, false, args.isCanceled);
            }, self._uniqueID, null, 2);
            ds.addOnItemDeleting(function () {
            }, self._uniqueID, null, 2);
            ds.addOnStatusChanged(function (_, args) {
                self._onParentStatusChanged(args.item, args.oldStatus);
            }, self._uniqueID, null, 2);
            ds.addOnCommitChanges(function (_, args) {
                self._onParentCommitChanges(args.item, args.isBegin, args.isRejected, args.status);
            }, self._uniqueID, null, 2);
        };
        Association.prototype._bindChildDS = function () {
            var self = this, ds = this._childDS;
            if (!ds) {
                return;
            }
            ds.addOnCollChanged(function (_, args) {
                self._onChildCollChanged(args);
            }, self._uniqueID, null, 2);
            ds.addOnBeginEdit(function (_, args) {
                self._onChildEdit(args.item, true, false);
            }, self._uniqueID, null, 2);
            ds.addOnEndEdit(function (_, args) {
                self._onChildEdit(args.item, false, args.isCanceled);
            }, self._uniqueID, null, 2);
            ds.addOnStatusChanged(function (_, args) {
                self._onChildStatusChanged(args.item, args.oldStatus);
            }, self._uniqueID, null, 2);
            ds.addOnCommitChanges(function (_, args) {
                self._onChildCommitChanges(args.item, args.isBegin, args.isRejected, args.status);
            }, self._uniqueID, null, 2);
        };
        Association.prototype._onParentCollChanged = function (args) {
            var self = this, changedKeys = Indexer();
            var item, changed = [];
            switch (args.changeType) {
                case 2:
                    changed = self.refreshParentMap();
                    break;
                case 1:
                    changed = self._mapParentItems(args.items);
                    break;
                case 0:
                    {
                        for (var _i = 0, _a = args.items; _i < _a.length; _i++) {
                            var item_1 = _a[_i];
                            var key = self._unMapParentItem(item_1);
                            if (!!key) {
                                changedKeys[key] = null;
                            }
                        }
                        changed = Object.keys(changedKeys);
                    }
                    break;
                case 3:
                    {
                        if (!!args.old_key) {
                            item = this._parentMap[args.old_key];
                            if (!!item) {
                                delete this._parentMap[args.old_key];
                                changed = this._mapParentItems([item]);
                            }
                        }
                    }
                    break;
                default:
                    throw new Error(format(jriapp_shared_5.LocaleERRS.ERR_COLLECTION_CHANGETYPE_INVALID, args.changeType));
            }
            self._notifyParentChanged(changed);
        };
        Association.prototype._onParentEdit = function (item, isBegin, isCanceled) {
            var self = this;
            if (isBegin) {
                self._storeParentFKey(item);
            }
            else {
                if (!isCanceled) {
                    self._checkParentFKey(item);
                }
                else {
                    self._saveParentFKey = null;
                }
            }
        };
        Association.prototype._onParentCommitChanges = function (item, isBegin, isRejected, status) {
            var self = this;
            var fkey;
            if (isBegin) {
                if (isRejected && status === 1) {
                    fkey = this._unMapParentItem(item);
                    if (!!fkey) {
                        self._notifyParentChanged([fkey]);
                    }
                    return;
                }
                else if (!isRejected && status === 3) {
                    fkey = this._unMapParentItem(item);
                    if (!!fkey) {
                        self._notifyParentChanged([fkey]);
                    }
                    return;
                }
                self._storeParentFKey(item);
            }
            else {
                self._checkParentFKey(item);
            }
        };
        Association.prototype._storeParentFKey = function (item) {
            var self = this, fkey = self.getParentFKey(item);
            if (fkey !== null && !!self._parentMap[fkey]) {
                self._saveParentFKey = fkey;
            }
        };
        Association.prototype._checkParentFKey = function (item) {
            var self = this, savedKey = self._saveParentFKey;
            var fkey;
            self._saveParentFKey = null;
            fkey = self.getParentFKey(item);
            if (fkey !== savedKey) {
                if (!!savedKey) {
                    self._notifyChildrenChanged([savedKey]);
                    self._notifyParentChanged([savedKey]);
                    delete self._parentMap[savedKey];
                }
                if (!!fkey) {
                    self._mapParentItems([item]);
                    self._notifyChildrenChanged([fkey]);
                    self._notifyParentChanged([fkey]);
                }
            }
        };
        Association.prototype._onParentStatusChanged = function (item, _oldStatus) {
            var self = this, newStatus = item._aspect.status;
            var fkey = null;
            var children;
            if (newStatus === 3) {
                children = self.getChildItems(item);
                fkey = this._unMapParentItem(item);
                switch (self.onDeleteAction) {
                    case 0:
                        break;
                    case 1:
                        {
                            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                                var child = children_1[_i];
                                child._aspect.deleteItem();
                            }
                        }
                        break;
                    case 2:
                        {
                            for (var _a = 0, children_2 = children; _a < children_2.length; _a++) {
                                var child = children_2[_a];
                                var isEdit = child._aspect.isEditing;
                                if (!isEdit) {
                                    child._aspect.beginEdit();
                                }
                                try {
                                    for (var _b = 0, _c = self._childFldInfos; _b < _c.length; _b++) {
                                        var f = _c[_b];
                                        child[f.fieldName] = null;
                                    }
                                    if (!isEdit) {
                                        child._aspect.endEdit();
                                    }
                                }
                                finally {
                                    if (!isEdit) {
                                        child._aspect.cancelEdit();
                                    }
                                }
                            }
                        }
                        break;
                }
                if (!!fkey) {
                    self._notifyParentChanged([fkey]);
                }
            }
        };
        Association.prototype._onChildCollChanged = function (args) {
            var self = this, items = args.items, changedKeys = Indexer();
            var item, changed = [];
            switch (args.changeType) {
                case 2:
                    changed = self.refreshChildMap();
                    break;
                case 1:
                    changed = self._mapChildren(items);
                    break;
                case 0:
                    {
                        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                            var item_2 = items_1[_i];
                            var key = self._unMapChildItem(item_2);
                            if (!!key) {
                                changedKeys[key] = null;
                            }
                        }
                        changed = Object.keys(changedKeys);
                    }
                    break;
                case 3:
                    {
                        if (!!args.old_key) {
                            item = items[0];
                            if (!!item) {
                                var parentKey = item._aspect._getFieldVal(this._childToParentName);
                                if (!!parentKey) {
                                    delete this._childMap[parentKey];
                                    item._aspect._clearFieldVal(this._childToParentName);
                                }
                                changed = this._mapChildren([item]);
                            }
                        }
                    }
                    break;
                default:
                    throw new Error(format(jriapp_shared_5.LocaleERRS.ERR_COLLECTION_CHANGETYPE_INVALID, args.changeType));
            }
            self._notifyChildrenChanged(changed);
        };
        Association.prototype._notifyChildrenChanged = function (changed) {
            this._notifyChanged([], changed);
        };
        Association.prototype._notifyParentChanged = function (changed) {
            this._notifyChanged(changed, []);
        };
        Association.prototype._notifyChanged = function (changedPkeys, changedCkeys) {
            var self = this;
            if (changedPkeys.length > 0 || changedCkeys.length > 0) {
                for (var _i = 0, changedPkeys_1 = changedPkeys; _i < changedPkeys_1.length; _i++) {
                    var key = changedPkeys_1[_i];
                    var res = self._changed[key] || { children: {}, parent: null };
                    var children = self._childMap[key];
                    if (!!children) {
                        for (var _a = 0, children_3 = children; _a < children_3.length; _a++) {
                            var child = children_3[_a];
                            res.children[child._key] = child;
                        }
                    }
                    self._changed[key] = res;
                }
                for (var _b = 0, changedCkeys_1 = changedCkeys; _b < changedCkeys_1.length; _b++) {
                    var key = changedCkeys_1[_b];
                    var res = self._changed[key] || { children: {}, parent: null };
                    var item = self._parentMap[key];
                    if (!!item) {
                        res.parent = item;
                    }
                    self._changed[key] = res;
                }
                this._debounce.enque(this._notifyBound);
            }
        };
        Association.prototype._notify = function () {
            var self = this, changed = self._changed;
            self._changed = Indexer();
            try {
                var fkeys = Object.keys(changed);
                for (var k = 0; k < fkeys.length; k += 1) {
                    var fkey = fkeys[k], map = changed[fkey];
                    self._onParentChanged(fkey, map.children);
                    if (!!map.parent) {
                        self._onChildrenChanged(fkey, map.parent);
                    }
                }
            }
            catch (err) {
                self.handleError(err, self);
            }
        };
        Association.prototype._onChildEdit = function (item, isBegin, isCanceled) {
            var self = this;
            if (isBegin) {
                self._storeChildFKey(item);
            }
            else {
                if (!isCanceled) {
                    self._checkChildFKey(item);
                }
                else {
                    self._saveChildFKey = null;
                }
            }
        };
        Association.prototype._onChildCommitChanges = function (item, isBegin, isRejected, status) {
            var self = this;
            var fkey;
            if (isBegin) {
                if (isRejected && status === 1) {
                    fkey = this._unMapChildItem(item);
                    if (!!fkey) {
                        self._notifyChildrenChanged([fkey]);
                    }
                    return;
                }
                else if (!isRejected && status === 3) {
                    fkey = self._unMapChildItem(item);
                    if (!!fkey) {
                        self._notifyChildrenChanged([fkey]);
                    }
                    return;
                }
                self._storeChildFKey(item);
            }
            else {
                self._checkChildFKey(item);
            }
        };
        Association.prototype._storeChildFKey = function (item) {
            var self = this, fkey = self.getChildFKey(item);
            if (!!fkey) {
                var arr = self._childMap[fkey];
                if (!!arr && arr.indexOf(item) > -1) {
                    self._saveChildFKey = fkey;
                }
            }
        };
        Association.prototype._checkChildFKey = function (item) {
            var self = this, savedKey = self._saveChildFKey, fkey = self.getChildFKey(item);
            self._saveChildFKey = null;
            if (fkey !== savedKey) {
                if (!!savedKey) {
                    self._notifyParentChanged([savedKey]);
                    self._notifyChildrenChanged([savedKey]);
                    var arr = self._childMap[savedKey];
                    arrHelper.remove(arr, item);
                    if (arr.length === 0) {
                        delete self._childMap[savedKey];
                    }
                }
                if (!!fkey) {
                    self._mapChildren([item]);
                    self._notifyParentChanged([fkey]);
                    self._notifyChildrenChanged([fkey]);
                }
            }
        };
        Association.prototype._onChildStatusChanged = function (item, _oldStatus) {
            var self = this, newStatus = item._aspect.status;
            var fkey = self.getChildFKey(item);
            if (!fkey) {
                return;
            }
            if (newStatus === 3) {
                fkey = self._unMapChildItem(item);
                if (!!fkey) {
                    self._notifyChildrenChanged([fkey]);
                }
            }
        };
        Association.prototype._getItemKey = function (finf, ds, item) {
            var arr = [], internal = ds._getInternal(), len = finf.length;
            for (var i = 0; i < len; i += 1) {
                var val = item[finf[i].fieldName];
                var strval = internal.getStrValue(val, finf[i]);
                if (strval === null) {
                    return null;
                }
                arr.push(strval);
            }
            return arr.join(";");
        };
        Association.prototype._resetChildMap = function () {
            var self = this, fkeys = Object.keys(this._childMap);
            this._childMap = Indexer();
            self._notifyChildrenChanged(fkeys);
        };
        Association.prototype._resetParentMap = function () {
            var self = this, fkeys = Object.keys(this._parentMap);
            this._parentMap = Indexer();
            self._notifyParentChanged(fkeys);
        };
        Association.prototype._unMapChildItem = function (item) {
            var fkey, arr, idx, changedKey = null;
            fkey = this.getChildFKey(item);
            if (!!fkey) {
                arr = this._childMap[fkey];
                if (!!arr) {
                    idx = arrHelper.remove(arr, item);
                    if (idx > -1) {
                        if (arr.length === 0) {
                            delete this._childMap[fkey];
                        }
                        changedKey = fkey;
                    }
                }
            }
            return changedKey;
        };
        Association.prototype._unMapParentItem = function (item) {
            var fkey, changedKey = null;
            fkey = this.getParentFKey(item);
            if (!!fkey && !!this._parentMap[fkey]) {
                delete this._parentMap[fkey];
                changedKey = fkey;
            }
            return changedKey;
        };
        Association.prototype._mapParentItems = function (items) {
            var chngedKeys = Indexer(), len = items.length;
            for (var i = 0; i < len; i += 1) {
                var item = items[i];
                var status_1 = item._aspect.status;
                if (status_1 === 3) {
                    continue;
                }
                var fkey = this.getParentFKey(item);
                if (!!fkey) {
                    var old = this._parentMap[fkey];
                    if (old !== item) {
                        this._parentMap[fkey] = item;
                        chngedKeys[fkey] = null;
                    }
                }
            }
            return Object.keys(chngedKeys);
        };
        Association.prototype._onChildrenChanged = function (fkey, parent) {
            if (!!fkey && !!this._parentToChildrenName && !parent.getIsStateDirty()) {
                parent.objEvents.raiseProp(this._parentToChildrenName);
            }
        };
        Association.prototype._onParentChanged = function (fkey, map) {
            var self = this;
            if (!!fkey && !!this._childToParentName) {
                var keys = Object.keys(map), len = keys.length;
                for (var k = 0; k < len; k += 1) {
                    var item = map[keys[k]];
                    if (!item.getIsStateDirty()) {
                        item.objEvents.raiseProp(self._childToParentName);
                    }
                }
            }
        };
        Association.prototype._mapChildren = function (items) {
            var chngedKeys = Indexer(), len = items.length;
            for (var i = 0; i < len; i += 1) {
                var item = items[i];
                var status_2 = item._aspect.status;
                if (status_2 === 3) {
                    continue;
                }
                var fkey = this.getChildFKey(item);
                if (!!fkey) {
                    var arr = this._childMap[fkey];
                    if (!arr) {
                        arr = [];
                        this._childMap[fkey] = arr;
                    }
                    if (arr.indexOf(item) < 0) {
                        arr.push(item);
                        if (!chngedKeys[fkey]) {
                            chngedKeys[fkey] = null;
                        }
                    }
                }
            }
            return Object.keys(chngedKeys);
        };
        Association.prototype._unbindParentDS = function () {
            var self = this, ds = this.parentDS;
            if (!ds) {
                return;
            }
            ds.objEvents.offNS(self._uniqueID);
        };
        Association.prototype._unbindChildDS = function () {
            var self = this, ds = this.childDS;
            if (!ds) {
                return;
            }
            ds.objEvents.offNS(self._uniqueID);
        };
        Association.prototype.refreshParentMap = function () {
            this._resetParentMap();
            return this._mapParentItems(this._parentDS.items);
        };
        Association.prototype.refreshChildMap = function () {
            this._resetChildMap();
            return this._mapChildren(this._childDS.items);
        };
        Association.prototype.getParentFKey = function (item) {
            if (!!item && item._aspect.isNew) {
                return item._key;
            }
            return this._getItemKey(this._parentFldInfos, this._parentDS, item);
        };
        Association.prototype.getChildFKey = function (item) {
            if (!!item && !!this._childToParentName) {
                var parentKey = item._aspect._getFieldVal(this._childToParentName);
                if (!!parentKey) {
                    return parentKey;
                }
            }
            return this._getItemKey(this._childFldInfos, this._childDS, item);
        };
        Association.prototype.isParentChild = function (parent, child) {
            if (!parent || !child) {
                return false;
            }
            var fkey1 = this.getParentFKey(parent);
            if (!fkey1) {
                return false;
            }
            var fkey2 = this.getChildFKey(child);
            if (!fkey2) {
                return false;
            }
            return fkey1 === fkey2;
        };
        Association.prototype.getChildItems = function (parent) {
            var arr = [];
            if (!parent) {
                return arr;
            }
            try {
                var fkey = this.getParentFKey(parent);
                arr = this._childMap[fkey];
            }
            catch (err) {
                utils.err.reThrow(err, this.handleError(err, this));
            }
            return (!arr) ? [] : arr;
        };
        Association.prototype.getParentItem = function (item) {
            var obj = null;
            if (!item) {
                return obj;
            }
            try {
                var fkey = this.getChildFKey(item);
                obj = this._parentMap[fkey];
            }
            catch (err) {
                utils.err.reThrow(err, this.handleError(err, this));
            }
            return (!obj) ? null : obj;
        };
        Association.prototype.toString = function () {
            return this._name;
        };
        Object.defineProperty(Association.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Association.prototype, "parentToChildrenName", {
            get: function () {
                return this._parentToChildrenName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Association.prototype, "childToParentName", {
            get: function () {
                return this._childToParentName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Association.prototype, "parentDS", {
            get: function () {
                return this._parentDS;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Association.prototype, "childDS", {
            get: function () {
                return this._childDS;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Association.prototype, "parentFldInfos", {
            get: function () {
                return this._parentFldInfos;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Association.prototype, "childFldInfos", {
            get: function () {
                return this._childFldInfos;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Association.prototype, "onDeleteAction", {
            get: function () {
                return this._onDeleteAction;
            },
            enumerable: false,
            configurable: true
        });
        return Association;
    }(jriapp_shared_5.BaseObject));
    exports.Association = Association;
});
define("jriapp_db/error", ["require", "exports", "jriapp_shared"], function (require, exports, jriapp_shared_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SubmitError = exports.SvcValidationError = exports.ConcurrencyError = exports.AccessDeniedError = exports.DataOperationError = void 0;
    var format = jriapp_shared_6.Utils.str.format;
    var DataOperationError = (function (_super) {
        __extends(DataOperationError, _super);
        function DataOperationError(originalError, operationName) {
            var _this = this;
            var message;
            if (originalError instanceof Error) {
                message = originalError.message;
            }
            else if (originalError instanceof jriapp_shared_6.BaseError) {
                message = originalError.message;
            }
            if (!message) {
                message = "" + originalError;
            }
            _this = _super.call(this, message) || this;
            _this._origError = originalError;
            _this._operationName = operationName;
            return _this;
        }
        Object.defineProperty(DataOperationError.prototype, "operationName", {
            get: function () {
                return this._operationName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataOperationError.prototype, "origError", {
            get: function () {
                return this._origError;
            },
            enumerable: false,
            configurable: true
        });
        return DataOperationError;
    }(jriapp_shared_6.BaseError));
    exports.DataOperationError = DataOperationError;
    var AccessDeniedError = (function (_super) {
        __extends(AccessDeniedError, _super);
        function AccessDeniedError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AccessDeniedError;
    }(DataOperationError));
    exports.AccessDeniedError = AccessDeniedError;
    var ConcurrencyError = (function (_super) {
        __extends(ConcurrencyError, _super);
        function ConcurrencyError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ConcurrencyError;
    }(DataOperationError));
    exports.ConcurrencyError = ConcurrencyError;
    var SvcValidationError = (function (_super) {
        __extends(SvcValidationError, _super);
        function SvcValidationError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SvcValidationError;
    }(DataOperationError));
    exports.SvcValidationError = SvcValidationError;
    var SubmitError = (function (_super) {
        __extends(SubmitError, _super);
        function SubmitError(origError, allSubmitted, notValidated) {
            var _this = this;
            var message = origError.message || ("" + origError);
            _this = _super.call(this, origError, 1) || this;
            _this._origError = origError;
            _this._allSubmitted = allSubmitted || [];
            _this._notValidated = notValidated || [];
            if (_this._notValidated.length > 0) {
                var res = [message + ":"];
                for (var _i = 0, _a = _this._notValidated; _i < _a.length; _i++) {
                    var item = _a[_i];
                    res.push(format("item key:{0} errors:{1}", item._key, item._aspect.getErrorString()));
                }
                message = res.join("\r\n");
            }
            return _this;
        }
        Object.defineProperty(SubmitError.prototype, "allSubmitted", {
            get: function () { return this._allSubmitted; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SubmitError.prototype, "notValidated", {
            get: function () { return this._notValidated; },
            enumerable: false,
            configurable: true
        });
        return SubmitError;
    }(DataOperationError));
    exports.SubmitError = SubmitError;
});
define("jriapp_db/dbcontext", ["require", "exports", "jriapp_shared", "jriapp_shared/collection/utils", "jriapp_db/association", "jriapp_db/error"], function (require, exports, jriapp_shared_7, utils_3, association_1, error_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DbContext = void 0;
    var utils = jriapp_shared_7.Utils, http = utils.http, _a = utils.check, isArray = _a.isArray, isNt = _a.isNt, isFunc = _a.isFunc, isString = _a.isString, _b = utils.str, format = _b.format, endsWith = _b.endsWith, _c = utils.core, getTimeZoneOffset = _c.getTimeZoneOffset, merge = _c.merge, Indexer = _c.Indexer, ERROR = utils.err, stringifyValue = utils_3.ValueUtils.stringifyValue, _d = utils.async, delay = _d.delay, createDeferred = _d.createDeferred;
    var DATA_SVC_METH;
    (function (DATA_SVC_METH) {
        DATA_SVC_METH["Invoke"] = "invoke";
        DATA_SVC_METH["Query"] = "query";
        DATA_SVC_METH["Permissions"] = "permissions";
        DATA_SVC_METH["Submit"] = "save";
        DATA_SVC_METH["Refresh"] = "refresh";
    })(DATA_SVC_METH || (DATA_SVC_METH = {}));
    function fn_checkError(svcError, oper) {
        if (!svcError || ERROR.checkIsDummy(svcError)) {
            return;
        }
        switch (svcError.name) {
            case "AccessDeniedException":
                throw new error_1.AccessDeniedError(jriapp_shared_7.LocaleERRS.ERR_ACCESS_DENIED, oper);
            case "ConcurrencyException":
                throw new error_1.ConcurrencyError(jriapp_shared_7.LocaleERRS.ERR_CONCURRENCY, oper);
            case "ValidationException":
                throw new error_1.SvcValidationError(format(jriapp_shared_7.LocaleERRS.ERR_SVC_VALIDATION, svcError.message), oper);
            case "DomainServiceException":
                throw new error_1.DataOperationError(format(jriapp_shared_7.LocaleERRS.ERR_SVC_ERROR, svcError.message), oper);
            default:
                throw new error_1.DataOperationError(format(jriapp_shared_7.LocaleERRS.ERR_UNEXPECTED_SVC_ERROR, svcError.message), oper);
        }
    }
    var DBCTX_EVENTS;
    (function (DBCTX_EVENTS) {
        DBCTX_EVENTS["SUBMITTING"] = "submitting";
        DBCTX_EVENTS["SUBMITTED"] = "submitted";
        DBCTX_EVENTS["SUBMIT_ERROR"] = "submit_error";
        DBCTX_EVENTS["DBSET_CREATING"] = "dbset_creating";
    })(DBCTX_EVENTS || (DBCTX_EVENTS = {}));
    var DbContext = (function (_super) {
        __extends(DbContext, _super);
        function DbContext() {
            var _this = _super.call(this) || this;
            var self = _this;
            _this._initState = null;
            _this._requestHeaders = Indexer();
            _this._requests = [];
            _this._dbSets = null;
            _this._svcMethods = {};
            _this._assoc = {};
            _this._arrAssoc = [];
            _this._queryInfo = Indexer();
            _this._serviceUrl = null;
            _this._isSubmiting = false;
            _this._isHasChanges = false;
            _this._pendingSubmit = null;
            _this._serverTimezone = getTimeZoneOffset();
            _this._waitQueue = new jriapp_shared_7.WaitQueue(_this);
            _this._internal = {
                onItemRefreshed: function (res, item) {
                    self._onItemRefreshed(res, item);
                },
                refreshItem: function (item) {
                    return self._refreshItem(item);
                },
                getQueryInfo: function (name) {
                    return self._getQueryInfo(name);
                },
                onDbSetHasChangesChanged: function (eSet) {
                    self._onDbSetHasChangesChanged(eSet);
                },
                load: function (query, reason) {
                    return self._load(query, reason);
                }
            };
            _this.objEvents.onProp("isSubmiting", function () {
                self.objEvents.raiseProp("isBusy");
            });
            return _this;
        }
        DbContext.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this.abortRequests();
            this._waitQueue.dispose();
            this._waitQueue = null;
            for (var _i = 0, _a = this._arrAssoc; _i < _a.length; _i++) {
                var assoc = _a[_i];
                assoc.dispose();
            }
            this._arrAssoc = [];
            this._assoc = {};
            this._dbSets.dispose();
            this._dbSets = null;
            this._svcMethods = {};
            this._queryInfo = Indexer();
            this._serviceUrl = null;
            this._initState = null;
            this._isSubmiting = false;
            this._isHasChanges = false;
            _super.prototype.dispose.call(this);
        };
        DbContext.prototype._checkDisposed = function () {
            if (this.getIsStateDirty()) {
                ERROR.abort("dbContext is disposed");
            }
        };
        DbContext.prototype._initDbSets = function () {
            var _this = this;
            if (this.isInitialized) {
                throw new Error(jriapp_shared_7.LocaleERRS.ERR_DOMAIN_CONTEXT_INITIALIZED);
            }
            this._dbSets = this._createDbSets();
            this._dbSets.addOnDbSetCreating(function (_, args) {
                _this.objEvents.raise("dbset_creating", args);
            });
            var associations = this._createAssociations();
            this._initAssociations(associations);
            var methods = this._createMethods();
            this._initMethods(methods);
        };
        DbContext.prototype._initAssociations = function (associations) {
            var self = this;
            for (var _i = 0, associations_1 = associations; _i < associations_1.length; _i++) {
                var assoc = associations_1[_i];
                self._initAssociation(assoc);
            }
        };
        DbContext.prototype._initMethods = function (methods) {
            var self = this;
            for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
                var method = methods_1[_i];
                if (method.isQuery) {
                    self._queryInfo[method.methodName] = method;
                }
                else {
                    self._initMethod(method);
                }
            }
        };
        DbContext.prototype._updatePermissions = function (info) {
            var _this = this;
            this._serverTimezone = info.serverTimezone;
            info.permissions.forEach(function (perms) {
                var dbSet = _this.findDbSet(perms.dbSetName);
                if (!!dbSet) {
                    dbSet._getInternal().updatePermissions(perms);
                }
            });
        };
        DbContext.prototype._initAssociation = function (assoc) {
            var self = this, options = {
                dbContext: self,
                parentName: assoc.parentDbSetName,
                childName: assoc.childDbSetName,
                onDeleteAction: assoc.onDeleteAction,
                parentKeyFields: assoc.fieldRels.map(function (f) { return f.parentField; }),
                childKeyFields: assoc.fieldRels.map(function (f) { return f.childField; }),
                parentToChildrenName: assoc.parentToChildrenName,
                childToParentName: assoc.childToParentName,
                name: assoc.name
            }, name = "get" + assoc.name;
            var lazy = new jriapp_shared_7.Lazy(function () {
                var res = new association_1.Association(options);
                self._arrAssoc.push(res);
                return res;
            });
            this._assoc[name] = function () { return lazy.Value; };
        };
        DbContext.prototype._initMethod = function (methodInfo) {
            var self = this;
            this._svcMethods[methodInfo.methodName] = function (args) {
                return self._invokeMethod(methodInfo, args).then(function (res) {
                    self._checkDisposed();
                    if (!res) {
                        throw new Error(format(jriapp_shared_7.LocaleERRS.ERR_UNEXPECTED_SVC_ERROR, "operation result is empty"));
                    }
                    fn_checkError(res.error, 3);
                    return res.result;
                }).catch(function (err) {
                    self._onDataOperError(err, 3);
                    ERROR.throwDummy(err);
                });
            };
        };
        DbContext.prototype._addRequestPromise = function (req, operType, name) {
            var self = this, item = { req: req, operType: operType, name: name }, cnt = self._requests.length, oldBusy = this.isBusy;
            self._requests.push(item);
            req.finally(function () {
                if (self.getIsStateDirty()) {
                    return;
                }
                var oldBusy = self.isBusy;
                utils.arr.remove(self._requests, item);
                self.objEvents.raiseProp("requestCount");
                if (oldBusy !== self.isBusy) {
                    self.objEvents.raiseProp("isBusy");
                }
            });
            if (cnt !== self._requests.length) {
                self.objEvents.raiseProp("requestCount");
            }
            if (oldBusy !== self.isBusy) {
                self.objEvents.raiseProp("isBusy");
            }
        };
        DbContext.prototype._tryAbortRequest = function (operType, name) {
            var reqs = this._requests.filter(function (req) { return req.name === name && operType.indexOf(req.operType) > -1; });
            reqs.forEach(function (r) { r.req.abort(); });
        };
        DbContext.prototype._getMethodParams = function (methodInfo, args) {
            var self = this, methodName = methodInfo.methodName, data = { methodName: methodName, paramInfo: { parameters: [] } }, paramInfos = methodInfo.parameters;
            if (!args) {
                args = Indexer();
            }
            for (var _i = 0, paramInfos_1 = paramInfos; _i < paramInfos_1.length; _i++) {
                var pinfo = paramInfos_1[_i];
                var val = args[pinfo.name];
                if (!pinfo.isNullable && !pinfo.isArray && !(pinfo.dataType === 1 || pinfo.dataType === 10) && isNt(val)) {
                    throw new Error(format(jriapp_shared_7.LocaleERRS.ERR_SVC_METH_PARAM_INVALID, pinfo.name, val, methodInfo.methodName));
                }
                if (isFunc(val)) {
                    throw new Error(format(jriapp_shared_7.LocaleERRS.ERR_SVC_METH_PARAM_INVALID, pinfo.name, val, methodInfo.methodName));
                }
                if (pinfo.isArray && !isNt(val) && !isArray(val)) {
                    val = [val];
                }
                var value = null;
                if (pinfo.dataType === 10 && isArray(val)) {
                    value = JSON.stringify(val);
                }
                else if (isArray(val)) {
                    var arr = [];
                    for (var _a = 0, val_1 = val; _a < val_1.length; _a++) {
                        var _val = val_1[_a];
                        arr.push(stringifyValue(_val, pinfo.dateConversion, pinfo.dataType, self.serverTimezone));
                    }
                    value = JSON.stringify(arr);
                }
                else {
                    value = stringifyValue(val, pinfo.dateConversion, pinfo.dataType, self.serverTimezone);
                }
                data.paramInfo.parameters.push({ name: pinfo.name, value: value });
            }
            return data;
        };
        DbContext.prototype._invokeMethod = function (methodInfo, args) {
            var _this = this;
            var self = this;
            return delay(function () {
                self._checkDisposed();
                var data = self._getMethodParams(methodInfo, args);
                return JSON.stringify(data);
            }).then(function (postData) {
                self._checkDisposed();
                var invokeUrl = _this._getUrl("invoke"), reqPromise = http.postAjax(invokeUrl, postData, self.requestHeaders);
                self._addRequestPromise(reqPromise, 3);
                return reqPromise;
            }).then(function (res) {
                return JSON.parse(res);
            });
        };
        DbContext.prototype._loadFromCache = function (query, reason) {
            var self = this;
            return delay(function () {
                self._checkDisposed();
                var dbSet = query.dbSet;
                return dbSet._getInternal().fillFromCache({ reason: reason, query: query });
            });
        };
        DbContext.prototype._loadSubsets = function (subsets, refreshOnly, isClearAll) {
            if (refreshOnly === void 0) { refreshOnly = false; }
            if (isClearAll === void 0) { isClearAll = false; }
            var self = this, isHasSubsets = isArray(subsets) && subsets.length > 0;
            if (!isHasSubsets) {
                return;
            }
            for (var _i = 0, subsets_1 = subsets; _i < subsets_1.length; _i++) {
                var subset = subsets_1[_i];
                var dbSet = self.getDbSet(subset.dbSetName);
                if (!refreshOnly) {
                    dbSet.fillData(subset, !isClearAll);
                }
                else {
                    dbSet.refreshData(subset);
                }
            }
        };
        DbContext.prototype._onLoaded = function (response, query, reason) {
            var self = this;
            return delay(function () {
                self._checkDisposed();
                if (isNt(response)) {
                    throw new Error(format(jriapp_shared_7.LocaleERRS.ERR_UNEXPECTED_SVC_ERROR, "null result"));
                }
                var dbSetName = response.dbSetName, dbSet = self.getDbSet(dbSetName);
                if (isNt(dbSet)) {
                    throw new Error(format(jriapp_shared_7.LocaleERRS.ERR_DBSET_NAME_INVALID, dbSetName));
                }
                fn_checkError(response.error, 2);
                var isClearAll = (!!query && query.isClearPrevData);
                return dbSet._getInternal().fillFromService({
                    res: response,
                    reason: reason,
                    query: query,
                    onFillEnd: function () { self._loadSubsets(response.subsets, false, isClearAll); }
                });
            });
        };
        DbContext.prototype._dataSaved = function (response, context) {
            var self = this;
            try {
                try {
                    fn_checkError(response.error, 1);
                }
                catch (ex) {
                    var submitted_1 = [], notvalid_1 = [];
                    response.dbSets.forEach(function (jsDB) {
                        var dbSet = self._dbSets.getDbSet(jsDB.dbSetName);
                        for (var _i = 0, _a = jsDB.rows; _i < _a.length; _i++) {
                            var row = _a[_i];
                            var item = dbSet.getItemByKey(row.clientKey);
                            if (!item) {
                                throw new Error(format(jriapp_shared_7.LocaleERRS.ERR_KEY_IS_NOTFOUND, row.clientKey));
                            }
                            submitted_1.push(item);
                            if (!!row.invalid) {
                                dbSet._getInternal().setItemInvalid(row);
                                notvalid_1.push(item);
                            }
                        }
                    });
                    throw new error_1.SubmitError(ex, submitted_1, notvalid_1);
                }
                response.dbSets.forEach(function (jsDB) {
                    self._dbSets.getDbSet(jsDB.dbSetName)._getInternal().commitChanges(jsDB.rows);
                });
            }
            catch (ex) {
                self._onSubmitError(ex, context);
                ERROR.throwDummy(ex);
            }
        };
        DbContext.prototype._getChanges = function () {
            var request = { dbSets: [], trackAssocs: [] };
            this._dbSets.arrDbSets.forEach(function (dbSet) {
                dbSet.endEdit();
                var changes = dbSet._getInternal().getChanges();
                if (changes.length === 0) {
                    return;
                }
                var trackAssoc = dbSet._getInternal().getTrackAssocInfo(), jsDB = { dbSetName: dbSet.dbSetName, rows: changes };
                request.dbSets.push(jsDB);
                request.trackAssocs = request.trackAssocs.concat(trackAssoc);
            });
            return request;
        };
        DbContext.prototype._getUrl = function (action) {
            var loadUrl = this.serviceUrl;
            if (!endsWith(loadUrl, "/")) {
                loadUrl = loadUrl + "/";
            }
            loadUrl = loadUrl + [action, ""].join("/");
            return loadUrl;
        };
        DbContext.prototype._onDataOperError = function (ex, oper) {
            if (ERROR.checkIsDummy(ex)) {
                return true;
            }
            var err = (ex instanceof error_1.DataOperationError) ? ex : new error_1.DataOperationError(ex, oper);
            return this.handleError(err, this);
        };
        DbContext.prototype._onSubmitError = function (error, context) {
            if (ERROR.checkIsDummy(error)) {
                return;
            }
            var args = { error: error, isHandled: false, context: context };
            this.objEvents.raise("submit_error", args);
            if (!args.isHandled) {
                this._onDataOperError(error, 1);
            }
        };
        DbContext.prototype._onSubmitting = function (context) {
            var submittingArgs = { isCancelled: false, context: context };
            this.objEvents.raise("submitting", submittingArgs);
            return !submittingArgs.isCancelled;
        };
        DbContext.prototype._onSubmitted = function (context) {
            this.objEvents.raise("submitted", { context: context });
        };
        DbContext.prototype.waitForNotBusy = function (callback) {
            this._waitQueue.enQueue({
                prop: "isBusy",
                groupName: null,
                predicate: function (val) {
                    return !val;
                },
                action: callback,
                actionArgs: []
            });
        };
        DbContext.prototype.waitForNotSubmiting = function (callback) {
            this._waitQueue.enQueue({
                prop: "isSubmiting",
                predicate: function (val) {
                    return !val;
                },
                action: callback,
                actionArgs: [],
                groupName: "submit",
                lastWins: true
            });
        };
        DbContext.prototype._loadInternal = function (context) {
            var self = this;
            context.fn_onStart();
            delay(function () {
                self._checkDisposed();
                var oldQuery = context.dbSet.query, loadPageCount = context.loadPageCount, isPagingEnabled = context.isPagingEnabled;
                var range, pageCount = 1, pageIndex = context.pageIndex;
                context.query.pageIndex = pageIndex;
                context.dbSet._getInternal().beforeLoad(context.query, oldQuery);
                pageIndex = context.query.pageIndex;
                if (loadPageCount > 1 && isPagingEnabled) {
                    if (context.query._getInternal().isPageCached(pageIndex)) {
                        return self._loadFromCache(context.query, context.reason);
                    }
                    else {
                        range = context.query._getInternal().getCache().getNextRange(pageIndex);
                        pageIndex = range.start;
                        pageCount = range.cnt;
                    }
                }
                var requestInfo = {
                    dbSetName: context.dbSetName,
                    pageIndex: context.query.isPagingEnabled ? pageIndex : -1,
                    pageSize: context.query.pageSize,
                    pageCount: pageCount,
                    isIncludeTotalCount: context.query.isIncludeTotalCount,
                    filterInfo: context.query.filterInfo,
                    sortInfo: context.query.sortInfo,
                    paramInfo: self._getMethodParams(context.query._getInternal().getQueryInfo(), context.query.params).paramInfo,
                    queryName: context.query.queryName
                };
                var reqPromise = http.postAjax(self._getUrl("query"), JSON.stringify(requestInfo), self.requestHeaders);
                self._addRequestPromise(reqPromise, 2, requestInfo.dbSetName);
                return reqPromise.then(function (res) {
                    return JSON.parse(res);
                }).then(function (response) {
                    self._checkDisposed();
                    return self._onLoaded(response, context.query, context.reason);
                });
            }).then(function (loadRes) {
                self._checkDisposed();
                context.fn_onOK(loadRes);
            }).catch(function (err) {
                context.fn_onErr(err);
            });
        };
        DbContext.prototype._onItemRefreshed = function (res, item) {
            try {
                fn_checkError(res.error, 4);
                if (!res.rowInfo) {
                    item._aspect.dbSet.removeItem(item);
                    item.dispose();
                    throw new Error(jriapp_shared_7.LocaleERRS.ERR_ITEM_DELETED_BY_ANOTHER_USER);
                }
                else {
                    item._aspect._refreshValues(res.rowInfo, 2);
                }
            }
            catch (ex) {
                this._onDataOperError(ex, 4);
                ERROR.throwDummy(ex);
            }
        };
        DbContext.prototype._loadRefresh = function (args) {
            var self = this;
            args.fn_onStart();
            return delay().then(function () {
                self._checkDisposed();
                var request = {
                    dbSetName: args.item._aspect.dbSetName,
                    rowInfo: args.item._aspect._getRowInfo()
                };
                args.item._aspect._checkCanRefresh();
                var url = self._getUrl("refresh"), reqPromise = http.postAjax(url, JSON.stringify(request), self.requestHeaders);
                self._addRequestPromise(reqPromise, 4);
                return reqPromise;
            }).then(function (res) {
                return JSON.parse(res);
            }).then(function (res) {
                self._checkDisposed();
                args.fn_onOK(res);
            }).catch(function (err) {
                args.fn_onErr(err);
            });
        };
        DbContext.prototype._refreshItem = function (item) {
            var self = this, deferred = createDeferred();
            var context = {
                item: item,
                dbSet: item._aspect.dbSet,
                fn_onStart: function () {
                    context.item._aspect._setIsRefreshing(true);
                    context.dbSet._getInternal().setIsLoading(true);
                },
                fn_onEnd: function () {
                    context.dbSet._getInternal().setIsLoading(false);
                    context.item._aspect._setIsRefreshing(false);
                },
                fn_onErr: function (ex) {
                    try {
                        context.fn_onEnd();
                        self._onDataOperError(ex, 4);
                    }
                    finally {
                        deferred.reject();
                    }
                },
                fn_onOK: function (res) {
                    try {
                        self._onItemRefreshed(res, item);
                        context.fn_onEnd();
                    }
                    finally {
                        deferred.resolve(item);
                    }
                }
            };
            context.dbSet.waitForNotBusy(function () {
                try {
                    self._checkDisposed();
                    self._loadRefresh(context);
                }
                catch (err) {
                    context.fn_onErr(err);
                }
            }, item._key);
            return deferred.promise();
        };
        DbContext.prototype._getQueryInfo = function (name) {
            return this._queryInfo[name];
        };
        DbContext.prototype._onDbSetHasChangesChanged = function (dbSet) {
            var old = this._isHasChanges;
            this._isHasChanges = false;
            if (dbSet.isHasChanges) {
                this._isHasChanges = true;
            }
            else {
                var len = this._dbSets.arrDbSets.length;
                for (var i = 0; i < len; i += 1) {
                    var test = this._dbSets.arrDbSets[i];
                    if (test.isHasChanges) {
                        this._isHasChanges = true;
                        break;
                    }
                }
            }
            if (this._isHasChanges !== old) {
                this.objEvents.raiseProp("isHasChanges");
            }
        };
        DbContext.prototype._load = function (query, reason) {
            if (!query) {
                throw new Error(jriapp_shared_7.LocaleERRS.ERR_DB_LOAD_NO_QUERY);
            }
            var self = this, deferred = createDeferred();
            var prevQuery = null;
            var context = {
                query: query,
                reason: reason,
                loadPageCount: query.loadPageCount,
                pageIndex: query.pageIndex,
                isPagingEnabled: query.isPagingEnabled,
                dbSetName: query.dbSetName,
                dbSet: self.getDbSet(query.dbSetName),
                fn_onStart: function () {
                    context.dbSet._getInternal().setIsLoading(true);
                    if (context.query.isForAppend) {
                        prevQuery = context.dbSet.query;
                    }
                },
                fn_onEnd: function () {
                    if (context.query.isForAppend) {
                        context.dbSet._getInternal().setQuery(prevQuery);
                        context.query.dispose();
                    }
                    context.dbSet._getInternal().setIsLoading(false);
                },
                fn_onOK: function (res) {
                    try {
                        context.fn_onEnd();
                    }
                    finally {
                        deferred.resolve(res);
                    }
                },
                fn_onErr: function (ex) {
                    try {
                        context.fn_onEnd();
                        self._onDataOperError(ex, 2);
                    }
                    finally {
                        deferred.reject();
                    }
                }
            };
            if (query.isClearPrevData) {
                self._tryAbortRequest([2, 4], context.dbSetName);
            }
            context.dbSet.waitForNotBusy(function () {
                try {
                    self._checkDisposed();
                    self._loadInternal(context);
                }
                catch (err) {
                    context.fn_onErr(err);
                }
            }, query.isClearPrevData ? context.dbSetName : null);
            return deferred.promise();
        };
        DbContext.prototype._submitChanges = function (args, context) {
            var self = this, noChanges = "NO_CHANGES";
            args.fn_onStart();
            delay(function () {
                self._checkDisposed();
                var res = self._getChanges();
                if (res.dbSets.length === 0) {
                    ERROR.abort(noChanges);
                }
                return res;
            }).then(function (changes) {
                var reqPromise = http.postAjax(self._getUrl("save"), JSON.stringify(changes), self.requestHeaders);
                self._addRequestPromise(reqPromise, 1);
                return reqPromise;
            }).then(function (res) {
                return JSON.parse(res);
            }).then(function (res) {
                self._checkDisposed();
                self._dataSaved(res, context);
                if (!!res.subsets) {
                    self._loadSubsets(res.subsets, true);
                }
            }).then(function () {
                self._checkDisposed();
                args.fn_onOk();
            }).catch(function (er) {
                if (!self.getIsStateDirty() && ERROR.checkIsAbort(er) && er.reason === noChanges) {
                    args.fn_onOk();
                }
                else {
                    args.fn_onErr(er);
                }
            });
        };
        DbContext.prototype._getInternal = function () {
            return this._internal;
        };
        DbContext.prototype.initialize = function (options) {
            var _this = this;
            if (!!this._initState) {
                return this._initState;
            }
            var self = this, opts = merge(options, {
                serviceUrl: null,
                permissions: null
            });
            if (!isString(opts.serviceUrl)) {
                throw new Error(format(jriapp_shared_7.LocaleERRS.ERR_PARAM_INVALID, "serviceUrl", opts.serviceUrl));
            }
            this._serviceUrl = opts.serviceUrl;
            this._initDbSets();
            this._initState = delay(function () {
                if (!!opts.permissions) {
                    return opts.permissions;
                }
                else {
                    var loadUrl = _this._getUrl("permissions");
                    var ajaxPromise = http.getAjax(loadUrl, self.requestHeaders);
                    _this._addRequestPromise(ajaxPromise, 5);
                    return ajaxPromise.then(function (permissions) {
                        return JSON.parse(permissions);
                    });
                }
            }).then(function (res) {
                self._checkDisposed();
                self._updatePermissions(res);
                self.objEvents.raiseProp("isInitialized");
            }).catch(function (err) {
                self._onDataOperError(err, 5);
                ERROR.throwDummy(err);
            });
            return this._initState;
        };
        DbContext.prototype.addOnDisposed = function (handler, nmspace, context) {
            this.objEvents.addOnDisposed(handler, nmspace, context);
        };
        DbContext.prototype.offOnDisposed = function (nmspace) {
            this.objEvents.offOnDisposed(nmspace);
        };
        DbContext.prototype.addOnError = function (handler, nmspace, context) {
            this.objEvents.addOnError(handler, nmspace, context);
        };
        DbContext.prototype.offOnError = function (nmspace) {
            this.objEvents.offOnError(nmspace);
        };
        DbContext.prototype.addOnSubmitting = function (fn, nmspace, context) {
            this.objEvents.on("submitting", fn, nmspace, context);
        };
        DbContext.prototype.offOnSubmitting = function (nmspace) {
            this.objEvents.off("submitting", nmspace);
        };
        DbContext.prototype.addOnSubmitted = function (fn, nmspace, context) {
            this.objEvents.on("submitted", fn, nmspace, context);
        };
        DbContext.prototype.offOnSubmitted = function (nmspace) {
            this.objEvents.off("submitted", nmspace);
        };
        DbContext.prototype.addOnSubmitError = function (fn, nmspace, context) {
            this.objEvents.on("submit_error", fn, nmspace, context);
        };
        DbContext.prototype.offOnSubmitError = function (nmspace) {
            this.objEvents.off("submit_error", nmspace);
        };
        DbContext.prototype.addOnDbSetCreating = function (fn, nmspace, context) {
            this.objEvents.on("dbset_creating", fn, nmspace, context);
        };
        DbContext.prototype.offOnDbSetCreating = function (nmspace) {
            this.objEvents.off("dbset_creating", nmspace);
        };
        DbContext.prototype.getDbSet = function (name) {
            return this._dbSets.getDbSet(name);
        };
        DbContext.prototype.findDbSet = function (name) {
            return this._dbSets.findDbSet(name);
        };
        DbContext.prototype.getAssociation = function (name) {
            var name2 = "get" + name, fn = this._assoc[name2];
            if (!fn) {
                throw new Error(format(jriapp_shared_7.LocaleERRS.ERR_ASSOC_NAME_INVALID, name));
            }
            return fn();
        };
        DbContext.prototype.submitChanges = function () {
            var self = this;
            if (!!this._pendingSubmit) {
                return this._pendingSubmit.promise;
            }
            var deferred = createDeferred(), submitState = { promise: deferred.promise() };
            this._pendingSubmit = submitState;
            var context = Indexer(), args = {
                fn_onStart: function () {
                    if (!self._isSubmiting) {
                        self._isSubmiting = true;
                        self.objEvents.raiseProp("isSubmiting");
                    }
                    self._pendingSubmit = null;
                },
                fn_onEnd: function () {
                    if (self._isSubmiting) {
                        self._isSubmiting = false;
                        self.objEvents.raiseProp("isSubmiting");
                    }
                },
                fn_onErr: function (ex) {
                    try {
                        args.fn_onEnd();
                        self._onSubmitError(ex, context);
                    }
                    finally {
                        deferred.reject();
                    }
                },
                fn_onOk: function () {
                    try {
                        args.fn_onEnd();
                    }
                    finally {
                        deferred.resolve();
                        self._onSubmitted(context);
                    }
                }
            };
            utils.queue.enque(function () {
                self.waitForNotBusy(function () {
                    try {
                        self._checkDisposed();
                        if (self._onSubmitting(context)) {
                            self._submitChanges(args, context);
                        }
                    }
                    catch (err) {
                        args.fn_onErr(err);
                    }
                });
            });
            return submitState.promise;
        };
        DbContext.prototype.load = function (query) {
            return this._load(query, 0);
        };
        DbContext.prototype.acceptChanges = function () {
            this._dbSets.arrDbSets.forEach(function (dbSet) {
                dbSet.acceptChanges();
            });
        };
        DbContext.prototype.rejectChanges = function () {
            this._dbSets.arrDbSets.forEach(function (dbSet) {
                dbSet.rejectChanges();
            });
        };
        DbContext.prototype.abortRequests = function (reason, operType) {
            if (isNt(operType)) {
                operType = 0;
            }
            var arr = this._requests.filter(function (a) {
                return operType === 0 ? true : (a.operType === operType);
            });
            for (var i = 0; i < arr.length; i += 1) {
                var promise = arr[i];
                promise.req.abort(reason);
            }
        };
        Object.defineProperty(DbContext.prototype, "associations", {
            get: function () {
                return this._assoc;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbContext.prototype, "serviceMethods", {
            get: function () {
                return this._svcMethods;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbContext.prototype, "dbSets", {
            get: function () {
                return this._dbSets;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbContext.prototype, "serviceUrl", {
            get: function () {
                return this._serviceUrl;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbContext.prototype, "isInitialized", {
            get: function () {
                return !!this._initState && this._initState.state() === 2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbContext.prototype, "isBusy", {
            get: function () {
                return (this.requestCount > 0) || this.isSubmiting;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbContext.prototype, "isSubmiting", {
            get: function () {
                return this._isSubmiting;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbContext.prototype, "serverTimezone", {
            get: function () {
                return this._serverTimezone;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbContext.prototype, "isHasChanges", {
            get: function () {
                return this._isHasChanges;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbContext.prototype, "requestCount", {
            get: function () {
                return this._requests.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DbContext.prototype, "requestHeaders", {
            get: function () {
                return this._requestHeaders;
            },
            set: function (v) {
                this._requestHeaders = v;
            },
            enumerable: false,
            configurable: true
        });
        return DbContext;
    }(jriapp_shared_7.BaseObject));
    exports.DbContext = DbContext;
});
define("jriapp_db/entity_aspect", ["require", "exports", "jriapp_shared", "jriapp_shared/errors", "jriapp_shared/collection/utils", "jriapp_shared/collection/aspect", "jriapp_db/error"], function (require, exports, jriapp_shared_8, errors_1, utils_4, aspect_1, error_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EntityAspect = void 0;
    var utils = jriapp_shared_8.Utils, _undefined = utils.check._undefined, format = utils.str.format, _a = utils.core, getValue = _a.getValue, setValue = _a.setValue, uuid = _a.uuid, compareVals = utils_4.ValueUtils.compareVals, parseValue = utils_4.ValueUtils.parseValue, sys = utils.sys;
    function fn_isNotSubmittable(fieldInfo) {
        switch (fieldInfo.fieldType) {
            case 1:
            case 3:
            case 2:
                return true;
            default:
                return false;
        }
    }
    function _fn_walkChanges(name, val, fn) {
        if (!!val.nested && val.nested.length > 0) {
            var len = val.nested.length;
            for (var i = 0; i < len; i += 1) {
                var prop = val.nested[i];
                if (!!prop.nested && prop.nested.length > 0) {
                    _fn_walkChanges(name + "." + prop.fieldName, prop, fn);
                }
                else {
                    fn(name + "." + prop.fieldName, prop);
                }
            }
        }
        else {
            fn(name, val);
        }
    }
    function fn_walkChanges(val, fn) {
        _fn_walkChanges(val.fieldName, val, fn);
    }
    var EntityAspect = (function (_super) {
        __extends(EntityAspect, _super);
        function EntityAspect(dbSet, vals, key, isNew) {
            var _this = _super.call(this, dbSet, vals, key, isNew) || this;
            _this._srvKey = !isNew ? key : null;
            _this._origVals = null;
            _this._disposables = null;
            _this._savedStatus = null;
            return _this;
        }
        EntityAspect.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            try {
                if (!this.isDetached) {
                    this.cancelEdit();
                    this.rejectChanges();
                }
                var objs = this._disposables;
                this._disposables = null;
                if (!!objs && objs.length > 0) {
                    var k = objs.length - 1;
                    for (var i = k; i >= 0; --i) {
                        objs[i].dispose();
                    }
                }
            }
            finally {
                _super.prototype.dispose.call(this);
            }
        };
        EntityAspect.prototype._getValue = function (name, ver) {
            switch (ver) {
                case 2:
                    if (!this._origVals) {
                        throw new Error("Invalid Operation, no Stored Version: " + ver);
                    }
                    return getValue(this._origVals, name);
                default:
                    return _super.prototype._getValue.call(this, name, ver);
            }
        };
        EntityAspect.prototype._setValue = function (name, val, ver) {
            switch (ver) {
                case 2:
                    if (!this._origVals) {
                        throw new Error("Invalid Operation, no Stored Version: " + ver);
                    }
                    setValue(this._origVals, name, val, false);
                    break;
                default:
                    _super.prototype._setValue.call(this, name, val, ver);
                    break;
            }
        };
        EntityAspect.prototype._storeVals = function (toVer) {
            switch (toVer) {
                case 2:
                    this._origVals = this._cloneVals();
                    break;
                default:
                    _super.prototype._storeVals.call(this, toVer);
                    break;
            }
        };
        EntityAspect.prototype._restoreVals = function (fromVer) {
            switch (fromVer) {
                case 2:
                    if (!this._origVals) {
                        throw new Error("Invalid Operation, no Stored Version: " + fromVer);
                    }
                    this._setVals(this._origVals);
                    this._origVals = null;
                    break;
                default:
                    _super.prototype._restoreVals.call(this, fromVer);
                    break;
            }
        };
        EntityAspect.prototype._onFieldChanged = function (fieldName, dependents, fieldInfo) {
            sys.raiseProp(this.item, fieldName);
            var info = fieldInfo || this.coll.getFieldInfo(fieldName);
            if (!!info.dependents) {
                for (var _i = 0, _a = info.dependents; _i < _a.length; _i++) {
                    var d = _a[_i];
                    dependents[d] = true;
                }
            }
        };
        EntityAspect.prototype._getValueChange = function (fullName, fieldInfo, changedOnly) {
            var self = this, dbSet = self.dbSet;
            var res = null;
            if (fn_isNotSubmittable(fieldInfo)) {
                return res;
            }
            switch (fieldInfo.fieldType) {
                case 6:
                    res = {
                        fieldName: fieldInfo.fieldName,
                        val: null,
                        orig: null,
                        flags: 0,
                        nested: null
                    };
                    break;
                case 5:
                    res = { fieldName: fieldInfo.fieldName, val: null, orig: null, flags: 0, nested: [] };
                    var len = fieldInfo.nested.length;
                    for (var i = 0; i < len; i += 1) {
                        var tmp = self._getValueChange(fullName + "." + fieldInfo.nested[i].fieldName, fieldInfo.nested[i], changedOnly);
                        if (!!tmp) {
                            res.nested.push(tmp);
                        }
                    }
                    break;
                default:
                    var newVal = dbSet._getInternal().getStrValue(self._getValue(fullName, 0), fieldInfo), oldV = !self.hasOrigVals ? newVal : dbSet._getInternal().getStrValue(self._getValue(fullName, 2), fieldInfo), isChanged = (oldV !== newVal);
                    if (isChanged) {
                        res = {
                            fieldName: fieldInfo.fieldName,
                            val: newVal,
                            orig: oldV,
                            flags: (1 | 2),
                            nested: null
                        };
                    }
                    else if (fieldInfo.isPrimaryKey > 0 || fieldInfo.fieldType === 4 || fieldInfo.isNeedOriginal) {
                        res = {
                            fieldName: fieldInfo.fieldName,
                            val: newVal,
                            orig: oldV,
                            flags: 2,
                            nested: null
                        };
                    }
                    else {
                        res = {
                            fieldName: fieldInfo.fieldName,
                            val: null,
                            orig: null,
                            flags: 0,
                            nested: null
                        };
                    }
                    break;
            }
            if (changedOnly) {
                if (fieldInfo.fieldType === 5) {
                    return (res.nested.length > 0) ? res : null;
                }
                else if ((res.flags & 1) === 1) {
                    return res;
                }
                else {
                    return null;
                }
            }
            else {
                return res;
            }
        };
        EntityAspect.prototype._getValueChanges = function (changedOnly) {
            var self = this, flds = this.dbSet.getFieldInfos();
            var res = flds.map(function (fld) {
                return self._getValueChange(fld.fieldName, fld, changedOnly);
            });
            var res2 = res.filter(function (vc) {
                return !!vc;
            });
            return res2;
        };
        EntityAspect.prototype._fldChanging = function (_fieldName, _fieldInfo, _oldV, _newV) {
            if (!this._origVals) {
                this._storeVals(2);
            }
            return true;
        };
        EntityAspect.prototype._skipValidate = function (fieldInfo, val) {
            var childToParentNames = this.dbSet._getInternal().getChildToParentNames(fieldInfo.fieldName);
            var res = false;
            if (!!childToParentNames && val === null) {
                var len = childToParentNames.length;
                for (var i = 0; i < len; i += 1) {
                    res = !!this._getFieldVal(childToParentNames[i]);
                    if (res) {
                        break;
                    }
                }
            }
            return res;
        };
        EntityAspect.prototype._beginEdit = function () {
            if (!_super.prototype._beginEdit.call(this)) {
                return false;
            }
            this._savedStatus = this.status;
            return true;
        };
        EntityAspect.prototype._endEdit = function () {
            if (!_super.prototype._endEdit.call(this)) {
                return false;
            }
            this._savedStatus = null;
            return true;
        };
        EntityAspect.prototype._cancelEdit = function () {
            if (!this.isEditing) {
                return false;
            }
            var self = this, changes = this._getValueChanges(true), dbSet = this.dbSet;
            this._restoreVals(1);
            dbSet.errors.removeAllErrors(this.item);
            this._setStatus(this._savedStatus);
            this._savedStatus = null;
            var dependents = utils.core.Indexer();
            for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
                var change = changes_1[_i];
                var fld = dbSet.getFieldInfo(change.fieldName);
                if (!fld) {
                    throw new Error(format(jriapp_shared_8.LocaleERRS.ERR_DBSET_INVALID_FIELDNAME, self.dbSetName, change.fieldName));
                }
                self._onFieldChanged(change.fieldName, dependents, fld);
            }
            self._updateDependents(dependents);
            return true;
        };
        EntityAspect.prototype._setStatus = function (v) {
            var old = this.status;
            if (old !== v) {
                var internal = this.dbSet._getInternal();
                _super.prototype._setStatus.call(this, v);
                if (v !== 0) {
                    internal.addToChanged(this.item);
                }
                else {
                    internal.removeFromChanged(this.key);
                }
                internal.onItemStatusChanged(this.item, old);
            }
        };
        EntityAspect.prototype._addDisposable = function (obj) {
            if (!this._disposables) {
                this._disposables = [];
            }
            this._disposables.push(obj);
        };
        EntityAspect.prototype._updateDependents = function (dependents) {
            var item = this.item, queue = utils.async.getTaskQueue();
            queue.enque(function () {
                if (item.getIsStateDirty()) {
                    return;
                }
                utils.core.forEach(dependents, function (name) {
                    sys.raiseProp(item, name);
                });
            });
        };
        EntityAspect.prototype._updateKeys = function (key) {
            this._setSrvKey(key);
            this._setKey(key);
        };
        EntityAspect.prototype._checkCanRefresh = function () {
            if (this.key === null || this.status === 1) {
                throw new Error(jriapp_shared_8.LocaleERRS.ERR_OPER_REFRESH_INVALID);
            }
        };
        EntityAspect.prototype._refreshValue = function (val, fullName, refreshMode, dependents) {
            var self = this, fld = self.dbSet.getFieldInfo(fullName);
            if (!fld) {
                throw new Error(format(jriapp_shared_8.LocaleERRS.ERR_DBSET_INVALID_FIELDNAME, self.dbSetName, fullName));
            }
            var stz = self.serverTimezone, dataType = fld.dataType, dcnv = fld.dateConversion;
            var newVal = parseValue(val, dataType, dcnv, stz), oldVal = self._getValue(fullName, 0);
            switch (refreshMode) {
                case 3:
                    {
                        if (!compareVals(newVal, oldVal, dataType)) {
                            self._setValue(fullName, newVal, 0);
                            self._onFieldChanged(fullName, dependents, fld);
                        }
                    }
                    break;
                case 1:
                    {
                        if (self.hasOrigVals) {
                            self._setValue(fullName, newVal, 2);
                        }
                        if (self.hasTempVals) {
                            self._setValue(fullName, newVal, 1);
                        }
                        if (!compareVals(newVal, oldVal, dataType)) {
                            self._setValue(fullName, newVal, 0);
                            self._onFieldChanged(fullName, dependents, fld);
                        }
                    }
                    break;
                case 2:
                    {
                        var origOldVal = _undefined;
                        if (self.hasOrigVals) {
                            origOldVal = self._getValue(fullName, 2);
                            self._setValue(fullName, newVal, 2);
                        }
                        if (origOldVal === _undefined || compareVals(origOldVal, oldVal, dataType)) {
                            if (!compareVals(newVal, oldVal, dataType)) {
                                self._setValue(fullName, newVal, 0);
                                self._onFieldChanged(fullName, dependents, fld);
                            }
                        }
                    }
                    break;
                default:
                    throw new Error(format(jriapp_shared_8.LocaleERRS.ERR_PARAM_INVALID, "refreshMode", refreshMode));
            }
        };
        EntityAspect.prototype._refreshValues = function (rowInfo, refreshMode) {
            var self = this, oldStatus = this.status;
            if (!this.getIsDisposed()) {
                if (!refreshMode) {
                    refreshMode = 1;
                }
                var dependents_1 = utils.core.Indexer();
                for (var _i = 0, _a = rowInfo.values; _i < _a.length; _i++) {
                    var val = _a[_i];
                    fn_walkChanges(val, function (fullName, vc) {
                        if ((vc.flags & 4)) {
                            self._refreshValue(vc.val, fullName, refreshMode, dependents_1);
                        }
                    });
                }
                if (oldStatus === 2) {
                    var changes = this._getValueChanges(true);
                    if (changes.length === 0) {
                        this._origVals = null;
                        this._setStatus(0);
                    }
                }
                this._updateDependents(dependents_1);
            }
        };
        EntityAspect.prototype._getRowInfo = function () {
            var res = {
                values: this._getValueChanges(false),
                changeType: this.status,
                serverKey: this.srvKey,
                clientKey: this.key,
                error: null
            };
            return res;
        };
        EntityAspect.prototype._getCalcFieldVal = function (fieldName) {
            return this.dbSet._getInternal().getCalcFieldVal(fieldName, this.item);
        };
        EntityAspect.prototype._getNavFieldVal = function (fieldName) {
            return this.dbSet._getInternal().getNavFieldVal(fieldName, this.item);
        };
        EntityAspect.prototype._setNavFieldVal = function (fieldName, value) {
            this.dbSet._getInternal().setNavFieldVal(fieldName, this.item, value);
        };
        EntityAspect.prototype._clearFieldVal = function (fieldName) {
            this._setValue(fieldName, null, 0);
        };
        EntityAspect.prototype._getFieldVal = function (fieldName) {
            return this._getValue(fieldName, 0);
        };
        EntityAspect.prototype._setFieldVal = function (fieldName, val) {
            if (this.isCancelling) {
                return false;
            }
            var dbSetName = this.dbSetName, dbSet = this.dbSet, oldV = this._getFieldVal(fieldName), fieldInfo = this.getFieldInfo(fieldName);
            var newV = val, res = false;
            if (!fieldInfo) {
                throw new Error(format(jriapp_shared_8.LocaleERRS.ERR_DBSET_INVALID_FIELDNAME, dbSetName, fieldName));
            }
            if (!(this.isEditing || this.isUpdating)) {
                this.beginEdit();
            }
            try {
                if (fieldInfo.dataType === 1 && fieldInfo.isNullable && !newV) {
                    newV = null;
                }
                if (oldV !== newV) {
                    if (fieldInfo.isReadOnly && !(this.isNew && fieldInfo.allowClientDefault)) {
                        throw new Error(jriapp_shared_8.LocaleERRS.ERR_FIELD_READONLY);
                    }
                    if (this._fldChanging(fieldName, fieldInfo, oldV, newV)) {
                        this._setValue(fieldName, newV, 0);
                        if (!(fieldInfo.fieldType === 1 || fieldInfo.fieldType === 6)) {
                            switch (this.status) {
                                case 0:
                                    this._setStatus(2);
                                    break;
                            }
                        }
                        var dependents = utils.core.Indexer();
                        this._onFieldChanged(fieldName, dependents, fieldInfo);
                        this._updateDependents(dependents);
                        res = true;
                    }
                    dbSet.errors.removeError(this.item, fieldName);
                    var validationInfo = this._validateField(fieldName);
                    if (!!validationInfo) {
                        throw new errors_1.ValidationError([validationInfo], this);
                    }
                }
            }
            catch (ex) {
                var error = void 0;
                if (sys.isValidationError(ex)) {
                    error = ex;
                }
                else {
                    error = new errors_1.ValidationError([
                        { fieldName: fieldName, errors: [ex.message] }
                    ], this);
                }
                dbSet.errors.addError(this.item, fieldName, error.validations[0].errors);
                throw error;
            }
            return res;
        };
        EntityAspect.prototype._setSrvKey = function (v) {
            this._srvKey = v;
        };
        EntityAspect.prototype._acceptChanges = function (rowInfo) {
            if (this.getIsDisposed()) {
                return;
            }
            var oldStatus = this.status, dbSet = this.dbSet, internal = dbSet._getInternal(), errors = dbSet.errors;
            if (oldStatus !== 0) {
                internal.onCommitChanges(this.item, true, false, oldStatus);
                if (oldStatus === 3) {
                    internal.removeFromChanged(this.key);
                    errors.removeAllErrors(this.item);
                    if (!this.getIsStateDirty()) {
                        this.dispose();
                    }
                }
                else {
                    this._origVals = null;
                    if (this.hasTempVals) {
                        this._storeVals(1);
                    }
                    this._setStatus(0);
                    errors.removeAllErrors(this.item);
                    if (!!rowInfo) {
                        this._refreshValues(rowInfo, 3);
                    }
                    internal.onCommitChanges(this.item, false, false, oldStatus);
                }
            }
        };
        EntityAspect.prototype.deleteItem = function () {
            return this.deleteOnSubmit();
        };
        EntityAspect.prototype.deleteOnSubmit = function () {
            if (this.getIsStateDirty()) {
                return false;
            }
            var oldStatus = this.status, dbSet = this.dbSet;
            var args = { item: this.item, isCancel: false };
            dbSet._getInternal().onItemDeleting(args);
            if (args.isCancel) {
                return false;
            }
            if (oldStatus === 1) {
                dbSet.removeItem(this.item);
            }
            else {
                this._setStatus(3);
            }
            return true;
        };
        EntityAspect.prototype.acceptChanges = function () {
            this._acceptChanges(null);
        };
        EntityAspect.prototype.rejectChanges = function () {
            if (this.getIsDisposed()) {
                return;
            }
            var self = this, oldStatus = self.status, dbSet = self.dbSet, internal = dbSet._getInternal(), errors = dbSet.errors;
            if (oldStatus !== 0) {
                internal.onCommitChanges(self.item, true, true, oldStatus);
                if (oldStatus === 1) {
                    internal.removeFromChanged(this.key);
                    errors.removeAllErrors(this.item);
                    if (!this.getIsStateDirty()) {
                        this.dispose();
                    }
                }
                else {
                    var changes = self._getValueChanges(true);
                    if (self.hasOrigVals) {
                        self._restoreVals(2);
                        if (self.hasTempVals) {
                            self._storeVals(1);
                        }
                    }
                    self._setStatus(0);
                    errors.removeAllErrors(this.item);
                    var dependents_2 = utils.core.Indexer();
                    for (var _i = 0, changes_2 = changes; _i < changes_2.length; _i++) {
                        var change = changes_2[_i];
                        fn_walkChanges(change, function (fullName) {
                            self._onFieldChanged(fullName, dependents_2, dbSet.getFieldInfo(fullName));
                        });
                    }
                    internal.onCommitChanges(this.item, false, true, oldStatus);
                    this._updateDependents(dependents_2);
                }
            }
        };
        EntityAspect.prototype.submitChanges = function () {
            var removeHandler = function () {
                dbxt.offOnSubmitError(uniqueID);
            };
            var dbxt = this.dbSet.dbContext, uniqueID = uuid();
            dbxt.addOnSubmitError(function (_, args) {
                if (args.error instanceof error_2.SubmitError) {
                    var submitErr = args.error;
                    if (submitErr.notValidated.length > 0) {
                        args.isHandled = true;
                    }
                }
            }, uniqueID);
            var promise = dbxt.submitChanges();
            promise.then(removeHandler, removeHandler);
            return promise;
        };
        EntityAspect.prototype.refresh = function () {
            var dbxt = this.dbSet.dbContext;
            return dbxt._getInternal().refreshItem(this.item);
        };
        EntityAspect.prototype.toString = function () {
            return this.dbSetName + "EntityAspect";
        };
        Object.defineProperty(EntityAspect.prototype, "hasOrigVals", {
            get: function () {
                return !!this._origVals;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EntityAspect.prototype, "srvKey", {
            get: function () {
                return this._srvKey;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EntityAspect.prototype, "isCanSubmit", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EntityAspect.prototype, "dbSetName", {
            get: function () {
                return this.dbSet.dbSetName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EntityAspect.prototype, "serverTimezone", {
            get: function () {
                return this.dbSet.dbContext.serverTimezone;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EntityAspect.prototype, "dbSet", {
            get: function () {
                return this.coll;
            },
            enumerable: false,
            configurable: true
        });
        return EntityAspect;
    }(aspect_1.ItemAspect));
    exports.EntityAspect = EntityAspect;
});
define("jriapp_db/int", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("jriapp_db/dataview", ["require", "exports", "jriapp_shared", "jriapp_shared/collection/base"], function (require, exports, jriapp_shared_9, base_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataView = void 0;
    var utils = jriapp_shared_9.Utils, isFunc = utils.check.isFunc, format = utils.str.format, extend = utils.core.extend, ERROR = utils.err, sys = utils.sys;
    var VIEW_EVENTS;
    (function (VIEW_EVENTS) {
        VIEW_EVENTS["refreshed"] = "view_refreshed";
    })(VIEW_EVENTS || (VIEW_EVENTS = {}));
    var DataView = (function (_super) {
        __extends(DataView, _super);
        function DataView(options) {
            var _this = _super.call(this) || this;
            if (!sys.isCollection(options.dataSource)) {
                throw new Error(jriapp_shared_9.LocaleERRS.ERR_DATAVIEW_DATASRC_INVALID);
            }
            if (!!options.fn_filter && !isFunc(options.fn_filter)) {
                throw new Error(jriapp_shared_9.LocaleERRS.ERR_DATAVIEW_FILTER_INVALID);
            }
            _this._refreshDebounce = new jriapp_shared_9.Debounce(options.refreshTimeout || 0);
            _this._dataSource = options.dataSource;
            _this._fn_filter = options.fn_filter || null;
            _this._fn_sort = options.fn_sort || null;
            _this._fn_itemsProvider = options.fn_itemsProvider || null;
            _this._fn_sortHandler = options.fn_sortHandler || null;
            _this._isAddingNew = false;
            _this._bindDS();
            return _this;
        }
        DataView.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this._refreshDebounce.dispose();
            this._unbindDS();
            this._dataSource = null;
            this._fn_filter = null;
            this._fn_sort = null;
            this._fn_sortHandler = null;
            _super.prototype.dispose.call(this);
        };
        DataView.prototype._isOwnsItems = function () {
            return false;
        };
        DataView.prototype._onAddNew = function (item) {
            var args = {
                changeType: 1,
                reason: 0,
                oper: 2,
                items: [item],
                new_key: item._key
            };
            this._onCollectionChanged(args);
        };
        DataView.prototype._filterForPaging = function (items) {
            var len = items.length, skip = this.pageSize * this.pageIndex, take = this.pageSize;
            var start = skip, end = len > (start + take) ? (start + take) : len;
            if (start >= len) {
                return [];
            }
            var result = items.slice(start, end);
            return result;
        };
        DataView.prototype._onViewRefreshed = function (args) {
            this.objEvents.raise("view_refreshed", args);
        };
        DataView.prototype._refresh = function (reason) {
            var _this = this;
            this._refreshDebounce.enque(function () {
                _this._refreshSync(reason);
            });
        };
        DataView.prototype._refreshSync = function (reason) {
            if (this.getIsStateDirty()) {
                return;
            }
            try {
                var items = void 0;
                var ds = this._dataSource;
                if (!ds || ds.getIsStateDirty()) {
                    this.clear();
                    this._onViewRefreshed({});
                    return;
                }
                if (!!this._fn_itemsProvider) {
                    items = this._fn_itemsProvider(ds);
                }
                else {
                    items = ds.items;
                }
                if (!!this._fn_filter) {
                    items = items.filter(this._fn_filter);
                }
                if (!!this._fn_sort) {
                    items = items.sort(this._fn_sort);
                }
                this._fillItems({ items: items, reason: reason, clear: true, isAppend: false });
                this._onViewRefreshed({});
            }
            catch (ex) {
                ERROR.reThrow(ex, this.handleError(ex, this));
            }
        };
        DataView.prototype._fillItems = function (data) {
            data = extend({
                items: [],
                reason: 3,
                clear: true,
                isAppend: false
            }, data);
            var self = this, newItems = [], items = [], isClearAll = !!data.clear;
            if (!!isClearAll) {
                this._clear(data.reason, 1);
            }
            var _items = (this.isPagingEnabled && !data.isAppend) ? this._filterForPaging(data.items) : data.items;
            for (var _i = 0, _items_1 = _items; _i < _items_1.length; _i++) {
                var item = _items_1[_i];
                var oldItem = self.getItemByKey(item._key);
                if (!oldItem) {
                    self._appendItem(item);
                    newItems.push(item);
                    items.push(item);
                }
                else {
                    items.push(oldItem);
                }
            }
            if (newItems.length > 0) {
                this._onCountChanged();
            }
            if (isClearAll) {
                this.totalCount = data.items.length;
            }
            else {
                this.totalCount = this.totalCount + newItems.length;
            }
            this._onCollectionChanged({
                changeType: 2,
                reason: data.reason,
                oper: 1,
                items: newItems
            });
            this._onFillEnd({
                items: items,
                newItems: newItems,
                reason: data.reason
            });
            if (isClearAll) {
                this.moveFirst();
            }
            return newItems;
        };
        DataView.prototype._onDSCollectionChanged = function (_, args) {
            var self = this;
            switch (args.changeType) {
                case 2:
                    this._refresh(3);
                    break;
                case 1:
                    {
                        if (!this._isAddingNew) {
                            var items = (!self._fn_filter) ? args.items : args.items.filter(self._fn_filter);
                            if (items.length > 0) {
                                self.appendItems(items);
                            }
                        }
                    }
                    break;
                case 0:
                    {
                        for (var _i = 0, _a = args.items; _i < _a.length; _i++) {
                            var item = _a[_i];
                            var _item = self.getItemByKey(item._key);
                            if (!!_item) {
                                self.removeItem(_item);
                            }
                        }
                    }
                    break;
                case 3:
                    {
                        var item = self.getItemByKey(args.old_key);
                        if (!!item) {
                            self._remapItem(args.old_key, args.new_key, item);
                            self._onCollectionChanged(args);
                        }
                    }
                    break;
                default:
                    throw new Error(format(jriapp_shared_9.LocaleERRS.ERR_COLLECTION_CHANGETYPE_INVALID, args.changeType));
            }
        };
        DataView.prototype._onDSStatusChanged = function (_, args) {
            var self = this, item = args.item, key = args.key, oldStatus = args.oldStatus, canFilter = !!self._fn_filter;
            if (!self.getItemByKey(key)) {
                if (canFilter) {
                    var isOk = self._fn_filter(item);
                    if (isOk) {
                        self.appendItems([item]);
                    }
                }
            }
            else {
                self._onItemStatusChanged(item, oldStatus);
                if (canFilter) {
                    var isOk = self._fn_filter(item);
                    if (!isOk) {
                        self.removeItem(item);
                    }
                }
            }
        };
        DataView.prototype._bindDS = function () {
            var self = this, ds = this._dataSource;
            if (!ds) {
                return;
            }
            ds.addOnCollChanged(self._onDSCollectionChanged, self.uniqueID, self, 1);
            ds.addOnBeginEdit(function (_, args) {
                if (!!self.getItemByKey(args.item._key)) {
                    self._onEditing(args.item, true, false);
                }
            }, self.uniqueID, null, 1);
            ds.addOnEndEdit(function (_, args) {
                var isOk;
                var item = args.item, canFilter = !!self._fn_filter;
                if (!self.getItemByKey(item._key)) {
                    if (!args.isCanceled && canFilter) {
                        isOk = self._fn_filter(item);
                        if (isOk) {
                            self.appendItems([item]);
                        }
                    }
                }
                else {
                    self._onEditing(item, false, args.isCanceled);
                    if (!args.isCanceled && canFilter) {
                        isOk = self._fn_filter(item);
                        if (!isOk) {
                            self.removeItem(item);
                        }
                    }
                }
            }, self.uniqueID, null, 1);
            ds.addOnErrorsChanged(function (_, args) {
                if (!!self.getItemByKey(args.item._key)) {
                    self._getInternal().onErrorsChanged(args);
                }
            }, self.uniqueID, null, 1);
            ds.addOnStatusChanged(self._onDSStatusChanged, self.uniqueID, self, 1);
            ds.addOnItemDeleting(function (_, args) {
                if (!!self.getItemByKey(args.item._key)) {
                    self._onItemDeleting(args);
                }
            }, self.uniqueID, null, 1);
            ds.addOnItemAdded(function (_, args) {
                if (self._isAddingNew) {
                    if (!self.getItemByKey(args.item._key)) {
                        self._addNew(args.item);
                    }
                    self.currentItem = args.item;
                    self._onEditing(args.item, true, false);
                    self._onItemAdded(args.item);
                }
            }, self.uniqueID, null, 1);
            ds.addOnItemAdding(function (_, args) {
                if (self._isAddingNew) {
                    self._onItemAdding(args.item);
                }
            }, self.uniqueID, null, 1);
        };
        DataView.prototype._unbindDS = function () {
            var self = this, ds = this._dataSource;
            if (!ds) {
                return;
            }
            ds.objEvents.offNS(self.uniqueID);
        };
        DataView.prototype._checkCurrentChanging = function (newCurrent) {
            var ds = this._dataSource;
            try {
                var item = ds._getInternal().getEditingItem();
                if (!!item && newCurrent !== item) {
                    ds.endEdit();
                }
            }
            catch (ex) {
                ds.cancelEdit();
                ERROR.reThrow(ex, this.handleError(ex, this));
            }
        };
        DataView.prototype._onPageChanged = function () {
            this._refresh(1);
        };
        DataView.prototype._clear = function (reason, oper) {
            if (oper === void 0) { oper = 0; }
            _super.prototype._clear.call(this, reason, oper);
            if (reason !== 1) {
                this.pageIndex = 0;
            }
            if (reason !== 1 && reason !== 2) {
                this.totalCount = 0;
            }
        };
        DataView.prototype.itemFactory = function (_aspect) {
            throw new Error("Not implemented");
        };
        DataView.prototype._createNew = function () {
            throw new Error("Not implemented");
        };
        DataView.prototype._getStrValue = function (val, fieldInfo) {
            return this._dataSource._getInternal().getStrValue(val, fieldInfo);
        };
        DataView.prototype.getFieldNames = function () {
            return this._dataSource.getFieldNames();
        };
        DataView.prototype.getFieldInfo = function (fieldName) {
            return this._dataSource.getFieldInfo(fieldName);
        };
        DataView.prototype.getFieldInfos = function () {
            return this._dataSource.getFieldInfos();
        };
        DataView.prototype.getFieldMap = function () {
            return this._dataSource.getFieldMap();
        };
        DataView.prototype.addOnViewRefreshed = function (fn, nmspace) {
            this.objEvents.on("view_refreshed", fn, nmspace);
        };
        DataView.prototype.offOnViewRefreshed = function (nmspace) {
            this.objEvents.off("view_refreshed", nmspace);
        };
        DataView.prototype.appendItems = function (items) {
            if (this.getIsStateDirty()) {
                return [];
            }
            return this._fillItems({ items: items, reason: 0, clear: false, isAppend: true });
        };
        DataView.prototype.addNew = function () {
            var item = null;
            this._isAddingNew = true;
            try {
                item = this._dataSource.addNew();
            }
            finally {
                this._isAddingNew = false;
            }
            return item;
        };
        DataView.prototype.removeItem = function (item) {
            var oldPos = this._removeItem(item);
            if (oldPos < 0) {
                return;
            }
            this.errors.removeAllErrors(item);
            this.totalCount = this.totalCount - 1;
            this._resetCurrent(oldPos);
        };
        DataView.prototype.sort = function (fieldNames, sortOrder) {
            if (!!this._fn_sortHandler) {
                return this._fn_sortHandler(fieldNames, sortOrder);
            }
            else {
                return this.sortLocal(fieldNames, sortOrder);
            }
        };
        DataView.prototype.sortLocal = function (fieldNames, sortOrder) {
            var _this = this;
            this._fn_sort = this._getSortFn(fieldNames, sortOrder);
            return utils.async.delay(function () { return _this._refreshSync(2); });
        };
        DataView.prototype.clear = function () {
            this._clear(3, 0);
        };
        DataView.prototype.refresh = function () {
            this._refresh(3);
        };
        DataView.prototype.syncRefresh = function () {
            this._refreshSync(3);
        };
        Object.defineProperty(DataView.prototype, "errors", {
            get: function () {
                return this._dataSource.errors;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataView.prototype, "dataSource", {
            get: function () {
                return this._dataSource;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataView.prototype, "isPagingEnabled", {
            get: function () {
                return this.options.enablePaging;
            },
            set: function (v) {
                if (this.options.enablePaging !== v) {
                    this.options.enablePaging = v;
                    this.objEvents.raiseProp("isPagingEnabled");
                    this._refresh(0);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataView.prototype, "permissions", {
            get: function () {
                return this._dataSource.permissions;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataView.prototype, "fn_filter", {
            get: function () {
                return this._fn_filter;
            },
            set: function (v) {
                if (this._fn_filter !== v) {
                    this._fn_filter = v;
                    this._refresh(0);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataView.prototype, "fn_sort", {
            get: function () {
                return this._fn_sort;
            },
            set: function (v) {
                if (this._fn_sort !== v) {
                    this._fn_sort = v;
                    this._refresh(2);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataView.prototype, "fn_itemsProvider", {
            get: function () {
                return this._fn_itemsProvider;
            },
            set: function (v) {
                if (this._fn_itemsProvider !== v) {
                    this._fn_itemsProvider = v;
                    this._refresh(3);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DataView.prototype, "fn_sortHandler", {
            get: function () {
                return this._fn_sortHandler;
            },
            set: function (v) {
                if (this._fn_sortHandler !== v) {
                    this._fn_sortHandler = v;
                    this._refresh(3);
                }
            },
            enumerable: false,
            configurable: true
        });
        DataView.prototype.toString = function () {
            return !this.dataSource ? "DataView" : ("DataView For " + this.dataSource.toString());
        };
        return DataView;
    }(base_2.BaseCollection));
    exports.DataView = DataView;
});
define("jriapp_db/child_dataview", ["require", "exports", "jriapp_shared", "jriapp_db/dataview"], function (require, exports, jriapp_shared_10, dataview_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChildDataView = void 0;
    var utils = jriapp_shared_10.Utils, coreUtils = utils.core;
    var ChildDataView = (function (_super) {
        __extends(ChildDataView, _super);
        function ChildDataView(options) {
            var _this = this;
            var parentItem = !options.parentItem ? null : options.parentItem;
            var assoc = options.association, opts = coreUtils.extend({
                dataSource: null,
                fn_itemsProvider: null,
                fn_filter: null
            }, options), oldFilter = opts.fn_filter;
            opts.dataSource = assoc.childDS;
            opts.fn_itemsProvider = function () {
                if (!parentItem) {
                    return [];
                }
                return assoc.getChildItems(parentItem);
            };
            opts.fn_filter = function (item) {
                var isPC = assoc.isParentChild(parentItem, item);
                return isPC && (!oldFilter ? true : oldFilter(item));
            };
            opts.refreshTimeout = 350;
            _this = _super.call(this, opts) || this;
            var self = _this;
            _this._getParent = function () {
                if (self.getIsStateDirty()) {
                    return null;
                }
                return parentItem;
            };
            _this._setParent = function (v) {
                if (self.getIsStateDirty()) {
                    return;
                }
                if (parentItem !== v) {
                    parentItem = v;
                    if (self.items.length > 0) {
                        self.clear();
                        self._onViewRefreshed({});
                    }
                    self._refresh(3);
                    self.objEvents.raiseProp("parentItem");
                }
            };
            _this._association = assoc;
            if (!!parentItem && !options.explicitRefresh) {
                var queue = utils.async.getTaskQueue();
                queue.enque(function () {
                    self._refreshSync(0);
                });
            }
            return _this;
        }
        ChildDataView.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this._setParent(null);
            this._association = null;
            _super.prototype.dispose.call(this);
        };
        ChildDataView.prototype.toString = function () {
            return !this._association ? "ChildDataView" : ("ChildDataView for " + this._association.toString());
        };
        Object.defineProperty(ChildDataView.prototype, "parentItem", {
            get: function () {
                return this._getParent();
            },
            set: function (v) {
                this._setParent(v);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ChildDataView.prototype, "association", {
            get: function () {
                return this._association;
            },
            enumerable: false,
            configurable: true
        });
        return ChildDataView;
    }(dataview_1.DataView));
    exports.ChildDataView = ChildDataView;
});
define("jriapp_db/complexprop", ["require", "exports", "jriapp_shared"], function (require, exports, jriapp_shared_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChildComplexProperty = exports.RootComplexProperty = exports.BaseComplexProperty = void 0;
    var utils = jriapp_shared_11.Utils, format = utils.str.format;
    var BaseComplexProperty = (function (_super) {
        __extends(BaseComplexProperty, _super);
        function BaseComplexProperty(name) {
            var _this = _super.call(this) || this;
            _this._name = name;
            return _this;
        }
        BaseComplexProperty.prototype.getName = function () {
            return this._name;
        };
        BaseComplexProperty.prototype.getPropertyByName = function (name) {
            var arrProps = this.getProperties().filter(function (f) { return f.fieldName === name; });
            if (!arrProps || arrProps.length !== 1) {
                throw new Error(format(jriapp_shared_11.LocaleERRS.ERR_ASSERTION_FAILED, "arrProps.length === 1"));
            }
            return arrProps[0];
        };
        BaseComplexProperty.prototype.getIsHasErrors = function () {
            return this.getEntity().getIsHasErrors();
        };
        BaseComplexProperty.prototype.addOnErrorsChanged = function (fn, nmspace, context) {
            var self = this;
            this.getEntity().addOnErrorsChanged(function (_, args) { fn.apply(this, [self, args]); }, nmspace, context);
        };
        BaseComplexProperty.prototype.offOnErrorsChanged = function (nmspace) {
            this.getEntity().offOnErrorsChanged(nmspace);
        };
        BaseComplexProperty.prototype.getFieldErrors = function (fieldName) {
            var name = this.getFullPath(fieldName);
            return this.getEntity().getFieldErrors(name);
        };
        BaseComplexProperty.prototype.getAllErrors = function () {
            return this.getEntity().getAllErrors();
        };
        BaseComplexProperty.prototype.getIErrorNotification = function () {
            return this;
        };
        return BaseComplexProperty;
    }(jriapp_shared_11.BaseObject));
    exports.BaseComplexProperty = BaseComplexProperty;
    var RootComplexProperty = (function (_super) {
        __extends(RootComplexProperty, _super);
        function RootComplexProperty(name, owner) {
            var _this = _super.call(this, name) || this;
            _this._entity = owner;
            _this._entity._addDisposable(_this);
            return _this;
        }
        RootComplexProperty.prototype._addDisposable = function (obj) {
            this._entity._addDisposable(obj);
        };
        RootComplexProperty.prototype._getFullPath = function (path) {
            return this.getName() + "." + path;
        };
        RootComplexProperty.prototype.setValue = function (fullName, value) {
            this._entity._setFieldVal(fullName, value);
        };
        RootComplexProperty.prototype.getValue = function (fullName) {
            return this._entity._getFieldVal(fullName);
        };
        RootComplexProperty.prototype.getFieldInfo = function () {
            return this._entity.getFieldInfo(this.getName());
        };
        RootComplexProperty.prototype.getProperties = function () {
            return this.getFieldInfo().nested;
        };
        RootComplexProperty.prototype.getEntity = function () {
            return this._entity;
        };
        RootComplexProperty.prototype.getFullPath = function (name) {
            return this.getName() + "." + name;
        };
        return RootComplexProperty;
    }(BaseComplexProperty));
    exports.RootComplexProperty = RootComplexProperty;
    var ChildComplexProperty = (function (_super) {
        __extends(ChildComplexProperty, _super);
        function ChildComplexProperty(name, parent) {
            var _this = _super.call(this, name) || this;
            _this._parent = parent;
            _this._parent._addDisposable(_this);
            return _this;
        }
        ChildComplexProperty.prototype._addDisposable = function (obj) {
            this._parent._addDisposable(obj);
        };
        ChildComplexProperty.prototype._getFullPath = function (path) {
            return this._parent._getFullPath(this.getName() + "." + path);
        };
        ChildComplexProperty.prototype.setValue = function (fullName, value) {
            this.getEntity()._setFieldVal(fullName, value);
        };
        ChildComplexProperty.prototype.getValue = function (fullName) {
            return this.getEntity()._getFieldVal(fullName);
        };
        ChildComplexProperty.prototype.getFieldInfo = function () {
            var name = this.getName();
            return this._parent.getPropertyByName(name);
        };
        ChildComplexProperty.prototype.getProperties = function () {
            return this.getFieldInfo().nested;
        };
        ChildComplexProperty.prototype.getParent = function () {
            return this._parent;
        };
        ChildComplexProperty.prototype.getRootProperty = function () {
            var parent = this._parent;
            while (!!parent && (parent instanceof ChildComplexProperty)) {
                parent = parent.getParent();
            }
            if (!parent || !(parent instanceof RootComplexProperty)) {
                throw new Error(format(jriapp_shared_11.LocaleERRS.ERR_ASSERTION_FAILED, "parent instanceof RootComplexProperty"));
            }
            return parent;
        };
        ChildComplexProperty.prototype.getFullPath = function (name) {
            return this._parent._getFullPath(this.getName() + "." + name);
        };
        ChildComplexProperty.prototype.getEntity = function () {
            return this.getRootProperty().getEntity();
        };
        return ChildComplexProperty;
    }(BaseComplexProperty));
    exports.ChildComplexProperty = ChildComplexProperty;
});
define("jriapp_db", ["require", "exports", "jriapp_db/dbset", "jriapp_db/dataview", "jriapp_db/child_dataview", "jriapp_db/association", "jriapp_db/const", "jriapp_db/dbcontext", "jriapp_db/dbsets", "jriapp_db/dataquery", "jriapp_db/entity_aspect", "jriapp_db/error", "jriapp_db/complexprop"], function (require, exports, dbset_1, dataview_2, child_dataview_1, association_2, const_1, dbcontext_1, dbsets_1, dataquery_2, entity_aspect_2, error_3, complexprop_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VERSION = exports.FLAGS = exports.DATA_OPER = exports.DELETE_ACTION = exports.REFRESH_MODE = exports.DbSet = void 0;
    Object.defineProperty(exports, "DbSet", { enumerable: true, get: function () { return dbset_1.DbSet; } });
    __exportStar(dataview_2, exports);
    __exportStar(child_dataview_1, exports);
    __exportStar(association_2, exports);
    Object.defineProperty(exports, "REFRESH_MODE", { enumerable: true, get: function () { return const_1.REFRESH_MODE; } });
    Object.defineProperty(exports, "DELETE_ACTION", { enumerable: true, get: function () { return const_1.DELETE_ACTION; } });
    Object.defineProperty(exports, "DATA_OPER", { enumerable: true, get: function () { return const_1.DATA_OPER; } });
    Object.defineProperty(exports, "FLAGS", { enumerable: true, get: function () { return const_1.FLAGS; } });
    __exportStar(dbcontext_1, exports);
    __exportStar(dbsets_1, exports);
    __exportStar(dataquery_2, exports);
    __exportStar(entity_aspect_2, exports);
    __exportStar(error_3, exports);
    __exportStar(complexprop_1, exports);
    exports.VERSION = "3.0.10";
});
