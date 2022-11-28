import * as core from "@actions/core";
import { createLogFile } from "./log";
import fs, { PathLike } from "fs";

/**
 * Handles preconditions for getting the data.
 * @returns Whether the preconditions for getting the data are satisfied.
 */
export async function pre(): Promise<boolean> {
    createFairSECODir("./.FairSECO/");
    createLogFile();

    try {
        const repositories: string = core.getInput("repository");
        if (repositories === "") {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        core.setFailed(error.message);
    }
    return false;
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
