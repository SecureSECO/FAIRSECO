/**
 * This module contains the action.
 * 
 * @module
 */

import { pre } from "./pre";
import { data } from "./getdata";
import { post } from "./post";
import * as core from "@actions/core";

/**
 * The entrypoint of the program.
 * The program performs the following steps:
 * - Handle preconditions required for the program to run
 * - Call the modules that generate the data
 * - Generates the output files
*/
export async function main(): Promise<void> {
    try {
        // Handle preconditions
        const check = await pre();

        if (check) {
            // Generate the data
            const result = await data();
            
            // Create output files
            await post(result);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}
