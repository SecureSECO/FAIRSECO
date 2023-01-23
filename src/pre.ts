/**
 * This module contains functions that are called before the main action is run,
 * to set up the directory and files used by the program and make sure the program has the necessary input to run.
 * 
 * @module
 */

import * as core from "@actions/core";
import { createLogFile, ErrorLevel, LogMessage } from "./errorhandling/log";
import fs from "fs";

/**
 * Handles preconditions for running the program.
 * 
 * The function performs the following:
 * - Creating the FAIRSECO directory
 * - Creating the log file
 * - Checking the necessary inputs that are required for the program to run
 * 
 * @returns Whether the preconditions for running the program are satisfied.
 */
export async function pre(): Promise<boolean> {
    createFAIRSECODir();
    createLogFile();

    try {
        const repositories: string = core.getInput("repository");
        
        return repositories !== "";
    } catch (error) {
        core.setFailed(error.message);

        return false;
    }
}

/**
 * Creates the FAIRSECO directory.
 * This function is only exported for unit tests.
 */
export function createFAIRSECODir(): void {
    // Create directory if it does not yet exist
    try {
        fs.mkdirSync("./.FAIRSECO/");
        LogMessage("FAIRSECO directory created.", ErrorLevel.info);
    } catch {
        LogMessage("FAIRSECO directory already exists.", ErrorLevel.info);
    }
}
