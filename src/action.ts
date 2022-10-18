import { pre } from "./pre";
import { data } from "./getdata";
import { post } from "./post";
import * as core from '@actions/core'

export async function main(): Promise<void> {
    try {
        const repository: string = core.getInput('repository')
        console.log(repository)
        pre(); // call preconditions check.
        const result = await data(); // call data check.
        post(result); // call post check.
    } catch (error) {
        // catch error
    }
}
