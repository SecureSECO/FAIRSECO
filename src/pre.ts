import * as core from "@actions/core";
import { createLogFile } from "./log";
import fs, { PathLike } from "fs";

/**
 * Handles preconditions for getting the data.
 * @returns Whether the preconditions for getting the data are satisfied.
 */
export async function pre(): Promise<boolean> {
    createFairSECODir();
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

/**
 * Creates the FairSECO directory.
 * This function is exported for unit tests.
 */
export function createFairSECODir(): void {
    // Create dir if not exists
    console.log("Creating FairSECO directory.");
    try {
        fs.mkdirSync("./.FairSECO/");
    } catch {
        console.log("Folder already exists, skipping");
    }
}
