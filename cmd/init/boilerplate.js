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
import paths from "../../paths.js";
import path from "path";
import { printTemplate } from "../util.js";
import decompress from "decompress";
export const deploy = (answer) => {
    decompress(paths.app.boilerplate, paths.client.root)
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Bundle copied...");
        answer.prefix = answer["prefix"].substring(0, 3).toLowerCase();
        console.log("Syncing .env file...");
        yield printTemplate(".env.tmpl", paths.client.root, ".env", answer);
        console.log("Syncing manifest.xml file...");
        yield printTemplate("manifest.xml.tmpl", paths.client.src.root, "manifest.xml", answer);
        console.log("Syncing package.json version...");
        fs.mkdirSync(path.join(paths.client.src.FileCabinet.SuiteScripts.root, answer.vendor), { recursive: true });
        console.log("Deployment complete");
    }))
        .catch((error) => {
        console.error(error);
    });
};
