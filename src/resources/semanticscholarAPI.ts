import fetch from "node-fetch";
import { Author, Journal, MetaDataJournal } from "./journal";

export async function semanticScholarCitations(authors: Author[], title: string, refTitle: string): Promise<Journal[]> {
    // find reference title
    if (refTitle === "")
        refTitle = await getRefTitle(authors, title);
    refTitle = "Kernel Tuner: A search-optimizing GPU code auto-tuner";
    const semanticScholarApiURL = "https://api.semanticscholar.org/graph/v1/paper/";
    const fieldsQuery = "/citations?fields=title,externalIds,year&limit=1000";
    // get paper id
    const paperId = await getSemanticScholarPaperId(refTitle);
    let output: Journal[] = [];
    try {
        const response = await fetch(semanticScholarApiURL + paperId + fieldsQuery, {
            method: 'GET',
            headers: {},
        });
        const outputJSON = await response.json();
        outputJSON.data.forEach((element: any) => {
            const title = element.citingPaper.title;
            const year = element.citingPaper.year;
            let DOI = ""; let pmid = ""; let pmcid = "";
            if (element.citingPaper.externalIds !== undefined) {
                for (const [key, value] of Object.entries(element.citingPaper.externalIds)) {
                    switch (key) {
                        case ("DOI"):
                            DOI = String(value);
                            break;
                        case ("PubMed"):
                            pmid = String(value);
                            break;
                        case ("PubMedCentral"):
                            pmcid = String(value);
                            break;
                    }
                }
                DOI = DOI.toLowerCase();
                pmid = pmid.toLowerCase();
                pmcid = pmcid.toLowerCase();

                const tempJournal = new Journal(title, DOI, pmid, pmcid, year, "SemanticScholar", []);
                output = output.concat([tempJournal]);
            }
            else {
                const tempJournal = new Journal(title, DOI, pmid, pmcid, year, "SemanticScholar", []);

                output = output.concat([tempJournal]);
            }
        });
        return output;
    }
    catch (error){
        console.log("error while searching semantic scholar with semantic scholar ID of: " + title);
        return output;
    }      
}

export async function getRefTitle(authors: Author[], title: string): Promise<string> {
    const semanticScholarApiURL = "https://api.semanticscholar.org/graph/v1/author/";
    const searchQuery = "search?query=";
    const fieldsQuery = "&fields=papers.title,papers.citationCount,papers.fieldsOfStudy,papers.venue";
    const papersPerAuthor: Map<Author, any[]> = new Map();
    for (const author of authors) {
        let papers: any[] = [];
        let papersFiltered: any[] = [];
        try {
            const response = await fetch(semanticScholarApiURL + searchQuery + author.givenNames + " " + author.familyName + fieldsQuery , {
                method: 'GET',
                headers: {},
            });
            const outputJSON = await response.json();
            outputJSON.data.forEach((element: any) => {
                for (const [key, value] of Object.entries(element)) {
                    if (key === "papers")
                        papers = papers.concat(value);
                }
            });
        }
        catch (error){
            console.log("Error while searching for author " + author.givenNames + " " + author.familyName + " on semantics scholar");
        } 
        papers.forEach((element: any) => {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (element.title.toLowerCase().includes(title.toLowerCase()))
                papersFiltered = papersFiltered.concat([element]);
        });
        papersPerAuthor.set(author, papersFiltered);
    }

    const uniquePapers: Map<string, MetaDataJournal[]> = new Map();
    papersPerAuthor.forEach((papers, author) => {
        papers.forEach(paper => {
            let paperData: MetaDataJournal;
            if (uniquePapers.has(paper.paperId)) {
                paperData = uniquePapers.get(paper.paperId) as number[];
                counts[0] = counts[0] + 1;
                uniquePapers.set(paper.paperId, counts);
            }
            else {
                uniquePapers.set(paper.paperId, [1, paper.citationCount]);
            }
        });
    });
    const probScores: number[] = calculateProbabiltyOfReference(uniquePapers);
    return "";
}

export async function getSemanticScholarPaperId(title: string): Promise<string> {
    const semanticScholarApiURL = "https://api.semanticscholar.org/graph/v1/paper/";
    const searchQuery = "search?query=";
    try {
        const response = await fetch(semanticScholarApiURL + searchQuery + "\"" + title + "\"" , {
            method: 'GET',
            headers: {},
        });
        const output = await response.text();
        const outputJSON = JSON.parse(output);
        const paperid = outputJSON.data[0].paperId;
        return paperid;
    }
    catch (error){
        console.log("Error while fetching paperID from semantic scholar of: " + title);
        const output = "";
        return output;
    } 
}