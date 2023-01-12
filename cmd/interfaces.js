import { nsCast } from "./util.js";
const addGetMethodField = (methods, fieldId, value) => {
    methods.push(`    getValue(fieldId: '${fieldId}'): ${value};`);
    methods.push(`    getValue(options: { fieldId: '${fieldId}' }): ${value};`);
};
const addSetMethodField = (methods, fieldId, value) => {
    methods.push(`    setValue(fieldId: '${fieldId}', value: ${value}): this;`);
    methods.push(`    setValue(options: { fieldId: '${fieldId}', value: ${value} } & Extras): this;`);
};
export const buildTypeDefinition = (pageRecord) => {
    const methods = [];
    for (let i = 0; i < pageRecord.fields.length; i++) {
        const node = pageRecord.fields[i];
        addGetMethodField(methods, node.id, nsCast(node.type));
        addSetMethodField(methods, node.id, nsCast(node.type));
    }
    for (const name in pageRecord.subLists) {
        for (let j = 0; j < pageRecord.subLists[name].length; j++) {
            const node = pageRecord.subLists[name][j];
            methods.push(`    getLineCount(sublistId: '${name}'): number;`);
            methods.push(`    getLineCount(options: { sublistId: '${name}' }): number;`);
            methods.push(`    getSublistValue(sublistId: '${name}', fieldId: '${node.id}', line: number): ${nsCast(node.type)};`);
            methods.push(`    getSublistValue(options: { sublistId: '${name}', fieldId: '${node.id}', line: number }): ${nsCast(node.type)};`);
            methods.push(`    getCurrentSublistValue(sublistId: '${name}', fieldId: '${node.id}'): ${nsCast(node.type)};`);
            methods.push(`    getCurrentSublistValue(options: { sublistId: '${name}', fieldId: '${node.id}' }): ${nsCast(node.type)};`);
            methods.push(`    setSublistValue(options: { sublistId: '${name}', fieldId: '${node.id}', value: ${nsCast(node.type)} } & LineExtras): Record;`);
            methods.push(`    setCurrentSublistValue(sublistId: '${name}', fieldId: '${node.id}', value: ${nsCast(node.type)}): this;`);
            methods.push(`    setCurrentSublistValue(options: { sublistId: '${name}', fieldId: '${node.id}', value: ${nsCast(node.type)} } & LineExtras): this;`);
            methods.push(`    findSublistLineWithValue(options: { sublistId: '${name}', fieldId: '${node.id}', value: ${nsCast(node.type)} }): number;`);
        }
    }
    addGetMethodField(methods, "isinactive", "boolean");
    addSetMethodField(methods, "isinactive", "boolean");
    addGetMethodField(methods, "created", "Date");
    addGetMethodField(methods, "lastmodified", "Date");
    return methods.join("\n");
};
