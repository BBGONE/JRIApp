/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { DATA_TYPE } from "jriapp_shared/collection/const";
import { IConverter } from "jriapp/int";
import { bootstrapper } from "jriapp/bootstrapper";

import { BasicContent } from "./basic";

export class DateTimeContent extends BasicContent {
    // override
    protected getParam(_isEdit: boolean): any {
        const finf = this.getFieldInfo(), defaults = bootstrapper.defaults;
        switch (finf.dataType) {
            case DATA_TYPE.DateTime:
                return defaults.dateTimeFormat;
            case DATA_TYPE.Date:
                return defaults.dateFormat;
            case DATA_TYPE.Time:
                return defaults.timeFormat;
            default:
                return null;
        }
    }
    // override
    protected getConverter(_isEdit: boolean): IConverter {
        return this.app.getConverter("dateTimeConverter");
    }
    toString() {
        return "DateTimeContent";
    }
}
