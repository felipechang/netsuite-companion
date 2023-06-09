import fs from "fs";
import dirTree, {DirectoryTree} from "directory-tree";

const getChildren = (res: DirectoryTree[], children: DirectoryTree[]) => {
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        res.push(child);
        if (child.children) getChildren(res, child.children);
    }
}
export const readDirectoryChoices = async (rootPath: string, onlyFiles = false): Promise<DirectoryTree[]> => {
    fs.existsSync(rootPath) || fs.mkdirSync(rootPath, {recursive: true});
    const tree = dirTree(rootPath);
    const files: DirectoryTree[] = [];
    if (!tree) return files;
    if (tree.children) getChildren(files, tree.children);
    return onlyFiles ? files.filter((f) => f.path.includes(".")) : files; // only files
}