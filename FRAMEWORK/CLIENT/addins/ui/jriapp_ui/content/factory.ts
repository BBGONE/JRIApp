/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { DATA_TYPE } from "jriapp_shared/collection/const";
import { LocaleERRS as ERRS, Utils } from "jriapp_shared";
import {
    IContentFactory, IContentOptions, IContentConstructor
} from "jriapp/int";
import { BasicContent } from "./basic";
import { TemplateContent } from "./template";
import { StringContent } from "./string";
import { MultyLineContent } from "./multyline";
import { BoolContent } from "./bool";
import { NumberContent } from "./number";
import { DateContent } from "./date";
import { DateTimeContent } from "./datetime";
import { LookupContent } from "./lookup";

import { bootstrapper } from "jriapp/bootstrapper";

const utils = Utils, { format } = utils.str;
let factoryInstance: IContentFactory;

class ContentFactory implements IContentFactory {
    private _nextFactory: IContentFactory;

    constructor(nextFactory?: IContentFactory) {
        this._nextFactory = nextFactory;
    }

    getContentType(options: IContentOptions): IContentConstructor {
        if (!!options.template) {
            return TemplateContent;
        }
        if (!options.fieldName) {
            throw new Error(format(ERRS.ERR_PARAM_INVALID, "options", "fieldName"));
        }

        if (options.name === "lookup") {
            return LookupContent;
        }

        const fieldInfo = options.fieldInfo;
        let res: IContentConstructor;

        switch (fieldInfo.dataType) {
            case DATA_TYPE.None:
                res = BasicContent;
                break;
            case DATA_TYPE.String:
                res = (options.name === "multyline") ? MultyLineContent : StringContent;
                break;
            case DATA_TYPE.Bool:
                res = BoolContent;
                break;
            case DATA_TYPE.Integer:
                res = NumberContent;
                break;
            case DATA_TYPE.Decimal:
            case DATA_TYPE.Float:
                res = NumberContent;
                break;
            case DATA_TYPE.DateTime:
            case DATA_TYPE.Time:
                res = DateTimeContent;
                break;
            case DATA_TYPE.Date:
                res = (options.name === "datepicker") ? DateContent : DateTimeContent;
                break;
            case DATA_TYPE.Guid:
            case DATA_TYPE.Binary:
                res = BasicContent;
                break;
            default:
                throw new Error(format(ERRS.ERR_FIELD_DATATYPE, fieldInfo.dataType));
        }

        if (!res) {
            if (!this._nextFactory) {
                throw new Error(ERRS.ERR_BINDING_CONTENT_NOT_FOUND);
            } else {
                return this._nextFactory.getContentType(options);
            }
        } else {
            return res;
        }
    }
    isExternallyCachable(contentType: IContentConstructor): boolean {
        if (LookupContent === contentType) {
            return true;
        }
        if (!this._nextFactory) {
            return false;
        }
        return this._nextFactory.isExternallyCachable(contentType);
    }
}

export function initContentFactory() {
    if (!factoryInstance) {
        factoryInstance = new ContentFactory();
        bootstrapper.contentFactory.addFactory((_nextFactory?: IContentFactory) => {
            return factoryInstance;
        });
    }
}
