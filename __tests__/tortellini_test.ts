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

    const data: any = result.ReturnData;

    const properties = [
        "project",
        "project.id",
        "project.licenses",
        "project.description",
        "project.vcs",
        "project.vcs.type",
        "project.vcs.url",
        "project.vcs.revision",
        "packages",
        "packages.id",
        "packages.licenses",
        "packages.description",
        "project.vcs",
        "project.vcs.type",
        "project.vcs.url",
        "project.vcs.revision",
        "violations",
        "violations.rule",
        "violations.pkg",
        "violations.license",
        "violations.severity",
        "violations.message",
        "violations.how_to_fix",
    ];

    expect(result).not.toBeUndefined();
    expect(result.ReturnName).toBe("Tortellini");
    expect(data).toHaveProperty(properties);
});

function createMockArtifact(): tort.Artifact {
    // Create DLArtFunc
    const downloadArt: tort.DLArtFunc = function (
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
