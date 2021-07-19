import * as RIAPP from "jriapp";
import * as DEMODB from "./demoDB";
import * as COMMON from "common";
import * as MONTHPICKER from "monthpicker";

let bootstrapper = RIAPP.bootstrapper, utils = RIAPP.Utils, dates = utils.dates;

export class UppercaseConverter extends RIAPP.BaseConverter {
    convertToSource(val: any, param: any, dataContext: any): any {
        if (utils.check.isString(val)) {
            return val.toLowerCase();
        } else {
            return val;
        }
    }
    convertToTarget(val: any, param: any, dataContext: any): any {
        if (utils.check.isString(val)) {
            return val.toUpperCase();
        } else {
            return val;
        }
    }
}

export class YearMonthConverter extends RIAPP.BaseConverter {
    convertToSource(val: any, param: string, dataContext: any): any {
        if (utils.check.isString(val)) {
            return dates.strToDate('01/' + val, 'DD/' + param);
        } else {
            return null;
        }
    }
    convertToTarget(val: any, param: string, dataContext: any): any {
        if (utils.check.isDate(val)) {
            return dates.dateToStr(val, param);
        } else {
            return "";
        }
    }
}

export class NotConverter extends RIAPP.BaseConverter {
    convertToSource(val: any, param: any, dataContext: any): any {
            return !val;
    }
    convertToTarget(val: any, param: any, dataContext: any): any {
            return !val;
    }
}

function RGBToHex(r: number, g: number, b: number): string {
    var bin = r << 16 | g << 8 | b;
    return (function (h) {
        return new Array(7 - h.length).join("0") + h
    })(bin.toString(16).toUpperCase());
}

export class TestObject extends RIAPP.BaseObject {
    private _testProperty1: string;
    private _testProperty2: string;
    private _testProperty3: string;
    private _testCommand: RIAPP.ICommand;
    private _paramCommand: RIAPP.ICommand;
    private _month: number;
    private _months: DEMODB.KeyValDictionary;
    private _format: string;
    private _formatItem: DEMODB.StrKeyValListItem;
    private _formats: DEMODB.StrKeyValDictionary;
    private _boolProperty: boolean;
    private _yearmonth: Date;

