import { ReturnObject } from "../getdata";

import YAML from "yaml";
import {
    Artifact,
    getArtifactData,
    getFileFromArtifact,
} from "./helperfunctions/artifact";

import * as input from "./tortellini-input";
export async function runTortellini(
    fileName: string = "evaluation-result.yml"
): Promise<ReturnObject> {
    const downloadResponse = await getArtifactData(
        "tortellini-result",
        input.destination,
        input.artifactObject
    );

    const fileContents = await getFileFromArtifact(downloadResponse, fileName);

    if (fileContents === "")
        return { ReturnName: "Tortellini", ReturnData: {} };

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
    const projects: any[] = obj.analyzer.result.projects || [];
    const project = projects[0] || {};

    const projData = {
        id: project.id || "-",
        licenses: project.declared_licenses || "-",
        description: project.description || "-",
        authors: project.authors || "-",
        vcs: project.vcs_processed || "-",
    };

    // Package data
    const packages: any[] = obj.analyzer.result.packages || [];
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
