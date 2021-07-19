/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { Utils } from "jriapp_shared";
import { ITemplate, ITemplateEvents, IViewOptions, ITemplateElView } from "jriapp/int";
import { IExecutor } from "jriapp/mvvm";
import { ViewChecks } from "jriapp/utils/viewchecks";
import { bootstrapper } from "jriapp/bootstrapper";
import { BaseElView } from "./baseview";

const utils = Utils, viewChecks = ViewChecks, boot = bootstrapper, ERROR = utils.err;

viewChecks.isTemplateElView = (obj: any): obj is ITemplateElView =>  {
    return !!obj && obj instanceof TemplateElView;
};

export interface ITemplateOptions {
    dataContext?: any;
    templEvents?: ITemplateEvents;
}

// for strongly typed parameters
export type TemplateCommandParam = { template: ITemplate; isLoaded: boolean; };

export class TemplateElView extends BaseElView implements ITemplateEvents {
    private _command: IExecutor;

    constructor(el: HTMLElement, options: IViewOptions) {
        super(el, options);
        this._command = null;
    }
    private invokeCommand(args: any): void {
        const cmd = this._command;
        if (!!cmd) {
            cmd.execute(args);
        }
    }
    templateLoading(_template: ITemplate): void {
        // noop
    }
    templateLoaded(template: ITemplate, error?: any): void {
        if (!!error) {
            return;
        }
        const self = this;
        try {
            const args: TemplateCommandParam = { template: template, isLoaded: true };
            self.invokeCommand(args);
        } catch (ex) {
            ERROR.reThrow(ex, this.handleError(ex, this));
        }
    }
    templateUnLoading(template: ITemplate): void {
        const self = this;
        try {
            const args: TemplateCommandParam = { template: template, isLoaded: false };
            self.invokeCommand(args);
        } catch (ex) {
            this.handleError(ex, this);
        } 
    }
    toString(): string {
        return "TemplateElView";
    }
    get command(): IExecutor {
        return this._command;
    }
    set command(v: IExecutor) {
        if (v !== this._command) {
            this._command = v;
            this.objEvents.raiseProp("command");
        }
    }
};

boot.registerElView("template", TemplateElView);
