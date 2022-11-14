import * as artifact from "@actions/artifact";
import * as fs from "fs";
import * as path from "path";

export type DownloadResponse = artifact.DownloadResponse;
export type DownloadOptions = artifact.DownloadOptions;

export interface Artifact {
    create: () => ArtifactClient;
}

export interface ArtifactClient {
    downloadArtifact: (
        name: string,
        path: string,
        options?: DownloadOptions | undefined
    ) => Promise<DownloadResponse>;
}

// Download the artifact
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
    const filePath: string = path.join(dlResponse.downloadPath, fileName);
    const buffer = fs.readFileSync(filePath);

    return buffer.toString();
}

// An Artifact that can be used for unit tests.
// it does not actually download anything, when downloadArtifact is called,
// it does return a correct download response as if a file was downloaded.
export const testArtifactObject: Artifact = {
    create: () => {
        const client: ArtifactClient = {
            downloadArtifact: async (
                name: string,
                path: string,
                options?: DownloadOptions | undefined
            ) => {
                return { artifactName: name, downloadPath: path };
            },
        };

        return client;
    },
};
