import { runTortellini } from "./resources/tortellini";
import { runHowfairis } from "./resources/howfairis";
import { runSearchseco } from "./resources/searchseco";
import { getGithubInfo, GithubInfo } from "./git";

export interface ReturnObject {
    ReturnName: string;
    ReturnData: object;
}
export async function data(): Promise<ReturnObject[]> {
    const output: ReturnObject[] = [];
    let ghinfo: GithubInfo;
    ghinfo = await getGithubInfo();
    try {
        const tortelliniResult = await runTortellini(ghinfo);
        output.push(tortelliniResult);
    } catch (error) {
        console.error("Tortellini threw an error:");
        console.error(error);
    }

    try {
        const howfairisResult = await runHowfairis(ghinfo);
        output.push(howfairisResult);
    } catch (error) {
        console.error("Howfairis threw an error:");
        console.error(error);
    }

    try {
        const searchsecoResult = await runSearchseco(ghinfo);
        output.push(searchsecoResult);
    } catch (error) {
        console.error("Searchseco threw an error:");
        console.error(error);
    }

    return output;
}
