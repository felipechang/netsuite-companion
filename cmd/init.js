const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const unzip = require("unzipper");

const updateFile = (a, from, to) => {
    a.prefix = a["company"].substring(0, 3)
    const s = fs.readFileSync(path.join(__dirname, "samples", from))
    const template = handlebars.compile(String(s));
    fs.writeFileSync(to, template(a));
}

const unzipSource = (finish) => {
    fs.createReadStream(path.join(__dirname, "src.zip"))
        .pipe(unzip.Extract({path: process.cwd()}))
        .on("finish", finish);
}

const questions = [{
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


module.exports = {
    questions: questions,
    unzipSource: unzipSource,
    updateFile: updateFile,
}
