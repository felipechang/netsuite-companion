var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readDirectoryChoices } from "../../directory.js";
import paths from "../../../paths.js";
import inquirer from "inquirer";
import { advanced } from "../../form.js";
const ScriptOptions = {
    "Bundle": "bundle",
    "Client": "client",
    "Form Client": "formclient",
    "Map Reduce": "mapreduce",
    "Mass Update": "massupdate",
    "Portlet": "portlet",
    "Restlet": "restlet",
    "Scheduled": "scheduled",
    "Suitelet": "suitelet",
    "User Event": "userevent",
    "Workflow Action": "workflowaction",
};
export const run = (third) => __awaiter(void 0, void 0, void 0, function* () {
    const dirPaths = yield readDirectoryChoices(paths.client.src.FileCabinet.SuiteScripts.root);
    const choices = dirPaths.filter((choice) => choice.children).map((choice) => choice.path);
    choices.shift();
    if (choices.length === 0) {
        console.log("Must create a project first");
        return;
    }
    const answer = yield inquirer.prompt([{
            type: "list",
            name: "type",
            message: "Select script type:",
            choices: () => [
                "Bundle",
                "Client",
                "Map Reduce",
                "Mass Update",
                "Portlet",
                "Restlet",
                "Scheduled",
                "Suitelet",
                "User Event",
                "Workflow Action",
            ]
        }, {
            type: "input",
            name: "name",
            message: "Enter script name:",
            validate(answer) {
                if (!answer) {
                    console.error("\nScript name is required");
                    return false;
                }
                return true;
            }
        }, {
            type: "input",
            name: "description",
            message: "Enter description:",
            default: () => "No description"
        }, {
            type: "list",
            name: "path",
            message: "Select folder:",
            choices,
        }, {
            type: "confirm",
            name: "test",
            message: "Create test?:",
            default: () => true
        }]);
    yield advanced(ScriptOptions[answer.type], answer, third === "no-deploy");
});
