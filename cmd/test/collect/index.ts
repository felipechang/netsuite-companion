import inquirer from "inquirer";

/*
We have the script ID and deployment ID
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


enum Options {
    Test = "Run Script Test",
    Collect = "Collect Test Results",
}

export const run = async () => {

    // TODO Validate that we have a token
    // select option to either generate a timestamp or evaluate the results generated after that timestamp

    const answer = await inquirer.prompt([{
        type: "list",
        name: "type",
        message: "Select task to perform:",
        choices: () => [
            Options.Test,
            Options.Collect,
        ]
    }, {
        type: "input",
        name: "run_test",
        message: "Select script to test:",
        when(a) {
            return a.type === Options.Test;
        }
    }, {
        type: "input",
        name: "run_collect",
        message: "Select script to collect:",
        when(a) {
            return a.type === Options.Collect;
        }
    }]);

    await console.log(answer);
}
