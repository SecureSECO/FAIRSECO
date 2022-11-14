import fetch from "node-fetch";
import { Author, Journal } from "./journal";

export async function semanticScholarCitations(authors: Author[], title: string): Promise<Journal[]> {
    const semanticScholarApiURL = "https://api.semanticscholar.org/graph/v1/paper/";
    const fieldsQuery = "/citations?fields=title,externalIds,year&limit=1000";
    // get paper id
    const paperId = await getSemanticScholarPaperId(title);
    let output: Journal[] = [];
    try {
        const response = await fetch(semanticScholarApiURL + paperId + fieldsQuery, {
            method: 'GET',
            headers: {},
        });
        const outputText = await response.text();
        const outputJSON = JSON.parse(outputText);
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