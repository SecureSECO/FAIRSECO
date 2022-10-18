import { ReturnObject } from "../getdata";
import * as artifact from "@actions/artifact";
import * as fs from "fs";
import * as path from "path";
import YAML from "yaml";

export async function runTortellini(): Promise<ReturnObject> {
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
        ReturnData: {
            result: obj.analyzer.result,
            violations: obj.evaluator.violations,
        },
    };
}

async function runTortelliniTest(
    name: string,
    destination: string,
    fileName: string
): Promise<ReturnObject> {
    const downloadResponse = await getArtifactData(name, destination);

    const fileContents = await getFileFromArtifact(downloadResponse, fileName);

    const obj = YAML.parse(fileContents);

    return {
        ReturnName: "Tortellini",
        ReturnData: {
            result: obj.analyzer.result,
            violations: obj.evaluator.violations,
        },
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

    return buffer.toString();
}

export const functionsToTest = {
    getArtifactData,
    getFileFromArtifact,
    runTortelliniTest,
};
