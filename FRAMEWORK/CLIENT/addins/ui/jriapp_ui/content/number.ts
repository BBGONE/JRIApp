/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { DATA_TYPE } from "jriapp_shared/collection/const";
import { KEYS } from "jriapp/consts";
import { IConverter } from "jriapp/int";
import { bootstrapper } from "jriapp/bootstrapper";
import { TextBoxElView } from "../textbox";

import { BasicContent } from "./basic";

export class NumberContent extends BasicContent {
    static _allowedKeys: number[] = null;
    private get allowedKeys() {
        if (!NumberContent._allowedKeys) {
            NumberContent._allowedKeys = [0, KEYS.backspace, KEYS.del, KEYS.left, KEYS.right, KEYS.end, KEYS.home, KEYS.tab, KEYS.esc, KEYS.enter];
        }
        return NumberContent._allowedKeys;
    }
    // override
    protected getConverter(_isEdit: boolean): IConverter {
        const  finf = this.getFieldInfo();
        switch (finf.dataType) {
            case DATA_TYPE.Integer:
                return this.app.getConverter("integerConverter");
            case DATA_TYPE.Decimal:
                return this.app.getConverter("decimalConverter");
            default:
                return this.app.getConverter("floatConverter");
        }
    }
    // override
    protected createView(): void {
        super.createView();
        const self = this;
        if (self.view instanceof TextBoxElView) {
            (<TextBoxElView>self.view).addOnKeyPress(function (_, args) {
                args.isCancel = !self.previewKeyPress(args.keyCode, args.value);
            });
        }
    }
    protected previewKeyPress(keyCode: number, value: string) {
        const ch = String.fromCharCode(keyCode), digits = "1234567890", defaults = bootstrapper.defaults, notAllowedChars = "~@#$%^&*()+=_";
        if (notAllowedChars.indexOf(ch) > -1) {
            return false;
        }
        if (this.allowedKeys.indexOf(keyCode) > -1) {
            return true;
        }
        if (ch === "-" && value.length === 0) {
            return true;
        }
        if (ch === defaults.decimalPoint) {
            return (value.length === 0) ? false : value.indexOf(ch) < 0;
        }

        return (ch === defaults.thousandSep) ? true : digits.indexOf(ch) > -1;
    }
    toString() {
        return "NumberContent";
    }
}
