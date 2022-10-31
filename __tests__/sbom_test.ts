import * as fs from 'fs'
import { ReturnObject } from '../src/getdata';
import { runSBOM } from "../src/resources/sbom";
import * as art from "../src/resources/helperfunctions/artifact"

const mockArtifact = createMockArtifact();

test("Check if sbom file exists", async () => {
    const outputmodule: ReturnObject = await runSBOM(mockArtifact);
    
    let fileExists: Boolean = false;
    let mockResult: ReturnObject[] = []
    let mockSingleResult: ReturnObject = {
        ReturnName: "test",
        ReturnData: {}
    }
    mockResult[0] = mockSingleResult;

    runSBOM(mockArtifact).then(() => {
        fileExists = fs.existsSync("./.SBOM-unit-test/SBOM.spdx");
        expect(fileExists).toBe(true);
    }).catch(() => {
        expect(fileExists).toBe(true);
    })
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