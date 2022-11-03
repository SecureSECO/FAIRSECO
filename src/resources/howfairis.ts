import { ReturnObject } from "../getdata";
import { getRepoUrl } from "../git";

import { exec, ExecOptions } from "@actions/exec";

export async function runHowfairis(): Promise<ReturnObject> {
    const gitrepo: string = await getRepoUrl();
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
        gitrepo,
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

    // console.debug("Docker running fairtally returned " + String(exitCode));
    console.debug("stdout:");
    console.debug(stdout);
    console.debug("stderr:");
    console.debug(stderr);

    return {
        ReturnName: "HowFairIs",
        ReturnData: JSON.parse(stdout)

    };
}
