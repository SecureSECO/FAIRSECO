import { ReturnObject } from "../getdata";
import { semanticScholarCitations } from "./semanticscholarAPI";
import { openAlexCitations } from "./openalexAPI";
import { Journal } from "./journal";
import { ValidCffObject } from "./citation_cff";

export async function runCitingPapers(cfffile: ValidCffObject): Promise<ReturnObject> {
    const title = cfffile.citation.title;
    const outData1: Journal[] = await semanticScholarCitations(title);
    const outData2: Journal[] = await openAlexCitations(title);

    const output: Journal[] = deleteDuplicates(outData1, outData2);

    return {
        ReturnName: "citingPapers",
        ReturnData: output,
    };
} 

export function deleteDuplicates(array1: Journal[], array2: Journal[]): Journal[] {
    let output: Journal[] = array1.concat(array2);
    output = output.filter((value, index, self) => 
        index === self.findIndex((t) => 
            t.doi === value.doi && t.doi !== "" || t.pmid === value.pmid && t.pmid !== "" || t.pmcid === value.pmcid && t.pmcid !== ""
        )
    )
    return output;
}

