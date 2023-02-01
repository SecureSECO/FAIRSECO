/*
This program has been developed by students from the bachelor Computer Science at
Utrecht University within the Software Project course.
© Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/**
 * This module contains a function that retrieves the artifact from [sbom-action](https://github.com/anchore/sbom-action) and parses the data to JSON.
 *
 * @module
 */

import {
    Artifact,
    getArtifactData,
    getFileFromArtifact,
} from "./helperfunctions/artifact";
import * as artifact from "@actions/artifact";

/** The name of the module. */
export const ModuleName = "SBOM";

/**
 * This function downloads the artifact created by the SBOM action,
 * and parses the JSON to an object.
 *
 * @param artifactObject The Artifact object that is used. During normal operation of the program, this should simply be \@actions/artifact, but for the unit tests a mock is passed instead.
 * @param destination The path to the directory in which the artifact file should be downloaded.
 * @param fileName The name of the file that should be read.
 * @returns The data from the spdx file.
 */
export async function runModule(
    artifactObject: Artifact = artifact,
    destination: string = ".SBOM-artifact",
    fileName: string = "SBOM.spdx"
): Promise<any> {
    // Get the SBOM file
    const downloadResponse = await getArtifactData(
        fileName,
        destination,
        artifactObject
    );
    const fileContents = getFileFromArtifact(downloadResponse, fileName);

    // Check if the file is empty
    if (fileContents !== "") {
        return JSON.parse(fileContents);
    } else {
        throw new Error("SBOM artifact file appears to be empty.");
    }
}
