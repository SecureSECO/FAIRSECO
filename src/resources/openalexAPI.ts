import fetch from "node-fetch";
<<<<<<< HEAD
import { Author, Paper, MetaDataPaper } from "./Paper";
import { ErrorLevel, LogMessage } from "../log";
import { calculateProbabiltyOfReference } from "./probability";
/**
 *
 * @returns array containing the list of papers citing the giving piece of research software.
 */
export async function openAlexCitations(
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
            paperIds.push(await getOpenAlexPaperId(title));
    for (const paperId of paperIds)
        output = output.concat(await getCitationPapers(paperId));
    return output;
}

/**
 *
 * @returns array containing the list of papers citing the giving paperId.
 */
export async function getCitationPapers(paperId: string): Promise<Paper[]> {
    paperId = paperId.replace("https://openalex.org/", "");
    // prepare query strings
    const apiURL = "https://api.openalex.org/";
    const query = "works?filter=cites:";
    const filter = ",type:journal-article";
    // get the unique id OpenAlex gives it's papers
    // instanciate output array
    let output: Paper[] = [];
    try {
        // API call and save output in Json object
        const firstResponse: any = await fetch(
            apiURL + query + paperId + filter + "&per-page=1",
            {
                method: "GET",
                headers: {},
            }
        );
        const firstResponseJSON = await firstResponse.json();
        const amount = firstResponseJSON.meta.count;
        const pages = Math.ceil(amount / 200);
        let outputText = "";
        for (let i = 1; i <= pages; i++) {
            const response = await fetch(
                apiURL +
                    query +
                    paperId +
                    filter +
                    "&page=" +
                    String(i) +
                    "&per-page=200",
                {
                    method: "GET",
                    headers: {},
                }
            );
            const responseText = await response.text();
            const responseJSON = JSON.parse(responseText);
            outputText +=
                JSON.stringify(responseJSON.results).slice(1, -1) + ",";
        }
        outputText = "[" + outputText.slice(0, -1) + "]";
        const outputJSON = JSON.parse(outputText);
        // save outputted metadata in Paper object and append to output array
        outputJSON.forEach((element: any) => {
            let title = "";
            let year = 0;
            let DOI = "";
            let pmid = "";
            let pmcid = "";
            const authors: Author[] = [];
            const fields: string[] = [];
            let journal = "";
            let url = "";
            let numberOfCitations = 0;
            if (
                element.title !== undefined &&
                element.publication_year !== undefined
            ) {
                if (element.ids !== undefined) {
                    title = element.title;
                    year = element.publication_year;
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
                }
                if (element.host_venue.publisher !== undefined) {
                    journal = element.host_venue.publisher;
                }
                if (element.cited_by_count !== undefined) {
                    numberOfCitations = element.cited_by_count;
                }
                if (element.concepts !== undefined) {
                    element.concepts.forEach((concept: any) => {
                        if (concept.level === 0 && concept.score > 0.2)
                            fields.push(concept.display_name);
                    });
                }
                if (element.authorships !== undefined) {
                    element.authorships.forEach((element: any) => {
                        authors.push(
                            new Author(
                                element.author.display_name,
                                element.author.orcid ?? ""
                            )
                        );
                    });
                }
                if (element.open_access !== undefined) {
                    if (element.open_access.oa_status === "closed")
                        url = element.id;
                    else url = element.open_access.oa_url;
                }
                const tempPaper = new Paper(
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
                output = output.concat([tempPaper]);
            }
        });
        // console.log("Getting citations took " + (performance.now() - endtime) + " ms")
        return output;
    } catch (error) {
        LogMessage(
            "Error while searching OpenAlex with OpenAlex paper ID of: " +
                paperId,
            ErrorLevel.err
        );
        return output;
    }
}

/**
 *
 * @returns and array of titles that are probably reference papers for the piece of software
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
    const apiURL = "https://api.openalex.org/";
    const query = "authors?filter=display_name.search:";
    // find of every author their papers with the title of the software mentioned in the paper
    for (const author of authors) {
        let papers: any[] = [];
        let papersFiltered: any[] = [];
        try {
            const response = await fetch(
                apiURL + query + author.name + "&per-page=200",
                {
                    method: "GET",
                    headers: {},
                }
            );
            const outputJSON = await response.json();
            const results = outputJSON.results[0];
            if (results === undefined) {
                // console.log("no results for author " + author.givenNames + " " + author.familyName)
                continue;
            }
            const worksApiURL: string = results.works_api_url;
            let nextCursor = "*";
            while (nextCursor !== null) {
                const response = await fetch(
                    worksApiURL + "&per-page=200&cursor=" + nextCursor,
                    {
                        method: "GET",
                        headers: {},
                    }
                );
                const responseJSON = await response.json();
                papers = papers.concat(responseJSON.results);
                nextCursor = responseJSON.meta.next_cursor;
            }
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
            if (element.title !== null) {
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                if (element.title.toLowerCase().includes(title.toLowerCase()))
                    papersFiltered = papersFiltered.concat([element]);
            }
        });
        papersPerAuthor.set(author, papersFiltered);
    }
    // find all the unique papers, and keep count of how many authors it shares
    papersPerAuthor.forEach((papers) => {
        papers.forEach((paper) => {
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
 *
 * @returns the unqiue id of a paper from OpenAlex
 */
=======
import { Author, Journal, MetaDataJournal } from "./journal";
import { calculateProbabiltyOfReference } from "./probability";

export async function openAlexCitations(authors: Author[], title: string, refTitles: string[]): Promise<Journal[]> {
    //title = title.toLowerCase();
    // if(refTitle=== ""){
    //     refTitle = await getTitle(authors, title);
    // }
    const extraRefTitles: string[] = await getRefTitles(authors, title);
    refTitles.concat(extraRefTitles);
    const apiURL = "https://api.openalex.org/";
    const query = "works?filter=cites:";
    const filter = ",type:journal-article";
    let output: Journal[] = [];
    // get paper id
    let paperId = await getOpenAlexPaperId(refTitles[0]);
    paperId = paperId.replace("https://openalex.org/", "");
    try {
        // get meta data for amount of results
        let outputText = "";
        const firstResponse = await fetch(apiURL + query + paperId + filter + "&per-page=1", {
            method: 'GET',
            headers: {},
        });
        const firstResponseText = await firstResponse.text();
        const firstResponseJSON = JSON.parse(firstResponseText);
        const amount = firstResponseJSON.meta.count;
        const pages = Math.ceil(amount / 200);
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
        outputJSON.forEach((element: any) => {
            const title = element.title;
            const year = element.publication_year;
            let DOI = ""; let pmid = ""; let pmcid = "";
            if (element.ids !== undefined) {
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
        });
         return output;
    }
    catch (error){
        console.log("error while searching openAlex with openAlex ID of: " + title);
        return output;
    }      
}

export async function getRefTitles(authors: Author[], title: string): Promise<string[]>{
    const apiURL = "https://api.openalex.org/";
    const query = "authors?filter=orcid:";
    const output: string[] = [];
    // Beter orcid-id or Author?
    const papersPerAuthor: Map<Author, any[]> = new Map();
        for( const author of authors) {            
            const orcid = author.orchidId;
            let titles: string[] = [];
            //const query = "works?filter=title.search:" + title + "authorships.author.orcidid:" + orcid
            try{
            const response = await fetch(apiURL + query + orcid, {
                method: 'GET',
                headers: {},
            });
            const responseText = await response.text();
            const responseJSON = JSON.parse(responseText);
           // console.log(responseJSON.results[0].works_api_url);
           const results = responseJSON.results[0];
            let authorworks_url = "";
            if(results.hasOwnProperty("works_api_url")){
                authorworks_url = results.works_api_url;
                //console.log("-----------\nAuthor with id: " + author.orchidId + " has url: "+ authorworks_url);
                const response2 = await fetch(authorworks_url, {
                    method: 'GET',
                    headers: {},
                });
                const responseText2 = await response2.text();
                const responseJSON2 = JSON.parse(responseText2);
                //console.log(responseJSON2);
                const authorTitles = responseJSON2.results
                    .filter(function(o:any){return o.title.toLowerCase().includes(title.toLowerCase())})    
                    //.map(function(o:any){return o.title.toLowerCase()});
                //console.log(titles)
                titles.push(authorTitles);
                //titles = titles.flat(1);
                //papersPerAuthor.set(author.orchidId,titles)
                papersPerAuthor.set(author,titles)
            }
            else{
                console.log("Author with id: " + author.orchidId + " has no works-url")
            }
            }
            catch{}
        };
        const uniquePapers: Map<string, MetaDataJournal> = new Map();
        papersPerAuthor.forEach(papers => {
            papers.forEach(paper => {
                paper = paper[0]
                let paperData: MetaDataJournal;
                //console.log(paper.id)
                if (uniquePapers.has(paper.id)) {
                    paperData = uniquePapers.get(paper.id) as MetaDataJournal;
                    paperData.contributors = paperData.contributors + 1;
                    uniquePapers.set(paper.id, paperData);
                }
                else {
                    uniquePapers.set(paper.id, new MetaDataJournal(paper.title, 1, paper.cited_by_count, paper.host_venue.publisher, 1));
                }
            });
        });
        //console.log(uniquePapers)
        const probScores: number[] = calculateProbabiltyOfReference(uniquePapers);
        let i = 0;
        uniquePapers.forEach((value, key) => {
            if (probScores[i] > 0.6)
                output.push(key);
            i++;
        })
        return output;
        // titles = titles.flat(1);
        // console.log(titles);
        // titles = titles.filter((item, index) => titles.indexOf(item) === index);
        // console.log(titles);
        // return [""];
}

>>>>>>> Integration-Testing
export async function getOpenAlexPaperId(title: string): Promise<string> {
    const apiURL = "https://api.openalex.org/";
    const searchQuery = "works?search=";
    try {
<<<<<<< HEAD
        const response = await fetch(apiURL + searchQuery + title, {
            method: "GET",
=======
        const response = await fetch(apiURL + searchQuery + title , {
            method: 'GET',
>>>>>>> Integration-Testing
            headers: {},
        });
        const output = await response.text();
        const outputJSON = JSON.parse(output);
<<<<<<< HEAD
        const paperid = outputJSON.results[0].id;
        return paperid;
    } catch (error) {
        LogMessage(
            "Error while fetching paperID from OpenAlex of: " + title,
            ErrorLevel.err
        );
        const output = JSON.parse("");
        return output;
    }
}
=======
        const paperid = outputJSON.results[0].id;;
        return paperid;
    }
    catch (error){
        console.log("Error while fetching paperID from openAlex of: " + title);
        const output = JSON.parse("");
        return output;
    } 
}
>>>>>>> Integration-Testing
