/**
 * This module contains functions for finding papers that cite a piece of research software, making use of Semantic Scholar.
 * <br>The main function to be used by other modules is {@link semanticScholarCitations}.
 * 
 * @module
 */

import fetch from "node-fetch";
import { Author, Paper, MetaDataPaper } from "../paper";
import { ErrorLevel, LogMessage } from "../../../errorhandling/log";
import { selectReferencePapers } from "../referencepaper";

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
    // Find the OpenAlex paper IDs of the input
    let paperIDs: string[] = [];
    if (firstRefTitles.length === 0) {
        // No reference titles given: find reference papers and their paper IDs
        paperIDs = await getReferencePapers(authors, title);
    } else {
        // Reference titles given: get their paper IDs
        for (const title of firstRefTitles) {
            const id = await getSemanticScholarPaperID(title);
            if (id !== undefined) {
                paperIDs.push(id);
            }
        }
    }

    // Find papers citing the given papers
    let output: Paper[] = [];
    for (const paperID of paperIDs) {
        output = output.concat(await getCitationPapers(paperID));
    }

    return output;
}

/**
 * Finds papers citing a given paper.
 * 
 * @param paperID The [Semantic Scholar paper ID](https://api.semanticscholar.org/api-docs/graph#tag/Paper-Data/operation/get_graph_get_paper) corresponding to the paper.
 * 
 * @returns An array of papers citing the given paper.
 */
