/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { bootstrapper } from "jriapp/bootstrapper";
import { SERVICES } from "jriapp/consts";
import { initContentFactory } from "./jriapp_ui/content/factory";
import { createToolTipSvc } from "./jriapp_ui/utils/tooltip";
import { createDatepickerSvc } from "./jriapp_ui/utils/datepicker";
import { createUIErrorsSvc } from "./jriapp_ui/utils/errors";

export { DIALOG_ACTION, IDialogConstructorOptions, DataEditDialog, DialogVM } from "./jriapp_ui/dialog";
export { DynaContentElView, IDynaContentAnimation, IDynaContentOptions } from "./jriapp_ui/dynacontent";
export {
    DataGrid, DataGridCell, DataGridColumn, DataGridRow, DataGridElView, IDataGridViewOptions,
    ROW_POSITION, IRowStateProvider, findDataGrid, getDataGrids
} from "./jriapp_ui/datagrid/datagrid";
export * from "./jriapp_ui/pager";
export {
    ListBox, ListBoxElView, IListBoxViewOptions, IOptionStateProvider, IOptionTextProvider
} from "./jriapp_ui/listbox";
export * from "./jriapp_ui/stackpanel";
export * from "./jriapp_ui/tabs";
export { BaseElView, addToolTip } from "./jriapp_ui/baseview";
export { TemplateElView, TemplateCommandParam } from "./jriapp_ui/template";
export { DataForm, DataFormElView } from "./jriapp_ui/dataform";
export { DatePickerElView } from "./jriapp_ui/datepicker";
export { AnchorElView, IAncorOptions } from "./jriapp_ui/anchor";
export { BlockElView } from "./jriapp_ui/block";
export { BusyElView, IBusyViewOptions } from "./jriapp_ui/busy";
export { ButtonElView } from "./jriapp_ui/button";
export { CheckBoxElView } from "./jriapp_ui/checkbox";
export { CheckBoxThreeStateElView } from "./jriapp_ui/checkbox3";
export { CommandElView } from "./jriapp_ui/command";
export { HiddenElView } from "./jriapp_ui/hidden";
export { ImgElView } from "./jriapp_ui/img";
export { InputElView } from "./jriapp_ui/input";
export { RadioElView } from "./jriapp_ui/radio";
export { SpanElView } from "./jriapp_ui/span";
export { TextAreaElView, ITextAreaOptions } from "./jriapp_ui/textarea";
export { TextBoxElView, ITextBoxOptions, TKeyPressArgs } from "./jriapp_ui/textbox";
export { ExpanderElView, IExpanderOptions } from "./jriapp_ui/expander";

export { DblClick } from "./jriapp_ui/utils/dblclick";
export { JQueryUtils, $ } from "./jriapp_ui/utils/jquery";
export * from "./jriapp_ui/content/all";

export const VERSION = "4.0.9";

const boot = bootstrapper;

initContentFactory();

boot.registerSvc(SERVICES.TOOLTIP_SVC, createToolTipSvc());
boot.registerSvc(SERVICES.DATEPICKER_SVC, createDatepickerSvc());
boot.registerSvc(SERVICES.UIERRORS_SVC, createUIErrorsSvc());

// Load Stylesheet for all the bundle
boot.loadOwnStyle("jriapp_ui");
