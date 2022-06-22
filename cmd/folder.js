'use strict';

import 'dotenv/config'

import path from "path"
import handlebars from "handlebars"
import fs from "fs"

import getPathList from "./pathList.js"
import {__dirname, suiteScriptPath} from "./paths.js"

// SuiteScript folder
const pathList = getPathList(suiteScriptPath, {});

const createFolder = (a) => {
    let folderPath = path.join(process.cwd(), "src", "FileCabinet");
    console.log("folderPath", folderPath);
    if (a.folder) {
        folderPath = path.join(folderPath, "SuiteScripts", a.folder, a.title);
        if (fs.existsSync(folderPath)) {
            console.error("folder already exists");
            return;
        }
    } else {
        folderPath = path.join(folderPath, "SuiteScripts", a.title);
    }
    fs.mkdirSync(folderPath);
    return folderPath;
}

const createReadme = (folderPath, a) => {
    a.user_name = process.env.USER_NAME;
    a.user_email = process.env.USER_EMAIL;
    const s = fs.readFileSync(path.join(__dirname, "samples", "README.md.sample"))
    const template = handlebars.compile(String(s));
    fs.writeFileSync(path.join(folderPath, "README.md"), template(a));
}

export const createProject = (a) => {
    const folderPath = createFolder(a);
    if (a["readme"]) {
        createReadme(folderPath, a);
    }
}

export const questions = [{
    type: "list",
    name: "folder",
    message: "Enter folder path:",
    choices: pathList,
    when: () => pathList.length > 0
}, {
    type: "input",
    name: "title",
    message: "Enter folder name:",
    validate(s) {
        if (!s) {
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
    when: (a) => a["readme"]
}];
