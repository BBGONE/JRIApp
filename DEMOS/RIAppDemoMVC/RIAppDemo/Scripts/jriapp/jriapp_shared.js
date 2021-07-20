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
define("jriapp_shared/consts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DUMY_ERROR = exports.APP_NAME = exports.SIDE = exports.BRACKETS = exports.DEBUG_LEVEL = void 0;
    var DEBUG_LEVEL;
    (function (DEBUG_LEVEL) {
        DEBUG_LEVEL[DEBUG_LEVEL["NONE"] = 0] = "NONE";
        DEBUG_LEVEL[DEBUG_LEVEL["NORMAL"] = 1] = "NORMAL";
        DEBUG_LEVEL[DEBUG_LEVEL["HIGH"] = 2] = "HIGH";
    })(DEBUG_LEVEL = exports.DEBUG_LEVEL || (exports.DEBUG_LEVEL = {}));
    var BRACKETS;
    (function (BRACKETS) {
        BRACKETS[BRACKETS["ROUND"] = 0] = "ROUND";
        BRACKETS[BRACKETS["CURLY"] = 1] = "CURLY";
        BRACKETS[BRACKETS["SQUARE"] = 2] = "SQUARE";
    })(BRACKETS = exports.BRACKETS || (exports.BRACKETS = {}));
    var SIDE;
    (function (SIDE) {
        SIDE[SIDE["BOTH"] = 0] = "BOTH";
        SIDE[SIDE["LEFT"] = 1] = "LEFT";
        SIDE[SIDE["RIGHT"] = 2] = "RIGHT";
    })(SIDE = exports.SIDE || (exports.SIDE = {}));
    exports.APP_NAME = "app";
    exports.DUMY_ERROR = "DUMMY_ERROR";
});
define("jriapp_shared/utils/ipromise", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PromiseState = void 0;
    var PromiseState;
    (function (PromiseState) {
        PromiseState[PromiseState["Pending"] = 0] = "Pending";
        PromiseState[PromiseState["ResolutionInProgress"] = 1] = "ResolutionInProgress";
        PromiseState[PromiseState["Resolved"] = 2] = "Resolved";
        PromiseState[PromiseState["Rejected"] = 3] = "Rejected";
    })(PromiseState = exports.PromiseState || (exports.PromiseState = {}));
});
define("jriapp_shared/int", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TPriority = exports.DebugLevel = exports.Config = void 0;
    exports.Config = jriapp_config || {};
    exports.DebugLevel = (!exports.Config.debugLevel) ? 0 : exports.Config.debugLevel;
    var TPriority;
    (function (TPriority) {
        TPriority[TPriority["Normal"] = 0] = "Normal";
        TPriority[TPriority["AboveNormal"] = 1] = "AboveNormal";
        TPriority[TPriority["High"] = 2] = "High";
    })(TPriority = exports.TPriority || (exports.TPriority = {}));
});
define("jriapp_shared/utils/checks", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Checks = void 0;
    var GUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    var _undefined = void (0);
    function isNt(a) {
        return (a === null || a === _undefined);
    }
    function isFunc(a) {
        return (isNt(a)) ? false : ((typeof a === "function") || (typeof a === "object" && a instanceof Function));
    }
    function isString(a) {
        return (isNt(a)) ? false : ((typeof a === "string") || (typeof a === "object" && a instanceof String));
    }
    function isNumber(a) {
        return (isNt(a)) ? false : (typeof a === "number" || (typeof a === "object" && a instanceof Number));
    }
    var Checks = (function () {
        function Checks() {
        }
        Checks.isHasProp = function (obj, prop) {
            return (!obj) ? false : (prop in obj);
        };
        Checks.isNull = function (a) {
            return a === null;
        };
        Checks.isUndefined = function (a) {
            return a === _undefined;
        };
        Checks.isObject = function (a) {
            return (isNt(a)) ? false : (typeof a === "object");
        };
        Checks.isPlainObject = function (a) {
            if (!!a && typeof a == 'object') {
                var proto = Object.getPrototypeOf(a);
                return proto === Object.prototype || proto === null;
            }
            return false;
        };
        Checks.isBoolean = function (a) {
            return (isNt(a)) ? false : ((typeof a === "boolean") || (typeof a === "object" && a instanceof Boolean));
        };
        Checks.isDate = function (a) {
            return (isNt(a)) ? false : (typeof a === "object" && a instanceof Date);
        };
        Checks.isNumeric = function (a) {
            return isNumber(a) || (isString(a) && !isNaN(Number(a)));
        };
        Checks.isBoolString = function (a) {
            return (isNt(a)) ? false : (a === "true" || a === "false");
        };
        Checks.isGuid = function (a) {
            return isString(a) && GUID_RX.test(a);
        };
        Checks.isArray = function (a) {
            return (!a) ? false : Array.isArray(a);
        };
        Checks.isThenable = function (a) {
            return (!a) ? false : ((typeof (a) === "object") && isFunc(a.then));
        };
        Checks._undefined = _undefined;
        Checks.isNt = isNt;
        Checks.isString = isString;
        Checks.isFunc = isFunc;
        Checks.isNumber = isNumber;
        return Checks;
    }());
    exports.Checks = Checks;
});
define("jriapp_shared/utils/strutils", ["require", "exports", "jriapp_shared/utils/checks"], function (require, exports, checks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StringUtils = void 0;
    var _undefined = void (0), hasNativeTrim = !!("".trim), spaceChars = [" ", "\t", "\r", "\n"];
    var ERR_STRING_FORMAT_INVALID = "String format has invalid expression value: ";
    var isFunc = checks_1.Checks.isFunc, isNt = checks_1.Checks.isNt;
    var StringUtils = (function () {
        function StringUtils() {
        }
        StringUtils.endsWith = function (str, suffix) {
            return (!str || !suffix) ? false : (str.substr(str.length - suffix.length) === suffix);
        };
        StringUtils.startsWith = function (str, prefix) {
            return (!str || !prefix) ? false : (str.substr(0, prefix.length) === prefix);
        };
        StringUtils.fastTrim = function (str) {
            if (!str) {
                return "";
            }
            return hasNativeTrim ? str.trim() : trim(str, spaceChars, 0);
        };
        StringUtils.trim = function (str, chars, side) {
            if (chars === void 0) { chars = null; }
            if (side === void 0) { side = 0; }
            if (!str) {
                return "";
            }
            if (side === 0 && !chars && hasNativeTrim) {
                return str.trim();
            }
            var len = str.length, arr = !chars ? spaceChars : chars;
            var start = 0, end = len, ch;
            if (side === 0 || side === 1) {
                for (var i = 0; i < len; i += 1) {
                    ch = str.charAt(i);
                    if (arr.indexOf(ch) > -1) {
                        start = i + 1;
                    }
                    else {
                        break;
                    }
                }
            }
            if (side === 0 || side === 2) {
                for (var j = len - 1; j >= start; j -= 1) {
                    ch = str.charAt(j);
                    if (arr.indexOf(ch) > -1) {
                        end = j;
                    }
                    else {
                        break;
                    }
                }
            }
            if (start === 0 && end === len) {
                return str;
            }
            else {
                return (end > start) ? str.substring(start, end) : "";
            }
        };
        StringUtils.ltrim = function (str, chars) {
            return trim(str, chars, 1);
        };
        StringUtils.rtrim = function (str, chars) {
            return trim(str, chars, 2);
        };
        StringUtils.format = function (formatStr) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var result = "";
            for (var i = 0;;) {
                var open_1 = formatStr.indexOf("{", i);
                var close_1 = formatStr.indexOf("}", i);
                if ((open_1 < 0) && (close_1 < 0)) {
                    result += formatStr.slice(i);
                    break;
                }
                if ((close_1 > 0) && ((close_1 < open_1) || (open_1 < 0))) {
                    if (formatStr.charAt(close_1 + 1) !== "}") {
                        throw new Error(ERR_STRING_FORMAT_INVALID + formatStr);
                    }
                    result += formatStr.slice(i, close_1 + 1);
                    i = close_1 + 2;
                    continue;
                }
                result += formatStr.slice(i, open_1);
                i = open_1 + 1;
                if (formatStr.charAt(i) === "{") {
                    result += "{";
                    i++;
                    continue;
                }
                if (close_1 < 0) {
                    throw new Error(ERR_STRING_FORMAT_INVALID + formatStr);
                }
                var brace = formatStr.substring(i, close_1);
                var colonIndex = brace.indexOf(":");
                var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10);
                if (isNaN(argNumber)) {
                    throw new Error(ERR_STRING_FORMAT_INVALID + formatStr);
                }
                var argFormat = (colonIndex < 0) ? "" : brace.substring(colonIndex + 1);
                var arg = args[argNumber];
                if (isNt(arg)) {
                    arg = "";
                }
                if (isFunc(arg.format)) {
                    result += arg.format(argFormat);
                }
                else {
                    result += arg.toString();
                }
                i = close_1 + 1;
            }
            return result;
        };
        StringUtils.formatNumber = function (num, decimals, decPoint, thousandsSep) {
            num = (num + "").replace(/[^0-9+-Ee.]/g, "");
            var n = !isFinite(+num) ? 0 : +num, dec = (decPoint === _undefined) ? "." : decPoint, sep = (thousandsSep === _undefined) ? "," : thousandsSep;
            var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals), s = [""];
            var toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return "" + Math.round(n * k) / k;
            };
            if (decimals === null || decimals === _undefined) {
                s = ("" + n).split(".");
                prec = 2;
            }
            else {
                s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
            }
            var i, s0 = "";
            var len = s[0].length;
            if (len > 3) {
                for (i = 0; i < len; i += 1) {
                    s0 = s0 + s[0].charAt(i);
                    if (i < (len - 1) && (len - i - 1) % 3 === 0) {
                        s0 = s0 + sep;
                    }
                }
                s[0] = s0;
            }
            if ((s[1] || "").length < prec) {
                s[1] = s[1] || "";
                s[1] += new Array(prec - s[1].length + 1).join("0");
            }
            return s.join(dec);
        };
        StringUtils.stripNonNumeric = function (str) {
            str += "";
            var rgx = /^\d|\.|-$/;
            var out = "";
            for (var i = 0; i < str.length; i++) {
                if (rgx.test(str.charAt(i))) {
                    if (!((str.charAt(i) === "." && out.indexOf(".") !== -1) ||
                        (str.charAt(i) === "-" && out.length !== 0))) {
                        out += str.charAt(i);
                    }
                }
            }
            return out;
        };
        StringUtils.padLeft = function (val, len, pad) {
            if (!val) {
                val = "";
            }
            pad = pad || " ";
            if (val.length >= len) {
                return val;
            }
            var str = new Array(len).join(pad[0]);
            return (str + val).slice(-len);
        };
        StringUtils.fastPadLeft = function (val, pad) {
            if (!val) {
                val = "";
            }
            if (val.length >= pad.length) {
                return val;
            }
            return (pad + val).slice(-pad.length);
        };
        StringUtils.trimQuotes = function (val) {
            if (!val) {
                return "";
            }
            var len = val.length;
            var start = 0, end = len, ch;
            for (var i = 0; i < len; i += 1) {
                ch = val.charAt(i);
                if (ch === " " || ch === "'" || ch === '"') {
                    start = i + 1;
                }
                else {
                    break;
                }
            }
            for (var j = len - 1; j >= start; j -= 1) {
                ch = val.charAt(j);
                if (ch === " " || ch === "'" || ch === '"') {
                    end = j;
                }
                else {
                    break;
                }
            }
            if (start === 0 && end === len) {
                return val;
            }
            else {
                return (end > start) ? val.substring(start, end) : "";
            }
        };
        StringUtils.trimBrackets = function (val) {
            if (!val) {
                return "";
            }
            var len = val.length;
            var start = 0, end = len, ch;
            for (var i = 0; i < len; i += 1) {
                ch = val.charAt(i);
                if (ch === " " || ch === "[") {
                    start = i + 1;
                }
                else {
                    break;
                }
            }
            for (var j = len - 1; j >= start; j -= 1) {
                ch = val.charAt(j);
                if (ch === " " || ch === "]") {
                    end = j;
                }
                else {
                    break;
                }
            }
            if (start === 0 && end === len) {
                return val;
            }
            else {
                return (end > start) ? val.substring(start, end) : "";
            }
        };
        return StringUtils;
    }());
    exports.StringUtils = StringUtils;
    var trim = StringUtils.trim;
});
define("jriapp_shared/utils/coreutils", ["require", "exports", "jriapp_shared/utils/strutils", "jriapp_shared/utils/checks"], function (require, exports, strutils_1, checks_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CoreUtils = void 0;
    var isHasProp = checks_2.Checks.isHasProp, _undefined = checks_2.Checks._undefined, isBoolean = checks_2.Checks.isBoolean, isArray = checks_2.Checks.isArray, isPlainObject = checks_2.Checks.isPlainObject, isNt = checks_2.Checks.isNt, isString = checks_2.Checks.isString, formatStr = strutils_1.StringUtils.format, trim = strutils_1.StringUtils.fastTrim, getOwnPropertyNames = Object.getOwnPropertyNames, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor, objectKeys = Object.keys;
    var UUID_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    var NEWID_MAP = Indexer();
    function Indexer() {
        return Object.create(null);
    }
    function clone(obj, target) {
        if (!obj) {
            return obj;
        }
        var res;
        if (isArray(obj)) {
            res = [];
            var len = obj.length;
            for (var i = 0; i < len; i += 1) {
                res.push(clone(obj[i], null));
            }
        }
        else if (isPlainObject(obj)) {
            res = target || {};
            var keys = getOwnPropertyNames(obj), len = keys.length;
            for (var i = 0; i < len; i += 1) {
                var p = keys[i];
                res[p] = clone(obj[p], null);
            }
        }
        else {
            res = obj;
        }
        return res;
    }
    function extend(target) {
        var source = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            source[_i - 1] = arguments[_i];
        }
        if (isNt(target)) {
            throw new TypeError("extend: Cannot convert first argument to object");
        }
        var to = Object(target);
        for (var i = 0; i < source.length; i++) {
            var nextSource = source[i];
            if (nextSource === _undefined || nextSource === null) {
                continue;
            }
            var keys = objectKeys(Object(nextSource)), len = keys.length;
            for (var nextIndex = 0; nextIndex < len; nextIndex++) {
                var nextKey = keys[nextIndex], desc = getOwnPropertyDescriptor(nextSource, nextKey);
                if (desc !== _undefined && desc.enumerable) {
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function assignStrings(target, source) {
        if (isNt(target)) {
            target = {};
        }
        if (!isPlainObject(source)) {
            return target;
        }
        var keys = objectKeys(source), len = keys.length;
        for (var i = 0; i < len; i += 1) {
            var p = keys[i], tval = target[p], sval = source[p];
            if (isPlainObject(sval)) {
                target[p] = assignStrings(tval, sval);
            }
            else if (isString(sval)) {
                target[p] = sval;
            }
        }
        return target;
    }
    var ERR_OBJ_ALREADY_REGISTERED = "an Object with the name: {0} is already registered and can not be overwritten";
    var CoreUtils = (function () {
        function CoreUtils() {
        }
        CoreUtils.getNewID = function (prefix) {
            if (prefix === void 0) { prefix = "*"; }
            var id = NEWID_MAP[prefix] || 0;
            NEWID_MAP[prefix] = id + 1;
            return (prefix === "*") ? id.toString(36) : (prefix + "_" + id.toString(36));
        };
        CoreUtils.setValue = function (root, namePath, val, checkOverwrite) {
            if (checkOverwrite === void 0) { checkOverwrite = false; }
            var parts = namePath.split("."), len = parts.length;
            var parent = root;
            for (var i = 0; i < len - 1; i += 1) {
                if (!parent[parts[i]]) {
                    parent[parts[i]] = Indexer();
                }
                parent = parent[parts[i]];
            }
            var n = parts[len - 1];
            if (!!checkOverwrite && (parent[n] !== _undefined)) {
                throw new Error(formatStr(ERR_OBJ_ALREADY_REGISTERED, namePath));
            }
            parent[n] = val;
        };
        CoreUtils.getValue = function (root, namePath) {
            var parts = namePath.split(".");
            var res, parent = root;
            for (var i = 0; i < parts.length; i += 1) {
                res = parent[parts[i]];
                if (res === _undefined) {
                    return null;
                }
                parent = res;
            }
            return res;
        };
        CoreUtils.removeValue = function (root, namePath) {
            var parts = namePath.split(".");
            var parent = root;
            for (var i = 0; i < parts.length - 1; i += 1) {
                if (!parent[parts[i]]) {
                    return null;
                }
                parent = parent[parts[i]];
            }
            var n = parts[parts.length - 1], val = parent[n];
            if (val !== _undefined) {
                delete parent[n];
            }
            return val;
        };
        CoreUtils.uuid = function (len, radix) {
            var i;
            var chars = UUID_CHARS, uuid = [], rnd = Math.random;
            radix = radix || chars.length;
            if (!!len) {
                for (i = 0; i < len; i += 1) {
                    uuid[i] = chars[0 | rnd() * radix];
                }
            }
            else {
                var r = void 0;
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
                uuid[14] = "4";
                for (i = 0; i < 36; i += 1) {
                    if (!uuid[i]) {
                        r = 0 | rnd() * 16;
                        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r & 0xf];
                    }
                }
            }
            return uuid.join("");
        };
        CoreUtils.parseBool = function (a) {
            if (isBoolean(a)) {
                return a;
            }
            var v = trim(a).toLowerCase();
            if (v === "false") {
                return false;
            }
            else if (v === "true") {
                return true;
            }
            else {
                throw new Error(formatStr("parseBool, argument: {0} is not a valid boolean string", a));
            }
        };
        CoreUtils.round = function (num, decimals) {
            return parseFloat(num.toFixed(decimals));
        };
        CoreUtils.merge = function (source, target) {
            if (!target) {
                target = {};
            }
            if (!source) {
                return target;
            }
            return extend(target, source);
        };
        CoreUtils.memoize = function (fn) {
            var memo = Indexer();
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var key = "__dummy";
                if (!!args && args.length > 0) {
                    key = args.join(':');
                }
                if (key in memo) {
                    return memo[key];
                }
                else {
                    memo[key] = fn.apply(void 0, args);
                    return memo[key];
                }
            };
        };
        CoreUtils.forEach = function (map, fn) {
            if (!map) {
                return;
            }
            for (var key in map) {
                fn(key, map[key]);
            }
        };
        CoreUtils.toArray = function (map) {
            var r = [];
            if (!map) {
                return r;
            }
            for (var key in map) {
                r.push(map[key]);
            }
            return r;
        };
        CoreUtils.pipe = function (fn1) {
            var fns = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                fns[_i - 1] = arguments[_i];
            }
            var piped = fns.reduce(function (prevFn, nextFn) { return function (value) { return nextFn(prevFn(value)); }; }, function (value) { return value; });
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return piped(fn1.apply(void 0, args));
            };
        };
        CoreUtils.compose = function (fn1) {
            var fns = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                fns[_i - 1] = arguments[_i];
            }
            return fns.reduce(function (prevFn, nextFn) { return function (value) { return prevFn(nextFn(value)); }; }, fn1);
        };
        CoreUtils.getTimeZoneOffset = (function () {
            var dt = new Date(), tz = dt.getTimezoneOffset();
            return function () { return tz; };
        })();
        CoreUtils.hasProp = isHasProp;
        CoreUtils.clone = clone;
        CoreUtils.extend = extend;
        CoreUtils.Indexer = Indexer;
        CoreUtils.assignStrings = assignStrings;
        return CoreUtils;
    }());
    exports.CoreUtils = CoreUtils;
});
define("jriapp_shared/lang", ["require", "exports", "jriapp_shared/utils/coreutils"], function (require, exports, coreutils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.STRS = exports.ERRS = exports.assign = void 0;
    var coreUtils = coreutils_1.CoreUtils;
    function assign(target, source) {
        return coreUtils.assignStrings(target, source);
    }
    exports.assign = assign;
    var _ERRS = {
        ERR_OBJ_ALREADY_REGISTERED: "Object with the name: {0} is already registered and can not be overwritten",
        ERR_OPTIONS_ALREADY_REGISTERED: "Options with the name: {0} are already registered and can not be overwritten",
        ERR_APP_NEED_JQUERY: "The project is dependent on JQuery and can not function properly without it",
        ERR_ASSERTION_FAILED: 'The Assertion "{0}" failed',
        ERR_BINDING_CONTENT_NOT_FOUND: "BindingContent is not found",
        ERR_DBSET_READONLY: "TDbSet: {0} is readOnly and can not be edited",
        ERR_DBSET_INVALID_FIELDNAME: "TDbSet: {0} has no field with the name: {1}",
        ERR_FIELD_READONLY: "Field is readOnly and can not be edited",
        ERR_FIELD_ISNOT_NULLABLE: "Field must not be empty",
        ERR_FIELD_WRONG_TYPE: "Value {0} has a wrong datatype. It must have {1} datatype.",
        ERR_FIELD_MAXLEN: "Value exceeds maximum field length: {0}",
        ERR_FIELD_DATATYPE: "Unknown field data type: {0}",
        ERR_FIELD_REGEX: "Value {0} is not validated for correctness",
        ERR_FIELD_RANGE: "Value {0} is outside the allowed range {1}",
        ERR_EVENT_INVALID: "Invalid event name: {0}",
        ERR_EVENT_INVALID_FUNC: "Invalid event function value",
        ERR_MODULE_NOT_REGISTERED: "Module: {0} is not registered",
        ERR_MODULE_ALREDY_REGISTERED: "Module: {0} is already registered",
        ERR_PROP_NAME_EMPTY: "Empty property name parameter",
        ERR_PROP_NAME_INVALID: 'The object does not have a property with a name: "{0}"',
        ERR_GLOBAL_SINGLTON: "There must be only one instance of Global object",
        ERR_TEMPLATE_ALREADY_REGISTERED: "TEMPLATE with the name: {0} is already registered",
        ERR_TEMPLATE_NOTREGISTERED: "TEMPLATE with the name: {0} is not registered",
        ERR_TEMPLATE_GROUP_NOTREGISTERED: "TEMPLATE's group: {0} is not registered",
        ERR_TEMPLATE_HAS_NO_ID: "TEMPLATE inside SCRIPT tag must have an ID attribute",
        ERR_OPTIONS_HAS_NO_ID: "OPTIONS inside SCRIPT tag must have an ID attribute",
        ERR_CONVERTER_NOTREGISTERED: "Converter: {0} is not registered",
        ERR_OPTIONS_NOTREGISTERED: "Options: {0} is not registered",
        ERR_JQUERY_DATEPICKER_NOTFOUND: "Application is dependent on JQuery.UI.datepicker",
        ERR_PARAM_INVALID: "Parameter: {0} has invalid value: {1}",
        ERR_PARAM_INVALID_TYPE: "Parameter: {0} has invalid type. It must be {1}",
        ERR_KEY_IS_EMPTY: "Key value must not be empty",
        ERR_KEY_IS_NOTFOUND: "Can not find an item with the key: {0}",
        ERR_ITEM_IS_ATTACHED: "Operation invalid. The reason: Item already has been attached",
        ERR_ITEM_IS_DETACHED: "Operation invalid. The reason: Item is detached",
        ERR_ITEM_IS_NOTFOUND: "Operation invalid. The reason: Item is not found",
        ERR_ITEM_NAME_COLLISION: 'The "{0}" TDbSet\'s field name: "{1}" is invalid, because a property with that name already exists on the entity',
        ERR_DICTKEY_IS_NOTFOUND: "Dictionary keyName: {0} does not exist in item's properties",
        ERR_DICTKEY_IS_EMPTY: "Dictionary key property: {0} must be not empty",
        ERR_CONV_INVALID_DATE: "Cannot parse string value: {0} to a valid Date",
        ERR_CONV_INVALID_NUM: "Cannot parse string value: {0} to a valid Numeric",
        ERR_QUERY_NAME_NOTFOUND: "Can not find Query with the name: {0}",
        ERR_QUERY_BETWEEN: '"BETWEEN" Query operator expects two values',
        ERR_QUERY_OPERATOR_INVALID: "Invalid query operator {0}",
        ERR_OPER_REFRESH_INVALID: "Refresh operation can not be done with items in Detached or Added State",
        ERR_CALC_FIELD_DEFINE: 'Field: "{0}" definition error: Calculated fields can be dependent only on items fields',
        ERR_CALC_FIELD_SELF_DEPEND: 'Field: "{0}" definition error: Calculated fields can not be dependent on themselves',
        ERR_DOMAIN_CONTEXT_INITIALIZED: "DbContext already initialized",
        ERR_DOMAIN_CONTEXT_NOT_INITIALIZED: "DbContext is not initialized",
        ERR_SVC_METH_PARAM_INVALID: "Invalid parameter {0} value {1} for service method: {2} invocation",
        ERR_DB_LOAD_NO_QUERY: "Query parameter is not supplied",
        ERR_DBSET_NAME_INVALID: "Invalid dbSet Name: {0}",
        ERR_APP_NAME_NOT_UNIQUE: "Application instance with the name: {0} already exists",
        ERR_ELVIEW_NOT_REGISTERED: "Can not find registered element view with the name: {0}",
        ERR_ELVIEW_NOT_CREATED: "Can not create element view for element with Tag Name: {0}",
        ERR_BIND_TARGET_EMPTY: "Binding target is empty",
        ERR_BIND_TGTPATH_INVALID: "Binding targetPath has invalid value: {0}",
        ERR_BIND_MODE_INVALID: "Binding mode has invalid value: {0}",
        ERR_BIND_TARGET_INVALID: "Binding target must be a descendant of BaseObject",
        ERR_EXPR_BRACES_INVALID: "Expression {0} has no closing braces",
        ERR_APP_SETUP_INVALID: "Application's setUp method parameter must be a valid function",
        ERR_GRID_DATASRC_INVALID: "DataGrid's datasource must be a descendant of Collection type",
        ERR_COLLECTION_CHANGETYPE_INVALID: "Invalid Collection change type value: {0}",
        ERR_GRID_COLTYPE_INVALID: "Invalid Column type type value: {0}",
        ERR_PAGER_DATASRC_INVALID: "Pager datasource must be a descendant of Collection type",
        ERR_STACKPNL_DATASRC_INVALID: "StackPanel datasource must be a descendant of Collection type",
        ERR_STACKPNL_TEMPLATE_INVALID: "StackPanel templateID is not provided in the options",
        ERR_LISTBOX_DATASRC_INVALID: "ListBox datasource must be a descendant of Collection type",
        ERR_DATAFRM_DCTX_INVALID: "DataForm's dataContext must be a descendant of BaseObject type",
        ERR_DCTX_HAS_NO_FIELDINFO: "DataContext has no getFieldInfo method",
        ERR_TEMPLATE_ID_INVALID: "Element can not be found by its TemplateID: {0}",
        ERR_ITEM_DELETED_BY_ANOTHER_USER: "The record have been deleted by another user",
        ERR_ACCESS_DENIED: "The access is denied. Please, ask administrator to assign user rights to your account",
        ERR_CONCURRENCY: "The record has been modified by another user. Please, refresh record before editing",
        ERR_VALIDATION: "Data validation error",
        ERR_SVC_VALIDATION: "Data validation error: {0}",
        ERR_SVC_ERROR: "Service error: {0}",
        ERR_UNEXPECTED_SVC_ERROR: "Unexpected service error: {0}",
        ERR_ASSOC_NAME_INVALID: "Invalid association name: {0}",
        ERR_DATAVIEW_DATASRC_INVALID: "TDataView datasource must not be null and should be descendant of Collection type",
        ERR_DATAVIEW_FILTER_INVALID: "TDataView fn_filter option must be valid function which accepts entity and returns boolean value"
    };
    var PAGER = {
        firstText: "<<",
        lastText: ">>",
        previousText: "<",
        nextText: ">",
        pageInfo: "Rows from <span class='ria-pager-info-num'>{0}</span> to <span class='ria-pager-info-num'>{1}</span> of <span class='ria-pager-info-num'>{2}</span>",
        firstPageTip: "to first page",
        prevPageTip: "back to page {0}",
        nextPageTip: "next to page {0}",
        lastPageTip: "last page",
        showingTip: "showing result {0} to {1} of {2}",
        showTip: "show result {0} to {1} of {2}"
    };
    var VALIDATE = {
        errorInfo: "Validation errors:",
        errorField: "field:"
    };
    var TEXT = {
        txtEdit: "Edit",
        txtAddNew: "Add new",
        txtDelete: "Delete",
        txtCancel: "Cancel",
        txtOk: "Ok",
        txtRefresh: "Refresh",
        txtAskDelete: "Are you sure, you want to delete row?",
        txtSubmitting: "Submitting data ...",
        txtSave: "Save",
        txtClose: "Close",
        txtField: "Field"
    };
    var _STRS = {
        PAGER: PAGER,
        VALIDATE: VALIDATE,
        TEXT: TEXT
    };
    exports.ERRS = _ERRS;
    exports.STRS = _STRS;
});
define("jriapp_shared/collection/const", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VALS_VERSION = exports.ITEM_STATUS = exports.COLL_CHANGE_OPER = exports.COLL_CHANGE_REASON = exports.COLL_CHANGE_TYPE = exports.FILTER_TYPE = exports.SORT_ORDER = exports.FIELD_TYPE = exports.DATA_TYPE = exports.DATE_CONVERSION = void 0;
    var DATE_CONVERSION;
    (function (DATE_CONVERSION) {
        DATE_CONVERSION[DATE_CONVERSION["None"] = 0] = "None";
        DATE_CONVERSION[DATE_CONVERSION["ServerLocalToClientLocal"] = 1] = "ServerLocalToClientLocal";
        DATE_CONVERSION[DATE_CONVERSION["UtcToClientLocal"] = 2] = "UtcToClientLocal";
    })(DATE_CONVERSION = exports.DATE_CONVERSION || (exports.DATE_CONVERSION = {}));
    var DATA_TYPE;
    (function (DATA_TYPE) {
        DATA_TYPE[DATA_TYPE["None"] = 0] = "None";
        DATA_TYPE[DATA_TYPE["String"] = 1] = "String";
        DATA_TYPE[DATA_TYPE["Bool"] = 2] = "Bool";
        DATA_TYPE[DATA_TYPE["Integer"] = 3] = "Integer";
        DATA_TYPE[DATA_TYPE["Decimal"] = 4] = "Decimal";
        DATA_TYPE[DATA_TYPE["Float"] = 5] = "Float";
        DATA_TYPE[DATA_TYPE["DateTime"] = 6] = "DateTime";
        DATA_TYPE[DATA_TYPE["Date"] = 7] = "Date";
        DATA_TYPE[DATA_TYPE["Time"] = 8] = "Time";
        DATA_TYPE[DATA_TYPE["Guid"] = 9] = "Guid";
        DATA_TYPE[DATA_TYPE["Binary"] = 10] = "Binary";
    })(DATA_TYPE = exports.DATA_TYPE || (exports.DATA_TYPE = {}));
    var FIELD_TYPE;
    (function (FIELD_TYPE) {
        FIELD_TYPE[FIELD_TYPE["None"] = 0] = "None";
        FIELD_TYPE[FIELD_TYPE["ClientOnly"] = 1] = "ClientOnly";
        FIELD_TYPE[FIELD_TYPE["Calculated"] = 2] = "Calculated";
        FIELD_TYPE[FIELD_TYPE["Navigation"] = 3] = "Navigation";
        FIELD_TYPE[FIELD_TYPE["RowTimeStamp"] = 4] = "RowTimeStamp";
        FIELD_TYPE[FIELD_TYPE["Object"] = 5] = "Object";
        FIELD_TYPE[FIELD_TYPE["ServerCalculated"] = 6] = "ServerCalculated";
    })(FIELD_TYPE = exports.FIELD_TYPE || (exports.FIELD_TYPE = {}));
    var SORT_ORDER;
    (function (SORT_ORDER) {
        SORT_ORDER[SORT_ORDER["ASC"] = 0] = "ASC";
        SORT_ORDER[SORT_ORDER["DESC"] = 1] = "DESC";
    })(SORT_ORDER = exports.SORT_ORDER || (exports.SORT_ORDER = {}));
    var FILTER_TYPE;
    (function (FILTER_TYPE) {
        FILTER_TYPE[FILTER_TYPE["Equals"] = 0] = "Equals";
        FILTER_TYPE[FILTER_TYPE["Between"] = 1] = "Between";
        FILTER_TYPE[FILTER_TYPE["StartsWith"] = 2] = "StartsWith";
        FILTER_TYPE[FILTER_TYPE["EndsWith"] = 3] = "EndsWith";
        FILTER_TYPE[FILTER_TYPE["Contains"] = 4] = "Contains";
        FILTER_TYPE[FILTER_TYPE["Gt"] = 5] = "Gt";
        FILTER_TYPE[FILTER_TYPE["Lt"] = 6] = "Lt";
        FILTER_TYPE[FILTER_TYPE["GtEq"] = 7] = "GtEq";
        FILTER_TYPE[FILTER_TYPE["LtEq"] = 8] = "LtEq";
        FILTER_TYPE[FILTER_TYPE["NotEq"] = 9] = "NotEq";
    })(FILTER_TYPE = exports.FILTER_TYPE || (exports.FILTER_TYPE = {}));
    var COLL_CHANGE_TYPE;
    (function (COLL_CHANGE_TYPE) {
        COLL_CHANGE_TYPE[COLL_CHANGE_TYPE["Remove"] = 0] = "Remove";
        COLL_CHANGE_TYPE[COLL_CHANGE_TYPE["Add"] = 1] = "Add";
        COLL_CHANGE_TYPE[COLL_CHANGE_TYPE["Reset"] = 2] = "Reset";
        COLL_CHANGE_TYPE[COLL_CHANGE_TYPE["Remap"] = 3] = "Remap";
    })(COLL_CHANGE_TYPE = exports.COLL_CHANGE_TYPE || (exports.COLL_CHANGE_TYPE = {}));
    var COLL_CHANGE_REASON;
    (function (COLL_CHANGE_REASON) {
        COLL_CHANGE_REASON[COLL_CHANGE_REASON["None"] = 0] = "None";
        COLL_CHANGE_REASON[COLL_CHANGE_REASON["PageChange"] = 1] = "PageChange";
        COLL_CHANGE_REASON[COLL_CHANGE_REASON["Sorting"] = 2] = "Sorting";
        COLL_CHANGE_REASON[COLL_CHANGE_REASON["Refresh"] = 3] = "Refresh";
    })(COLL_CHANGE_REASON = exports.COLL_CHANGE_REASON || (exports.COLL_CHANGE_REASON = {}));
    var COLL_CHANGE_OPER;
    (function (COLL_CHANGE_OPER) {
        COLL_CHANGE_OPER[COLL_CHANGE_OPER["None"] = 0] = "None";
        COLL_CHANGE_OPER[COLL_CHANGE_OPER["Fill"] = 1] = "Fill";
        COLL_CHANGE_OPER[COLL_CHANGE_OPER["AddNew"] = 2] = "AddNew";
        COLL_CHANGE_OPER[COLL_CHANGE_OPER["Remove"] = 3] = "Remove";
        COLL_CHANGE_OPER[COLL_CHANGE_OPER["Commit"] = 4] = "Commit";
        COLL_CHANGE_OPER[COLL_CHANGE_OPER["Sort"] = 5] = "Sort";
    })(COLL_CHANGE_OPER = exports.COLL_CHANGE_OPER || (exports.COLL_CHANGE_OPER = {}));
    var ITEM_STATUS;
    (function (ITEM_STATUS) {
        ITEM_STATUS[ITEM_STATUS["None"] = 0] = "None";
        ITEM_STATUS[ITEM_STATUS["Added"] = 1] = "Added";
        ITEM_STATUS[ITEM_STATUS["Updated"] = 2] = "Updated";
        ITEM_STATUS[ITEM_STATUS["Deleted"] = 3] = "Deleted";
    })(ITEM_STATUS = exports.ITEM_STATUS || (exports.ITEM_STATUS = {}));
    var VALS_VERSION;
    (function (VALS_VERSION) {
        VALS_VERSION[VALS_VERSION["Current"] = 0] = "Current";
        VALS_VERSION[VALS_VERSION["Temporary"] = 1] = "Temporary";
        VALS_VERSION[VALS_VERSION["Original"] = 2] = "Original";
    })(VALS_VERSION = exports.VALS_VERSION || (exports.VALS_VERSION = {}));
});
define("jriapp_shared/collection/int", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ITEM_EVENTS = exports.PROP_NAME = void 0;
    exports.PROP_NAME = {
        isEditing: "isEditing",
        currentItem: "currentItem",
        count: "count",
        totalCount: "totalCount",
        pageCount: "pageCount",
        pageSize: "pageSize",
        pageIndex: "pageIndex",
        isUpdating: "isUpdating",
        isLoading: "isLoading",
        isRefreshing: "isRefreshing"
    };
    var ITEM_EVENTS;
    (function (ITEM_EVENTS) {
        ITEM_EVENTS["errors_changed"] = "errors_changed";
        ITEM_EVENTS["destroyed"] = "destroyed";
    })(ITEM_EVENTS = exports.ITEM_EVENTS || (exports.ITEM_EVENTS = {}));
});
define("jriapp_shared/utils/sysutils", ["require", "exports", "jriapp_shared/lang", "jriapp_shared/utils/checks", "jriapp_shared/utils/strutils"], function (require, exports, lang_1, checks_3, strUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SysUtils = void 0;
    var isFunc = checks_3.Checks.isFunc, isHasProp = checks_3.Checks.isHasProp, isArray = checks_3.Checks.isArray, isNt = checks_3.Checks.isNt, _undefined = checks_3.Checks._undefined, startsWith = strUtils_1.StringUtils.startsWith, trim = strUtils_1.StringUtils.fastTrim, trimBrackets = strUtils_1.StringUtils.trimBrackets, format = strUtils_1.StringUtils.format, trimQuotes = strUtils_1.StringUtils.trimQuotes;
    function dummyIsBaseObj(_obj) {
        return false;
    }
    function dummyIsCollection(_obj) {
        return false;
    }
    function dummyIsValidationError(_obj) {
        return false;
    }
    function isPropBag(obj) {
        return !!obj && obj.isPropertyBag;
    }
    var SysUtils = (function () {
        function SysUtils() {
        }
        SysUtils.isEditable = function (obj) {
            return sys.isBaseObj(obj) && isHasProp(obj, "isEditing") && isFunc(obj.beginEdit) && isFunc(obj.endEdit) && isFunc(obj.cancelEdit);
        };
        SysUtils.isSubmittable = function (obj) {
            return sys.isBaseObj(obj) && isHasProp(obj, "isCanSubmit") && isFunc(obj.submitChanges);
        };
        SysUtils.isErrorNotification = function (obj) {
            if (!obj) {
                return false;
            }
            if (!isFunc(obj.getIErrorNotification)) {
                return false;
            }
            var tmp = obj.getIErrorNotification();
            return !!tmp && isFunc(tmp.getIErrorNotification);
        };
        SysUtils.isValidatable = function (obj) {
            if (!obj) {
                return false;
            }
            return "validationErrors" in obj;
        };
        SysUtils.getErrorNotification = function (obj) {
            if (!obj) {
                return null;
            }
            if (!!obj._aspect && sys.isErrorNotification(obj._aspect)) {
                return obj._aspect.getIErrorNotification();
            }
            else if (sys.isErrorNotification(obj)) {
                return obj.getIErrorNotification();
            }
            return null;
        };
        SysUtils.getEditable = function (obj) {
            if (!obj) {
                return null;
            }
            if (!!obj._aspect && sys.isEditable(obj._aspect)) {
                return obj._aspect;
            }
            else if (sys.isEditable(obj)) {
                return obj;
            }
            return null;
        };
        SysUtils.getSubmittable = function (obj) {
            if (!obj) {
                return null;
            }
            if (!!obj._aspect && sys.isSubmittable(obj._aspect)) {
                return obj._aspect;
            }
            else if (sys.isSubmittable(obj)) {
                return obj;
            }
            return null;
        };
        SysUtils.getBraceLen = function (val, start, brace) {
            var i, cnt = 0, ch, literal, test = 0;
            var len = val.length;
            var br1, br2;
            switch (brace) {
                case 0:
                    br1 = "(";
                    br2 = ")";
                    break;
                case 1:
                    br1 = "{";
                    br2 = "}";
                    break;
                case 2:
                    br1 = "[";
                    br2 = "]";
                    break;
            }
            for (i = start; i < len; i += 1) {
                ch = val.charAt(i);
                if (!literal) {
                    switch (ch) {
                        case "'":
                        case '"':
                            literal = ch;
                            cnt += 1;
                            break;
                        case br1:
                            test += 1;
                            cnt += 1;
                            break;
                        case br2:
                            test -= 1;
                            cnt += 1;
                            if (test === 0) {
                                return cnt;
                            }
                            break;
                        default:
                            if (test > 0) {
                                cnt += 1;
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
                                    i += 1;
                                    cnt += 2;
                                }
                                else {
                                    literal = null;
                                    cnt += 1;
                                }
                            }
                            else {
                                cnt += 1;
                            }
                            break;
                        default:
                            if (test > 0) {
                                cnt += 1;
                            }
                            break;
                    }
                }
            }
            if (test !== 0) {
                throw new Error(format(lang_1.ERRS.ERR_EXPR_BRACES_INVALID, val));
            }
            return cnt;
        };
        SysUtils.getPathParts = function (path) {
            if (!path) {
                return [];
            }
            var i, start = 0, ch, val;
            var parts = [], len = path.length;
            for (i = 0; i < len; i += 1) {
                if (start < 0) {
                    start = i;
                }
                ch = path.charAt(i);
                switch (ch) {
                    case ".":
                        val = trim(path.substring(start, i));
                        if (!val && parts.length === 0) {
                            throw new Error("Invalid property path: " + path);
                        }
                        if (!!val) {
                            parts.push(val);
                        }
                        start = -1;
                        break;
                    case "[":
                        val = trim(path.substring(start, i));
                        if (!!val) {
                            parts.push(val);
                        }
                        var braceLen = sys.getBraceLen(path, i, 2);
                        val = trimQuotes(path.substring(i + 1, i + braceLen - 1));
                        if (!val) {
                            throw new Error("Invalid property path: " + path);
                        }
                        parts.push("[" + val + "]");
                        i += (braceLen - 1);
                        start = -1;
                        break;
                }
            }
            if (start > -1 && start < i) {
                val = trim(path.substring(start, i));
                if (!!val) {
                    parts.push(val);
                }
            }
            return parts;
        };
        SysUtils.getProp = function (obj, prop) {
            if (!prop) {
                return obj;
            }
            if (sys.isBaseObj(obj) && obj.getIsStateDirty()) {
                return _undefined;
            }
            if (startsWith(prop, "[")) {
                if (sys.isCollection(obj)) {
                    prop = trimBrackets(prop);
                    return sys.getItemByProp(obj, prop);
                }
                else if (isArray(obj)) {
                    prop = trimBrackets(prop);
                    return obj[parseInt(prop, 10)];
                }
                else if (sys.isPropBag(obj)) {
                    return obj.getProp(prop);
                }
            }
            return obj[prop];
        };
        SysUtils.setProp = function (obj, prop, val) {
            if (!prop) {
                throw new Error("Invalid operation: Empty Property name");
            }
            if (sys.isBaseObj(obj) && obj.getIsStateDirty()) {
                return;
            }
            if (startsWith(prop, "[")) {
                if (isArray(obj)) {
                    prop = trimBrackets(prop);
                    obj[parseInt(prop, 10)] = val;
                    return;
                }
                else if (sys.isPropBag(obj)) {
                    obj.setProp(prop, val);
                    return;
                }
            }
            obj[prop] = val;
        };
        SysUtils.resolveOwner = function (root, path) {
            if (!path) {
                return root;
            }
            var parts = sys.getPathParts(path), maxindex = parts.length - 1;
            var res = root;
            for (var i = 0; i < maxindex; i += 1) {
                res = sys.getProp(res, parts[i]);
                if (isNt(res)) {
                    return res;
                }
            }
            return res;
        };
        SysUtils.resolvePath = function (root, path) {
            return sys.resolvePath2(root, sys.getPathParts(path));
        };
        SysUtils.resolvePath2 = function (root, srcParts) {
            if (isNt(root)) {
                return root;
            }
            if (!srcParts || srcParts.length === 0) {
                return root;
            }
            var obj = root;
            for (var i = 0; i < srcParts.length; i += 1) {
                obj = sys.getProp(obj, srcParts[i]);
                if (isNt(obj)) {
                    return obj;
                }
            }
            return obj;
        };
        SysUtils.raiseProp = function (obj, path) {
            var parts = sys.getPathParts(path), lastName = parts[parts.length - 1];
            if (parts.length > 1) {
                var owner = sys.resolveOwner(obj, path);
                if (!!sys.isBaseObj(owner)) {
                    owner.objEvents.raiseProp(lastName);
                }
            }
            else {
                obj.objEvents.raiseProp(lastName);
            }
        };
        SysUtils.isBinding = function () { return false; };
        SysUtils.isPropBag = isPropBag;
        SysUtils.isCollection = dummyIsCollection;
        SysUtils.getItemByProp = function () { return null; };
        SysUtils.isValidationError = dummyIsValidationError;
        SysUtils.isBaseObj = dummyIsBaseObj;
        return SysUtils;
    }());
    exports.SysUtils = SysUtils;
    var sys = SysUtils;
});
define("jriapp_shared/errors", ["require", "exports", "jriapp_shared/consts", "jriapp_shared/utils/sysutils", "jriapp_shared/utils/coreutils", "jriapp_shared/lang"], function (require, exports, consts_1, sysutils_1, coreutils_2, lang_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValidationError = exports.AggregateError = exports.AbortError = exports.DummyError = exports.BaseError = void 0;
    var sys = sysutils_1.SysUtils, Indexer = coreutils_2.CoreUtils.Indexer;
    var BaseError = (function () {
        function BaseError(message) {
            this._message = message || "Error";
        }
        BaseError.prototype.toString = function () {
            return this._message;
        };
        Object.defineProperty(BaseError.prototype, "isDummy", {
            get: function () {
                return false;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseError.prototype, "message", {
            get: function () {
                return this._message;
            },
            enumerable: false,
            configurable: true
        });
        return BaseError;
    }());
    exports.BaseError = BaseError;
    var DummyError = (function (_super) {
        __extends(DummyError, _super);
        function DummyError(originalError) {
            var _this = _super.call(this, consts_1.DUMY_ERROR) || this;
            _this._origError = originalError;
            return _this;
        }
        Object.defineProperty(DummyError.prototype, "isDummy", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DummyError.prototype, "origError", {
            get: function () {
                return this._origError;
            },
            enumerable: false,
            configurable: true
        });
        return DummyError;
    }(BaseError));
    exports.DummyError = DummyError;
    var AbortError = (function (_super) {
        __extends(AbortError, _super);
        function AbortError(reason) {
            var _this = _super.call(this, consts_1.DUMY_ERROR) || this;
            _this._reason = reason || "Operation Aborted";
            return _this;
        }
        Object.defineProperty(AbortError.prototype, "isDummy", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AbortError.prototype, "reason", {
            get: function () {
                return this._reason;
            },
            enumerable: false,
            configurable: true
        });
        return AbortError;
    }(BaseError));
    exports.AbortError = AbortError;
    var AggregateError = (function (_super) {
        __extends(AggregateError, _super);
        function AggregateError(errors) {
            var _this = _super.call(this, "AggregateError") || this;
            _this._errors = errors || [];
            return _this;
        }
        Object.defineProperty(AggregateError.prototype, "errors", {
            get: function () {
                return this._errors;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AggregateError.prototype, "count", {
            get: function () {
                return this._errors.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AggregateError.prototype, "message", {
            get: function () {
                var hashMap = Indexer();
                for (var _i = 0, _a = this._errors; _i < _a.length; _i++) {
                    var err = _a[_i];
                    if (!!err) {
                        var str = "";
                        if (err instanceof AggregateError) {
                            str = err.message;
                        }
                        else if (err instanceof Error) {
                            str = err.message;
                        }
                        else if (!!err.message) {
                            str = "" + err.message;
                        }
                        else {
                            str = "" + err;
                        }
                        hashMap[str] = "";
                    }
                }
                var msg = "";
                var errs = Object.keys(hashMap);
                for (var _b = 0, errs_1 = errs; _b < errs_1.length; _b++) {
                    var err = errs_1[_b];
                    if (!!msg) {
                        msg += "\r\n";
                    }
                    msg += "" + err;
                }
                if (!msg) {
                    msg = "Aggregate Error";
                }
                return msg;
            },
            enumerable: false,
            configurable: true
        });
        AggregateError.prototype.toString = function () {
            return "AggregateError: " + "\r\n" + this.message;
        };
        return AggregateError;
    }(BaseError));
    exports.AggregateError = AggregateError;
    sys.isValidationError = function (obj) {
        return (!!obj && obj instanceof ValidationError);
    };
    var ValidationError = (function (_super) {
        __extends(ValidationError, _super);
        function ValidationError(validations, item) {
            var _this = this;
            var message = lang_2.ERRS.ERR_VALIDATION + "\r\n";
            validations.forEach(function (err, i) {
                if (i > 0) {
                    message = message + "\r\n";
                }
                if (!!err.fieldName) {
                    message = message + " " + lang_2.STRS.TEXT.txtField + ": '" + err.fieldName + "'  " + err.errors.join(", ");
                }
                else {
                    message = message + err.errors.join(", ");
                }
            });
            _this = _super.call(this, message) || this;
            _this._validations = validations;
            _this._item = item;
            return _this;
        }
        Object.defineProperty(ValidationError.prototype, "item", {
            get: function () {
                return this._item;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ValidationError.prototype, "validations", {
            get: function () {
                return this._validations;
            },
            enumerable: false,
            configurable: true
        });
        return ValidationError;
    }(BaseError));
    exports.ValidationError = ValidationError;
});
define("jriapp_shared/utils/error", ["require", "exports", "jriapp_shared/consts", "jriapp_shared/errors", "jriapp_shared/utils/coreutils"], function (require, exports, consts_2, errors_1, coreutils_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ERROR = void 0;
    var Indexer = coreutils_3.CoreUtils.Indexer;
    var ERROR = (function () {
        function ERROR() {
        }
        ERROR.addHandler = function (name, handler) {
            ERROR._handlers[name] = handler;
        };
        ERROR.removeHandler = function (name) {
            delete ERROR._handlers[name];
        };
        ERROR.handleError = function (sender, error, source) {
            if (ERROR.checkIsDummy(error)) {
                return true;
            }
            var handler, isHandled = false;
            handler = ERROR._handlers[consts_2.APP_NAME];
            if (!!handler) {
                if (handler === sender) {
                    handler = null;
                }
                else {
                    isHandled = handler.handleError(error, source);
                }
            }
            if (!isHandled) {
                handler = ERROR._handlers["*"];
                if (!!handler) {
                    if (handler === sender) {
                        handler = null;
                    }
                    else {
                        isHandled = handler.handleError(error, source);
                    }
                }
            }
            return isHandled;
        };
        ERROR.throwDummy = function (err) {
            if (ERROR.checkIsDummy(err)) {
                throw err;
            }
            else {
                throw new errors_1.DummyError(err);
            }
        };
        ERROR.checkIsDummy = function (error) {
            return !!error && !!error.isDummy;
        };
        ERROR.checkIsAbort = function (error) {
            return !!error && (error instanceof errors_1.AbortError);
        };
        ERROR.reThrow = function (ex, isHandled) {
            if (!isHandled) {
                throw ex;
            }
            else {
                return ERROR.throwDummy(ex);
            }
        };
        ERROR.abort = function (reason) {
            throw new errors_1.AbortError(reason);
        };
        ERROR._handlers = Indexer();
        return ERROR;
    }());
    exports.ERROR = ERROR;
});
define("jriapp_shared/utils/debug", ["require", "exports", "jriapp_shared/int"], function (require, exports, int_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEBUG = void 0;
    var DEBUG = (function () {
        function DEBUG() {
        }
        DEBUG.checkStartDebugger = function () {
            if (int_1.DebugLevel === 2) {
                debugger;
            }
        };
        DEBUG.isDebugging = function () {
            return int_1.DebugLevel > 0;
        };
        return DEBUG;
    }());
    exports.DEBUG = DEBUG;
});
define("jriapp_shared/utils/eventhelper", ["require", "exports", "jriapp_shared/lang", "jriapp_shared/utils/checks", "jriapp_shared/utils/strutils", "jriapp_shared/utils/coreutils", "jriapp_shared/utils/debug"], function (require, exports, lang_3, checks_4, strutils_2, coreutils_4, debug_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventHelper = void 0;
    var Indexer = coreutils_4.CoreUtils.Indexer, isFunc = checks_4.Checks.isFunc, format = strutils_2.StringUtils.format, debug = debug_1.DEBUG;
    var EventList = (function () {
        function EventList() {
        }
        EventList.Create = function () {
            return {};
        };
        EventList.Node = function (handler, context) {
            return { fn: handler, context: !context ? null : context };
        };
        EventList.count = function (list) {
            if (!list) {
                return 0;
            }
            var nsKeys, cnt = 0, obj;
            for (var j = 0; j <= 2; ++j) {
                obj = list[j];
                if (!!obj) {
                    nsKeys = Object.keys(obj);
                    for (var i = 0; i < nsKeys.length; ++i) {
                        cnt += obj[nsKeys[i]].length;
                    }
                }
            }
            return cnt;
        };
        EventList.append = function (list, node, ns, priority) {
            if (priority === void 0) { priority = 0; }
            if (!ns) {
                ns = "*";
            }
            var obj = list[priority];
            if (!obj) {
                list[priority] = obj = Indexer();
            }
            var arr = obj[ns];
            if (!arr) {
                obj[ns] = arr = [];
            }
            arr.push(node);
        };
        EventList.remove = function (list, ns) {
            if (!list) {
                return;
            }
            var nsKeys, obj;
            if (!ns) {
                ns = "*";
            }
            for (var j = 0; j <= 2; ++j) {
                obj = list[j];
                if (!!obj) {
                    if (ns === "*") {
                        nsKeys = Object.keys(obj);
                        for (var i = 0; i < nsKeys.length; ++i) {
                            delete obj[nsKeys[i]];
                        }
                    }
                    else {
                        delete obj[ns];
                    }
                }
            }
        };
        EventList.toArray = function (list) {
            if (!list) {
                return [];
            }
            var res = [];
            for (var k = 2; k >= 0; k -= 1) {
                var obj = list[k];
                if (!!obj) {
                    var nsKeys = Object.keys(obj);
                    for (var i = 0; i < nsKeys.length; ++i) {
                        var arr = obj[nsKeys[i]];
                        for (var j = 0; j < arr.length; ++j) {
                            res.push(arr[j]);
                        }
                    }
                }
            }
            return res;
        };
        return EventList;
    }());
    var evList = EventList;
    var EventHelper = (function () {
        function EventHelper() {
        }
        EventHelper.removeNS = function (ev, ns) {
            if (!ev) {
                return;
            }
            if (!ns) {
                ns = "*";
            }
            var keys = Object.keys(ev);
            for (var i = 0; i < keys.length; i += 1) {
                if (ns === "*") {
                    delete ev[keys[i]];
                }
                else {
                    evList.remove(ev[keys[i]], ns);
                }
            }
        };
        EventHelper.add = function (ev, name, handler, nmspace, context, priority) {
            if (!ev) {
                debug.checkStartDebugger();
                throw new Error(format(lang_3.ERRS.ERR_ASSERTION_FAILED, "ev is a valid object"));
            }
            if (!isFunc(handler)) {
                throw new Error(lang_3.ERRS.ERR_EVENT_INVALID_FUNC);
            }
            if (!name) {
                throw new Error(format(lang_3.ERRS.ERR_EVENT_INVALID, "[Empty]"));
            }
            var n = name, ns = !nmspace ? "*" : "" + nmspace;
            var list = ev[n];
            var node = evList.Node(handler, context);
            if (!list) {
                ev[n] = list = evList.Create();
            }
            evList.append(list, node, ns, priority);
        };
        EventHelper.remove = function (ev, name, nmspace) {
            if (!ev) {
                return null;
            }
            var ns = !nmspace ? "*" : "" + nmspace;
            if (!name) {
                EventHelper.removeNS(ev, ns);
            }
            else {
                if (ns === "*") {
                    delete ev[name];
                }
                else {
                    evList.remove(ev[name], ns);
                }
            }
        };
        EventHelper.count = function (ev, name) {
            if (!ev) {
                return 0;
            }
            return (!name) ? 0 : evList.toArray(ev[name]).length;
        };
        EventHelper.raise = function (sender, ev, name, args) {
            if (!ev) {
                return;
            }
            if (!!name) {
                var arr = evList.toArray(ev[name]), len = arr.length;
                for (var i = 0; i < len; i++) {
                    var node = arr[i];
                    node.fn.apply(node.context, [sender, args]);
                }
            }
        };
        EventHelper.raiseProp = function (sender, ev, prop, args) {
            if (!ev) {
                return;
            }
            if (!!prop) {
                var isAllProp = prop === "*";
                if (!isAllProp) {
                    EventHelper.raise(sender, ev, "0*", args);
                }
                EventHelper.raise(sender, ev, "0" + prop, args);
            }
        };
        return EventHelper;
    }());
    exports.EventHelper = EventHelper;
});
define("jriapp_shared/object", ["require", "exports", "jriapp_shared/lang", "jriapp_shared/utils/sysutils", "jriapp_shared/utils/coreutils", "jriapp_shared/utils/checks", "jriapp_shared/utils/error", "jriapp_shared/utils/eventhelper"], function (require, exports, lang_4, sysutils_2, coreutils_5, checks_5, error_1, eventhelper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseObject = exports.ObjectEvents = exports.dummyEvents = exports.createObjectEvents = exports.OBJ_EVENTS = exports.ObjState = exports.objSignature = void 0;
    var isHasProp = checks_5.Checks.isHasProp, evHelper = eventhelper_1.EventHelper, sys = sysutils_2.SysUtils, Indexer = coreutils_5.CoreUtils.Indexer, signature = { signature: "BaseObject" };
    exports.objSignature = signature;
    sys.isBaseObj = function (obj) {
        return (!!obj && obj.__objSig === signature);
    };
    var ObjState;
    (function (ObjState) {
        ObjState[ObjState["None"] = 0] = "None";
        ObjState[ObjState["Disposing"] = 1] = "Disposing";
        ObjState[ObjState["Disposed"] = 2] = "Disposed";
    })(ObjState = exports.ObjState || (exports.ObjState = {}));
    var OBJ_EVENTS;
    (function (OBJ_EVENTS) {
        OBJ_EVENTS["error"] = "error";
        OBJ_EVENTS["disposed"] = "disposed";
    })(OBJ_EVENTS = exports.OBJ_EVENTS || (exports.OBJ_EVENTS = {}));
    function createObjectEvents(owner) {
        return new ObjectEvents(owner);
    }
    exports.createObjectEvents = createObjectEvents;
    exports.dummyEvents = {
        canRaise: function (_name) { return false; },
        on: function (_name, _handler, _nmspace, _context, _priority) {
            throw new Error("Object disposed");
        },
        off: function (_name, _nmspace) { return void 0; },
        offNS: function (_nmspace) { return void 0; },
        raise: function (_name, _args) { return void 0; },
        raiseProp: function (_name) { return void 0; },
        onProp: function (_prop, _handler, _nmspace, _context, _priority) {
            throw new Error("Object disposed");
        },
        offProp: function (_prop, _nmspace) { return void 0; },
        addOnDisposed: function (_handler, _nmspace, _context, _priority) {
            throw new Error("Object disposed");
        },
        offOnDisposed: function (_nmspace) {
            throw new Error("Object disposed");
        },
        addOnError: function (_handler, _nmspace, _context, _priority) {
            throw new Error("Object disposed");
        },
        offOnError: function (_nmspace) {
            throw new Error("Object disposed");
        },
        get owner() {
            return null;
        }
    };
    var ObjectEvents = (function () {
        function ObjectEvents(owner) {
            this._events = null;
            this._owner = owner;
        }
        ObjectEvents.prototype.canRaise = function (name) {
            return !!this._events && evHelper.count(this._events, name) > 0;
        };
        ObjectEvents.prototype.on = function (name, handler, nmspace, context, priority) {
            if (!this._events) {
                this._events = Indexer();
            }
            evHelper.add(this._events, name, handler, nmspace, context, priority);
        };
        ObjectEvents.prototype.off = function (name, nmspace) {
            evHelper.remove(this._events, name, nmspace);
            if (!name && !nmspace) {
                this._events = null;
            }
        };
        ObjectEvents.prototype.offNS = function (nmspace) {
            this.off(null, nmspace);
        };
        ObjectEvents.prototype.raise = function (name, args) {
            if (!name) {
                throw new Error(lang_4.ERRS.ERR_EVENT_INVALID);
            }
            evHelper.raise(this._owner, this._events, name, args);
        };
        ObjectEvents.prototype.raiseProp = function (name) {
            if (!name) {
                throw new Error(lang_4.ERRS.ERR_PROP_NAME_EMPTY);
            }
            evHelper.raiseProp(this._owner, this._events, name, { property: name });
        };
        ObjectEvents.prototype.onProp = function (prop, handler, nmspace, context, priority) {
            if (!prop) {
                throw new Error(lang_4.ERRS.ERR_PROP_NAME_EMPTY);
            }
            if (!this._events) {
                this._events = Indexer();
            }
            evHelper.add(this._events, "0" + prop, handler, nmspace, context, priority);
        };
        ObjectEvents.prototype.offProp = function (prop, nmspace) {
            if (this._owner.getIsDisposed()) {
                return;
            }
            if (!!prop) {
                evHelper.remove(this._events, "0" + prop, nmspace);
            }
            else {
                evHelper.removeNS(this._events, nmspace);
            }
        };
        ObjectEvents.prototype.addOnDisposed = function (handler, nmspace, context, priority) {
            this.on("disposed", handler, nmspace, context, priority);
        };
        ObjectEvents.prototype.offOnDisposed = function (nmspace) {
            this.off("disposed", nmspace);
        };
        ObjectEvents.prototype.addOnError = function (handler, nmspace, context, priority) {
            this.on("error", handler, nmspace, context, priority);
        };
        ObjectEvents.prototype.offOnError = function (nmspace) {
            this.off("error", nmspace);
        };
        Object.defineProperty(ObjectEvents.prototype, "owner", {
            get: function () {
                return this._owner;
            },
            enumerable: false,
            configurable: true
        });
        return ObjectEvents;
    }());
    exports.ObjectEvents = ObjectEvents;
    var BaseObject = (function () {
        function BaseObject() {
            this._objState = 0;
            this._objEvents = null;
        }
        BaseObject.prototype.setDisposing = function () {
            this._objState = 1;
        };
        BaseObject.prototype._createObjEvents = function () {
            return new ObjectEvents(this);
        };
        BaseObject.prototype.isHasProp = function (prop) {
            return isHasProp(this, prop);
        };
        BaseObject.prototype.handleError = function (error, source) {
            if (error_1.ERROR.checkIsDummy(error)) {
                return true;
            }
            if (!error.message) {
                error = new Error("Error: " + error);
            }
            var args = { error: error, source: source, isHandled: false };
            this.objEvents.raise("error", args);
            var isHandled = args.isHandled;
            if (!isHandled) {
                isHandled = error_1.ERROR.handleError(this, error, source);
            }
            return isHandled;
        };
        BaseObject.prototype.getIsDisposed = function () {
            return this._objState === 2;
        };
        BaseObject.prototype.getIsStateDirty = function () {
            return this._objState !== 0;
        };
        BaseObject.prototype.dispose = function () {
            if (this._objState === 2) {
                return;
            }
            try {
                if (!!this._objEvents) {
                    this._objEvents.raise("disposed", {});
                    this._objEvents.off();
                    this._objEvents = null;
                }
            }
            finally {
                this._objState = 2;
            }
        };
        Object.defineProperty(BaseObject.prototype, "objEvents", {
            get: function () {
                if (this._objState === 2) {
                    return exports.dummyEvents;
                }
                if (!this._objEvents) {
                    this._objEvents = this._createObjEvents();
                }
                return this._objEvents;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseObject.prototype, "__objSig", {
            get: function () {
                return signature;
            },
            enumerable: false,
            configurable: true
        });
        return BaseObject;
    }());
    exports.BaseObject = BaseObject;
});
define("jriapp_shared/utils/queue", ["require", "exports", "jriapp_shared/utils/error", "jriapp_shared/utils/promise", "jriapp_shared/utils/coreutils"], function (require, exports, error_2, promise_1, coreutils_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createQueue = void 0;
    var Indexer = coreutils_6.CoreUtils.Indexer, error = error_2.ERROR, MAX_NUM = 99999900000;
    function createQueue(interval) {
        if (interval === void 0) { interval = 0; }
        var _tasks = [], _taskMap = Indexer(), _timer = null, _newTaskId = 1;
        var _queue = {
            cancel: function (taskId) {
                var task = _taskMap[taskId];
                if (!!task) {
                    task.func = null;
                }
            },
            enque: function (func) {
                var taskId = _newTaskId;
                _newTaskId += 1;
                var task = { taskId: taskId, func: func };
                _tasks.push(task);
                _taskMap[taskId] = task;
                if (!_timer) {
                    _timer = setTimeout(function () {
                        var arr = _tasks;
                        _timer = null;
                        _tasks = [];
                        if (_newTaskId > MAX_NUM) {
                            _newTaskId = 1;
                        }
                        try {
                            arr.forEach(function (task) {
                                try {
                                    if (!!task.func) {
                                        task.func();
                                    }
                                }
                                catch (err) {
                                    error.handleError(_queue, err, _queue);
                                }
                            });
                        }
                        finally {
                            _taskMap = Indexer();
                            for (var i = 0; i < _tasks.length; i += 1) {
                                _taskMap[_tasks[i].taskId] = _tasks[i];
                            }
                            ;
                        }
                    }, interval);
                }
                return taskId;
            },
            execAsync: function (func) {
                var deferred = promise_1.createDefer(true);
                var fn = function () {
                    try {
                        deferred.resolve(func());
                    }
                    catch (err) {
                        deferred.reject(err);
                    }
                };
                _queue.enque(fn);
                return deferred.promise();
            }
        };
        return _queue;
    }
    exports.createQueue = createQueue;
});
define("jriapp_shared/utils/promise", ["require", "exports", "jriapp_shared/utils/error", "jriapp_shared/errors", "jriapp_shared/utils/checks", "jriapp_shared/utils/queue", "jriapp_shared/utils/ipromise"], function (require, exports, error_3, errors_2, checks_6, queue_1, ipromise_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AbortablePromise = exports.CancellationTokenSource = exports.StatefulPromise = exports.promiseSerial = exports.race = exports.whenAll = exports.getTaskQueue = exports.createSyncDefer = exports.createDefer = void 0;
    __exportStar(ipromise_1, exports);
    var _undefined = checks_6.Checks._undefined, isFunc = checks_6.Checks.isFunc, isThenable = checks_6.Checks.isThenable, isArray = checks_6.Checks.isArray;
    var taskQueue = null;
    function createDefer(isSync) {
        return new StatefulPromise(null, isSync).deferred();
    }
    exports.createDefer = createDefer;
    function createSyncDefer() {
        return createDefer(true);
    }
    exports.createSyncDefer = createSyncDefer;
    function getTaskQueue() {
        if (!taskQueue) {
            taskQueue = new TaskQueue();
        }
        return taskQueue;
    }
    exports.getTaskQueue = getTaskQueue;
    function whenAll(promises) {
        var results = [], resolved = createDefer().resolve(null);
        var merged = promises.reduce(function (acc, p) { return acc.then(function () { return p; }).then(function (r) { results.push(r); return r; }); }, resolved);
        return merged.then(function () { return results; });
    }
    exports.whenAll = whenAll;
    function race(promises) {
        return new StatefulPromise(function (res, rej) {
            promises.forEach(function (p) { return p.then(res).then(_undefined, rej); });
        });
    }
    exports.race = race;
    function promiseSerial(funcs) {
        return funcs.reduce(function (promise, func) { return promise.then(function (result) { return func().then(function (res) { return result.concat(res); }); }); }, StatefulPromise.resolve([]));
    }
    exports.promiseSerial = promiseSerial;
    function dispatch(isSync, task) {
        if (!isSync) {
            getTaskQueue().enque(task);
        }
        else {
            task();
        }
    }
    var TaskQueue = (function () {
        function TaskQueue() {
            this._queue = queue_1.createQueue(0);
        }
        TaskQueue.prototype.enque = function (task) {
            return this._queue.enque(task);
        };
        TaskQueue.prototype.cancel = function (taskId) {
            this._queue.cancel(taskId);
        };
        return TaskQueue;
    }());
    var Callback = (function () {
        function Callback(isSync, successCB, errorCB) {
            this._isSync = isSync;
            this._successCB = successCB;
            this._errorCB = errorCB;
            this._deferred = new StatefulPromise(null, isSync).deferred();
        }
        Callback.prototype.resolve = function (value, defer) {
            var _this = this;
            if (!isFunc(this._successCB)) {
                this._deferred.resolve(value);
                return;
            }
            if (!defer) {
                this._dispatch(this._successCB, value);
            }
            else {
                dispatch(this._isSync, function () { return _this._dispatch(_this._successCB, value); });
            }
        };
        Callback.prototype.reject = function (error, defer) {
            var _this = this;
            if (!isFunc(this._errorCB)) {
                this._deferred.reject(error);
                return;
            }
            if (!defer) {
                this._dispatch(this._errorCB, error);
            }
            else {
                dispatch(this._isSync, function () { return _this._dispatch(_this._errorCB, error); });
            }
        };
        Callback.prototype._dispatch = function (callback, arg) {
            try {
                var result = callback(arg);
                this._deferred.resolve(result);
            }
            catch (err) {
                this._deferred.reject(err);
            }
        };
        Object.defineProperty(Callback.prototype, "deferred", {
            get: function () {
                return this._deferred;
            },
            enumerable: false,
            configurable: true
        });
        return Callback;
    }());
    var Deferred = (function () {
        function Deferred(promise, isSync) {
            if (isSync === void 0) { isSync = false; }
            this._promise = promise;
            this._isSync = isSync;
            this._value = _undefined;
            this._error = _undefined;
            this._state = 0;
            this._stack = [];
        }
        Deferred.prototype._resolve = function (value) {
            var _this = this;
            var pending = true;
            try {
                if (isThenable(value)) {
                    if (value === this._promise) {
                        throw new TypeError("recursive resolution");
                    }
                    var fnThen = value.then;
                    this._state = 1;
                    fnThen.call(value, function (result) {
                        if (pending) {
                            pending = false;
                            _this._resolve(result);
                        }
                    }, function (error) {
                        if (pending) {
                            pending = false;
                            _this._reject(error);
                        }
                    });
                }
                else {
                    this._state = 1;
                    dispatch(this._isSync, function () {
                        _this._state = 2;
                        _this._value = value;
                        var stackSize = _this._stack.length;
                        for (var i = 0; i < stackSize; i++) {
                            _this._stack[i].resolve(value, false);
                        }
                        _this._stack.splice(0, stackSize);
                    });
                }
            }
            catch (err) {
                if (pending) {
                    this._reject(err);
                }
            }
            return this;
        };
        Deferred.prototype._reject = function (error) {
            var _this = this;
            this._state = 1;
            dispatch(this._isSync, function () {
                _this._state = 3;
                _this._error = error;
                var stackSize = _this._stack.length;
                for (var i = 0; i < stackSize; i++) {
                    _this._stack[i].reject(error, false);
                }
                _this._stack.splice(0, stackSize);
            });
            return this;
        };
        Deferred.prototype._then = function (successCB, errorCB) {
            if (!isFunc(successCB) && !isFunc(errorCB)) {
                return this._promise;
            }
            var cb = new Callback(this._isSync, successCB, errorCB);
            switch (this._state) {
                case 0:
                case 1:
                    this._stack.push(cb);
                    break;
                case 2:
                    cb.resolve(this._value, true);
                    break;
                case 3:
                    cb.reject(this._error, true);
                    break;
            }
            return cb.deferred.promise();
        };
        Deferred.prototype.resolve = function (value) {
            if (this._state !== 0) {
                return this.promise();
            }
            return this._resolve(value).promise();
        };
        Deferred.prototype.reject = function (error) {
            if (this._state !== 0) {
                return this.promise();
            }
            return this._reject(error).promise();
        };
        Deferred.prototype.promise = function () {
            return this._promise;
        };
        Deferred.prototype.state = function () {
            return this._state;
        };
        return Deferred;
    }());
    var StatefulPromise = (function () {
        function StatefulPromise(fn, isSync) {
            if (isSync === void 0) { isSync = false; }
            var deferred = new Deferred(this, isSync);
            this._deferred = deferred;
            if (!!fn) {
                getTaskQueue().enque(function () {
                    fn(function (res) { return deferred.resolve(res); }, function (err) { return deferred.reject(err); });
                });
            }
        }
        StatefulPromise.prototype.then = function (onFulfilled, onRejected) {
            return this._deferred._then(onFulfilled, onRejected);
        };
        StatefulPromise.prototype.catch = function (onRejected) {
            return this._deferred._then(_undefined, onRejected);
        };
        StatefulPromise.prototype.finally = function (onFinally) {
            return this._deferred._then(function (res) {
                onFinally();
                return res;
            }, function (err) {
                onFinally();
                return StatefulPromise.reject(err);
            });
        };
        StatefulPromise.all = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (args.length === 1 && isArray(args[0])) ? whenAll(args[0]) : whenAll(args);
        };
        StatefulPromise.race = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (args.length === 1 && isArray(args[0])) ? race(args[0]) : race(args);
        };
        StatefulPromise.reject = function (reason, isSync) {
            var deferred = createDefer(isSync);
            deferred.reject(reason);
            return deferred.promise();
        };
        StatefulPromise.resolve = function (value, isSync) {
            var deferred = createDefer(isSync);
            deferred.resolve(value);
            return deferred.promise();
        };
        StatefulPromise.prototype.state = function () {
            return this._deferred.state();
        };
        StatefulPromise.prototype.deferred = function () {
            return this._deferred;
        };
        return StatefulPromise;
    }());
    exports.StatefulPromise = StatefulPromise;
    var CancellationTokenSource = (function () {
        function CancellationTokenSource() {
            this._callbacks = [];
            this._isCancelled = false;
            this._reason = "";
        }
        CancellationTokenSource.prototype._cancel = function () {
            var callbacks = this._callbacks;
            this._callbacks = [];
            var reason = this._reason;
            getTaskQueue().enque(function () {
                for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
                    var callback = callbacks_1[_i];
                    callback(reason);
                }
            });
        };
        CancellationTokenSource.prototype.register = function (fn) {
            this._callbacks.push(fn);
            if (this._isCancelled) {
                this._cancel();
            }
        };
        CancellationTokenSource.prototype.cancel = function (reason) {
            if (this._isCancelled) {
                return;
            }
            this._isCancelled = true;
            this._reason = reason;
            this._cancel();
        };
        Object.defineProperty(CancellationTokenSource.prototype, "isCancelled", {
            get: function () {
                return this._isCancelled;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CancellationTokenSource.prototype, "token", {
            get: function () {
                return this;
            },
            enumerable: false,
            configurable: true
        });
        return CancellationTokenSource;
    }());
    exports.CancellationTokenSource = CancellationTokenSource;
    var AbortablePromise = (function (_super) {
        __extends(AbortablePromise, _super);
        function AbortablePromise(fn) {
            var _this = _super.call(this, null, false) || this;
            _this._tokenSource = null;
            _this._aborted = false;
            if (!!fn) {
                _this._tokenSource = new CancellationTokenSource();
                var self_1 = _this, deferred_1 = self_1.deferred(), tokenSource_1 = self_1._tokenSource;
                self_1.catch(function (err) {
                    if (!!self_1._tokenSource && error_3.ERROR.checkIsAbort(err)) {
                        self_1._tokenSource.cancel();
                    }
                }).finally(function () {
                    self_1._tokenSource = null;
                });
                getTaskQueue().enque(function () {
                    fn(function (res) { return deferred_1.resolve(res); }, function (err) { return deferred_1.reject(err); }, tokenSource_1.token);
                });
            }
            return _this;
        }
        AbortablePromise.prototype.abort = function (reason) {
            var self = this;
            if (!self._aborted) {
                self._aborted = true;
                self.deferred().reject(new errors_2.AbortError(reason));
            }
        };
        return AbortablePromise;
    }(StatefulPromise));
    exports.AbortablePromise = AbortablePromise;
});
define("jriapp_shared/utils/debounce", ["require", "exports", "jriapp_shared/utils/promise", "jriapp_shared/utils/error"], function (require, exports, promise_2, error_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Debounce = void 0;
    var error = error_4.ERROR, win = window;
    var Debounce = (function () {
        function Debounce(interval) {
            if (interval === void 0) { interval = 0; }
            this._timer = null;
            this._interval = interval;
            this._fn = null;
        }
        Debounce.prototype.dispose = function () {
            this.cancel();
            this._timer = void 0;
        };
        Debounce.prototype.enque = function (fn) {
            var _this = this;
            if (this.getIsDisposed()) {
                return;
            }
            if (!fn) {
                throw new Error("Debounce: Invalid Operation");
            }
            this._fn = fn;
            if (!!this._interval && !!this._timer) {
                clearTimeout(this._timer);
                this._timer = null;
            }
            if (!this._timer) {
                var callback = function () {
                    var fn = _this._fn;
                    _this._timer = null;
                    _this._fn = null;
                    if (!!fn) {
                        try {
                            fn();
                        }
                        catch (err) {
                            error.handleError(win, err, win);
                        }
                    }
                };
                if (!this._interval) {
                    this._timer = promise_2.getTaskQueue().enque(callback);
                }
                else {
                    this._timer = setTimeout(callback, this._interval);
                }
            }
        };
        Debounce.prototype.cancel = function () {
            if (!!this._timer) {
                if (!this._interval) {
                    promise_2.getTaskQueue().cancel(this._timer);
                }
                else {
                    clearTimeout(this._timer);
                }
            }
            this._timer = null;
            this._fn = null;
        };
        Object.defineProperty(Debounce.prototype, "interval", {
            get: function () {
                return this._interval;
            },
            enumerable: false,
            configurable: true
        });
        Debounce.prototype.getIsDisposed = function () {
            return this._timer === void 0;
        };
        return Debounce;
    }());
    exports.Debounce = Debounce;
});
define("jriapp_shared/utils/jsonbag", ["require", "exports", "jriapp_shared/object", "jriapp_shared/utils/coreutils", "jriapp_shared/utils/strutils", "jriapp_shared/utils/sysutils", "jriapp_shared/utils/checks", "jriapp_shared/utils/debounce", "jriapp_shared/errors"], function (require, exports, object_1, coreutils_7, strutils_3, sysutils_3, checks_7, debounce_1, errors_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JsonBag = void 0;
    var forEach = coreutils_7.CoreUtils.forEach, getValue = coreutils_7.CoreUtils.getValue, setValue = coreutils_7.CoreUtils.setValue, Indexer = coreutils_7.CoreUtils.Indexer, startsWith = strutils_3.StringUtils.startsWith, trimBrackets = strutils_3.StringUtils.trimBrackets, isArray = checks_7.Checks.isArray, _undefined = checks_7.Checks._undefined, sys = sysutils_3.SysUtils;
    var BAG_EVENTS;
    (function (BAG_EVENTS) {
        BAG_EVENTS["errors_changed"] = "errors_changed";
        BAG_EVENTS["validate_bag"] = "validate_bag";
        BAG_EVENTS["validate_field"] = "validate_field";
    })(BAG_EVENTS || (BAG_EVENTS = {}));
    var JsonBag = (function (_super) {
        __extends(JsonBag, _super);
        function JsonBag(json, jsonChanged) {
            var _this = _super.call(this) || this;
            _this._json = void 0;
            _this._val = Indexer();
            _this._saveVal = null;
            _this._debounce = new debounce_1.Debounce();
            _this.resetJson(json);
            _this._jsonChanged = jsonChanged;
            _this._errors = Indexer();
            return _this;
        }
        JsonBag.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this._debounce.dispose();
            this._jsonChanged = null;
            this._json = _undefined;
            this._val = Indexer();
            _super.prototype.dispose.call(this);
        };
        JsonBag.prototype.isHasProp = function (prop) {
            if (startsWith(prop, "[")) {
                return true;
            }
            return _super.prototype.isHasProp.call(this, prop);
        };
        JsonBag.prototype.addOnValidateBag = function (fn, nmspace, context) {
            this.objEvents.on("validate_bag", fn, nmspace, context);
        };
        JsonBag.prototype.offOnValidateBag = function (nmspace) {
            this.objEvents.off("validate_bag", nmspace);
        };
        JsonBag.prototype.addOnValidateField = function (fn, nmspace, context) {
            this.objEvents.on("validate_field", fn, nmspace, context);
        };
        JsonBag.prototype.offOnValidateField = function (nmspace) {
            this.objEvents.off("validate_field", nmspace);
        };
        JsonBag.prototype.addOnErrorsChanged = function (fn, nmspace, context) {
            this.objEvents.on("errors_changed", fn, nmspace, context);
        };
        JsonBag.prototype.offOnErrorsChanged = function (nmspace) {
            this.objEvents.off("errors_changed", nmspace);
        };
        JsonBag.prototype.onChanged = function () {
            var _this = this;
            this._debounce.enque(function () {
                if (!!_this._jsonChanged) {
                    _this._jsonChanged(_this._json);
                }
            });
        };
        JsonBag.prototype.resetJson = function (json) {
            if (json === void 0) { json = null; }
            if (this._json !== json) {
                this._json = json;
                this._val = (!json ? {} : JSON.parse(json));
                this.objEvents.raiseProp("json");
                this.objEvents.raiseProp("val");
                this.objEvents.raiseProp("[*]");
            }
        };
        JsonBag.prototype.updateJson = function () {
            var json = JSON.stringify(this._val);
            if (json !== this._json) {
                this._json = json;
                this.onChanged();
                this.objEvents.raiseProp("json");
                return true;
            }
            return false;
        };
        JsonBag.prototype._validateBag = function () {
            var args = {
                bag: this,
                result: []
            };
            this.objEvents.raise("validate_bag", args);
            return (!!args.result) ? args.result : [];
        };
        JsonBag.prototype._validateField = function (fieldName) {
            var args = {
                bag: this,
                fieldName: fieldName,
                errors: []
            };
            this.objEvents.raise("validate_field", args);
            return (!!args.errors && args.errors.length > 0) ? { fieldName: fieldName, errors: args.errors } : null;
        };
        JsonBag.prototype._onErrorsChanged = function () {
            this.objEvents.raise("errors_changed", {});
        };
        JsonBag.prototype._addErrors = function (errors) {
            var self = this;
            for (var _i = 0, errors_4 = errors; _i < errors_4.length; _i++) {
                var err = errors_4[_i];
                self._addError(err.fieldName, err.errors, true);
            }
            this._onErrorsChanged();
        };
        JsonBag.prototype._addError = function (fieldName, errors, ignoreChangeErrors) {
            if (!fieldName) {
                fieldName = "*";
            }
            if (!(isArray(errors) && errors.length > 0)) {
                this._removeError(fieldName, ignoreChangeErrors);
                return;
            }
            var itemErrors = this._errors;
            itemErrors[fieldName] = errors;
            if (!ignoreChangeErrors) {
                this._onErrorsChanged();
            }
        };
        JsonBag.prototype._removeError = function (fieldName, ignoreChangeErrors) {
            var itemErrors = this._errors;
            if (!itemErrors) {
                return false;
            }
            if (!fieldName) {
                fieldName = "*";
            }
            if (!itemErrors[fieldName]) {
                return false;
            }
            delete itemErrors[fieldName];
            if (!ignoreChangeErrors) {
                this._onErrorsChanged();
            }
            return true;
        };
        JsonBag.prototype._removeAllErrors = function () {
            this._errors = Indexer();
            this._onErrorsChanged();
        };
        JsonBag.prototype.getIsHasErrors = function () {
            return !!this._errors && Object.keys(this._errors).length > 0;
        };
        JsonBag.prototype.getFieldErrors = function (fieldName) {
            var bagErrors = this._errors;
            if (!bagErrors) {
                return [];
            }
            var name = fieldName;
            if (!fieldName) {
                fieldName = "*";
            }
            if (!bagErrors[fieldName]) {
                return [];
            }
            if (fieldName === "*") {
                name = null;
            }
            return [
                { fieldName: name, errors: bagErrors[fieldName] }
            ];
        };
        JsonBag.prototype.getAllErrors = function () {
            var bagErrors = this._errors;
            if (!bagErrors) {
                return [];
            }
            var res = [];
            forEach(bagErrors, function (name) {
                var fieldName = null;
                if (name !== "*") {
                    fieldName = name;
                }
                res.push({ fieldName: fieldName, errors: bagErrors[name] });
            });
            return res;
        };
        JsonBag.prototype.getIErrorNotification = function () {
            return this;
        };
        JsonBag.prototype.beginEdit = function () {
            if (!this.isEditing) {
                this._saveVal = JSON.stringify(this._val);
                return true;
            }
            return false;
        };
        JsonBag.prototype.endEdit = function () {
            if (this.isEditing) {
                this._removeAllErrors();
                var validationInfos = this._validateBag();
                if (validationInfos.length > 0) {
                    this._addErrors(validationInfos);
                }
                if (this.getIsHasErrors()) {
                    return false;
                }
                this._saveVal = null;
                this.updateJson();
                return true;
            }
            return false;
        };
        JsonBag.prototype.cancelEdit = function () {
            if (this.isEditing) {
                this._val = JSON.parse(this._saveVal);
                this._saveVal = null;
                this._removeAllErrors();
                this.objEvents.raiseProp("[*]");
                return true;
            }
            return false;
        };
        Object.defineProperty(JsonBag.prototype, "isEditing", {
            get: function () {
                return !!this._saveVal;
            },
            enumerable: false,
            configurable: true
        });
        JsonBag.prototype.getProp = function (name) {
            var fieldName = trimBrackets(name);
            return getValue(this._val, fieldName);
        };
        JsonBag.prototype.setProp = function (name, val) {
            var old = this.getProp(name);
            if (old !== val) {
                try {
                    var fieldName = trimBrackets(name);
                    setValue(this._val, fieldName, val, false);
                    sys.raiseProp(this, name);
                    this._removeError(name);
                    var validationInfo = this._validateField(name);
                    if (!!validationInfo && validationInfo.errors.length > 0) {
                        throw new errors_3.ValidationError([validationInfo], this);
                    }
                }
                catch (ex) {
                    var error = void 0;
                    if (sys.isValidationError(ex)) {
                        error = ex;
                    }
                    else {
                        error = new errors_3.ValidationError([
                            { fieldName: name, errors: [ex.message] }
                        ], this);
                    }
                    this._addError(name, error.validations[0].errors);
                    throw error;
                }
            }
        };
        Object.defineProperty(JsonBag.prototype, "isPropertyBag", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(JsonBag.prototype, "val", {
            get: function () {
                return this._val;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(JsonBag.prototype, "json", {
            get: function () {
                return this._json;
            },
            enumerable: false,
            configurable: true
        });
        JsonBag.prototype.toString = function () {
            return "JsonBag";
        };
        return JsonBag;
    }(object_1.BaseObject));
    exports.JsonBag = JsonBag;
});
define("jriapp_shared/utils/logger", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LOGGER = void 0;
    var LOGGER = (function () {
        function LOGGER() {
        }
        LOGGER.log = function (str) {
            console.log(str);
        };
        LOGGER.warn = function (str) {
            console.warn(str);
        };
        LOGGER.error = function (str) {
            console.error(str);
        };
        return LOGGER;
    }());
    exports.LOGGER = LOGGER;
});
define("jriapp_shared/utils/asyncutils", ["require", "exports", "jriapp_shared/utils/promise", "jriapp_shared/utils/checks"], function (require, exports, promise_3, checks_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AsyncUtils = void 0;
    var isString = checks_8.Checks.isString, isFunc = checks_8.Checks.isFunc, _whenAll = promise_3.whenAll, _race = promise_3.race, _getTaskQueue = promise_3.getTaskQueue, _createDefer = promise_3.createDefer;
    var AsyncUtils = (function () {
        function AsyncUtils() {
        }
        AsyncUtils.createDeferred = function (isSync) {
            return _createDefer(isSync);
        };
        AsyncUtils.reject = function (reason, isSync) {
            return promise_3.StatefulPromise.reject(reason, isSync);
        };
        AsyncUtils.resolve = function (value, isSync) {
            return promise_3.StatefulPromise.resolve(value, isSync);
        };
        AsyncUtils.promiseSerial = function (funcs) {
            return promise_3.promiseSerial(funcs);
        };
        AsyncUtils.whenAll = function (args) {
            return _whenAll(args);
        };
        AsyncUtils.race = function (promises) {
            return _race(promises);
        };
        AsyncUtils.getTaskQueue = function () {
            return _getTaskQueue();
        };
        AsyncUtils.delay = function (funcORvalue, time) {
            if (time === void 0) { time = 0; }
            return new promise_3.StatefulPromise(function (resolve, reject) {
                setTimeout(function () {
                    try {
                        if (isFunc(funcORvalue)) {
                            resolve(funcORvalue());
                        }
                        else {
                            resolve(funcORvalue);
                        }
                    }
                    catch (err) {
                        reject(err);
                    }
                }, time);
            }, true);
        };
        AsyncUtils.parseJSON = function (res) {
            return AsyncUtils.delay(function () {
                return (isString(res)) ? JSON.parse(res) : res;
            });
        };
        return AsyncUtils;
    }());
    exports.AsyncUtils = AsyncUtils;
});
define("jriapp_shared/utils/http", ["require", "exports", "jriapp_shared/utils/strutils", "jriapp_shared/errors", "jriapp_shared/utils/coreutils", "jriapp_shared/utils/promise"], function (require, exports, strUtils_2, errors_5, coreutils_8, promise_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HttpUtils = void 0;
    var forEach = coreutils_8.CoreUtils.forEach, merge = coreutils_8.CoreUtils.merge, Indexer = coreutils_8.CoreUtils.Indexer, startsWith = strUtils_2.StringUtils.startsWith, fastTrim = strUtils_2.StringUtils.fastTrim;
    var HttpUtils = (function () {
        function HttpUtils() {
        }
        HttpUtils.isStatusOK = function (status) {
            var chk = fastTrim("" + status);
            return chk.length === 3 && startsWith(chk, "2");
        };
        HttpUtils._getXMLRequest = function (url, method, deferred, headers) {
            var _a;
            var req = new XMLHttpRequest();
            req.open(method, url, true);
            req.responseType = "text";
            (_a = deferred.token) === null || _a === void 0 ? void 0 : _a.register(function () { req.abort(); });
            req.onload = function () {
                var status = "" + req.status;
                if (status === "200") {
                    var res = req.response;
                    deferred.resolve(res);
                }
                else {
                    if (HttpUtils.isStatusOK(status)) {
                        deferred.reject(new errors_5.DummyError(new Error("Status: \"" + status + "\" loading from URL: \"" + url + "\"")));
                    }
                    else {
                        deferred.reject(new Error("Error: \"" + status + "\" to load from URL: \"" + url + "\""));
                    }
                }
            };
            req.onerror = function () {
                deferred.reject(new Error("Error: \"" + req.status + "\" to load from URL: \"" + url + "\""));
            };
            req.ontimeout = function () {
                deferred.reject(new Error("Error: \"Request Timeout\" to load from URL: \"" + url + "\""));
            };
            req.onabort = function () {
                deferred.reject(new Error("HTTP Request Operation Aborted for URL: \"" + url + "\""));
            };
            req.timeout = HttpUtils.ajaxTimeOut * 1000;
            var _headers = merge(HttpUtils.defaultHeaders);
            _headers = merge(headers, _headers);
            forEach(_headers, function (name, val) {
                req.setRequestHeader(name, val);
            });
            return req;
        };
        HttpUtils.postAjax = function (url, postData, headers) {
            var _headers = merge(headers, { "Content-Type": "application/json; charset=utf-8" });
            return new promise_4.AbortablePromise(function (resolve, reject, token) {
                var req = HttpUtils._getXMLRequest(url, "POST", { resolve: resolve, reject: reject, token: token }, _headers);
                req.send(postData);
            });
        };
        HttpUtils.getAjax = function (url, headers) {
            return new promise_4.AbortablePromise(function (resolve, reject, token) {
                var req = HttpUtils._getXMLRequest(url, "GET", { resolve: resolve, reject: reject, token: token }, headers);
                req.send(null);
            });
        };
        HttpUtils.defaultHeaders = Indexer();
        HttpUtils.ajaxTimeOut = 600;
        return HttpUtils;
    }());
    exports.HttpUtils = HttpUtils;
});
define("jriapp_shared/utils/arrhelper", ["require", "exports", "jriapp_shared/utils/coreutils"], function (require, exports, coreutils_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArrayHelper = void 0;
    var toArray = coreutils_9.CoreUtils.toArray, Indexer = coreutils_9.CoreUtils.Indexer;
    var ArrayHelper = (function () {
        function ArrayHelper() {
        }
        ArrayHelper.clone = function (arr) {
            if (arr.length === 1) {
                return [arr[0]];
            }
            else {
                return Array.apply(null, arr);
            }
        };
        ArrayHelper.fromList = function (list) {
            if (!list)
                return [];
            return [].slice.call(list);
        };
        ArrayHelper.merge = function (arrays) {
            if (!arrays)
                return [];
            return [].concat.apply([], arrays);
        };
        ArrayHelper.distinct = function (arr) {
            if (!arr)
                return [];
            var map = Indexer(), len = arr.length;
            for (var i = 0; i < len; i += 1) {
                map["" + arr[i]] = arr[i];
            }
            return toArray(map);
        };
        ArrayHelper.toMap = function (arr, key) {
            var map = Indexer();
            if (!arr)
                return map;
            var len = arr.length;
            for (var i = 0; i < len; i += 1) {
                map[key(arr[i])] = arr[i];
            }
            return map;
        };
        ArrayHelper.remove = function (array, obj) {
            var i = array.indexOf(obj);
            if (i > -1) {
                array.splice(i, 1);
            }
            return i;
        };
        ArrayHelper.removeIndex = function (array, index) {
            var isOk = index > -1 && array.length > index;
            array.splice(index, 1);
            return isOk;
        };
        ArrayHelper.insert = function (array, obj, pos) {
            array.splice(pos, 0, obj);
        };
        return ArrayHelper;
    }());
    exports.ArrayHelper = ArrayHelper;
});
define("jriapp_shared/utils/dates", ["require", "exports", "jriapp_shared/utils/strutils", "jriapp_shared/utils/checks", "jriapp_shared/lang"], function (require, exports, strutils_4, checks_9, lang_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DateUtils = exports.TIME_KIND = void 0;
    var isNt = checks_9.Checks.isNt, formatStr = strutils_4.StringUtils.format;
    var TIME_KIND;
    (function (TIME_KIND) {
        TIME_KIND["YEAR"] = "year";
        TIME_KIND["MONTH"] = "month";
        TIME_KIND["WEEK"] = "week";
        TIME_KIND["DAY"] = "day";
        TIME_KIND["HOUR"] = "hour";
        TIME_KIND["MINUTE"] = "minute";
        TIME_KIND["SECOND"] = "second";
    })(TIME_KIND = exports.TIME_KIND || (exports.TIME_KIND = {}));
    function strToDate(val, format) {
        if (format === void 0) { format = "YYYYMMDD"; }
        if (!val) {
            return null;
        }
        var m = moment(val, format);
        if (!m.isValid()) {
            throw new Error(formatStr(lang_5.ERRS.ERR_CONV_INVALID_DATE, val));
        }
        return m.toDate();
    }
    function dateToStr(dt, format) {
        if (format === void 0) { format = "YYYYMMDD"; }
        if (isNt(dt)) {
            return "";
        }
        return moment(dt).format(format);
    }
    function add(dt, val, period) {
        return moment(dt).add(val, period).toDate();
    }
    var DateUtils = (function () {
        function DateUtils() {
        }
        DateUtils.isValid = function (val, format) {
            if (format === void 0) { format = "YYYYMMDD"; }
            if (!val) {
                return false;
            }
            var m = moment(val, format);
            return m.isValid();
        };
        DateUtils.strToDatePartial = function (format) {
            return function (val) { return strToDate(val, format); };
        };
        DateUtils.dateToStrPartial = function (format) {
            return function (dt) { return dateToStr(dt, format); };
        };
        DateUtils.addPartial1 = function (period) {
            return function (dt, val) { return add(dt, val, period); };
        };
        DateUtils.addPartial2 = function (period) {
            return function (val) { return function (dt) { return add(dt, val, period); }; };
        };
        DateUtils.addPartial3 = function (period) {
            return function (dt) { return function (val) { return add(dt, val, period); }; };
        };
        DateUtils.trim = function (dt) {
            return moment(dt).startOf("day").toDate();
        };
        DateUtils.today = function () {
            return moment().startOf("day").toDate();
        };
        DateUtils.now = function () {
            return new Date();
        };
        DateUtils.yesterday = function (dt) {
            return moment(dt).startOf("day").add(-1, "day").toDate();
        };
        DateUtils.tomorrow = function (dt) {
            return moment(dt).startOf("day").add(1, "day").toDate();
        };
        DateUtils.startOf = function (period, dt) {
            return moment(dt).startOf(period).toDate();
        };
        DateUtils.endOf = function (period, dt) {
            return moment(dt).endOf(period).toDate();
        };
        DateUtils.strToDate = strToDate;
        DateUtils.dateToStr = dateToStr;
        DateUtils.add = add;
        return DateUtils;
    }());
    exports.DateUtils = DateUtils;
});
define("jriapp_shared/utils/utils", ["require", "exports", "jriapp_shared/utils/coreutils", "jriapp_shared/utils/debug", "jriapp_shared/utils/error", "jriapp_shared/utils/logger", "jriapp_shared/utils/sysutils", "jriapp_shared/utils/asyncutils", "jriapp_shared/utils/http", "jriapp_shared/utils/strutils", "jriapp_shared/utils/checks", "jriapp_shared/utils/arrhelper", "jriapp_shared/utils/promise", "jriapp_shared/utils/dates"], function (require, exports, coreutils_10, debug_2, error_5, logger_1, sysutils_4, asyncutils_1, http_1, strutils_5, checks_10, arrhelper_1, promise_5, dates_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Utils = void 0;
    var Utils = (function () {
        function Utils() {
        }
        Utils.check = checks_10.Checks;
        Utils.str = strutils_5.StringUtils;
        Utils.arr = arrhelper_1.ArrayHelper;
        Utils.http = http_1.HttpUtils;
        Utils.core = coreutils_10.CoreUtils;
        Utils.async = asyncutils_1.AsyncUtils;
        Utils.err = error_5.ERROR;
        Utils.log = logger_1.LOGGER;
        Utils.debug = debug_2.DEBUG;
        Utils.sys = sysutils_4.SysUtils;
        Utils.queue = promise_5.getTaskQueue();
        Utils.dates = dates_1.DateUtils;
        return Utils;
    }());
    exports.Utils = Utils;
});
define("jriapp_shared/utils/waitqueue", ["require", "exports", "jriapp_shared/object", "jriapp_shared/utils/coreutils"], function (require, exports, object_2, coreutils_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WaitQueue = void 0;
    var getNewID = coreutils_11.CoreUtils.getNewID, Indexer = coreutils_11.CoreUtils.Indexer, extend = coreutils_11.CoreUtils.extend;
    var WaitQueue = (function (_super) {
        __extends(WaitQueue, _super);
        function WaitQueue(owner) {
            var _this = _super.call(this) || this;
            _this._uniqueID = getNewID("wq");
            _this._owner = owner;
            _this._queue = Indexer();
            return _this;
        }
        WaitQueue.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this._owner.objEvents.offNS(this.uniqueID);
            this._queue = Indexer();
            this._owner = null;
            _super.prototype.dispose.call(this);
        };
        WaitQueue.prototype._checkQueue = function (prop, value) {
            if (!this._owner || this._owner.getIsStateDirty()) {
                return;
            }
            var self = this, propQueue = this._queue[prop];
            var task;
            if (!propQueue || propQueue.length === 0) {
                return;
            }
            var i, firstWinsTask = null;
            var groups = { group: null, tasks: [] }, found = [], forRemoval = [];
            for (i = 0; i < propQueue.length; i += 1) {
                task = propQueue[i];
                if (task.predicate(value)) {
                    if (!task.group && groups.tasks.length === 0) {
                        firstWinsTask = task;
                        break;
                    }
                    else if (!!task.group) {
                        if (!groups.group) {
                            groups.group = task.group;
                        }
                        if (groups.group === task.group) {
                            groups.tasks.push(task);
                        }
                    }
                }
            }
            if (!!firstWinsTask) {
                found.push(firstWinsTask);
                forRemoval.push(firstWinsTask);
            }
            else {
                while (groups.tasks.length > 0) {
                    task = groups.tasks.pop();
                    if (!firstWinsTask) {
                        firstWinsTask = task;
                    }
                    if (firstWinsTask.lastWins) {
                        if (found.length === 0) {
                            found.push(task);
                        }
                    }
                    else {
                        found.push(task);
                    }
                    forRemoval.push(task);
                }
            }
            try {
                if (found.length > 0) {
                    i = propQueue.length;
                    while (i > 0) {
                        i -= 1;
                        if (forRemoval.indexOf(propQueue[i]) > -1) {
                            propQueue.splice(i, 1);
                        }
                    }
                    for (var _i = 0, found_1 = found; _i < found_1.length; _i++) {
                        var task_1 = found_1[_i];
                        try {
                            task_1.action.apply(self._owner, task_1.args);
                        }
                        catch (ex) {
                            self._owner.handleError(ex, self);
                        }
                    }
                }
            }
            finally {
                if (propQueue.length === 0) {
                    delete this._queue[prop];
                    this._owner.objEvents.offProp(prop, this.uniqueID);
                }
            }
        };
        WaitQueue.prototype.enQueue = function (item) {
            var opts = extend({
                prop: "",
                groupName: null,
                predicate: null,
                action: null,
                actionArgs: [],
                lastWins: false
            }, item);
            var self = this;
            if (!this._owner) {
                return;
            }
            var property = opts.prop;
            var propQueue = this._queue[property];
            if (!propQueue) {
                propQueue = [];
                this._queue[property] = propQueue;
                this._owner.objEvents.onProp(property, function () {
                    setTimeout(function () {
                        if (self.getIsStateDirty()) {
                            return;
                        }
                        self._checkQueue(property, self._owner[property]);
                    }, 0);
                }, self.uniqueID);
            }
            var task = {
                predicate: opts.predicate,
                action: opts.action,
                group: opts.groupName,
                lastWins: opts.lastWins,
                args: (!opts.actionArgs ? [] : opts.actionArgs)
            };
            propQueue.push(task);
            self._checkQueue(property, self._owner[property]);
            setTimeout(function () {
                if (self.getIsStateDirty()) {
                    return;
                }
                self._checkQueue(property, self._owner[property]);
            }, 0);
        };
        WaitQueue.prototype.toString = function () {
            return "WaitQueue " + this._uniqueID;
        };
        Object.defineProperty(WaitQueue.prototype, "uniqueID", {
            get: function () {
                return this._uniqueID;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(WaitQueue.prototype, "owner", {
            get: function () {
                return this._owner;
            },
            enumerable: false,
            configurable: true
        });
        return WaitQueue;
    }(object_2.BaseObject));
    exports.WaitQueue = WaitQueue;
});
define("jriapp_shared/collection/utils", ["require", "exports", "jriapp_shared/utils/utils", "jriapp_shared/lang"], function (require, exports, utils_1, lang_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CollUtils = exports.fn_walkField = exports.ValueUtils = void 0;
    var utils = utils_1.Utils, _a = utils.core, getTimeZoneOffset = _a.getTimeZoneOffset, parseBool = _a.parseBool, getValue = _a.getValue, setValue = _a.setValue, format = utils.str.format, _b = utils.check, _undefined = _b._undefined, isArray = _b.isArray, isDate = _b.isDate, isString = _b.isString, isBoolean = _b.isBoolean, isNumber = _b.isNumber, isNt = _b.isNt;
    function pad(num) {
        if (num < 10) {
            return "0" + num;
        }
        return "" + num;
    }
    function dateToString(dt) {
        return ("" + dt.getFullYear()) +
            "-" + pad(dt.getMonth() + 1) +
            "-" + pad(dt.getDate()) +
            "T" + pad(dt.getHours()) +
            ":" + pad(dt.getMinutes()) +
            ":" + pad(dt.getSeconds()) +
            "." + (dt.getMilliseconds() / 1000).toFixed(3).slice(2, 5) + "Z";
    }
    exports.ValueUtils = {
        valueToDate: function (val, dtcnv, serverTZ) {
            if (!val) {
                return null;
            }
            var dt = new Date(val);
            var clientTZ = getTimeZoneOffset();
            dt.setMinutes(dt.getMinutes() + clientTZ);
            switch (dtcnv) {
                case 0:
                    break;
                case 1:
                    dt.setMinutes(dt.getMinutes() + serverTZ);
                    dt.setMinutes(dt.getMinutes() - clientTZ);
                    break;
                case 2:
                    dt.setMinutes(dt.getMinutes() - clientTZ);
                    break;
                default:
                    throw new Error(format(lang_6.ERRS.ERR_PARAM_INVALID, "dtcnv", dtcnv));
            }
            return dt;
        },
        dateToValue: function (dt, dtcnv, serverTZ) {
            if (dt === null) {
                return null;
            }
            if (!isDate(dt)) {
                throw new Error(format(lang_6.ERRS.ERR_PARAM_INVALID, "dt", dt));
            }
            var clientTZ = getTimeZoneOffset();
            switch (dtcnv) {
                case 0:
                    break;
                case 1:
                    dt.setMinutes(dt.getMinutes() + clientTZ);
                    dt.setMinutes(dt.getMinutes() - serverTZ);
                    break;
                case 2:
                    dt.setMinutes(dt.getMinutes() + clientTZ);
                    break;
                default:
                    throw new Error(format(lang_6.ERRS.ERR_PARAM_INVALID, "dtcnv", dtcnv));
            }
            return dateToString(dt);
        },
        compareVals: function (v1, v2, dataType) {
            if ((v1 === null && v2 !== null) || (v1 !== null && v2 === null)) {
                return false;
            }
            switch (dataType) {
                case 6:
                case 7:
                case 8:
                    return (isDate(v1) && isDate(v2)) ? (v1.getTime() === v2.getTime()) : false;
                default:
                    return v1 === v2;
            }
        },
        stringifyValue: function (v, dtcnv, dataType, serverTZ) {
            var res = null;
            if (isNt(v)) {
                return res;
            }
            function conv(v) {
                if (isDate(v)) {
                    return exports.ValueUtils.dateToValue(v, dtcnv, serverTZ);
                }
                else if (isArray(v)) {
                    return JSON.stringify(v);
                }
                else if (isString(v)) {
                    return v;
                }
                else {
                    return JSON.stringify(v);
                }
            }
            ;
            var isOK = false;
            switch (dataType) {
                case 0:
                    res = conv(v);
                    isOK = true;
                    break;
                case 1:
                case 9:
                    if (isString(v)) {
                        res = v;
                        isOK = true;
                    }
                    break;
                case 2:
                    if (isBoolean(v)) {
                        res = JSON.stringify(v);
                        isOK = true;
                    }
                    break;
                case 3:
                case 4:
                case 5:
                    if (isNumber(v)) {
                        res = JSON.stringify(v);
                        isOK = true;
                    }
                    break;
                case 6:
                case 7:
                case 8:
                    if (isDate(v)) {
                        res = exports.ValueUtils.dateToValue(v, dtcnv, serverTZ);
                        isOK = true;
                    }
                    break;
                case 10:
                    if (isArray(v)) {
                        res = JSON.stringify(v);
                        isOK = true;
                    }
                    break;
                default:
                    throw new Error(format(lang_6.ERRS.ERR_PARAM_INVALID, "dataType", dataType));
            }
            if (!isOK) {
                throw new Error(format(lang_6.ERRS.ERR_FIELD_WRONG_TYPE, v, dataType));
            }
            return res;
        },
        parseValue: function (v, dataType, dtcnv, serverTZ) {
            var res = null;
            if (v === _undefined || v === null) {
                return res;
            }
            switch (dataType) {
                case 0:
                    res = v;
                    break;
                case 1:
                case 9:
                    res = v;
                    break;
                case 2:
                    res = parseBool(v);
                    break;
                case 3:
                    res = parseInt(v, 10);
                    break;
                case 4:
                case 5:
                    res = parseFloat(v);
                    break;
                case 6:
                case 7:
                case 8:
                    res = exports.ValueUtils.valueToDate(v, dtcnv, serverTZ);
                    break;
                case 10:
                    res = JSON.parse(v);
                    break;
                default:
                    throw new Error(format(lang_6.ERRS.ERR_PARAM_INVALID, "dataType", dataType));
            }
            return res;
        }
    };
    function fn_walkField(fldName, fld, cb, parentRes) {
        if (fld.fieldType === 5) {
            var res = cb(fld, fldName, parentRes);
            if (!!fld.nested && fld.nested.length > 0) {
                var nestedFld = void 0;
                var len = fld.nested.length;
                for (var i = 0; i < len; i += 1) {
                    nestedFld = fld.nested[i];
                    if (nestedFld.fieldType === 5) {
                        fn_walkField(fldName + "." + nestedFld.fieldName, nestedFld, cb, res);
                    }
                    else {
                        cb(nestedFld, fldName + "." + nestedFld.fieldName, res);
                    }
                }
            }
        }
        else {
            cb(fld, fldName, parentRes);
        }
    }
    exports.fn_walkField = fn_walkField;
    exports.CollUtils = {
        getObjectField: function (name, flds) {
            var arrFlds = flds.filter(function (f) { return f.fieldName === name; });
            if (!arrFlds || arrFlds.length !== 1) {
                throw new Error(format(lang_6.ERRS.ERR_ASSERTION_FAILED, "arrFlds.length === 1"));
            }
            return arrFlds[0];
        },
        walkField: function (fld, fn, parentRes) {
            fn_walkField(fld.fieldName, fld, fn, parentRes);
        },
        walkFields: function (flds, fn, parentRes) {
            for (var i = 0; i < flds.length; i += 1) {
                fn_walkField(flds[i].fieldName, flds[i], fn, parentRes);
            }
        },
        getPKFields: function (fieldInfos) {
            var pkFlds = [], len = fieldInfos.length;
            for (var i = 0; i < len; i += 1) {
                var fld = fieldInfos[i];
                if (fld.isPrimaryKey > 0) {
                    pkFlds.push(fld);
                }
            }
            return pkFlds.sort(function (f1, f2) {
                return f1.isPrimaryKey - f2.isPrimaryKey;
            });
        },
        initVals: function (flds, vals) {
            exports.CollUtils.walkFields(flds, function (fld, fullName) {
                if (fld.fieldType === 5) {
                    setValue(vals, fullName, {});
                }
                else {
                    if (!(fld.fieldType === 3 || fld.fieldType === 2)) {
                        setValue(vals, fullName, null);
                    }
                }
            });
            return vals;
        },
        copyVals: function (flds, from, to) {
            exports.CollUtils.walkFields(flds, function (fld, fullName) {
                if (fld.fieldType === 5) {
                    setValue(to, fullName, {});
                }
                else {
                    if (!(fld.fieldType === 3 || fld.fieldType === 2)) {
                        var value = getValue(from, fullName);
                        setValue(to, fullName, value);
                    }
                }
            });
            return to;
        },
        objToVals: function (flds, obj) {
            return (!obj) ? exports.CollUtils.initVals(flds, {}) : exports.CollUtils.copyVals(flds, obj, {});
        },
        cloneVals: function (flds, vals) {
            return exports.CollUtils.copyVals(flds, vals, {});
        }
    };
});
define("jriapp_shared/collection/base", ["require", "exports", "jriapp_shared/object", "jriapp_shared/lang", "jriapp_shared/utils/waitqueue", "jriapp_shared/utils/utils", "jriapp_shared/collection/utils", "jriapp_shared/errors"], function (require, exports, object_3, lang_7, waitqueue_1, utils_2, utils_3, errors_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseCollection = exports.Errors = void 0;
    var utils = utils_2.Utils, _a = utils.core, forEach = _a.forEach, getTimeZoneOffset = _a.getTimeZoneOffset, getNewID = _a.getNewID, Indexer = _a.Indexer, _b = utils.str, format = _b.format, startsWith = _b.startsWith, _c = utils.check, _undefined = _c._undefined, isArray = _c.isArray, isUndefined = _c.isUndefined, sys = utils.sys, stringifyValue = utils_3.ValueUtils.stringifyValue, getObjectField = utils_3.CollUtils.getObjectField;
    sys.isCollection = function (obj) {
        return (!!obj && obj instanceof BaseCollection);
    };
    var COLL_EVENTS;
    (function (COLL_EVENTS) {
        COLL_EVENTS["begin_edit"] = "beg_edit";
        COLL_EVENTS["end_edit"] = "end_edit";
        COLL_EVENTS["before_begin_edit"] = "before_be";
        COLL_EVENTS["before_end_edit"] = "before_ee";
        COLL_EVENTS["collection_changed"] = "coll_changed";
        COLL_EVENTS["fill"] = "fill";
        COLL_EVENTS["item_deleting"] = "item_deleting";
        COLL_EVENTS["item_adding"] = "item_adding";
        COLL_EVENTS["item_added"] = "item_added";
        COLL_EVENTS["validate_field"] = "validate_field";
        COLL_EVENTS["validate_item"] = "validate_item";
        COLL_EVENTS["current_changing"] = "current_changing";
        COLL_EVENTS["page_changing"] = "page_changing";
        COLL_EVENTS["errors_changed"] = "errors_changed";
        COLL_EVENTS["status_changed"] = "status_changed";
        COLL_EVENTS["clearing"] = "clearing";
        COLL_EVENTS["cleared"] = "cleared";
        COLL_EVENTS["commit_changes"] = "commit_changes";
    })(COLL_EVENTS || (COLL_EVENTS = {}));
    var Errors = (function () {
        function Errors(owner) {
            this._errors = Indexer();
            this._owner = owner;
        }
        Errors.prototype.clear = function () {
            this._errors = Indexer();
        };
        Errors.prototype.validateItem = function (item) {
            var args = { item: item, result: [] };
            return this._owner._getInternal().validateItem(args);
        };
        Errors.prototype.validateItemField = function (item, fieldName) {
            var args = { item: item, fieldName: fieldName, errors: [] };
            return this._owner._getInternal().validateItemField(args);
        };
        Errors.prototype.addErrors = function (item, errors) {
            var _this = this;
            errors.forEach(function (err) {
                _this.addError(item, err.fieldName, err.errors, true);
            });
            this.onErrorsChanged(item);
        };
        Errors.prototype.addError = function (item, fieldName, errors, ignoreChangeErrors) {
            if (!fieldName) {
                fieldName = "*";
            }
            if (!(isArray(errors) && errors.length > 0)) {
                this.removeError(item, fieldName, ignoreChangeErrors);
                return;
            }
            if (!this._errors[item._key]) {
                this._errors[item._key] = Indexer();
            }
            var itemErrors = this._errors[item._key];
            itemErrors[fieldName] = errors;
            if (!ignoreChangeErrors) {
                this.onErrorsChanged(item);
            }
        };
        Errors.prototype.removeError = function (item, fieldName, ignoreChangeErrors) {
            var itemErrors = this._errors[item._key];
            if (!itemErrors) {
                return;
            }
            if (!fieldName) {
                fieldName = "*";
            }
            if (!itemErrors[fieldName]) {
                return;
            }
            delete itemErrors[fieldName];
            if (Object.keys(itemErrors).length === 0) {
                delete this._errors[item._key];
            }
            if (!ignoreChangeErrors) {
                this.onErrorsChanged(item);
            }
        };
        Errors.prototype.removeAllErrors = function (item) {
            var itemErrors = this._errors[item._key];
            if (!itemErrors) {
                return;
            }
            delete this._errors[item._key];
            this.onErrorsChanged(item);
        };
        Errors.prototype.getErrors = function (item) {
            return this._errors[item._key];
        };
        Errors.prototype.onErrorsChanged = function (item) {
            var args = { item: item };
            this._owner._getInternal().onErrorsChanged(args);
            item._aspect.raiseErrorsChanged();
        };
        Errors.prototype.getItemsWithErrors = function () {
            var _this = this;
            var res = [];
            forEach(this._errors, function (key) {
                var item = _this._owner.getItemByKey(key);
                res.push(item);
            });
            return res;
        };
        return Errors;
    }());
    exports.Errors = Errors;
    var BaseCollection = (function (_super) {
        __extends(BaseCollection, _super);
        function BaseCollection() {
            var _this = _super.call(this) || this;
            var self = _this;
            _this._uniqueID = getNewID("coll");
            _this._options = { enablePaging: false, pageSize: 50 };
            _this._isLoading = false;
            _this._isUpdating = false;
            _this._EditingItem = null;
            _this._perms = { canAddRow: true, canEditRow: true, canDeleteRow: true, canRefreshRow: false };
            _this._totalCount = 0;
            _this._pageIndex = 0;
            _this._items = [];
            _this._itemsByKey = Indexer();
            _this._currentPos = -1;
            _this._errors = new Errors(_this);
            _this._pkInfo = null;
            _this._waitQueue = new waitqueue_1.WaitQueue(_this);
            _this._internal = {
                setIsLoading: function (v) {
                    self._setIsLoading(v);
                },
                getEditingItem: function () {
                    return self._getEditingItem();
                },
                getStrValue: function (val, fieldInfo) {
                    return self._getStrValue(val, fieldInfo);
                },
                onBeforeEditing: function (item, isBegin, isCanceled) {
                    self._onBeforeEditing(item, isBegin, isCanceled);
                },
                onEditing: function (item, isBegin, isCanceled) {
                    self._onEditing(item, isBegin, isCanceled);
                },
                onCommitChanges: function (item, isBegin, isRejected, status) {
                    self._onCommitChanges(item, isBegin, isRejected, status);
                },
                onItemDeleting: function (args) {
                    return self._onItemDeleting(args);
                },
                onErrorsChanged: function (args) {
                    self.objEvents.raise("errors_changed", args);
                },
                validateItemField: function (args) {
                    self.objEvents.raise("validate_field", args);
                    return (!!args.errors && args.errors.length > 0) ? { fieldName: args.fieldName, errors: args.errors } : null;
                },
                validateItem: function (args) {
                    self.objEvents.raise("validate_item", args);
                    return (!!args.result && args.result.length > 0) ? args.result : [];
                }
            };
            return _this;
        }
        BaseCollection.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this._waitQueue.dispose();
            this._waitQueue = null;
            this.clear();
            _super.prototype.dispose.call(this);
        };
        BaseCollection.getEmptyFieldInfo = function (fieldName) {
            var fieldInfo = {
                fieldName: fieldName,
                isPrimaryKey: 0,
                dataType: 0,
                isNullable: true,
                maxLength: -1,
                isReadOnly: false,
                isAutoGenerated: false,
                allowClientDefault: false,
                dateConversion: 0,
                fieldType: 1,
                isNeedOriginal: false,
                range: null,
                regex: null,
                nested: null,
                dependentOn: null,
                fullName: null
            };
            return fieldInfo;
        };
        BaseCollection.prototype._isOwnsItems = function () {
            return true;
        };
        BaseCollection.prototype._setInternal = function (internal) {
            this._internal = internal;
        };
        BaseCollection.prototype._updatePermissions = function (perms) {
            this._perms = perms;
        };
        BaseCollection.prototype._getPKFieldInfos = function () {
            if (!!this._pkInfo) {
                return this._pkInfo;
            }
            var fldMap = this.getFieldMap(), pk = [];
            forEach(fldMap, function (fldName) {
                if (fldMap[fldName].isPrimaryKey > 0) {
                    pk.push(fldMap[fldName]);
                }
            });
            pk.sort(function (a, b) {
                return a.isPrimaryKey - b.isPrimaryKey;
            });
            this._pkInfo = pk;
            return this._pkInfo;
        };
        BaseCollection.prototype._checkCurrentChanging = function (_newCurrent) {
            try {
                this.endEdit();
            }
            catch (ex) {
                utils.err.reThrow(ex, this.handleError(ex, this));
            }
        };
        BaseCollection.prototype._onCurrentChanging = function (newCurrent) {
            this._checkCurrentChanging(newCurrent);
            this.objEvents.raise("current_changing", { newCurrent: newCurrent });
        };
        BaseCollection.prototype._onCurrentChanged = function () {
            this.objEvents.raiseProp("currentItem");
        };
        BaseCollection.prototype._onCountChanged = function () {
            this.objEvents.raiseProp("count");
        };
        BaseCollection.prototype._onEditingChanged = function () {
            this.objEvents.raiseProp("isEditing");
        };
        BaseCollection.prototype._onItemStatusChanged = function (item, oldStatus) {
            this.objEvents.raise("status_changed", { item: item, oldStatus: oldStatus, key: item._key });
        };
        BaseCollection.prototype._onCollectionChanged = function (args) {
            this.objEvents.raise("coll_changed", args);
        };
        BaseCollection.prototype._onFillEnd = function (args) {
            this.objEvents.raise("fill", args);
        };
        BaseCollection.prototype._onItemAdding = function (item) {
            var args = { item: item, isCancel: false };
            this.objEvents.raise("item_adding", args);
            if (args.isCancel) {
                utils.err.throwDummy(new Error("operation canceled"));
            }
        };
        BaseCollection.prototype._onItemAdded = function (item) {
            var args = { item: item, isAddNewHandled: false };
            this.objEvents.raise("item_added", args);
        };
        BaseCollection.prototype._addNew = function (item) {
            try {
                this.endEdit();
            }
            catch (ex) {
                utils.err.reThrow(ex, this.handleError(ex, this));
            }
            if (!!this.getItemByKey(item._key)) {
                throw new Error(lang_7.ERRS.ERR_ITEM_IS_ATTACHED);
            }
            var pos = this._appendItem(item);
            this._onAddNew(item);
            this._onCountChanged();
            this._onCurrentChanging(item);
            this._currentPos = pos;
            this._onCurrentChanged();
            return pos;
        };
        BaseCollection.prototype._onAddNew = function (item) {
            item._aspect._setIsAttached(true);
            var args = {
                changeType: 1,
                reason: 0,
                oper: 2,
                items: [item],
                new_key: item._key
            };
            this._onCollectionChanged(args);
        };
        BaseCollection.prototype._onRemoved = function (item) {
            try {
                this._onCollectionChanged({
                    changeType: 0,
                    reason: 0,
                    oper: 3,
                    items: [item],
                    old_key: item._key
                });
            }
            finally {
                this._onCountChanged();
            }
        };
        BaseCollection.prototype._onPageSizeChanged = function () {
        };
        BaseCollection.prototype._onPageChanging = function () {
            var args = { page: this.pageIndex, isCancel: false };
            this.objEvents.raise("page_changing", args);
            if (!args.isCancel) {
                try {
                    this.endEdit();
                }
                catch (ex) {
                    utils.err.reThrow(ex, this.handleError(ex, this));
                }
            }
            return !args.isCancel;
        };
        BaseCollection.prototype._onPageChanged = function () {
        };
        BaseCollection.prototype._setCurrentItem = function (v) {
            var self = this, oldPos = self._currentPos;
            if (!v) {
                if (oldPos !== -1) {
                    self._onCurrentChanging(null);
                    self._currentPos = -1;
                    self._onCurrentChanged();
                }
                return;
            }
            if (v._aspect.isDetached) {
                throw new Error(lang_7.ERRS.ERR_ITEM_IS_DETACHED);
            }
            var item = self.getItemByKey(v._key);
            if (!item) {
                throw new Error(lang_7.ERRS.ERR_ITEM_IS_NOTFOUND);
            }
            var oldItem = self.getItemByPos(oldPos);
            var pos = self._items.indexOf(v);
            if (pos < 0) {
                throw new Error(lang_7.ERRS.ERR_ITEM_IS_NOTFOUND);
            }
            if (oldPos !== pos || oldItem !== v) {
                self._onCurrentChanging(v);
                self._currentPos = pos;
                self._onCurrentChanged();
            }
        };
        BaseCollection.prototype._getEditingItem = function () {
            return this._EditingItem;
        };
        BaseCollection.prototype._getStrValue = function (val, fieldInfo) {
            var dcnv = fieldInfo.dateConversion, stz = getTimeZoneOffset();
            return stringifyValue(val, dcnv, fieldInfo.dataType, stz);
        };
        BaseCollection.prototype._onBeforeEditing = function (item, isBegin, isCanceled) {
            if (this._isUpdating) {
                return;
            }
            if (isBegin) {
                this.objEvents.raise("before_be", { item: item });
            }
            else {
                this.objEvents.raise("before_ee", { item: item, isCanceled: isCanceled });
            }
        };
        BaseCollection.prototype._onEditing = function (item, isBegin, isCanceled) {
            if (this._isUpdating) {
                return;
            }
            if (isBegin) {
                this._EditingItem = item;
                this.objEvents.raise("beg_edit", { item: item });
                this._onEditingChanged();
                if (!!item) {
                    item._aspect.objEvents.raiseProp("isEditing");
                }
            }
            else {
                var oldItem = this._EditingItem;
                this._EditingItem = null;
                this.objEvents.raise("end_edit", { item: item, isCanceled: isCanceled });
                this._onEditingChanged();
                if (!!oldItem) {
                    oldItem._aspect.objEvents.raiseProp("isEditing");
                }
            }
        };
        BaseCollection.prototype._onCommitChanges = function (item, isBegin, isRejected, status) {
            this.objEvents.raise("commit_changes", { item: item, isBegin: isBegin, isRejected: isRejected, status: status });
        };
        BaseCollection.prototype._validateItem = function (item) {
            var args = { item: item, result: [] };
            this.objEvents.raise("validate_item", args);
            return (!!args.result && args.result.length > 0) ? args.result : [];
        };
        BaseCollection.prototype._validateItemField = function (item, fieldName) {
            var args = { item: item, fieldName: fieldName, errors: [] };
            this.objEvents.raise("validate_field", args);
            return (!!args.errors && args.errors.length > 0) ? { fieldName: fieldName, errors: args.errors } : null;
        };
        BaseCollection.prototype._onItemDeleting = function (args) {
            this.objEvents.raise("item_deleting", args);
            return !args.isCancel;
        };
        BaseCollection.prototype._clear = function (reason, oper) {
            this.objEvents.raise("clearing", { reason: reason });
            this.cancelEdit();
            this.rejectChanges();
            this._EditingItem = null;
            this.currentItem = null;
            var oldItems = this._items;
            this._errors.clear();
            this._items = [];
            this._itemsByKey = Indexer();
            if (this._isOwnsItems()) {
                for (var _i = 0, oldItems_1 = oldItems; _i < oldItems_1.length; _i++) {
                    var item = oldItems_1[_i];
                    item._aspect._setIsAttached(false);
                }
                if (oldItems.length > 0) {
                    utils.queue.enque(function () {
                        for (var _i = 0, oldItems_2 = oldItems; _i < oldItems_2.length; _i++) {
                            var item = oldItems_2[_i];
                            item.dispose();
                        }
                    });
                }
            }
            if (oper !== 1) {
                this._onCollectionChanged({
                    changeType: 2,
                    reason: reason,
                    oper: oper,
                    items: []
                });
            }
            this.objEvents.raise("cleared", { reason: reason });
            this._onCountChanged();
        };
        BaseCollection.prototype._replaceItems = function (reason, oper, items) {
            this._clear(reason, oper);
            this._items = items;
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                this._itemsByKey[item._key] = item;
                item._aspect._setIsAttached(true);
            }
        };
        BaseCollection.prototype._appendItem = function (item) {
            this._items.push(item);
            this._itemsByKey[item._key] = item;
            return (this._items.length - 1);
        };
        BaseCollection.prototype._remapItem = function (oldkey, newkey, item) {
            if (!newkey) {
                throw new Error(lang_7.ERRS.ERR_KEY_IS_EMPTY);
            }
            delete this._itemsByKey[oldkey];
            item._aspect._setKey(newkey);
            this._itemsByKey[newkey] = item;
        };
        BaseCollection.prototype._removeItem = function (item) {
            var key = item._key;
            if (!this.getItemByKey(key)) {
                return -1;
            }
            var oldPos = utils.arr.remove(this._items, item);
            if (oldPos < 0) {
                throw new Error(lang_7.ERRS.ERR_ITEM_IS_NOTFOUND);
            }
            this._onRemoved(item);
            delete this._itemsByKey[key];
            return oldPos;
        };
        BaseCollection.prototype._resetCurrent = function (oldPos) {
            var test = this.getItemByPos(oldPos), curPos = this._currentPos;
            if (curPos === oldPos) {
                if (!test) {
                    this._currentPos = curPos - 1;
                }
                this._onCurrentChanged();
            }
            if (curPos > oldPos) {
                this._currentPos = curPos - 1;
                this._onCurrentChanged();
            }
        };
        BaseCollection.prototype._waitForProp = function (prop, callback, groupName) {
            this._waitQueue.enQueue({
                prop: prop,
                groupName: groupName,
                predicate: function (val) {
                    return !val;
                },
                action: callback,
                actionArgs: [],
                lastWins: !!groupName
            });
        };
        BaseCollection.prototype._setIsLoading = function (v) {
            if (this._isLoading !== v) {
                this._isLoading = v;
                this.objEvents.raiseProp("isLoading");
            }
        };
        BaseCollection.prototype._getInternal = function () {
            return this._internal;
        };
        BaseCollection.prototype._getSortFn = function (fieldNames, sortOrder) {
            var mult = 1;
            if (sortOrder === 1) {
                mult = -1;
            }
            return function (a, b) {
                var res = 0, i, af, bf, fieldName;
                var len = fieldNames.length;
                for (i = 0; i < len; i += 1) {
                    fieldName = fieldNames[i];
                    af = sys.resolvePath(a, fieldName);
                    bf = sys.resolvePath(b, fieldName);
                    if (af === _undefined) {
                        af = null;
                    }
                    if (bf === _undefined) {
                        bf = null;
                    }
                    if (af === null && bf !== null) {
                        res = -1 * mult;
                    }
                    else if (af !== null && bf === null) {
                        res = mult;
                    }
                    else if (af < bf) {
                        res = -1 * mult;
                    }
                    else if (af > bf) {
                        res = mult;
                    }
                    else {
                        res = 0;
                    }
                    if (res !== 0) {
                        return res;
                    }
                }
                return res;
            };
        };
        BaseCollection.prototype.isHasProp = function (prop) {
            if (startsWith(prop, "[")) {
                var res = sys.getProp(this, prop);
                return !isUndefined(res);
            }
            return _super.prototype.isHasProp.call(this, prop);
        };
        BaseCollection.prototype.getFieldInfo = function (fieldName) {
            var parts = fieldName.split("."), fieldMap = this.getFieldMap();
            var fld = fieldMap[parts[0]];
            if (!fld) {
                throw new Error("getFieldInfo - the Collection: " + this.toString() + " does not have field: " + fieldName);
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
            throw new Error(format(lang_7.ERRS.ERR_PARAM_INVALID, "fieldName", fieldName));
        };
        BaseCollection.prototype.getFieldNames = function () {
            return this.getFieldInfos().map(function (f) {
                return f.fieldName;
            });
        };
        BaseCollection.prototype.cancelEdit = function () {
            if (this.isEditing) {
                this._EditingItem._aspect.cancelEdit();
            }
        };
        BaseCollection.prototype.endEdit = function () {
            var EditingItem;
            if (this.isEditing) {
                EditingItem = this._EditingItem;
                if (!EditingItem._aspect.endEdit() && EditingItem._aspect.getIsHasErrors()) {
                    this.handleError(new errors_6.ValidationError(EditingItem._aspect.getAllErrors(), EditingItem), EditingItem);
                    this.cancelEdit();
                }
            }
        };
        BaseCollection.prototype.getItemsWithErrors = function () {
            return this._errors.getItemsWithErrors();
        };
        BaseCollection.prototype.addNew = function () {
            var item, isHandled;
            item = this._createNew();
            this._onItemAdding(item);
            this._addNew(item);
            try {
                this.currentItem = item;
                item._aspect.beginEdit();
                this._onItemAdded(item);
            }
            catch (ex) {
                isHandled = this.handleError(ex, this);
                item._aspect.cancelEdit();
                utils.err.reThrow(ex, isHandled);
            }
            return item;
        };
        BaseCollection.prototype.getItemByPos = function (pos) {
            if (pos < 0 || pos >= this._items.length) {
                return null;
            }
            return this._items[pos];
        };
        BaseCollection.prototype.getItemByKey = function (key) {
            if (!key) {
                throw new Error(lang_7.ERRS.ERR_KEY_IS_EMPTY);
            }
            return this._itemsByKey[key];
        };
        BaseCollection.prototype.findByPK = function () {
            var vals = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                vals[_i] = arguments[_i];
            }
            if (arguments.length === 0) {
                return null;
            }
            var self = this, pkInfo = self._getPKFieldInfos(), arr = [];
            var key, values = [];
            if (vals.length === 1 && isArray(vals[0])) {
                values = vals[0];
            }
            else {
                values = vals;
            }
            if (values.length !== pkInfo.length) {
                return null;
            }
            var len = pkInfo.length;
            for (var i = 0; i < len; i += 1) {
                arr.push(self._getStrValue(values[i], pkInfo[i]));
            }
            key = arr.join(";");
            return self.getItemByKey(key);
        };
        BaseCollection.prototype.moveFirst = function (skipDeleted) {
            var pos = 0, old = this._currentPos;
            if (old === pos) {
                return false;
            }
            var item = this.getItemByPos(pos);
            if (!item) {
                return false;
            }
            if (!!skipDeleted) {
                if (item._aspect.isDeleted) {
                    return this.moveNext(true);
                }
            }
            this._onCurrentChanging(item);
            this._currentPos = pos;
            this._onCurrentChanged();
            return true;
        };
        BaseCollection.prototype.movePrev = function (skipDeleted) {
            var pos = -1;
            var old = this._currentPos;
            var item = this.getItemByPos(old);
            if (!!item) {
                pos = old;
                pos -= 1;
            }
            item = this.getItemByPos(pos);
            if (!item) {
                return false;
            }
            if (!!skipDeleted) {
                if (item._aspect.isDeleted) {
                    this._currentPos = pos;
                    return this.movePrev(true);
                }
            }
            this._onCurrentChanging(item);
            this._currentPos = pos;
            this._onCurrentChanged();
            return true;
        };
        BaseCollection.prototype.moveNext = function (skipDeleted) {
            var pos = -1;
            var old = this._currentPos;
            var item = this.getItemByPos(old);
            if (!!item) {
                pos = old;
                pos += 1;
            }
            item = this.getItemByPos(pos);
            if (!item) {
                return false;
            }
            if (!!skipDeleted) {
                if (item._aspect.isDeleted) {
                    this._currentPos = pos;
                    return this.moveNext(true);
                }
            }
            this._onCurrentChanging(item);
            this._currentPos = pos;
            this._onCurrentChanged();
            return true;
        };
        BaseCollection.prototype.moveLast = function (skipDeleted) {
            var pos = this._items.length - 1, old = this._currentPos;
            if (old === pos) {
                return false;
            }
            var item = this.getItemByPos(pos);
            if (!item) {
                return false;
            }
            if (!!skipDeleted) {
                if (item._aspect.isDeleted) {
                    return this.movePrev(true);
                }
            }
            this._onCurrentChanging(item);
            this._currentPos = pos;
            this._onCurrentChanged();
            return true;
        };
        BaseCollection.prototype.goTo = function (pos) {
            var old = this._currentPos;
            if (old === pos) {
                return false;
            }
            var item = this.getItemByPos(pos);
            if (!item) {
                return false;
            }
            this._onCurrentChanging(item);
            this._currentPos = pos;
            this._onCurrentChanged();
            return true;
        };
        BaseCollection.prototype.forEach = function (callback, thisObj) {
            this._items.forEach(callback, thisObj);
        };
        BaseCollection.prototype.removeItem = function (item) {
            if (item._aspect.isDetached || !this.getItemByKey(item._key)) {
                return;
            }
            try {
                var oldPos = this._removeItem(item);
                this._errors.removeAllErrors(item);
                item._aspect._setIsAttached(false);
                this._resetCurrent(oldPos);
            }
            finally {
                if (!item.getIsStateDirty()) {
                    item.dispose();
                }
            }
        };
        BaseCollection.prototype.sort = function (fieldNames, sortOrder) {
            return this.sortLocal(fieldNames, sortOrder);
        };
        BaseCollection.prototype.sortLocal = function (fieldNames, sortOrder) {
            var sortFn = this._getSortFn(fieldNames, sortOrder);
            var self = this, deferred = utils.async.createDeferred();
            this.waitForNotLoading(function () {
                var cur = self.currentItem;
                self._setIsLoading(true);
                try {
                    self._items.sort(sortFn);
                    self._onCollectionChanged({
                        changeType: 2,
                        reason: 2,
                        oper: 5,
                        items: []
                    });
                }
                finally {
                    self._setIsLoading(false);
                    deferred.resolve();
                }
                self.currentItem = null;
                self.currentItem = cur;
            }, "sorting");
            return deferred.promise();
        };
        BaseCollection.prototype.rejectChanges = function () {
        };
        BaseCollection.prototype.clear = function () {
            this._clear(0, 0);
            this.totalCount = 0;
        };
        BaseCollection.prototype.waitForNotLoading = function (callback, groupName) {
            this._waitForProp("isLoading", callback, groupName);
        };
        BaseCollection.prototype.toString = function () {
            return "BaseCollection";
        };
        BaseCollection.prototype.addOnClearing = function (fn, nmspace, context, priority) {
            this.objEvents.on("clearing", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnClearing = function (nmspace) {
            this.objEvents.off("clearing", nmspace);
        };
        BaseCollection.prototype.addOnCleared = function (fn, nmspace, context, priority) {
            this.objEvents.on("cleared", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnCleared = function (nmspace) {
            this.objEvents.off("cleared", nmspace);
        };
        BaseCollection.prototype.addOnCollChanged = function (fn, nmspace, context, priority) {
            this.objEvents.on("coll_changed", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnCollChanged = function (nmspace) {
            this.objEvents.off("coll_changed", nmspace);
        };
        BaseCollection.prototype.addOnFill = function (fn, nmspace, context, priority) {
            this.objEvents.on("fill", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnFill = function (nmspace) {
            this.objEvents.off("fill", nmspace);
        };
        BaseCollection.prototype.addOnValidateField = function (fn, nmspace, context, priority) {
            this.objEvents.on("validate_field", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnValidateField = function (nmspace) {
            this.objEvents.off("validate_field", nmspace);
        };
        BaseCollection.prototype.addOnValidateItem = function (fn, nmspace, context, priority) {
            this.objEvents.on("validate_item", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnValidateItem = function (nmspace) {
            this.objEvents.off("validate_item", nmspace);
        };
        BaseCollection.prototype.addOnItemDeleting = function (fn, nmspace, context, priority) {
            this.objEvents.on("item_deleting", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnItemDeleting = function (nmspace) {
            this.objEvents.off("item_deleting", nmspace);
        };
        BaseCollection.prototype.addOnItemAdding = function (fn, nmspace, context, priority) {
            this.objEvents.on("item_adding", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnItemAdding = function (nmspace) {
            this.objEvents.off("item_adding", nmspace);
        };
        BaseCollection.prototype.addOnItemAdded = function (fn, nmspace, context, priority) {
            this.objEvents.on("item_added", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnItemAdded = function (nmspace) {
            this.objEvents.off("item_added", nmspace);
        };
        BaseCollection.prototype.addOnCurrentChanging = function (fn, nmspace, context, priority) {
            this.objEvents.on("current_changing", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnCurrentChanging = function (nmspace) {
            this.objEvents.off("current_changing", nmspace);
        };
        BaseCollection.prototype.addOnPageChanging = function (fn, nmspace, context, priority) {
            this.objEvents.on("page_changing", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnPageChanging = function (nmspace) {
            this.objEvents.off("page_changing", nmspace);
        };
        BaseCollection.prototype.addOnErrorsChanged = function (fn, nmspace, context, priority) {
            this.objEvents.on("errors_changed", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnErrorsChanged = function (nmspace) {
            this.objEvents.off("errors_changed", nmspace);
        };
        BaseCollection.prototype.addOnBeginEdit = function (fn, nmspace, context, priority) {
            this.objEvents.on("beg_edit", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnBeginEdit = function (nmspace) {
            this.objEvents.off("beg_edit", nmspace);
        };
        BaseCollection.prototype.addOnEndEdit = function (fn, nmspace, context, priority) {
            this.objEvents.on("end_edit", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnEndEdit = function (nmspace) {
            this.objEvents.off("end_edit", nmspace);
        };
        BaseCollection.prototype.addOnBeforeBeginEdit = function (fn, nmspace, context, priority) {
            this.objEvents.on("before_be", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnBeforeBeginEdit = function (nmspace) {
            this.objEvents.off("before_be", nmspace);
        };
        BaseCollection.prototype.addOnBeforeEndEdit = function (fn, nmspace, context, priority) {
            this.objEvents.on("before_ee", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.removeBeforeOnEndEdit = function (nmspace) {
            this.objEvents.off("before_ee", nmspace);
        };
        BaseCollection.prototype.addOnCommitChanges = function (fn, nmspace, context, priority) {
            this.objEvents.on("commit_changes", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnCommitChanges = function (nmspace) {
            this.objEvents.off("commit_changes", nmspace);
        };
        BaseCollection.prototype.addOnStatusChanged = function (fn, nmspace, context, priority) {
            this.objEvents.on("status_changed", fn, nmspace, context, priority);
        };
        BaseCollection.prototype.offOnStatusChanged = function (nmspace) {
            this.objEvents.off("status_changed", nmspace);
        };
        BaseCollection.prototype.addOnPageIndexChanged = function (handler, nmspace, context) {
            this.objEvents.onProp("pageIndex", handler, nmspace, context);
        };
        BaseCollection.prototype.addOnPageSizeChanged = function (handler, nmspace, context) {
            this.objEvents.onProp("pageSize", handler, nmspace, context);
        };
        BaseCollection.prototype.addOnTotalCountChanged = function (handler, nmspace, context) {
            this.objEvents.onProp("totalCount", handler, nmspace, context);
        };
        BaseCollection.prototype.addOnCurrentChanged = function (handler, nmspace, context) {
            this.objEvents.onProp("currentItem", handler, nmspace, context);
        };
        Object.defineProperty(BaseCollection.prototype, "errors", {
            get: function () {
                return this._errors;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseCollection.prototype, "options", {
            get: function () {
                return this._options;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseCollection.prototype, "items", {
            get: function () {
                return this._items;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseCollection.prototype, "currentItem", {
            get: function () {
                return this.getItemByPos(this._currentPos);
            },
            set: function (v) {
                this._setCurrentItem(v);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseCollection.prototype, "count", {
            get: function () {
                return this._items.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseCollection.prototype, "totalCount", {
            get: function () {
                return this._totalCount;
            },
            set: function (v) {
                if (v !== this._totalCount) {
                    this._totalCount = v;
                    this.objEvents.raiseProp("totalCount");
                    this.objEvents.raiseProp("pageCount");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseCollection.prototype, "pageSize", {
            get: function () {
                return this._options.pageSize;
            },
            set: function (v) {
                if (this._options.pageSize !== v) {
                    this._options.pageSize = v;
                    this.objEvents.raiseProp("pageSize");
                    this._onPageSizeChanged();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseCollection.prototype, "pageIndex", {
            get: function () {
                return this._pageIndex;
            },
            set: function (v) {
                if (v !== this._pageIndex && this.isPagingEnabled) {
                    if (v < 0) {
                        return;
                    }
                    if (!this._onPageChanging()) {
                        return;
                    }
                    this._pageIndex = v;
                    this._onPageChanged();
                    this.objEvents.raiseProp("pageIndex");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseCollection.prototype, "pageCount", {
            get: function () {
                var rowCount = this.totalCount, rowPerPage = this.pageSize;
                var result;
                if ((rowCount === 0) || (rowPerPage === 0)) {
                    return 0;
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
        Object.defineProperty(BaseCollection.prototype, "isPagingEnabled", {
            get: function () {
                return this._options.enablePaging;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseCollection.prototype, "isEditing", {
            get: function () {
                return !!this._EditingItem;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseCollection.prototype, "isLoading", {
            get: function () {
                return this._isLoading;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseCollection.prototype, "isUpdating", {
            get: function () {
                return this._isUpdating;
            },
            set: function (v) {
                if (this._isUpdating !== v) {
                    this._isUpdating = v;
                    this.objEvents.raiseProp("isUpdating");
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseCollection.prototype, "permissions", {
            get: function () {
                return this._perms;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BaseCollection.prototype, "uniqueID", {
            get: function () {
                return this._uniqueID;
            },
            enumerable: false,
            configurable: true
        });
        return BaseCollection;
    }(object_3.BaseObject));
    exports.BaseCollection = BaseCollection;
});
define("jriapp_shared/collection/validation", ["require", "exports", "jriapp_shared/lang", "jriapp_shared/utils/utils"], function (require, exports, lang_8, utils_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Validations = void 0;
    var utils = utils_4.Utils, Indexer = utils.core.Indexer, _a = utils.check, isGuid = _a.isGuid, isNumber = _a.isNumber, isString = _a.isString, isArray = _a.isArray, isDate = _a.isDate, isBoolean = _a.isBoolean, format = utils.str.format;
    function fn_toArray(index) {
        var keys = Object.keys(index), result = [], len = keys.length;
        for (var i = 0; i < len; i += 1) {
            result.push(index[keys[i]]);
        }
        return result;
    }
    var Validations = (function () {
        function Validations() {
        }
        Validations._dtRangeToDate = function (str) {
            var dtParts = str.split("-"), dt = new Date(parseInt(dtParts[0], 10), parseInt(dtParts[1], 10) - 1, parseInt(dtParts[2], 10));
            return dt;
        };
        Validations.checkNumRange = function (num, range) {
            var errors = [], rangeParts = range.split(",");
            if (!!rangeParts[0]) {
                if (num < parseFloat(rangeParts[0])) {
                    errors.push(utils.str.format(lang_8.ERRS.ERR_FIELD_RANGE, num, range));
                }
            }
            if (!!rangeParts[1]) {
                if (num > parseFloat(rangeParts[1])) {
                    errors.push(utils.str.format(lang_8.ERRS.ERR_FIELD_RANGE, num, range));
                }
            }
            return errors;
        };
        Validations.checkDateRange = function (dt, range) {
            var errors = [], rangeParts = range.split(",");
            if (!!rangeParts[0]) {
                if (dt < Validations._dtRangeToDate(rangeParts[0])) {
                    errors.push(utils.str.format(lang_8.ERRS.ERR_FIELD_RANGE, dt, range));
                }
            }
            if (!!rangeParts[1]) {
                if (dt > Validations._dtRangeToDate(rangeParts[1])) {
                    errors.push(utils.str.format(lang_8.ERRS.ERR_FIELD_RANGE, dt, range));
                }
            }
            return errors;
        };
        Validations.checkField = function (fieldInfo, value, isNew) {
            var res = [];
            var isNullVal = (value === null || (isString(value) && !value));
            if (isNullVal && !fieldInfo.isNullable && !fieldInfo.isReadOnly) {
                if (!(isNew && fieldInfo.isAutoGenerated)) {
                    res.push(lang_8.ERRS.ERR_FIELD_ISNOT_NULLABLE);
                }
            }
            if (isNullVal) {
                return res;
            }
            switch (fieldInfo.dataType) {
                case 0:
                    break;
                case 9:
                    if (!isGuid(value)) {
                        res.push(format(lang_8.ERRS.ERR_FIELD_WRONG_TYPE, value, "Guid"));
                    }
                    break;
                case 1:
                    if (!isString(value)) {
                        res.push(format(lang_8.ERRS.ERR_FIELD_WRONG_TYPE, value, "String"));
                    }
                    if (fieldInfo.maxLength > 0 && value.length > fieldInfo.maxLength) {
                        res.push(format(lang_8.ERRS.ERR_FIELD_MAXLEN, fieldInfo.maxLength));
                    }
                    if (!!fieldInfo.regex) {
                        var reg = new RegExp(fieldInfo.regex, "i");
                        if (!reg.test(value)) {
                            res.push(format(lang_8.ERRS.ERR_FIELD_REGEX, value));
                        }
                    }
                    break;
                case 10:
                    if (!isArray(value)) {
                        res.push(format(lang_8.ERRS.ERR_FIELD_WRONG_TYPE, value, "Array"));
                    }
                    if (fieldInfo.maxLength > 0 && value.length > fieldInfo.maxLength) {
                        res.push(format(lang_8.ERRS.ERR_FIELD_MAXLEN, fieldInfo.maxLength));
                    }
                    break;
                case 2:
                    if (!isBoolean(value)) {
                        res.push(format(lang_8.ERRS.ERR_FIELD_WRONG_TYPE, value, "Boolean"));
                    }
                    break;
                case 3:
                case 4:
                case 5:
                    if (!isNumber(value)) {
                        res.push(format(lang_8.ERRS.ERR_FIELD_WRONG_TYPE, value, "Number"));
                    }
                    if (!!fieldInfo.range) {
                        Validations.checkNumRange(Number(value), fieldInfo.range).forEach(function (err) {
                            res.push(err);
                        });
                    }
                    break;
                case 6:
                case 7:
                    if (!isDate(value)) {
                        res.push(format(lang_8.ERRS.ERR_FIELD_WRONG_TYPE, value, "Date"));
                    }
                    if (!!fieldInfo.range) {
                        Validations.checkDateRange(value, fieldInfo.range).forEach(function (err) {
                            res.push(err);
                        });
                    }
                    break;
                case 8:
                    if (!isDate(value)) {
                        res.push(format(lang_8.ERRS.ERR_FIELD_WRONG_TYPE, value, "Time"));
                    }
                    break;
                default:
                    res.push(format(lang_8.ERRS.ERR_PARAM_INVALID, "dataType", fieldInfo.dataType));
            }
            return res;
        };
        Validations.distinct = function (vals) {
            if (!vals) {
                return [];
            }
            var index = Indexer();
            for (var _i = 0, vals_1 = vals; _i < vals_1.length; _i++) {
                var val = vals_1[_i];
                var name_1 = !val.fieldName ? "*" : val.fieldName;
                var test = index[name_1];
                if (!!test) {
                    test.errors = test.errors.concat(val.errors);
                }
                else {
                    index[name_1] = val;
                }
            }
            return fn_toArray(index);
        };
        return Validations;
    }());
    exports.Validations = Validations;
});
define("jriapp_shared/collection/aspect", ["require", "exports", "jriapp_shared/object", "jriapp_shared/utils/utils", "jriapp_shared/collection/utils", "jriapp_shared/errors", "jriapp_shared/collection/validation"], function (require, exports, object_4, utils_5, utils_6, errors_7, validation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ItemAspect = void 0;
    var utils = utils_5.Utils, _a = utils.core, forEach = _a.forEach, getValue = _a.getValue, setValue = _a.setValue, Indexer = _a.Indexer, isNt = utils.check.isNt, sys = utils.sys, ERROR = utils.err, cloneVals = utils_6.CollUtils.cloneVals, walkFields = utils_6.CollUtils.walkFields;
    var AspectFlags;
    (function (AspectFlags) {
        AspectFlags[AspectFlags["IsAttached"] = 0] = "IsAttached";
        AspectFlags[AspectFlags["IsEdited"] = 1] = "IsEdited";
        AspectFlags[AspectFlags["IsRefreshing"] = 2] = "IsRefreshing";
        AspectFlags[AspectFlags["IsCancelling"] = 3] = "IsCancelling";
    })(AspectFlags || (AspectFlags = {}));
    function disposeVal(entry, nmspace) {
        if (!entry) {
            return;
        }
        var val = entry.val;
        if (sys.isEditable(val) && val.isEditing) {
            val.cancelEdit();
        }
        var errNotification = sys.getErrorNotification(val);
        if (!!errNotification) {
            errNotification.offOnErrorsChanged(nmspace);
        }
        if (entry.isOwnIt && sys.isBaseObj(val)) {
            val.dispose();
        }
    }
    function checkDetached(aspect) {
        if (aspect.isDetached) {
            throw new Error("Invalid operation. The item is detached");
        }
    }
    var ItemAspect = (function (_super) {
        __extends(ItemAspect, _super);
        function ItemAspect(collection, vals, key, isNew) {
            var _this = _super.call(this) || this;
            _this._coll = collection;
            _this._vals = vals;
            _this._key = key;
            _this._status = isNew ? 1 : 0;
            _this._tempVals = null;
            _this._flags = 0;
            _this._valueBag = null;
            _this._item = null;
            return _this;
        }
        ItemAspect.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            var coll = this._coll, item = this._item;
            if (!!item) {
                this.cancelEdit();
                if (!this.isDetached) {
                    coll.removeItem(item);
                }
            }
            var bag = this._valueBag;
            this._valueBag = null;
            if (!!bag) {
                forEach(bag, function (_name, val) {
                    disposeVal(val, coll.uniqueID);
                });
            }
            this._flags = 0;
            this._status = 0;
            _super.prototype.dispose.call(this);
        };
        ItemAspect.prototype._onErrorsChanged = function () {
            this.objEvents.raise("errors_changed", {});
        };
        ItemAspect.prototype._getFlag = function (flag) {
            return !!(this._flags & (1 << flag));
        };
        ItemAspect.prototype._setFlag = function (v, flag) {
            if (v) {
                this._flags |= (1 << flag);
            }
            else {
                this._flags &= ~(1 << flag);
            }
        };
        ItemAspect.prototype._setIsEdited = function (v) {
            this._setFlag(v, 1);
        };
        ItemAspect.prototype._setIsCancelling = function (v) {
            this._setFlag(v, 3);
        };
        ItemAspect.prototype._cloneVals = function () {
            return cloneVals(this.coll.getFieldInfos(), this._vals);
        };
        ItemAspect.prototype._beginEdit = function () {
            checkDetached(this);
            var coll = this.coll;
            var isHandled = false;
            if (coll.isEditing) {
                var item = coll._getInternal().getEditingItem();
                if (item._aspect === this) {
                    return false;
                }
                try {
                    item._aspect.endEdit();
                    if (item._aspect.getIsHasErrors()) {
                        this.handleError(new errors_7.ValidationError(item._aspect.getAllErrors(), item), item);
                        item._aspect.cancelEdit();
                    }
                }
                catch (ex) {
                    isHandled = this.handleError(ex, item);
                    item._aspect.cancelEdit();
                    ERROR.reThrow(ex, isHandled);
                }
            }
            this._storeVals(1);
            this.coll.currentItem = this.item;
            return true;
        };
        ItemAspect.prototype._endEdit = function () {
            if (!this.isEditing) {
                return false;
            }
            checkDetached(this);
            var coll = this.coll, self = this, errors = coll.errors;
            errors.removeAllErrors(this.item);
            var validations = this._validateFields();
            if (validations.length > 0) {
                errors.addErrors(self.item, validations);
            }
            if (this.getIsHasErrors()) {
                return false;
            }
            this._tempVals = null;
            return true;
        };
        ItemAspect.prototype._cancelEdit = function () {
            if (!this.isEditing) {
                return false;
            }
            checkDetached(this);
            var coll = this.coll, self = this, item = self.item, changed = [];
            coll.errors.removeAllErrors(item);
            var names = coll.getFieldNames();
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var name_2 = names_1[_i];
                if (self._getValue(name_2, 1) !== self._getValue(name_2, 0)) {
                    changed.push(name_2);
                }
            }
            this._restoreVals(1);
            for (var _a = 0, changed_1 = changed; _a < changed_1.length; _a++) {
                var name_3 = changed_1[_a];
                sys.raiseProp(this.item, name_3);
            }
            return true;
        };
        ItemAspect.prototype._skipValidate = function (_fieldInfo, _val) {
            return false;
        };
        ItemAspect.prototype._validateItem = function () {
            return this.coll.errors.validateItem(this.item);
        };
        ItemAspect.prototype._validateField = function (fieldName) {
            var fieldInfo = this.getFieldInfo(fieldName), errors = this.coll.errors;
            var value = getValue(this._vals, fieldName);
            if (this._skipValidate(fieldInfo, value)) {
                return null;
            }
            var standardErrors = validation_1.Validations.checkField(fieldInfo, value, this.isNew);
            var customValidation = errors.validateItemField(this.item, fieldName);
            var result = { fieldName: fieldName, errors: [] };
            if (standardErrors.length > 0) {
                result.errors = standardErrors;
            }
            if (!!customValidation && customValidation.errors.length > 0) {
                result.errors = result.errors.concat(customValidation.errors);
            }
            return (result.errors.length > 0) ? result : null;
        };
        ItemAspect.prototype._validateFields = function () {
            var self = this, fieldInfos = this.coll.getFieldInfos(), res = [];
            walkFields(fieldInfos, function (fld, fullName) {
                if (fld.fieldType !== 5) {
                    var fieldValidation = self._validateField(fullName);
                    if (!!fieldValidation && fieldValidation.errors.length > 0) {
                        res.push(fieldValidation);
                    }
                }
            });
            var itemVals = self._validateItem();
            return validation_1.Validations.distinct(res.concat(itemVals));
        };
        ItemAspect.prototype._setStatus = function (v) {
            this._status = v;
        };
        ItemAspect.prototype._getValue = function (name, ver) {
            switch (ver) {
                case 0:
                    return getValue(this._vals, name);
                case 1:
                    if (!this._tempVals) {
                        throw new Error("Invalid Operation, no Stored Version: " + ver);
                    }
                    return getValue(this._tempVals, name);
                default:
                    throw new Error("Invalid Operation, Unknown Version: " + ver);
            }
        };
        ItemAspect.prototype._setValue = function (name, val, ver) {
            switch (ver) {
                case 0:
                    setValue(this._vals, name, val, false);
                    break;
                case 1:
                    if (!this._tempVals) {
                        throw new Error("Invalid Operation, no Stored Version: " + ver);
                    }
                    setValue(this._tempVals, name, val, false);
                    break;
                default:
                    throw new Error("Invalid Operation, Unknown Version: " + ver);
            }
        };
        ItemAspect.prototype._setVals = function (vals) {
            this._vals = vals;
        };
        ItemAspect.prototype._storeVals = function (toVer) {
            switch (toVer) {
                case 1:
                    this._tempVals = this._cloneVals();
                    break;
                default:
                    throw new Error("Invalid Operation, Unknown Version: " + toVer);
            }
        };
        ItemAspect.prototype._restoreVals = function (fromVer) {
            switch (fromVer) {
                case 1:
                    if (!this._tempVals) {
                        throw new Error("Invalid Operation, no Stored Version: " + fromVer);
                    }
                    this._setVals(this._tempVals);
                    this._tempVals = null;
                    break;
                default:
                    throw new Error("Invalid Operation, Unknown Version: " + fromVer);
            }
        };
        ItemAspect.prototype._resetStatus = function () {
            this._status = 0;
        };
        ItemAspect.prototype._setKey = function (v) {
            this._key = v;
        };
        ItemAspect.prototype._setIsAttached = function (v) {
            this._setFlag(v, 0);
        };
        ItemAspect.prototype._setIsRefreshing = function (v) {
            if (this.isRefreshing !== v) {
                this._setFlag(v, 2);
                this.objEvents.raiseProp("isRefreshing");
            }
        };
        ItemAspect.prototype.handleError = function (error, source) {
            return this.coll.handleError(error, source);
        };
        ItemAspect.prototype.raiseErrorsChanged = function () {
            this._onErrorsChanged();
        };
        ItemAspect.prototype.getFieldInfo = function (fieldName) {
            return this.coll.getFieldInfo(fieldName);
        };
        ItemAspect.prototype.getFieldNames = function () {
            return this.coll.getFieldNames();
        };
        ItemAspect.prototype.getErrorString = function () {
            var itemErrors = this.coll.errors.getErrors(this.item);
            if (!itemErrors) {
                return "";
            }
            var res = [];
            forEach(itemErrors, function (name, errs) {
                for (var _i = 0, errs_2 = errs; _i < errs_2.length; _i++) {
                    var err = errs_2[_i];
                    res.push(name + ": " + err);
                }
            });
            return res.join("|");
        };
        ItemAspect.prototype.submitChanges = function () {
            return utils.async.reject("not implemented");
        };
        ItemAspect.prototype.rejectChanges = function () {
        };
        ItemAspect.prototype.beginEdit = function () {
            checkDetached(this);
            if (this.isEditing) {
                return false;
            }
            var coll = this.coll, internal = coll._getInternal(), item = this.item;
            internal.onBeforeEditing(item, true, false);
            if (!this._beginEdit()) {
                return false;
            }
            internal.onEditing(item, true, false);
            if (!!this._valueBag && this.isEditing) {
                forEach(this._valueBag, function (_name, obj) {
                    if (!!obj && sys.isEditable(obj.val)) {
                        obj.val.beginEdit();
                    }
                });
            }
            return true;
        };
        ItemAspect.prototype.endEdit = function () {
            if (!this.isEditing) {
                return false;
            }
            checkDetached(this);
            var coll = this.coll, internal = coll._getInternal(), item = this.item;
            internal.onBeforeEditing(item, false, false);
            var customEndEdit = true;
            if (!!this._valueBag) {
                forEach(this._valueBag, function (_name, obj) {
                    if (!!obj && sys.isEditable(obj.val)) {
                        if (!obj.val.endEdit()) {
                            customEndEdit = false;
                        }
                    }
                });
            }
            if (!customEndEdit || !this._endEdit()) {
                return false;
            }
            internal.onEditing(item, false, false);
            this._setIsEdited(true);
            return true;
        };
        ItemAspect.prototype.cancelEdit = function () {
            if (!this.isEditing) {
                return false;
            }
            checkDetached(this);
            this._setIsCancelling(true);
            try {
                var coll = this.coll, internal = coll._getInternal(), item = this.item, isNew = this.isNew;
                internal.onBeforeEditing(item, false, true);
                if (!!this._valueBag) {
                    forEach(this._valueBag, function (_name, obj) {
                        if (!!obj && sys.isEditable(obj.val)) {
                            obj.val.cancelEdit();
                        }
                    });
                }
                if (!this._cancelEdit()) {
                    return false;
                }
                internal.onEditing(item, false, true);
                if (isNew && !this.isEdited && !this.getIsStateDirty()) {
                    this.dispose();
                }
            }
            finally {
                this._setIsCancelling(false);
            }
            return true;
        };
        ItemAspect.prototype.deleteItem = function () {
            var coll = this.coll;
            if (this.isDetached) {
                return false;
            }
            var args = { item: this.item, isCancel: false };
            coll._getInternal().onItemDeleting(args);
            if (args.isCancel) {
                return false;
            }
            this.dispose();
            return true;
        };
        ItemAspect.prototype.getIsHasErrors = function () {
            var res = !!this.coll.errors.getErrors(this.item);
            if (!res && !!this._valueBag) {
                forEach(this._valueBag, function (_name, obj) {
                    if (!!obj) {
                        var errNotification = sys.getErrorNotification(obj.val);
                        if (!!errNotification && errNotification.getIsHasErrors()) {
                            res = true;
                        }
                    }
                });
            }
            return res;
        };
        ItemAspect.prototype.addOnErrorsChanged = function (fn, nmspace, context) {
            this.objEvents.on("errors_changed", fn, nmspace, context);
        };
        ItemAspect.prototype.offOnErrorsChanged = function (nmspace) {
            this.objEvents.off("errors_changed", nmspace);
        };
        ItemAspect.prototype.getFieldErrors = function (fieldName) {
            var res = [], itemErrors = this.coll.errors.getErrors(this.item);
            if (!itemErrors) {
                return res;
            }
            var name = fieldName;
            if (!fieldName) {
                fieldName = "*";
            }
            if (!itemErrors[fieldName]) {
                return res;
            }
            if (fieldName === "*") {
                name = null;
            }
            res.push({ fieldName: name, errors: itemErrors[fieldName] });
            return res;
        };
        ItemAspect.prototype.getAllErrors = function () {
            var res = [];
            if (!!this._valueBag) {
                forEach(this._valueBag, function (_name, obj) {
                    var errNotification = sys.getErrorNotification(obj.val);
                    if (!!errNotification) {
                        res = res.concat(errNotification.getAllErrors());
                    }
                });
            }
            var itemErrors = this.coll.errors.getErrors(this.item);
            if (!itemErrors) {
                return res;
            }
            forEach(itemErrors, function (name) {
                var fieldName = null;
                if (name !== "*") {
                    fieldName = name;
                }
                res.push({ fieldName: fieldName, errors: itemErrors[name] });
            });
            return res;
        };
        ItemAspect.prototype.getIErrorNotification = function () {
            return this;
        };
        ItemAspect.prototype.setCustomVal = function (name, val, isOwnVal) {
            var _this = this;
            if (isOwnVal === void 0) { isOwnVal = true; }
            checkDetached(this);
            if (!this._valueBag) {
                if (isNt(val)) {
                    return;
                }
                this._valueBag = Indexer();
            }
            var oldEntry = this._valueBag[name], coll = this.coll;
            if (!!oldEntry && oldEntry.val !== val) {
                disposeVal(oldEntry, coll.uniqueID);
            }
            if (isNt(val)) {
                delete this._valueBag[name];
            }
            else {
                var newEntry = { val: val, isOwnIt: !!isOwnVal };
                this._valueBag[name] = newEntry;
                var errNotification = sys.getErrorNotification(val);
                if (!!errNotification) {
                    errNotification.addOnErrorsChanged(function () {
                        _this.raiseErrorsChanged();
                    }, coll.uniqueID);
                }
                if (this.isEditing && sys.isEditable(val)) {
                    val.beginEdit();
                }
            }
        };
        ItemAspect.prototype.getCustomVal = function (name) {
            if (!this._valueBag) {
                return null;
            }
            var obj = this._valueBag[name];
            return (!obj) ? null : obj.val;
        };
        ItemAspect.prototype.toString = function () {
            return "ItemAspect";
        };
        Object.defineProperty(ItemAspect.prototype, "hasTempVals", {
            get: function () {
                return !!this._tempVals;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "vals", {
            get: function () {
                return this._cloneVals();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "item", {
            get: function () {
                if (!this._item) {
                    this._item = this.coll.itemFactory(this);
                }
                return this._item;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "key", {
            get: function () {
                return this._key;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "coll", {
            get: function () {
                return this._coll;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "status", {
            get: function () {
                return this._status;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "isUpdating", {
            get: function () {
                return this.coll.isUpdating;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "isEditing", {
            get: function () {
                var editingItem = this.coll._getInternal().getEditingItem();
                return !!editingItem && editingItem._aspect === this;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "isCanSubmit", {
            get: function () {
                return false;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "isHasChanges", {
            get: function () {
                return this._status !== 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "isNew", {
            get: function () {
                return this._status === 1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "isDeleted", {
            get: function () {
                return this._status === 3;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "isEdited", {
            get: function () {
                return this._getFlag(1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "isDetached", {
            get: function () {
                return !this._getFlag(0);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "isRefreshing", {
            get: function () {
                return this._getFlag(2);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemAspect.prototype, "isCancelling", {
            get: function () {
                return this._getFlag(3);
            },
            enumerable: false,
            configurable: true
        });
        return ItemAspect;
    }(object_4.BaseObject));
    exports.ItemAspect = ItemAspect;
});
define("jriapp_shared/collection/item", ["require", "exports", "jriapp_shared/object"], function (require, exports, object_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CollectionItem = void 0;
    var CollectionItem = (function (_super) {
        __extends(CollectionItem, _super);
        function CollectionItem(aspect) {
            var _this = _super.call(this) || this;
            _this.__aspect = aspect;
            return _this;
        }
        CollectionItem.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            var aspect = this.__aspect;
            if (!aspect.getIsStateDirty()) {
                aspect.dispose();
            }
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(CollectionItem.prototype, "_aspect", {
            get: function () {
                return this.__aspect;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CollectionItem.prototype, "_key", {
            get: function () {
                return this.__aspect.key;
            },
            enumerable: false,
            configurable: true
        });
        CollectionItem.prototype.toString = function () {
            return "CollectionItem";
        };
        return CollectionItem;
    }(object_5.BaseObject));
    exports.CollectionItem = CollectionItem;
});
define("jriapp_shared/collection/list", ["require", "exports", "jriapp_shared/utils/utils", "jriapp_shared/lang", "jriapp_shared/collection/utils", "jriapp_shared/collection/base", "jriapp_shared/collection/aspect", "jriapp_shared/errors"], function (require, exports, utils_7, lang_9, utils_8, base_1, aspect_1, errors_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseList = exports.ListItemAspect = void 0;
    var utils = utils_7.Utils, Indexer = utils.core.Indexer, format = utils.str.format, isArray = utils.check.isArray, walkField = utils_8.CollUtils.walkField, initVals = utils_8.CollUtils.initVals, sys = utils.sys;
    var ListItemAspect = (function (_super) {
        __extends(ListItemAspect, _super);
        function ListItemAspect() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ListItemAspect.prototype._setProp = function (name, val) {
            if (this.isCancelling) {
                return;
            }
            var error;
            var coll = this.coll, item = this.item, fieldInfo = this.getFieldInfo(name), errors = coll.errors;
            if (this._getProp(name) !== val) {
                try {
                    if (fieldInfo.isReadOnly && !(this.isNew && fieldInfo.allowClientDefault)) {
                        throw new Error(lang_9.ERRS.ERR_FIELD_READONLY);
                    }
                    this._setValue(name, val, 0);
                    sys.raiseProp(item, name);
                    errors.removeError(item, name);
                    var validationInfo = this._validateField(name);
                    if (!!validationInfo && validationInfo.errors.length > 0) {
                        throw new errors_8.ValidationError([validationInfo], this);
                    }
                }
                catch (ex) {
                    if (utils.sys.isValidationError(ex)) {
                        error = ex;
                    }
                    else {
                        error = new errors_8.ValidationError([
                            { fieldName: name, errors: [ex.message] }
                        ], this);
                    }
                    errors.addError(item, name, error.validations[0].errors);
                    throw error;
                }
            }
        };
        ListItemAspect.prototype._getProp = function (name) {
            return this._getValue(name, 0);
        };
        ListItemAspect.prototype.toString = function () {
            if (!this.item) {
                return "ListItemAspect";
            }
            return this.item.toString() + "Aspect";
        };
        Object.defineProperty(ListItemAspect.prototype, "list", {
            get: function () {
                return this.coll;
            },
            enumerable: false,
            configurable: true
        });
        return ListItemAspect;
    }(aspect_1.ItemAspect));
    exports.ListItemAspect = ListItemAspect;
    var BaseList = (function (_super) {
        __extends(BaseList, _super);
        function BaseList(props) {
            var _this = _super.call(this) || this;
            _this._fieldMap = Indexer();
            _this._fieldInfos = [];
            _this._newKey = 0;
            if (!!props) {
                _this._updateFieldMap(props);
            }
            return _this;
        }
        BaseList.prototype._updateFieldMap = function (props) {
            var self = this;
            if (!isArray(props) || props.length === 0) {
                throw new Error(format(lang_9.ERRS.ERR_PARAM_INVALID, "props", props));
            }
            self._fieldMap = Indexer();
            self._fieldInfos = [];
            for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                var prop = props_1[_i];
                var fldInfo = base_1.BaseCollection.getEmptyFieldInfo(prop.name);
                fldInfo.dataType = prop.dtype;
                self._fieldMap[prop.name] = fldInfo;
                self._fieldInfos.push(fldInfo);
                walkField(fldInfo, function (fld, fullName) {
                    fld.dependents = null;
                    fld.fullName = fullName;
                });
            }
        };
        BaseList.prototype._clear = function (reason, oper) {
            _super.prototype._clear.call(this, reason, oper);
            this._newKey = 0;
        };
        BaseList.prototype.createItem = function (obj) {
            var isNew = !obj, vals = isNew ? initVals(this.getFieldInfos(), {}) : obj, key = this._getNewKey();
            var aspect = new ListItemAspect(this, vals, key, isNew);
            return aspect.item;
        };
        BaseList.prototype._getNewKey = function () {
            var key = "clkey_" + this._newKey;
            this._newKey += 1;
            return key;
        };
        BaseList.prototype._createNew = function () {
            return this.createItem(null);
        };
        BaseList.prototype.getFieldMap = function () {
            return this._fieldMap;
        };
        BaseList.prototype.getFieldInfos = function () {
            return this._fieldInfos;
        };
        BaseList.prototype.fillItems = function (objArray, clearAll) {
            var self = this, newItems = [], items = [];
            if (!objArray) {
                objArray = [];
            }
            try {
                if (!!clearAll) {
                    this.clear();
                }
                for (var _i = 0, objArray_1 = objArray; _i < objArray_1.length; _i++) {
                    var obj = objArray_1[_i];
                    var item = self.createItem(obj), oldItem = self.getItemByKey(item._key);
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
                    this.objEvents.raiseProp("count");
                }
            }
            finally {
                this._onCollectionChanged({
                    changeType: 2,
                    reason: 0,
                    oper: 1,
                    items: items
                });
                this._onFillEnd({
                    items: items,
                    newItems: newItems,
                    reason: 0
                });
            }
            this.moveFirst();
        };
        BaseList.prototype.getNewItems = function () {
            return this.items.filter(function (item) {
                return item._aspect.isNew;
            });
        };
        BaseList.prototype.resetStatus = function () {
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                item._aspect._resetStatus();
            }
        };
        BaseList.prototype.toArray = function () {
            return this.items.map(function (item) {
                return item._aspect.vals;
            });
        };
        BaseList.prototype.toString = function () {
            return "BaseList";
        };
        return BaseList;
    }(base_1.BaseCollection));
    exports.BaseList = BaseList;
});
define("jriapp_shared/utils/anylist", ["require", "exports", "jriapp_shared/utils/coreutils", "jriapp_shared/utils/sysutils", "jriapp_shared/utils/strutils", "jriapp_shared/utils/debounce", "jriapp_shared/collection/item", "jriapp_shared/collection/validation", "jriapp_shared/collection/list", "jriapp_shared/errors"], function (require, exports, coreutils_12, sysutils_5, strutils_6, debounce_2, item_1, validation_2, list_1, errors_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnyList = exports.AnyValListItem = exports.AnyItemAspect = void 0;
    var getValue = coreutils_12.CoreUtils.getValue, setValue = coreutils_12.CoreUtils.setValue, Indexer = coreutils_12.CoreUtils.Indexer, startsWith = strutils_6.StringUtils.startsWith, trimBrackets = strutils_6.StringUtils.trimBrackets, sys = sysutils_5.SysUtils;
    var AnyItemAspect = (function (_super) {
        __extends(AnyItemAspect, _super);
        function AnyItemAspect() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AnyItemAspect.prototype._validateField = function (name) {
            return this.coll.errors.validateItemField(this.item, name);
        };
        AnyItemAspect.prototype._cloneVals = function () {
            var obj = _super.prototype._cloneVals.call(this);
            obj.val = JSON.parse(JSON.stringify(obj.val));
            return obj;
        };
        AnyItemAspect.prototype._validateFields = function () {
            return validation_2.Validations.distinct(this._validateItem());
        };
        AnyItemAspect.prototype._getProp = function (name) {
            return this._getValue(name, 0);
        };
        AnyItemAspect.prototype._setProp = function (name, val) {
            if (this._getProp(name) !== val) {
                this._setValue(name, val, 0);
                sys.raiseProp(this.item, name);
            }
        };
        AnyItemAspect.prototype.toString = function () {
            return "AnyItemAspect";
        };
        return AnyItemAspect;
    }(list_1.ListItemAspect));
    exports.AnyItemAspect = AnyItemAspect;
    var AnyValListItem = (function (_super) {
        __extends(AnyValListItem, _super);
        function AnyValListItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AnyValListItem.prototype.isHasProp = function (prop) {
            if (startsWith(prop, "[")) {
                return true;
            }
            return _super.prototype.isHasProp.call(this, prop);
        };
        AnyValListItem.prototype.getProp = function (name) {
            var fieldName = trimBrackets(name);
            return getValue(this.val, fieldName);
        };
        AnyValListItem.prototype.setProp = function (name, val) {
            var coll = this._aspect.coll, errors = coll.errors, old = this.getProp(name);
            if (old !== val) {
                try {
                    var fieldName = trimBrackets(name);
                    setValue(this.val, fieldName, val, false);
                    sys.raiseProp(this, name);
                    errors.removeError(this, name);
                    var validation = this._aspect._validateField(name);
                    if (!!validation && validation.errors.length > 0) {
                        throw new errors_9.ValidationError([validation], this);
                    }
                }
                catch (ex) {
                    var error = void 0;
                    if (sys.isValidationError(ex)) {
                        error = ex;
                    }
                    else {
                        error = new errors_9.ValidationError([
                            { fieldName: name, errors: [ex.message] }
                        ], this);
                    }
                    errors.addError(this, name, error.validations[0].errors);
                    throw error;
                }
            }
        };
        Object.defineProperty(AnyValListItem.prototype, "val", {
            get: function () {
                return this._aspect._getProp("val");
            },
            set: function (v) {
                this._aspect._setProp("val", v);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AnyValListItem.prototype, "isPropertyBag", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AnyValListItem.prototype, "list", {
            get: function () {
                return this._aspect.list;
            },
            enumerable: false,
            configurable: true
        });
        AnyValListItem.prototype.toString = function () {
            return "AnyValListItem";
        };
        return AnyValListItem;
    }(item_1.CollectionItem));
    exports.AnyValListItem = AnyValListItem;
    var AnyList = (function (_super) {
        __extends(AnyList, _super);
        function AnyList(onChanged) {
            var _this = _super.call(this, [{ name: "val", dtype: 0 }]) || this;
            _this._saveVal = null;
            _this._onChanged = onChanged;
            _this._debounce = new debounce_2.Debounce();
            _this.addOnBeginEdit(function (_, a) {
                _this._saveVal = JSON.stringify(a.item.val);
            });
            _this.addOnEndEdit(function (_, a) {
                var item = a.item;
                if (a.isCanceled) {
                    _this._saveVal = null;
                    item.objEvents.raiseProp("[*]");
                    return;
                }
                var oldVal = _this._saveVal, newVal = JSON.stringify(item.val);
                _this._saveVal = null;
                if (oldVal !== newVal) {
                    _this.onChanged();
                }
            });
            _this.addOnCollChanged(function (_, a) {
                switch (a.changeType) {
                    case 0:
                        {
                            _this.onChanged();
                        }
                        break;
                    default:
                        break;
                }
            });
            return _this;
        }
        AnyList.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this._debounce.dispose();
            this._onChanged = null;
            _super.prototype.dispose.call(this);
        };
        AnyList.prototype.itemFactory = function (aspect) {
            return new AnyValListItem(aspect);
        };
        AnyList.prototype.createItem = function (obj) {
            var isNew = !obj;
            var vals = isNew ? { val: Indexer() } : obj;
            if (!vals.val) {
                vals.val = Indexer();
            }
            var key = this._getNewKey();
            var aspect = new AnyItemAspect(this, vals, key, isNew);
            return aspect.item;
        };
        AnyList.prototype.onChanged = function () {
            var _this = this;
            this._debounce.enque(function () {
                if (!!_this._onChanged) {
                    var arr = _this.items.map(function (item) {
                        return item.val;
                    });
                    _this._onChanged(arr);
                }
            });
        };
        AnyList.prototype.setValues = function (values) {
            var vals = values.map(function (val) {
                return { val: val };
            });
            this.fillItems(vals, true);
        };
        AnyList.prototype.toString = function () {
            return "AnyList";
        };
        return AnyList;
    }(list_1.BaseList));
    exports.AnyList = AnyList;
});
define("jriapp_shared/utils/jsonarray", ["require", "exports", "jriapp_shared/object", "jriapp_shared/utils/coreutils", "jriapp_shared/utils/anylist"], function (require, exports, object_6, coreutils_13, anylist_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JsonArray = void 0;
    var getNewID = coreutils_13.CoreUtils.getNewID, getValue = coreutils_13.CoreUtils.getValue, setValue = coreutils_13.CoreUtils.setValue;
    var BAG_EVENTS;
    (function (BAG_EVENTS) {
        BAG_EVENTS["errors_changed"] = "errors_changed";
        BAG_EVENTS["validate_bag"] = "validate_bag";
        BAG_EVENTS["validate_field"] = "validate_field";
    })(BAG_EVENTS || (BAG_EVENTS = {}));
    var JsonArray = (function (_super) {
        __extends(JsonArray, _super);
        function JsonArray(owner, pathToArray) {
            var _this = _super.call(this) || this;
            _this._list = null;
            _this._uniqueID = getNewID("jsn");
            _this._owner = owner;
            _this._pathToArray = pathToArray;
            _this.owner.objEvents.onProp("val", function () {
                if (!!_this._list) {
                    _this._list.setValues(_this.getArray());
                }
            }, _this._uniqueID);
            return _this;
        }
        JsonArray.prototype.dispose = function () {
            if (this.getIsDisposed()) {
                return;
            }
            this.setDisposing();
            this._owner.objEvents.offNS(this._uniqueID);
            this._list.dispose();
            this._list = null;
            this._owner = null;
            _super.prototype.dispose.call(this);
        };
        JsonArray.prototype.updateArray = function (arr) {
            setValue(this._owner.val, this._pathToArray, arr, false);
            this._owner.updateJson();
        };
        JsonArray.prototype.addOnValidateBag = function (fn, nmspace, context) {
            this.objEvents.on("validate_bag", fn, nmspace, context);
        };
        JsonArray.prototype.offOnValidateBag = function (nmspace) {
            this.objEvents.off("validate_bag", nmspace);
        };
        JsonArray.prototype.addOnValidateField = function (fn, nmspace, context) {
            this.objEvents.on("validate_field", fn, nmspace, context);
        };
        JsonArray.prototype.offOnValidateField = function (nmspace) {
            this.objEvents.off("validate_field", nmspace);
        };
        JsonArray.prototype._validateBag = function (bag) {
            var args = {
                bag: bag,
                result: []
            };
            this.objEvents.raise("validate_bag", args);
            return (!!args.result) ? args.result : [];
        };
        JsonArray.prototype._validateField = function (bag, fieldName) {
            var args = {
                bag: bag,
                fieldName: fieldName,
                errors: []
            };
            this.objEvents.raise("validate_field", args);
            return (!!args.errors && args.errors.length > 0) ? { fieldName: fieldName, errors: args.errors } : null;
        };
        JsonArray.prototype.getArray = function () {
            if (!this._owner) {
                return [];
            }
            var res = getValue(this._owner.val, this._pathToArray);
            return (!res) ? [] : res;
        };
        Object.defineProperty(JsonArray.prototype, "pathToArray", {
            get: function () {
                return this._pathToArray;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(JsonArray.prototype, "owner", {
            get: function () {
                return this._owner;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(JsonArray.prototype, "list", {
            get: function () {
                var _this = this;
                if (!!this._owner && !this._list) {
                    this._list = new anylist_1.AnyList(function (vals) {
                        _this.updateArray(vals);
                    });
                    this._list.addOnValidateField(function (_, args) {
                        var validationInfo = _this._validateField(args.item, args.fieldName);
                        if (!!validationInfo && validationInfo.errors.length > 0) {
                            args.errors = validationInfo.errors;
                        }
                    }, this._uniqueID);
                    this._list.addOnValidateItem(function (_, args) {
                        var validationInfos = _this._validateBag(args.item);
                        args.result = validationInfos;
                    }, this._uniqueID);
                    this._list.setValues(this.getArray());
                }
                return this._list;
            },
            enumerable: false,
            configurable: true
        });
        return JsonArray;
    }(object_6.BaseObject));
    exports.JsonArray = JsonArray;
});
define("jriapp_shared/utils/weakmap", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createWeakMap = void 0;
    var _undefined = void 0;
    var counter = (new Date().getTime()) % 1e9;
    function createWeakMap() {
        var win = window;
        if (!win.WeakMap) {
            win.WeakMap = WeakMap;
        }
        return new win.WeakMap();
    }
    exports.createWeakMap = createWeakMap;
    var WeakMap = (function () {
        function WeakMap() {
            this._name = "_wm_" + (Math.random() * 1e9 >>> 0) + (counter++ + "__");
        }
        WeakMap.prototype.set = function (key, value) {
            var entry = key[this._name];
            if (!!entry && entry[0] === key) {
                entry[1] = value;
            }
            else {
                Object.defineProperty(key, this._name, { value: [key, value], writable: true });
            }
            return this;
        };
        WeakMap.prototype.get = function (key) {
            var entry = key[this._name];
            return (!entry ? _undefined : (entry[0] === key ? entry[1] : _undefined));
        };
        WeakMap.prototype.delete = function (key) {
            var entry = key[this._name];
            if (!entry) {
                return false;
            }
            var hasValue = (entry[0] === key);
            entry[0] = entry[1] = _undefined;
            return hasValue;
        };
        WeakMap.prototype.has = function (key) {
            var entry = key[this._name];
            if (!entry) {
                return false;
            }
            return (entry[0] === key);
        };
        return WeakMap;
    }());
});
define("jriapp_shared/collection/dictionary", ["require", "exports", "jriapp_shared/utils/utils", "jriapp_shared/lang", "jriapp_shared/collection/utils", "jriapp_shared/collection/base", "jriapp_shared/collection/list"], function (require, exports, utils_9, lang_10, utils_10, base_2, list_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseDictionary = void 0;
    var utils = utils_9.Utils, format = utils.str.format, isNt = utils.check.isNt, sys = utils.sys, collUtils = utils_10.CollUtils;
    sys.getItemByProp = function (obj, prop) {
        if (obj instanceof BaseDictionary) {
            return obj.getItemByKey(prop);
        }
        else if (obj instanceof base_2.BaseCollection) {
            return obj.getItemByPos(parseInt(prop, 10));
        }
        else {
            return null;
        }
    };
    var BaseDictionary = (function (_super) {
        __extends(BaseDictionary, _super);
        function BaseDictionary(keyName, props) {
            var _this = this;
            if (!keyName) {
                throw new Error(format(lang_10.ERRS.ERR_PARAM_INVALID, "keyName", keyName));
            }
            _this = _super.call(this, props) || this;
            _this._keyName = keyName;
            var keyFld = _this.getFieldInfo(keyName);
            if (!keyFld) {
                throw new Error(format(lang_10.ERRS.ERR_DICTKEY_IS_NOTFOUND, keyName));
            }
            keyFld.isPrimaryKey = 1;
            return _this;
        }
        BaseDictionary.prototype.createItem = function (obj) {
            var isNew = !obj, vals = isNew ? collUtils.initVals(this.getFieldInfos(), {}) : obj;
            var key;
            if (isNew) {
                key = this._getNewKey();
            }
            else {
                if (isNt(vals[this._keyName])) {
                    throw new Error(format(lang_10.ERRS.ERR_DICTKEY_IS_EMPTY, this._keyName));
                }
                key = "" + vals[this._keyName];
            }
            var aspect = new list_2.ListItemAspect(this, vals, key, isNew);
            return aspect.item;
        };
        BaseDictionary.prototype._onItemAdded = function (item) {
            _super.prototype._onItemAdded.call(this, item);
            var key = item[this._keyName], self = this;
            if (isNt(key)) {
                throw new Error(format(lang_10.ERRS.ERR_DICTKEY_IS_EMPTY, this._keyName));
            }
            var oldkey = item._key, newkey = "" + key;
            if (oldkey !== newkey) {
                self._remapItem(oldkey, newkey, item);
                this._onCollectionChanged({
                    changeType: 3,
                    reason: 0,
                    oper: 4,
                    items: [item],
                    old_key: oldkey,
                    new_key: newkey
                });
            }
            this.objEvents.raiseProp("[" + item._key + "]");
        };
        BaseDictionary.prototype._onRemoved = function (item) {
            var key = item[this._keyName];
            _super.prototype._onRemoved.call(this, item);
            this.objEvents.raiseProp("[" + key + "]");
        };
        Object.defineProperty(BaseDictionary.prototype, "keyName", {
            get: function () {
                return this._keyName;
            },
            enumerable: false,
            configurable: true
        });
        BaseDictionary.prototype.toString = function () {
            return "BaseDictionary";
        };
        return BaseDictionary;
    }(list_2.BaseList));
    exports.BaseDictionary = BaseDictionary;
});
define("jriapp_shared/utils/lazy", ["require", "exports", "jriapp_shared/utils/checks"], function (require, exports, checks_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Lazy = void 0;
    var isNt = checks_11.Checks.isNt;
    var Lazy = (function () {
        function Lazy(factory) {
            this._val = null;
            this._factory = factory;
            if (!this._factory) {
                throw new Error("Lazy: Invalid value factory");
            }
        }
        Lazy.prototype.dispose = function () {
            if (this.IsValueCreated) {
                if ("dispose" in this._val) {
                    this._val.dispose();
                }
            }
            this._val = void 0;
            this._factory = null;
        };
        Object.defineProperty(Lazy.prototype, "Value", {
            get: function () {
                if (this._val === null) {
                    this._val = this._factory();
                    if (isNt(this._val)) {
                        throw new Error("Lazy: the value factory did'not returned an object");
                    }
                    this._factory = null;
                }
                return this._val;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Lazy.prototype, "IsValueCreated", {
            get: function () {
                return !isNt(this._val);
            },
            enumerable: false,
            configurable: true
        });
        Lazy.prototype.getIsDisposed = function () {
            return this._val === void 0;
        };
        return Lazy;
    }());
    exports.Lazy = Lazy;
});
define("jriapp_shared", ["require", "exports", "jriapp_shared/consts", "jriapp_shared/int", "jriapp_shared/errors", "jriapp_shared/object", "jriapp_shared/utils/jsonbag", "jriapp_shared/utils/jsonarray", "jriapp_shared/utils/dates", "jriapp_shared/utils/weakmap", "jriapp_shared/lang", "jriapp_shared/collection/base", "jriapp_shared/collection/item", "jriapp_shared/collection/aspect", "jriapp_shared/collection/list", "jriapp_shared/collection/dictionary", "jriapp_shared/errors", "jriapp_shared/utils/ipromise", "jriapp_shared/utils/promise", "jriapp_shared/utils/utils", "jriapp_shared/utils/waitqueue", "jriapp_shared/utils/debounce", "jriapp_shared/utils/lazy"], function (require, exports, consts_3, int_2, errors_10, object_7, jsonbag_1, jsonarray_1, dates_2, weakmap_1, lang_11, base_3, item_2, aspect_2, list_3, dictionary_1, errors_11, ipromise_2, promise_6, utils_11, waitqueue_2, debounce_3, lazy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VERSION = exports.Lazy = exports.Debounce = exports.WaitQueue = exports.Utils = exports.CancellationTokenSource = exports.AbortablePromise = exports.StatefulPromise = exports.ValidationError = exports.BaseDictionary = exports.BaseList = exports.ListItemAspect = exports.ItemAspect = exports.CollectionItem = exports.BaseCollection = exports.LocaleERRS = exports.LocaleSTRS = exports.createWeakMap = void 0;
    __exportStar(consts_3, exports);
    __exportStar(int_2, exports);
    __exportStar(errors_10, exports);
    __exportStar(object_7, exports);
    __exportStar(jsonbag_1, exports);
    __exportStar(jsonarray_1, exports);
    __exportStar(dates_2, exports);
    Object.defineProperty(exports, "createWeakMap", { enumerable: true, get: function () { return weakmap_1.createWeakMap; } });
    Object.defineProperty(exports, "LocaleSTRS", { enumerable: true, get: function () { return lang_11.STRS; } });
    Object.defineProperty(exports, "LocaleERRS", { enumerable: true, get: function () { return lang_11.ERRS; } });
    Object.defineProperty(exports, "BaseCollection", { enumerable: true, get: function () { return base_3.BaseCollection; } });
    Object.defineProperty(exports, "CollectionItem", { enumerable: true, get: function () { return item_2.CollectionItem; } });
    Object.defineProperty(exports, "ItemAspect", { enumerable: true, get: function () { return aspect_2.ItemAspect; } });
    Object.defineProperty(exports, "ListItemAspect", { enumerable: true, get: function () { return list_3.ListItemAspect; } });
    Object.defineProperty(exports, "BaseList", { enumerable: true, get: function () { return list_3.BaseList; } });
    Object.defineProperty(exports, "BaseDictionary", { enumerable: true, get: function () { return dictionary_1.BaseDictionary; } });
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function () { return errors_11.ValidationError; } });
    __exportStar(ipromise_2, exports);
    Object.defineProperty(exports, "StatefulPromise", { enumerable: true, get: function () { return promise_6.StatefulPromise; } });
    Object.defineProperty(exports, "AbortablePromise", { enumerable: true, get: function () { return promise_6.AbortablePromise; } });
    Object.defineProperty(exports, "CancellationTokenSource", { enumerable: true, get: function () { return promise_6.CancellationTokenSource; } });
    Object.defineProperty(exports, "Utils", { enumerable: true, get: function () { return utils_11.Utils; } });
    Object.defineProperty(exports, "WaitQueue", { enumerable: true, get: function () { return waitqueue_2.WaitQueue; } });
    Object.defineProperty(exports, "Debounce", { enumerable: true, get: function () { return debounce_3.Debounce; } });
    Object.defineProperty(exports, "Lazy", { enumerable: true, get: function () { return lazy_1.Lazy; } });
    exports.VERSION = "4.0.0";
});
