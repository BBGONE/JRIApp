import * as RIAPP from "jriapp";
import * as COMMON from "common";
import * as DROPDBOX from "dropdownbox";

import { IMainOptions, DemoApplication } from "./app";
import * as  ResizableGrid from "./resizableGrid";

const bootstrapper = RIAPP.bootstrapper, utils = RIAPP.Utils;
const styles = ["lsize", 'msize', 'ssize', 'nsize'];

/*
 an example converter, which depending on the size returns
 an array of css classes to add or to remove to the HTML element
*/
export class SizeConverter extends RIAPP.BaseConverter {
    convertToSource(val: any, param: any, dataContext: any): any {
        return undefined;
    }
    convertToTarget(val: any, param: any, dataContext: any): any {
        let size = "" + val, firstLetter: string;
        let res: string[] = undefined, found = false;
        if (!!val) {
            if (utils.check.isNumeric(size))
                firstLetter = 'n';
            else
                firstLetter = size.charAt(0).toLowerCase();
        }

        res = styles.map((style) => {
            //only check if not found (for optimization)
            if (!found && !!firstLetter && utils.str.startsWith(style, firstLetter)) {
                found = true;
                //adds this style to the classes
                return "+" + style;
            }
            else {
                //removes this style from the classes
                return "-" + style;
            }
        });

        /*
         if we return ['-*'] , it will remove all classes from the HTML element
          but here it is undesirable, because we would remove classes which were set elsewhere
        */

        return res;
    }
}

// bootstrapper error handler - the last resort (typically display message to the user)
bootstrapper.objEvents.addOnError(function (_s, args) {
    debugger;
    alert(args.error.message);
    args.isHandled = true;
});

export function start(options: IMainOptions) {

    options.modulesInits = {
        "COMMON": COMMON.initModule,
        "DROPDBOX": DROPDBOX.initModule,
        "ResizableGrid": ResizableGrid.initModule
    };

    bootstrapper.init((bootstrapper) => {
        // replace default buttons styles with something custom
        const ButtonsCSS = bootstrapper.defaults.ButtonsCSS;
        ButtonsCSS.Edit = 'icon icon-pencil';
        ButtonsCSS.Delete = 'icon icon-trash';
        ButtonsCSS.OK = 'icon icon-ok';
        ButtonsCSS.Cancel = 'icon icon-remove';
    });

    const convertArg = (p2: any) => RIAPP.Utils.check.isPlainObject(p2) ? JSON.stringify(p2, null, 2) : p2;

    // create and start application here
    return bootstrapper.startApp(() => {
        return new DemoApplication(options);
    }, (app) => {
        app.registerConverter('sizeConverter', new SizeConverter());

       // testing registering a service (for using with inject)
        app.registerSvc("testsvc", (p1: string, p2: any, p3: any) => {
            console.log("exec testsvc factory(%s, %s, %s)", convertArg(p1), convertArg(p2), convertArg(p3));
            return "testsvc implementation";
        });


        // an example of how to load a file with multiple templates from the server (for loading group of templates- see spaDEMO.ts)
        app.loadTemplates(options.templates_url);

        // loads a single template from the server when template is needed
        // a better way how to load templates is to register templates' groups
        // see the Single Page Application Demo (spademo/main.ts) how it is done there
           app.registerTemplateLoader('productEditTemplate', () => utils.http.getAjax(options.productEditTemplate_url));
        }).then((app) => {
        if (!!options.modelData && !!options.categoryData) {
            // the data was embedded into HTML page as json, just use it
            app.productVM.filter.modelData = options.modelData;
            app.productVM.filter.categoryData = options.categoryData;
            return null;
        }
        else {
            return app.productVM.filter.load().then(() => {
                return app.productVM.load().then(function (loadRes) {/*alert(loadRes.outOfBandData.test);*/ });
            });
        }
    });
}