import inquirer from "inquirer";
import {getRecord} from "../../storage.js";
import paths, {STORAGE_FILE} from "../../../paths.js";
import path from "path";
import fs from "fs";
import {printTemplate} from "../../util.js";

export const run = async () => {
    const questions = [{
        type: "input",
        name: "title",
        message: "Enter project name:",
        validate(answer: string) {
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
        when: (answer: IAddProjectAnswer) => answer.readme
    }];
    const answer = await inquirer.prompt(questions);
    const storage = getRecord(STORAGE_FILE) as IStorage;
    const folderPath = path.join(paths.client.src.FileCabinet.SuiteScripts.root, storage.vendor, answer.title);
    if (fs.existsSync(folderPath)) {
        console.error("Project already exists");
        return;
    }
    fs.mkdirSync(folderPath);
    if (answer.readme) {
        answer.user_name = process.env.USER_NAME;
        answer.user_email = process.env.USER_EMAIL;
        await printTemplate(`README.md.${storage.lang}.tmpl`, folderPath, "README.md", answer, false);
    }
}