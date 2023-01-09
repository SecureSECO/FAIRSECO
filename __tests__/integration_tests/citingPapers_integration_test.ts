import { setOutput } from "@actions/core";
import { exec, ExecOptions } from "@actions/exec";
import { ReturnObject } from "../../src/getdata";
import { CffObject, getError, IncorrectYamlCffObject, MissingCffObject, ValidationErrorCffObject, ValidCffObject } from "../../src/resources/citation_cff";
import {  mergeDuplicates, runCitingPapers } from "../../src/resources/citations/citingPapers";
import { Author, Paper, Citations } from "../../src/resources/citations/Paper";
import { openAlexCitations } from "../../src/resources/citations/APIs/openalexAPI";
import { semanticScholarCitations } from "../../src/resources/citations/APIs/semanticscholarAPI";
import YAML from "yaml";
import * as fs from "fs";
import * as path_ from "path";
import { Console } from "console";
import { ErrorLevel, LogMessage } from "../../src/errorhandling/log";
import * as dockerExit from "../../src/errorhandling/docker_exit";

jest.setTimeout(100000);

test("Check if all sources of citation are correctly used", runCitingPapersIntegration);

async function runCitingPapersIntegration(): Promise<void>{
    
    const cffResult = await getCitationFile("./");
    const cffFile = cffResult.ReturnData as ValidCffObject
    
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
            await runCitingPapers(cffFile).then((outDataReal) => {
                const output2 = new Citations(output1);
                expect(output2).toMatchObject(outDataReal.ReturnData);    
            })
            
        })
    }
    )
    
}

async function getCitationFile(path?: string): Promise<ReturnObject> {
    let file: Buffer;

    // Use current directory if none is specified
    const filePath = path === undefined ? "." : path;
    // Read the citation.cff file
    try {
        file = fs.readFileSync(filePath + "/CITATION.cff");
    } catch (e) {
        if (e.code === "ENOENT") {
            // File not found, return MissingCFFObject to indicate missing citation.cff file
            const returnData: MissingCffObject = { status: "missing_file" };
            return {
                ReturnName: "Citation",
                ReturnData: returnData,
            };
        } else {
            // Critical error, stop
            throw e;
        }
    }

    let result: any;

    // Parse the citation.cff file (YAML format)
    try {
        result = YAML.parse(file.toString());
    } catch {
        // Parsing failed, incorrect YAML.
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

    // Output from the docker container
    let stdout = "";
    let stderr = "";

    try {
        if (!fs.existsSync("./cffOutputFiles"))
            fs.mkdirSync("./cffOutputFiles/");
        else
            LogMessage(
                "Folder cffOutputFiles already exists!",
                ErrorLevel.info
            );
    } catch {
        LogMessage("Could not create cffOutputFiles folder", ErrorLevel.err);
    }

    const stdOutStream = fs.createWriteStream("./cffOutputFiles/cffOutput.txt");
    const stdErrStream = fs.createWriteStream("./cffOutputFiles/cffError.txt");

    const options: ExecOptions = {
        ignoreReturnCode: true,
        windowsVerbatimArguments: true,
        outStream: stdOutStream,
        errStream: stdErrStream,
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

    // Check the docker exit code for docker specific errors
    dockerExit.throwDockerError(exitCode);

    // Check cffconvert exit code for success
    if (!dockerExit.isError(exitCode)) {
        // Citation.cff file is valid, return ValidCFFObject with data and validation message
        const returnData: ValidCffObject = {
            status: "valid",
            citation: result,
            validation_message: getLastLine(stdout),
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

function getLastLine(input: string): string {
    const lines = input.split("\n");

    return lines[lines.length - 1];
}