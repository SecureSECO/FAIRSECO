/*
This program has been developed by students from the bachelor Computer Science at
Utrecht University within the Software Project course.
© Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import * as log from "../../src/errorhandling/log";
import fs from "fs";

// (Re)create the log file before each test
beforeEach(() => {
    log.createLogFile();
});

test("A log file is created succesfully", async () => {
    expect(fs.existsSync("./.FAIRSECO/program.log")).toBe(true);
});

test("Formatting message works", async () => {
    // Format a message
    const testContent = "This is content";
    let message = log.formatMessage(testContent, log.ErrorLevel.info);

    // Check if the formatted message starts with the current date
    let messageDate = Date.parse(message.split("-")[0]);
    let currentDate = new Date().getTime();
    // Check if the message date and current date are within 60 seconds of eachother
    expect(currentDate - messageDate).toBeLessThanOrEqual(60000);

    // Check if the formatted message includes the error level
    expect(message.includes("INFO")).toBe(true);

    // Check if the formatted message includes the given content
    expect(message.includes(testContent)).toBe(true);
});

test("A logged error ends up in the log file", async () => {
    // Log a message
    const testError = "This is an error";
    log.LogMessage(testError, log.ErrorLevel.err);

    // Check if the log file includes the message
    const contents = fs.readFileSync("./.FAIRSECO/program.log");
    expect(contents.includes(testError)).toBe(true);
});
