/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { Utils, BRACKETS, LocaleERRS as ERRS, DateUtils, TIME_RANGE } from "jriapp_shared";
import { spaceRX, getRX, DATES, TAG, TOKEN, IKeyVal, PARSE_TYPE, THIS_LEN } from "./int";
import { bootstrapper } from "../bootstrapper";

const utils = Utils, { isNumeric, isBoolString, _undefined, isString } = utils.check,
    { format, fastTrim: trim, startsWith, trimQuotes } = utils.str,
    { parseBool, extend } = utils.core, dates = DateUtils, { getBraceLen, resolvePath } = Utils.sys, debug = utils.debug, log = utils.log;

function _reportBug(bug: string): void {
    if (!debug.isDebugging()) {
        return;
    }
    debug.checkStartDebugger();
    log.error(bug);
}

export class Funcs {
    static setKeyVal(kv: IKeyVal, start: number, end: number, val: string, isKey: boolean, isLit: boolean): void {
        if (start > -1 && start < end) {
            const str = val.substring(start, end);
            const v = !isLit ? trim(str) : str;
            if (!v) {
                return;
            }
            if (isKey) {
                kv.key += v;
            } else {
                kv.val += v;
            }
        }
    }

    static getDate(val: string | null | undefined, format: string | undefined): Date {
        if (!val) {
            return dates.today();
        } else {
            const lower = val.toLowerCase();
            if (startsWith(lower, "startof")) {
                return dates.startOf(lower.substr("startof".length) as TIME_RANGE);
            } else if (startsWith(lower, "endof")) {
                return dates.endOf(lower.substr("endof".length) as TIME_RANGE);
            } else {
                switch (val.toLowerCase()) {
                    case DATES.NOW:
                        return dates.now();
                    case DATES.TODAY:
                        return dates.today();
                    case DATES.TOMORROW:
                        return dates.tomorrow();
                    case DATES.YESTERDAY:
                        return dates.yesterday();
                    default:
                        return dates.strToDate(val, format);
                }
            }
        }
    }

    static getTag(val: string, start: number, end: number): TAG {
        const token = trim(val.substring(start, end));
        let tag = TAG.NONE;

        switch (token) {
            case TOKEN.BIND:
                tag = TAG.BIND;
                break;
            case TOKEN.GET:
                tag = TAG.GET;
                break;
            case TOKEN.INJECT:
                tag = TAG.INJECT;
                break;
            case TOKEN.DATE:
                tag = TAG.DATE;
                break;
            default:
                throw new Error(`Unknown token: "${token}" in expression ${val}`);
        }

        return tag;
    }

    static checkVal(kv: IKeyVal): boolean {
        if (!kv.key) {
            return false;
        }

        if (!!kv.val) {
            switch (kv.tag) {
                case TAG.DATE:
                    {
                        const args = funcs.getExprArgs(kv.val);
                        const val = args.length > 0 ? args[0] : _undefined;

                        if (isString(val)) {
                            const format = args.length > 1 ? args[1] : "YYYYMMDD";

                            if (!isString(format)) {
                                throw new Error(`Invalid expression with key: ${kv.key} val: ${kv.val}`);
                            }

                            kv.val = funcs.getDate(val, format);
                        } else {
                            if (!!val) {
                                throw new Error(`Invalid expression with key: ${kv.key} val: ${kv.val}`);
                            }
                            kv.val = funcs.getDate(_undefined, _undefined);
                        }
                    }
                    break;
                case TAG.NONE:
                    {
                        if (isNumeric(kv.val)) {
                            kv.val = Number(kv.val);
                        } else if (isBoolString(kv.val)) {
                            kv.val = parseBool(kv.val);
                        }
                    }
                    break;
            }
        }

        return true;
    }

