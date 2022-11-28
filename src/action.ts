import { pre } from "./pre";
import { data } from "./getdata";
import { post } from "./post";
import { createLogFile } from "./log";
import * as core from "@actions/core";

/** The entrypoint of the program. */
export async function main(): Promise<void> {
    try {
        createLogFile();
        const check = await pre();
        if (check) {
            const result = await data(); // call data check.
            await post(result); // call post check.
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}
