'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs";
import inquirer from "inquirer";
import paths, { STORAGE_FILE } from "../../paths.js";
import { deploy } from "./boilerplate.js";
import path from "path";
import { storage, updateRecord } from "../storage.js";
const questions = [{
        type: "input",
        name: "project",
        message: "Enter project name:",
        validate(answer) {
            if (!answer) {
                console.error("\nProject name is required");
                return false;
            }
            return true;
        }
    }, {
        type: "input",
        name: "company",
        message: "Enter company name:",
        validate(answer) {
            if (!answer) {
                console.error("\nCompany name is required");
                return false;
            }
            return true;
        }
    }, {
        type: "input",
        name: "name",
        when: !storage.name,
        message: "Enter your name:",
        validate(answer) {
            if (!answer) {
                console.error("\nName is required");
                return false;
            }
            return true;
        }
    }, {
        type: "input",
        name: "email",
        when: !storage.email,
        message: "Enter your email:",
        validate(answer) {
            if (!answer) {
                console.error("\nEmail is required");
                return false;
            }
            if (!(new RegExp("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")).test(answer)) {
                console.error("\nInvalid email. Try again");
                return false;
            }
            return true;
        }
    }, {
        type: "input",
        name: "vendor",
        when: !storage.vendor,
        message: "Enter vendor name:",
        validate(answer) {
            if (!answer) {
                console.error("\nVendor is required");
                return false;
            }
            return true;
        }
    }, {
        type: "input",
        name: "prefix",
        when: !storage.prefix,
        default: "abc",
        message: "Enter vendor three letter prefix:",
        validate(answer) {
            if (!answer) {
                console.error("\nPrefix is required");
                return false;
            }
            return true;
        }
    }, {
        type: "list",
        name: "lang",
        when: !storage.lang,
        choices: ["en", "es"],
        message: "Select README.md locale:",
        validate(answer) {
            if (!answer) {
                console.error("\nPrefix is required");
                return false;
            }
            return true;
        }
    }, {
        type: "confirm",
        when: !storage.name || !storage.email || !storage.prefix,
        name: "store",
        default: () => true,
        message: "Store user and vendor details?:",
    }];
export const run = () => __awaiter(void 0, void 0, void 0, function* () {
    if (fs.existsSync(path.join(paths.client.root, ".env"))) {
        console.error(".env file already created");
        return;
    }
    const answer = yield inquirer.prompt(questions);
    answer.name = answer.name || storage.name;
    answer.email = answer.email || storage.email;
    answer.prefix = answer.prefix || storage.prefix;
    answer.vendor = answer.vendor || storage.vendor;
    answer.lang = answer.lang || storage.lang;
    deploy(answer);
    if (answer.store)
        updateRecord(STORAGE_FILE, answer);
});