    // extract key - value pairs
    static getKeyVals(val: string): IKeyVal[] {
        let i: number, ch: string, literal: string, parts: IKeyVal[] = [],
            kv: IKeyVal = { tag: TAG.NONE, key: "", val: "" }, isKey = true, start = -1;
        const len = val.length;
        for (i = 0; i < len; i += 1) {
            if (start < 0) {
                start = i;
            }
            ch = val.charAt(i);

            if (!literal) {
                switch (ch) {
                    case "'":
                    case '"':
                        // is this a content inside '' or "" ?
                        funcs.setKeyVal(kv, start, i, val, isKey, false);
                        literal = ch;
                        start = i + 1;
                        if (kv.tag === TAG.NONE) {
                            kv.tag = TAG.LITERAL;
                        }
                        break;
                    case "(":
                        // is this a content inside bind( ) or get() or date() or inject?
                        if (!isKey && start < i) {
                            const tag: TAG = funcs.getTag(val, start, i);
                            const braceLen = getBraceLen(val, i, BRACKETS.ROUND);
                            funcs.setKeyVal(kv, i + 1, i + braceLen - 1, val, isKey, false);
                            if (kv.tag !== TAG.NONE) {
                                throw new Error(`Invalid tag: ${trim(val.substring(start, i))} and value: ${kv.val} in expression: ${val}`);
                            }
                            kv.tag = tag;
                            i += (braceLen - 1);
                            start = -1;
                        } else {
                            throw new Error(`Invalid: "${ch}" in expression ${val}`);
                        }
                        break;
                    case "[":
                        // is this a content inside [], something like customer[address.phone] or [Line1] or this.classes[*]?
                        funcs.setKeyVal(kv, start, i, val, isKey, false);
                        const braceLen = getBraceLen(val, i, BRACKETS.SQUARE);
                        const str = trimQuotes(val.substring(i + 1, i + braceLen - 1));
                        if (!str) {
                            throw new Error(`Invalid: "${ch}" in expression ${val}`);
                        }
                        if (isKey) {
                            kv.key += `[${str}]`;
                        } else {
                            kv.val += `[${str}]`;
                            if (kv.tag !== TAG.NONE) {
                                throw new Error(`Invalid value: ${kv.val} in expression: ${val}`);
                            }
                            kv.tag = TAG.INDEXER;
                        }
                        i += (braceLen - 1);
                        start = -1;
                        break;
                    case "{":
                        if (!isKey) {
                            const test = trim(val.substring(start, i));
                            if (!!test) {
                                throw new Error(`Invalid word: "${test}{" in expression ${val}`);
                            }
                            const braceLen = getBraceLen(val, i, BRACKETS.CURLY);
                            kv.val = val.substring(i + 1, i + braceLen - 1);
                            if (kv.tag !== TAG.NONE) {
                                throw new Error(`Invalid value: ${kv.val} after brace "{" in expression: ${val}`);
                            }
                            kv.tag = TAG.BRACE;
                            i += (braceLen - 1);
                            start = -1;
                        } else {
                            throw new Error(`Invalid: "${ch}" in expression ${val}`);
                        }
                        break;
                    case TOKEN.COMMA:
                        funcs.setKeyVal(kv, start, i, val, isKey, false);
                        start = -1;
                        parts.push(kv);
                        kv = { tag: TAG.NONE, key: "", val: "" }
                        // switch to parsing the key
                        isKey = true;
                        break;
                    case TOKEN.DELIMETER1:
                    case TOKEN.DELIMETER2:
                        funcs.setKeyVal(kv, start, i, val, isKey, false);
                        if (kv.tag !== TAG.NONE || !isKey) {
                            throw new Error(`Invalid "${ch}" at the start of: ${val.substring(i)} in expression: ${val}`);
                        }
                        start = -1;
                        // switch to parsing the value
                        isKey = false;
                        break;
                    case ")":
                    case "}":
                    case "]":
                        throw new Error(`Invalid: "${ch}" in expression ${val}`);
                    default:
                        if (kv.tag !== TAG.NONE && kv.tag !== TAG.INDEXER) {
                            if (ch !== "\t" && ch !== " " && ch !== "\n" && ch !== "\r")
                                throw new Error(`Invalid: "${ch}" at the start of: ${val.substring(i)} in expression: ${val}`);
                        }
                        break;
                }
            } else {
                // inside literal content here
                switch (ch) {
                    case "'":
                    case '"':
                        if (literal === ch) {
                            // check for quotes escape 
                            const i1 = i + 1, next = i1 < len ? val.charAt(i1) : null;
                            if (next === ch) {
                                funcs.setKeyVal(kv, start, i + 1, val, isKey, true);
                                i += 1;
                                start = -1;
                            } else {
                                funcs.setKeyVal(kv, start, i, val, isKey, true);
                                literal = null;
                                start = -1;
                            }
                        }
                        break;
                }
            }
        } // for (i = 0; i < val.length; i += 1)

        funcs.setKeyVal(kv, start, i, val, isKey, false);
        // push the last
        parts.push(kv);

        parts = parts.filter(function (kv) {
            return funcs.checkVal(kv);
        });
        return parts;
    }

