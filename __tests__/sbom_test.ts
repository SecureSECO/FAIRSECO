import * as fs from "fs";
import { ReturnObject } from "../src/getdata";
import { runSBOM } from "../src/resources/sbom";
import * as art from "../src/resources/helperfunctions/artifact";

test("Check if sbom file exists", async () => {
    let fileExists: Boolean = false;

    runSBOM(art.testArtifactObject, "__tests__/.SBOM-unit-test")
        .then(() => {
            fileExists = fs.existsSync("./__tests__/.SBOM-unit-test/SBOM.spdx");
            expect(fileExists).toBe(true);
        })
        .catch(() => {
            expect(fileExists).toBe(true);
        });

    let result: ReturnObject = { ReturnName: "", ReturnData: {} };

    expect(
        async () =>
            (result = await runSBOM(
                art.testArtifactObject,
                "__tests__/.SBOM-unit-test"
            ))
    ).not.toThrow();

    result = await runSBOM(art.testArtifactObject, "__tests__/.SBOM-unit-test");

    expect(result.ReturnData).toHaveProperty("SPDXID");
});
