import { ReturnObject } from "../getdata";
import YAML from "yaml";
import * as path_ from "path";

import * as fs from "fs";
import { exec, ExecOptions } from "@actions/exec";

export type CffObject =
    | MissingCffObject
    | IncorrectYamlCffObject
    | ValidCffObject
    | ValidationErrorCffObject;

export interface MissingCffObject {
    status: "missing_file";
}

export interface IncorrectYamlCffObject {
    status: "incorrect_yaml";
}
export interface ValidCffObject {
    status: "valid";
    citation: any;
    validation_message: string;
}

export interface ValidationErrorCffObject {
    status: "validation_error";
    citation: any;
    validation_message: string;
}

/**
 * Reads a CITATION.cff file.
 * @param path Specifies the path to the directory the CITATION.cff file is in.
 * @returns The data from the CITATION.cff file.
 */
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

export const unknownErrorMsg = "Unknown Error";

/**
 * Finds the error when trying to run cffconvert in docker
 * yields a non-zero exit code indicating failure.
 * @param stderr The stderr output produced by docker.
 * @returns A string showing information about the error.
 */
export function getError(stderr: string): string {
    // An error given by cffconvert appears as a line which looks like *Error: *
    // Find the first line that includes Error: in the first word and return it
    const lines = stderr.split("\n");
    for (const x of lines) {
        const first = x.split(" ")[0];
        if (first?.includes("Error:")) return x;
    }

    // No cffconvert error message was found, so the error is unknown.
    return unknownErrorMsg;
}
