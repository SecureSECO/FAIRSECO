import * as tort from "../src/resources/tortellini";
import * as art from "../src/resources/helperfunctions/artifact"
import { expect, test } from "@jest/globals";

const mockArtifact = createMockArtifact();

test("Check if a correct downloadResponse is generated", async () => {
    const dlResponse = await art.getArtifactData(
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
    const dlResponse = await art.getArtifactData(
        "tortellini-result",
        ".tortellini-unit-test",
        mockArtifact
    );

    const result = await art.getFileFromArtifact(
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

    expect(result).not.toBeUndefined();
    expect(result.ReturnName).toBe("Tortellini");
    expect(data).toHaveProperty("project");
    const proj = data.project;
    expect(proj).toHaveProperty("id");
    expect(proj).toHaveProperty("licenses");
    expect(proj).toHaveProperty("authors");
    expect(proj).toHaveProperty("vcs");
    expect(proj.vcs).toHaveProperty("url");

    expect(data).toHaveProperty("packages");
    const pack = data.packages[0];
    expect(pack).toHaveProperty("id");
    expect(pack).toHaveProperty("licenses");
    expect(pack).toHaveProperty("description");
    expect(pack).toHaveProperty("authors");
    expect(pack).toHaveProperty("vcs");
    expect(pack.vcs).toHaveProperty("url");

    expect(data).toHaveProperty("violations");
    const viol = data.violations[0];
    expect(viol).toHaveProperty("rule");
    expect(viol).toHaveProperty("pkg");
    expect(viol).toHaveProperty("license");
    expect(viol).toHaveProperty("license_source");
    expect(viol).toHaveProperty("severity");
    expect(viol).toHaveProperty("message");
    expect(viol).toHaveProperty("how_to_fix");
});

function createMockArtifact(): art.Artifact {
    // Create DLArtFunc
    const downloadArt: art.DLArtFunc = function (
        name: string,
        path?: string | undefined,
        options?: art.DownloadOptions
    ) {
        return { artifactName: name, downloadPath: path };
    };

    // Create TestClient
    const client: art.TestClient = { downloadArtifact: downloadArt };

    // Create create function
    const create_ = function () {
        return client;
    };

    const testArt: art.TestArtifact = { create: create_ };

    // Create TestArtifact
    return testArt;
}
