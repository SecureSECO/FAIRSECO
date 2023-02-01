/*
This program has been developed by students from the bachelor Computer Science at
Utrecht University within the Software Project course.
© Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import * as fs from "fs";
import { runModule } from "../../src/resources/sbom";
import * as art from "../../src/resources/helperfunctions/artifact";

test("Correct SBOM File", async () => {
    const result = await runModule(
        art.testArtifactObject,
        "__tests__/unit_tests/.SBOM_unit_test",
        "correct.spdx"
    );
    expect(result).toHaveProperty("SPDXID");
});

test("Empty File", () => {
    return expect(
        runModule(
            art.testArtifactObject,
            "__tests__/unit_tests/.SBOM_unit_test",
            "empty.spdx"
        )
    ).rejects.toThrow();
});
