import { runTortellini } from "./resources/tortellini";
import { runHowfairis } from "./resources/howfairis";
import { runSearchseco } from "./resources/searchseco";
import { runCitingPapers } from "./resources/citingPapers";

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
        const scholarlyResult = await runCitingPapers("Autocalibration of accelerometer data for free-living physical activity assessment using local gravity and temperature: an evaluation on four continents");
        output.push(scholarlyResult);
    } catch (error) {
        console.error("Scholarly threw an error:");
        console.error(error);
    }
    
    return output;
}
