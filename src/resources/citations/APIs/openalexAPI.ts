/**
 * This module contains functions for finding papers that cite a piece of research software, making use of OpenAlex.
 * 
 * The main function to be used by other modules is {@link openAlexCitations}.
 * 
 * @module
 */

import fetch from "node-fetch";
import { Author, Paper, MetaDataPaper } from "../paper";
import { ErrorLevel, LogMessage } from "../../../errorhandling/log";
import { selectReferencePapers } from "../referencepaper";

/**
 * Finds papers citing the given piece of research software using OpenAlex.
 * 
 * @param authors An array containing the authors of the software.
 * @param title The title of the software.
 * @param firstRefTitles Titles of known papers of the software.
 * 
 * @returns An array containing the list of papers citing the given piece of software.
 */
export async function openAlexCitations(
    authors: Author[],
    title: string,
    firstRefTitles: string[]
): Promise<Paper[]> {
    // Find the OpenAlex paper IDs of the input
    let paperIds: string[] = [];
    if (firstRefTitles.length === 0) {
        // No reference titles given: find reference titles and their paper IDs
        paperIds = await getReferencePapers(authors, title);
    } else {
        // Reference titles given: get their paper IDs
        for (const title of firstRefTitles) {
            const id = await getOpenAlexPaperId(title);
            if (id !== undefined) {
                paperIds.push(id);
            }
        }
    }

    // Find papers citing the given papers
    let output: Paper[] = [];
    for (const paperId of paperIds) {
        output = output.concat(await getCitationPapers(paperId));
    }

    return output;
}

/**
 * Finds papers citing a given paper.
 * 
 * @param paperID The [OpenAlex ID](https://docs.openalex.org/api-entities/works/work-object#id) corresponding to the paper.
 * 
 * @returns An array of papers citing the given paper.
 */
