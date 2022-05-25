'use strict';

require("dotenv").config();

const path = require("path");
const handlebars = require("handlebars");
const fs = require("fs");
const moment = require("moment");
const dirTree = require("directory-tree");
const getPathList = require("./pathList");
const paths = require("./paths");

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
const createFile = (a) => {

    // make file path
    const fileType = a.type.toLowerCase().replace("-", "").replace(/ /g, "_")
    const fileName = `${process.env.FILE_PREFIX}_${a.name}_${fileType}.ts`;
    const filePath = path.join(paths.suiteScriptPath, ...a.path.split(path.sep), fileName);

    // parse template
    const s = fs.readFileSync(path.join(__dirname, "templates", a.category, `${a.type}.txt`))
    const template = handlebars.compile(String(s));

    //write file to disk
    fs.writeFileSync(filePath, template({
        description: a.description,
        types: a.types ? a.types.join(", ") : "",
        date: moment(new Date()).format("MM/DD/YYYY"),
        company_name: process.env.COMPANY_NAME,
        user_name: process.env.USER_NAME,
        user_email: process.env.USER_EMAIL,
        namePascal: a.name.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    }));
}

// Template node tree
const templateTree = getFolderTree(path.join(__dirname, "templates"));

// SuiteScript folder
const pathList = getPathList(paths.suiteScriptPath, {});
if (pathList.length === 0) {
    console.error("Creating project at SuiteScript root");
    return;
}

const questions = [{
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
        if (!(new RegExp("^[a-zA-Z_]*$")).test(s)) {
            console.error("\nInvalid name, use snake case (name_of_file)");
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

module.exports = {
    questions: questions,
    createFile: createFile,
}
