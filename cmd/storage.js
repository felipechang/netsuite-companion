import fs from "fs";
import paths, { STORAGE_FILE } from "../paths.js";
import path from "path";
export const updateRecord = (name, data) => {
    fs.existsSync(paths.home.root) || fs.mkdirSync(paths.home.root, { recursive: true });
    fs.writeFileSync(path.join(paths.home.root, name), JSON.stringify(data));
    console.log("User preferences saved in home folder");
};
export const getRecord = (name) => {
    fs.existsSync(paths.home.root) || fs.mkdirSync(paths.home.root, { recursive: true });
    const pathName = path.join(paths.home.root, name);
    return fs.existsSync(pathName) ? JSON.parse(fs.readFileSync(pathName, "utf8")) : null;
};
const Storage = () => {
    return {
        name: "",
        email: "",
        vendor: "",
        prefix: "",
        lang: "",
    };
};
export const storage = fs.existsSync(path.join(paths.home.root, STORAGE_FILE)) ?
    getRecord(STORAGE_FILE) :
    Storage();
