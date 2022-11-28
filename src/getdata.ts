import { runTortellini } from "./resources/tortellini";
import { runHowfairis } from "./resources/howfairis";
import { runSearchseco } from "./resources/searchseco";
import { getCitationFile } from "./resources/citation_cff";
import { runSBOM } from "./resources/sbom";
import { ErrorLevel, LogMessage } from "./log";
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
        LogMessage(
            "An error occurred while gathering tortellini data:",
            ErrorLevel.err
        );
        LogMessage(error, ErrorLevel.err);
    }

    try {
        const howfairisResult = await runHowfairis(ghinfo);
        output.push(howfairisResult);
    } catch (error) {

        LogMessage(
            "An error occurred while running howfairis.",
            ErrorLevel.err
        );
        LogMessage(error, ErrorLevel.err);

    }

    try {
        const searchsecoResult = await runSearchseco(ghinfo);
        output.push(searchsecoResult);
    } catch (error) {
        LogMessage(
            "An error occurred while running searchSECO.",
            ErrorLevel.err
        );
        LogMessage(error, ErrorLevel.err);
    }

    try {
        const cffResult = await getCitationFile(".");
        output.push(cffResult);
    } catch (error) {
        LogMessage(
            "An error occurred while fetching CITATION.cff.",
            ErrorLevel.err
        );
        LogMessage(error, ErrorLevel.err);
    }

    try {
        const SBOMResult = await runSBOM();
        output.push(SBOMResult);
    } catch (error) {
        LogMessage("An error occurred during SBOM generation.", ErrorLevel.err);
        LogMessage(error, ErrorLevel.err);
    }

    return output;
}
