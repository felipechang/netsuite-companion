import inquirer from "inquirer";
import {readDirectoryChoices} from "../../directory.js";
import paths from "../../../paths.js";
import {printTemplate} from "../../util.js";

export const run = async () => {
    const choices = await readDirectoryChoices(paths.client.src.FileCabinet.SuiteScripts.root);
    const questions = [{
        type: "input",
        name: "description",
        message: "Enter description:",
        default: () => "No description"
    }, {
        type: "list",
        name: "path",
        message: "Select folder:",
        choices: choices
            .filter((choice) => choice.children)
            .map((choice) => choice.path),
    }];
    const answer = await inquirer.prompt(questions);
    await printTemplate(`types.tmpl`, answer.path, "types.d.ts", answer, true);
}