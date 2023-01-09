#!/usr/bin/env node

import "dotenv/config";

import * as addApi from "./cmd/add/api/index.js";
import * as addModule from "./cmd/add/module/index.js";
import * as addProject from "./cmd/add/project/index.js";
import * as addScript from "./cmd/add/script/index.js";
import * as addTypes from "./cmd/add/types/index.js";
import * as imported from "./cmd/import/record/index.js";
import * as init from "./cmd/init/index.js";
import * as rebuild from "./cmd/rebuild/index.js";
import fs from "fs";
import paths from "./paths.js";
import path from "path";

const [, , first, second, third] = process.argv;

(async () => {
    if (!first) {
        console.log(fs.readFileSync(path.join(paths.app.templates, "manpage.tmpl"), "utf8"));
        return;
    }
    if (first !== "init" && (!process.env.COMPANY_NAME || !process.env.USER_NAME || !process.env.USER_EMAIL)) {
        console.error("Must first run `nsc init`");
        return;
    }
    switch (`${first || ""}:${second || ""}`) {
        case "add:api":
            await addApi.run();
            break;
        case "add:module":
            await addModule.run();
            break;
        case "add:project":
            await addProject.run();
            break;
        case "add:script":
            await addScript.run();
            break;
        case "add:types":
            await addTypes.run();
            break;
        case "import:record":
            await imported.run(third);
            break;
        case "init:":
            await init.run();
            break;
        case "rebuild:":
            await rebuild.run();
            break;
        default:
            console.error("Invalid command");
    }
})();