import { pre } from "./pre";
import { data } from "./getdata";
import { post } from "./post";

export async function main(): Promise<void> {
    try {
        const repository: string = core.getInput('repository')
        pre(); // call preconditions check.
        const result = await data(repository); // call data check.
        post(result); // call post check.
    } catch (error) {
        // catch error
    }
}
