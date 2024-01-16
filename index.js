#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "dotenv/config";
import * as addApi from "./cmd/add/api/index.js";
import * as addModule from "./cmd/add/module/index.js";
import * as addProject from "./cmd/add/project/index.js";
import * as addScript from "./cmd/add/script/index.js";
import * as addTypes from "./cmd/add/types/index.js";
import * as imported from "./cmd/import/record/index.js";
import * as collectTest from "./cmd/test/collect/index.js";
import * as runTest from "./cmd/test/run/index.js";
import * as init from "./cmd/init/index.js";
import * as rebuild from "./cmd/rebuild/index.js";
import fs from "fs";
import paths from "./paths.js";
import path from "path";
const [, , first, second, third] = process.argv;
(() => __awaiter(void 0, void 0, void 0, function* () {
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
            yield addApi.run();
            break;
        case "add:module":
            yield addModule.run();
            break;
        case "add:project":
            yield addProject.run();
            break;
        case "add:script":
            yield addScript.run(third);
            break;
        case "add:type":
            yield addTypes.run();
            break;
        case "test:run":
            yield runTest.run();
            break;
        case "test:testCollect":
            yield collectTest.run();
            break;
        case "import:record":
            yield imported.run(third);
            break;
        case "init:":
            yield init.run();
            break;
        case "rebuild:":
            yield rebuild.run();
            break;
        default:
            console.error("Invalid command");
    }
}))();
