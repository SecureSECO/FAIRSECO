import * as tort from "../../src/resources/tortellini";
import * as art from "../../src/resources/helperfunctions/artifact"
import * as artifact from "@actions/artifact";
import { expect, test } from "@jest/globals";

import YAML from "yaml";
import { ReturnObject } from "../../src/getdata";

const mockArtifact = art.createMockArtifact();

test("Data is filtered and correctly used in RunTortellini", correctData)

async function correctData(): Promise<void>{
    const TortResultDirect = await (await tort.runTortellini(mockArtifact)).ReturnData;
    const TortResultWithoutFiltering = await (await runTortelliniWithoutFiltering(mockArtifact)).ReturnData;

    const TortResulWithFiltering = tort.filterData(TortResultWithoutFiltering);
    return expect(TortResultDirect).toMatchObject(await TortResulWithFiltering);
}

// runTortellini function without filtering the data after
export async function runTortelliniWithoutFiltering(
    artifactObject?: art.Artifact
): Promise<ReturnObject> {
    // An artifact object is only passed in the test. If that is the case,
    // set the download destination to the unit test output folder.
    // If not, use the regular Github Action artifact, and the normal output folder
    let destination: string = "";
    if (artifactObject !== undefined) {
        destination = "__tests__/.tortellini-unit-test";
    } else {
        artifactObject = artifact;
        destination = ".tortellini-artifact";
    }

    const downloadResponse = await art.getArtifactData(
        "tortellini-result",
        destination,
        artifactObject
    );

    const fileContents = await art.getFileFromArtifact(
        downloadResponse,
        "evaluation-result.yml"
    );

    const obj = YAML.parse(fileContents);

    return {
        ReturnName: "Tortellini",
        ReturnData: obj,
    };
}