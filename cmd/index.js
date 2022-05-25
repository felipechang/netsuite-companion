#!/usr/bin/env node

const inquirer = require("inquirer");
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
    return console.error("netsuite-companion demands a valid argument ");
}

if (process.argv[2] !== "init" && (!process.env.COMPANY_NAME || !process.env.USER_NAME || !process.env.USER_EMAIL)) {
    return console.error("Run init first: netsuite-companion init");
}

switch (process.argv[2]) {
    case "init":
        inquirer.prompt(init.questions).then((a) => {
            init.unzipSource(() => {
                init.updateFile(a, ".env.sample", path.join(process.cwd(), ".env"));
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
