import { ReturnObject } from "../getdata";
import { semanticScholarCitations } from "./semanticscholarAPI";
import { openAlexCitations } from "./openalexAPI";
import { Author, Paper } from "./Paper";
import { ValidCffObject } from "./citation_cff";

export async function runCitingPapers(cffFile: ValidCffObject): Promise<ReturnObject> {
    const authors: Author[] = [];
    const title: string = cffFile.citation.title;
    const refTitles: string[] = [];
    if (cffFile.citation.references !== undefined) {
        cffFile.citation.references.forEach((element: any) => {
            if (element.type === "article")
                refTitles.push(element.title);
        });
    }
    cffFile.citation.authors.forEach((element: any) => {
        let familyName = "";
        let givenNames = "";
        let orchidId = "";
        for (const [key, value] of Object.entries(element)) {
            switch (key) {
                case ("family-names"):
                    familyName = String(value);
                    break;
                case ("given-names"):
                    givenNames = String(value);
                    break;
                case ("orcid"):
                    orchidId = String(value);
                    break;
            }
        }
        authors.push(new Author(givenNames, familyName, orchidId));
    });
    //const outData1: Paper[] = await semanticScholarCitations(authors, title, refTitles);
    const outData2: Paper[] = await openAlexCitations(authors, title, refTitles);
    //const output: Paper[] = deleteDuplicates(outData1, outData2);
    for(const paper of outData2){
        console.log("----------")
        console.log(paper.url)
        console.log(paper.fields)
    }
    return {
        ReturnName: "citingPapers",
        ReturnData: outData2
    };
} 

// TODO: Make combine function, so missing meta data will be combined from both sources
export function deleteDuplicates(array1: Paper[], array2: Paper[]): Paper[] {
    let output: Paper[] = array1.concat(array2);
    output = output.filter((value, index, self) => 
        index === self.findIndex((t) => 
            t.doi === value.doi && t.doi !== "" || t.pmid === value.pmid && t.pmid !== "" || t.pmcid === value.pmcid && t.pmcid !== ""
        )
    )
    return output;
}

