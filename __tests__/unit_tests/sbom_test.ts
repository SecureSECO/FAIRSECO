import * as fs from "fs";
import { ReturnObject } from "../../src/getdata";
import { runSBOM } from "../../src/resources/sbom";
import * as art from "../../src/resources/helperfunctions/artifact";

test("Correct SBOM File", async () => {
    let fileExists: Boolean = false;

    runSBOM(art.testArtifactObject, "__tests__/unit_tests/.SBOM-unit-test", "correct.spdx")
        .then(() => {
            fileExists = fs.existsSync(
                "./__tests__/unit_tests/.SBOM-unit-test/correct.spdx"
            );
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
                "__tests__/unit_tests/.SBOM-unit-test",
                "correct.spdx"
            ))
    ).not.toThrow();

    result = await runSBOM(
        art.testArtifactObject,
        "__tests__/unit_tests/.SBOM-unit-test",
        "correct.spdx"
    );

    expect(result.ReturnData).toHaveProperty("SPDXID");
});

test("Empty File", async () => {
    let fileExists: Boolean = false;

    runSBOM(art.testArtifactObject, "__tests__/unit_tests/.SBOM-unit-test", "empty.spdx")
        .then(() => {
            fileExists = fs.existsSync(
                "./__tests__/unit_tests/.SBOM-unit-test/empty.spdx"
            );
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
                "__tests__/unit_tests/.SBOM-unit-test",
                "empty.spdx"
            ))
    ).not.toThrow();

    result = await runSBOM(
        art.testArtifactObject,
        "__tests__/unit_tests/.SBOM-unit-test",
        "empty.spdx"
    );

    expect(result.ReturnData).toEqual({});
});
