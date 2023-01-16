/**
 * This module handles the main part of the action. It runs each resource module and compiles
 * them into an array of {@link ReturnObject}s.
 * 
 * @remarks
 * Because every function is wrapped in a try-catch block separately,
 * the program doesn't crash if one of them fails. The result will simply omit the data
 * from that resource.
 * 
 * @module
 */

import * as tortellini from "./resources/tortellini";
import * as fairtally from "./resources/fairtally";
import * as searchSECO from "./resources/searchseco";
import * as citingPapers from "./resources/citations/citingPapers";
import * as citationcff from "./resources/citation_cff";
import * as sbom from "./resources/sbom";
import * as qualityMetrics from "./resources/qualitymetrics";
import { ErrorLevel, LogMessage } from "./errorhandling/log";
import { getGitHubInfo, GitHubInfo } from "./git";

/** An object that contains data gathered by FAIRSECO. */
export interface ReturnObject {
    /** Describes the name of the gathered data. */
    ReturnName: string;

    /** The gathered data. */
    ReturnData: object;
}

export async function data(): Promise<ReturnObject[]> {
    // Get GitHub repository info
    const ghInfo: GitHubInfo = await getGitHubInfo();

    // Run modules
    const tortelliniResult = await runModule(tortellini);
    const fairtallyResult = await runModule(fairtally, ghInfo);
    const searchSECOResult = await runModule(searchSECO, ghInfo);
    const cffResult = await runModule(citationcff);
    const SBOMResult = await runModule(sbom);
    const citingPapersResult = await runModule(citingPapers, cffResult?.ReturnData);
    const qualityMetricsResult = await runModule(qualityMetrics, ghInfo, fairtallyResult?.ReturnData, tortelliniResult?.ReturnData);

    // Return the data produced by modules
    return [
        tortelliniResult,
        fairtallyResult,
        searchSECOResult,
        cffResult,
        SBOMResult,
        citingPapersResult,
        qualityMetricsResult
    ].filter((e) => e !== undefined) as ReturnObject[];
}

async function runModule(module: any, ...parameters: any): Promise<ReturnObject | undefined> {
    try {
        const result : ReturnObject = {
            ReturnName: module.ModuleName as string,
            ReturnData: await module.runModule(parameters)
        };
        return result;
    } catch (error) {
        LogMessage(
            (module.ModuleName as string) + " encountered an error:\n" + (error.message as string),
            ErrorLevel.err
        );

        return undefined;
    }
}
