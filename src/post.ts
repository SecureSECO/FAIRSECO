import { ReturnObject } from "./getdata";
import YAML from "yaml";
import fs from "fs";
import { WriteHTML, WriteCSS } from "./webapp";
import { ErrorLevel, LogMessage } from "./errorhandling/log";

/**
 * Creates reports showing the gathered data in .yml and .html format.
 * @param result The data gathered by FairSECO.
 */
export async function post(result: ReturnObject[]): Promise<boolean> {
    createReport(result); // Create report.yml file
    await generateHTML(result);
    return true;
}

// Generate the report of FairSeco
function createReport(result: ReturnObject[]): void {
    LogMessage("FairSECO report:\n" + result.toString(), ErrorLevel.info);
    try {
        fs.writeFileSync("./.FairSECO/Report.yml", YAML.stringify(result));
        LogMessage("Successfully wrote YML file to dir.", ErrorLevel.info);
    } catch {
        LogMessage("Error writing YML file.", ErrorLevel.err);
    }
}

// Make a webapp from the report
async function generateHTML(result: ReturnObject[]): Promise<void> {
    try {
        await WriteHTML(result, "./.FairSECO/index.html");
        LogMessage("Successfully wrote HTML file to dir.", ErrorLevel.info);

        // await WriteCSS("./.FairSECO/style.css");
        // console.log("Successfully wrote CSS to dir");
    } catch (err: any) {
        const errormessage: string = err.message;
        LogMessage(`Error writing HTML file: ${errormessage}`, ErrorLevel.err);
    }
}
