import { ReturnObject } from "../getdata";
import { GithubInfo } from "../git";
import * as dockerExit from "./helperfunctions/docker_exit";
import { ErrorLevel, LogMessage } from "../log";

import { exec, ExecOptions } from "@actions/exec";
import fs from "fs";

/**
 * This function runs the fairtally docker image on the current repo,
 * and gives the checklist of FAIRness criteria.
 *
 * @returns A {@link getdata.ReturnObject} containing the result from fairtally.
 */
export async function runHowfairis(ghInfo: GithubInfo): Promise<ReturnObject> {
    LogMessage("Howfairis started.", ErrorLevel.info);

    const cmd = "docker";
    const args = [
        "run",
        "--rm",
        "fairsoftware/fairtally",
        "--format",
        "json",
        "-o",
        "-",
        ghInfo.FullURL,
    ];

    // Output from the docker container
    let stdout = "";
    let stderr = "";

    try {
        if (!fs.existsSync("./hfiOutputFiles"))
            fs.mkdirSync("./hfiOutputFiles/");
        else
            LogMessage("Directory hfiOutputFiles already exists!", ErrorLevel.info);
    } catch {
        LogMessage("Could not create hfiOutputFiles directory.", ErrorLevel.err);
    }

    const stdOutStream = fs.createWriteStream("./hfiOutputFiles/hfiOutput.txt");
    const stdErrStream = fs.createWriteStream("./hfiOutputFiles/hfiError.txt");

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
    const exitCode = await exec(cmd, args, options);

    // Check docker exit code
    dockerExit.throwError("Howfairis", exitCode);

    // Parse the JSON output
    let returnData;
    try {
        returnData = JSON.parse(stdout);
    } catch {
        throw new Error("Run output is not valid JSON");
    }

    return {
        ReturnName: "HowFairIs",
        ReturnData: returnData,
    };
}
