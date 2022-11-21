import * as artifact from "@actions/artifact";

import { Artifact } from "./helperfunctions/artifact";

/**
 * This module contains the artifact object and destination of the artifact
 * produced by Tortellini. It can be used in the unit tests to mock the artifact
 * module, and to reroute the download path to the folder containing test cases.
 */

export const artifactObject: Artifact = artifact;
export const destination: string = ".tortellini-artifact";
