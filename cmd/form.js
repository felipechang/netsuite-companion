var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readDirectoryChoices } from "./directory.js";
import paths from "../paths.js";
import inquirer from "inquirer";
import { printTemplate, printScriptTemplate } from "./util.js";
export const simple = (fileName, suffix) => __awaiter(void 0, void 0, void 0, function* () {
    const dirPaths = yield readDirectoryChoices(paths.client.src.FileCabinet.SuiteScripts.root);
    const choices = dirPaths.filter((choice) => choice.children).map((choice) => choice.path);
    choices.shift();
    if (choices.length === 0) {
        console.log("Must create a project first");
        return;
    }
    const answer = yield inquirer.prompt([{
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
        }]);
    const suf = suffix ? "_" + suffix : "";
    const prefix = process.env.FILE_PREFIX || "";
    answer.name = `${prefix.toLowerCase()}_${answer.name}${suf}`;
    yield printTemplate(fileName, answer.path, `${answer.name}.ts`, answer, true);
});
export const advanced = (fileType, answer, noDeploy) => __awaiter(void 0, void 0, void 0, function* () {
    const prefix = process.env.FILE_PREFIX || "";
    const snake_name = answer.name.toLowerCase().replace(/ /g, "_");
    const fileSub = `${prefix.toLowerCase()}_${snake_name}`;
    const fileName = `${fileSub}_${fileType}`;
    answer.scriptId = `customscript_${fileSub}`;
    answer.scriptName = fileName;
    yield printTemplate(`${fileType}.tmpl`, answer.path, `${fileName}.ts`, answer, true);
    if (!noDeploy) {
        yield printScriptTemplate(`${fileType}.xml.tmpl`, fileSub, answer);
    }
});
