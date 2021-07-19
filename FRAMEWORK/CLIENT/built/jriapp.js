var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
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
define("jriapp/consts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SubscribeFlags = exports.BindTo = exports.BindScope = exports.LOADER_GIF = exports.ELVIEW_NM = exports.KEYS = exports.DATA_ATTR = exports.STORE_KEY = exports.BINDING_MODE = exports.SERVICES = void 0;
    var SERVICES;
    (function (SERVICES) {
        SERVICES["TOOLTIP_SVC"] = "ITooltipService";
        SERVICES["DATEPICKER_SVC"] = "IDatepicker";
        SERVICES["UIERRORS_SVC"] = "IUIErrorsService";
    })(SERVICES = exports.SERVICES || (exports.SERVICES = {}));
    var BINDING_MODE;
    (function (BINDING_MODE) {
        BINDING_MODE[BINDING_MODE["OneTime"] = 0] = "OneTime";
        BINDING_MODE[BINDING_MODE["OneWay"] = 1] = "OneWay";
        BINDING_MODE[BINDING_MODE["TwoWay"] = 2] = "TwoWay";
        BINDING_MODE[BINDING_MODE["BackWay"] = 3] = "BackWay";
    })(BINDING_MODE = exports.BINDING_MODE || (exports.BINDING_MODE = {}));
    var STORE_KEY;
    (function (STORE_KEY) {
        STORE_KEY["SVC"] = "svc.";
        STORE_KEY["CONVERTER"] = "cnv.";
        STORE_KEY["OBJECT"] = "obj.";
        STORE_KEY["OPTION"] = "opt.";
        STORE_KEY["LOADER"] = "ldr.";
        STORE_KEY["TGROUP"] = "tgrp.";
    })(STORE_KEY = exports.STORE_KEY || (exports.STORE_KEY = {}));
    var DATA_ATTR;
    (function (DATA_ATTR) {
        DATA_ATTR["DATA_BIND"] = "data-bind";
        DATA_ATTR["DATA_VIEW"] = "data-view";
        DATA_ATTR["DATA_VIEW_OPTIONS"] = "data-view-options";
        DATA_ATTR["DATA_EVENT_SCOPE"] = "data-scope";
        DATA_ATTR["DATA_ITEM_KEY"] = "data-key";
        DATA_ATTR["DATA_CONTENT"] = "data-content";
        DATA_ATTR["DATA_COLUMN"] = "data-column";
        DATA_ATTR["DATA_NAME"] = "data-name";
        DATA_ATTR["DATA_REQUIRE"] = "data-require";
    })(DATA_ATTR = exports.DATA_ATTR || (exports.DATA_ATTR = {}));
    var KEYS;
    (function (KEYS) {
        KEYS[KEYS["backspace"] = 8] = "backspace";
        KEYS[KEYS["tab"] = 9] = "tab";
        KEYS[KEYS["enter"] = 13] = "enter";
        KEYS[KEYS["esc"] = 27] = "esc";
        KEYS[KEYS["space"] = 32] = "space";
        KEYS[KEYS["pageUp"] = 33] = "pageUp";
        KEYS[KEYS["pageDown"] = 34] = "pageDown";
        KEYS[KEYS["end"] = 35] = "end";
        KEYS[KEYS["home"] = 36] = "home";
        KEYS[KEYS["left"] = 37] = "left";
        KEYS[KEYS["up"] = 38] = "up";
        KEYS[KEYS["right"] = 39] = "right";
        KEYS[KEYS["down"] = 40] = "down";
        KEYS[KEYS["del"] = 127] = "del";
    })(KEYS = exports.KEYS || (exports.KEYS = {}));
    var ELVIEW_NM;
    (function (ELVIEW_NM) {
        ELVIEW_NM["DataForm"] = "dataform";
    })(ELVIEW_NM = exports.ELVIEW_NM || (exports.ELVIEW_NM = {}));
    var LOADER_GIF;
    (function (LOADER_GIF) {
        LOADER_GIF["Small"] = "loader2.gif";
        LOADER_GIF["Default"] = "loader.gif";
    })(LOADER_GIF = exports.LOADER_GIF || (exports.LOADER_GIF = {}));
    var BindScope;
    (function (BindScope) {
        BindScope[BindScope["Application"] = 0] = "Application";
        BindScope[BindScope["Template"] = 1] = "Template";
        BindScope[BindScope["DataForm"] = 2] = "DataForm";
    })(BindScope = exports.BindScope || (exports.BindScope = {}));
    var BindTo;
    (function (BindTo) {
        BindTo[BindTo["Source"] = 0] = "Source";
        BindTo[BindTo["Target"] = 1] = "Target";
    })(BindTo = exports.BindTo || (exports.BindTo = {}));
    var SubscribeFlags;
    (function (SubscribeFlags) {
        SubscribeFlags[SubscribeFlags["delegationOn"] = 0] = "delegationOn";
        SubscribeFlags[SubscribeFlags["click"] = 1] = "click";
        SubscribeFlags[SubscribeFlags["change"] = 2] = "change";
        SubscribeFlags[SubscribeFlags["keypress"] = 3] = "keypress";
        SubscribeFlags[SubscribeFlags["keydown"] = 4] = "keydown";
        SubscribeFlags[SubscribeFlags["keyup"] = 5] = "keyup";
        SubscribeFlags[SubscribeFlags["input"] = 6] = "input";
    })(SubscribeFlags = exports.SubscribeFlags || (exports.SubscribeFlags = {}));
});
define("jriapp/int", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ButtonCss = exports.Config = void 0;
    exports.Config = jriapp_config || {};
    var ButtonCss = (function () {
        function ButtonCss() {
        }
        ButtonCss.Edit = "jriapp-actions jriapp-edit";
        ButtonCss.Delete = "jriapp-actions jriapp-delete";
        ButtonCss.OK = "jriapp-actions jriapp-ok";
        ButtonCss.Cancel = "jriapp-actions jriapp-cancel";
        return ButtonCss;
    }());
    exports.ButtonCss = ButtonCss;
});
define("jriapp/parsing/int", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.THIS_LEN = exports.DATES = exports.PARSE_TYPE = exports.TAG = exports.TOKEN = exports.spaceRX = exports.getRX = void 0;
    exports.getRX = /^get[(].+[)]$/g, exports.spaceRX = /^\s+$/;
    var TOKEN;
    (function (TOKEN) {
        TOKEN["DELIMETER1"] = ":";
        TOKEN["DELIMETER2"] = "=";
        TOKEN["COMMA"] = ",";
        TOKEN["THIS"] = "this.";
        TOKEN["PARAM"] = "param";
        TOKEN["TARGET_PATH"] = "targetPath";
        TOKEN["BIND"] = "bind";
        TOKEN["GET"] = "get";
        TOKEN["DATE"] = "date";
        TOKEN["INJECT"] = "inject";
    })(TOKEN = exports.TOKEN || (exports.TOKEN = {}));
    var TAG;
    (function (TAG) {
        TAG["NONE"] = "";
        TAG["LITERAL"] = "0";
        TAG["BIND"] = "1";
        TAG["GET"] = "2";
        TAG["DATE"] = "3";
        TAG["INJECT"] = "4";
        TAG["BRACE"] = "5";
        TAG["INDEXER"] = "6";
    })(TAG = exports.TAG || (exports.TAG = {}));
    var PARSE_TYPE;
    (function (PARSE_TYPE) {
        PARSE_TYPE[PARSE_TYPE["NONE"] = 0] = "NONE";
        PARSE_TYPE[PARSE_TYPE["BINDING"] = 1] = "BINDING";
        PARSE_TYPE[PARSE_TYPE["VIEW"] = 2] = "VIEW";
    })(PARSE_TYPE = exports.PARSE_TYPE || (exports.PARSE_TYPE = {}));
    var DATES;
    (function (DATES) {
        DATES["NOW"] = "now";
        DATES["TODAY"] = "today";
        DATES["TOMORROW"] = "tomorrow";
        DATES["YESTERDAY"] = "yesterday";
    })(DATES = exports.DATES || (exports.DATES = {}));
    exports.THIS_LEN = "this.".length;
});
define("jriapp/parsing/helper", ["require", "exports", "jriapp_shared", "jriapp/parsing/int", "jriapp/bootstrapper"], function (require, exports, jriapp_shared_1, int_1, bootstrapper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Helper = exports.Funcs = void 0;
    var utils = jriapp_shared_1.Utils, _a = utils.check, isNumeric = _a.isNumeric, isBoolString = _a.isBoolString, _undefined = _a._undefined, isString = _a.isString, _b = utils.str, format = _b.format, trim = _b.fastTrim, startsWith = _b.startsWith, trimQuotes = _b.trimQuotes, _c = utils.core, parseBool = _c.parseBool, extend = _c.extend, dates = jriapp_shared_1.DateUtils, _d = jriapp_shared_1.Utils.sys, getBraceLen = _d.getBraceLen, resolvePath = _d.resolvePath, debug = utils.debug, log = utils.log;
    function _reportBug(bug) {
        if (!debug.isDebugging()) {
            return;
        }
        debug.checkStartDebugger();
        log.error(bug);
    }
    var Funcs = (function () {
        function Funcs() {
        }
        Funcs.setKeyVal = function (kv, start, end, val, isKey, isLit) {
            if (start > -1 && start < end) {
                var str = val.substring(start, end);
                var v = !isLit ? trim(str) : str;
                if (!v) {
                    return;
                }
                if (isKey) {
                    kv.key += v;
                }
                else {
                    kv.val += v;
                }
            }
        };
        Funcs.getDate = function (val, format) {
            if (!val) {
                return dates.today();
            }
            else {
                var lower = val.toLowerCase();
                if (startsWith(lower, "startof")) {
                    return dates.startOf(lower.substr("startof".length));
                }
                else if (startsWith(lower, "endof")) {
                    return dates.endOf(lower.substr("endof".length));
                }
                else {
                    switch (val.toLowerCase()) {
                        case "now":
                            return dates.now();
                        case "today":
                            return dates.today();
                        case "tomorrow":
                            return dates.tomorrow();
                        case "yesterday":
                            return dates.yesterday();
                        default:
                            return dates.strToDate(val, format);
                    }
                }
            }
        };
        Funcs.getTag = function (val, start, end) {
            var token = trim(val.substring(start, end));
            var tag = "";
            switch (token) {
                case "bind":
                    tag = "1";
                    break;
                case "get":
                    tag = "2";
                    break;
                case "inject":
                    tag = "4";
                    break;
                case "date":
                    tag = "3";
                    break;
                default:
                    throw new Error("Unknown token: \"" + token + "\" in expression " + val);
            }
            return tag;
        };
        Funcs.checkVal = function (kv) {
            if (!kv.key) {
                return false;
            }
            if (!!kv.val) {
                switch (kv.tag) {
                    case "3":
                        {
                            var args = funcs.getExprArgs(kv.val);
                            var val = args.length > 0 ? args[0] : _undefined;
                            if (isString(val)) {
                                var format_1 = args.length > 1 ? args[1] : "YYYYMMDD";
                                if (!isString(format_1)) {
                                    throw new Error("Invalid expression with key: " + kv.key + " val: " + kv.val);
                                }
                                kv.val = funcs.getDate(val, format_1);
                            }
                            else {
                                if (!!val) {
                                    throw new Error("Invalid expression with key: " + kv.key + " val: " + kv.val);
                                }
                                kv.val = funcs.getDate(_undefined, _undefined);
                            }
                        }
                        break;
                    case "":
                        {
                            if (isNumeric(kv.val)) {
                                kv.val = Number(kv.val);
                            }
                            else if (isBoolString(kv.val)) {
                                kv.val = parseBool(kv.val);
                            }
                        }
                        break;
                }
            }
            return true;
        };
        Funcs.getKeyVals = function (val) {
            var i, ch, literal, parts = [], kv = { tag: "", key: "", val: "" }, isKey = true, start = -1;
            var len = val.length;
            for (i = 0; i < len; i += 1) {
                if (start < 0) {
                    start = i;
                }
                ch = val.charAt(i);
                if (!literal) {
                    switch (ch) {
                        case "'":
                        case '"':
                            funcs.setKeyVal(kv, start, i, val, isKey, false);
                            literal = ch;
                            start = i + 1;
                            if (kv.tag === "") {
                                kv.tag = "0";
                            }
                            break;
                        case "(":
                            if (!isKey && start < i) {
                                var tag = funcs.getTag(val, start, i);
                                var braceLen_1 = getBraceLen(val, i, 0);
                                funcs.setKeyVal(kv, i + 1, i + braceLen_1 - 1, val, isKey, false);
                                if (kv.tag !== "") {
                                    throw new Error("Invalid tag: " + trim(val.substring(start, i)) + " and value: " + kv.val + " in expression: " + val);
                                }
                                kv.tag = tag;
                                i += (braceLen_1 - 1);
                                start = -1;
                            }
                            else {
                                throw new Error("Invalid: \"" + ch + "\" in expression " + val);
                            }
                            break;
                        case "[":
                            funcs.setKeyVal(kv, start, i, val, isKey, false);
                            var braceLen = getBraceLen(val, i, 2);
                            var str = trimQuotes(val.substring(i + 1, i + braceLen - 1));
                            if (!str) {
                                throw new Error("Invalid: \"" + ch + "\" in expression " + val);
                            }
                            if (isKey) {
                                kv.key += "[" + str + "]";
                            }
                            else {
                                kv.val += "[" + str + "]";
                                if (kv.tag !== "") {
                                    throw new Error("Invalid value: " + kv.val + " in expression: " + val);
                                }
                                kv.tag = "6";
                            }
                            i += (braceLen - 1);
                            start = -1;
                            break;
                        case "{":
                            if (!isKey) {
                                var test = trim(val.substring(start, i));
                                if (!!test) {
                                    throw new Error("Invalid word: \"" + test + "{\" in expression " + val);
                                }
                                var braceLen_2 = getBraceLen(val, i, 1);
                                kv.val = val.substring(i + 1, i + braceLen_2 - 1);
                                if (kv.tag !== "") {
                                    throw new Error("Invalid value: " + kv.val + " after brace \"{\" in expression: " + val);
                                }
                                kv.tag = "5";
                                i += (braceLen_2 - 1);
                                start = -1;
                            }
                            else {
                                throw new Error("Invalid: \"" + ch + "\" in expression " + val);
                            }
                            break;
                        case ",":
                            funcs.setKeyVal(kv, start, i, val, isKey, false);
                            start = -1;
                            parts.push(kv);
                            kv = { tag: "", key: "", val: "" };
                            isKey = true;
                            break;
                        case ":":
                        case "=":
                            funcs.setKeyVal(kv, start, i, val, isKey, false);
                            if (kv.tag !== "" || !isKey) {
                                throw new Error("Invalid \"" + ch + "\" at the start of: " + val.substring(i) + " in expression: " + val);
                            }
                            start = -1;
                            isKey = false;
                            break;
                        case ")":
                        case "}":
                        case "]":
                            throw new Error("Invalid: \"" + ch + "\" in expression " + val);
                        default:
                            if (kv.tag !== "" && kv.tag !== "6") {
                                if (ch !== "\t" && ch !== " " && ch !== "\n" && ch !== "\r")
                                    throw new Error("Invalid: \"" + ch + "\" at the start of: " + val.substring(i) + " in expression: " + val);
                            }
                            break;
                    }
                }
                else {
                    switch (ch) {
                        case "'":
                        case '"':
                            if (literal === ch) {
                                var i1 = i + 1, next = i1 < len ? val.charAt(i1) : null;
                                if (next === ch) {
                                    funcs.setKeyVal(kv, start, i + 1, val, isKey, true);
                                    i += 1;
                                    start = -1;
                                }
                                else {
                                    funcs.setKeyVal(kv, start, i, val, isKey, true);
                                    literal = null;
                                    start = -1;
                                }
                            }
                            break;
                    }
                }
            }
            funcs.setKeyVal(kv, start, i, val, isKey, false);
            parts.push(kv);
            parts = parts.filter(function (kv) {
                return funcs.checkVal(kv);
            });
            return parts;
        };
        Funcs.reduceKeyVal = function (kv, parseType, dataContext, res) {
            var isBind = false, bindparts;
            var checkIsBind = parseType === 2 || parseType === 1;
            if (checkIsBind && kv.tag === "1") {
                bindparts = funcs.getExprArgs(kv.val);
                isBind = bindparts.length > 0;
            }
            if (isBind) {
                switch (parseType) {
                    case 2:
                        var source = dataContext || bootstrapper_1.bootstrapper.app;
                        if (bindparts.length > 1) {
                            if (isString(bindparts[1])) {
                                source = resolvePath(bootstrapper_1.bootstrapper.app, bindparts[1]);
                                if (!source) {
                                    throw new Error("Invalid source in the bind expression, see key: " + kv.key + "   val: " + kv.val);
                                }
                            }
                            else {
                                throw new Error("Invalid second parameter in the bind expression, see key: " + kv.key + "   val: " + kv.val);
                            }
                        }
                        if (isString(bindparts[0])) {
                            var boundValue = resolvePath(source, bindparts[0]);
                            if (boundValue === _undefined) {
                                throw new Error("The bind expression returns UNDEFINED value, see key: " + kv.key + "   val: " + kv.val);
                            }
                            res[kv.key] = boundValue;
                        }
                        else {
                            throw new Error("Invalid bind expression, see key: " + kv.key + "   val: " + kv.val);
                        }
                        break;
                    case 1:
                        if (bindparts.length > 0 && kv.key === "param") {
                            res[kv.key] = bindparts;
                            res.isBind = true;
                        }
                        break;
                    default:
                        res[kv.key] = kv.val;
                        break;
                }
            }
            else {
                switch (kv.tag) {
                    case "5":
                        res[kv.key] = helper.parseOption(parseType, kv.val, dataContext);
                        break;
                    case "2":
                        {
                            res[kv.key] = helper.parseGetExpr(0, kv.val, dataContext);
                        }
                        break;
                    case "4":
                        {
                            var args = funcs.getExprArgs(kv.val);
                            var id = args[0], rest = args.slice(1);
                            if (isString(id)) {
                                res[kv.key] = helper.getSvc.apply(helper, __spreadArray([id], rest));
                            }
                            else {
                                throw new Error("Invalid expression with key: " + kv.key + "   val: " + kv.val);
                            }
                        }
                        break;
                    default:
                        res[kv.key] = kv.val;
                        break;
                }
            }
        };
        Funcs.getExprArgs = function (expr) {
            var i, ch, literal, parts = [], start = -1, seekNext = false;
            var len = expr.length;
            var current = "";
            for (i = 0; i < len; i += 1) {
                if (start < 0) {
                    start = i;
                }
                ch = expr.charAt(i);
                if (!literal) {
                    switch (ch) {
                        case "'":
                        case '"':
                            literal = ch;
                            current += expr.substring(start, i);
                            start = i + 1;
                            break;
                        case ',':
                            {
                                if (seekNext && (current != "" || trim(expr.substring(start, i)) != ""))
                                    throw new Error("Invalid expression arguments: " + expr);
                                if (!seekNext) {
                                    current += expr.substring(start, i);
                                    parts.push(current);
                                }
                                else {
                                    seekNext = false;
                                }
                                start = -1;
                                current = "";
                            }
                            break;
                        case '{':
                            {
                                if (trim(current) !== "")
                                    throw new Error("Invalid expression arguments: " + expr);
                                var braceLen = getBraceLen(expr, i, 1);
                                var val = expr.substring(i + 1, i + braceLen - 1);
                                var obj = helper.parseOption(0, val, null);
                                parts.push(obj);
                                i += (braceLen - 1);
                                start = -1;
                                current = "";
                                seekNext = true;
                            }
                            break;
                    }
                }
                else {
                    switch (ch) {
                        case "'":
                        case '"':
                            if (literal === ch) {
                                var i1 = i + 1, next = i1 < len ? expr.charAt(i1) : null;
                                if (next === ch) {
                                    current += expr.substring(start, i + 1);
                                    i += 1;
                                    start = i + 1;
                                }
                                else {
                                    current += expr.substring(start, i);
                                    literal = null;
                                    start = i + 1;
                                }
                            }
                            break;
                    }
                }
            }
            if (start > -1) {
                if (seekNext && (current != "" || trim(expr.substring(start, i)) != ""))
                    throw new Error("Invalid expression arguments: " + expr);
                current += expr.substring(start, i);
                parts.push(current);
            }
            return parts.map(function (p) { return isString(p) ? trim(p) : p; });
        };
        return Funcs;
    }());
    exports.Funcs = Funcs;
    var funcs = Funcs;
    var Helper = (function () {
        function Helper() {
        }
        Helper.getCurlyBraceParts = function (val) {
            var i, ch;
            var parts = [], len = val.length;
            for (i = 0; i < len; i += 1) {
                ch = val.charAt(i);
                switch (ch) {
                    case "{":
                        var braceLen = getBraceLen(val, i, 1);
                        parts.push(trim(val.substr(i + 1, braceLen - 2)));
                        i += (braceLen - 1);
                        break;
                    default:
                        if (!int_1.spaceRX.test(ch)) {
                            throw new Error(format(jriapp_shared_1.LocaleERRS.ERR_EXPR_BRACES_INVALID, val));
                        }
                        break;
                }
            }
            return parts;
        };
        Helper.getBraceContent = function (val, brace) {
            var ch, start = 0;
            var len = val.length;
            var br1;
            switch (brace) {
                case 0:
                    br1 = "(";
                    break;
                case 1:
                    br1 = "{";
                    break;
                case 2:
                    br1 = "[";
                    break;
            }
            for (var i = 0; i < len; i += 1) {
                if (start < 0) {
                    start = i;
                }
                ch = val.charAt(i);
                if (ch === br1) {
                    var braceLen = getBraceLen(val, i, brace);
                    return trim(val.substr(i + 1, braceLen - 2));
                }
            }
            throw new Error("Invalid Expression: " + val);
        };
        Helper.getSvc = function (id) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var argsdata = [];
            for (var i = 0; i < args.length; ++i) {
                var val = args[i];
                if (isNumeric(val)) {
                    argsdata[i] = Number(val);
                }
                else if (isBoolString(val)) {
                    argsdata[i] = parseBool(val);
                }
                else {
                    argsdata[i] = val;
                }
            }
            return (_a = bootstrapper_1.bootstrapper.app).getSvc.apply(_a, __spreadArray([trimQuotes(id)], argsdata));
        };
        Helper.isGetExpr = function (val) {
            return !!val && int_1.getRX.test(val);
        };
        Helper.getGetParts = function (str) {
            var args = funcs.getExprArgs(str);
            return args.map(function (id) {
                if (!isString(id)) {
                    throw new Error("Invalid get expression: " + str);
                }
                return trim(helper.getOptions(trim(id)));
            });
        };
        Helper.getOptions = function (id) {
            return bootstrapper_1.bootstrapper.app.getOptions(trimQuotes(id));
        };
        Helper.parseGetExpr = function (parseType, strExpr, dataContext) {
            var parts = helper.getGetParts(strExpr);
            return helper.parseOptions(parseType, parts, dataContext);
        };
        Helper.parseOptions = function (parseType, parts, dataContext) {
            var first = parts[0], rest = parts.slice(1);
            var obj = helper.parseOption(parseType, first, dataContext) || {};
            for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
                var val = rest_1[_i];
                var obj2 = helper.parseOption(parseType, val, dataContext);
                obj = extend(obj, obj2);
            }
            return obj;
        };
        Helper.parseOption = function (parseType, part, dataContext) {
            var res = parseType === 1 ? {
                targetPath: "",
                sourcePath: "",
                to: "",
                target: null,
                source: null,
                mode: "OneWay",
                converter: null,
                param: null,
                isBind: false
            } : {};
            part = trim(part);
            if (helper.isGetExpr(part)) {
                var expr = helper.getBraceContent(part, 0);
                return helper.parseGetExpr(parseType, expr, dataContext);
            }
            var kvals = funcs.getKeyVals(part);
            for (var _i = 0, kvals_1 = kvals; _i < kvals_1.length; _i++) {
                var kv = kvals_1[_i];
                if (parseType === 1 && !kv.val && startsWith(kv.key, "this.")) {
                    kv.val = kv.key.substr(int_1.THIS_LEN);
                    kv.key = "targetPath";
                }
                try {
                    funcs.reduceKeyVal(kv, parseType, dataContext, res);
                }
                catch (err) {
                    res[kv.key] = _undefined;
                    _reportBug(err);
                }
            }
            return res;
        };
        return Helper;
    }());
    exports.Helper = Helper;
    var helper = Helper;
});
define("jriapp/utils/parser", ["require", "exports", "jriapp_shared", "jriapp/parsing/helper"], function (require, exports, jriapp_shared_2, helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Parser = void 0;
    var _a = jriapp_shared_2.Utils.str, trim = _a.fastTrim, startsWith = _a.startsWith, endsWith = _a.endsWith, isGetExpr = helper_1.Helper.isGetExpr, getBraceContent = helper_1.Helper.getBraceContent, getCurlyBraceParts = helper_1.Helper.getCurlyBraceParts, getGetParts = helper_1.Helper.getGetParts, parseOptions = helper_1.Helper.parseOptions, parseOption = helper_1.Helper.parseOption;
    function _appendPart(parts, str) {
        if (startsWith(str, "{") && endsWith(str, "}")) {
            var subparts = getCurlyBraceParts(str);
            for (var k = 0; k < subparts.length; k += 1) {
                parts.push(trim(subparts[k]));
            }
        }
        else {
            parts.push(str);
        }
    }
    function _splitIntoParts(str) {
        var parts = [];
        if (isGetExpr(str)) {
            var ids = getBraceContent(str, 0);
            var args = getGetParts(ids);
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var val = args_1[_i];
                _appendPart(parts, trim(val));
            }
        }
        else {
            _appendPart(parts, trim(str));
        }
        return parts;
    }
    function _parseOptions(parseType, options, dataContext) {
        var parts = _splitIntoParts(options);
        return parseOptions(parseType, parts, dataContext);
    }
    function _parseBindings(parseType, bindings, dataContext) {
        return bindings.map(function (str) { return parseOption(parseType, str, dataContext); });
    }
    var Parser = (function () {
        function Parser() {
        }
        Parser.parseOptions = function (options) {
            return _parseOptions(0, options, null);
        };
        Parser.parseBindings = function (bindings) {
            var parts = [];
            for (var _i = 0, bindings_1 = bindings; _i < bindings_1.length; _i++) {
                var str = bindings_1[_i];
                var arr = _splitIntoParts(str);
                parts.push.apply(parts, arr);
            }
            return _parseBindings(1, parts, null);
        };
        Parser.parseViewOptions = function (options, dataContext) {
            return _parseOptions(2, options, dataContext);
        };
        return Parser;
    }());
    exports.Parser = Parser;
});
define("jriapp/elview", ["require", "exports", "jriapp_shared", "jriapp/bootstrapper", "jriapp/utils/parser"], function (require, exports, jriapp_shared_3, bootstrapper_2, parser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createElViewRegister = exports.createElViewFactory = void 0;
    var utils = jriapp_shared_3.Utils, Indexer = utils.core.Indexer, format = utils.str.format, parser = parser_1.Parser, ERRS = jriapp_shared_3.LocaleERRS;
    function createElViewFactory(register) {
        return new ElViewFactory(register);
    }
    exports.createElViewFactory = createElViewFactory;
    function createElViewRegister(next) {
        return new ElViewRegister(next);
    }
    exports.createElViewRegister = createElViewRegister;
    var ElViewRegister = (function () {
        function ElViewRegister(next) {
            this._exports = Indexer();
            this._next = next;
        }
        ElViewRegister.prototype.dispose = function () {
            this._exports = Indexer();
        };
        ElViewRegister.prototype.registerElView = function (name, vwType) {
            if (!bootstrapper_2.getObject(this, name)) {
                bootstrapper_2.registerObject(this, name, vwType);
            }
            else {
                throw new Error(utils.str.format(ERRS.ERR_OBJ_ALREADY_REGISTERED, name));
            }
        };
        ElViewRegister.prototype.getElViewType = function (name) {
            var res = bootstrapper_2.getObject(this, name);
            if (!res && !!this._next) {
                res = this._next.getElViewType(name);
            }
            return res;
        };
        ElViewRegister.prototype.getData = function () {
            return this._exports;
        };
        return ElViewRegister;
    }());
    var ElViewStore = (function () {
        function ElViewStore() {
            this._weakmap = jriapp_shared_3.createWeakMap();
        }
        ElViewStore.prototype.dispose = function () {
        };
        ElViewStore.prototype.getElView = function (el) {
            return this._weakmap.get(el);
        };
        ElViewStore.prototype.setElView = function (el, view) {
            if (!view) {
                this._weakmap.delete(el);
            }
            else {
                this._weakmap.set(el, view);
            }
        };
        return ElViewStore;
    }());
    var ElViewFactory = (function (_super) {
        __extends(ElViewFactory, _super);
        function ElViewFactory(register) {
            var _this = _super.call(this) || this;
            _this._store = new ElViewStore();
            _this._register = createElViewRegister(register);
            return _this;
        }
        ElViewFactory.prototype.dispose = function () {
            if (!this._store) {
                return;
            }
            this._store.dispose();
            this._register.dispose();
            this._store = null;
            this._register = null;
            _super.prototype.dispose.call(this);
        };
        ElViewFactory.prototype.createElView = function (viewInfo) {
            var viewType, elView;
            var el = viewInfo.el, options = viewInfo.options, name = viewInfo.name;
            if (!!name) {
                viewType = this._register.getElViewType(name);
                if (!viewType) {
                    throw new Error(format(ERRS.ERR_ELVIEW_NOT_REGISTERED, name));
                }
            }
            if (!viewType) {
                var nodeNm = el.nodeName.toLowerCase(), attrType = void 0;
                switch (nodeNm) {
                    case "input":
                        {
                            attrType = el.getAttribute("type");
                            nodeNm = nodeNm + ":" + attrType;
                            viewType = this._register.getElViewType(nodeNm);
                        }
                        break;
                    default:
                        viewType = this._register.getElViewType(nodeNm);
                        break;
                }
                if (!viewType) {
                    throw new Error(format(ERRS.ERR_ELVIEW_NOT_CREATED, nodeNm));
                }
            }
            try {
                elView = new viewType(el, options || {});
            }
            catch (e) {
                this._store.setElView(el, null);
                throw e;
            }
            return elView;
        };
        ElViewFactory.prototype.getElView = function (el) {
            return this.store.getElView(el);
        };
        ElViewFactory.prototype.getElementViewInfo = function (el, dataContext) {
            if (dataContext === void 0) { dataContext = null; }
            var viewName = null;
            if (el.hasAttribute("data-view")) {
                var attr = el.getAttribute("data-view");
                if (!!attr && attr !== "default") {
                    viewName = attr;
                }
            }
            var options;
            if (el.hasAttribute("data-view-options")) {
                var attr = el.getAttribute("data-view-options");
                options = parser.parseViewOptions(attr, dataContext);
            }
            else {
                options = Indexer();
            }
            return { el: el, name: viewName, options: options };
        };
        Object.defineProperty(ElViewFactory.prototype, "store", {
            get: function () {
                return this._store;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ElViewFactory.prototype, "register", {
            get: function () {
                return this._register;
            },
            enumerable: false,
            configurable: true
        });
        return ElViewFactory;
    }(jriapp_shared_3.BaseObject));
});
define("jriapp/content", ["require", "exports", "jriapp_shared"], function (require, exports, jriapp_shared_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createContentFactoryList = void 0;
    var ERRS = jriapp_shared_4.LocaleERRS;
    function createContentFactoryList() {
        return new FactoryList();
    }
    exports.createContentFactoryList = createContentFactoryList;
    var LastFactory = (function () {
        function LastFactory() {
        }
        LastFactory.prototype.getContentType = function (_options) {
            throw new Error(ERRS.ERR_BINDING_CONTENT_NOT_FOUND);
        };
        LastFactory.prototype.isExternallyCachable = function (_contentType) {
            return false;
        };
        return LastFactory;
    }());
    var FactoryList = (function () {
        function FactoryList() {
            this._factory = new LastFactory();
        }
        FactoryList.prototype.addFactory = function (factoryGetter) {
            this._factory = factoryGetter(this._factory);
        };
        FactoryList.prototype.getContentType = function (options) {
            return this._factory.getContentType(options);
        };
        FactoryList.prototype.isExternallyCachable = function (contentType) {
            return this._factory.isExternallyCachable(contentType);
        };
        return FactoryList;
    }());
});
define("jriapp/defaults", ["require", "exports", "jriapp_shared", "jriapp/int"], function (require, exports, jriapp_shared_5, int_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Defaults = void 0;
    var utils = jriapp_shared_5.Utils, endsWith = utils.str.endsWith;
    var Defaults = (function (_super) {
        __extends(Defaults, _super);
        function Defaults() {
            var _this = _super.call(this) || this;
            _this._dateFormat = "DD.MM.YYYY";
            _this._dateTimeFormat = "DD.MM.YYYY HH:mm:ss";
            _this._timeFormat = "HH:mm:ss";
            _this._imagesPath = "";
            _this._decimalPoint = ",";
            _this._thousandSep = " ";
            _this._decPrecision = 2;
            return _this;
        }
        Defaults.prototype.toString = function () {
            return "Defaults";
        };
        Object.defineProperty(Defaults.prototype, "dateFormat", {
            get: function () {
                return this._dateFormat;
            },
            set: function (v) {
                if (this._dateFormat !== v) {
                    this._dateFormat = v;
                    this.objEvents.raiseProp("dateFormat");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Defaults.prototype, "timeFormat", {
            get: function () {
                return this._timeFormat;
            },
            set: function (v) {
                if (this._timeFormat !== v) {
                    this._timeFormat = v;
                    this.objEvents.raiseProp("timeFormat");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Defaults.prototype, "dateTimeFormat", {
            get: function () {
                return this._dateTimeFormat;
            },
            set: function (v) {
                if (this._dateTimeFormat !== v) {
                    this._dateTimeFormat = v;
                    this.objEvents.raiseProp("dateTimeFormat");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Defaults.prototype, "imagesPath", {
            get: function () {
                return this._imagesPath;
            },
            set: function (v) {
                if (!v) {
                    v = "";
                }
                if (this._imagesPath !== v) {
                    if (!endsWith(v, "/")) {
                        this._imagesPath = v + "/";
                    }
                    else {
                        this._imagesPath = v;
                    }
                    this.objEvents.raiseProp("imagesPath");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Defaults.prototype, "decimalPoint", {
            get: function () {
                return this._decimalPoint;
            },
            set: function (v) {
                if (this._decimalPoint !== v) {
                    this._decimalPoint = v;
                    this.objEvents.raiseProp("decimalPoint");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Defaults.prototype, "thousandSep", {
            get: function () {
                return this._thousandSep;
            },
            set: function (v) {
                if (this._thousandSep !== v) {
                    this._thousandSep = v;
                    this.objEvents.raiseProp("thousandSep");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Defaults.prototype, "decPrecision", {
            get: function () {
                return this._decPrecision;
            },
            set: function (v) {
                if (this._decPrecision !== v) {
                    this._decPrecision = v;
                    this.objEvents.raiseProp("decPrecision");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Defaults.prototype, "ButtonsCSS", {
            get: function () {
                return int_2.ButtonCss;
            },
            enumerable: false,
            configurable: true
        });
        return Defaults;
    }(jriapp_shared_5.BaseObject));
    exports.Defaults = Defaults;
});
define("jriapp/utils/tloader", ["require", "exports", "jriapp_shared"], function (require, exports, jriapp_shared_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateLoader = exports.registerTemplateGroup = exports.registerLoader = exports.getLoader = void 0;
    var utils = jriapp_shared_6.Utils, isFunc = utils.check.isFunc, _a = utils.core, getValue = _a.getValue, setValue = _a.setValue, format = utils.str.format, _b = utils.async, createDeferred = _b.createDeferred, reject = _b.reject, ERRS = jriapp_shared_6.LocaleERRS, DEBUG = utils.debug, LOG = utils.log;
    var LOADER_EVENTS;
    (function (LOADER_EVENTS) {
        LOADER_EVENTS["loaded"] = "loaded";
    })(LOADER_EVENTS || (LOADER_EVENTS = {}));
    function getLoader(root, name) {
        var name2 = "ldr." + name;
        return getValue(root.getData(), name2);
    }
    exports.getLoader = getLoader;
    function registerLoader(root, name, loader) {
        if (!isFunc(loader)) {
            throw new Error(format(ERRS.ERR_ASSERTION_FAILED, "loader must be a Function"));
        }
        var name2 = "ldr." + name;
        var info = { loader: loader, owner: root };
        setValue(root.getData(), name2, info, true);
    }
    exports.registerLoader = registerLoader;
    function registerTemplateGroup(root, name, obj) {
        var name2 = "tgrp." + name;
        setValue(root.getData(), name2, obj, true);
    }
    exports.registerTemplateGroup = registerTemplateGroup;
    function getTemplateGroup(root, name) {
        var name2 = "tgrp." + name;
        return getValue(root.getData(), name2);
    }
    function getGroupName(fullName) {
        var parts = fullName.split(".");
        if (parts.length > 2) {
            throw new Error("Invalid template name: " + fullName);
        }
        return (parts.length === 1) ? "" : parts[0];
    }
    var TemplateLoader = (function (_super) {
        __extends(TemplateLoader, _super);
        function TemplateLoader() {
            var _this = _super.call(this) || this;
            var self = _this;
            _this._promises = [];
            _this._waitQueue = new jriapp_shared_6.WaitQueue(self);
            return _this;
        }
        TemplateLoader.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            var self = this;
            self._promises = [];
            if (!!self._waitQueue) {
                self._waitQueue.dispose();
                self._waitQueue = null;
            }
            _super.prototype.dispose.call(this);
        };
        TemplateLoader.prototype.addOnLoaded = function (fn, nmspace) {
            this.objEvents.on("loaded", fn, nmspace);
        };
        TemplateLoader.prototype.offOnLoaded = function (nmspace) {
            this.objEvents.off("loaded", nmspace);
        };
        TemplateLoader.prototype.waitForNotLoading = function (callback, callbackArgs) {
            this._waitQueue.enQueue({
                prop: "isLoading",
                groupName: null,
                predicate: function (val) { return !val; },
                action: callback,
                actionArgs: callbackArgs
            });
        };
        TemplateLoader.prototype._onLoaded = function (html, owner) {
            this.objEvents.raise("loaded", { html: html, owner: owner });
        };
        TemplateLoader.prototype.loadTemplatesAsync = function (owner, loader) {
            var self = this, promise = loader(), old = self.isLoading;
            self._promises.push(promise);
            if (self.isLoading !== old) {
                self.objEvents.raiseProp("isLoading");
            }
            var res = promise.then(function (html) {
                self._onLoaded(html, owner);
            });
            res.finally(function () {
                utils.arr.remove(self._promises, promise);
                if (!self.isLoading) {
                    self.objEvents.raiseProp("isLoading");
                }
            });
            return res;
        };
        TemplateLoader.prototype.getTemplateLoader = function (context, name) {
            var self = this, info = context.getTemplateLoaderInfo(name);
            if (!!info) {
                return info.loader;
            }
            else {
                var groupName = getGroupName(name);
                if (!groupName) {
                    return null;
                }
                else {
                    var group_1 = getTemplateGroup(context, groupName);
                    if (!group_1) {
                        throw new Error(format(ERRS.ERR_TEMPLATE_GROUP_NOTREGISTERED, groupName));
                    }
                    return function () {
                        if (!group_1.promise) {
                            group_1.promise = self.loadTemplatesAsync(group_1.owner, group_1.loader);
                        }
                        var deferred = createDeferred(true);
                        group_1.promise.then(function () {
                            var info = context.getTemplateLoaderInfo(name);
                            if (!info) {
                                var error = format(ERRS.ERR_TEMPLATE_NOTREGISTERED, name), rejected_1 = reject(error, true);
                                registerLoader(group_1.owner, name, function () { return rejected_1; });
                                if (DEBUG.isDebugging()) {
                                    LOG.error(error);
                                }
                                throw new Error(error);
                            }
                            var loadPromise = info.loader();
                            loadPromise.then(function (docInfo) {
                                deferred.resolve(docInfo);
                            }, function (err) {
                                deferred.reject(err);
                            });
                        }).catch(function (err) {
                            deferred.reject(err);
                        });
                        return deferred.promise();
                    };
                }
            }
        };
        Object.defineProperty(TemplateLoader.prototype, "isLoading", {
            get: function () {
                return this._promises.length > 0;
            },
            enumerable: false,
            configurable: true
        });
        return TemplateLoader;
    }(jriapp_shared_6.BaseObject));
    exports.TemplateLoader = TemplateLoader;
});
define("jriapp/utils/domevents", ["require", "exports", "jriapp_shared"], function (require, exports, jriapp_shared_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DomEvents = exports.EventWrap = void 0;
    var utils = jriapp_shared_7.Utils, _a = utils.check, isFunc = _a.isFunc, isString = _a.isString, isNt = _a.isNt, arrHelper = utils.arr, format = utils.str.format, debug = utils.debug, ERRS = jriapp_shared_7.LocaleERRS;
    var EventWrap = (function () {
        function EventWrap(ev, target) {
            this._ev = ev;
            this._target = target;
            this._cancelBubble = false;
        }
        Object.defineProperty(EventWrap.prototype, "type", {
            get: function () {
                return this._ev.type;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "target", {
            get: function () {
                return this._target;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "bubbles", {
            get: function () {
                return this._ev.bubbles;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "defaultPrevented", {
            get: function () {
                return this._ev.defaultPrevented;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "cancelable", {
            get: function () {
                return this._ev.cancelable;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "isTrusted", {
            get: function () {
                return this._ev.isTrusted;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "returnValue", {
            get: function () {
                return this._ev.returnValue;
            },
            set: function (v) {
                this._ev.returnValue = v;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "srcElement", {
            get: function () {
                return this._ev.srcElement;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "eventPhase", {
            get: function () {
                return this._ev.eventPhase;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "cancelBubble", {
            get: function () {
                return this._cancelBubble;
            },
            set: function (v) {
                if (!!v) {
                    this._cancelBubble = v;
                    this._ev.stopPropagation();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "timeStamp", {
            get: function () {
                return this._ev.timeStamp;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "currentTarget", {
            get: function () {
                return this._ev.currentTarget;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "originalEvent", {
            get: function () {
                return this._ev;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "AT_TARGET", {
            get: function () {
                return this._ev.AT_TARGET;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "BUBBLING_PHASE", {
            get: function () {
                return this._ev.BUBBLING_PHASE;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EventWrap.prototype, "CAPTURING_PHASE", {
            get: function () {
                return this._ev.CAPTURING_PHASE;
            },
            enumerable: false,
            configurable: true
        });
        EventWrap.prototype.preventDefault = function () {
            this._ev.preventDefault();
        };
        EventWrap.prototype.stopPropagation = function () {
            this._ev.stopPropagation();
            this._cancelBubble = true;
        };
        EventWrap.prototype.stopImmediatePropagation = function () {
            this._ev.stopImmediatePropagation();
        };
        return EventWrap;
    }());
    exports.EventWrap = EventWrap;
    var EventHelper = (function () {
        function EventHelper() {
        }
        EventHelper.Node = function (handler, name, useCapture) {
            return { fn: handler, name: name, useCapture: useCapture };
        };
        EventHelper.add = function (ev, name, handler, nmspace, useCapture) {
            if (!ev) {
                debug.checkStartDebugger();
                throw new Error(format(ERRS.ERR_ASSERTION_FAILED, "ev is a valid object"));
            }
            if (!isFunc(handler)) {
                throw new Error(ERRS.ERR_EVENT_INVALID_FUNC);
            }
            if (!name) {
                throw new Error(format(ERRS.ERR_EVENT_INVALID, "[Empty]"));
            }
            var ns = !nmspace ? "*" : "" + nmspace;
            var list = ev[ns];
            var node = EventHelper.Node(handler, name, useCapture);
            if (!list) {
                ev[ns] = list = [];
            }
            list.push(node);
        };
        EventHelper.getNS = function (ev, ns) {
            if (!ev) {
                return [];
            }
            var res = [], list = ev[ns];
            if (!list) {
                return res;
            }
            for (var k = 0; k < list.length; ++k) {
                res.push(list[k]);
            }
            return res;
        };
        EventHelper.removeNS = function (ev, name, ns) {
            if (!ev) {
                return [];
            }
            var res = [], list = ev[ns];
            if (!list) {
                return res;
            }
            if (!name) {
                delete ev[ns];
                return list;
            }
            var newArr = [];
            for (var k = 0; k < list.length; ++k) {
                if (list[k].name === name) {
                    res.push(list[k]);
                }
                else {
                    newArr.push(list[k]);
                }
            }
            if (newArr.length > 0) {
                ev[ns] = newArr;
            }
            else {
                delete ev[ns];
            }
            return res;
        };
        EventHelper.remove = function (ev, name, nmspace) {
            if (!ev) {
                return [];
            }
            var ns = !nmspace ? "*" : "" + nmspace, arr = [];
            if (ns === "*") {
                var nsKeys = Object.keys(ev);
                for (var i = 0; i < nsKeys.length; ++i) {
                    arr.push(EventHelper.removeNS(ev, name, nsKeys[i]));
                }
                return arrHelper.merge(arr);
            }
            else {
                return EventHelper.removeNS(ev, name, ns);
            }
        };
        EventHelper.toArray = function (ev) {
            if (!ev) {
                return [];
            }
            var nsKeys = Object.keys(ev), arr = [];
            for (var i = 0; i < nsKeys.length; ++i) {
                arr.push(EventHelper.getNS(ev, nsKeys[i]));
            }
            return arrHelper.merge(arr);
        };
        EventHelper.getDelegateListener = function (root, isMatch, listener) {
            var res = function (event) {
                var target = event.target;
                while (!!target && target !== root) {
                    if (isMatch(target)) {
                        var eventWrap = new EventWrap(event, target);
                        listener.apply(target, [eventWrap]);
                        if (eventWrap.cancelBubble) {
                            return;
                        }
                    }
                    target = target.parentElement;
                }
            };
            return res;
        };
        return EventHelper;
    }());
    var helper = EventHelper;
    var weakmap = jriapp_shared_7.createWeakMap();
    function isDelegateArgs(a) {
        return (!a) ? false : isFunc(a.matchElement);
    }
    var DomEvents = (function () {
        function DomEvents() {
        }
        DomEvents.on = function (el, evType, listener, args) {
            var events = weakmap.get(el), ns, useCapture = false;
            if (!events) {
                events = {};
                weakmap.set(el, events);
            }
            if (!!args) {
                if (isString(args)) {
                    ns = args;
                }
                else if (isDelegateArgs(args)) {
                    ns = args.nmspace;
                    listener = helper.getDelegateListener(el, args.matchElement, listener);
                }
                else {
                    ns = args.nmspace;
                    useCapture = !!args.useCapture;
                }
            }
            helper.add(events, evType, listener, ns, useCapture);
            el.addEventListener(evType, listener, useCapture);
        };
        DomEvents.off = function (el, evType, nmspace, useCapture) {
            var ev = weakmap.get(el);
            if (!ev) {
                return;
            }
            var handlers = helper.remove(ev, evType, nmspace);
            for (var i = 0; i < handlers.length; i += 1) {
                var handler = handlers[i];
                if (isNt(useCapture) || (useCapture === handler.useCapture)) {
                    el.removeEventListener(handler.name, handler.fn, handler.useCapture);
                }
            }
        };
        DomEvents.offNS = function (el, nmspace) {
            DomEvents.off(el, null, nmspace);
        };
        return DomEvents;
    }());
    exports.DomEvents = DomEvents;
});
define("jriapp/utils/dom", ["require", "exports", "jriapp_shared", "jriapp/utils/domevents"], function (require, exports, jriapp_shared_8, domevents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DomUtils = void 0;
    var utils = jriapp_shared_8.Utils, fromList = utils.arr.fromList, fastTrim = utils.str.fastTrim, win = window, doc = win.document, queue = jriapp_shared_8.Utils.queue, Indexer = utils.core.Indexer, hasClassList = ("classList" in window.document.documentElement), weakmap = jriapp_shared_8.createWeakMap();
    var _isTemplateTagAvailable = false;
    var _checkDOMReady = (function () {
        var funcs = [], hack = doc.documentElement.doScroll, domContentLoaded = "DOMContentLoaded";
        var isDOMloaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);
        if (!isDOMloaded) {
            var callback_1 = function () {
                doc.removeEventListener(domContentLoaded, callback_1);
                isDOMloaded = true;
                var fnOnloaded = null;
                while (fnOnloaded = funcs.shift()) {
                    queue.enque(fnOnloaded);
                }
            };
            doc.addEventListener(domContentLoaded, callback_1);
        }
        return function (fn) {
            isDOMloaded ? queue.enque(fn) : funcs.push(fn);
        };
    })();
    _checkDOMReady(function () { _isTemplateTagAvailable = ('content' in doc.createElement('template')); });
    function getElementContent(root) {
        var frag = doc.createDocumentFragment();
        var child = null;
        while (!!(child = root.firstChild)) {
            frag.appendChild(child);
        }
        return frag;
    }
    var DomUtils = (function () {
        function DomUtils() {
        }
        DomUtils.isTemplateTagAvailable = function () {
            return _isTemplateTagAvailable;
        };
        DomUtils.getData = function (el, key) {
            var map = weakmap.get(el);
            if (!map) {
                return (void 0);
            }
            return map[key];
        };
        DomUtils.setData = function (el, key, val) {
            var map = weakmap.get(el);
            if (!map) {
                map = Indexer();
                weakmap.set(el, map);
            }
            map[key] = val;
        };
        DomUtils.removeData = function (el, key) {
            var map = weakmap.get(el);
            if (!map) {
                return;
            }
            if (!key) {
                weakmap.delete(el);
            }
            else {
                delete map[key];
            }
        };
        DomUtils.isContained = function (node, container) {
            if (!node) {
                return false;
            }
            var contains = container.contains;
            if (!!contains) {
                return contains.call(container, node);
            }
            while (!!(node = node.parentNode)) {
                if (node === container) {
                    return true;
                }
            }
            return false;
        };
        DomUtils.getDocFragment = function (html) {
            if (_isTemplateTagAvailable) {
                var t = doc.createElement('template');
                t.innerHTML = html;
                return t.content;
            }
            else {
                var t = doc.createElement('div');
                t.innerHTML = html;
                return getElementContent(t);
            }
        };
        DomUtils.fromHTML = function (html) {
            var div = doc.createElement("div");
            div.innerHTML = html;
            return fromList(div.children);
        };
        DomUtils.queryAll = function (root, selector) {
            var res = root.querySelectorAll(selector);
            return fromList(res);
        };
        DomUtils.queryOne = function (root, selector) {
            return root.querySelector(selector);
        };
        DomUtils.append = function (parent, children) {
            if (!children) {
                return;
            }
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var node = children_1[_i];
                parent.appendChild(node);
            }
        };
        DomUtils.prepend = function (parent, child) {
            if (!child) {
                return;
            }
            var firstChild = null;
            if (!(firstChild = parent.firstChild)) {
                parent.appendChild(child);
            }
            else {
                parent.insertBefore(child, firstChild);
            }
        };
        DomUtils.removeNode = function (node) {
            if (!node) {
                return;
            }
            var pnd = node.parentNode;
            if (!!pnd) {
                pnd.removeChild(node);
            }
        };
        DomUtils.insertAfter = function (node, refNode) {
            var parent = refNode.parentNode;
            if (parent.lastChild === refNode) {
                parent.appendChild(node);
            }
            else {
                parent.insertBefore(node, refNode.nextSibling);
            }
        };
        DomUtils.insertBefore = function (node, refNode) {
            var parent = refNode.parentNode;
            return parent.insertBefore(node, refNode);
        };
        DomUtils.wrap = function (elem, wrapper) {
            var parent = elem.parentElement, nsibling = elem.nextSibling;
            if (!parent) {
                return;
            }
            wrapper.appendChild(elem);
            (!nsibling) ? parent.appendChild(wrapper) : parent.insertBefore(wrapper, nsibling);
        };
        DomUtils.unwrap = function (elem) {
            var wrapper = elem.parentElement;
            if (!wrapper) {
                return;
            }
            var parent = wrapper.parentElement, nsibling = wrapper.nextSibling;
            if (!parent) {
                return;
            }
            parent.removeChild(wrapper);
            (!nsibling) ? parent.appendChild(elem) : parent.insertBefore(elem, nsibling);
        };
        DomUtils.getClassMap = function (el) {
            var res = Indexer();
            if (!el) {
                return res;
            }
            var className = el.className;
            if (!className) {
                return res;
            }
            var arr = className.split(" ");
            for (var i = 0; i < arr.length; i += 1) {
                arr[i] = fastTrim(arr[i]);
                if (!!arr[i]) {
                    res[arr[i]] = i;
                }
            }
            return res;
        };
        DomUtils.setClasses = function (elems, classes) {
            if (!elems.length || !classes.length) {
                return;
            }
            var toAdd = [];
            var toRemove = [], removeAll = false;
            classes.forEach(function (v) {
                if (!v) {
                    return;
                }
                var name = fastTrim(v);
                if (!name) {
                    return;
                }
                var op = v.charAt(0);
                if (op == "+" || op == "-") {
                    name = fastTrim(v.substr(1));
                }
                if (!name) {
                    return;
                }
                var arr = name.split(" ");
                for (var i = 0; i < arr.length; i += 1) {
                    var v2 = fastTrim(arr[i]);
                    if (!!v2) {
                        if (op != "-") {
                            toAdd.push(v2);
                        }
                        else {
                            if (name === "*") {
                                removeAll = true;
                            }
                            else {
                                toRemove.push(v2);
                            }
                        }
                    }
                }
            });
            if (removeAll) {
                toRemove = [];
            }
            for (var j = 0; j < elems.length; j += 1) {
                var el = elems[j];
                var map = DomUtils.getClassMap(el);
                if (removeAll) {
                    map = Indexer();
                }
                for (var i = 0; i < toRemove.length; i += 1) {
                    delete map[toRemove[i]];
                }
                for (var i = 0; i < toAdd.length; i += 1) {
                    map[toAdd[i]] = i + 1000;
                }
                var keys = Object.keys(map);
                el.className = keys.join(" ");
            }
        };
        DomUtils.setClass = function (elems, css, remove) {
            if (remove === void 0) { remove = false; }
            if (!elems.length) {
                return;
            }
            if (!css) {
                if (remove) {
                    for (var j = 0; j < elems.length; j += 1) {
                        elems[j].className = "";
                    }
                }
                return;
            }
            var _arr = css.split(" ");
            for (var i = 0; i < _arr.length; i += 1) {
                _arr[i] = fastTrim(_arr[i]);
            }
            var arr = _arr.filter(function (val) { return !!val; });
            if (hasClassList && arr.length === 1) {
                for (var j = 0; j < elems.length; j += 1) {
                    var el = elems[j];
                    if (remove) {
                        el.classList.remove(arr[0]);
                    }
                    else {
                        el.classList.add(arr[0]);
                    }
                }
            }
            else {
                for (var j = 0; j < elems.length; j += 1) {
                    var el = elems[j], map = DomUtils.getClassMap(el);
                    for (var i = 0; i < arr.length; i += 1) {
                        if (remove) {
                            delete map[arr[i]];
                        }
                        else {
                            map[arr[i]] = i + 1000;
                        }
                    }
                    var keys = Object.keys(map);
                    el.className = keys.join(" ");
                }
            }
        };
        DomUtils.addClass = function (elems, css) {
            DomUtils.setClass(elems || [], css, false);
        };
        DomUtils.removeClass = function (elems, css) {
            DomUtils.setClass(elems || [], css, true);
        };
        DomUtils.window = win;
        DomUtils.document = doc;
        DomUtils.ready = _checkDOMReady;
        DomUtils.events = domevents_1.DomEvents;
        return DomUtils;
    }());
    exports.DomUtils = DomUtils;
});
define("jriapp/utils/path", ["require", "exports", "jriapp_shared", "jriapp/utils/dom", "jriapp/int"], function (require, exports, jriapp_shared_9, dom_1, int_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PathHelper = exports.frameworkJS = void 0;
    var utils = jriapp_shared_9.Utils, doc = dom_1.DomUtils.document, arrHelper = utils.arr, _a = utils.str, format = _a.format, ltrim = _a.ltrim, rtrim = _a.rtrim;
    exports.frameworkJS = int_3.Config.frameworkJS || "jriapp.js";
    var stylesDir = "css", imageDir = "img";
    function fn_getFrameworkPath() {
        var name = exports.frameworkJS;
        var arr = arrHelper.fromList(doc.scripts);
        for (var i = 0; i < arr.length; i += 1) {
            var script = arr[i];
            if (!!script.src) {
                var parts = PathHelper.getUrlParts(script.src);
                var pathName = rtrim(parts.pathname, ["/"]);
                if (!!parts.pathname) {
                    pathName = pathName.toLowerCase();
                    if (!!pathName && pathName.lastIndexOf(name) > -1) {
                        var url = script.src;
                        return PathHelper.getParentUrl(url);
                    }
                }
            }
        }
        return null;
    }
    var _cache = {};
    var PathHelper = (function () {
        function PathHelper() {
        }
        PathHelper.appendBust = function (url) {
            var bust = int_3.Config.bust;
            if (!bust) {
                return url;
            }
            return PathHelper.appendSearch(url, bust);
        };
        PathHelper.appendSearch = function (url, search) {
            search = ltrim(search, ["?", " "]);
            var parts = PathHelper.getUrlParts(url);
            var oldSearch = ltrim(parts.search, ["?", " "]);
            if (!!oldSearch && oldSearch.lastIndexOf(search) > -1) {
                return url;
            }
            if (!oldSearch) {
                url = url + "?" + search;
            }
            else {
                url = url + "&" + search;
            }
            return url;
        };
        PathHelper.getNormalizedUrl = function (url) {
            PathHelper._anchor.href = url;
            return PathHelper._anchor.href;
        };
        PathHelper.getUrlParts = function (url) {
            var parser = PathHelper._anchor;
            parser.href = url;
            if (!parser.host) {
                parser.href = parser.href;
            }
            return {
                protocol: parser.protocol,
                host: parser.host,
                hostname: parser.hostname,
                port: parser.port,
                pathname: parser.pathname,
                hash: parser.hash,
                search: parser.search
            };
        };
        PathHelper.getParentUrl = function (url) {
            var res = "";
            if (url.charAt(url.length - 1) === "/") {
                res = url.slice(0, url.lastIndexOf("/"));
                res = res.slice(0, res.lastIndexOf("/")) + "/";
            }
            else {
                res = url.slice(0, url.lastIndexOf("/")) + "/";
            }
            return res;
        };
        PathHelper.getFrameworkPath = function () {
            var res = _cache["root"];
            if (!res) {
                if (!!int_3.Config.frameworkPath) {
                    res = int_3.Config.frameworkPath.replace(/\/?$/, '/');
                }
                if (!res) {
                    res = fn_getFrameworkPath();
                }
                if (!!res) {
                    _cache["root"] = res;
                }
            }
            if (!res) {
                throw new Error(format("Can not resolve {0} framework path", name));
            }
            return res;
        };
        PathHelper.getFrameworkCssPath = function () {
            var res = _cache["css"];
            if (!res) {
                res = PathHelper.getFrameworkPath() + [stylesDir, "/"].join("");
                _cache["css"] = res;
            }
            return res;
        };
        PathHelper.getFrameworkImgPath = function () {
            var res = _cache["img"];
            if (!res) {
                res = PathHelper.getFrameworkPath() + [imageDir, "/"].join("");
                _cache["img"] = res;
            }
            return res;
        };
        PathHelper._anchor = doc.createElement("a");
        return PathHelper;
    }());
    exports.PathHelper = PathHelper;
});
define("jriapp/utils/sloader", ["require", "exports", "jriapp_shared", "jriapp_shared/utils/asyncutils", "jriapp/utils/dom", "jriapp/utils/path"], function (require, exports, jriapp_shared_10, asyncutils_1, dom_2, path_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createCssLoader = exports.frameworkCss = void 0;
    var _resolve = asyncutils_1.AsyncUtils.resolve, _whenAll = asyncutils_1.AsyncUtils.whenAll, createDeferred = asyncutils_1.AsyncUtils.createDeferred, utils = jriapp_shared_10.Utils, dom = dom_2.DomUtils, arrHelper = utils.arr, doc = dom.document, head = doc.head || doc.getElementsByTagName("head")[0];
    var _stylesLoader = null;
    exports.frameworkCss = "jriapp.css";
    function createCssLoader() {
        if (!_stylesLoader) {
            _stylesLoader = new StylesLoader();
        }
        return _stylesLoader;
    }
    exports.createCssLoader = createCssLoader;
    function whenAll(promises) {
        if (!promises) {
            return _resolve(void 0, true);
        }
        if (promises.length === 1) {
            return promises[0];
        }
        var resolved = 0;
        var cnt = promises.length;
        for (var i = 0; i < cnt; i += 1) {
            if (promises[i].state() === 2) {
                ++resolved;
            }
        }
        return (resolved === cnt) ? _resolve(void 0, true) : _whenAll(promises);
    }
    function createLink(url) {
        var link = doc.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        return link;
    }
    var StylesLoader = (function () {
        function StylesLoader() {
            this._loadedCSS = {};
        }
        StylesLoader.prototype.isStyleSheetLoaded = function (url) {
            var testUrl = path_1.PathHelper.getUrlParts(url);
            var arr = arrHelper.fromList(doc.styleSheets);
            for (var i = 0; i < arr.length; i += 1) {
                var cssUrl = path_1.PathHelper.getUrlParts(arr[i].href);
                if (cssUrl.hostname === testUrl.hostname && cssUrl.pathname === testUrl.pathname) {
                    return true;
                }
            }
            return false;
        };
        StylesLoader.prototype.loadByLink = function (url, fnOnload) {
            var link = createLink(url);
            link.onload = function () {
                fnOnload(null);
            };
            link.onerror = function () {
                fnOnload("Error loading: " + url);
            };
            head.appendChild(link);
        };
        StylesLoader.prototype.load = function (url, load) {
            this.loadByLink(url, load);
        };
        ;
        StylesLoader.ensureCssExt = function (name) {
            return name.search(/\.(css|less|scss)$/i) === -1 ? name + ".css" : name;
        };
        StylesLoader.prototype.loadStyle = function (url) {
            url = path_1.PathHelper.appendBust(url);
            var cssUrl = path_1.PathHelper.getNormalizedUrl(url);
            var cssPromise = this._loadedCSS[cssUrl];
            if (!!cssPromise) {
                return cssPromise;
            }
            var deferred = createDeferred(true);
            cssPromise = deferred.promise();
            if (this.isStyleSheetLoaded(url)) {
                deferred.resolve(url);
                this._loadedCSS[cssUrl] = cssPromise;
                return cssPromise;
            }
            this.load(url, function (err) {
                if (!!err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(url);
                }
            });
            this._loadedCSS[cssUrl] = cssPromise;
            return cssPromise;
        };
        StylesLoader.prototype.loadStyles = function (urls) {
            var promises = [];
            for (var i = 0; i < urls.length; i += 1) {
                promises.push(this.loadStyle(urls[i]));
            }
            return whenAll(promises);
        };
        StylesLoader.prototype.loadOwnStyle = function (cssName) {
            cssName = cssName || exports.frameworkCss;
            var cssUrl = path_1.PathHelper.getFrameworkCssPath() + StylesLoader.ensureCssExt(cssName);
            return this.loadStyle(cssUrl);
        };
        StylesLoader.prototype.whenAllLoaded = function () {
            var obj = this._loadedCSS, names = Object.keys(obj), promises = [];
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var name_1 = names_1[_i];
                promises.push(obj[name_1]);
            }
            return whenAll(promises);
        };
        return StylesLoader;
    }());
});
define("jriapp/bootstrapper", ["require", "exports", "jriapp_shared", "jriapp/elview", "jriapp/content", "jriapp/defaults", "jriapp/utils/tloader", "jriapp/utils/sloader", "jriapp/utils/path", "jriapp/utils/dom", "jriapp_shared/utils/queue", "jriapp/parsing/helper"], function (require, exports, jriapp_shared_11, elview_1, content_1, defaults_1, tloader_1, sloader_1, path_2, dom_3, queue_1, helper_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.bootstrapper = exports.Bootstrapper = exports.getObject = exports.unregisterObject = exports.registerObject = exports.getOptions = exports.getSvc = exports.unregisterSvc = exports.registerSvc = exports.getConverter = exports.registerConverter = exports.StartupState = exports.selectableProviderWeakMap = exports.subscribeWeakMap = void 0;
    var utils = jriapp_shared_11.Utils, dom = dom_3.DomUtils, win = dom.window, doc = win.document, isFunc = utils.check.isFunc, _a = utils.async, createDeferred = _a.createDeferred, delay = _a.delay, resolve = _a.resolve, _b = utils.core, forEach = _b.forEach, getNewID = _b.getNewID, getValue = _b.getValue, setValue = _b.setValue, removeValue = _b.removeValue, Indexer = _b.Indexer, fromList = utils.arr.fromList, _c = utils.str, format = _c.format, fastTrim = _c.fastTrim, ERROR = utils.err, ERRS = jriapp_shared_11.LocaleERRS, isGetExpr = helper_2.Helper.isGetExpr, getGetParts = helper_2.Helper.getGetParts, getBraceContent = helper_2.Helper.getBraceContent;
    exports.subscribeWeakMap = jriapp_shared_11.createWeakMap(), exports.selectableProviderWeakMap = jriapp_shared_11.createWeakMap();
    (function () {
        var win = dom.window;
        if (!("Promise" in win)) {
            win.Promise = jriapp_shared_11.StatefulPromise;
        }
        if (!win.requestAnimationFrame) {
            var requestAnimationFrame_1 = win.requestAnimationFrame || win.mozRequestAnimationFrame ||
                win.webkitRequestAnimationFrame || win.msRequestAnimationFrame;
            var cancelAnimationFrame_1 = win.cancelAnimationFrame || win.mozCancelAnimationFrame ||
                (win.webkitCancelAnimationFrame || win.webkitCancelRequestAnimationFrame) ||
                win.msCancelAnimationFrame;
            if (!requestAnimationFrame_1 || !cancelAnimationFrame_1) {
                var queue = queue_1.createQueue(40);
                requestAnimationFrame_1 = queue.enque;
                cancelAnimationFrame_1 = queue.cancel;
            }
            win.requestAnimationFrame = requestAnimationFrame_1;
            win.cancelAnimationFrame = cancelAnimationFrame_1;
        }
    })();
    var _TEMPLATE_SELECTOR = 'script[type="text/x-template"]';
    var _OPTION_SELECTOR = 'script[type="text/x-options"]';
    var _stylesLoader = sloader_1.createCssLoader();
    var eventNames = {
        click: 1,
        change: 2,
        keypress: 3,
        keydown: 4,
        keyup: 5,
        input: 6
    };
    var GLOB_EVENTS;
    (function (GLOB_EVENTS) {
        GLOB_EVENTS["load"] = "load";
        GLOB_EVENTS["unload"] = "unload";
        GLOB_EVENTS["initialized"] = "initialize";
    })(GLOB_EVENTS || (GLOB_EVENTS = {}));
    var StartupState;
    (function (StartupState) {
        StartupState[StartupState["None"] = 0] = "None";
        StartupState[StartupState["Initializing"] = 1] = "Initializing";
        StartupState[StartupState["Initialized"] = 2] = "Initialized";
        StartupState[StartupState["Ready"] = 3] = "Ready";
        StartupState[StartupState["Error"] = 4] = "Error";
        StartupState[StartupState["Disposed"] = 5] = "Disposed";
    })(StartupState = exports.StartupState || (exports.StartupState = {}));
    var _ObjectEvents = (function (_super) {
        __extends(_ObjectEvents, _super);
        function _ObjectEvents() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        _ObjectEvents.prototype.on = function (name, handler, nmspace, context, priority) {
            var owner = this.owner;
            var self = this, isReady = owner.state === 3;
            var isIntialized = (owner.state === 2 || owner.state === 3);
            if ((name === "load" && isReady) || (name === "initialize" && isIntialized)) {
                utils.queue.enque(function () { handler.apply(self, [self, {}]); });
            }
            else {
                _super.prototype.on.call(this, name, handler, nmspace, context, priority);
            }
        };
        return _ObjectEvents;
    }(jriapp_shared_11.ObjectEvents));
    function registerConverter(root, name, obj) {
        var name2 = "cnv." + name;
        if (!getObject(root, name2)) {
            registerObject(root, name2, obj);
        }
        else {
            throw new Error(format(ERRS.ERR_OBJ_ALREADY_REGISTERED, name));
        }
    }
    exports.registerConverter = registerConverter;
    function getConverter(root, name) {
        var name2 = "cnv." + name;
        return getObject(root, name2);
    }
    exports.getConverter = getConverter;
    function registerSvc(root, name, obj) {
        var name2 = "svc." + name;
        registerObject(root, name2, obj);
    }
    exports.registerSvc = registerSvc;
    function unregisterSvc(root, name) {
        var name2 = "svc." + name;
        return unregisterObject(root, name2);
    }
    exports.unregisterSvc = unregisterSvc;
    function getSvc(root, name) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var name2 = "svc." + name, obj = getObject(root, name2);
        if (!obj) {
            return null;
        }
        var res = isFunc(obj) ? obj.apply(void 0, args) : obj;
        if (!res) {
            throw new Error("The factory for service: " + name + " have not returned the service");
        }
        return res;
    }
    exports.getSvc = getSvc;
    function getOptions(root, name) {
        var name2 = "opt." + name;
        return getObject(root, name2);
    }
    exports.getOptions = getOptions;
    function registerObject(root, name, obj) {
        setValue(root.getData(), name, obj, true);
    }
    exports.registerObject = registerObject;
    function unregisterObject(root, name) {
        return removeValue(root.getData(), name);
    }
    exports.unregisterObject = unregisterObject;
    function getObject(root, name) {
        return getValue(root.getData(), name);
    }
    exports.getObject = getObject;
    function registerOptions(root, name, options) {
        var name2 = "opt." + name;
        registerObject(root, name2, options);
    }
    function getRequiredModules(el) {
        var elements = fromList(el.children), result = [];
        for (var i = 0, len = elements.length; i < len; i += 1) {
            var attr = elements[i].getAttribute("data-require");
            if (!!attr) {
                if (isGetExpr(attr)) {
                    var ids = getBraceContent(attr, 0);
                    var parts = getGetParts(ids);
                    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                        var val = parts_1[_i];
                        if (!!val) {
                            result.push.apply(result, val.split(","));
                        }
                    }
                }
                else {
                    result.push.apply(result, attr.split(","));
                }
            }
        }
        if (result.length === 0) {
            return result;
        }
        var hashMap = Indexer();
        for (var _a = 0, result_1 = result; _a < result_1.length; _a++) {
            var name_2 = result_1[_a];
            if (!!name_2) {
                var _name = fastTrim(name_2);
                if (!!_name) {
                    hashMap[_name] = _name;
                }
            }
        }
        return Object.keys(hashMap);
    }
    var Bootstrapper = (function (_super) {
        __extends(Bootstrapper, _super);
        function Bootstrapper() {
            var _this = _super.call(this) || this;
            var self = _this;
            if (!!exports.bootstrapper) {
                throw new Error(ERRS.ERR_GLOBAL_SINGLTON);
            }
            _this._bootState = 0;
            _this._app = null;
            _this._selectedControl = null;
            _this._uniqueID = getNewID("app");
            _this._extraData = Indexer();
            _this._moduleInits = [];
            _this._templateLoader = null;
            _this._templateLoader = new tloader_1.TemplateLoader();
            _this._templateLoader.addOnLoaded(function (_, a) {
                self._onTemplateLoaded(a.html, a.owner);
            });
            _this._templateLoader.objEvents.addOnError(function (_, a) {
                return self.handleError(a.error, a.source);
            });
            _this._elViewRegister = elview_1.createElViewRegister(null);
            _this._contentFactory = content_1.createContentFactoryList();
            _this._internal = {
                initialize: function () {
                    return self._initialize();
                },
                registerApp: function (app) {
                    self._registerApp(app);
                },
                unregisterApp: function (app) {
                    self._unregisterApp(app);
                }
            };
            _this._defaults = new defaults_1.Defaults();
            _this.defaults.imagesPath = path_2.PathHelper.getFrameworkImgPath();
            _stylesLoader.loadOwnStyle();
            ERROR.addHandler("*", _this);
            return _this;
        }
        Bootstrapper._initFramework = function () {
            dom.ready(function () {
                exports.bootstrapper._getInternal().initialize();
            });
        };
        Bootstrapper.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            var self = this;
            self.objEvents.off();
            self._destroyApp();
            self._extraData = Indexer();
            if (self._templateLoader !== null) {
                self._templateLoader.dispose();
                self._templateLoader = null;
            }
            self._elViewRegister.dispose();
            self._elViewRegister = null;
            self._contentFactory = null;
            self._moduleInits = [];
            dom.events.offNS(doc, this._uniqueID);
            dom.events.offNS(win, this._uniqueID);
            win.onerror = null;
            ERROR.removeHandler("*");
            this._bootState = 5;
            _super.prototype.dispose.call(this);
        };
        Bootstrapper.prototype._bindGlobalEvents = function () {
            var _this = this;
            var self = this, subscribeMap = exports.subscribeWeakMap, selectableMap = exports.selectableProviderWeakMap;
            dom.events.on(doc, "click", function (e) {
                var target = e.target;
                while (!!target && target !== doc) {
                    var obj = selectableMap.get(target);
                    if (!!obj) {
                        self.selectedControl = obj;
                        return;
                    }
                    target = target.parentElement;
                }
                self.selectedControl = null;
            }, this._uniqueID);
            forEach(eventNames, (function (name, flag) {
                var fn_name = "handle_" + name;
                dom.events.on(doc, name, function (e) {
                    var obj = subscribeMap.get(e.target);
                    if (isFunc(obj[fn_name])) {
                        e.cancelBubble = !!(obj[fn_name](e.originalEvent));
                    }
                }, {
                    nmspace: _this._uniqueID,
                    matchElement: function (el) {
                        var obj = subscribeMap.get(el);
                        return !!obj && !!obj.isSubscribed(flag);
                    }
                });
            }));
            dom.events.on(doc, "keydown", function (e) {
                if (!!self._selectedControl) {
                    var selectable = self._selectedControl.selectable;
                    if (!!selectable) {
                        selectable.onKeyDown(e.which, e);
                    }
                }
            }, this._uniqueID);
            dom.events.on(doc, "keyup", function (e) {
                if (!!self._selectedControl) {
                    var selectable = self._selectedControl.selectable;
                    if (!!selectable) {
                        selectable.onKeyUp(e.which, e);
                    }
                }
            }, this._uniqueID);
            dom.events.on(win, "beforeunload", function () {
                self.objEvents.raise("unload", {});
            }, this._uniqueID);
            win.onerror = function (msg, url, linenumber) {
                if (!!msg && msg.toString().indexOf(jriapp_shared_11.DUMY_ERROR) > -1) {
                    return true;
                }
                alert("Error: " + msg + "\nURL: " + url + "\nLine Number: " + linenumber);
                return false;
            };
        };
        Bootstrapper.prototype._onTemplateLoaded = function (html, owner) {
            var divEl = doc.createElement("div");
            divEl.innerHTML = html;
            this._processOptions(owner, divEl);
            this._processTemplates(owner, divEl);
        };
        Bootstrapper.prototype._processOptions = function (owner, root) {
            var jsons = dom.queryAll(root, _OPTION_SELECTOR);
            for (var _i = 0, jsons_1 = jsons; _i < jsons_1.length; _i++) {
                var el = jsons_1[_i];
                var name_3 = el.getAttribute("id");
                if (!name_3) {
                    throw new Error(ERRS.ERR_OPTIONS_HAS_NO_ID);
                }
                registerOptions(owner, name_3, el.innerHTML);
            }
        };
        Bootstrapper.prototype._processTemplates = function (owner, root) {
            var self = this, templates = dom.queryAll(root, _TEMPLATE_SELECTOR);
            for (var _i = 0, templates_1 = templates; _i < templates_1.length; _i++) {
                var el = templates_1[_i];
                var name_4 = el.getAttribute("id");
                if (!name_4) {
                    throw new Error(ERRS.ERR_TEMPLATE_HAS_NO_ID);
                }
                var html = el.innerHTML;
                self._processTemplate(owner, name_4, html);
            }
        };
        Bootstrapper.prototype._processTemplate = function (owner, name, html) {
            var frag = dom.getDocFragment(fastTrim(html)), required = getRequiredModules(frag);
            var res = resolve({ doc: frag, required: required }, true), loader = function () { return res; };
            tloader_1.registerLoader(owner, name, loader);
        };
        Bootstrapper.prototype._createObjEvents = function () {
            return new _ObjectEvents(this);
        };
        Bootstrapper.prototype._init = function () {
            var self = this;
            var promise = self.stylesLoader.whenAllLoaded().then(function () {
                if (self._bootState !== 0) {
                    throw new Error("Invalid operation: bootState !== BootstrapState.None");
                }
                self._bootState = 1;
                self._bindGlobalEvents();
                self._bootState = 2;
                self.objEvents.raise("initialize", {});
                self.objEvents.off("initialize");
                return delay(function () {
                    if (self.getIsStateDirty()) {
                        throw new Error("Bootstrap is in destroyed state");
                    }
                    self._processOptions(self, doc);
                    self._processTemplates(self, doc);
                    self._bootState = 3;
                    self.objEvents.raiseProp("isReady");
                    return self;
                });
            });
            var res = promise.then(function (boot) {
                if (boot._bootState !== 3) {
                    throw new Error("Invalid operation: bootState !== BootstrapState.Ready");
                }
                boot.objEvents.raise("load", {});
                boot.objEvents.off("load");
                return boot;
            });
            return res;
        };
        Bootstrapper.prototype._initialize = function () {
            var _this = this;
            var self = this;
            return self._init().then(function (_) {
                return self;
            }, function (err) {
                self._bootState = 4;
                return ERROR.reThrow(err, _this.handleError(err, self));
            });
        };
        Bootstrapper.prototype._registerApp = function (app) {
            if (!!this._app) {
                throw new Error("Application already registered");
            }
            this._app = app;
            ERROR.addHandler(app.appName, app);
        };
        Bootstrapper.prototype._unregisterApp = function (app) {
            if (!this._app || this._app.appName !== app.appName) {
                throw new Error("Invalid operation");
            }
            try {
                ERROR.removeHandler(app.appName);
            }
            finally {
                this._app = null;
            }
        };
        Bootstrapper.prototype._destroyApp = function () {
            var self = this, app = self._app;
            if (!!app && !app.getIsStateDirty()) {
                app.dispose();
            }
        };
        Bootstrapper.prototype._waitLoaded = function (onLoad) {
            var self = this;
            self.init(function () {
                self.addOnLoad(function () {
                    setTimeout(function () {
                        try {
                            onLoad(self);
                        }
                        catch (err) {
                            ERROR.reThrow(err, self.handleError(err, self));
                        }
                    }, 0);
                });
            });
        };
        Bootstrapper.prototype._getInternal = function () {
            return this._internal;
        };
        Bootstrapper.prototype.addOnDisposed = function (handler, nmspace, context) {
            this.objEvents.addOnDisposed(handler, nmspace, context);
        };
        Bootstrapper.prototype.offOnDisposed = function (nmspace) {
            this.objEvents.offOnDisposed(nmspace);
        };
        Bootstrapper.prototype.addOnError = function (handler, nmspace, context) {
            this.objEvents.addOnError(handler, nmspace, context);
        };
        Bootstrapper.prototype.offOnError = function (nmspace) {
            this.objEvents.offOnError(nmspace);
        };
        Bootstrapper.prototype.addOnLoad = function (fn, nmspace, context) {
            this.objEvents.on("load", fn, nmspace, context);
        };
        Bootstrapper.prototype.addOnUnLoad = function (fn, nmspace, context) {
            this.objEvents.on("unload", fn, nmspace, context);
        };
        Bootstrapper.prototype.addOnInitialize = function (fn, nmspace, context) {
            this.objEvents.on("initialize", fn, nmspace, context);
        };
        Bootstrapper.prototype.addModuleInit = function (fn) {
            if (this._moduleInits.filter(function (val) { return val === fn; }).length === 0) {
                this._moduleInits.push(fn);
                return true;
            }
            return false;
        };
        Bootstrapper.prototype.getData = function () {
            return this._extraData;
        };
        Bootstrapper.prototype.init = function (onInit) {
            var self = this;
            self.addOnInitialize(function () {
                setTimeout(function () {
                    try {
                        onInit(self);
                    }
                    catch (err) {
                        ERROR.reThrow(err, self.handleError(err, self));
                    }
                }, 0);
            });
        };
        Bootstrapper.prototype.startApp = function (appFactory, onStartUp) {
            var self = this, deferred = createDeferred(), promise = deferred.promise();
            self._waitLoaded(function () {
                try {
                    var app = appFactory();
                    deferred.resolve(app.startUp(onStartUp));
                }
                catch (err) {
                    deferred.reject(err);
                }
            });
            var res = promise.then(function (app) {
                return app;
            }, function (err) {
                return ERROR.reThrow(err, self.handleError(err, self));
            });
            return res;
        };
        Bootstrapper.prototype.registerSvc = function (name, obj) {
            registerSvc(this, name, obj);
        };
        Bootstrapper.prototype.unregisterSvc = function (name) {
            unregisterSvc(this, name);
        };
        Bootstrapper.prototype.getSvc = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var obj = getSvc.apply(void 0, __spreadArray([this, name], args));
            if (!obj) {
                throw new Error("The service: " + name + " is not registered");
            }
            return obj;
        };
        Bootstrapper.prototype.getOptions = function (name) {
            var res = getOptions(this, name);
            if (!res) {
                throw new Error(format(ERRS.ERR_OPTIONS_NOTREGISTERED, name));
            }
            return res;
        };
        Bootstrapper.prototype.registerConverter = function (name, obj) {
            registerConverter(this, name, obj);
        };
        Bootstrapper.prototype.registerElView = function (name, elViewType) {
            this._elViewRegister.registerElView(name, elViewType);
        };
        Bootstrapper.prototype.getImagePath = function (imageName) {
            var images = this.defaults.imagesPath;
            return images + imageName;
        };
        Bootstrapper.prototype.loadOwnStyle = function (name) {
            return this.stylesLoader.loadOwnStyle(name);
        };
        Bootstrapper.prototype.toString = function () {
            return "JRIApp Bootstrap";
        };
        Object.defineProperty(Bootstrapper.prototype, "app", {
            get: function () {
                return this._app;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bootstrapper.prototype, "stylesLoader", {
            get: function () {
                return _stylesLoader;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bootstrapper.prototype, "elViewRegister", {
            get: function () {
                return this._elViewRegister;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bootstrapper.prototype, "contentFactory", {
            get: function () {
                return this._contentFactory;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bootstrapper.prototype, "templateLoader", {
            get: function () {
                return this._templateLoader;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bootstrapper.prototype, "selectedControl", {
            get: function () {
                return this._selectedControl;
            },
            set: function (v) {
                if (this._selectedControl !== v) {
                    this._selectedControl = v;
                    this.objEvents.raiseProp("selectedControl");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bootstrapper.prototype, "defaults", {
            get: function () {
                return this._defaults;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bootstrapper.prototype, "isReady", {
            get: function () {
                return this._bootState === 3;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bootstrapper.prototype, "state", {
            get: function () {
                return this._bootState;
            },
            enumerable: false,
            configurable: true
        });
        return Bootstrapper;
    }(jriapp_shared_11.BaseObject));
    exports.Bootstrapper = Bootstrapper;
    exports.bootstrapper = new Bootstrapper();
});
define("jriapp/utils/viewchecks", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewChecks = void 0;
    function dummyIsElView(_obj) {
        return false;
    }
    function dummyIsTemplateElView(_obj) {
        return false;
    }
    var ViewChecks = (function () {
        function ViewChecks() {
        }
        ViewChecks.isElView = dummyIsElView;
        ViewChecks.isTemplateElView = dummyIsTemplateElView;
        ViewChecks.isDataForm = function () { return false; };
        ViewChecks.isInsideDataForm = function () { return false; };
        ViewChecks.isInNestedForm = function () { return false; };
        ViewChecks.getParentDataForm = function () { return null; };
        return ViewChecks;
    }());
    exports.ViewChecks = ViewChecks;
});
define("jriapp/converter", ["require", "exports", "jriapp_shared", "jriapp/bootstrapper"], function (require, exports, jriapp_shared_12, bootstrapper_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NotConverter = exports.FloatConverter = exports.DecimalConverter = exports.SmallIntConverter = exports.IntegerConverter = exports.NumberConverter = exports.DateTimeConverter = exports.DateConverter = exports.baseConverter = exports.BaseConverter = exports.NUM_CONV = void 0;
    var utils = jriapp_shared_12.Utils, _a = utils.check, isNt = _a.isNt, isNumber = _a.isNumber, _b = utils.str, format = _b.format, stripNonNumeric = _b.stripNonNumeric, formatNumber = _b.formatNumber, round = utils.core.round, _c = utils.dates, strToDate = _c.strToDate, dateToStr = _c.dateToStr, boot = bootstrapper_3.bootstrapper, ERRS = jriapp_shared_12.LocaleERRS;
    exports.NUM_CONV = { None: 0, Integer: 1, Decimal: 2, Float: 3, SmallInt: 4 };
    var BaseConverter = (function () {
        function BaseConverter() {
        }
        BaseConverter.prototype.convertToSource = function (val, _param, _dataContext) {
            return val;
        };
        BaseConverter.prototype.convertToTarget = function (val, _param, _dataContext) {
            return (isNt(val)) ? null : val;
        };
        return BaseConverter;
    }());
    exports.BaseConverter = BaseConverter;
    exports.baseConverter = new BaseConverter();
    var DateConverter = (function () {
        function DateConverter() {
        }
        DateConverter.prototype.convertToSource = function (val, _param, dataContext) {
            if (!val) {
                return null;
            }
            var defaults = boot.defaults, datepicker = boot.getSvc("IDatepicker");
            return (!!datepicker) ? datepicker.parseDate(val) : dateTimeConverter.convertToSource(val, defaults.dateFormat, dataContext);
        };
        DateConverter.prototype.convertToTarget = function (val, _param, dataContext) {
            if (isNt(val)) {
                return "";
            }
            var defaults = boot.defaults, datepicker = boot.getSvc("IDatepicker");
            return (!!datepicker) ? datepicker.formatDate(val) : dateTimeConverter.convertToTarget(val, defaults.dateFormat, dataContext);
        };
        DateConverter.prototype.toString = function () {
            return "DateConverter";
        };
        return DateConverter;
    }());
    exports.DateConverter = DateConverter;
    var dateConverter = new DateConverter();
    var DateTimeConverter = (function () {
        function DateTimeConverter() {
        }
        DateTimeConverter.prototype.convertToSource = function (val, param, _dataContext) {
            return strToDate(val, param);
        };
        DateTimeConverter.prototype.convertToTarget = function (val, param, _dataContext) {
            return dateToStr(val, param);
        };
        DateTimeConverter.prototype.toString = function () {
            return "DateTimeConverter";
        };
        return DateTimeConverter;
    }());
    exports.DateTimeConverter = DateTimeConverter;
    var dateTimeConverter = new DateTimeConverter();
    var NumberConverter = (function () {
        function NumberConverter() {
        }
        NumberConverter.prototype.convertToSource = function (val, param, _dataContext) {
            if (isNt(val)) {
                return null;
            }
            var defaults = bootstrapper_3.bootstrapper.defaults, dp = defaults.decimalPoint, thousandSep = defaults.thousandSep;
            var prec = 4;
            var value = val.replace(thousandSep, "");
            value = value.replace(dp, ".");
            value = stripNonNumeric(value);
            if (value === "") {
                return null;
            }
            var num = null;
            switch (param) {
                case exports.NUM_CONV.SmallInt:
                    num = parseInt(value, 10);
                    break;
                case exports.NUM_CONV.Integer:
                    num = parseInt(value, 10);
                    break;
                case exports.NUM_CONV.Decimal:
                    prec = defaults.decPrecision;
                    num = round(parseFloat(value), prec);
                    break;
                case exports.NUM_CONV.Float:
                    num = parseFloat(value);
                    break;
                default:
                    num = Number(value);
                    break;
            }
            if (!isNumber(num)) {
                throw new Error(format(ERRS.ERR_CONV_INVALID_NUM, val));
            }
            return num;
        };
        NumberConverter.prototype.convertToTarget = function (val, param, _dataContext) {
            if (isNt(val)) {
                return "";
            }
            var defaults = bootstrapper_3.bootstrapper.defaults, dp = defaults.decimalPoint, thousandSep = defaults.thousandSep;
            var prec;
            switch (param) {
                case exports.NUM_CONV.Integer:
                    prec = 0;
                    return formatNumber(val, prec, dp, thousandSep);
                case exports.NUM_CONV.Decimal:
                    prec = defaults.decPrecision;
                    return formatNumber(val, prec, dp, thousandSep);
                case exports.NUM_CONV.SmallInt:
                    prec = 0;
                    return formatNumber(val, prec, dp, "");
                case exports.NUM_CONV.Float:
                    return formatNumber(val, null, dp, thousandSep);
                default:
                    return formatNumber(val, null, dp, thousandSep);
            }
        };
        NumberConverter.prototype.toString = function () {
            return "NumberConverter";
        };
        return NumberConverter;
    }());
    exports.NumberConverter = NumberConverter;
    var numberConverter = new NumberConverter();
    var IntegerConverter = (function () {
        function IntegerConverter() {
        }
        IntegerConverter.prototype.convertToSource = function (val, _param, dataContext) {
            return numberConverter.convertToSource(val, exports.NUM_CONV.Integer, dataContext);
        };
        IntegerConverter.prototype.convertToTarget = function (val, _param, dataContext) {
            return numberConverter.convertToTarget(val, exports.NUM_CONV.Integer, dataContext);
        };
        IntegerConverter.prototype.toString = function () {
            return "IntegerConverter";
        };
        return IntegerConverter;
    }());
    exports.IntegerConverter = IntegerConverter;
    var integerConverter = new IntegerConverter();
    var SmallIntConverter = (function () {
        function SmallIntConverter() {
        }
        SmallIntConverter.prototype.convertToSource = function (val, _param, dataContext) {
            return numberConverter.convertToSource(val, exports.NUM_CONV.SmallInt, dataContext);
        };
        SmallIntConverter.prototype.convertToTarget = function (val, _param, dataContext) {
            return numberConverter.convertToTarget(val, exports.NUM_CONV.SmallInt, dataContext);
        };
        SmallIntConverter.prototype.toString = function () {
            return "SmallIntConverter";
        };
        return SmallIntConverter;
    }());
    exports.SmallIntConverter = SmallIntConverter;
    var smallIntConverter = new SmallIntConverter();
    var DecimalConverter = (function () {
        function DecimalConverter() {
        }
        DecimalConverter.prototype.convertToSource = function (val, _param, dataContext) {
            return numberConverter.convertToSource(val, exports.NUM_CONV.Decimal, dataContext);
        };
        DecimalConverter.prototype.convertToTarget = function (val, _param, dataContext) {
            return numberConverter.convertToTarget(val, exports.NUM_CONV.Decimal, dataContext);
        };
        DecimalConverter.prototype.toString = function () {
            return "DecimalConverter";
        };
        return DecimalConverter;
    }());
    exports.DecimalConverter = DecimalConverter;
    var decimalConverter = new DecimalConverter();
    var FloatConverter = (function () {
        function FloatConverter() {
        }
        FloatConverter.prototype.convertToSource = function (val, _param, dataContext) {
            return numberConverter.convertToSource(val, exports.NUM_CONV.Float, dataContext);
        };
        FloatConverter.prototype.convertToTarget = function (val, _param, dataContext) {
            return numberConverter.convertToTarget(val, exports.NUM_CONV.Float, dataContext);
        };
        FloatConverter.prototype.toString = function () {
            return "FloatConverter";
        };
        return FloatConverter;
    }());
    exports.FloatConverter = FloatConverter;
    var floatConverter = new FloatConverter();
    var NotConverter = (function () {
        function NotConverter() {
        }
        NotConverter.prototype.convertToSource = function (val, _param, _dataContext) {
            return !val;
        };
        NotConverter.prototype.convertToTarget = function (val, _param, _dataContext) {
            return !val;
        };
        return NotConverter;
    }());
    exports.NotConverter = NotConverter;
    var notConverter = new NotConverter();
    boot.registerConverter("BaseConverter", exports.baseConverter);
    boot.registerConverter("dateConverter", dateConverter);
    boot.registerConverter("dateTimeConverter", dateTimeConverter);
    boot.registerConverter("numberConverter", numberConverter);
    boot.registerConverter("integerConverter", integerConverter);
    boot.registerConverter("smallIntConverter", smallIntConverter);
    boot.registerConverter("decimalConverter", decimalConverter);
    boot.registerConverter("floatConverter", floatConverter);
    boot.registerConverter("notConverter", notConverter);
});
define("jriapp/binding", ["require", "exports", "jriapp_shared", "jriapp/bootstrapper"], function (require, exports, jriapp_shared_13, bootstrapper_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Binding = exports.getBindingOptions = void 0;
    var utils = jriapp_shared_13.Utils, _a = utils.check, isString = _a.isString, isUndefined = _a.isUndefined, isNt = _a.isNt, _undefined = _a._undefined, isHasProp = _a.isHasProp, format = utils.str.format, _b = utils.core, getNewID = _b.getNewID, forEach = _b.forEach, Indexer = _b.Indexer, sys = utils.sys, debug = utils.debug, log = utils.log, ERRS = jriapp_shared_13.LocaleERRS;
    var resolvePath = sys.resolvePath, getPathParts = sys.getPathParts, getErrorNotification = sys.getErrorNotification, getProp = sys.getProp, setProp = sys.setProp, boot = bootstrapper_4.bootstrapper;
    sys.isBinding = function (obj) {
        return (!!obj && obj instanceof Binding);
    };
    var bindModeMap = {
        OneTime: 0,
        OneWay: 1,
        TwoWay: 2,
        BackWay: 3
    };
    function fn_reportUnResolved(bindTo, root, path, propName) {
        if (!debug.isDebugging()) {
            return;
        }
        debug.checkStartDebugger();
        var msg = "Unresolved data binding for ";
        if (bindTo === 0) {
            msg += " Source: ";
        }
        else {
            msg += " Target: ";
        }
        msg += "'" + root + "'";
        msg += ", property: '" + propName + "'";
        msg += ", binding path: '" + path + "'";
        log.error(msg);
    }
    function fn_reportMaxRec(bindTo, src, tgt, spath, tpath) {
        if (!debug.isDebugging()) {
            return;
        }
        debug.checkStartDebugger();
        var msg = "Maximum recursion exceeded for ";
        if (bindTo === 0) {
            msg += "Updating Source value: ";
        }
        else {
            msg += "Updating Target value: ";
        }
        msg += " source:'" + src + "'";
        msg += ", target:'" + tgt + "'";
        msg += ", source path: '" + spath + "'";
        msg += ", target path: '" + tpath + "'";
        log.error(msg);
    }
    function getBindingOptions(bindInfo, defTarget, dataContext) {
        var bindingOpts = {
            targetPath: null,
            sourcePath: null,
            target: null,
            source: null,
            isSourceFixed: false,
            mode: 1,
            converter: null,
            param: null,
            isBind: false
        };
        var app = boot.app;
        var converter;
        if (isString(bindInfo.converter)) {
            converter = app.getConverter(bindInfo.converter);
        }
        else {
            converter = bindInfo.converter;
        }
        var fixedSource = bindInfo.source, fixedTarget = bindInfo.target;
        if (!bindInfo.sourcePath && !!bindInfo.to) {
            bindingOpts.sourcePath = bindInfo.to;
        }
        else if (!!bindInfo.sourcePath) {
            bindingOpts.sourcePath = bindInfo.sourcePath;
        }
        if (!!bindInfo.targetPath) {
            bindingOpts.targetPath = bindInfo.targetPath;
        }
        if (!!bindInfo.param) {
            bindingOpts.param = bindInfo.param;
            bindingOpts.isBind = bindInfo.isBind;
        }
        if (!!bindInfo.mode) {
            bindingOpts.mode = bindModeMap[bindInfo.mode];
        }
        if (!!converter) {
            bindingOpts.converter = converter;
        }
        if (!fixedTarget) {
            bindingOpts.target = defTarget;
        }
        else {
            if (isString(fixedTarget)) {
                if (fixedTarget === "this") {
                    bindingOpts.target = defTarget;
                }
                else {
                    bindingOpts.target = resolvePath(app, fixedTarget);
                }
            }
            else {
                bindingOpts.target = fixedTarget;
            }
        }
        if (!fixedSource) {
            bindingOpts.source = dataContext;
        }
        else {
            bindingOpts.isSourceFixed = true;
            if (isString(fixedSource)) {
                if (fixedSource === "this") {
                    bindingOpts.source = defTarget;
                }
                else {
                    bindingOpts.source = resolvePath(app, fixedSource);
                }
            }
            else {
                bindingOpts.source = fixedSource;
            }
        }
        return bindingOpts;
    }
    exports.getBindingOptions = getBindingOptions;
    var Binding = (function (_super) {
        __extends(Binding, _super);
        function Binding(options) {
            var _this = _super.call(this) || this;
            if (isString(options.mode)) {
                options.mode = bindModeMap[options.mode];
            }
            if (!isString(options.targetPath)) {
                debug.checkStartDebugger();
                throw new Error(format(ERRS.ERR_BIND_TGTPATH_INVALID, options.targetPath));
            }
            if (isNt(options.mode)) {
                debug.checkStartDebugger();
                throw new Error(format(ERRS.ERR_BIND_MODE_INVALID, options.mode));
            }
            if (!options.target) {
                throw new Error(ERRS.ERR_BIND_TARGET_EMPTY);
            }
            if (!sys.isBaseObj(options.target)) {
                throw new Error(ERRS.ERR_BIND_TARGET_INVALID);
            }
            _this._state = null;
            _this._mode = options.mode;
            _this._converter = !options.converter ? null : options.converter;
            _this._param = options.param;
            _this._isBindParam = !!options.isBind;
            _this._srcPath = getPathParts(options.sourcePath);
            _this._tgtPath = getPathParts(options.targetPath);
            if (_this._tgtPath.length < 1) {
                throw new Error(format(ERRS.ERR_BIND_TGTPATH_INVALID, options.targetPath));
            }
            _this._srcFixed = (!!options.isSourceFixed);
            _this._pathItems = Indexer();
            _this._uniqueID = getNewID("bnd");
            _this._srcEnd = null;
            _this._tgtEnd = null;
            _this._source = null;
            _this._target = null;
            _this._umask = 0;
            _this._cntUtgt = 0;
            _this._cntUSrc = 0;
            _this._setTarget(options.target);
            _this._setSource(options.source);
            _this._update();
            var errNotif = getErrorNotification(_this._srcEnd);
            if (!!errNotif && errNotif.getIsHasErrors()) {
                _this._onSrcErrChanged(errNotif);
            }
            return _this;
        }
        Binding.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            var self = this;
            forEach(this._pathItems, function (_key, old) {
                self._cleanUp(old);
            });
            this._pathItems = Indexer();
            this._setSource(null);
            this._setTarget(null);
            this._state = null;
            this._converter = null;
            this._param = null;
            this._srcPath = null;
            this._tgtPath = null;
            this._srcEnd = null;
            this._tgtEnd = null;
            this._source = null;
            this._target = null;
            this._umask = 0;
            _super.prototype.dispose.call(this);
        };
        Binding.prototype._update = function () {
            var umask = this._umask, MAX_REC = 3;
            var flag = 0;
            this._umask = 0;
            if (this._mode === 3) {
                if (!!(umask & 1)) {
                    flag = 1;
                }
            }
            else {
                if (!!(umask & 2)) {
                    flag = 2;
                }
                else if (!!(umask & 1) && (this._mode === 2)) {
                    flag = 1;
                }
            }
            switch (flag) {
                case 1:
                    if (this._cntUtgt === 0) {
                        if (this._cntUSrc < MAX_REC) {
                            this._cntUSrc += 1;
                            try {
                                this.updateSource();
                            }
                            finally {
                                this._cntUSrc -= 1;
                            }
                        }
                        else {
                            fn_reportMaxRec(0, this._source, this._target, this._srcPath.join("."), this._tgtPath.join("."));
                        }
                    }
                    break;
                case 2:
                    if (this._cntUSrc === 0) {
                        if (this._cntUtgt < MAX_REC) {
                            this._cntUtgt += 1;
                            try {
                                this.updateTarget();
                            }
                            finally {
                                this._cntUtgt -= 1;
                            }
                        }
                        else {
                            fn_reportMaxRec(1, this._source, this._target, this._srcPath.join("."), this._tgtPath.join("."));
                        }
                    }
                    break;
            }
        };
        Binding.prototype._onSrcErrChanged = function (errNotif) {
            var errors = [];
            var tgt = this._tgtEnd, src = this._srcEnd, srcPath = this._srcPath;
            if (sys.isValidatable(tgt)) {
                if (!!src && srcPath.length > 0) {
                    var prop = srcPath[srcPath.length - 1];
                    errors = errNotif.getFieldErrors(prop);
                }
                tgt.validationErrors = errors;
            }
        };
        Binding.prototype._getTgtChangedFn = function (self, obj, prop, restPath, lvl) {
            return function () {
                var val = getProp(obj, prop);
                if (restPath.length > 0) {
                    self._setPathItem(null, 1, lvl, restPath);
                }
                self._parseTgt(val, restPath, lvl);
                self._update();
            };
        };
        Binding.prototype._getSrcChangedFn = function (self, obj, prop, restPath, lvl) {
            return function () {
                var val = getProp(obj, prop);
                if (restPath.length > 0) {
                    self._setPathItem(null, 0, lvl, restPath);
                }
                self._parseSrc(val, restPath, lvl);
                self._update();
            };
        };
        Binding.prototype._addOnPropChanged = function (obj, prop, fn) {
            obj.objEvents.onProp(prop, fn, this._uniqueID);
            if (prop !== "[*]" && sys.isPropBag(obj)) {
                obj.objEvents.onProp("[*]", fn, this._uniqueID);
            }
        };
        Binding.prototype._parseSrc = function (obj, path, lvl) {
            var self = this;
            self._srcEnd = null;
            if (sys.isBaseObj(obj) && obj.getIsStateDirty()) {
                return;
            }
            if (path.length === 0) {
                self._srcEnd = obj;
            }
            else {
                self._parseSrc2(obj, path, lvl);
            }
            if (self._mode === 3) {
                if (!!self._srcEnd) {
                    self._umask |= 1;
                }
            }
            else {
                if (!!self._tgtEnd) {
                    self._umask |= 2;
                }
            }
        };
        Binding.prototype._parseSrc2 = function (obj, path, lvl) {
            var self = this, isBaseObj = sys.isBaseObj(obj);
            if (isBaseObj) {
                if (obj.getIsStateDirty()) {
                    return;
                }
                self._setPathItem(obj, 0, lvl, path);
            }
            if (path.length > 1) {
                if (isBaseObj) {
                    var fnChange = self._getSrcChangedFn(self, obj, path[0], path.slice(1), lvl + 1);
                    self._addOnPropChanged(obj, path[0], fnChange);
                }
                if (!!obj) {
                    var nextObj = getProp(obj, path[0]);
                    if (!!nextObj) {
                        self._parseSrc2(nextObj, path.slice(1), lvl + 1);
                    }
                    else if (isUndefined(nextObj)) {
                        fn_reportUnResolved(0, self.source, self._srcPath.join("."), path[0]);
                    }
                }
                return;
            }
            if (!!obj && path.length === 1) {
                var isValidProp = (!debug.isDebugging() ? true : (isBaseObj ? obj.isHasProp(path[0]) : isHasProp(obj, path[0])));
                if (isValidProp) {
                    var updateOnChange = isBaseObj && (self._mode === 1 || self._mode === 2);
                    if (updateOnChange) {
                        var fnUpd = function () {
                            if (!!self._tgtEnd) {
                                self._umask |= 2;
                                self._update();
                            }
                        };
                        self._addOnPropChanged(obj, path[0], fnUpd);
                    }
                    var errNotif = getErrorNotification(obj);
                    if (!!errNotif) {
                        errNotif.addOnErrorsChanged(self._onSrcErrChanged, self._uniqueID, self);
                    }
                    self._srcEnd = obj;
                }
                else {
                    fn_reportUnResolved(0, self.source, self._srcPath.join("."), path[0]);
                }
            }
        };
        Binding.prototype._parseTgt = function (obj, path, lvl) {
            var self = this;
            self._tgtEnd = null;
            if (sys.isBaseObj(obj) && obj.getIsStateDirty()) {
                return;
            }
            if (path.length === 0) {
                self._tgtEnd = obj;
            }
            else {
                self._parseTgt2(obj, path, lvl);
            }
            if (self._mode === 3) {
                if (!!self._srcEnd) {
                    this._umask |= 1;
                }
            }
            else {
                if (!!self._tgtEnd) {
                    this._umask |= 2;
                }
            }
        };
        Binding.prototype._parseTgt2 = function (obj, path, lvl) {
            var self = this, isBaseObj = sys.isBaseObj(obj);
            if (isBaseObj) {
                if (obj.getIsStateDirty()) {
                    return;
                }
                self._setPathItem(obj, 1, lvl, path);
            }
            if (path.length > 1) {
                if (isBaseObj) {
                    var fnChange = self._getTgtChangedFn(self, obj, path[0], path.slice(1), lvl + 1);
                    self._addOnPropChanged(obj, path[0], fnChange);
                }
                if (!!obj) {
                    var nextObj = getProp(obj, path[0]);
                    if (!!nextObj) {
                        self._parseTgt2(nextObj, path.slice(1), lvl + 1);
                    }
                    else if (isUndefined(nextObj)) {
                        fn_reportUnResolved(1, self.target, self._tgtPath.join("."), path[0]);
                    }
                }
                return;
            }
            if (!!obj && path.length === 1) {
                var isValidProp = (!debug.isDebugging() ? true : (isBaseObj ? obj.isHasProp(path[0]) : isHasProp(obj, path[0])));
                if (isValidProp) {
                    var updateOnChange = isBaseObj && (self._mode === 2 || self._mode === 3);
                    if (updateOnChange) {
                        var fnUpd = function () {
                            if (!!self._srcEnd) {
                                self._umask |= 1;
                                self._update();
                            }
                        };
                        self._addOnPropChanged(obj, path[0], fnUpd);
                    }
                    self._tgtEnd = obj;
                }
                else {
                    fn_reportUnResolved(1, self.target, self._tgtPath.join("."), path[0]);
                }
            }
        };
        Binding.prototype._setPathItem = function (newObj, bindingTo, lvl, path) {
            var len = lvl + path.length;
            for (var i = lvl; i < len; i += 1) {
                var key = (bindingTo === 0) ? ("s" + i) : ((bindingTo === 1) ? ("t" + i) : null);
                if (!key) {
                    throw new Error(format(ERRS.ERR_PARAM_INVALID, "bindingTo", bindingTo));
                }
                var oldObj = this._pathItems[key];
                if (!!oldObj) {
                    this._cleanUp(oldObj);
                    delete this._pathItems[key];
                }
                if (!!newObj && i === lvl) {
                    this._pathItems[key] = newObj;
                }
            }
        };
        Binding.prototype._cleanUp = function (obj) {
            if (!!obj) {
                obj.objEvents.offNS(this._uniqueID);
                var errNotif = getErrorNotification(obj);
                if (!!errNotif) {
                    errNotif.offOnErrorsChanged(this._uniqueID);
                }
            }
        };
        Binding.prototype._setTarget = function (value) {
            if (!!this._state) {
                this._state.target = value;
                return false;
            }
            if (this._target !== value) {
                if (!!this._tgtEnd && !(this._mode === 3)) {
                    this._cntUtgt += 1;
                    try {
                        this.targetValue = null;
                    }
                    finally {
                        this._cntUtgt -= 1;
                        if (this._cntUtgt < 0) {
                            throw new Error("Invalid operation: this._cntUtgt = " + this._cntUtgt);
                        }
                    }
                }
                this._setPathItem(null, 1, 0, this._tgtPath);
                if (!!value && !sys.isBaseObj(value)) {
                    throw new Error(ERRS.ERR_BIND_TARGET_INVALID);
                }
                this._target = value;
                this._parseTgt(this._target, this._tgtPath, 0);
                if (!!this._target && !this._tgtEnd) {
                    throw new Error(format(ERRS.ERR_BIND_TGTPATH_INVALID, this._tgtPath.join(".")));
                }
                return true;
            }
            else {
                return false;
            }
        };
        Binding.prototype._setSource = function (value) {
            if (!!this._state) {
                this._state.source = value;
                return false;
            }
            if (this._source !== value) {
                if (!!this._srcEnd && (this._mode === 3)) {
                    this._cntUSrc += 1;
                    try {
                        this.sourceValue = null;
                    }
                    finally {
                        this._cntUSrc -= 1;
                        if (this._cntUSrc < 0) {
                            throw new Error("Invalid Operation: this._cntUSrc = " + this._cntUSrc);
                        }
                    }
                }
                this._setPathItem(null, 0, 0, this._srcPath);
                this._source = value;
                this._parseSrc(this._source, this._srcPath, 0);
                return true;
            }
            else {
                return false;
            }
        };
        Binding.prototype.updateTarget = function () {
            if (this.getIsStateDirty()) {
                return;
            }
            try {
                if (!this._converter) {
                    this.targetValue = this.sourceValue;
                }
                else {
                    this.targetValue = this._converter.convertToTarget(this.sourceValue, this.param, this.source);
                }
            }
            catch (ex) {
                utils.err.reThrow(ex, this.handleError(ex, this));
            }
        };
        Binding.prototype.updateSource = function () {
            if (this.getIsStateDirty()) {
                return;
            }
            try {
                if (!this._converter) {
                    this.sourceValue = this.targetValue;
                }
                else {
                    this.sourceValue = this._converter.convertToSource(this.targetValue, this.param, this.source);
                }
            }
            catch (ex) {
                if (!sys.isValidationError(ex) || !sys.isValidatable(this._tgtEnd)) {
                    utils.err.reThrow(ex, this.handleError(ex, this));
                }
            }
        };
        Binding.prototype.toString = function () {
            return "Binding";
        };
        Object.defineProperty(Binding.prototype, "uniqueID", {
            get: function () {
                return this._uniqueID;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "target", {
            get: function () {
                return this._target;
            },
            set: function (v) {
                if (this._setTarget(v)) {
                    this._update();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "source", {
            get: function () {
                return this._source;
            },
            set: function (v) {
                if (this._setSource(v)) {
                    this._update();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "targetPath", {
            get: function () {
                return this._tgtPath;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "sourcePath", {
            get: function () {
                return this._srcPath;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "sourceValue", {
            get: function () {
                var res = null;
                if (this._srcPath.length === 0) {
                    res = this._srcEnd;
                }
                else if (!!this._srcEnd) {
                    var prop = this._srcPath[this._srcPath.length - 1];
                    res = getProp(this._srcEnd, prop);
                }
                return res;
            },
            set: function (v) {
                if (this._srcPath.length === 0 || !this._srcEnd || v === _undefined) {
                    return;
                }
                var prop = this._srcPath[this._srcPath.length - 1];
                setProp(this._srcEnd, prop, v);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "targetValue", {
            get: function () {
                var res = null;
                if (this._tgtPath.length === 0) {
                    res = this._tgtEnd;
                }
                else if (!!this._tgtEnd) {
                    var prop = this._tgtPath[this._tgtPath.length - 1];
                    res = getProp(this._tgtEnd, prop);
                }
                return res;
            },
            set: function (v) {
                if (this._tgtPath.length === 0 || !this._tgtEnd || v === _undefined) {
                    return;
                }
                var prop = this._tgtPath[this._tgtPath.length - 1];
                setProp(this._tgtEnd, prop, v);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "isSourceFixed", {
            get: function () {
                return this._srcFixed;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "mode", {
            get: function () {
                return this._mode;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "converter", {
            get: function () {
                return this._converter;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "param", {
            get: function () {
                if (this._isBindParam) {
                    if (isNt(this._param)) {
                        return this._param;
                    }
                    var bindparts = this._param;
                    var source = this.source;
                    if (bindparts.length > 1) {
                        source = resolvePath(this.app, bindparts[1]);
                    }
                    return resolvePath(source, bindparts[0]);
                }
                else {
                    return this._param;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "isDisabled", {
            get: function () {
                return !!this._state;
            },
            set: function (v) {
                var s;
                v = !!v;
                if (this.isDisabled !== v) {
                    if (v) {
                        s = { source: this._source, target: this._target };
                        try {
                            this.target = null;
                            this.source = null;
                        }
                        finally {
                            this._state = s;
                        }
                    }
                    else {
                        s = this._state;
                        this._state = null;
                        this._setTarget(s.target);
                        this._setSource(s.source);
                        this._update();
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "app", {
            get: function () {
                return boot.app;
            },
            enumerable: false,
            configurable: true
        });
        return Binding;
    }(jriapp_shared_13.BaseObject));
    exports.Binding = Binding;
});
define("jriapp/template", ["require", "exports", "jriapp_shared", "jriapp/bootstrapper", "jriapp/utils/viewchecks", "jriapp/utils/dom"], function (require, exports, jriapp_shared_14, bootstrapper_5, viewchecks_1, dom_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createTemplate = exports.css = void 0;
    var utils = jriapp_shared_14.Utils, reject = utils.async.reject, dom = dom_4.DomUtils, viewChecks = viewchecks_1.ViewChecks, _a = utils.check, isFunc = _a.isFunc, isThenable = _a.isThenable, format = utils.str.format, arrHelper = utils.arr, sys = utils.sys, boot = bootstrapper_5.bootstrapper, ERRS = jriapp_shared_14.LocaleERRS, ERROR = utils.err, doc = dom.document;
    var css;
    (function (css) {
        css["templateContainer"] = "ria-template-container";
        css["templateError"] = "ria-template-error";
    })(css = exports.css || (exports.css = {}));
    function createTemplate(options) {
        return new Template(options);
    }
    exports.createTemplate = createTemplate;
    var Template = (function (_super) {
        __extends(Template, _super);
        function Template(options) {
            var _this = _super.call(this) || this;
            if (options.parentEl === null) {
                var parentEl = doc.createElement('div');
                dom.addClass([parentEl], "ria-template-container");
                _this._el = parentEl;
                _this._removeElOnDispose = true;
            }
            else {
                _this._el = options.parentEl;
                _this._removeElOnDispose = false;
            }
            _this._dataContext = options.dataContext;
            _this._templEvents = options.templEvents;
            _this._isLoaded = false;
            _this._lfTime = null;
            _this._templateID = null;
            _this._templElView = null;
            return _this;
        }
        Template.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this._unloadTemplate();
            if (!!this._el && this._removeElOnDispose) {
                dom.removeNode(this._el);
            }
            this._el = null;
            this._dataContext = null;
            this._templEvents = null;
            _super.prototype.dispose.call(this);
        };
        Template.prototype._getBindings = function () {
            return !this._lfTime ? [] : this._lfTime.findAll(sys.isBinding);
        };
        Template.prototype._getTemplateElView = function () {
            return !this._lfTime ? null : this._lfTime.findFirst(viewChecks.isTemplateElView);
        };
        Template.prototype._loadAsync = function (name) {
            var self = this, loader = this.app.getTemplateLoader(name);
            var promise;
            if (isFunc(loader) && isThenable(promise = loader())) {
                return promise;
            }
            else {
                return reject(new Error(format(ERRS.ERR_TEMPLATE_ID_INVALID, self.templateID)));
            }
        };
        Template.prototype._loadTemplate = function () {
            var self = this, id = self.templateID, templateEl = self.el;
            try {
                if (self._isLoaded) {
                    self._unloadTemplate();
                }
                if (!!id) {
                    return self._loadAsync(id).then(function (docInfo) {
                        return self._dataBind(templateEl, docInfo);
                    }).catch(function (err) {
                        if (!!err && !!err.message) {
                            throw err;
                        }
                        else {
                            throw new Error(format(ERRS.ERR_TEMPLATE_ID_INVALID, self.templateID));
                        }
                    });
                }
                else {
                    return reject(format(ERRS.ERR_TEMPLATE_ID_INVALID, self.templateID));
                }
            }
            catch (ex) {
                return reject(ex);
            }
        };
        Template.prototype._onLoading = function () {
            if (!!this._templEvents) {
                this._templEvents.templateLoading(this);
            }
        };
        Template.prototype._onLoaded = function (error) {
            this._templElView = this._getTemplateElView();
            if (!!this._templEvents) {
                this._templEvents.templateLoaded(this, error);
            }
            if (!!this._templElView) {
                this._templElView.templateLoaded(this, error);
            }
        };
        Template.prototype._unloadTemplate = function () {
            try {
                if (!!this._templEvents) {
                    this._templEvents.templateUnLoading(this);
                }
                if (!!this._templElView) {
                    this._templElView.templateUnLoading(this);
                }
            }
            finally {
                this._cleanUp();
            }
        };
        Template.prototype._dataBind = function (el, docInfo) {
            var self = this;
            if (self.getIsStateDirty()) {
                ERROR.abort();
            }
            if (self._isLoaded) {
                self._unloadTemplate();
            }
            if (!docInfo) {
                throw new Error(format(ERRS.ERR_TEMPLATE_ID_INVALID, self.templateID));
            }
            el.appendChild(docInfo.doc.cloneNode(true));
            self._isLoaded = true;
            dom.removeClass([el], "ria-template-error");
            self._onLoading();
            var promise = self.app._getInternal().bindTemplate(el, this.dataContext, docInfo.required);
            return promise.then(function (lftm) {
                if (self.getIsStateDirty()) {
                    lftm.dispose();
                    ERROR.abort();
                }
                if (!!docInfo.required) {
                    docInfo.required = null;
                }
                self._lfTime = lftm;
                self._updateBindingSource();
                self._onLoaded(null);
                return el;
            });
        };
        Template.prototype._onFail = function (templateEl, err) {
            var self = this;
            if (self.getIsStateDirty()) {
                return;
            }
            self._onLoaded(err);
            if (ERROR.checkIsAbort(err)) {
                return;
            }
            dom.setClass([templateEl], "ria-template-error", false);
            var ex;
            if (!!err) {
                if (!!err.message) {
                    ex = err;
                }
                else if (!!err.statusText) {
                    ex = new Error(err.statusText);
                }
                else {
                    ex = new Error("error: " + err);
                }
            }
            if (!ex) {
                ex = new Error(format(ERRS.ERR_TEMPLATE_ID_INVALID, self.templateID));
            }
            self.handleError(ex, self);
        };
        Template.prototype._updateBindingSource = function () {
            var bindings = this._getBindings(), len = bindings.length;
            for (var i = 0; i < len; i += 1) {
                var binding = bindings[i];
                if (!binding.isSourceFixed) {
                    binding.source = this.dataContext;
                }
            }
        };
        Template.prototype._cleanUp = function () {
            if (!!this._lfTime) {
                this._lfTime.dispose();
                this._lfTime = null;
            }
            this._templElView = null;
            if (this._isLoaded) {
                this.el.innerHTML = "";
                this._isLoaded = false;
            }
        };
        Template.prototype.findElByDataName = function (name) {
            return arrHelper.fromList(this._el.querySelectorAll(["*[", "data-name", '="', name, '"]'].join("")));
        };
        Template.prototype.findElViewsByDataName = function (name) {
            var els = this.findElByDataName(name), res = [], viewStore = boot.app.viewFactory.store;
            for (var _i = 0, els_1 = els; _i < els_1.length; _i++) {
                var el = els_1[_i];
                var elView = viewStore.getElView(el);
                if (!!elView) {
                    res.push(elView);
                }
            }
            return res;
        };
        Template.prototype.toString = function () {
            return "ITemplate";
        };
        Object.defineProperty(Template.prototype, "isLoaded", {
            get: function () {
                return this._isLoaded;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Template.prototype, "dataContext", {
            get: function () {
                return this._dataContext;
            },
            set: function (v) {
                if (this._dataContext !== v) {
                    this._dataContext = v;
                    this._updateBindingSource();
                    this.objEvents.raiseProp("dataContext");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Template.prototype, "templateID", {
            get: function () {
                return this._templateID;
            },
            set: function (v) {
                var _this = this;
                if (this._templateID !== v) {
                    this._templateID = v;
                    var el_1 = this.el;
                    this._loadTemplate().catch(function (err) {
                        if (_this.getIsStateDirty()) {
                            return;
                        }
                        _this._onFail(el_1, err);
                    });
                    this.objEvents.raiseProp("templateID");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Template.prototype, "el", {
            get: function () {
                return this._el;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Template.prototype, "app", {
            get: function () {
                return bootstrapper_5.bootstrapper.app;
            },
            enumerable: false,
            configurable: true
        });
        return Template;
    }(jriapp_shared_14.BaseObject));
});
define("jriapp/utils/lifetime", ["require", "exports", "jriapp_shared"], function (require, exports, jriapp_shared_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LifeTimeScope = void 0;
    var utils = jriapp_shared_15.Utils;
    var LifeTimeScope = (function (_super) {
        __extends(LifeTimeScope, _super);
        function LifeTimeScope() {
            var _this = _super.call(this) || this;
            _this._objs = [];
            return _this;
        }
        LifeTimeScope.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            for (var _i = 0, _a = this._objs; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (!obj.getIsStateDirty()) {
                    obj.dispose();
                }
            }
            this._objs = [];
            _super.prototype.dispose.call(this);
        };
        LifeTimeScope.prototype.addObj = function (b) {
            this._objs.push(b);
        };
        LifeTimeScope.prototype.removeObj = function (b) {
            utils.arr.remove(this._objs, b);
        };
        LifeTimeScope.prototype.getObjs = function () {
            return this._objs;
        };
        LifeTimeScope.prototype.findAll = function (predicate) {
            return this._objs.filter(predicate);
        };
        LifeTimeScope.prototype.findFirst = function (predicate) {
            var arr = this._objs, len = arr.length;
            for (var i = 0; i < len; i += 1) {
                if (predicate(arr[i])) {
                    return arr[i];
                }
            }
            return null;
        };
        LifeTimeScope.prototype.toString = function () {
            return "LifeTimeScope";
        };
        return LifeTimeScope;
    }(jriapp_shared_15.BaseObject));
    exports.LifeTimeScope = LifeTimeScope;
});
define("jriapp/utils/propwatcher", ["require", "exports", "jriapp_shared"], function (require, exports, jriapp_shared_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PropWatcher = void 0;
    var coreUtils = jriapp_shared_16.Utils.core;
    var PropWatcher = (function (_super) {
        __extends(PropWatcher, _super);
        function PropWatcher() {
            var _this = _super.call(this) || this;
            _this._uniqueID = coreUtils.getNewID("prw");
            _this._objs = [];
            return _this;
        }
        PropWatcher.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            var self = this;
            for (var _i = 0, _a = this._objs; _i < _a.length; _i++) {
                var obj = _a[_i];
                self.removeWatch(obj);
            }
            this._objs = [];
            _super.prototype.dispose.call(this);
        };
        PropWatcher.create = function () {
            return new PropWatcher();
        };
        PropWatcher.prototype.addPropWatch = function (obj, prop, fnOnChange) {
            var self = this;
            obj.objEvents.onProp(prop, function (_, a) {
                fnOnChange(a.property);
            }, self.uniqueID);
            if (self._objs.indexOf(obj) < 0) {
                self._objs.push(obj);
            }
        };
        PropWatcher.prototype.addWatch = function (obj, props, fnOnChange) {
            var self = this;
            obj.objEvents.onProp("*", function (_, a) {
                if (props.indexOf(a.property) > -1) {
                    fnOnChange(a.property);
                }
            }, self.uniqueID);
            if (self._objs.indexOf(obj) < 0) {
                self._objs.push(obj);
            }
        };
        PropWatcher.prototype.removeWatch = function (obj) {
            obj.objEvents.offNS(this.uniqueID);
        };
        PropWatcher.prototype.toString = function () {
            return "PropWatcher " + this._uniqueID;
        };
        Object.defineProperty(PropWatcher.prototype, "uniqueID", {
            get: function () {
                return this._uniqueID;
            },
            enumerable: false,
            configurable: true
        });
        return PropWatcher;
    }(jriapp_shared_16.BaseObject));
    exports.PropWatcher = PropWatcher;
});
define("jriapp/mvvm", ["require", "exports", "jriapp_shared"], function (require, exports, jriapp_shared_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewModel = exports.BaseCommand = exports.Command = void 0;
    var getNewID = jriapp_shared_17.Utils.core.getNewID;
    var CMD_EVENTS;
    (function (CMD_EVENTS) {
        CMD_EVENTS["can_execute_changed"] = "canExecute_changed";
    })(CMD_EVENTS || (CMD_EVENTS = {}));
    var Command = (function (_super) {
        __extends(Command, _super);
        function Command(fnAction, fnCanExecute) {
            var _this = _super.call(this) || this;
            _this._uniqueID = getNewID("cmd");
            _this._action = fnAction;
            _this._predicate = fnCanExecute;
            return _this;
        }
        Command.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this._action = null;
            this._predicate = null;
            _super.prototype.dispose.call(this);
        };
        Command.prototype._canExecute = function (param) {
            var predicate = this._predicate;
            return !predicate ? true : predicate(param);
        };
        Command.prototype._execute = function (param) {
            var action = this._action;
            if (!!action) {
                action(param);
            }
        };
        Command.prototype.addOnCanExecuteChanged = function (fn, nmspace, context) {
            this.objEvents.on("canExecute_changed", fn, nmspace, context);
        };
        Command.prototype.offOnCanExecuteChanged = function (nmspace) {
            this.objEvents.off("canExecute_changed", nmspace);
        };
        Command.prototype.canExecute = function (param) {
            return this._canExecute(param);
        };
        Command.prototype.execute = function (param) {
            this._execute(param);
        };
        Command.prototype.raiseCanExecuteChanged = function () {
            this.objEvents.raise("canExecute_changed", {});
        };
        Command.prototype.toString = function () {
            return "Command";
        };
        Object.defineProperty(Command.prototype, "uniqueID", {
            get: function () {
                return this._uniqueID;
            },
            enumerable: false,
            configurable: true
        });
        return Command;
    }(jriapp_shared_17.BaseObject));
    exports.Command = Command;
    var BaseCommand = (function (_super) {
        __extends(BaseCommand, _super);
        function BaseCommand(owner) {
            var _this = _super.call(this, null, null) || this;
            _this._owner = owner;
            return _this;
        }
        BaseCommand.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this._owner = null;
            _super.prototype.dispose.call(this);
        };
        BaseCommand.prototype._canExecute = function (param) {
            return this.isCanExecute(param);
        };
        BaseCommand.prototype._execute = function (param) {
            this.action(param);
        };
        Object.defineProperty(BaseCommand.prototype, "owner", {
            get: function () {
                return this._owner;
            },
            enumerable: false,
            configurable: true
        });
        return BaseCommand;
    }(Command));
    exports.BaseCommand = BaseCommand;
    var ViewModel = (function (_super) {
        __extends(ViewModel, _super);
        function ViewModel(app) {
            var _this = _super.call(this) || this;
            _this._app = app;
            _this._uniqueID = getNewID("vm");
            return _this;
        }
        ViewModel.prototype.addOnDisposed = function (handler, nmspace, context) {
            this.objEvents.addOnDisposed(handler, nmspace, context);
        };
        ViewModel.prototype.offOnDisposed = function (nmspace) {
            this.objEvents.offOnDisposed(nmspace);
        };
        ViewModel.prototype.addOnError = function (handler, nmspace, context) {
            this.objEvents.addOnError(handler, nmspace, context);
        };
        ViewModel.prototype.offOnError = function (nmspace) {
            this.objEvents.offOnError(nmspace);
        };
        ViewModel.prototype.toString = function () {
            return "ViewModel";
        };
        Object.defineProperty(ViewModel.prototype, "uniqueID", {
            get: function () {
                return this._uniqueID;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ViewModel.prototype, "app", {
            get: function () {
                return this._app;
            },
            enumerable: false,
            configurable: true
        });
        return ViewModel;
    }(jriapp_shared_17.BaseObject));
    exports.ViewModel = ViewModel;
});
define("jriapp/utils/mloader", ["require", "exports", "jriapp_shared", "jriapp/int", "jriapp/utils/sloader"], function (require, exports, jriapp_shared_18, int_4, sloader_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.create = void 0;
    var utils = jriapp_shared_18.Utils, _a = utils.core, forEach = _a.forEach, Indexer = _a.Indexer, startsWith = utils.str.startsWith, _b = utils.async, _reject = _b.reject, _resolve = _b.resolve, _whenAll = _b.whenAll, createDeferred = _b.createDeferred, arrHelper = utils.arr, CSSPrefix = "css!";
    var _moduleLoader = null;
    function create() {
        if (!_moduleLoader) {
            _moduleLoader = new ModuleLoader();
        }
        return _moduleLoader;
    }
    exports.create = create;
    var LOAD_STATE;
    (function (LOAD_STATE) {
        LOAD_STATE[LOAD_STATE["NONE"] = 0] = "NONE";
        LOAD_STATE[LOAD_STATE["LOADING"] = 1] = "LOADING";
        LOAD_STATE[LOAD_STATE["LOADED"] = 2] = "LOADED";
    })(LOAD_STATE || (LOAD_STATE = {}));
    function whenAll(loads) {
        if (!loads || loads.length === 0) {
            return _resolve(void 0, true);
        }
        if (loads.length === 1) {
            return loads[0].defered.promise();
        }
        var cnt = loads.length;
        var resolved = 0, err = null;
        for (var i = 0; i < cnt; i += 1) {
            if (loads[i].state === 2) {
                ++resolved;
                if (!!loads[i].err) {
                    err = loads[i].err;
                }
            }
        }
        if (resolved === cnt) {
            return !err ? _resolve(void 0, true) : _reject(err);
        }
        else {
            return _whenAll(loads.map(function (load) {
                return load.defered.promise();
            }));
        }
    }
    var ModuleLoader = (function () {
        function ModuleLoader() {
            this._loads = Indexer();
            this._cssLoads = Indexer();
        }
        ModuleLoader.prototype.load = function (names) {
            var self = this;
            var cssNames = names.filter(function (val) { return self.isCSS(val); }), cssLoads = self.loadCSS(cssNames), modNames = names.filter(function (val) { return !self.isCSS(val); }), forLoad = modNames.filter(function (val) {
                return !self._loads[val];
            });
            if (forLoad.length > 0) {
                forLoad.forEach(function (name) {
                    var load = {
                        name: name,
                        err: null,
                        state: 1,
                        defered: createDeferred(true)
                    };
                    self._loads[name] = load;
                    new Promise(function (resolve_1, reject_1) { require([name], resolve_1, reject_1); }).then(function () {
                        load.state = 2;
                        load.defered.resolve();
                    }, function (err) {
                        load.state = 2;
                        load.err = err;
                        load.defered.reject("Error loading modules: " + ("" + err));
                    });
                });
            }
            var loads = arrHelper.merge([modNames.map(function (name) {
                    return self._loads[name];
                }), cssLoads]);
            return whenAll(loads);
        };
        ModuleLoader.prototype.whenAllLoaded = function () {
            var loads = [];
            forEach(this._loads, function (_, val) {
                loads.push(val);
            });
            return whenAll(loads);
        };
        ModuleLoader.prototype.loadCSS = function (names) {
            var self = this, forLoad = names.filter(function (val) {
                return !self._cssLoads[val];
            }), urls = forLoad.map(function (val) {
                return self.getUrl(val);
            });
            if (forLoad.length > 0) {
                var cssLoader = sloader_2.createCssLoader();
                forLoad.forEach(function (name) {
                    self._cssLoads[name] = {
                        name: name,
                        err: null,
                        state: 1,
                        defered: createDeferred(true)
                    };
                });
                cssLoader.loadStyles(urls).then(function () {
                    forLoad.forEach(function (name) {
                        var load = self._cssLoads[name];
                        load.state = 2;
                        load.defered.resolve();
                    });
                }, function (err) {
                    forLoad.forEach(function (name) {
                        var load = self._cssLoads[name];
                        load.state = 2;
                        load.err = err;
                        load.defered.reject(err);
                    });
                });
            }
            var loads = names.map(function (name) {
                return self._cssLoads[name];
            });
            return loads;
        };
        ModuleLoader.prototype.isCSS = function (name) {
            return !!name && startsWith(name, CSSPrefix);
        };
        ModuleLoader.prototype.getUrl = function (name) {
            if (this.isCSS(name)) {
                name = name.substr(CSSPrefix.length);
            }
            var url = int_4.Config.cssPath || "";
            url = url.replace(/\/?$/, '/');
            return "" + url + name;
        };
        return ModuleLoader;
    }());
});
define("jriapp/databindsvc", ["require", "exports", "jriapp_shared", "jriapp/utils/lifetime", "jriapp/utils/dom", "jriapp/utils/mloader", "jriapp/binding", "jriapp/utils/viewchecks", "jriapp/utils/parser"], function (require, exports, jriapp_shared_19, lifetime_1, dom_5, mloader_1, binding_1, viewchecks_2, parser_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createDataBindSvc = void 0;
    var utils = jriapp_shared_19.Utils, createDeferred = utils.async.createDeferred, viewChecks = viewchecks_2.ViewChecks, dom = dom_5.DomUtils, startsWith = utils.str.startsWith, parser = parser_2.Parser, forEach = utils.core.forEach, toMap = utils.arr.toMap;
    function createDataBindSvc(app) {
        return new DataBindingService(app);
    }
    exports.createDataBindSvc = createDataBindSvc;
    function toBindable(el) {
        var attr;
        var allAttrs = el.attributes, res = {
            el: el,
            needToBind: false,
            dataForm: false,
            bindings: [],
            elView: null
        };
        var n = allAttrs.length;
        var dataViewName, hasOptions = false;
        for (var i = 0; i < n; i++) {
            attr = allAttrs[i];
            if (startsWith(attr.name, "data-bind")) {
                res.bindings.push(attr.value);
            }
            if (attr.name === "data-view") {
                dataViewName = attr.value;
            }
            if (attr.name === "data-view-options") {
                hasOptions = true;
            }
        }
        if (dataViewName === "dataform") {
            res.dataForm = true;
        }
        res.needToBind = !!dataViewName || hasOptions || res.bindings.length > 0;
        return res.needToBind ? res : null;
    }
    function getBindables(scope) {
        var result = [], allElems = dom.queryAll(scope, "*");
        for (var _i = 0, allElems_1 = allElems; _i < allElems_1.length; _i++) {
            var el = allElems_1[_i];
            var res = toBindable(el);
            if (!!res) {
                result.push(res);
            }
        }
        return result;
    }
    function filterBindables(scope, bindElems) {
        var forms = bindElems.filter(function (bindElem) {
            return !!bindElem.dataForm;
        }).map(function (bindElem) {
            return bindElem.el;
        });
        if (forms.length === 0) {
            return bindElems;
        }
        return bindElems.filter(function (bindElem) {
            return !viewChecks.isInNestedForm(scope, forms, bindElem.el);
        });
    }
    var DataBindingService = (function (_super) {
        __extends(DataBindingService, _super);
        function DataBindingService(app) {
            var _this = _super.call(this) || this;
            _this._app = app;
            _this._root = app.appRoot;
            _this._elViewFactory = app.viewFactory;
            _this._objLifeTime = null;
            _this._mloader = mloader_1.create();
            return _this;
        }
        DataBindingService.prototype.dispose = function () {
            this._cleanUp();
            this._elViewFactory = null;
            this._mloader = null;
            this._app = null;
            _super.prototype.dispose.call(this);
        };
        DataBindingService.prototype._cleanUp = function () {
            if (!!this._objLifeTime) {
                this._objLifeTime.dispose();
                this._objLifeTime = null;
            }
        };
        DataBindingService.prototype._bindElView = function (args) {
            var self = this, _a = args.bind, elView = _a.elView, bindings = _a.bindings, dataContext = args.dataContext;
            if ((bindings === null || bindings === void 0 ? void 0 : bindings.length) > 0) {
                var bindInfos = parser.parseBindings(bindings);
                try {
                    elView.bindingState = 1;
                    for (var _i = 0, bindInfos_1 = bindInfos; _i < bindInfos_1.length; _i++) {
                        var bindInfo = bindInfos_1[_i];
                        var op = binding_1.getBindingOptions(bindInfo, elView, dataContext);
                        var binding = self.bind(op);
                        args.lftm.addObj(binding);
                    }
                }
                finally {
                    elView.bindingState = 0;
                }
            }
        };
        DataBindingService.prototype.bindTemplate = function (templateEl, dataContext, required) {
            var self = this;
            var res;
            if (!!required && required.length > 0) {
                res = self._mloader.load(required).then(function () {
                    return self.bindElements({
                        scope: templateEl,
                        bind: 1,
                        dataContext: dataContext
                    });
                });
            }
            else {
                res = self.bindElements({
                    scope: templateEl,
                    bind: 1,
                    dataContext: dataContext
                });
            }
            res.catch(function (err) {
                utils.queue.enque(function () {
                    self.handleError(err, self);
                });
            });
            return res;
        };
        DataBindingService.prototype.bindElements = function (args) {
            var self = this, defer = createDeferred(true), scope = args.scope, lftm = new lifetime_1.LifeTimeScope();
            try {
                var bindElems = getBindables(scope);
                var bindables = filterBindables(scope, bindElems);
                for (var _i = 0, bindables_1 = bindables; _i < bindables_1.length; _i++) {
                    var bindElem = bindables_1[_i];
                    var factory = self._elViewFactory;
                    var elView = factory.getElView(bindElem.el);
                    if (!elView) {
                        var info = factory.getElementViewInfo(bindElem.el, args.dataContext);
                        elView = factory.createElView(info);
                        lftm.addObj(elView);
                    }
                    bindElem.elView = elView;
                }
                var viewsArr = bindables.map(function (bindElem) {
                    self._bindElView({
                        bind: bindElem,
                        lftm: lftm,
                        dataContext: args.dataContext
                    });
                    return bindElem.elView;
                }).filter(function (v) { return !!v.viewMounted; });
                var viewMap = toMap(viewsArr, function (v) { return v.uniqueID; });
                forEach(viewMap, function (_n, v) { v.viewMounted(); });
                defer.resolve(lftm);
            }
            catch (err) {
                lftm.dispose();
                self.handleError(err, self);
                setTimeout(function () {
                    defer.reject(new jriapp_shared_19.DummyError(err));
                }, 0);
            }
            return defer.promise();
        };
        DataBindingService.prototype.setUpBindings = function () {
            var bindScope = this._root, dataContext = this._app, self = this;
            this._cleanUp();
            var promise = this.bindElements({
                scope: bindScope,
                bind: 0,
                dataContext: dataContext
            });
            return promise.then(function (lftm) {
                if (self.getIsStateDirty()) {
                    lftm.dispose();
                    return;
                }
                self._objLifeTime = lftm;
            });
        };
        DataBindingService.prototype.bind = function (opts) {
            return new binding_1.Binding(opts);
        };
        return DataBindingService;
    }(jriapp_shared_19.BaseObject));
});
define("jriapp/app", ["require", "exports", "jriapp_shared", "jriapp/bootstrapper", "jriapp/utils/dom", "jriapp/utils/tloader", "jriapp/elview", "jriapp/databindsvc"], function (require, exports, jriapp_shared_20, bootstrapper_6, dom_6, tloader_2, elview_2, databindsvc_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Application = void 0;
    var utils = jriapp_shared_20.Utils, dom = dom_6.DomUtils, doc = dom.document, format = utils.str.format, isThenable = utils.check.isThenable, boot = bootstrapper_6.bootstrapper, sys = utils.sys, ERRS = jriapp_shared_20.LocaleERRS, _a = utils.core, forEach = _a.forEach, getNewID = _a.getNewID, memoize = _a.memoize, Indexer = _a.Indexer, _b = utils.async, createDeferred = _b.createDeferred, resolve = _b.resolve, reject = _b.reject, http = utils.http;
    var APP_EVENTS;
    (function (APP_EVENTS) {
        APP_EVENTS["startup"] = "startup";
    })(APP_EVENTS || (APP_EVENTS = {}));
    var AppState;
    (function (AppState) {
        AppState[AppState["None"] = 0] = "None";
        AppState[AppState["Starting"] = 1] = "Starting";
        AppState[AppState["Started"] = 2] = "Started";
        AppState[AppState["Disposed"] = 3] = "Disposed";
        AppState[AppState["Error"] = 4] = "Error";
    })(AppState || (AppState = {}));
    var Application = (function (_super) {
        __extends(Application, _super);
        function Application(options) {
            var _this = _super.call(this) || this;
            if (!options) {
                options = Indexer();
            }
            var self = _this, moduleInits = options.modulesInits || Indexer(), appName = jriapp_shared_20.APP_NAME;
            _this._appName = appName;
            _this._options = options;
            if (!!boot.app) {
                throw new Error(format(ERRS.ERR_APP_NAME_NOT_UNIQUE, appName));
            }
            _this._uniqueID = getNewID("app");
            _this._appState = 0;
            _this._moduleInits = moduleInits;
            _this._viewFactory = elview_2.createElViewFactory(boot.elViewRegister);
            _this._dataBindingService = databindsvc_1.createDataBindSvc(_this);
            _this._objMaps = [];
            _this._extraData = Indexer();
            _this._UC = Indexer();
            _this._internal = {
                bindTemplate: function (templateEl, dataContext, required) {
                    return self._dataBindingService.bindTemplate(templateEl, dataContext, required);
                },
                bindElements: function (args) {
                    return self._dataBindingService.bindElements(args);
                },
                getTemplateLoaderInfo: function (name) {
                    return self._getTemplateLoaderInfo(name);
                },
                getData: function () {
                    return self._extraData;
                }
            };
            boot._getInternal().registerApp(_this);
            return _this;
        }
        Application.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            var self = this;
            try {
                self._appState = 3;
                boot._getInternal().unregisterApp(self);
                self._cleanUpObjMaps();
                self._dataBindingService.dispose();
                self._dataBindingService = null;
                self._viewFactory.dispose();
                self._extraData = Indexer();
                self._moduleInits = Indexer();
                self._UC = Indexer();
                self._options = null;
                self._viewFactory = null;
            }
            finally {
                _super.prototype.dispose.call(this);
            }
        };
        Application.prototype._cleanUpObjMaps = function () {
            var self = this;
            var _loop_1 = function (objMap) {
                forEach(objMap, function (name) {
                    var obj = objMap[name];
                    if (sys.isBaseObj(obj)) {
                        if (!obj.getIsDisposed()) {
                            obj.objEvents.offNS(self.uniqueID);
                        }
                    }
                });
            };
            for (var _i = 0, _a = this._objMaps; _i < _a.length; _i++) {
                var objMap = _a[_i];
                _loop_1(objMap);
            }
            this._objMaps = [];
        };
        Application.prototype._initAppModules = function () {
            var self = this, keys = Object.keys(self._moduleInits);
            keys.forEach(function (key) {
                var initFn = self._moduleInits[key];
                initFn(self);
            });
        };
        Application.prototype._getTemplateLoaderInfo = function (name) {
            var res = tloader_2.getLoader(this, name);
            if (!res) {
                res = tloader_2.getLoader(boot, name);
            }
            return res;
        };
        Application.prototype.onStartUp = function () {
        };
        Application.prototype._getInternal = function () {
            return this._internal;
        };
        Application.prototype.addOnDisposed = function (handler, nmspace, context) {
            this.objEvents.addOnDisposed(handler, nmspace, context);
        };
        Application.prototype.offOnDisposed = function (nmspace) {
            this.objEvents.offOnDisposed(nmspace);
        };
        Application.prototype.addOnError = function (handler, nmspace, context) {
            this.objEvents.addOnError(handler, nmspace, context);
        };
        Application.prototype.offOnError = function (nmspace) {
            this.objEvents.offOnError(nmspace);
        };
        Application.prototype.addOnStartUp = function (fn, nmspace, context) {
            this.objEvents.on("startup", fn, nmspace, context);
        };
        Application.prototype.offOnStartUp = function (nmspace) {
            this.objEvents.off("startup", nmspace);
        };
        Application.prototype.getData = function () {
            return this._extraData;
        };
        Application.prototype.bind = function (opts) {
            return this._dataBindingService.bind(opts);
        };
        Application.prototype.registerConverter = function (name, obj) {
            bootstrapper_6.registerConverter(this, name, obj);
        };
        Application.prototype.getConverter = function (name) {
            var res = bootstrapper_6.getConverter(this, name);
            if (!res) {
                res = bootstrapper_6.getConverter(boot, name);
            }
            if (!res) {
                throw new Error(format(ERRS.ERR_CONVERTER_NOTREGISTERED, name));
            }
            return res;
        };
        Application.prototype.registerSvc = function (name, obj) {
            bootstrapper_6.registerSvc(this, name, obj);
        };
        Application.prototype.unregisterSvc = function (name) {
            bootstrapper_6.unregisterSvc(this, name);
        };
        Application.prototype.getSvc = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var obj = bootstrapper_6.getSvc.apply(void 0, __spreadArray([this, name], args));
            if (!obj) {
                obj = bootstrapper_6.getSvc.apply(void 0, __spreadArray([boot, name], args));
            }
            if (!obj) {
                throw new Error("The service: " + name + " is not registered");
            }
            return obj;
        };
        Application.prototype.registerElView = function (name, vwType) {
            this._viewFactory.register.registerElView(name, vwType);
        };
        Application.prototype.registerObject = function (name, obj) {
            var self = this, name2 = "obj." + name;
            if (sys.isBaseObj(obj)) {
                obj.objEvents.addOnDisposed(function () {
                    bootstrapper_6.unregisterObject(self, name2);
                }, self.uniqueID);
            }
            var objMap = bootstrapper_6.registerObject(self, name2, obj);
            if (this._objMaps.indexOf(objMap) < 0) {
                this._objMaps.push(objMap);
            }
        };
        Application.prototype.getObject = function (name) {
            var name2 = "obj." + name, res = bootstrapper_6.getObject(this, name2);
            return res;
        };
        Application.prototype.startUp = function (onStartUp) {
            var self = this, deferred = createDeferred();
            if (this._appState !== 0) {
                return deferred.reject(new Error("Application can not be started when state != AppState.None"));
            }
            var fnStartApp = function () {
                try {
                    self._initAppModules();
                    var onStartupRes1 = self.onStartUp();
                    var setupPromise1 = void 0;
                    if (isThenable(onStartupRes1)) {
                        setupPromise1 = onStartupRes1;
                    }
                    else {
                        setupPromise1 = createDeferred().resolve();
                    }
                    var promise_1 = setupPromise1.then(function () {
                        self.objEvents.raise("startup", {});
                        var onStartupRes2 = (!!onStartUp) ? onStartUp.apply(self, [self]) : null;
                        var setupPromise2;
                        if (isThenable(onStartupRes2)) {
                            setupPromise2 = onStartupRes2.then(function () {
                                return self._dataBindingService.setUpBindings();
                            }, function (err) {
                                deferred.reject(err);
                                throw err;
                            });
                        }
                        else {
                            setupPromise2 = self._dataBindingService.setUpBindings();
                        }
                        return setupPromise2;
                    });
                    promise_1.then(function () {
                        deferred.resolve(self);
                    }, function (err) {
                        deferred.reject(err);
                    });
                }
                catch (ex) {
                    deferred.reject(ex);
                }
            };
            this._appState = 1;
            var promise = deferred.promise().then(function () {
                self._appState = 2;
                return self;
            }, function (err) {
                self._appState = 4;
                throw err;
            });
            try {
                if (!!onStartUp && !utils.check.isFunc(onStartUp)) {
                    throw new Error(ERRS.ERR_APP_SETUP_INVALID);
                }
                boot.templateLoader.waitForNotLoading(fnStartApp, null);
            }
            catch (ex) {
                deferred.reject(ex);
            }
            return promise;
        };
        Application.prototype.loadTemplates = function (url) {
            return boot.templateLoader.loadTemplatesAsync(this, function () { return http.getAjax(url); });
        };
        Application.prototype.registerTemplateLoader = function (name, loader) {
            var fn = memoize(function () {
                return loader().then(function (html) { return { doc: dom.getDocFragment(html), required: null }; });
            });
            tloader_2.registerLoader(this, name, fn);
        };
        Application.prototype.registerTemplateById = function (name, templateId) {
            var fn = memoize(function () {
                var el = dom.queryOne(doc, "#" + templateId);
                if (!el) {
                    throw new Error(format(ERRS.ERR_TEMPLATE_ID_INVALID, templateId));
                }
                return resolve({ doc: dom.getDocFragment(el.innerHTML), required: null }, true);
            });
            tloader_2.registerLoader(this, name, fn);
        };
        Application.prototype.getTemplateLoader = function (name) {
            var res = boot.templateLoader.getTemplateLoader(this._getInternal(), name);
            if (!res) {
                res = function () { return reject(new Error(format(ERRS.ERR_TEMPLATE_NOTREGISTERED, name))); };
            }
            return res;
        };
        Application.prototype.registerTemplateGroup = function (name, url) {
            var group = {
                name: name,
                url: url,
                loader: function () {
                    return http.getAjax(group.url);
                },
                promise: null,
                owner: this
            };
            tloader_2.registerTemplateGroup(this, name, group);
        };
        Application.prototype.getOptions = function (name) {
            var res = bootstrapper_6.getOptions(this, name);
            if (!res) {
                res = bootstrapper_6.getOptions(boot, name);
            }
            if (!res) {
                throw new Error(format(ERRS.ERR_OPTIONS_NOTREGISTERED, name));
            }
            return res;
        };
        Application.prototype.toString = function () {
            return "Application: " + this.appName;
        };
        Object.defineProperty(Application.prototype, "uniqueID", {
            get: function () {
                return this._uniqueID;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Application.prototype, "options", {
            get: function () {
                return this._options;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Application.prototype, "appName", {
            get: function () {
                return this._appName;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Application.prototype, "appRoot", {
            get: function () {
                return (!this._options || !this._options.appRoot) ? doc : this._options.appRoot;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Application.prototype, "viewFactory", {
            get: function () {
                return this._viewFactory;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Application.prototype, "UC", {
            get: function () {
                return this._UC;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Application.prototype, "app", {
            get: function () {
                return this;
            },
            enumerable: false,
            configurable: true
        });
        return Application;
    }(jriapp_shared_20.BaseObject));
    exports.Application = Application;
});
define("jriapp", ["require", "exports", "jriapp/bootstrapper", "jriapp_shared", "jriapp_shared/collection/const", "jriapp_shared/collection/int", "jriapp_shared/utils/jsonbag", "jriapp_shared/utils/promise", "jriapp/consts", "jriapp/utils/dom", "jriapp/utils/viewchecks", "jriapp/converter", "jriapp/bootstrapper", "jriapp/binding", "jriapp/template", "jriapp/utils/lifetime", "jriapp/utils/propwatcher", "jriapp/mvvm", "jriapp/app"], function (require, exports, bootstrapper_7, jriapp_shared_21, const_1, int_5, jsonbag_1, promise_2, consts_1, dom_7, viewchecks_3, converter_1, bootstrapper_8, binding_2, template_1, lifetime_2, propwatcher_1, mvvm_1, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VERSION = exports.Application = exports.Command = exports.BaseCommand = exports.ViewModel = exports.PropWatcher = exports.LifeTimeScope = exports.createTemplate = exports.Binding = exports.selectableProviderWeakMap = exports.subscribeWeakMap = exports.bootstrapper = exports.BaseConverter = exports.ViewChecks = exports.DOM = exports.SubscribeFlags = exports.BindTo = exports.BINDING_MODE = exports.KEYS = exports.StatefulPromise = void 0;
    __exportStar(jriapp_shared_21, exports);
    __exportStar(const_1, exports);
    __exportStar(int_5, exports);
    __exportStar(jsonbag_1, exports);
    Object.defineProperty(exports, "StatefulPromise", { enumerable: true, get: function () { return promise_2.StatefulPromise; } });
    Object.defineProperty(exports, "KEYS", { enumerable: true, get: function () { return consts_1.KEYS; } });
    Object.defineProperty(exports, "BINDING_MODE", { enumerable: true, get: function () { return consts_1.BINDING_MODE; } });
    Object.defineProperty(exports, "BindTo", { enumerable: true, get: function () { return consts_1.BindTo; } });
    Object.defineProperty(exports, "SubscribeFlags", { enumerable: true, get: function () { return consts_1.SubscribeFlags; } });
    Object.defineProperty(exports, "DOM", { enumerable: true, get: function () { return dom_7.DomUtils; } });
    Object.defineProperty(exports, "ViewChecks", { enumerable: true, get: function () { return viewchecks_3.ViewChecks; } });
    Object.defineProperty(exports, "BaseConverter", { enumerable: true, get: function () { return converter_1.BaseConverter; } });
    Object.defineProperty(exports, "bootstrapper", { enumerable: true, get: function () { return bootstrapper_8.bootstrapper; } });
    Object.defineProperty(exports, "subscribeWeakMap", { enumerable: true, get: function () { return bootstrapper_8.subscribeWeakMap; } });
    Object.defineProperty(exports, "selectableProviderWeakMap", { enumerable: true, get: function () { return bootstrapper_8.selectableProviderWeakMap; } });
    Object.defineProperty(exports, "Binding", { enumerable: true, get: function () { return binding_2.Binding; } });
    Object.defineProperty(exports, "createTemplate", { enumerable: true, get: function () { return template_1.createTemplate; } });
    Object.defineProperty(exports, "LifeTimeScope", { enumerable: true, get: function () { return lifetime_2.LifeTimeScope; } });
    Object.defineProperty(exports, "PropWatcher", { enumerable: true, get: function () { return propwatcher_1.PropWatcher; } });
    Object.defineProperty(exports, "ViewModel", { enumerable: true, get: function () { return mvvm_1.ViewModel; } });
    Object.defineProperty(exports, "BaseCommand", { enumerable: true, get: function () { return mvvm_1.BaseCommand; } });
    Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return mvvm_1.Command; } });
    Object.defineProperty(exports, "Application", { enumerable: true, get: function () { return app_1.Application; } });
    exports.VERSION = "4.0.0";
    bootstrapper_7.Bootstrapper._initFramework();
});
