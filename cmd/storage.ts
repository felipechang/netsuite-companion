import fs from "fs";
import paths, {STORAGE_FILE} from "../paths.js";
import path from "path";

export const updateRecord = (name: string, data: any) => {
    fs.existsSync(paths.home.root) || fs.mkdirSync(paths.home.root, {recursive: true});
    fs.writeFileSync(path.join(paths.home.root, name), JSON.stringify(data));
}
export const getRecord = (name: string): IPageRecord | IStorage => {
    fs.existsSync(paths.home.root) || fs.mkdirSync(paths.home.root, {recursive: true});
    const pathName = path.join(paths.home.root, name);
    return fs.existsSync(pathName) ? JSON.parse(fs.readFileSync(pathName, "utf8")) : null;
}

const Storage = (): IStorage => {
    return {
        name: "",
        email: "",
        vendor: "",
        prefix: "",
        lang: "",
    }
};

export const storage: IStorage = fs.existsSync(path.join(paths.home.root, STORAGE_FILE)) ?
    getRecord(STORAGE_FILE) as IStorage :
    Storage();
