import * as fs from "fs";
import { ReturnObject } from "../src/getdata";
import { runSBOM } from "../src/resources/sbom";
import * as art from "../src/resources/helperfunctions/artifact";

const mockArtifact = art.createMockArtifact();

test("Check if sbom file exists", async () => {
    const outputmodule: ReturnObject = await runSBOM(mockArtifact);

    let fileExists: Boolean = false;

    runSBOM(mockArtifact)
        .then(() => {
            fileExists = fs.existsSync("./__tests__/.SBOM-unit-test/SBOM.spdx");
            expect(fileExists).toBe(true);
        })
        .catch(() => {
            expect(fileExists).toBe(true);
        });

    let result;

    expect(async () => (result = await runSBOM(mockArtifact))).not.toThrow();
});
