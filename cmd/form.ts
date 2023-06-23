import inquirer from "inquirer";
import {Level} from "level";
import {printTemplate, printScriptTemplate} from "./util.js";
import {readDirectoryChoices} from "./directory.js";
import paths from "../paths.js";

const db = new Level(paths.app.db.scripts, {valueEncoding: 'json'})

export const simple = async (fileName: string, suffix: string) => {
    const dirPaths = await readDirectoryChoices(paths.client.src.FileCabinet.SuiteScripts.root);
    const choices = dirPaths.filter((choice) => choice.children).map((choice) => choice.path);
    choices.shift();
    if (choices.length === 0) return console.log("Must create a project first");
    const answer = await inquirer.prompt([{
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
    }]);
    const suf = suffix ? "_" + suffix : "";
    const prefix = process.env.FILE_PREFIX || "";
    answer.name = `${prefix.toLowerCase()}_${answer.name}${suf}`;
    await printTemplate(fileName, answer.path, `${answer.name}.ts`, answer, true);
}

export const advanced = async (fileType: string, answer: any, noDeploy: boolean) => {
    const prefix = process.env.FILE_PREFIX || "";
    const snake_name = answer.name.toLowerCase().replace(/ /g, "_");
    const fileSub = `${prefix.toLowerCase()}_${snake_name}`;
    const fileName = `${fileSub}_${fileType}`;
    answer.scriptId = `customscript_${fileSub}`;
    answer.deploymentId = `customdeploy_${fileSub}`;
    answer.scriptName = fileName;
    await printTemplate(`${fileType}.tmpl`, answer.path, `${fileName}.ts`, answer, true);
    if (!noDeploy) await printScriptTemplate(`${fileType}.xml.tmpl`, fileSub, answer);
    if (answer.test) {
        const nameKey= `${fileName}:${answer.scriptId}`;
        let found = false;
        for await (const [key] of db.iterator()) if (key === nameKey) found = true;
        if (!found) await db.put(nameKey, "");
    }
}
