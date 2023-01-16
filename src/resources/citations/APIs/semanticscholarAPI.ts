/**
 * This module contains functions for finding papers that cite a piece of research software, making use of Semantic Scholar.
 * <br>The main function to be used by other modules is {@link semanticScholarCitations}.
 * 
 * @module
 */

import fetch from "node-fetch";
import { Author, Paper, MetaDataPaper } from "../paper";
import { ErrorLevel, LogMessage } from "../../../errorhandling/log";
import { calculateProbabiltyOfReference } from "../probability";

/**
 * Finds papers citing the given piece of research software using Semantic Scholar.
 * 
 * @param authors An array containing the authors of the software.
 * @param title The title of the software.
 * @param firstRefTitles Titles of known papers of the software.
 * 
 * @returns An array containing the list of papers citing the given piece of software.
 */
export async function semanticScholarCitations(
    authors: Author[],
    title: string,
    firstRefTitles: string[]
): Promise<Paper[]> {
    // initiate variables
    let output: Paper[] = [];
    let paperIds: string[] = [];
    // find reference titles if neccessary
    if (firstRefTitles.length === 0)
        paperIds = await getRefTitles(authors, title);
    else
        for (const title of firstRefTitles)
            paperIds.push(await getSemanticScholarPaperId(title));
    for (const paperId of paperIds)
        output = output.concat(await getCitationPapers(paperId));
    return output;
}

/**
 * Finds papers citing a given paper.
 * 
 * @param paperId The {@link https://api.semanticscholar.org/api-docs/graph#tag/Paper-Data/operation/get_graph_get_paper | Semantic Scholar paper id} corresponding to the paper.
 * 
 * @returns An array of papers citing the given paper.
 */
export async function getCitationPapers(paperId: string): Promise<Paper[]> {
    // prepare query strings
    const semanticScholarApiURL =
        "https://api.semanticscholar.org/graph/v1/paper/";
    const fieldsQuery =
        "/citations?fields=title,externalIds,year,authors,s2FieldsOfStudy,journal,openAccessPdf,url,citationCount&limit=1000";
    // get the unique id semantic scholar gives it's papers
    // instanciate output array
    let output: Paper[] = [];
    try {
        // API call and save output in Json object
        const response: any = await fetch(
            semanticScholarApiURL + paperId + fieldsQuery,
            {
                method: "GET",
                headers: {},
            }
        );
        const outputJSON: any = await response.json();
        // save outputted metadata in Paper object and append to output array
        outputJSON.data.forEach((element: any) => {
            const title = element.citingPaper.title;
            const year = element.citingPaper.year;
            let DOI = "";
            let pmid = "";
            let pmcid = "";
            const fields: string[] = [];
            let journal = "";
            let url = "";
            let numberOfCitations = 0;
            const authors: Author[] = [];
            if (element.citingPaper.externalIds !== undefined) {
                for (const [key, value] of Object.entries(
                    element.citingPaper.externalIds
                )) {
                    switch (key) {
                        case "DOI":
                            DOI = String(value);
                            break;
                        case "PubMed":
                            pmid = String(value);
                            break;
                        case "PubMedCentral":
                            pmcid = String(value);
                            break;
                    }
                }
                DOI = DOI.toLowerCase();
                pmid = pmid.toLowerCase();
                pmcid = pmcid.toLowerCase();
            }
            if (
                element.citingPaper.journal !== undefined &&
                element.citingPaper.journal !== null
            ) {
                const journalObject = element.citingPaper.journal;
                if (journalObject.name !== undefined) {
                    journal = journalObject.name;
                }
            }
            if (element.citingPaper.openAccessPdf !== null) {
                url = element.citingPaper.openAccessPdf.url;
            } else {
                url = element.citingPaper.url;
            }
            if (element.citingPaper.citationCount !== undefined) {
                numberOfCitations = element.citingPaper.citationCount;
            }
            if (element.citingPaper.s2FieldsOfStudy !== undefined) {
                element.citingPaper.s2FieldsOfStudy.forEach((element: any) => {
                    fields.push(element.category);
                });
            }
            if (element.authors !== undefined) {
                for (const author of element.authors)
                    authors.push(new Author(author.name, ""));
            }
            const tempPaper = new Paper(
                title,
                DOI,
                pmid,
                pmcid,
                year,
                "SemanticScholar",
                authors,
                fields,
                journal,
                url,
                numberOfCitations
            );
            output = output.concat([tempPaper]);
        });
        return output;
    } catch (error) {
        LogMessage(
            "Error while searching Semantic Scholar with Semantic Scholar paper ID of: " +
                paperId,
            ErrorLevel.err
        );
        return output;
    }
}

