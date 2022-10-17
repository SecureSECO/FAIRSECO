import { runTortellini } from "./resources/tortellini";
import { runHowfairis } from "./resources/howfairis";
import { runSearchseco } from "./resources/searchseco";

export interface ReturnObject {
    ReturnName: string;
    ReturnData: object;
}
export async function data(): Promise<ReturnObject[]> {
    const output: ReturnObject[] = [];
    try {
        const tortelliniResult = await runTortellini();
        console.error(2);
        output.push(tortelliniResult);
    } catch (error) {
        console.error("Tortellini threw an error.");
    }

    try {
        const howfairisResult = await runHowfairis();
        output.push(howfairisResult);
    } catch (error) {
        console.error("Howfairis threw an error.");
    }

    try {
        const searchsecoResult = await runSearchseco();
        output.push(searchsecoResult);
    } catch (error) {
        console.error("Searchseco threw an error.");
    }

    return output;
}
