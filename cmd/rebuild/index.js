var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import paths from "../../paths.js";
import { readDirectoryChoices } from "../directory.js";
import { formatFileName, nsCast, printTemplate } from "../util.js";
import fs from "fs";
import { xml2json } from "xml-js";
import { buildTypeDefinition } from "../interfaces.js";
import path from "path";
const records = [
    "customrecord", // Custom Record
];
const fields = [
    "custentity",
    "custitem",
    "custevent",
    "custbody",
    "custrecord", // Other Record Fields
];
const sublists = [
    "custcol", // Transaction Line Fields | Item Options
];
const processXml = (xmlData) => {
    const record = { name: "", id: "", type: "", fields: [], subLists: {} };
    const jsonData = JSON.parse(xmlData);
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
            }
            else {
                record.name = jsonData.customrecordtype.recordname._text;
                record.fields.push({
                    id: jsonData.customrecordtype.customrecordcustomfields.customrecordcustomfield._attributes.scriptid,
                    type: nsCast(jsonData.customrecordtype.customrecordcustomfields.customrecordcustomfield.fieldtype._text),
                });
            }
        }
        else {
            record.name = jsonData[typeName].label._text;
            switch (typeName) {
                case "transactioncolumncustomfield":
                    if (!record.subLists["item"])
                        record.subLists["item"] = [];
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
};
export const run = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Rebuilding TypeScript Definitions");
    const lists = records.concat(fields.concat(sublists));
    const filePaths = yield readDirectoryChoices(paths.client.src.Objects.root, true);
    console.log("filePaths", filePaths);
    if (filePaths.length === 0) {
        console.error("No files found");
        return;
    }
    for (let i = 0; i < filePaths.length; i++) {
        const filePath = filePaths[i];
        if (lists.filter((s) => filePath.path.includes(s)).length === 0)
            continue;
        const fileContent = fs.readFileSync(filePath.path, "utf8");
        const xmlData = xml2json(fileContent, { compact: true, spaces: 4 });
        const pageRecord = processXml(xmlData);
        if (pageRecord.fields.length === 0 && Object.keys(pageRecord.subLists).length === 0)
            continue;
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
        if (!outPath)
            continue;
        const methods = buildTypeDefinition(pageRecord);
        yield printTemplate("record.d.ts.tmpl", outPath, pageRecord.id + ".d.ts", {
            name: formatFileName(pageRecord.name),
            methods,
        }, false);
    }
});
