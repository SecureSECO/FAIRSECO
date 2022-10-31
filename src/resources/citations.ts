import { ReturnObject } from "../getdata";
import YAML from "yaml";

import * as fs from "fs";

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
            ReturnData: { status: "incorrect_format" },
        };
    }

    const required: string[] = ["authors", "cff-version", "message", "title"];
    const missing: string[] = [];

    for (const x of required) {
        if (result[x] === undefined) {
            missing.push(x);
        }
    }

    if (missing.length > 0) {
        return {
            ReturnName: "Citation",
            ReturnData: {
                status: "missing_attributes",
                citation: result,
                missing_attributes: missing,
            },
        };
    } else {
        return {
            ReturnName: "Citation",
            ReturnData: {
                status: "correct",
                citation: result,
            },
        };
    }
}
