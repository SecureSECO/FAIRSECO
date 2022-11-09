import { count } from "console";
import fetch from "node-fetch";
import { ReturnObject } from "../getdata";
import { Journal } from "./journal";

// Test ScienceDirect API, returns citation count for example paper
export async function testScienceDirectAPI(){
    const ApiUrl = "https://api.elsevier.com/content/metadata/article?"
    const query = "query=aff%28broad%20institute%29"
    const ApiKey = "&httpAccept=application/xml&apiKey=c8a02614d04aab7322509a54e49880a2"
    const url = ApiUrl + query + ApiKey
    const example_url = "http://api.elsevier.com/content/article/entitlement/pii/S0049-3848(14)00284-9?apiKey=c8a02614d04aab7322509a54e49880a2"
    const scopuscitedby_url = "http://api.elsevier.com/content/search/scopus?query=DOI(10.1016/j.stem.2011.10.002)&field=citedby-count"
    const response = await fetch(scopuscitedby_url,{
        method: 'GET',
        headers: {
            "X-ELS-APIKey": "c8a02614d04aab7322509a54e49880a2"
        },
    });
    const outputText = await response.text()
    //console.log(outputText)
    const outputJSON = JSON.parse(outputText)
    const entry = outputJSON['search-results'].entry
    entry.forEach((element:any) => {
        const citationCount = element['citedby-count']
        console.log(citationCount)
    });
    //console.log(outputJSON.data)
}

testScienceDirectAPI();

// export async function sciencedirectCitations(title:string): Promise<Journal[]>{

// }