/**
 * This module contains the action.
 * 
 * @module
 */

import { pre } from "./pre";
import { data } from "./getdata";
import { post } from "./post";
import * as core from "@actions/core";

/** The entrypoint of the program. */
export async function main(): Promise<void> {
    try {
        const check = await pre();
        if (check) {
            // Call data check.
            const result = await data();
            
             // Call post check.
            await post(result);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}