/**
 * Finds papers that are likely reference papers of a piece of research software.
 *
 * @param authors The authors of the software.
 * @param title The title of the software.
 * 
 * @returns An Array of titles of reference papers for the given piece of software.
 */
export async function getRefTitles(
    authors: Author[],
    title: string
): Promise<string[]> {
    // instanciate output array and maps
    const output: string[] = [];
    const papersPerAuthor: Map<Author, any[]> = new Map();
    const uniquePapers: Map<string, MetaDataPaper> = new Map();
    // prepare API strings
    const semanticScholarApiURL =
        "https://api.semanticscholar.org/graph/v1/author/";
    const searchQuery = "search?query=";
    const fieldsQuery =
        "&fields=papers.title,papers.citationCount,papers.venue";
    // find of every author their papers with the title of the software mentioned in the paper
    for (const author of authors) {
        let papers: any[] = [];
        let papersFiltered: any[] = [];
        try {
            const response = await fetch(
                semanticScholarApiURL + searchQuery + author.name + fieldsQuery,
                {
                    method: "GET",
                    headers: {},
                }
            );
            const outputText = await response.text();
            const outputJSON = JSON.parse(outputText);
            outputJSON.data.forEach((element: any) => {
                for (const [key, value] of Object.entries(element)) {
                    if (key === "papers") papers = papers.concat(value);
                }
            });
        } catch (error) {
            let errorMessage =
                "Error while searching for author " +
                author.name +
                " on Semantic Scholar";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            LogMessage(errorMessage, ErrorLevel.err);
        }
        papers.forEach((element: any) => {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (element.title.toLowerCase().includes(title.toLowerCase()))
                papersFiltered = papersFiltered.concat([element]);
        });
        papersPerAuthor.set(author, papersFiltered);
    }
    // find all the unique papers, and keep count of how many authors it shares
    papersPerAuthor.forEach((papers) => {
        papers.forEach((paper) => {
            let paperData: MetaDataPaper;
            if (uniquePapers.has(paper.paperId)) {
                paperData = uniquePapers.get(paper.paperId) as MetaDataPaper;
                paperData.contributors = paperData.contributors + 1;
                uniquePapers.set(paper.paperId, paperData);
            } else {
                uniquePapers.set(
                    paper.paperId,
                    new MetaDataPaper(
                        paper.title,
                        1,
                        paper.citationCount,
                        paper.venue,
                        1
                    )
                );
            }
        });
    });
    // calculate the probability of each paper being a reference paper
    const probScores: number[] = calculateProbabiltyOfReference(uniquePapers);
    let i = 0;
    uniquePapers.forEach((value, key) => {
        if (probScores[i] > 0.6) output.push(key);
        i++;
    });
    return output;
}

/**
 * Finds the {@link https://api.semanticscholar.org/api-docs/graph#tag/Paper-Data/operation/get_graph_get_paper | Semantic Scholar paper id} of a paper.
 * 
 * @param title The title of the paper.
 *
 * @returns The {@link https://api.semanticscholar.org/api-docs/graph#tag/Paper-Data/operation/get_graph_get_paper | Semantic Scholar paper id} of a paper.
 */
export async function getSemanticScholarPaperId(
    title: string
): Promise<string> {
    // prepare query strings
    const semanticScholarApiURL =
        "https://api.semanticscholar.org/graph/v1/paper/";
    const searchQuery = "search?query=";
    try {
        // API call and save it in JSON, then extract the paperID
        // TODO: remove ANYs
        const response: any = await fetch(
            semanticScholarApiURL + searchQuery + '"' + title + '"',
            {
                method: "GET",
                headers: {},
            }
        );
        const outputText = await response.text();
        const outputJSON: any = JSON.parse(outputText);
        // const outputJSON : any = await response.json();
        const paperid = outputJSON.data[0].paperId;
        return paperid;
    } catch (error) {
        LogMessage(
            "Error while fetching paperID from Semantic Scholar of: " + title,
            ErrorLevel.err
        );
        const output = "";
        return output;
    }
}
