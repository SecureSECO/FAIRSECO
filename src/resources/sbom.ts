/** 
 * This module contains a function that retrieves the artifact from [sbom-action](https://github.com/anchore/sbom-action) and parses the data to JSON.
 * 
 * @module
 */

import { ReturnObject } from "../getdata";
import {
    Artifact,
    getArtifactData,
    getFileFromArtifact,
} from "./helperfunctions/artifact";
import * as artifact from "@actions/artifact";
import { ErrorLevel, LogMessage } from "../errorhandling/log";

/**
 * This function downloads the artifact created by the SBOM action,
 * and parses the JSON to an object.
 *
 * @param artifactObject The {@link ./helperfunctions/artifact.Artifact} object that is used. During normal operation of the program, this should simply be \@actions/artifact, but for the unit tests a mock is passed instead.
 * @param destination The path to the directory in which the artifact file should be downloaded.
 * @param fileName The name of the file that should be read.
 * @returns A {@link getdata.ReturnObject} containing the data from the spdx file.
 */
export async function runSBOM(
    artifactObject: Artifact = artifact,
    destination: string = ".SBOM-artifact",
    fileName: string = "SBOM.spdx"
): Promise<ReturnObject> {
    // Get the SBOM file
    const downloadResponse = await getArtifactData(
        fileName,
        destination,
        artifactObject
    );

    const fileContents = getFileFromArtifact(downloadResponse, fileName);

    let obj;

    if (fileContents !== "") {
        obj = JSON.parse(fileContents);
    } else {
        LogMessage("SBOM artifact file appears to be empty.", ErrorLevel.warn);
        obj = {};
    }

    return {
        ReturnName: "SBOM",
        ReturnData: obj,
    };
}
