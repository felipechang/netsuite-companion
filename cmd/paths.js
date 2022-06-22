import path from "path"
import {fileURLToPath} from 'url';

export const suiteScriptPath = path.join(process.cwd(), "src", "FileCabinet", "SuiteScripts")

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
