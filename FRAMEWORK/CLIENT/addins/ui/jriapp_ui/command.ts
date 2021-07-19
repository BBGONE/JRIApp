/** The MIT License (MIT) Copyright(c) 2016-present Maxim V.Tsapov */
import { Utils, Debounce } from "jriapp_shared";
import { IViewOptions } from "jriapp/int";
import { DomUtils } from "jriapp/utils/dom";
import { ICommand } from "jriapp/mvvm";
import { cssStyles } from "./int";
import { BaseElView } from "./baseview";

const utils = Utils, dom = DomUtils;

export interface ICommandViewOptions extends IViewOptions {
    preventDefault?: boolean;
    stopPropagation?: boolean;
    noCheckCanExecute?: boolean;
}

const enum CommandFlags {
    PreventDefault = 0,
    StopPropagation = 1,
    Disabled = 2,
    NoCheckCanExecute = 3
}

export class CommandElView<TElement extends HTMLElement = HTMLElement> extends BaseElView<TElement> {
    private _command: ICommand;
    private _commandParam: any;
    private _commandFlags: number;
    private _debounce: Debounce;

    constructor(el: TElement, options: ICommandViewOptions) {
        super(el, options);
        this._command = null;
        this._commandParam = null;
        this._commandFlags = 0;
        this._debounce = new Debounce();
        this._setCommandFlag(!!options.preventDefault, CommandFlags.PreventDefault);
        this._setCommandFlag(!!options.stopPropagation, CommandFlags.StopPropagation);
        const disabled = ("disabled" in el) && (<any>el).disabled;
        if (disabled) {
            this._setCommandFlag(disabled, CommandFlags.Disabled);
        }
        this._setCommandFlag(!!options.noCheckCanExecute, CommandFlags.NoCheckCanExecute);
        dom.setClass([el], cssStyles.disabled, this.isEnabled);
    }
    dispose(): void {
        if (this.getIsDisposed()) {
            return;
        }
        this.setDisposing();
        this._debounce.dispose();
        if (!!this._command) {
            this._command.offOnCanExecuteChanged(this.uniqueID);
        }
        this._command = null;
        this._commandParam = null;
        super.dispose();
    }
    private _getCommandFlag(flag: CommandFlags): boolean {
        return !!(this._commandFlags & (1 << flag));
    }
    private _setCommandFlag(v: boolean, flag: CommandFlags): void {
        if (v) {
            this._commandFlags |= (1 << flag);
        } else {
            this._commandFlags &= ~(1 << flag);
        }
    }
    private _onCanExecuteChanged(cmd: ICommand, _args: any): void {
        this.isEnabled = cmd.canExecute(this._getCommandParam());
    }
    protected _getCommandParam(): any {
        return this._commandParam;
    }
    protected _onCommandChanged(): void {
        if (!!this._command && !this._getCommandFlag(CommandFlags.NoCheckCanExecute)) {
            this.isEnabled = this._command.canExecute(this._getCommandParam());
        }
    }
    protected invokeCommand(): void {
        const self = this;
        if (!!self.command && self.isEnabled) {
            utils.queue.enque(() => {
                if (self.getIsStateDirty()) {
                    return;
                }
                // repeat the check after timeout
                try {
                    if (!!self.command && self.isEnabled) {
                        self.command.execute(self._getCommandParam());
                    }
                } catch (ex) {
                    self.handleError(ex, self);
                }
            });
        }
    }
    viewMounted(): void {
        this._debounce.enque(() => {
            this._onCommandChanged();
        });
    }
    toString(): string {
        return "CommandElView";
    }
    get command(): ICommand {
        return this._command;
    }
    set command(v: ICommand) {
        if (v !== this._command) {
            if (!!this._command && !this._getCommandFlag(CommandFlags.NoCheckCanExecute)) {
                this._command.offOnCanExecuteChanged(this.uniqueID);
            }
            this._command = v;
            if (!!this._command && !this._getCommandFlag(CommandFlags.NoCheckCanExecute)) {
                this._command.addOnCanExecuteChanged(this._onCanExecuteChanged, this.uniqueID, this);
            }
            this._debounce.enque(() => {
                this._onCommandChanged();
            });
            this.objEvents.raiseProp("command");
        }
    }
    get commandParam(): any {
        return this._commandParam;
    }
    set commandParam(v: any) {
        if (v !== this._commandParam) {
            this._commandParam = v;
            this._debounce.enque(() => {
                this._onCommandChanged();
            });
            this.objEvents.raiseProp("commandParam");
        }
    }
    get isEnabled(): boolean {
        const el: any = this.el;
        if (("disabled" in this.el)) {
            return !el.disabled;
        } else {
            return !this._getCommandFlag(CommandFlags.Disabled)
        }
    }
    set isEnabled(v: boolean) {
        const el: any = this.el;
        if (v !== this.isEnabled) {
            if (("disabled" in this.el)) {
                el.disabled = !v;
                this._setCommandFlag(!v, CommandFlags.Disabled);
            } else {
                this._setCommandFlag(!v, CommandFlags.Disabled);
            }
            dom.setClass([this.el], cssStyles.disabled, !!v);
            this.objEvents.raiseProp("isEnabled");
        }
    }
    get preventDefault(): boolean {
        return this._getCommandFlag(CommandFlags.PreventDefault);
    }
    get stopPropagation(): boolean {
        return this._getCommandFlag(CommandFlags.StopPropagation);
    }
}
