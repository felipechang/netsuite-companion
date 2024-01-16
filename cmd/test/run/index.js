var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const settings = {
        accountId: process.env.NS_REALM || "",
        tokenKey: process.env.NS_TOKEN || "",
        tokenSecret: process.env.NS_TOKEN_SECRET || "",
        consumerKey: process.env.NS_CONSUMER_KEY || "",
        consumerSecret: process.env.NS_CONSUMER_SECRET_KEY || ""
    };
    for (let key in settings)
        if (!settings[key])
            throw new Error(`Missing environment variable: ${key}`);
    if (!process.env.NS_RESTLET_URI)
        throw new Error(`Missing environment variable: url`);
    /*

    Load tests from /test folder
    We store JSON files with script ID, timestamp range, job ID, and collected results

    RESTLet loads script logs using script and deployment ID
    User Event: Restlet Opens the record, updates with values, and saves. Logs are then read and sent back to client
    if Scheduled or Map/Reduce or Mass Update(?): first give the option to evaluate one of the jobs. RESTlet executes the
     process when launched and returns an ID. ID is stored in memory DB. ID is printedin console. IF the RESTlet is called
     with an ID, it gets the associated logs for that task.
    RESTlets and Sutielets are called, and then a second time to read logs.

Need:

 select which test results to run.
- Jest framework to call RESTlet, and evaluate expected.
- Module to do RESTlet calls and store results in DB.
- RESTlet to receive and process payloads.

How to do async jobs with Jest
 */
});
