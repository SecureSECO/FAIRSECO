import { ReturnObject } from "./getdata";
import YAML from "yaml";
import fs, { PathLike } from "fs";
import {write_overview} from './webapp'

export function post(result: ReturnObject[]): boolean {
    createFairSECODir("./.FairSECO/");
    createReport(result);
    generateHTML(result);
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
        console.log(result);
        fs.writeSync(fd, YAML.stringify(result));
        console.log("Successfully wrote YML file to dir");
        fs.closeSync(fd);
    } catch {
        console.error("Error writing yaml file");
    }
}

async function generateHTML(result: ReturnObject[]): Promise<void> {
    try{
        await write_overview(result, "./.FairSECO/index.html")
    } catch {
        console.error("Error writing HTML file");;
    }
}