import fs from "fs";
import {Extract} from "unzipper";
import paths from "../../paths.js";
import path from "path";
import {printTemplate} from "../util.js";

const UNZIP_TIMEOUT = 500;

export const deploy = (answer: InitAnswer) => {
    fs.createReadStream(paths.app.boilerplate)
        .pipe(Extract({path: paths.client.root}))
        .on("finish", () => {
            setTimeout(async () => {
                console.log("Bundle copied...");
                answer.prefix = answer["prefix"].substring(0, 3).toLowerCase();
                console.log("Syncing .env file...");
                await printTemplate(".env.tmpl", paths.client.root, ".env", answer);
                console.log("Syncing manifest.xml file...");
                await printTemplate("manifest.xml.tmpl", paths.client.src.root, "manifest.xml", answer);
                console.log("Syncing package.json version...");
                fs.mkdirSync(path.join(paths.client.src.FileCabinet.SuiteScripts.root, answer.vendor), {recursive: true});
                console.log("Deployment complete");
            }, UNZIP_TIMEOUT);
        });
}