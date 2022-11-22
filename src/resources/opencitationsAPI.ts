import { count } from "console";
import fetch from "node-fetch";
import { ReturnObject } from "../getdata";
import { Journal } from "./journal";

// Test OpenCitations API, returns citations for example paper
export async function testOpenCitations(){
    const url = "https://opencitations.net/index/coci/api/v1/citations/10.1186/1756-8722-6-59"
    const response = await fetch(url,{ 
        method: 'GET',
        headers: {
            "authorization": "b1349a8c-17f7-4b36-8695-b808b0efc9fc "
        },
    });
    const outputText = await response.text()
    //console.log(outputText)
    const outputJSON = JSON.parse(outputText)
    console.log(outputJSON)
}

testOpenCitations();


export async function getPaperDOI(){

}