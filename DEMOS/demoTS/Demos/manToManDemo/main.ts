import * as RIAPP from "jriapp";
import * as COMMON from "common";
import * as AUTOCOMPLETE from "autocomplete";
import { IMainOptions, DemoApplication } from "./app";

const bootstrapper = RIAPP.bootstrapper;

//bootstrapper error handler - the last resort (typically display message to the user)
bootstrapper.objEvents.addOnError(function (_s, args) {
    debugger;
    alert(args.error.message);
});

export function start(mainOptions: IMainOptions) {
    mainOptions.modulesInits = {
        "COMMON": COMMON.initModule,
        "AUTOCOMPLETE": AUTOCOMPLETE.initModule
    };

    //create and start application here
    return bootstrapper.startApp(() => {
        return new DemoApplication(mainOptions);
    }).then((app) => {
        return app.customerVM.load();
    });
}