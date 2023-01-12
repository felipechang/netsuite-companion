import fs from "fs";
import path from "path";
import paths from "../paths.js";
import handlebars from "handlebars";
import { storage } from "./storage.js";
import moment from "moment";
const cleanTemplate = (template) => {
    return template
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, "&");
};
export const printTemplate = (fileName, outPath, outFile, answer, defaults) => {
    return new Promise(resolve => {
        if (defaults) {
            answer.project = process.env.PROJECT_NAME;
            answer.date = moment(new Date()).format("MM/DD/YYYY");
            answer.company_name = storage.vendor;
            answer.user_name = process.env.USER_NAME;
            answer.user_email = process.env.USER_EMAIL;
        }
        const templatePath = path.join(paths.app.templates, fileName);
        if (!fs.existsSync(templatePath))
            throw new Error(`Template ${fileName} does not exist`);
        const contents = String(fs.readFileSync(templatePath));
        const template = handlebars.compile(contents);
        fs.existsSync(outPath) || fs.mkdirSync(outPath, { recursive: true });
        const writePath = path.join(outPath, outFile);
        !fs.existsSync(writePath) ?
            fs.writeFile(writePath, cleanTemplate(template(answer)), resolve) :
            console.error(`File ${outFile} already exists`);
    });
};
export const printScriptTemplate = (fileName, outFile, answer) => {
    return new Promise(resolve => {
        const templatePath = path.join(paths.app.templates, fileName);
        if (!fs.existsSync(templatePath))
            throw new Error(`Template ${fileName} does not exist`);
        const contents = String(fs.readFileSync(templatePath));
        const template = handlebars.compile(contents);
        const outPath = path.join(paths.client.src.Objects.root, "scripts");
        fs.existsSync(outPath) || fs.mkdirSync(outPath, { recursive: true });
        const scriptName = `customscript_${outFile}.xml`;
        const writePath = path.join(outPath, scriptName);
        answer.scriptfile = `/SuiteScripts${answer.path.split("SuiteScripts")[1]}/${outFile}.js`;
        answer.scriptfile = answer.scriptfile.replace(/\\/g, "/");
        !fs.existsSync(writePath) ?
            fs.writeFile(writePath, cleanTemplate(template(answer)), resolve) :
            console.error(`File ${scriptName} already exists`);
    });
};
export const nsCast = (type) => {
    switch (type.toUpperCase()) {
        case "TEXT":
            return "string";
        case "STRING":
            return "string";
        case "RICHTEXT":
            return "string";
        case "CLOBTEXT":
            return "string";
        case "SELECT":
            return "string";
        case "TEXTAREA":
            return "string";
        case "CCVALIDFORM":
            return "string";
        case "EMAIL":
            return "string";
        case "ADDRESS":
            return "string";
        case "RTEXT":
            return "string";
        case "CHECKBOX":
            return "boolean";
        case "BOOLEAN":
            return "boolean";
        case "DATE":
            return "Date";
        case "DATETIME":
            return "Date";
        case "CURRENCY":
            return "number";
        case "FLOAT":
            return "number";
        case "NUMBER":
            return "number";
        case "INTEGER":
            return "number";
        case "RATE":
            return "number";
        default:
            console.error(`Unmapped type: ${type}`);
            return "string";
    }
};
export const formatFileName = (name) => {
    const nArr = name.split(" ");
    for (let i = 0; i < nArr.length; i++) {
        nArr[i] = nArr[i][0].toUpperCase() + nArr[i].substring(1, nArr[i].length).toLowerCase();
    }
    return nArr.join("");
};
