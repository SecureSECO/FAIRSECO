import fetch from "node-fetch";

export async function openAlexCitations(title: string): Promise<JSON> {
    const apiURL = "https://api.openalex.org/";
    const query = "works?filter=cites:";
    const filter = ",type:journal-article";
    // get paper id
    const paperId = await getOpenAlexPaperId(title);
    const paperIdSliced = paperId.replace("https://openalex.org/", "");
    try {
        // get meta data for amount of results
        let outputText = "";
        const firstResponse = await fetch(apiURL + query + paperIdSliced + filter + "&per-page=1", {
            method: 'GET',
            headers: {},
        });
        const firstResponseText = await firstResponse.text();
        const firstResponseJSON = JSON.parse(firstResponseText);
        const amount = firstResponseJSON.meta.count;
        const pages = Math.ceil(amount / 200);
        for (let i = 1; i <= pages; i++) {
            const response = await fetch(apiURL + query + paperIdSliced + filter + "&per-page=200", {
                method: 'GET',
                headers: {},
            });
            const responseText = await response.text();
            const responseJSON = JSON.parse(responseText);
            outputText += JSON.stringify(responseJSON.results).slice(1,-1) + ",";

        }
        outputText = "[" + outputText.slice(0, -1) + "]";
        return JSON.parse(outputText);
    }
    catch (error){
        console.log("error while searching openAlex with openAlex ID of: " + title);
        return JSON.parse("");
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