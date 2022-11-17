import { pre } from "./pre";
import { data } from "./getdata";
import { post } from "./post";
import * as core from "@actions/core";

/**
 * Entrypoint of the program
 *
 * @returns nothing
 */
export async function main(): Promise<void> {
    try {
        const check = await pre();
        if (check) {
            const result = await data(); // call data check.
            await post(result); // call post check.
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}
