#!/usr/bin/env node

import 'dotenv/config'

import inquirer from "inquirer"
import fs from "fs"
import path from "path"

import * as init from "./init.js"
import * as folder from "./folder.js"
import * as file from "./file.js"

const PROCESS_OPTIONS = [
    "init",
    "folder",
    "file",
];

if (!process.argv[2] || PROCESS_OPTIONS.indexOf(process.argv[2]) === -1) {
    throw "use a netsuite-companion option (init/folder/file)";
}

if (process.argv[2] !== "init" && (!process.env.COMPANY_NAME || !process.env.USER_NAME || !process.env.USER_EMAIL)) {
    throw "run init first: netsuite-companion init";
}

switch (process.argv[2]) {
    case "init":
        if (fs.existsSync(path.join(process.cwd(), ".env"))) {
            throw ".env file already created";
        }
        inquirer.prompt(init.questions).then((a) => {
            init.unzipSource(() => {
                setTimeout(() => {
                    init.updateFile(a, ".env.sample", path.join(process.cwd(), ".env"));
                    init.updateFile(a, "manifest.xml.sample", path.join(process.cwd(), "src", "manifest.xml"));
                }, 500);
            });
        });
        break;
    case "folder":
        inquirer.prompt(folder.questions).then(folder.createProject);
        break;
    case "file":
        inquirer.prompt(file.questions).then(file.createFile);
        break;
}
