import { ReturnObject } from "../getdata";
import * as artifact from "@actions/artifact";

import YAML from "yaml";
import { Artifact, getArtifactData, getFileFromArtifact } from "./helperfunctions/artifact";

export async function runTortellini(
    artifactObject?: Artifact
): Promise<ReturnObject> {
    // An artifact object is only passed in the unit test. If that is the case,
    // set the download destination to the unit test output folder.
    // If not, use the regular Github Action artifact, and the normal output folder
    let destination: string = "";
    if (artifactObject !== undefined) {
        destination = "__tests__/.tortellini-unit-test";
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

    const filteredData = await filterData(obj);

    return {
        ReturnName: "Tortellini",
        ReturnData: filteredData,
    };
}

// Only get the data that is relevant for license checking
// To make sure all properties are always present,
// replace undefined properties with a dash
export async function filterData(obj: any): Promise<any> {
    // Project data
    const project = obj.analyzer.result.projects[0];
    const projData = {
        id: project.id || "-",
        licenses: project.declared_licenses || "-",
        description: project.description || "-",
        authors: project.authors || "-",
        vcs: project.vcs_processed || "-",
    };

    // Package data
    const packages = obj.analyzer.result.packages;
    const packData = [];
    for (const pack of packages) {
        const p = {
            id: pack.package.id || "-",
            licenses: pack.package.declared_licenses || "-",
            description: pack.package.description || "-",
            authors: pack.package.authors || "-",
            vcs: pack.package.vcs_processed || "-",
        };
        packData.push(p);
    }

    // Violations
    const viol = obj.evaluator.violations;

    return { project: projData, packages: packData, violations: viol };
}
