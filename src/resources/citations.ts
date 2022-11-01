import { ReturnObject } from "../getdata";
import YAML from "yaml";
import * as path_ from "path";

import * as fs from "fs";
import { exec, ExecOptions } from "@actions/exec";
import { getSystemErrorMap } from "util";

export type CFFObject =
    | MissingCFFObject
    | IncorrectYamlCFFObject
    | ValidCFFObject
    | ValidationErrorCFFObject;

export interface MissingCFFObject {
    status: "missing_file";
}

export interface IncorrectYamlCFFObject {
    status: "incorrect_yaml";
}
export interface ValidCFFObject {
    status: "valid";
    citation: any;
    validation_message: string;
}

export interface ValidationErrorCFFObject {
    status: "validation_error";
    citation: any;
    validation_message: string;
}

export async function getCitationFile(path?: string): Promise<ReturnObject> {
    let file: Buffer;

    let filePath;
    if (path === undefined) filePath = "./CITATION.cff";
    else filePath = path;

    try {
        file = fs.readFileSync(filePath);
    } catch {
        console.log("WARNING: No citation.cff file found");
        const returnData: MissingCFFObject = { status: "missing_file" };
        return {
            ReturnName: "Citation",
            ReturnData: returnData,
        };
    }

    let result: any;

    try {
        result = YAML.parse(file.toString());
    } catch {
        console.log("WARNING: Incorrect format");
        const returnData: IncorrectYamlCFFObject = { status: "incorrect_yaml" };
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
    const exitCode = await exec(cmd, args, options);

    console.debug("Docker running cffconvert returned " + String(exitCode));
    console.debug("stdout:");
    console.debug(stdout);
    console.debug("stderr:");
    console.debug(stderr);

    if (exitCode === 0) {
        const returnData: ValidCFFObject = {
            status: "valid",
            citation: result,
            validation_message: stdout,
        };
        return {
            ReturnName: "Citation",
            ReturnData: returnData,
        };
    } else {
        const returnData: ValidationErrorCFFObject = {
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

export function getError(stderr: string): string {
    const lines = stderr.split("\n");
    for (const x of lines) {
        const first = x.split(" ")[0];
        if (first?.includes("Error:")) return x;
    }

    return "Unknown error";
}
