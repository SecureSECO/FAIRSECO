import * as artifact from "@actions/artifact";

import { Artifact, getArtifactData, getFileFromArtifact } from "./helperfunctions/artifact";

export const artifactObject: Artifact = artifact;
export const destination: string = ".tortellini-artifact";