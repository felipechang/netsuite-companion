const path = require("path");

const docsPath = path.join(process.cwd(), "website", "docs");
const suiteScriptPath = path.join(process.cwd(), "src", "FileCabinet", "SuiteScripts")

module.exports = {
    docsPath,
    suiteScriptPath
}
