import fetch from "node-fetch";
import { Author, Journal, MetaDataJournal } from "./journal";
import { calculateProbabiltyOfReference } from "./probability";
/**
 * 
 * @returns array containing the list of papers citing the giving piece of research software.
 */
export async function openAlexCitations(authors: Author[], title: string, firstRefTitles: string[]): Promise<Journal[]> {
    // find reference titles
    let refTitles: string[] = await getRefTitles(authors, title);
    refTitles = firstRefTitles.concat(refTitles);
    // prepare query strings
    const apiURL = "https://api.openalex.org/";
    const query = "works?filter=cites:";
    const filter = ",type:journal-article";
    // get the unique id OpenAlex gives it's papers
    let paperId = refTitles[0];
    paperId = paperId.replace("https://openalex.org/", "");
    // instanciate output array
    let output: Journal[] = [];
    try {
        // API call and save output in Json object
        const firstResponse : any = await fetch(apiURL + query + paperId + filter + "&per-page=1", {
            method: 'GET',
            headers: {},
        });
        const firstResponseJSON = await firstResponse.json();
        const amount = firstResponseJSON.meta.count;
        const pages = Math.ceil(amount / 200);
        let outputText = "";
        for (let i = 1; i <= pages; i++) {
            const response = await fetch(apiURL + query + paperId + filter + "&page=" + String(i) + "&per-page=200", {
                method: 'GET',
                headers: {},
            });
            const responseText = await response.text();
            const responseJSON = JSON.parse(responseText);
            outputText += JSON.stringify(responseJSON.results).slice(1,-1) + ",";
        }
        outputText = "[" + outputText.slice(0, -1) + "]";
        const outputJSON = JSON.parse(outputText);
        // save outputted metadata in Journal object and append to output array
        outputJSON.forEach((element: any) => {
            let title = ""; let year = 0; let DOI = ""; let pmid = ""; let pmcid = "";
            if (element.title !== undefined && element.publication_year !== undefined) {
                if (element.ids !== undefined && element.title !== undefined && element.publication_year !== undefined) {
                    title = element.title;
                    year = element.publication_year;
                    for (const [key, value] of Object.entries(element.ids)) {
                        switch (key) {
                            case ("doi"):
                                DOI = String(value);
                                break;
                            case ("pmid"):
                                pmid = String(value);
                                break;
                            case ("pmcid"):
                                pmcid = String(value);
                                break;
                        }
                    }            
                    DOI = DOI.slice(16);
                    pmid = pmid.slice(32);
                    pmcid = pmcid.slice(32);
                    const tempJournal = new Journal(title, DOI, pmid, pmcid, year, "OpenAlex", []);
                    output = output.concat([tempJournal]);
                }
                else {
                    const tempJournal = new Journal(title, DOI, pmid, pmcid, year, "OpenAlex", []);
                    output = output.concat([tempJournal]);
                }
            }
        });
        return output;
    }
    catch (error){
        console.log("error while searching openAlex with openAlex ID of: " + paperId);
        return output;
    }      
}

/**
 * 
 * @returns and array of titles that are probably reference papers for the piece of software
 */
export async function getRefTitles(authors: Author[], title: string): Promise<string[]> {
    // instanciate output array and maps
    const output: string[] = [];
    const papersPerAuthor: Map<Author, any[]> = new Map();
    const uniquePapers: Map<string, MetaDataJournal> = new Map();
    // prepare API strings
    const apiURL = "https://api.openalex.org/";
    const query = "authors?filter=display_name.search:";
    // find of every author their papers with the title of the software mentioned in the paper
    for (const author of authors) {
        let papers: any[] = [];
        let papersFiltered: any[] = [];
        try {
            const response = await fetch(apiURL + query + author.givenNames + "+" + author.familyName + "&per-page=200", {
                method: 'GET',
                headers: {},
            });
            const outputJSON = await response.json();
            const results = outputJSON.results[0];
            const amount = results.works_count;
            const pages = Math.ceil(amount / 200);
            const worksApiURL: string = results.works_api_url;
            for (let i = 1; i <= pages; i++) {
                const response = await fetch(worksApiURL + "&page=" + String(i) + "&per-page=200", {
                    method: 'GET',
                    headers: {},
                });
                const responseJSON = await response.json();
                papers = papers.concat(responseJSON.results);
            }
        }
        catch (error){
            let errorMessage = "Error while searching for author " + author.givenNames + " " + author.familyName + " on semantics scholar"
            if(error instanceof Error){
                errorMessage = error.message;
            }
            console.log(errorMessage)
        } 
        papers.forEach((element: any) => {
            if (element.title !== null) {
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                if (element.title.toLowerCase().includes(title.toLowerCase()))
                    papersFiltered = papersFiltered.concat([element]);
            }
        });
        papersPerAuthor.set(author, papersFiltered);
    }
    // find all the unique papers, and keep count of how many authors it shares
    papersPerAuthor.forEach(papers => {
        papers.forEach(paper => {
            let paperData: MetaDataJournal;
            if (uniquePapers.has(paper.id)) {
                paperData = uniquePapers.get(paper.id) as MetaDataJournal;
                paperData.contributors = paperData.contributors + 1;
                uniquePapers.set(paper.paperId, paperData);
            }
            else {
                uniquePapers.set(paper.id, new MetaDataJournal(paper.title, 1, paper.cited_by_count, paper.host_venue, 1));
            }
        });
    });
    // calculate the probability of each paper being a reference paper
    const probScores: number[] = calculateProbabiltyOfReference(uniquePapers);
    let i = 0;
    uniquePapers.forEach((value, key) => {
        if (probScores[i] > 0.6)
            output.push(key);
        i++;
    });
    return output;
}

/**
 * 
 * @returns the unqiue id of a paper from OpenAlex
 */
export async function getOpenAlexPaperId(title: string): Promise<string> {
    const apiURL = "https://api.openalex.org/";
    const searchQuery = "works?search=";
    try {
        const response = await fetch(apiURL + searchQuery + title , {
            method: 'GET',
            headers: {},
        });
        const output = await response.text();
        const outputJSON = JSON.parse(output);
        const paperid = outputJSON.results[0].id;;
        return paperid;
    }
    catch (error){
        console.log("Error while fetching paperID from openAlex of: " + title);
        const output = JSON.parse("");
        return output;
    } 
}