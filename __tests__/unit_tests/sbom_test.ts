import * as fs from "fs";
import { runModule } from "../../src/resources/sbom";
import * as art from "../../src/resources/helperfunctions/artifact";

test("Correct SBOM File", async () => {
    let fileExists: Boolean = false;

    runModule(
        art.testArtifactObject,
        "__tests__/unit_tests/.SBOM-unit-test",
        "correct.spdx"
    )
        .then(() => {
            fileExists = fs.existsSync(
                "./__tests__/unit_tests/.SBOM-unit-test/correct.spdx"
            );
            expect(fileExists).toBe(true);
        })
        .catch(() => {
            expect(fileExists).toBe(true);
        });

    let result = {};

    expect(
        async () =>
            (result = await runModule(
                art.testArtifactObject,
                "__tests__/unit_tests/.SBOM-unit-test",
                "correct.spdx"
            ))
    ).not.toThrow();

    result = await runModule(
        art.testArtifactObject,
        "__tests__/unit_tests/.SBOM-unit-test",
        "correct.spdx"
    );

    expect(result).toHaveProperty("SPDXID");
});

test("Empty File", async () => {
    let fileExists: Boolean = false;

    runModule(
        art.testArtifactObject,
        "__tests__/unit_tests/.SBOM-unit-test",
        "empty.spdx"
    )
        .then(() => {
            fileExists = fs.existsSync(
                "./__tests__/unit_tests/.SBOM-unit-test/empty.spdx"
            );
            expect(fileExists).toBe(true);
        })
        .catch(() => {
            expect(fileExists).toBe(true);
        });

    let result = {};

    expect(
        async () =>
            (result = await runModule(
                art.testArtifactObject,
                "__tests__/unit_tests/.SBOM-unit-test",
                "empty.spdx"
            ))
    ).toThrow();
});
