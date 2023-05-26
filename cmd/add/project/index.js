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
import { getRecord } from "../../storage.js";
import paths, { STORAGE_FILE } from "../../../paths.js";
import path from "path";
import fs from "fs";
import { printTemplate } from "../../util.js";
export const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const questions = [{
            type: "input",
            name: "title",
            message: "Enter project name:",
            default: () => process.env.PROJECT_NAME,
            validate(answer) {
                if (!answer) {
                    console.error("\nProject name is required");
                    return false;
                }
                return true;
            }
        }, {
            type: "confirm",
            name: "readme",
            message: "Create a README.md file?:",
            default: () => true
        }, {
            type: "input",
            name: "description",
            message: "Enter folder purpose or description:",
            default: () => "No description provided",
            when: (answer) => answer.readme
        }];
    const answer = yield inquirer.prompt(questions);
    const storage = getRecord(STORAGE_FILE);
    const folderPath = path.join(paths.client.src.FileCabinet.SuiteScripts.root, storage.vendor, answer.title);
    if (fs.existsSync(folderPath)) {
        console.error("Project already exists");
        return;
    }
    fs.mkdirSync(folderPath);
    if (answer.readme) {
        answer.user_name = process.env.USER_NAME;
        answer.user_email = process.env.USER_EMAIL;
        yield printTemplate(`README.md.${storage.lang}.tmpl`, folderPath, "README.md", answer, false);
    }
});
