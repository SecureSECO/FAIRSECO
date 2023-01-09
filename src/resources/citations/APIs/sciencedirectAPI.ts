import { count } from "console";
import fetch from "node-fetch";
import { ReturnObject } from "../../../getdata";
import { Paper } from "../Paper";

// Test ScienceDirect API, returns citation count for example paper
export async function testScienceDirectAPI() {
    const ApiUrl = "https://api.elsevier.com/content/metadata/article?";
    const query = "query=aff%28broad%20institute%29";
    const ApiKey = "&httpAccept=application/json";
    const url = ApiUrl + query + ApiKey;
    const example_url =
        "http://api.elsevier.com/content/article/entitlement/pii/S0049-3848(14)00284-9?apiKey=c8a02614d04aab7322509a54e49880a2";
    const scopuscitedby_url =
        "http://api.elsevier.com/content/search/scopus?query=DOI(10.1016/j.stem.2011.10.002)"; //&field=citedby-count
    const scopus_citation_overview =
        "https://api.elsevier.com/content/abstract/citations?doi=10.1186/1471-2105-12-332&apiKey=7f59af901d2d86f78a1fd60c1bf9426a&httpAccept=application%2Fjson"; //"https://api.elsevier.com/content/abstract/citations?doi=10.1016/S0014-5793(01)03313-0"//"https://dev.elsevier.com/documentation/AbstractCitationAPI.wadl#d1e25"
    const citations_url =
        "https://api.elsevier.com/content/search/scopus?query=refeid(' + str(article['eid']) + ')'";
    const response = await fetch(scopuscitedby_url, {
        method: "GET",
        headers: {
            "X-ELS-APIKey": "c8a02614d04aab7322509a54e49880a2",
        },
    });
    const outputText = await response.text();
    //console.log(outputText)
    const outputJSON = JSON.parse(outputText);
    //console.log(outputJSON)
    // const citations = outputJSON["abstract-citations-response"].citeInfoMatrix.citeInfoMatrixXML.citationMatrix.citeInfo
    // console.log(citations)
    const entry = outputJSON["search-results"].entry;
    console.log(entry);
    // entry.forEach((element:any) => {
    //     const citationCount = element['citedby-count']
    //     console.log(citationCount)
    // });
    //console.log(outputJSON.data)
}

testScienceDirectAPI();

// export async function sciencedirectCitations(title:string): Promise<Journal[]>{

// }
