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
/**
 * Downloads an artifact that was uploaded by another action in a previous step or job in the workflow.
 *
 * @param artifactName The name of the artifact given by the action that created it
 * @param destination Folder in which the artifact files should be downloaded
 * @param artifactObject The artifact module that is used. During normal operation of the program, this should simply be @actions/artifact, but for the unit tests a mock is passed instead.
 * @returns Object containing the download path and the artifact name
 */
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

/**
 * Get a file from the artifact as a string.
 *
 * @param dlResponse The DownloadResponse object that was returned by getArtifactData.
 * @param fileName The name of the file that should be read.
 * @returns The content of the file.
 */
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
