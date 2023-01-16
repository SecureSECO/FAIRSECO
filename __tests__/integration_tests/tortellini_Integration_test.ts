import * as tort from "../../src/resources/tortellini";
import * as art from "../../src/resources/helperfunctions/artifact"
import { expect, test } from "@jest/globals";

import YAML from "yaml";
import * as input from "../../src/resources/tortellini-input";

test("Data is filtered and correctly used in runModule", correctData)

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
        destination: "__tests__/unit_tests/.tortellini-unit-test",
    };
});

async function correctData(): Promise<void>{
    const TortResultDirect = await tort.runModule("correct.yml");
    const TortResultWithoutFiltering = await runModuleWithoutFiltering();

    const TortResulWithFiltering = tort.filterData(TortResultWithoutFiltering);
    return expect(TortResultDirect).toMatchObject(await TortResulWithFiltering);
}

/**
 * Downloads the artifact that was uploaded by Tortellini, and parses the YAML file.
 *
 * @param fileName Name of the file that should be retrieved from the artifact
 * @returns A {@link action.ReturnObject} containing the relevant data from the YAML file given by Tortellini
 */
 async function runModuleWithoutFiltering(
    fileName: string = "correct.yml"
): Promise<any> {
    const downloadResponse = await art.getArtifactData(
        "tortellini-result",
        input.destination,
        input.artifactObject
    );

    const fileContents = await art.getFileFromArtifact(downloadResponse, fileName);

    if (fileContents === "")
        return {};

    const obj = YAML.parse(fileContents);

    return obj;
}