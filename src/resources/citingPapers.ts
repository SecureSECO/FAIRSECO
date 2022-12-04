import { ReturnObject } from "../getdata";
import { semanticScholarCitations } from "./semanticscholarAPI";
import { openAlexCitations } from "./openalexAPI";
<<<<<<< HEAD
import { Author, Paper, Citations } from "./Paper";
import { ValidCffObject } from "./citation_cff";

/**
 *
 * @returns returnObject containing unique papers citing the software repository
 */
export async function runCitingPapers(
    cffFile: ValidCffObject
): Promise<ReturnObject> {
=======
import { Author, Journal } from "./journal";
import { ValidCffObject } from "./citation_cff";

export async function runCitingPapers(cffFile: ValidCffObject): Promise<ReturnObject> {
>>>>>>> Integration-Testing
    const authors: Author[] = [];
    const title: string = cffFile.citation.title;
    const refTitles: string[] = [];
    if (cffFile.citation.references !== undefined) {
        cffFile.citation.references.forEach((element: any) => {
<<<<<<< HEAD
            if (
                element.type === "article" ||
                element.type === "journal-article"
            )
=======
            if (element.type === "article")
>>>>>>> Integration-Testing
                refTitles.push(element.title);
        });
    }
    cffFile.citation.authors.forEach((element: any) => {
        let familyName = "";
        let givenNames = "";
        let orchidId = "";
        for (const [key, value] of Object.entries(element)) {
            switch (key) {
<<<<<<< HEAD
                case "family-names":
                    familyName = String(value);
                    break;
                case "given-names":
                    givenNames = String(value);
                    break;
                case "orcid":
=======
                case ("family-names"):
                    familyName = String(value);
                    break;
                case ("given-names"):
                    givenNames = String(value);
                    break;
                case ("orcid"):
>>>>>>> Integration-Testing
                    orchidId = String(value);
                    break;
            }
        }
<<<<<<< HEAD
        authors.push(new Author(givenNames + " " + familyName, orchidId));
    });
    const outData1: Paper[] = await semanticScholarCitations(
        authors,
        title,
        refTitles
    );
    const outData2: Paper[] = await openAlexCitations(
        authors,
        title,
        refTitles
    );
    const outputPapers: Paper[] = mergeDuplicates(outData1, outData2);
    const output = new Citations(outputPapers);
    console.log(output);
    console.log(output.unqiueFields);
    return {
        ReturnName: "citingPapers",
        ReturnData: output,
    };
}

/**
 *
 * @returns array containing all the unique papers with the comined meta-data from both sources is it is listed by both databases
 * This function stores all papers in a map with the DOI identifier as key, if the map already contains a paper with it's DOI it combines it into one making sure no meta-data is lost
 * it then does the same for the pmid identifier and pmcid identifier. Splitting this function over three foreach calls and three maps ensures an O(n) runtime, instead an O(n^2)
 */
export function mergeDuplicates(array1: Paper[], array2: Paper[]): Paper[] {
    let totalArray: Paper[] = array1.concat(array2);
    const doiMap: Map<string, Paper> = new Map();
    const pmidMap: Map<string, Paper> = new Map();
    const pmcidMap: Map<string, Paper> = new Map();
    let mockID: number = 0;
    totalArray.forEach((element) => {
        if (doiMap.has(element.doi)) {
            const tempPaper = doiMap.get(element.doi) as Paper;
            doiMap.set(element.doi, element.combine(tempPaper));
        } else if (element.doi === "") {
            doiMap.set(mockID.toString(), element);
            mockID++;
        } else {
            doiMap.set(element.doi, element);
        }
    });
    totalArray = Array.from(doiMap.values());
    mockID = 0;
    totalArray.forEach((element) => {
        if (pmidMap.has(element.pmid)) {
            const tempPaper = pmidMap.get(element.pmid) as Paper;
            pmidMap.set(element.pmid, element.combine(tempPaper));
        } else if (element.pmid === "") {
            pmidMap.set(mockID.toString(), element);
            mockID++;
        } else {
            pmidMap.set(element.pmid, element);
        }
    });
    totalArray = Array.from(pmidMap.values());
    mockID = 0;
    totalArray.forEach((element) => {
        if (pmcidMap.has(element.pmcid)) {
            const tempPaper = pmcidMap.get(element.pmcid) as Paper;
            pmcidMap.set(element.pmcid, element.combine(tempPaper));
        } else if (element.pmcid === "") {
            pmcidMap.set(mockID.toString(), element);
            mockID++;
        } else {
            pmcidMap.set(element.pmcid, element);
        }
    });
    totalArray = Array.from(pmcidMap.values());
    return totalArray;
}
=======
        authors.push(new Author(givenNames, familyName, orchidId));
    });
    const outData1: Journal[] = await semanticScholarCitations(authors, title, refTitles);
    const outData2: Journal[] = await openAlexCitations(authors, title, refTitles);
    const output: Journal[] = deleteDuplicates(outData1, outData2);

    return {
        ReturnName: "citingPapers",
        ReturnData: output
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

>>>>>>> Integration-Testing
