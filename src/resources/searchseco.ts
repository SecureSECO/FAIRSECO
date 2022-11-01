import { ReturnObject } from "../getdata";
import { GithubInfo } from "../git";

export async function runSearchseco(ghinfo: GithubInfo): Promise<ReturnObject> {
    return {
        ReturnName: "SearchSeco",
        ReturnData: {},
    };
}
