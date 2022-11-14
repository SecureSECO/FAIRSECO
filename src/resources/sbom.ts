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
    destination: string = ".SBOM-artifact"
): Promise<ReturnObject> {
    // Get the SBOM file
    const downloadResponse = await getArtifactData(
        "SBOM.spdx",
        destination,
        artifactObject
    );

    const fileContents = await getFileFromArtifact(
        downloadResponse,
        "SBOM.spdx"
    );

    const obj = JSON.parse(fileContents);

    return {
        ReturnName: "SBOM",
        ReturnData: obj,
    };
}
