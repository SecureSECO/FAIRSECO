import * as tort from "../../src/resources/tortellini";
import * as art from "../../src/resources/helperfunctions/artifact"
import * as artifact from "@actions/artifact";
import { expect, test } from "@jest/globals";

import YAML from "yaml";
import { ReturnObject } from "../../src/getdata";
import * as input from "../../src/resources/tortellini-input";

test("Data is filtered and correctly used in RunTortellini", correctData)

jest.mock("../../src/resources/tortellini-input", () => {
    const actualModule = jest.requireActual(
        "../../src/resources/tortellini-input"
    );

    // This code runs before modules are loaded so load the artifact module here
    const art = require("../../src/resources/helperfunctions/artifact");

    return {
        __esModule: true,
        ...actualModule,
        artifactObject: art.testArtifactObject, // Unit testing artifact object
        destination: "__tests__/.tortellini-unit-test",
    };
});

async function correctData(): Promise<void>{
    const TortResultDirect = await (await tort.runTortellini("correct.yml")).ReturnData;
    const TortResultWithoutFiltering = await (await runTortelliniWithoutFiltering()).ReturnData;

    const TortResulWithFiltering = tort.filterData(TortResultWithoutFiltering);
    return expect(TortResultDirect).toMatchObject(await TortResulWithFiltering);
}

/**
 * Downloads the artifact that was uploaded by Tortellini, and parses the YAML file.
 *
 * @param fileName Name of the file that should be retrieved from the artifact
 * @returns A {@link action.ReturnObject} containing the relevant data from the YAML file given by Tortellini
 */
 async function runTortelliniWithoutFiltering(
    fileName: string = "correct.yml"
): Promise<ReturnObject> {
    const downloadResponse = await art.getArtifactData(
        "tortellini-result",
        input.destination,
        input.artifactObject
    );

    const fileContents = await art.getFileFromArtifact(downloadResponse, fileName);

    if (fileContents === "")
        return { ReturnName: "Tortellini", ReturnData: {} };

    const obj = YAML.parse(fileContents);

    return {
        ReturnName: "Tortellini",
        ReturnData: obj,
    };
}