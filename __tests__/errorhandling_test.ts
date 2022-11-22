import * as log from "../src/log";
import fs from "fs";

// (Re)create the log file before each test
beforeEach(() => {
    log.createLogFile();
});

test("A log file is created succesfully", async () => {
    expect(fs.existsSync("./.FairSECO/program.log")).toBe(true);
});

test("A thrown error ends up in the log file", async () => {
    const testError = "This is an error";
    log.LogMessage(testError, log.ErrorLevel.err);

    const contents = fs.readFileSync("./.FairSECO/program.log");    
    expect(contents.includes(testError)).toBe(true);
});
