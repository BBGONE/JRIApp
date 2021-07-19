import * as RIAPP from "jriapp";

import { IMainOptions, DemoApplication } from "./app";
import * as COMMON from "common";
import * as AUTOCOMPLETE from "autocomplete";
import * as GRIDELVIEW from "./gridElView";
import * as PRODAUTOCOMPLETE from "./prodAutocomplete";


//bootstrapper error handler - the last resort (typically display message to the user)
RIAPP.bootstrapper.objEvents.addOnError(function (_, args) {
    debugger;
    alert(args.error.message);
});

export function start(options: IMainOptions) {
    options.modulesInits = {
        "COMMON": COMMON.initModule,
        "AUTOCOMPLETE": AUTOCOMPLETE.initModule,
        "GRIDELVIEW": GRIDELVIEW.initModule,
        "PRODAUTOCOMPLETE": PRODAUTOCOMPLETE.initModule
    };

    //create and start application here
    return RIAPP.bootstrapper.startApp(() => {
        return new DemoApplication(options);
    }, (app) => {
        app.registerTemplateGroup('custGroup', options.spa_template1_url);

        app.registerTemplateGroup('custInfoGroup', options.spa_template2_url);

        app.registerTemplateGroup('custAdrGroup', options.spa_template3_url);
            
        }).then((app) => {
            return app.customerVM.load();
        });
}