    constructor(initPropValue: string) {
        super();
        const self = this;
        this._testProperty1 = initPropValue;
        this._testProperty2 = null;
        this._testProperty3 = null;
        this._boolProperty = null;
        this._yearmonth = null;

        this._testCommand = new RIAPP.Command(() => {
            self._onTestCommandExecuted();
        }, () => {
                //if this function return false, then the command is disabled
                return self.isEnabled;
        });

        this._paramCommand = new RIAPP.Command<{ color: string; r: number; g: number; b: number; }>((param) => {
            alert(`${param.color}: #${RGBToHex(param.r, param.g, param.b)}`);
        });

        this._month = new Date().getMonth() + 1;
        this._months = new DEMODB.KeyValDictionary();
        this._fillMonths();

        this._format = 'PDF';
        this._formatItem = null;
        this._formats = new DEMODB.StrKeyValDictionary();
        this._fillFormats()
    }
    private _fillMonths() {
        this._months.fillItems([{ key: 1, val: 'January' }, { key: 2, val: 'February' }, { key: 3, val: 'March' },
        { key: 4, val: 'April' }, { key: 5, val: 'May' }, { key: 6, val: 'June' },
        { key: 7, val: 'July' }, { key: 8, val: 'August' }, { key: 9, val: 'September' }, { key: 10, val: 'October' },
        { key: 11, val: 'November' }, { key: 12, val: 'December' }], true);
    }
    private _fillFormats() {
        this._formats.fillItems([{ key: 'PDF', val: 'Acrobat Reader PDF' }, { key: 'WORD', val: 'MS Word DOC' }, { key: 'EXCEL', val: 'MS Excel XLS' }], true);
    }
    _onTestCommandExecuted() {
        let format: string = (!this.formatItem ? "<EMPTY>" : this.formatItem.val);
        alert(utils.str.format("testProperty1:{0}, format: {1}, month: {2}, boolProperty: {3}", this.testProperty1, format, this.month, this.boolProperty));
    }
    get testProperty1(): string { return this._testProperty1; }
    set testProperty1(v: string) {
        if (this._testProperty1 != v) {
            this._testProperty1 = v;
            this.objEvents.raiseProp('testProperty1');
            this.objEvents.raiseProp('isEnabled');

            //let the command to evaluate its availability
            this._testCommand.raiseCanExecuteChanged();
        }
    }
    get testProperty2(): string { return this._testProperty2; }
    set testProperty2(v: string) {
        if (this._testProperty2 != v) {
            this._testProperty2 = v;
            this.objEvents.raiseProp('testProperty2');
        }
    }
    get testProperty3(): string { return this._testProperty3; }
    set testProperty3(v: string) {
        if (this._testProperty3 != v) {
            this._testProperty3 = v;
            this.objEvents.raiseProp('testProperty3');
        }
    }
    get boolProperty(): boolean { return this._boolProperty; }
    set boolProperty(v: boolean) {
        if (this._boolProperty != v) {
            this._boolProperty = v;
            this.objEvents.raiseProp('boolProperty');
        }
    }
    get testCommand(): RIAPP.ICommand { return this._testCommand; }
    get paramCommand(): RIAPP.ICommand { return this._paramCommand; }
    get testToolTip(): string {
        return "Click the button to execute the command.<br/>" +
            "P.S. <b>command is active when the testProperty1 length > 3</b>";
    }
    get format(): string { return this._format; }
    set format(v) {
        if (this._format !== v) {
            this._format = v;
            this.objEvents.raiseProp('format');
        }
    }
    get formatItem(): DEMODB.StrKeyValListItem { return this._formatItem; }
    set formatItem(v) {
        if (this._formatItem !== v) {
            this._formatItem = v;
            this.objEvents.raiseProp('formatItem');
        }
    }
    get isEnabled(): boolean {
        return utils.check.isString(this.testProperty1) && this.testProperty1.length > 3;
    }
    get formats() { return this._formats; }
    get month() { return this._month; }
    set month(v) {
        if (v !== this._month) {
            this._month = v;
            this.objEvents.raiseProp('month');
        }
    }
    get months() { return this._months; }
    get yearmonth() { return this._yearmonth; }
    set yearmonth(v) {
        if (v !== this._yearmonth) {
            this._yearmonth = v;
            this.objEvents.raiseProp('yearmonth');
        }
    }
}

export class DemoApplication extends RIAPP.Application {
    private _errorVM: COMMON.ErrorViewModel;
    private _testObject: TestObject;

    constructor(options: RIAPP.IAppOptions) {
        super(options);
        this._errorVM = null;
        this._testObject = null;
    }
    onStartUp() {
        const self = this;
        this._errorVM = new COMMON.ErrorViewModel(this);
        this._testObject = new TestObject('some initial text');
        //here we could process application's errors
        this.objEvents.addOnError(function (_s, data) {
            debugger;
            data.isHandled = true;
            self.errorVM.error = data.error;
            self.errorVM.showDialog();
        });

        super.onStartUp();
    }
    dispose() {
        if (this.getIsDisposed())
            return;
        this.setDisposing();
        const self = this;
        try {
            self._errorVM.dispose();
            self._testObject.dispose();
            if (!!self.UC.createdBinding)
                self.UC.createdBinding.dispose();
        } finally {
            super.dispose();
        }
    }
    get errorVM() { return this._errorVM; }
    get TEXT() { return RIAPP.LocaleSTRS.TEXT; }
    get testObject() { return this._testObject; }
}

//bootstrapper error handler - the last resort (typically display message to the user)
bootstrapper.objEvents.addOnError(function (_s, args) {
    debugger;
    alert(args.error.message);
});

function initModule(app: RIAPP.Application) {
    console.log("INIT bindingsDemo Module");
    app.registerConverter('uppercaseConverter', new UppercaseConverter());
    app.registerConverter('notConverter', new NotConverter());
    app.registerConverter('yearmonthConverter', new YearMonthConverter());
};


export const appOptions: RIAPP.IAppOptions = {
    modulesInits: {
        "COMMON": COMMON.initModule,
        "MONTHPICK": MONTHPICKER.initModule,
        "BINDDEMO": initModule
    }
};