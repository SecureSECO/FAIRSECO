import * as tort from "../../src/resources/tortellini";
import * as art from "../../src/resources/helperfunctions/artifact"
import { expect, test } from "@jest/globals";

import YAML from "yaml";
import * as input from "../../src/resources/tortellini_input";

test("Data is filtered and correctly used in runModule", correctData)

jest.mock("../../src/resources/tortellini_input", () => {
    const actualModule = jest.requireActual(
        "../../src/resources/tortellini_input"
    );

    // This code runs before modules are loaded so load the artifact module here
    const art = require("../../src/resources/helperfunctions/artifact");

    return {
        __esModule: true,
        ...actualModule,
        artifactObject: art.testArtifactObject, // Unit testing artifact object
        destination: "__tests__/unit_tests/.tortellini_unit_test",
    };
});

async function correctData(): Promise<void>{
    const TortResultDirect = await tort.runModule(["correct.yml"]);
    const TortResultWithoutFiltering = await runModuleWithoutFiltering();

    const TortResulWithFiltering = tort.filterData(TortResultWithoutFiltering);
    return expect(TortResultDirect).toMatchObject(await TortResulWithFiltering);
}

 async function runModuleWithoutFiltering(
    fileName: string = "correct.yml"
): Promise<any> {
    const downloadResponse = await art.getArtifactData(
        "tortellini-result",
        input.destination,
        input.artifactObject
    );

    const fileContents = art.getFileFromArtifact(downloadResponse, fileName);

    if (fileContents === "") {
        throw new Error("Tortellini artifact file appears to be empty.");
    }

    const obj = YAML.parse(fileContents);

    return obj;
}
