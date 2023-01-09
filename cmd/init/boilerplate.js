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
import { Extract } from "unzipper";
import paths from "../../paths.js";
import path from "path";
import { printTemplate } from "../util.js";
import handlebars from "handlebars";
const UNZIP_TIMEOUT = 500;
export const deploy = (answer) => {
    fs.createReadStream(paths.app.boilerplate)
        .pipe(Extract({ path: paths.client.root }))
        .on("finish", () => {
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Bundle copied...");
            answer.prefix = answer["prefix"].substring(0, 3).toLowerCase();
            console.log("Syncing .env file...");
            yield printTemplate(".env.tmpl", paths.client.root, ".env", answer, false);
            console.log("Syncing manifest.xml file...");
            yield printTemplate("manifest.xml.tmpl", paths.client.src.root, "manifest.xml", answer, false);
            console.log("Syncing package.json version...");
            fs.mkdirSync(path.join(paths.client.src.FileCabinet.SuiteScripts.root, answer.vendor), { recursive: true });
            const pkg = JSON.parse(String(fs.readFileSync(path.join(paths.app.root, "package.json"))));
            const deployPkg = path.join(paths.client.root, "package.json");
            const contents = String(fs.readFileSync(deployPkg));
            const template = handlebars.compile(contents);
            fs.writeFileSync(deployPkg, template(pkg));
            console.log("Deployment complete");
        }), UNZIP_TIMEOUT);
    });
};
