// FILE MUST BE ON THE CMD FOLDER FOR PATHS TO WORK
import path from "path";
import { fileURLToPath } from 'url';
import { homedir } from 'os';
const app = path.dirname(fileURLToPath(import.meta.url));
const client = process.cwd();
const src = path.join(client, "src");
const models = path.join(client, "models");
const FileCabinet = path.join(src, "FileCabinet");
const home = path.join(homedir(), ".netsuite-companion");
export const STORAGE_FILE = "storage.json";
const paths = {
    // Folder from where the script is executed
    app: {
        root: app,
        templates: path.join(app, "templates"),
        boilerplate: path.join(app, "cmd", "init", "boilerplate.zip"),
    },
    // Target client folder
    client: {
        root: client,
        models: {
            root: models,
            records: path.join(models, "records"),
            fields: path.join(models, "fields"),
            sublists: path.join(models, "sublists"),
        },
        src: {
            root: src,
            FileCabinet: {
                root: FileCabinet,
                SuiteScripts: {
                    root: path.join(FileCabinet, "SuiteScripts"),
                }
            },
            Objects: {
                root: path.join(client, "src", "Objects")
            },
        }
    },
    // User's home directory
    home: {
        root: home,
    },
};
export default paths;
