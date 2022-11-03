import { runTortellini } from "./resources/tortellini";
import { runHowfairis } from "./resources/howfairis";
import { runSearchseco } from "./resources/searchseco";
import { runCitingPapers } from "./resources/citingPapers";
import { getCitationFile } from "./resources/citation_cff";
import { runSBOM } from "./resources/sbom";


export interface ReturnObject {
    ReturnName: string;
    ReturnData: object;
}

export async function data(): Promise<ReturnObject[]> {
    const output: ReturnObject[] = [];

    try {
        const tortelliniResult = await runTortellini();
        output.push(tortelliniResult);
    } catch (error) {
        console.error("Tortellini threw an error:");
        console.error(error);
    }

    try {
        const howfairisResult = await runHowfairis();
        output.push(howfairisResult);
    } catch (error) {
        console.error("Howfairis threw an error:");
        console.error(error);
    }

    try {
        const searchsecoResult = await runSearchseco();
        output.push(searchsecoResult);
    } catch (error) {
        console.error("Searchseco threw an error:");
        console.error(error);
    }

    try {

        const scholarlyResult = await runCitingPapers("ss-TEA: Entropy based identification of receptor specific ligand binding residues from a multiple sequence alignment of class A GPCRs");
        output.push(scholarlyResult);
    } catch (error) {
        console.error("Scholarly threw an error:");
        console.error(error);
    }
    
    try {
        const cffResult = await getCitationFile(".");
        output.push(cffResult);
    } catch (error) {
        console.error("Getting CITATION.cff caused an error:");
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
