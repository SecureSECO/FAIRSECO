import * as tort from "../src/resources/tortellini";
import { expect, test } from "@jest/globals";

const mockArtifact = createMockArtifact();

test("Check if a correct downloadResponse is generated", async () => {
    const dlResponse = await tort.getArtifactData(
        "tortellini-result",
        ".tortellini-unit-test",
        mockArtifact
    );

    expect(dlResponse).toEqual({
        artifactName: "tortellini-result",
        downloadPath: ".tortellini-unit-test",
    });
});

test("Check if a file can be retrieved with the downloadResponse", async () => {
    const dlResponse = await tort.getArtifactData(
        "tortellini-result",
        ".tortellini-unit-test",
        mockArtifact
    );

    const result = await tort.getFileFromArtifact(
        dlResponse,
        "evaluation-result.yml"
    );

    // If the result is not truthy, it is either an empty string or undefined,
    // which is not correct
    expect(result).toBeTruthy();
});

test("Test if runTortellini returns a correct ReturnObject", async () => {
    const result = await tort.runTortellini(mockArtifact);

    expect(result).not.toBeUndefined();
    expect(result.ReturnName).toBe("Tortellini");
    expect(result.ReturnData).not.toBeUndefined();
});

function createMockArtifact(): tort.Artifact {
    // Create DLArtFunc
    const downloadArt = function (
        name: string,
        path?: string | undefined,
        options?: tort.DownloadOptions
    ) {
        return { artifactName: name, downloadPath: path };
    };

    // Create TestClient
    const client: tort.TestClient = { downloadArtifact: downloadArt };

    // Create create function
    const create_ = function () {
        return client;
    };

    const testArt: tort.TestArtifact = { create: create_ };

    // Create TestArtifact
    return testArt;
}
