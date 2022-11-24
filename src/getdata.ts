import { runTortellini } from "./resources/tortellini";
import { runHowfairis } from "./resources/howfairis";
import { runSearchseco } from "./resources/searchseco";
import { runCitingPapers } from "./resources/citingPapers";
import { getCitationFile, CffObject, ValidCffObject } from "./resources/citation_cff";
import { runSBOM } from "./resources/sbom";

/** An object that contains data gathered by FairSECO. */
export interface ReturnObject {
    /** Describes the name of the gathered data. */
    ReturnName: string;

    /** The gathered data. */
    ReturnData: object;
}

export async function data(): Promise<ReturnObject[]> {
    const output: ReturnObject[] = [];
    // try {
    //     const tortelliniResult = await runTortellini();
    //     output.push(tortelliniResult);
    // } catch (error) {
    //     console.error("Tortellini threw an error:");
    //     console.error(error);
    // }

    // try {
    //     const howfairisResult = await runHowfairis();
    //     output.push(howfairisResult);
    // } catch (error) {
    //     console.error("Howfairis threw an error:");
    //     console.error(error);
    // }

    // try {
    //     const searchsecoResult = await runSearchseco();
    //     output.push(searchsecoResult);
    // } catch (error) {
    //     console.error("Searchseco threw an error:");
    //     console.error(error);
    // }

    try {
        const cffResult = await getCitationFile("./src/resources");
        output.push(cffResult);
    } catch (error) {
        console.error("Getting CITATION.cff caused an error:");
    }

    try {
        const cffFile: CffObject = output.find(x => x.ReturnName === "Citation")?.ReturnData as CffObject ?? { status: "missing_file"};
        if (cffFile.status === "valid") {
            const citingPapersResult = await runCitingPapers(cffFile);
            output.push(citingPapersResult);
        }
        else {
            throw new Error("Invalid cff File");
        }

    } catch (error) {
        console.error("Scholarly threw an error:");
        console.error(error);
    }
    try {
        const SBOMResult = await runSBOM();
        output.push(SBOMResult);
    } catch (error) {
        console.error("SBOM threw an error:");

        console.error(error);
    }
    return output;
}
