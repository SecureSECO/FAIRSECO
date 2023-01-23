import { runModule as runCff, ValidCffObject } from "../../src/resources/citation_cff";
import {  mergeDuplicates, runModule } from "../../src/resources/citations/citing_papers";
import { Author, Paper, Citations } from "../../src/resources/citations/paper";
import { openAlexCitations } from "../../src/resources/citations/apis/openalex_api";
import { semanticScholarCitations } from "../../src/resources/citations/apis/semanticscholar_api";

jest.setTimeout(100000);

test("Check if all sources of citation are correctly used", runCitingPapersIntegration);

async function runCitingPapersIntegration(): Promise<void>{
    
    const cffFile = await runCff() as ValidCffObject;
    expect(cffFile.status).toBe("valid");
    
    const authors: Author[] = [];
    const title: string = cffFile.citation.title;
    const refTitles: string[] = [];
    if (cffFile.citation.references !== undefined) {
        cffFile.citation.references.forEach((element: any) => {
            if (
                element.type === "article" ||
                element.type === "journal-article"
            )
                refTitles.push(element.title);
        });
    }
    cffFile.citation.authors.forEach((element: any) => {
        let familyName = "";
        let givenNames = "";
        let orchidId = "";
        for (const [key, value] of Object.entries(element)) {
            switch (key) {
                case "family-names":
                    familyName = String(value);
                    break;
                case "given-names":
                    givenNames = String(value);
                    break;
                case "orcid":
                    orchidId = String(value);
                    break;
            }
        }
        authors.push(new Author(givenNames + " " + familyName, orchidId));
    });

    let output1: Paper[] 

    await semanticScholarCitations(authors, title, refTitles).then(async (outData1) => {
        await openAlexCitations(authors, title, refTitles).then(async (outData2) => {
            output1 = mergeDuplicates(outData1, outData2);
            await runModule(cffFile).then((outDataReal) => {
                const output2 = new Citations(output1);
                expect(output2).toMatchObject(outDataReal);    
            })
            
        })
    }
    )
    
}
