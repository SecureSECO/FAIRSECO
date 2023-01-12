/**
 * This module contains functions that are called before the main action is run,
 * to set up the folder and files used by the program.
 * 
 * @module
 */

import * as core from "@actions/core";
import { createLogFile, ErrorLevel, LogMessage } from "./errorhandling/log";
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
    // Create dir if it does not yet exist
    try {
        fs.mkdirSync("./.FairSECO/");
        LogMessage("FairSECO directory created.", ErrorLevel.info);
    } catch {
        LogMessage("FairSECO directory already exists.", ErrorLevel.info);
    }
}
