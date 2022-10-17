import { ReturnObject } from "../getdata";
import * as artifact from "@actions/artifact";
import * as fs from "fs";
import * as path from "path";
import YAML from "yaml";

export async function runTortellini(): Promise<ReturnObject> {
    console.error(1);
    const downloadResponse = await getArtifactData(
        "tortellini-result",
        ".tortellini-artifact"
    );

    const fileContents = await getFileFromArtifact(
        downloadResponse,
        "evaluation-result.yml"
    );

    const obj = YAML.parse(fileContents);

    return {
        ReturnName: "Tortellini",
        ReturnData: obj,
    };
}

// Download the artifact that was uploaded by Tortellini
async function getArtifactData(
    artifactName: string,
    destination: string
): Promise<artifact.DownloadResponse> {
    const artifactClient = artifact.create();
    const downloadResponse = await artifactClient.downloadArtifact(
        artifactName,
        destination
    );

    return downloadResponse;
}

// Get a file from the artifact as a string
async function getFileFromArtifact(
    dlResponse: artifact.DownloadResponse,
    fileName: string
): Promise<string> {
    const filePath = path.join(dlResponse.downloadPath, fileName);
    const buffer = fs.readFileSync(filePath);
    console.log("Start loggggggg-------------------");
    console.log(filepath);
    console.log(buffer);
    return buffer.toString();
}
