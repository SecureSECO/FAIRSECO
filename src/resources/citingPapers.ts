import { ReturnObject } from "../getdata";
import { semanticScholarCitations } from "./semanticscholarAPI";
import { openAlexCitations } from "./openalexAPI";
import { Journal } from "./journal";

export async function runCitingPapers(title: string): Promise<ReturnObject> {
    const outData1: Journal[] = await semanticScholarCitations(title);
    const outData2: Journal[] = await openAlexCitations(title);
    let output: Journal[] = outData1.concat(outData2);
    output = output.filter((value, index, self) => 
        index === self.findIndex((t) => 
            t.doi === value.doi && t.doi !== "" || t.mag === value.mag && t.mag !== "" || t.pmid === value.pmid && t.pmid !== "" || t.pmcid === value.pmcid && t.pmcid !== ""
        )
    )
    
    return {
        ReturnName: "citingPapers",
        ReturnData: output,
    };
} 




