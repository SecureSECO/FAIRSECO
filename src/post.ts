import { ReturnObject } from "./getdata";
import YAML from "yaml";
import fs from "fs";
import { WriteHTML, WriteCSS } from "./webapp";

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
    const fd: number = fs.openSync("./.FairSECO/Report.yml", "w+");
    try {
        console.log(result);
        fs.writeSync(fd, YAML.stringify(result));
        console.log("Successfully wrote YML file to dir");
        fs.closeSync(fd);
    } catch {
        console.error("Error writing yaml file");
    }
}

// Make a webapp from the report
async function generateHTML(result: ReturnObject[]): Promise<void> {
    try {
        await WriteHTML(result, "./.FairSECO/index.html");
        console.log("Successfully wrote HTML to dir");

        // await WriteCSS("./.FairSECO/style.css");
        // console.log("Successfully wrote CSS to dir");
    } catch {
        console.error("Error writing HTML file");
    }
}
