import { runTortellini, functionsToTest } from "../src/resources/tortellini";
import { expect, test } from "@jest/globals";

const { getArtifactData, getFileFromArtifact } = functionsToTest;

test("Test retrieval of artifacts", async () => {
    const dlResponse = await getArtifactData(
        "tortellini-result",
        ".tortellini-artifact"
    );
    const result = await getFileFromArtifact(
        dlResponse,
        "evaluation-result.yml"
    );

    // If the result is not truthy, it is either an empty string or undefined,
    // which is not correct
    expect(result).toBeTruthy();
});

test("Test if runTortellini returns a correct ReturnObject", async () => {
    const result = await runTortellini();

    expect(result).not.toBeUndefined();
    expect(result.ReturnName).toBe("Tortellini");
    expect(result.ReturnData).not.toBeUndefined();
});
