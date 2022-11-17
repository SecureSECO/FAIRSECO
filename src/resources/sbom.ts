import { ReturnObject } from "../getdata";
import {
    Artifact,
    getArtifactData,
    getFileFromArtifact,
} from "./helperfunctions/artifact";
import * as artifact from "@actions/artifact";

/**
 * This function downloads the artifact created by the SBOM action,
 * and parses the JSON to an object
 *
 * @param artifactObject The artifact module that is used. During normal operation of the program, this should simply be @actions/artifact, but for the unit tests a mock is passed instead.
 * @param destination Folder in which the artifact files should be downloaded
 * @param fileName The name of the file that should be read.
 * @returns A {@link action.ReturnObject} containing the data from the spdx file
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

    const fileContents = await getFileFromArtifact(downloadResponse, fileName);

    let obj;

    if (fileContents !== "") {
        obj = JSON.parse(fileContents);
    } else {
        obj = {};
    }

    return {
        ReturnName: "SBOM",
        ReturnData: obj,
    };
}
