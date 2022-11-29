import { ReturnObject } from "../getdata";
import { GithubInfo } from "../git";
import * as fs from "fs";

import { exec, ExecOptions } from "@actions/exec";

/**
 * This function runs the fairtally docker image on the current repo,
 * and gives the checklist of FAIRness criteria.
 *
 * @returns A {@link action.ReturnObject} containing the result from fairtally.
 */
export async function runHowfairis(ghInfo: GithubInfo): Promise<ReturnObject> {
    console.debug("HowFairIs started");
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

    let stdout = "";
    let stderr = "";

    try {
        fs.mkdirSync("./hfiOutputFiles");
    } catch {
        console.error("Could not create folder");
    }

    const stdOutStream = fs.createWriteStream("./hfiOutputFiles/hfiOutput.txt");
    const stdErrStream = fs.createWriteStream("./hfiOutputFiles/hfiError.txt");

    const options: ExecOptions = {
        ignoreReturnCode: true,
        windowsVerbatimArguments: true,
        outStream: stdOutStream,
        errStream: stdErrStream,
    };

    // options.listeners = {
    //     stdout: (data: Buffer) => {
    //         stdout += data.toString();
    //     },
    //     stderr: (data: Buffer) => {
    //         stderr += data.toString();
    //     },
    // };
    const exitCode = await exec(cmd, args, options);

    stdout = fs.readFileSync("./hfiOutputFiles/hfiOutput.txt").toString();
    stderr = fs.readFileSync("./hfiOutputFiles/hfiError.txt").toString();

    return {
        ReturnName: "HowFairIs",
        ReturnData: JSON.parse(stdout),
    };
}
