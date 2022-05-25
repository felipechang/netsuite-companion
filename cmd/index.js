#!/usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const init = require("./init");
const folder = require("./folder");
const file = require("./file");
require("dotenv").config()

const PROCESS_OPTIONS = [
    "init",
    "folder",
    "file",
];

if (!process.argv[2] || PROCESS_OPTIONS.indexOf(process.argv[2]) === -1) {
    return console.error("use a netsuite-companion option (init/folder/file)");
}

if (process.argv[2] !== "init" && (!process.env.COMPANY_NAME || !process.env.USER_NAME || !process.env.USER_EMAIL)) {
    return console.error("Run init first: netsuite-companion init");
}

switch (process.argv[2]) {
    case "init":
        if (fs.existsSync(path.join(process.cwd(), ".env"))) {
            return console.error(".env file already created");
        }
        inquirer.prompt(init.questions).then((a) => {
            init.unzipSource(() => {
                init.updateFile(a, ".env.sample", path.join(process.cwd(), ".env"));
                init.updateFile(a, "tsconfig.json", path.join(process.cwd(), "tsconfig.json"));
                init.updateFile(a, "suitecloud.config.js", path.join(process.cwd(), "src", "suitecloud.config.js"));
                init.updateFile(a, "manifest.xml.sample", path.join(process.cwd(), "src", "manifest.xml"));
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
