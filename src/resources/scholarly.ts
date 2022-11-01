import { ReturnObject } from "../getdata";
import { semanticScholarCitations } from "../semanticscholarAPI";
import { openAlexCitations } from "../openalexAPI";

export async function runScholarly(title: string): Promise<ReturnObject> {
    const outData1 = await semanticScholarCitations(title);
    const outData2 = await openAlexCitations(title);
    const objString = JSON.stringify(outData1);
    const obj1 = JSON.parse(objString);
    const objString2 = JSON.stringify(outData2);
    const obj2 = JSON.parse(objString2);
    let uniques: string[] = [];
    obj1.forEach((e1: { title: string; }) => {
        let duplicate = false;
        obj2.forEach((e2: { title: string; }) => {
            if (e1.title === e2.title) {
                duplicate = true;
            }
        });
        if (!duplicate) {
            uniques = uniques.concat([e1.title]);
        }
    });
    obj2.forEach((element: { title: string; }) => {
        uniques = uniques.concat([element.title]);
    });

    console.log(uniques);
    console.log("-------------------------------------------------------");
    console.log(uniques.length);
    
    return {
        ReturnName: "Scholarly",
        ReturnData: outData2,
    };
} 




