/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import {
    LocaleERRS, Utils
} from "jriapp_shared";
import { IConverter } from "./int";
import { bootstrapper } from "./bootstrapper";
import { IDatepicker } from "jriapp/int";

const utils = Utils, { isNt, isNumber } = utils.check, { format, stripNonNumeric, formatNumber } = utils.str,
    { round } = utils.core, { strToDate, dateToStr } = utils.dates, boot = bootstrapper, ERRS = LocaleERRS;

export const NUM_CONV = { None: 0, Integer: 1, Decimal: 2, Float: 3, SmallInt: 4 };

export class BaseConverter implements IConverter {
    convertToSource(val: any, _param: any, _dataContext: any): any {
        return val;
    }
    convertToTarget(val: any, _param: any, _dataContext: any): any {
        return (isNt(val)) ? null : val;
    }
}
export let baseConverter = new BaseConverter();

export class DateConverter implements IConverter {
    convertToSource(val: any, _param: any, dataContext: any): Date {
        if (!val) {
            return null;
        }
        const defaults = boot.defaults, datepicker = boot.getSvc<IDatepicker>("IDatepicker");
        return (!!datepicker) ? datepicker.parseDate(val) : dateTimeConverter.convertToSource(val, defaults.dateFormat, dataContext);
    }
    convertToTarget(val: any, _param: any, dataContext: any): string {
        if (isNt(val)) {
            return "";
        }
        const defaults = boot.defaults, datepicker = boot.getSvc<IDatepicker>("IDatepicker");
        return (!!datepicker) ? datepicker.formatDate(val) : dateTimeConverter.convertToTarget(val, defaults.dateFormat, dataContext);
    }
    toString() {
        return "DateConverter";
    }
}
const dateConverter = new DateConverter();

export class DateTimeConverter implements IConverter {
    convertToSource(val: string, param: string, _dataContext: any): Date {
        return strToDate(val, param);
    }
    convertToTarget(val: Date, param: string, _dataContext: any): string {
        return dateToStr(val, param);
    }
    toString() {
        return "DateTimeConverter";
    }
}
const dateTimeConverter = new DateTimeConverter();

export class NumberConverter implements IConverter {
    convertToSource(val: any, param: any, _dataContext: any): number {
        if (isNt(val)) {
            return null;
        }
        const defaults = bootstrapper.defaults, dp = defaults.decimalPoint, thousandSep = defaults.thousandSep;
        let prec = 4;
        let value = val.replace(thousandSep, "");
        value = value.replace(dp, ".");
        value = stripNonNumeric(value);
        if (value === "") {
            return null;
        }
        let num: number = null;
        switch (param) {
            case NUM_CONV.SmallInt:
                num = parseInt(value, 10);
                break;
            case NUM_CONV.Integer:
                num = parseInt(value, 10);
                break;
            case NUM_CONV.Decimal:
                prec = defaults.decPrecision;
                num = round(parseFloat(value), prec);
                break;
            case NUM_CONV.Float:
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
    }
    convertToTarget(val: any, param: any, _dataContext: any): string {
        if (isNt(val)) {
            return "";
        }
        const defaults = bootstrapper.defaults, dp = defaults.decimalPoint, thousandSep = defaults.thousandSep;
        let prec: number;
        switch (param) {
            case NUM_CONV.Integer:
                prec = 0;
                return formatNumber(val, prec, dp, thousandSep);
            case NUM_CONV.Decimal:
                prec = defaults.decPrecision;
                return formatNumber(val, prec, dp, thousandSep);
            case NUM_CONV.SmallInt:
                prec = 0;
                return formatNumber(val, prec, dp, "");
            case NUM_CONV.Float:
                // float number type preserves all number precision
                return formatNumber(val, null, dp, thousandSep);
            default:
                return formatNumber(val, null, dp, thousandSep);
        }
    }
    toString() {
        return "NumberConverter";
    }
}
const numberConverter = new NumberConverter();

export class IntegerConverter implements IConverter {
    convertToSource(val: any, _param: any, dataContext: any): number {
        return numberConverter.convertToSource(val, NUM_CONV.Integer, dataContext);
    }
    convertToTarget(val: any, _param: any, dataContext: any): string {
        return numberConverter.convertToTarget(val, NUM_CONV.Integer, dataContext);
    }
    toString() {
        return "IntegerConverter";
    }
}
const integerConverter = new IntegerConverter();

export class SmallIntConverter implements IConverter {
    convertToSource(val: any, _param: any, dataContext: any): number {
        return numberConverter.convertToSource(val, NUM_CONV.SmallInt, dataContext);
    }
    convertToTarget(val: any, _param: any, dataContext: any): string {
        return numberConverter.convertToTarget(val, NUM_CONV.SmallInt, dataContext);
    }
    toString() {
        return "SmallIntConverter";
    }
}
const smallIntConverter = new SmallIntConverter();

export class DecimalConverter implements IConverter {
    convertToSource(val: any, _param: any, dataContext: any): number {
        return numberConverter.convertToSource(val, NUM_CONV.Decimal, dataContext);
    }
    convertToTarget(val: any, _param: any, dataContext: any): string {
        return numberConverter.convertToTarget(val, NUM_CONV.Decimal, dataContext);
    }
    toString() {
        return "DecimalConverter";
    }
}
const decimalConverter = new DecimalConverter();

export class FloatConverter implements IConverter {
    convertToSource(val: any, _param: any, dataContext: any): number {
        return numberConverter.convertToSource(val, NUM_CONV.Float, dataContext);
    }
    convertToTarget(val: any, _param: any, dataContext: any): string {
        return numberConverter.convertToTarget(val, NUM_CONV.Float, dataContext);
    }
    toString() {
        return "FloatConverter";
    }
}
const floatConverter = new FloatConverter();

export class NotConverter implements IConverter {
    convertToSource(val: any, _param: any, _dataContext: any): boolean {
        return !val;
    }
    convertToTarget(val: any, _param: any, _dataContext: any): boolean {
        return !val;
    }
}

const notConverter = new NotConverter();

boot.registerConverter("BaseConverter", baseConverter);
boot.registerConverter("dateConverter", dateConverter);
boot.registerConverter("dateTimeConverter", dateTimeConverter);
boot.registerConverter("numberConverter", numberConverter);
boot.registerConverter("integerConverter", integerConverter);
boot.registerConverter("smallIntConverter", smallIntConverter);
boot.registerConverter("decimalConverter", decimalConverter);
boot.registerConverter("floatConverter", floatConverter);
boot.registerConverter("notConverter", notConverter);
