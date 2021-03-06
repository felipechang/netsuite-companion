import path from "path"
import handlebars from "handlebars"
import fs from "fs"
import unzip from "unzipper"

import {__dirname} from "./paths.js";

export const updateFile = (a, from, to) => {
    a.prefix = a["company"].substring(0, 3).toLowerCase();
    const s = fs.readFileSync(path.join(__dirname, "samples", from))
    const template = handlebars.compile(String(s));
    fs.writeFileSync(to, template(a));
}

export const unzipSource = (finish) => {
    fs.createReadStream(path.join(__dirname, "source.zip"))
        .pipe(unzip.Extract({path: process.cwd()}))
        .on("finish", finish);
}

export const questions = [{
    type: "input",
    name: "company",
    message: "Enter company name:",
    validate(s) {
        if (!s) {
            console.error("\nCompany name is required");
            return false;
        }
        return true;
    }
}, {
    type: "input",
    name: "project",
    message: "Enter project name:",
    validate(s) {
        if (!s) {
            console.error("\nProject name is required");
            return false;
        }
        return true;
    }
}, {
    type: "input",
    name: "name",
    message: "Enter your name:",
    validate(s) {
        if (!s) {
            console.error("\nName is required");
            return false;
        }
        return true;
    }
}, {
    type: "input",
    name: "email",
    message: "Enter your email:",
    validate(s) {
        if (!s) {
            console.error("\nEmail is required");
            return false;
        }
        if (!(new RegExp("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")).test(s)) {
            console.error("\nInvalid email. Try again");
            return false;
        }
        return true;
    }
}];
