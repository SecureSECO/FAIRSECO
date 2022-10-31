import { ReturnObject } from "../getdata";

import * as fs from "fs";

export async function getCitationFile(): Promise<ReturnObject> {
    const file = fs.readFileSync("./CITATION.cff");

    console.log(file.toString());

    return { ReturnName: "Citation", ReturnData: {} };
}
