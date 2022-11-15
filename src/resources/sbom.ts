import { ReturnObject } from "../getdata";
import {
    Artifact,
    getArtifactData,
    getFileFromArtifact,
} from "./helperfunctions/artifact";
import * as artifact from "@actions/artifact";

// Get the SBOM info from the file
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
