/**
 * Module containing functions for finding unique papers that cite a piece of research software.
 * 
 * @module
 */

import { ReturnObject } from "../../getdata"
import { semanticScholarCitations } from "./APIs/semanticscholarAPI";
import { openAlexCitations } from "./APIs/openalexAPI";
import { Author, Paper, Citations } from "./paper";
import { CffObject } from "../citation_cff";

/** The name of the module. */
export const ModuleName = "CitingPapers";

/**
 * Finds papers citing a piece of research software, given the citation.cff file of its repository.
 * 
 * @param cffFile The information from the citation.cff file.
 * 
 * @returns A `ReturnObject` containing unique papers citing the software.
 */
export async function runModule(
    cffFile: CffObject | undefined 
): Promise<any> {
    // Check cff output
    if (cffFile === undefined || cffFile.status !== "valid") {
        throw new Error("Invalid CITATION.cff file");
    }

    const authors: Author[] = [];
    const title: string = cffFile.citation.title;
    const refTitles: string[] = [];
    if (cffFile.citation.references !== undefined) {
        cffFile.citation.references.forEach((element: any) => {
            if (
                element.type === "article" ||
                element.type === "journal-article"
            )
                refTitles.push(element.title);
        });
    }
    cffFile.citation.authors.forEach((element: any) => {
        let familyName = "";
        let givenNames = "";
        let orchidId = "";
        for (const [key, value] of Object.entries(element)) {
            switch (key) {
                case "family-names":
                    familyName = String(value);
                    break;
                case "given-names":
                    givenNames = String(value);
                    break;
                case "orcid":
                    orchidId = String(value);
                    break;
            }
        }
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
    return output;
}

/**
 * Merges two sources of papers into one.
 * 
 * @remarks Splitting this process over three foreach calls and three maps ensures an O(n) runtime, instead of O(n<sup>2</sup>).
 * 
 * @param array1 The first array of papers.
 * @param array2 The second array of papers.
 *
 * @returns An array of all the unique papers with the combined metadata from both sources.
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
