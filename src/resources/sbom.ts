import { ReturnObject } from "../getdata";
import { Artifact, getArtifactData, getFileFromArtifact } from "./tortellini";
import * as artifact from "@actions/artifact";
import YAML from "yaml";

export async function runSBOM(
    artifactObject?: Artifact
    ): Promise<ReturnObject> {
    let destination: string = "";
    if (artifactObject !== undefined) {
        destination = ".tortellini-unit-test";
    } else {
        artifactObject = artifact;
        destination = ".SBOM-artifact";
    }

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

