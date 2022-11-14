import * as tort from "../src/resources/tortellini";
import * as input from "../src/resources/tortellini-input";
import * as art from "../src/resources/helperfunctions/artifact";
import { expect, test } from "@jest/globals";

// Mock the tortellini-input module to replace used artifact object and file path for unit tests
jest.mock("../src/resources/tortellini-input", () => {
    const actualModule = jest.requireActual(
        "../src/resources/tortellini-input"
    );

    return {
        __esModule: true,
        ...actualModule,
        artifactObject: {
            create: () => {
                const client: art.ArtifactClient = {
                    downloadArtifact: async (
                        name: string,
                        path: string,
                        options?: art.DownloadOptions | undefined
                    ) => {
                        return { artifactName: name, downloadPath: path };
                    },
                };

                return client;
            },
        },
        destination: "__tests__/.tortellini-unit-test",
    };
});

test("Check if a correct downloadResponse is generated", async () => {
    const dlResponse = await art.getArtifactData(
        "tortellini-result",
        input.destination,
        input.artifactObject
    );

    expect(dlResponse).toEqual({
        artifactName: "tortellini-result",
        downloadPath: input.destination,
    });
});

test("Check if a file can be retrieved with the downloadResponse", async () => {
    const dlResponse = await art.getArtifactData(
        "tortellini-result",
        input.destination,
        input.artifactObject
    );

    const result = await art.getFileFromArtifact(dlResponse, "correct.yml");

    // If the result is not truthy, it is either an empty string or undefined,
    // which is not correct
    expect(result).toBeTruthy();
});

describe("Test runTortellini", () => {
    test("Correct Input", async () => {
        const result = await tort.runTortellini("correct.yml");

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

    test("No Packages", async () => {
        const result = await tort.runTortellini("no-packages.yml");

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
        expect(data.packages).toEqual([]);

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

    test("No Violations", async () => {
        const result = await tort.runTortellini("no-violations.yml");

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
        expect(data.violations).toEqual(null);
    });

    test("No Project Info", async () => {
        const result = await tort.runTortellini("no-project-info.yml");

        const data: any = result.ReturnData;

        expect(result).not.toBeUndefined();
        expect(result.ReturnName).toBe("Tortellini");
        expect(data).toHaveProperty("project");
        const proj = data.project;
        expect(proj).toHaveProperty("id");
        expect(proj).toHaveProperty("licenses");
        expect(proj).toHaveProperty("authors");
        expect(proj).toHaveProperty("vcs");

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

    test("Empty File", async () => {
        const result = await tort.runTortellini("empty-file.yml");

        expect(result.ReturnData).toEqual({});
    });
});
