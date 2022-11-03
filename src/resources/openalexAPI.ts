import fetch from "node-fetch";
import { Journal } from "./journal";

export async function openAlexCitations(title: string): Promise<Journal[]> {
    const apiURL = "https://api.openalex.org/";
    const query = "works?filter=cites:";
    const filter = ",type:journal-article";
    let output: Journal[] = [];
    // get paper id
    let paperId = await getOpenAlexPaperId(title);
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
            console.log(apiURL + query + paperId + filter + "&page=" + String(i) + "&per-page=200");
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
            let DOI = ""; let mag = ""; let pmid = ""; let pmcid = "";
            if (element.ids !== undefined) {
                for (const [key, value] of Object.entries(element.ids)) {
                    switch (key) {
                        case ("doi"):
                            DOI = String(value);
                            break;
                        case ("mag"):
                            mag = String(value);
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
                const tempJournal = new Journal(title, DOI, mag, pmid, pmcid, year, "OpenAlex");
                output = output.concat([tempJournal]);
            }
            else {
                const tempJournal = new Journal(title, DOI, mag, pmid, pmcid, year, "OpenAlex");
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

async function getOpenAlexPaperId(title: string): Promise<string> {
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