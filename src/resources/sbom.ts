import { ReturnObject } from "../getdata";
import { Artifact, getArtifactData, getFileFromArtifact } from "./helperfunctions/artifact";
import * as artifact from "@actions/artifact";
import YAML from "yaml";

// Get the SBOM info from the file
export async function runSBOM(
    artifactObject?: Artifact
    ): Promise<ReturnObject> {
    let destination: string = "";
    if (artifactObject !== undefined) {
        destination = "__tests__/.SBOM-unit-test";
    } else {
        artifactObject = artifact;
        destination = ".SBOM-artifact";
    }

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

    const obj = YAML.parse(fileContents);

    return {
        ReturnName: "SBOM",
        ReturnData: obj,
    };
}