    static reduceKeyVal(kv: IKeyVal, parseType: PARSE_TYPE, dataContext: any, res: any): void {
        let isBind = false, bindparts: Array<string | object>;
        const checkIsBind = parseType === PARSE_TYPE.VIEW || parseType === PARSE_TYPE.BINDING;

        if (checkIsBind && kv.tag === TAG.BIND) {
            bindparts = funcs.getExprArgs(kv.val);
            isBind = bindparts.length > 0;
        }

        if (isBind) {
            switch (parseType) {
                case PARSE_TYPE.VIEW:
                    let source = dataContext || bootstrapper.app;

                    if (bindparts.length > 1) {
                        // resolve source (second path in the array)
                        if (isString(bindparts[1])) {
                            source = resolvePath(bootstrapper.app, bindparts[1] as string);
                            if (!source) {
                                throw new Error(`Invalid source in the bind expression, see key: ${kv.key}   val: ${kv.val}`);
                            }
                        } else {
                            throw new Error(`Invalid second parameter in the bind expression, see key: ${kv.key}   val: ${kv.val}`);
                        }
                    }

                    if (isString(bindparts[0])) {
                        const boundValue = resolvePath(source, bindparts[0] as string);
                        if (boundValue === _undefined) {
                            throw new Error(`The bind expression returns UNDEFINED value, see key: ${kv.key}   val: ${kv.val}`);
                        }
                        res[kv.key] = boundValue;
                    } else {
                        throw new Error(`Invalid bind expression, see key: ${kv.key}   val: ${kv.val}`);
                    }
                    break;
                case PARSE_TYPE.BINDING:
                    if (bindparts.length > 0 && kv.key === TOKEN.PARAM) {
                        // converter Param - the bind expression
                        // the real binding is processed in the Binding class, see _isBindParam member there
                        res[kv.key] = bindparts;
                        res.isBind = true;
                    }
                    break;
                default:
                    res[kv.key] = kv.val;
                    break;
            }
        } else {
            switch (kv.tag) {
                case TAG.BRACE:
                    res[kv.key] = helper.parseOption(parseType, kv.val, dataContext);
                    break;
                case TAG.GET:
                    {
                        res[kv.key] = helper.parseGetExpr(PARSE_TYPE.NONE, kv.val, dataContext);
                    }
                    break;
                case TAG.INJECT:
                    {
                        const args = funcs.getExprArgs(kv.val);
                        let [id, ...rest] = args;

                        if (isString(id)) {
                            res[kv.key] = helper.getSvc(id, ...rest);
                        } else {
                            throw new Error(`Invalid expression with key: ${kv.key}   val: ${kv.val}`);
                        }
                    }
                    break;
                default:
                    res[kv.key] = kv.val;
                    break;
            }
        }
    }
    /**
      * resolve arguments by parsing content of expression: part1, part2 or stringDate,format? or id
    */
    static getExprArgs(expr: string): Array<string | object> {
        let i: number, ch: string, literal: string, parts: Array<string | object> = [], start = -1, seekNext = false;
        const len = expr.length;
        let current = "";

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
                                throw new Error(`Invalid expression arguments: ${expr}`);

                            if (!seekNext) {
                                current += expr.substring(start, i);
                                parts.push(current);
                            } else {
                                seekNext = false;
                            }
                            start = -1;
                            current = "";
                        }
                        break;
                    case '{':
                        {
                            if (trim(current) !== "")
                                throw new Error(`Invalid expression arguments: ${expr}`);

                            const braceLen = getBraceLen(expr, i, BRACKETS.CURLY);
                            const val = expr.substring(i + 1, i + braceLen - 1);
                            const obj = helper.parseOption(PARSE_TYPE.NONE, val, null);
                            parts.push(obj);
                            i += (braceLen - 1);
                            start = -1;
                            current = "";
                            seekNext = true;
                        }
                        break;
                }
            } else {
                // inside literal content here
                switch (ch) {
                    case "'":
                    case '"':
                        if (literal === ch) {
                            // check for quotes escape 
                            const i1 = i + 1, next = i1 < len ? expr.charAt(i1) : null;

                            if (next === ch) {
                                current += expr.substring(start, i + 1);
                                i += 1;
                                start = i + 1;
                            } else {
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
                throw new Error(`Invalid expression arguments: ${expr}`);

            current += expr.substring(start, i);
            parts.push(current);
        }

        return parts.map((p) => isString(p) ? trim(p) : p);
    }
}

const funcs = Funcs;

export class Helper {
    // extract content from the inside of top level figure braces
    static getCurlyBraceParts(val: string): string[] {
        let i: number, ch: string;
        const parts: string[] = [], len = val.length;

        for (i = 0; i < len; i += 1) {
            ch = val.charAt(i);

            switch (ch) {
                case "{":
                    const braceLen = getBraceLen(val, i, BRACKETS.CURLY);
                    parts.push(trim(val.substr(i + 1, braceLen - 2)));
                    i += (braceLen - 1);
                    break;
                default:
                    if (!spaceRX.test(ch)) {
                        throw new Error(format(ERRS.ERR_EXPR_BRACES_INVALID, val));
                    }
                    break;
            }
        }

        return parts;
    }

    static getBraceContent(val: string, brace: BRACKETS): string {
        let ch: string, start: number = 0;

        const len = val.length;
        let br1: string;
        switch (brace) {
            case BRACKETS.ROUND:
                br1 = "(";
                break;
            case BRACKETS.CURLY:
                br1 = "{";
                break;
            case BRACKETS.SQUARE:
                br1 = "[";
                break;
        }

        for (let i = 0; i < len; i += 1) {
            if (start < 0) {
                start = i;
            }
            ch = val.charAt(i);
            if (ch === br1) {
                const braceLen = getBraceLen(val, i, brace);
                return trim(val.substr(i + 1, braceLen - 2));
            }
        }

        throw new Error("Invalid Expression: " + val);
    }

    static getSvc(id: string, ...args: any[]): any {
        const argsdata: any[] = [];
        for (let i = 0; i < args.length; ++i) {
            const val = args[i];
            if (isNumeric(val)) {
                argsdata[i] = Number(val);
            } else if (isBoolString(val)) {
                argsdata[i] = parseBool(val);
            } else {
                argsdata[i] = val;
            }
        }
        return bootstrapper.app.getSvc(trimQuotes(id), ...argsdata);
    }

    static isGetExpr(val: string): boolean {
        return !!val && getRX.test(val);
    }

    static getGetParts(str: string): string[] {
        const args = funcs.getExprArgs(str);
        return args.map((id) => {
            if (!isString(id)) {
                throw new Error(`Invalid get expression: ${str}`);
            }

            return trim(helper.getOptions(trim(id)));
        });
    }

    static getOptions(id: string): string {
        return bootstrapper.app.getOptions(trimQuotes(id));
    }

    static parseGetExpr(parseType: PARSE_TYPE, strExpr: string, dataContext: any): object {
        const parts = helper.getGetParts(strExpr);
        return helper.parseOptions(parseType, parts, dataContext); 
    }

    static parseOptions(parseType: PARSE_TYPE, parts: string[], dataContext: any): object {
        let [first, ...rest] = parts;
        let obj = helper.parseOption(parseType, first, dataContext) || {};
        for (const val of rest) {
            const obj2 = helper.parseOption(parseType, val, dataContext);
            obj = extend(obj, obj2);
        }

        return obj;
    }

    static parseOption(parseType: PARSE_TYPE, part: string, dataContext: any): object {
        const res: any = parseType === PARSE_TYPE.BINDING ? {
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
            const expr = helper.getBraceContent(part, BRACKETS.ROUND);
            return helper.parseGetExpr(parseType, expr, dataContext);
        }

        const kvals = funcs.getKeyVals(part);

        for (const kv of kvals)
        {
            if (parseType === PARSE_TYPE.BINDING && !kv.val && startsWith(kv.key, TOKEN.THIS)) {
                kv.val = kv.key.substr(THIS_LEN); // extract property
                kv.key = TOKEN.TARGET_PATH;
            }

            try {
                funcs.reduceKeyVal(kv, parseType, dataContext, res);
            } catch (err) {
                res[kv.key] = _undefined;
                _reportBug(err);
            }
        }

        return res;
    }
}

const helper = Helper;