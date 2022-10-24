import { ReturnObject } from "./getdata";
import YAML from "yaml";
import fs, { PathLike } from "fs";

// Main function
export function post(result: ReturnObject[]): boolean {
    createFairSECODir("./.FairSECO/"); // Make sure the output dir exists before we place files in it.
    createReport(result); // Create report.yml file
    return true;
}

function createFairSECODir(path: PathLike): void {
    // Create dir if not exists
    console.log("Creating FairSECO directory.");
    try {
        fs.mkdirSync(path);
    } catch {
        console.log("Folder already exists, skipping");
    }
}

function createReport(result: ReturnObject[]): void {
    const fd: number = fs.openSync("./.FairSECO/Report.yml", "w+");
    try {
        fs.writeSync(fd, YAML.stringify(result));
        console.log("Successfully wrote YML file to dir");
        fs.closeSync(fd);
    } catch {
        console.error("Error writing yaml file");
    }
}
