/**
 * This module contains functions that are called after the main program is done, like
 * creating the output files.
 * 
 * @module
 */

import { ReturnObject } from "./getdata";
import YAML from "yaml";
import fs from "fs";
import { WriteHTML } from "./webapp";
import { ErrorLevel, LogMessage } from "./errorhandling/log";

/**
 * Creates reports showing the gathered data in .yml and .html format.
 * 
 * @param result The data gathered by FAIRSECO.
 */
export async function post(result: ReturnObject[]): Promise<void> {
    // Create report.yml file
    createReport(result);

    // Create dashboard.html file
    await generateHTML(result);
}

// Generate the report of FAIRSECO
function createReport(result: ReturnObject[]): void {
    LogMessage("FAIRSECO report:\n" + JSON.stringify(result), ErrorLevel.info);

    try {
        fs.writeFileSync("./.FAIRSECO/report.yml", YAML.stringify(result));
        fs.writeFileSync("./.FAIRSECO/report.json", JSON.stringify(result));
        LogMessage("Successfully wrote YML file to dir.", ErrorLevel.info);
    } catch {
        LogMessage("Error writing YML file.", ErrorLevel.err);
    }
}

// Make a webapp from the report
async function generateHTML(result: ReturnObject[]): Promise<void> {
    try {
        await WriteHTML(result, "./.FAIRSECO/dashboard.html");
        LogMessage("Successfully wrote HTML file to dir.", ErrorLevel.info);
    } catch (err: any) {
        LogMessage("Error writing HTML file: " + (err.message as string), ErrorLevel.err);
    }
}
