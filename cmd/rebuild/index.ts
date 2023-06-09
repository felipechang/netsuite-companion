import paths from "../../paths.js";
import {readDirectoryChoices} from "../directory.js";
import {formatFileName, nsCast, printTemplate} from "../util.js";
import fs from "fs";
import {xml2json} from "xml-js";
import {IXmlField} from "./types.js";
import {buildTypeDefinition} from "../interfaces.js";
import path from "path";

const records = [
    "customrecord",     // Custom Record
];

const fields = [
    "custentity",       // Custom Entity Fields
    "custitem",         // Custom Item Fields
    "custevent",        // Custom CRM Fields
    "custbody",         // Transaction Body Fields
    "custrecord",       // Other Record Fields
];

const sublists = [
    "custcol",          // Transaction Line Fields | Item Options
];

const processXml = (xmlData: string): IPageRecord => {
    const record: IPageRecord = {name: "", id: "", type: "", fields: [], subLists: {}};
    const jsonData = JSON.parse(xmlData) as IXmlField;
    for (let typeName in jsonData) {
        record.id = jsonData[typeName]._attributes.scriptid;
        record.type = typeName;
        if (typeName === "customrecordtype") {
            if (Array.isArray(jsonData.customrecordtype.customrecordcustomfields.customrecordcustomfield)) {
                jsonData.customrecordtype.customrecordcustomfields.customrecordcustomfield.forEach((field) => {
                    record.name = jsonData.customrecordtype.recordname._text;
                    record.fields.push({
                        id: field._attributes.scriptid,
                        type: nsCast(field.fieldtype._text),
                    });
                });
            } else {
                record.name = jsonData.customrecordtype.recordname._text;
                record.fields.push({
                    id: jsonData.customrecordtype.customrecordcustomfields.customrecordcustomfield._attributes.scriptid,
                    type: nsCast(jsonData.customrecordtype.customrecordcustomfields.customrecordcustomfield.fieldtype._text),
                });
            }

        } else {
            record.name = jsonData[typeName].label._text;
            switch (typeName) {
                case "transactioncolumncustomfield":
                    if (!record.subLists["item"]) record.subLists["item"] = [];
                    record.subLists["item"].push({
                        id: jsonData[typeName]._attributes.scriptid,
                        type: nsCast(jsonData[typeName].fieldtype._text),
                    });
                    break;
                case "itemoptioncustomfield":
                    console.error(`Item Option Custom Fields not supported: ${record.id}`);
                    break;
                default:
                    record.fields.push({
                        id: jsonData[typeName]._attributes.scriptid,
                        type: nsCast(jsonData[typeName].fieldtype._text),
                    });
            }
        }
    }
    return record;
}

export const run = async () => {
    console.log("Rebuilding TypeScript Definitions");
    const lists = records.concat(fields.concat(sublists));
    const filePaths = await readDirectoryChoices(paths.client.src.Objects.root, true);

    console.log("filePaths", filePaths);

    if (filePaths.length === 0) {
        console.error("No files found");
        return;
    }
    for (let i = 0; i < filePaths.length; i++) {
        const filePath = filePaths[i];
        if (lists.filter((s) => filePath.path.includes(s)).length === 0) continue;
        const fileContent = fs.readFileSync(filePath.path, "utf8");
        const xmlData = xml2json(fileContent, {compact: true, spaces: 4});
        const pageRecord = processXml(xmlData);
        if (pageRecord.fields.length === 0 && Object.keys(pageRecord.subLists).length === 0) continue;
        let outPath = "";
        for (let j = 0; j < records.length; j++) {
            if (filePath.name.includes(records[j])) {
                outPath = path.join(paths.client.models.records, pageRecord.type);
            }
        }
        for (let j = 0; j < fields.length; j++) {
            if (filePath.name.includes(fields[j])) {
                outPath = path.join(paths.client.models.fields, pageRecord.type);
            }
        }
        for (let j = 0; j < sublists.length; j++) {
            if (filePath.name.includes(sublists[j])) {
                outPath = path.join(paths.client.models.sublists, pageRecord.type);
            }
        }
        if (!outPath) continue;
        const methods = buildTypeDefinition(pageRecord);
        await printTemplate("record.d.ts.tmpl", outPath, pageRecord.id + ".d.ts", {
            name: formatFileName(pageRecord.name),
            methods,
        }, false);
    }
}