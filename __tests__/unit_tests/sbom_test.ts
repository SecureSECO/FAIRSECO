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
        runModule(art.testArtifactObject, "__tests__/unit_tests/.SBOM_unit_test", "empty.spdx")
    ).rejects.toThrow();
});
