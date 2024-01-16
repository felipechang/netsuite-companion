var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from "inquirer";
/*
We have the script ID and deployment ID
RESTLet loads script logs using script and deployment ID
User Event: Restlet Opens the record, updates with values, and saves. Logs are then read and sent back to client
if Scheduled or Map/Reduce or Mass Update(?): first give the option to evaluate one of the jobs. RESTlet executes the
 process when launched and returns an ID. ID is stored in memory DB. ID is printedin console. IF the RESTlet is called
 with an ID, it gets the associated logs for that task.
RESTlets and Sutielets are called, and then a second time to read logs.

Need:

 select which test results to run.
- Jest framework to call RESTlet, and evaluate expected.
- Module to do RESTlet calls and store results in DB.
- RESTlet to receive and process payloads.

How to do async jobs with Jest
 */
var Options;
(function (Options) {
    Options["Test"] = "Run Script Test";
    Options["Collect"] = "Collect Test Results";
})(Options || (Options = {}));
export const run = () => __awaiter(void 0, void 0, void 0, function* () {
    // TODO Validate that we have a token
    // select option to either generate a timestamp or evaluate the results generated after that timestamp
    const answer = yield inquirer.prompt([{
            type: "list",
            name: "type",
            message: "Select task to perform:",
            choices: () => [
                Options.Test,
                Options.Collect,
            ]
        }, {
            type: "input",
            name: "run_test",
            message: "Select script to test:",
            when(a) {
                return a.type === Options.Test;
            }
        }, {
            type: "input",
            name: "run_collect",
            message: "Select script to collect:",
            when(a) {
                return a.type === Options.Collect;
            }
        }]);
    yield console.log(answer);
});
