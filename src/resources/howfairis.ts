import { ReturnObject } from "../getdata";
import {exec, ExecOptions} from '@actions/exec';
import  * as fs from "fs";

export async function runHowfairis(): Promise<ReturnObject> {
    const fileName = "howfairis-output.json";

    const cmd = "docker";
    const args = ["run", "--rm", "fairsoftware/fairtally", "--format", "json", "-o", "-", "https://github.com/fair-software/fairtally", ">", fileName];

    let stdout = "";
    let stderr = "";

    const options: ExecOptions = {
        ignoreReturnCode: true
    };
    options.listeners = {
        stdout: (data: Buffer) => {
            stdout += data.toString()
        },
        stderr: (data: Buffer) => {
            stderr += data.toString()
        }
    };
    const exitCode = await exec(cmd, args, options);
    
    let jsonOutput = fs.readFileSync(fileName, "utf8");
    
    console.log(jsonOutput);

    return {
        ReturnName: "HowFairIs",
        ReturnData: JSON.parse(jsonOutput)
    };
}
