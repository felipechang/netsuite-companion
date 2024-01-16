var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import paths, { STORAGE_FILE } from "../../../paths.js";
import { queryRecord } from "./scrapper.js";
import inquirer from "inquirer";
import { getRecord, updateRecord } from "../../storage.js";
import { readDirectoryChoices } from "../../directory.js";
import { buildTypeDefinition } from "../../interfaces.js";
import path from "path";
import { formatFileName, printTemplate } from "../../util.js";
import fs from "fs";
/*
  Example URL
  https://system.netsuite.com/help/helpcenter/en_US/srbrowser/Browser2022_2/script/record/account.html
 */
const getUrlRecord = (url, recreate) => __awaiter(void 0, void 0, void 0, function* () {
    const lastEl = url.split("/").pop();
    const outFile = lastEl.split(".")[0];
    let pageRecord = getRecord(`${outFile}.json`);
    if (!pageRecord || recreate) {
        pageRecord = yield queryRecord(url);
        updateRecord(`${outFile}.json`, pageRecord);
    }
    return pageRecord;
});
export const run = (third) => __awaiter(void 0, void 0, void 0, function* () {
    let url = third;
    let filePath = "";
    if (!url) {
        const choices = (yield readDirectoryChoices(paths.home.root)).filter((choice) => !choice.path.includes(STORAGE_FILE));
        const questions = [{
                type: "confirm",
                name: "option",
                default: () => false,
                when: choices.length > 0,
                message: "Use URL?:",
            }, {
                type: "input",
                name: "url",
                when: (answer) => answer.option || choices.length === 0,
                message: "Enter record URL:",
                validate(answers) {
                    if (!answers) {
                        console.error("\nRecord NetSuite Browser URL is required");
                        console.error("Example: https://system.netsuite.com/help/helpcenter/en_US/srbrowser/Browser2022_2/script/record/account.html");
                        return false;
                    }
                    return true;
                }
            }, {
                type: "list",
                name: "path",
                when: (answer) => !answer.option && choices.length > 0,
                choices: choices.map((choice) => choice.path),
                message: "Select record type:",
            }];
        const answer = yield inquirer.prompt(questions);
        url = answer.url;
        filePath = answer.path;
    }
    if (url && !url.includes("/help/helpcenter/en_US/srbrowser/")) {
        console.error("\nRecord URL is not valid");
        return;
    }
    const pageRecord = url ? yield getUrlRecord(url, !!third) : JSON.parse(fs.readFileSync(filePath, "utf8"));
    const methods = buildTypeDefinition(pageRecord);
    const outPath = path.join(paths.client.models.records, pageRecord.type);
    yield printTemplate("record.d.ts.tmpl", outPath, pageRecord.id + ".d.ts", {
        name: formatFileName(pageRecord.name),
        methods,
    });
});
