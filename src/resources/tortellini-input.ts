import * as artifact from "@actions/artifact";

import { Artifact } from "./helperfunctions/artifact";

/**
 * The {@link Artifact} object that will be used by tortellini.ts.
 * Can be overridden by mocking this module in jest for unit testing.
 */
export const artifactObject: Artifact = artifact;

/**
 * The path to the directory the artifact produced by tortellini will be downloaded to.
 * Can be overriden by mocking this module in jest for unit testing.
 */
export const destination: string = ".tortellini-artifact";
