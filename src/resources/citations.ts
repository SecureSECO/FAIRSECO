import { ReturnObject } from "../getdata";
import YAML from "yaml";
import * as path from "path";

import * as fs from "fs";
import { exec, ExecOptions } from "@actions/exec";

export async function getCitationFile(): Promise<ReturnObject> {
    let file: Buffer;

    try {
        file = fs.readFileSync("./CITATION.cff");
    } catch {
        console.log("WARNING: No citation.cff file found");
        return {
            ReturnName: "Citation",
            ReturnData: { status: "missing_file" },
        };
    }

    let result: any;

    try {
        result = YAML.parse(file.toString());
    } catch {
        console.log("WARNING: Incorrect format");
        return {
            ReturnName: "Citation",
            ReturnData: { status: "incorrect_yaml" },
        };
    }

    const cmd = "docker";
    const absPath = path.resolve(".");
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

    return {
        ReturnName: "Citation",
        ReturnData: {
            status: exitCode === 0 ? "valid" : "validation_error",
            citation: result,
            validation_error: stdout.split("\n")[1],
        },
    };
}
