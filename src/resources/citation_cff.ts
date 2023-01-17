import * as dockerExit from "../errorhandling/docker_exit";
import YAML from "yaml";
import * as path_ from "path";

import * as fs from "fs";
import { exec, ExecOptions } from "@actions/exec";
import { ErrorLevel, LogMessage } from "../errorhandling/log";

/** The name of the module. */
export const ModuleName = "CitationCff";

/**
 * A CffObject can be one of the following interfaces:
 * 
 * #### MssingCffObject
 * There is no CITATION.cff file present in the root of the repository.
 * 
 * #### IncorrectYamlCffObject
 * The CITATION.cff file is not formatted correctly, i.e. it is not a valid .yml file
 * 
 * #### ValidationErrorCffObject
 * There is a CITATION.cff file that is properly formatted, but the data is incorrect or missing.
 * 
 * #### ValidCffObject
 * The CITATION.cff file is completely valid.
 */
export type CffObject =
    | MissingCffObject
    | IncorrectYamlCffObject
    | ValidCffObject
    | ValidationErrorCffObject;

/** An object showing there is no CITATION.cff file present in the root of the repository. */
export interface MissingCffObject {
    status: "missing_file";
}

/** An object showing that the CITATION.cff file is not formatted correctly, i.e. it is not a valid .yml file */
export interface IncorrectYamlCffObject {
    status: "incorrect_yaml";
}

/** An object containing data of a completely valid CITATION.cff file. */
export interface ValidCffObject {
    status: "valid";
    citation: any;
    validation_message: string;
}

/** An object containing data of a CITATION.cff file that is properly formatted, but the data is incorrect or missing. */
export interface ValidationErrorCffObject {
    status: "validation_error";
    citation: any;
    validation_message: string;
}

/**
 * Reads a CITATION.cff file.
 * 
 * @param path Specifies the path to the directory the CITATION.cff file is in.
 * @returns An object containing the data from/about the CITATION.cff file.
 */
export async function runModule(path: string = "."): Promise<CffObject> {
    let file: Buffer;

    // Read the CITATION.cff file
    try {
        file = fs.readFileSync(path + "/CITATION.cff");
    } catch (e) {
        if (e.code === "ENOENT") {
            // File not found, return MissingCffObject to indicate missing CITATION.cff file
            const Data : MissingCffObject = { status: "missing_file" };
            return Data;
        } else {
            // Critical error, stop
            throw e;
        }
    }

    let result: any;

    // Parse the CITATION.cff file (YAML format)
    try {
        result = YAML.parse(file.toString());
    } catch {
        // Parsing failed, incorrect YAML.
        // Return IncorrectYamlCffObject to indicate incorrect yaml
        const Data: IncorrectYamlCffObject = { status: "incorrect_yaml" };
        return Data;
    }

    const cmd = "docker";
    const absPath = path_.resolve(path);
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

    // Run cffconvert in Docker to validate the CITATION.cff file
    LogMessage("Starting Docker program: cffconvert", ErrorLevel.info);
    const exitCode = await exec(cmd, args, options);

    // Check the Docker exit code for Docker specific errors
    dockerExit.throwDockerError(exitCode);

    // Check cffconvert exit code for success
    if (!dockerExit.isError(exitCode)) {
        // CITATION.cff file is valid, return ValidCffObject with data and validation message
        const Data: ValidCffObject = {
            status: "valid",
            citation: result,
            validation_message: getLastLine(stdout),
        };
        return Data;
    } else {
        // CITATION.cff file is invalid, return ValidationErrorCffObject with data and error message
        const Data: ValidationErrorCffObject = {
            status: "validation_error",
            citation: result,
            validation_message: getError(stderr),
        };
        return Data;
    }
}

export const unknownErrorMsg = "Unknown Error";

/**
 * Finds the error when cffconvert returns an error code.
 * 
 * @param stderr The stderr output produced by docker.
 * @returns A string containing information about the error.
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

function getLastLine(input: string): string {
    const lines = input.split("\n");

    return lines[lines.length - 1];
}
