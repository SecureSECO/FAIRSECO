import { ReturnObject } from "../getdata";
import { semanticScholarCitations } from "./semanticscholarAPI";
import { openAlexCitations } from "./openalexAPI";
import { Author, Paper } from "./Paper";
import { ValidCffObject } from "./citation_cff";

/**
 * 
 * @returns returnObject containing unique papers citing the software repository
 */
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
    const outData1: Paper[] = await semanticScholarCitations(authors, title, refTitles);
    const outData2: Paper[] = await openAlexCitations(authors, title, refTitles);
    const output: Paper[] = deleteDuplicates(outData1, outData2);
    for(const paper of output){
        console.log("----------")
        console.log(paper.url)
        console.log(paper.fields)
    }
    return {
        ReturnName: "citingPapers",
        ReturnData: output
    };
} 

/**
 * 
 * @returns array containing all the unique papers with the comined meta-data from both sources is it is listed by both databases
 * This function stores all papers in a map with the DOI identifier as key, if the map already contains a paper with it's DOI it combines it into one making sure no meta-data is lost
 * it then does the same for the pmid identifier and pmcid identifier. Splitting this function over three foreach calls and three maps ensures an O(n) runtime, instead an O(n^2)
 */
export function deleteDuplicates(array1: Paper[], array2: Paper[]): Paper[] {
    let totalArray: Paper[] = array1.concat(array2);
    const doiMap: Map<string, Paper> = new Map();
    const pmidMap: Map<string, Paper> = new Map();
    const pmcidMap: Map<string, Paper> = new Map();
    totalArray.forEach(element => {
        if (doiMap.has(element.doi)) {
            const tempPaper = doiMap.get(element.doi) as Paper;
            doiMap.set(element.doi, element.combine(tempPaper));
        }
        else {
            doiMap.set(element.doi, element);
        }
    })
    totalArray = Array.from(pmidMap.values());
    totalArray.forEach(element => {
        if (pmidMap.has(element.pmid)) {
            const tempPaper = pmidMap.get(element.pmid) as Paper;
            pmidMap.set(element.pmid, element.combine(tempPaper));
        }
        else {
            pmidMap.set(element.pmid, element);
        }
    })
    totalArray = Array.from(pmidMap.values());
    totalArray.forEach(element => {
        if (pmcidMap.has(element.pmcid)) {
            const tempPaper = pmcidMap.get(element.pmcid) as Paper;
            pmcidMap.set(element.pmcid, element.combine(tempPaper));
        }
        else {
            pmcidMap.set(element.pmcid, element);
        }
    })
    totalArray = Array.from(pmcidMap.values());
    return totalArray;
}

