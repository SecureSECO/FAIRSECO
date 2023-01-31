/**
 * This module contains a function that retrieves the artifact from Tortellini and filters the data.
 * 
 * @module
 */

import YAML from "yaml";
import {
    getArtifactData,
    getFileFromArtifact,
} from "./helperfunctions/artifact";

import * as input from "./tortellini_input";

/** The name of the module. */
export const ModuleName = "Tortellini";

/**
 * Downloads the artifact that was uploaded by Tortellini, and parses the YAML file.
 *
 * @param fileName The name of the file that should be retrieved from the artifact.
 * @returns The relevant data from the YAML file given by Tortellini.
 */
export async function runModule(
    fileName: string = "evaluation-result.yml"
): Promise<any> {
    const downloadResponse = await getArtifactData(
        "tortellini-result",
        input.destination,
        input.artifactObject
    );

    const fileContents = getFileFromArtifact(downloadResponse, fileName);

    if (fileContents === "") {
        throw new Error("Tortellini artifact file appears to be empty.");
    }

    const obj = YAML.parse(fileContents);

    const filteredData = filterData(obj);

    return filteredData;
}

/**
 * Filters the data from the YAML file.
 *
 * The YAML file contains a lot of information that is not interesting for this project,
 * like information about the analysis itself (start and end time, environment info, etc.), and
 * a massive dependency tree.
 *
 * We only need a list of dependencies with their license data, and a list of license violations.
 *
 * @param obj The object that contains the data from the YAML file.
 * @returns An object containing only the data that is relevant for FAIRSECO.
 */
export function filterData(obj: any): any {
    // Project data
    const projects: any[] = obj.analyzer.result.projects ?? [];
    const project = projects[0] ?? {};

    const projData = {
        id: project.id ?? "-",
        licenses: project.declared_licenses ?? "-",
        description: project.description ?? "-",
        authors: project.authors ?? "-",
        vcs: project.vcs_processed ?? "-",
    };

    // Package data
    const packages: any[] = obj.analyzer.result.packages ?? [];
    const packData = [];
    for (const pack of packages) {
        const p = {
            id: pack.package?.id ?? "-",
            licenses: pack.package?.declared_licenses ?? "-",
            description: pack.package?.description ?? "-",
            authors: pack.package?.authors ?? "-",
            vcs: pack.package?.vcs_processed ?? "-",
        };
        packData.push(p);
    }

    // Violations
    const viol = obj.evaluator.violations;

    return { project: projData, packages: packData, violations: viol };
}
