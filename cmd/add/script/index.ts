import {readDirectoryChoices} from "../../directory.js";
import paths from "../../../paths.js";
import inquirer from "inquirer";
import {advanced} from "../../form.js";

const ScriptOptions: { [key: string]: string } = {
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
}

export const run = async (third: string) => {
    const dirPaths = await readDirectoryChoices(paths.client.src.FileCabinet.SuiteScripts.root);
    const choices = dirPaths.filter((choice) => choice.children).map((choice) => choice.path);
    choices.shift();
    if (choices.length === 0) {
        console.log("Must create a project first");
        return;
    }
    const answer = await inquirer.prompt([{
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
        validate(answer: string) {
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
        message: "Create RESLET test?:",
        default: () => false
    }]);

    await advanced(ScriptOptions[answer.type], answer, third === "no-deploy");
}
