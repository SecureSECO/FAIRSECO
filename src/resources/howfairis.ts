import { ReturnObject } from "../getdata";
import {exec, ExecOptions} from '@actions/exec';
import  * as fs from "fs";

export async function runHowfairis(repository: string): Promise<ReturnObject> {
    console.log("howfairis started");

    

    const cmd = "docker";
    const args = ["run", "--rm", "fairsoftware/fairtally", "--format", "json", "-o", "-", "https://github.com/" + repository];

    let stdout = "";
    let stderr = "";

    const options: ExecOptions = {
        ignoreReturnCode: true
    };
    options.listeners = {
        stdout: (data: Buffer) => {
            stdout += data.toString()
            console.log(data.toString());
        },
        stderr: (data: Buffer) => {
            stderr += data.toString()
            console.log(data.toString());
        }
    };
    const exitCode = await exec(cmd, args, options);
    console.log("docker running fairtally returned " + exitCode);
    
    console.log(stdout);

    return {
        ReturnName: "HowFairIs",
        ReturnData: JSON.parse(stdout)
    };
}