export async function getCitationPapers(paperID: string): Promise<Paper[]> {
    // Prepare query strings: query citations of the given paper
    // https://api.semanticscholar.org/api-docs/graph#tag/Paper-Data/operation/get_graph_get_paper
    const semanticScholarApiURL =
        "https://api.semanticscholar.org/graph/v1/paper/";
    const fieldsQuery =
        "/citations?fields=title,externalIds,year,authors,s2FieldsOfStudy,journal,openAccessPdf,url,citationCount&limit=1000";
    
    // Get the works that cite this paper
    const output: Paper[] = [];
    try {
        // Get the paper data
         const response = await fetch(
            semanticScholarApiURL + paperID + fieldsQuery,
            {
                method: "GET",
                headers: {},
            }
        );
        const outputJSON = await response.json();

        // Extract data from the works that cite the paper,
        // data is represented as Paper objects
        for (const scholarPaper of outputJSON.data) {
            const title = scholarPaper.citingPaper.title;
            const year = scholarPaper.citingPaper.year;
            const journalObject = scholarPaper.citingPaper.journal;
            const journal = journalObject.name == null ? journalObject : journalObject.name;
            const numberOfCitations = scholarPaper.citingPaper.citationCount ?? 0;
            let url;
            if (scholarPaper.citingPaper.openAccessPdf === null ||  scholarPaper.citingPaper.openAccessPdf === undefined) {
                url = scholarPaper.citingPaper.url as string;
            } else {
                url = (scholarPaper.citingPaper.openAccessPdf.url ?? scholarPaper.citingPaper.url) as string;
            }

            // Get paper ID (doi, pmid, or pmcid)
            let doi = "";
            let pmid = "";
            let pmcid = "";
            if (scholarPaper.citingPaper.externalIds !== undefined) {
                for (const [key, value] of Object.entries(
                    scholarPaper.citingPaper.externalIds
                )) {
                    switch (key) {
                        case "DOI":
                            doi = String(value);
                            break;
                        case "PubMed":
                            pmid = String(value);
                            break;
                        case "PubMedCentral":
                            pmcid = String(value);
                            break;
                    }
                }
                doi = doi.toLowerCase();
                pmid = pmid.toLowerCase();
                pmcid = pmcid.toLowerCase();
            }
            
            // Get fields
            const fields: string[] = [];
            if (scholarPaper.citingPaper.s2FieldsOfStudy !== undefined) {
                for (const field of scholarPaper.citingPaper.s2FieldsOfStudy) {
                    fields.push(field.category);
                }
            }

            // Get authors
            const authors: Author[] = [];
            if (scholarPaper.authors !== undefined) {
                for (const author of scholarPaper.authors) {
                    authors.push(new Author(author.name, ""));
                }
            }

            // Add the paper data to the results
            const paper = new Paper(
                title,
                doi,
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
            output.push(paper);
        };
        
        return output;
    } catch (error) {
        LogMessage(
            "Error while searching Semantic Scholar paper " + paperID + ":\n" + (error.message as string),
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
 * @returns An array of [Semantic Scholar paper IDs](https://api.semanticscholar.org/api-docs/graph#tag/Paper-Data/operation/get_graph_get_paper) for the given piece of software.
 */
export async function getReferencePapers(
    authors: Author[],
    title: string
): Promise<string[]> {
    // Prepare API strings
    const apiURL = "https://api.semanticscholar.org/graph/v1/author/";
    const query = "search?query=";
    const filter =
        "&fields=papers.title,papers.citationCount,papers.venue&limit=1";

    // Find the papers of every author that mentions the software in the title
    const papersPerAuthor: Map<Author, any[]> = new Map();
    for (const author of authors) {
        let papers: any[] = [];

        try {
            // Query first author on Semantic Scholar with the author's name
            // https://api.semanticscholar.org/api-docs/graph#tag/Author-Data/operation/get_graph_get_author_papers
            const response = await fetch(
                apiURL + query + author.name + filter,
                {
                    method: "GET",
                    headers: {},
                }
            );
            const outputJSON = await response.json();
            const semanticScholarAuthor = outputJSON.data[0];

            // If no Semantic Scholar author was found, skip this author
            if (semanticScholarAuthor === undefined) continue;

            for (const [key, value] of Object.entries(semanticScholarAuthor)) {
                if (key === "papers") {
                    papers = papers.concat(value);
                }
            }
        } catch (error) {
            const errorMessage =
                "Error while searching for author " +
                author.name +
                " on Semantic Scholar:\n" +
                (error.essage as string);
            LogMessage(errorMessage, ErrorLevel.err);
        }

        // Add all works from author that include the title of the given paper
        const papersFiltered: any[] = [];
        for (const p of papers) {
            const paperTitle = p.title === undefined || p.title === null ? "" : (p.title as string);
            if (paperTitle.toLowerCase().includes(title.toLowerCase())) {
                papersFiltered.push(p);
            }
        }

        // Add to papersPerAuthor dictionary
        papersPerAuthor.set(author, papersFiltered);
    }

    // Find all the unique papers, and keep count of how many authors it shares
    const uniquePapers: Map<string, MetaDataPaper> = new Map();
    for (const papers of papersPerAuthor.values()) {
        for (const paper of papers.values()) {
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
                        paper.venue
                    )
                );
            }
        }
    }

    // Return the papers that are probably reference papers
    const probability = 0.6;
    return selectReferencePapers(title, uniquePapers, probability);
}

/**
 * Finds the [Semantic Scholar paper ID](https://api.semanticscholar.org/api-docs/graph#tag/Paper-Data/operation/get_graph_get_paper) of a paper.
 * 
 * @param title The title of the paper.
 *
 * @returns The [Semantic Scholar paper ID](https://api.semanticscholar.org/api-docs/graph#tag/Paper-Data/operation/get_graph_get_paper) of a paper.
 */
export async function getSemanticScholarPaperID(
    title: string
): Promise<string | undefined> {
    // Query strings for searching the paper
    const semanticScholarApiURL =
        "https://api.semanticscholar.org/graph/v1/paper/";
    const searchQuery = "search?query=";
    
    try {
        // API call for searching paper with the title
        const response = await fetch(
            semanticScholarApiURL + searchQuery + '"' + title + '"',
            {
                method: "GET",
                headers: {},
            }
        );
        const outputJSON = await response.json();

        // Get and return the paper ID
        if (outputJSON.data[0].paperId === undefined) {
            throw new Error("No result");
        }
        return outputJSON.data[0].paperId;
    } catch (error) {
        LogMessage(
            "Error while fetching paper ID of " + title + " on Semantic Scholar:\n" + (error.message as string),
            ErrorLevel.err
        );
        
        return undefined;
    }
}
