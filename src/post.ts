/*
This program has been developed by students from the bachelor Computer Science at
Utrecht University within the Software Project course.
© Copyright Utrecht University (Department of Information and Computing Sciences)
 */

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
import { getHistoryData } from "./history";

/**
 * Creates reports showing the gathered data in .yml and .html format.
 * The FAIRSECO history file is also read and updated.
 *
 * @param result The data gathered by FAIRSECO.
 */
export async function post(result: ReturnObject[]): Promise<void> {
    // Create report.yml file
    createReport(result);

    // Get (and update) history data.
    // Add this after generating the raw data report to not include it there.
    // It will be used by the dashboard.
    const historyData = getHistoryData("./.fairseco_history.json", result);
    result.push({
        ModuleName: "History",
        Data: historyData,
    });

    // Create dashboard.html file
    await generateHTML(result);
}

// Generate the report of FAIRSECO
function createReport(result: ReturnObject[]): void {
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
        await WriteHTML(result, "./.FAIRSECO/");
        LogMessage("Successfully wrote HTML file to dir.", ErrorLevel.info);
    } catch (err: any) {
        LogMessage(
            "Error writing HTML file: " + (err.message as string),
            ErrorLevel.err
        );
    }
}
