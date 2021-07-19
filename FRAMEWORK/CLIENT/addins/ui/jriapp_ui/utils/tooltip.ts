/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { ITooltipService } from "jriapp/int";
import { $ } from "./jquery";
import { DomUtils } from "jriapp/utils/dom";

const window = DomUtils.window;

export const enum css {
    toolTip = "qtip-light",
    toolTipError = "qtip-red"
}

export function createToolTipSvc(): ITooltipService {
    return new TooltipService();
}

class TooltipService implements ITooltipService {
    constructor() {
    }

    addToolTip(el: Element, tip: string, isError?: boolean, pos?: string): void {
        const $el = $(el), options: QTip2.QTipOptions = {
            content: {
                text: tip
            },
            style: {
                classes: !!isError ? css.toolTipError : css.toolTip
            },
            position: {
                my: "top left",
                at: (!!pos) ? pos : "bottom right",
                viewport: $(window),
                adjust: {
                    method: "flip",
                    x: 0,
                    y: 0
                }
            },
            hide: {
                event: "unfocus click mouseleave",
                leave: true
            }
        };

        if (!!$el.data("qtip")) {
            if (!tip) {
                $el.qtip("destroy", true);
            } else {
                $el.qtip("option", "content.text", tip);
            }
        } else if (!!tip) {
            $el.qtip(options);
        }
    }
}
