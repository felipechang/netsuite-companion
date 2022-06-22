'use strict';

import 'dotenv/config'

import path from "path"
import handlebars from "handlebars"
import fs from "fs"
import moment from "moment"
import dirTree from "directory-tree"

import getPathList from "./pathList.js"
import {__dirname, suiteScriptPath} from "./paths.js"

const getRecordTypeList = () => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "record_types.json")))
}

/**
 * getFolderTree: Get directory node tree
 * @param path
 * @returns {{}}
 */
const getFolderTree = (path) => {

    const tree = dirTree(path);
    const result = {};
    if (!tree) {
        return result;
    }
    result[tree.name] = {};

    const getChildren = (res, children) => {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.children) {
                res[child.name] = {};
                getChildren(res[child.name], child.children);
            } else {
                if (!res.hasOwnProperty("files")) {
                    res["files"] = [];
                }
                res["files"].push(child.name.replace(".txt", ""))
            }
        }
    }

    if (tree.children) {
        getChildren(result[tree.name], tree.children);
    }
    return result;
}

/**
 * createFile: creates a file on a specified location
 * @param a
 */
export const createFile = (a) => {

    const snake_name = a.name.toLowerCase().replace(/ /g, "_");

    // make file path
    const fileType = a.type.toLowerCase().replace("-", "").replace(/ /g, "")
    const fileSub = `${process.env.FILE_PREFIX.toLowerCase()}_${snake_name}`;
    const fileName = `${fileSub}_${fileType}.ts`;
    const filePath = path.join(suiteScriptPath, ...a.path.split(path.sep), fileName);

    // parse template
    const s = fs.readFileSync(path.join(__dirname, "templates", a.category, `${a.type}.txt`))
    const template = handlebars.compile(String(s));

    //write file to disk
    fs.writeFileSync(filePath, template({
        description: a.description,
        scriptName: a.name,
        scriptId: `customscript_${fileSub}`,
        types: a.types ? a.types.join(", ") : "",
        date: moment(new Date()).format("MM/DD/YYYY"),
        company_name: process.env.COMPANY_NAME,
        user_name: process.env.USER_NAME,
        user_email: process.env.USER_EMAIL,
        project: process.env.PROJECT_NAME,
        namePascal: a.name.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    }));
}

// Template node tree
const templateTree = getFolderTree(path.join(__dirname, "templates"));

// SuiteScript folder
const pathList = getPathList(suiteScriptPath, {});
if (pathList.length === 0) {
    console.log("creating project at SuiteScript root");
}

export const questions = [{
    type: "list", name: "category", message: "Select category:", choices: Object.keys(templateTree["templates"])
}, {
    type: "list", name: "type", message: "Select script type:", choices: (a) => {
        return templateTree["templates"][a.category].files;
    }
}, {
    type: "input", name: "name", message: "Enter script name:", validate(s) {
        if (!s) {
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
    type: "checkbox",
    name: "types",
    choices: getRecordTypeList(),
    message: "Enter record types used:",
    when: (a) => a.category === "Native"
}, {
    type: "list", name: "path", message: "Select folder:", choices: pathList
}];
