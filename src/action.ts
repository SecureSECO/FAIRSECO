import { pre } from "./pre";
import { data } from "./getdata";
import { post } from "./post";

export async function main(): Promise<void> {
    try {
        pre(); // call preconditions check.
        const result = await data(); // call data check.
        post(result); // call post check.
    } catch (error) {
        // catch error
    }
}
