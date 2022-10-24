import { ReturnObject } from "../getdata";
import * as artifact from "@actions/artifact";
import * as fs from "fs";
import * as path from "path";
import YAML from "yaml";

export type Artifact = typeof artifact | TestArtifact;
export type ArtClient = artifact.ArtifactClient | TestClient;
export type DownloadResponse = artifact.DownloadResponse | TestResponse;
export type DownloadOptions = artifact.DownloadOptions | undefined;

export interface TestArtifact {
    create: () => TestClient;
}

export type DLArtFunc = (
    name: string,
    path?: string | undefined,
    options?: DownloadOptions
) => TestResponse;

export interface TestResponse {
    artifactName: string;
    downloadPath: string | undefined;
}

export interface TestClient {
    downloadArtifact: (
        name: string,
        path?: string,
        options?: DownloadOptions
    ) => TestResponse;
}

export async function runTortellini(
    artifactObject?: Artifact
): Promise<ReturnObject> {
    // If no artifact object was passed, use the default github actions artifact
    let destination: string = "";
    if (artifactObject !== undefined) {
        destination = ".tortellini-unit-test";
    } else {
        artifactObject = artifact;
        destination = ".tortellini-artifact";
    }

    const downloadResponse = await getArtifactData(
        "tortellini-result",
        destination,
        artifactObject
    );

    const fileContents = await getFileFromArtifact(
        downloadResponse,
        "evaluation-result.yml"
    );

    const obj = YAML.parse(fileContents);

    const filteredData = filterData(obj);

    return {
        ReturnName: "Tortellini",
        ReturnData: filteredData,
    };
}

// Download the artifact that was uploaded by Tortellini
export async function getArtifactData(
    artifactName: string,
    destination: string,
    artifactObject: Artifact
): Promise<DownloadResponse> {
    const artifactClient = artifactObject.create();
    const downloadResponse = await artifactClient.downloadArtifact(
        artifactName,
        destination
    );

    return downloadResponse;
}

// Get a file from the artifact as a string
export async function getFileFromArtifact(
    dlResponse: DownloadResponse,
    fileName: string
): Promise<string> {
    let filePath: string = "";
    if (dlResponse.downloadPath === undefined) filePath = fileName;
    else filePath = path.join(dlResponse.downloadPath, fileName);
    const buffer = fs.readFileSync(filePath);

    return buffer.toString();
}

export async function filterData(obj: any): Promise<any> {
    // Project data:
    // ID
    // declared_licenses_processed
    // description
    // vcs_processed
    const project = obj.analyzer.result.projects[0];
    const projData = {
        id: project.id,
        licenses: project.declared_licenses,
        description: project.description,
        vcs: project.vcs_processed,
    };

    // Package data, for each package:
    // ID
    // declared_licenses_processed
    // description
    // authors
    // vcs_processed
    const packages = obj.analyzer.result.packages;
    const packData = [];
    for (const pack of packages) {
        const p = {
            id: pack.id,
            licenses: pack.declared_licenses,
            description: pack.description,
            authors: pack.authors,
            vcs: pack.vcs_processed,
        };
        console.log(pack);
        packData.push(p);
    }

    // Violations
    const viol = obj.evaluator.violations;

    return { projectData: projData, packageData: packData, violations: viol };
}
