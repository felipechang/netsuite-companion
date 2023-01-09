import { nsCast } from "./util.js";
export const buildTypeDefinition = (pageRecord) => {
    const methods = [];
    for (let i = 0; i < pageRecord.fields.length; i++) {
        const node = pageRecord.fields[i];
        methods.push(`    getValue(fieldId: '${node.id}'): ${nsCast(node.type)};`);
        methods.push(`    getValue(options: { fieldId: '${node.id}' }): ${nsCast(node.type)};`);
        methods.push(`    setValue(fieldId: '${node.id}', value: ${nsCast(node.type)}): this;`);
        methods.push(`    setValue(options: { fieldId: '${node.id}', value: ${nsCast(node.type)} } & Extras): this;`);
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
    return methods.join("\n");
};
