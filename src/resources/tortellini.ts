import { ReturnObject } from "../getdata";
import * as artifact from "@actions/artifact";
import * as fs from "fs";
import YAML from "yaml";

export async function runTortellini(): Promise<ReturnObject> {
    const artifactClient: artifact.ArtifactClient = artifact.create();
    const downloadResponse = await artifactClient.downloadArtifact(
        "tortellini-result",
        "tortellini-artifact/out"
    );

    const buffer = fs.readFileSync(
        downloadResponse.downloadPath + "/evaluation-result.yml"
    );
    const fileContents = buffer.toString();

    const obj = YAML.parse(fileContents);
    return {
        ReturnName: "Tortellini",
        ReturnData: obj,
    };
}
