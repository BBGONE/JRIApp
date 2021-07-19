/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
export const enum SERVICES {
    TOOLTIP_SVC = "ITooltipService",
    DATEPICKER_SVC = "IDatepicker",
    UIERRORS_SVC = "IUIErrorsService"
}

export const enum BINDING_MODE {
    OneTime = 0,
    OneWay = 1,
    TwoWay = 2,
    BackWay = 3
}

export const enum STORE_KEY {
    SVC = "svc.",
    CONVERTER = "cnv.",
    OBJECT = "obj.",
    OPTION = "opt.",
    LOADER = "ldr.",
    TGROUP = "tgrp."
}

export const enum DATA_ATTR {
    DATA_BIND = "data-bind",
    DATA_VIEW = "data-view",
    DATA_VIEW_OPTIONS = "data-view-options",
    DATA_EVENT_SCOPE = "data-scope",
    DATA_ITEM_KEY = "data-key",
    DATA_CONTENT = "data-content",
    DATA_COLUMN = "data-column",
    DATA_NAME = "data-name",
    DATA_REQUIRE = "data-require"
}

export const enum KEYS {
    backspace = 8,
    tab = 9,
    enter = 13,
    esc = 27,
    space = 32,
    pageUp = 33,
    pageDown = 34,
    end = 35,
    home = 36,
    left = 37,
    up = 38,
    right = 39,
    down = 40,
    del = 127
}

export const enum ELVIEW_NM {
    DataForm = "dataform"
}

export const enum LOADER_GIF {
    Small = "loader2.gif",
    Default = "loader.gif"
}

export const enum BindScope {
    Application = 0,
    Template = 1,
    DataForm = 2
}

export const enum BindTo {
    Source = 0,
    Target = 1
}

export const enum SubscribeFlags {
    delegationOn = 0,
    click = 1,
    change = 2,
    keypress = 3,
    keydown = 4,
    keyup = 5,
    input = 6
}
