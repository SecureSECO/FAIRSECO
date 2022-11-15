import { ReturnObject } from "../getdata";
import { semanticScholarCitations } from "./semanticscholarAPI";
import { openAlexCitations } from "./openalexAPI";
import { Author, Journal } from "./journal";
import { ValidCffObject } from "./citation_cff";

export async function runCitingPapers(cffFile: ValidCffObject): Promise<ReturnObject> {
    let authors: Author[] = [];
    const title: string = cffFile.citation.title;
    let refTitle: string = "";
    if (cffFile.citation.references !== undefined) {
        cffFile.citation.references.forEach((element: any) => {
            if (element.type === "article")
                refTitle = element.title;
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
        authors = authors.concat([new Author(givenNames, familyName, orchidId)]);
    });
    const outData1: Journal[] = await semanticScholarCitations(authors, title, refTitle);
    // const outData2: Journal[] = await openAlexCitations(authors, title);
    // const output: Journal[] = deleteDuplicates(outData1);

    return {
        ReturnName: "citingPapers",
        ReturnData: outData1,
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

