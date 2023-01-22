/**
 * Module containing functions for finding unique papers that cite a piece of research software.
 * 
 * @module
 */

import { semanticScholarCitations } from "./apis/semanticscholar_api";
import { openAlexCitations } from "./apis/openalex_api";
import { Author, Paper, Citations } from "./paper";
import { CffObject } from "../citation_cff";

/** The name of the module. */
export const ModuleName = "CitingPapers";

/**
 * Finds papers citing a piece of research software, given the CITATION.cff file of its repository.
 * 
 * @param cffFile The information from the CITATION.cff file.
 * 
 * @returns An array of unique papers citing the software.
 */
export async function runModule(
    cffFile: CffObject | undefined 
): Promise<any> {
    // Check cff output
    if (cffFile === undefined || cffFile.status !== "valid") {
        throw new Error("Invalid CITATION.cff file");
    }

    const title: string = cffFile.citation.title;
    
    // Get reference paper titles from CITATION.cff file
    const refTitles: string[] = [];
    if (cffFile.citation.references !== undefined) {
        for (const ref of cffFile.citation.references){
            if (ref.type === "article" || ref.type === "journal-article") {
                refTitles.push(ref.title);
            }
        }
    }

    // Get authors from CITATION.cff file
    const authors: Author[] = [];
    for (const author of cffFile.citation.authors){
        let familyName = "";
        let givenNames = "";
        let orchidID = "";
        for (const [key, value] of Object.entries(author)) {
            switch (key) {
                case "family-names":
                    familyName = String(value);
                    break;
                case "given-names":
                    givenNames = String(value);
                    break;
                case "orcid":
                    orchidID = String(value);
                    break;
            }
        }
        authors.push(new Author(givenNames + " " + familyName, orchidID));
    }

    const semanticScholarData: Paper[] = await semanticScholarCitations(
        authors,
        title,
        refTitles
    );
    const openAlexData: Paper[] = await openAlexCitations(
        authors,
        title,
        refTitles
    );

    const outputPapers: Paper[] = mergeDuplicates(semanticScholarData, openAlexData);
    return new Citations(outputPapers);
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

    // Merge papers with the same doi
    const doiMap: Map<string, Paper> = new Map();
    let mockID: number = 0;
    for (const paper of totalArray) {
        if (doiMap.has(paper.doi)) {
            const tempPaper = doiMap.get(paper.doi) as Paper;
            doiMap.set(paper.doi, paper.combine(tempPaper));
        } else if (paper.doi === "") {
            doiMap.set(mockID.toString(), paper);
            mockID++;
        } else {
            doiMap.set(paper.doi, paper);
        }
    }
    totalArray = Array.from(doiMap.values());

    // Merge papers with the same pmid
    const pmidMap: Map<string, Paper> = new Map();
    mockID = 0;
    for (const paper of totalArray) {
        if (pmidMap.has(paper.pmid)) {
            const tempPaper = pmidMap.get(paper.pmid) as Paper;
            pmidMap.set(paper.pmid, paper.combine(tempPaper));
        } else if (paper.pmid === "") {
            pmidMap.set(mockID.toString(), paper);
            mockID++;
        } else {
            pmidMap.set(paper.pmid, paper);
        }
    }
    totalArray = Array.from(pmidMap.values());

    // Merge papers with the same pmcid
    const pmcidMap: Map<string, Paper> = new Map();
    mockID = 0;
    for (const element of totalArray) {
        if (pmcidMap.has(element.pmcid)) {
            const tempPaper = pmcidMap.get(element.pmcid) as Paper;
            pmcidMap.set(element.pmcid, element.combine(tempPaper));
        } else if (element.pmcid === "") {
            pmcidMap.set(mockID.toString(), element);
            mockID++;
        } else {
            pmcidMap.set(element.pmcid, element);
        }
    };

    totalArray = Array.from(pmcidMap.values());
    return totalArray;
}
