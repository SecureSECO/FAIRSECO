import fetch from "node-fetch";

export async function semanticScholarCitations(title: string): Promise<JSON> {
    const semanticScholarApiURL = "https://api.semanticscholar.org/graph/v1/paper/";
    const fieldsQuery = "?fields=";
    // get paper id
    const paperId = await getSemanticScholarPaperId(title);
    try {
        const response = await fetch(semanticScholarApiURL + paperId + fieldsQuery + "citationCount,citations" , {
            method: 'GET',
            headers: {},
        });
        const output = await response.text();
        const outputJSON = JSON.parse(output);
        return outputJSON.citations;
    }
    catch (error){
        console.log("error while searching semantic scholar with semantic scholar ID of: " + title);
        const output = JSON.parse("");
        return output;
    }      
}

async function getSemanticScholarPaperId(title: string): Promise<string> {
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
        const output = JSON.parse("");
        return output;
    } 
}