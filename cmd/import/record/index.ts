import paths, {STORAGE_FILE} from "../../../paths.js";
import {queryRecord} from "./scrapper.js";
import inquirer from "inquirer";
import {getRecord, updateRecord} from "../../storage.js";
import {readDirectoryChoices} from "../../directory.js";
import {buildTypeDefinition} from "../../interfaces.js";
import path from "path";
import {formatFileName, printTemplate} from "../../util.js";
import fs from "fs";

/*
  Example URL
  https://system.netsuite.com/help/helpcenter/en_US/srbrowser/Browser2022_2/script/record/account.html
 */

const getUrlRecord = async (url: string): Promise<IPageRecord> => {
    const lastEl = url.split("/").pop() as string;
    const outFile = lastEl.split(".")[0];
    let pageRecord = getRecord(`${outFile}.json`) as IPageRecord;
    if (!pageRecord) {
        pageRecord = await queryRecord(url);
        updateRecord(`${outFile}.json`, pageRecord);
    }
    return pageRecord;
}

export const run = async (third: string) => {
    let url: string = third;
    let filePath = "";
    if (!url) {
        const choices = (await readDirectoryChoices(paths.home.root)).filter((choice) => !choice.path.includes(STORAGE_FILE));
        const questions = [{
            type: "confirm",
            name: "option",
            default: () => false,
            when: choices.length > 0,
            message: "Use URL?:",
        }, {
            type: "input",
            name: "url",
            when: (answer: ImportRecordAnswer) => answer.option || choices.length === 0,
            message: "Enter record URL:",
            validate(answers: string) {
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
            when: (answer: ImportRecordAnswer) => !answer.option && choices.length > 0,
            choices: choices.map((choice) => choice.path),
            message: "Select record type:",
        }];

        const answer = await inquirer.prompt(questions);
        url = answer.url;
        filePath = answer.path;
    }
    if (url && !url.includes("/help/helpcenter/en_US/srbrowser/")) {
        console.error("\nRecord URL is not valid");
        return;
    }
    const pageRecord = url ? await getUrlRecord(url) : JSON.parse(fs.readFileSync(filePath, "utf8")) as IPageRecord;
    const methods = buildTypeDefinition(pageRecord);
    const outPath = path.join(paths.client.models.records, pageRecord.type);
    await printTemplate("record.d.ts.tmpl", outPath, pageRecord.id + ".d.ts", {
        name: formatFileName(pageRecord.name),
        methods,
    }, false);
}