export async function getCitationPapers(paperID: string): Promise<Paper[]> {
    paperID = paperID.replace("https://openalex.org/", "");
    
    // Prepare query strings: query journals/articles that cite the paper with the given ID
    // Query returns works: https://docs.openalex.org/api-entities/works/work-object
    const apiURL = "https://api.openalex.org/";
    const query = "works";
    const filter = "?filter=cites:" + paperID + ",type:journal-article";

    // Get the works that cite this paper
    const output: Paper[] = [];
    try {
        // Get the results
        let outputJSON: any[] = [];
        let pageCursor = "*";
        while (pageCursor !== null && pageCursor !== undefined) {
            // Request a page
            const response = await fetch(
                apiURL +
                query +
                filter +
                "&per-page=200&cursor=" + pageCursor,
                {
                    method: "GET",
                    headers: {},
                }
            );
            const responseJSON = await response.json();

            // Add the page results
            if (responseJSON.results !== undefined) {
                outputJSON = outputJSON.concat(responseJSON.results);
            }

            // Get cursor for next page of results
            pageCursor = responseJSON.meta.next_cursor;
        }
        
        // Extract data from the works that cite the paper
        // data is formatted as Paper objects
        for (const element of outputJSON) {
            const title = element.title;
            const year = element.publication_year;
            const journal = element.host_venue.publisher ?? "";
            const numberOfCitations = element.cited_by_count;
            const url = element.open_access.oa_status === "closed" ? element.id : element.open_access.oa_url;

            // Get paper id (doi, pmid, or pmcid)
            let DOI = "";
            let pmid = "";
            let pmcid = "";
            for (const [key, value] of Object.entries(element.ids)) {
                switch (key) {
                    case "doi":
                        DOI = String(value);
                        break;
                    case "pmid":
                        pmid = String(value);
                        break;
                    case "pmcid":
                        pmcid = String(value);
                        break;
                }
            }
            DOI = DOI.slice(16);
            pmid = pmid.slice(32);
            pmcid = pmcid.slice(32);

            // Get fields
            const fields: string[] = [];
            for (const concept of element.concepts) {
                // Add the concept as a field if it's top-level and if it applies strongly enough to this paper
                if (concept.level === 0 && concept.score > 0.2) {
                    fields.push(concept.display_name);
                }
            };

            // Get authors
            const authors: Author[] = [];
            for (const authorship of element.authorships) {
                authors.push(
                    new Author(
                        authorship.author.display_name,
                        authorship.author.orcid ?? ""
                    )
                );
            };

            // Add the data to the results
            const paper = new Paper(
                title,
                DOI,
                pmid,
                pmcid,
                year,
                "OpenAlex",
                [],
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
            "Error while searching OpenAlex with OpenAlex paper " + paperID + ":\n" + (error.message as string),
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
 * @returns An array of [OpenAlex IDs](https://docs.openalex.org/api-entities/works/work-object#id) of reference papers for the given piece of software.
 */
export async function getReferencePapers(
    authors: Author[],
    title: string
): Promise<string[]> {
    // Prepare API strings for querying authors with a name
    const apiURL = "https://api.openalex.org/";
    const query = "authors"
    const filter = "?filter=display_name.search:";

    // Find the papers of every author that mentions the software in the title
    const papersPerAuthor: Map<Author, any[]> = new Map();
    for (const author of authors) {
        let papers: any[] = [];
        
        try {
            // Query first author on OpenAlex with the author's name
            // https://docs.openalex.org/api-entities/authors/author-object
            const response = await fetch(
                apiURL + query + filter + author.name + "&per-page=1",
                {
                    method: "GET",
                    headers: {},
                }
            );
            const outputJSON = await response.json();
            const openAlexAuthor = outputJSON.results[0];
            
            // If no OpenAlex author was found, skip this author
            if (openAlexAuthor === undefined) continue;
            
            // Find all the works of the author
            const worksApiURL: string = openAlexAuthor.works_api_url;
            let pageCursor = "*";
            while (pageCursor !== null && pageCursor !== undefined) {
                // Get page of works
                // https://docs.openalex.org/api-entities/works/work-object
                const response = await fetch(
                    worksApiURL + "&per-page=200&cursor=" + pageCursor,
                    {
                        method: "GET",
                        headers: {},
                    }
                );
                const responseJSON = await response.json();
                if (responseJSON.results !== undefined) {
                    papers = papers.concat(responseJSON.results);
                }

                // Get cursor for next page of results
                pageCursor = responseJSON.meta.next_cursor;
            }
        } catch (error) {
            const errorMessage =
                "Error while searching for author " +
                author.name +
                " on OpenAlex:\n" +
                (error.message as string);
            LogMessage(errorMessage, ErrorLevel.err);
        }
        
        // Add all works from author that include the title of the given paper
        const papersFiltered: any[] = [];
        for (const element of papers){
            if ((element.title as string).toLowerCase().includes(title.toLowerCase())) {
                papersFiltered.push(element);
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
            if (uniquePapers.has(paper.id)) {
                paperData = uniquePapers.get(paper.id) as MetaDataPaper;
                paperData.contributors = paperData.contributors + 1;
                uniquePapers.set(paper.paperId, paperData);
            } else {
                uniquePapers.set(
                    paper.id,
                    new MetaDataPaper(
                        paper.title,
                        1,
                        paper.cited_by_count,
                        paper.host_venue,
                        1
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
 * Finds the [OpenAlex ID](https://docs.openalex.org/api-entities/works/work-object#id) of a paper.
 * 
 * @param title The title of the paper.
 *
 * @returns The [OpenAlex ID](https://docs.openalex.org/api-entities/works/work-object#id) of the paper, or undefined if it could not be found.
 */
export async function getOpenAlexPaperId(title: string): Promise<string | undefined> {
    // Query strings for searching the paper
    const apiURL = "https://api.openalex.org/";
    const searchQuery = "works?search=";

    try {
        // API call for searching paper with the title
        const response = await fetch(apiURL + searchQuery + title + "?per-page=1", {
            method: "GET",
            headers: {},
        });
        const outputJSON = await response.json();

        if (outputJSON.results[0].id === undefined) {
            throw new Error("No result");
        }
        return outputJSON.results[0].id;
    } catch (error) {
        LogMessage(
            "Error while fetching paperID of " + title + " on OpenAlex:\n" + (error.message as string),
            ErrorLevel.err
        );
        
        return undefined;
    }
}