import fetch from "node-fetch";
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