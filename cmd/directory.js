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
import dirTree from "directory-tree";
const getChildren = (res, children) => {
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        res.push(child);
        if (child.children)
            getChildren(res, child.children);
    }
};
export const readDirectoryChoices = (rootPath) => __awaiter(void 0, void 0, void 0, function* () {
    fs.existsSync(rootPath) || fs.mkdirSync(rootPath, { recursive: true });
    const tree = dirTree(rootPath);
    const files = [];
    if (!tree)
        return files;
    if (tree.children)
        getChildren(files, tree.children);
    return files;
});
