import { setOutput } from "@actions/core";
import { exec, ExecOptions } from "@actions/exec";
import { ReturnObject } from "../../src/getdata";
import { CffObject, getError, IncorrectYamlCffObject, MissingCffObject, ValidationErrorCffObject, ValidCffObject } from "../../src/resources/citation_cff";
import { deleteDuplicates, runCitingPapers } from "../../src/resources/citingPapers";
import { Author, Journal } from "../../src/resources/journal";
import { openAlexCitations } from "../../src/resources/openalexAPI";
import { semanticScholarCitations } from "../../src/resources/semanticscholarAPI";
import YAML from "yaml";
import * as fs from "fs";
import * as path_ from "path";
import { Console } from "console";

jest.setTimeout(60000);
test("Check if semanticScholarCitations is correctly used", runCitingPapersIntegration);

async function runCitingPapersIntegration(): Promise<void>{
    
    const cffResult = await getCitationFile("./");
    const cffFile = cffResult.ReturnData as ValidCffObject
    
    const authors: Author[] = [];
    const title: string = cffFile.citation.title;
    const refTitles: string[] = [];
    if (cffFile.citation.references !== undefined) {
        cffFile.citation.references.forEach((element: any) => {
            if (element.type === "article")
                refTitles.push(element.title);
        });
    }
    cffFile.citation.authors.forEach((element: any) => {
        let familyName = "";
        let givenNames = "";
        let orchidId = "";
        for (const [key, value] of Object.entries(element)) {
            switch (key) {
                case ("family-names"):
                    familyName = String(value);
                    break;
                case ("given-names"):
                    givenNames = String(value);
                    break;
                case ("orcid"):
                    orchidId = String(value);
                    break;
            }
        }
        authors.push(new Author(givenNames, familyName, orchidId));
    });

    let output: Journal[] 

    await semanticScholarCitations(authors, title, refTitles).then(async (outData1) => {
        await openAlexCitations(authors, title, refTitles).then(async (outData2) => {
            output = deleteDuplicates(outData1, outData2);
            await runCitingPapers(cffFile).then((outDataReal) => {
                expect(output).toMatchObject(outDataReal.ReturnData);    
            })
            
        })
    }
    )
    
}

export async function getCitationFile(path?: string): Promise<ReturnObject> {
    let file: Buffer;

    // Use current directory if none is specified
    const filePath = path === undefined ? "." : path;
    // Read the citation.cff file
    try {
        file = fs.readFileSync(filePath + "/CITATION.cff");
    } catch {
        // Reading file failed
        console.log("WARNING: No citation.cff file found");

        // Return MissingCFFObject indicating missing citation.cff file
        const returnData: MissingCffObject = { status: "missing_file" };
        return {
            ReturnName: "Citation",
            ReturnData: returnData,
        };
    }

    let result: any;

    // Parse the citation.cff file (YAML format)
    try {
        result = YAML.parse(file.toString());
    } catch {
        // Parsing failed, incorrect YAML
        console.log("WARNING: Incorrect format");

        // Return IncorrectYamlCFFObject to indicate incorrect yaml
        const returnData: IncorrectYamlCffObject = { status: "incorrect_yaml" };
        return {
            ReturnName: "Citation",
            ReturnData: returnData,
        };
    }

    const cmd = "docker";
    const absPath = path_.resolve(filePath);
    const args = [
        "run",
        "--rm",
        "-v",
        absPath + ":/app",
        "citationcff/cffconvert",
        "--validate",
    ];

    let stdout = "";
    let stderr = "";

    const options: ExecOptions = {
        ignoreReturnCode: true,
    };
    options.listeners = {
        stdout: (data: Buffer) => {
            stdout += data.toString();
        },
        stderr: (data: Buffer) => {
            stderr += data.toString();
        },
    };
    // Run cffconvert in docker to validate the citation.cff file
    const exitCode = await exec(cmd, args, options);

    // Check the exit code for success
    if (exitCode === 0) {
        // Citation.cff file is valid, return ValidCFFObject with data and validation message
        const returnData: ValidCffObject = {
            status: "valid",
            citation: result,
            validation_message: stdout,
        };
        return {
            ReturnName: "Citation",
            ReturnData: returnData,
        };
    } else {
        // Citation.cff file is invalid, return ValidationErrorCFFObject with data and error message
        const returnData: ValidationErrorCffObject = {
            status: "validation_error",
            citation: result,
            validation_message: getError(stderr),
        };
        return {
            ReturnName: "Citation",
            ReturnData: returnData,
        };
    }
}