var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { load } from "cheerio";
import { request } from "https";
const parse = (body) => {
    const $ = load(body);
    const record = { name: "", id: "", type: "systemrecordtype", fields: [], subLists: {} };
    $("table#fields tbody").children().each((i, e) => {
        if (i === 0)
            return;
        const els = $(e).children();
        const id = $(els[0]).text();
        const type = $(els[1]).text();
        record.fields.push({ id, type });
    });
    let sublist = false;
    let type = "";
    $("#contentPanel").children().each((_, e) => {
        const el = $(e);
        const nodeName = el.prop('nodeName');
        if (nodeName === "H1" && !record.name) {
            record.name = el.text();
        }
        if (nodeName === "H2") {
            sublist = el.text() === "Sublists";
        }
        if (nodeName === "H3" && !record.id) {
            record.id = el.text().replace("Internal ID: ", "");
        }
        if (sublist && nodeName === "H4") {
            type = el.children().first().text().split(" ")[0];
            if (!record.subLists[type]) {
                record.subLists[type] = [];
            }
        }
        if (type && sublist && nodeName === "TABLE") {
            el.find("tbody").children().each((i, e1) => {
                if (i === 0)
                    return;
                const els = $(e1).children();
                const typeText = $(els[1]).text();
                const idText = $(els[0]).text();
                record.subLists[type].push({ id: idText, type: typeText });
            });
        }
    });
    return record;
};
export const queryRecord = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(resolve => {
        const req = request(url, res => {
            const data = [];
            res.on('data', r => data.push(r));
            res.on('end', () => resolve(parse(data.join())));
        });
        req.end();
    });
});
