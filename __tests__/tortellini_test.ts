import { runTortellini, functionsToTest } from "../src/resources/tortellini";
import { expect, test } from "@jest/globals";
import * as fs from "fs";
import * as artifact from "@actions/artifact";
import YAML from "yaml";

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

function uploadDummyArtifact(
    artName: string,
    location: string,
    content: string,
    fileName: string
) {
    try {
        fs.mkdirSync(location);
    } catch {
        console.log("Folder " + location + " already exists");
    }
    const fd: number = fs.openSync(location + "/" + fileName, "w+");
    try {
        //console.log(result);
        fs.writeSync(fd, content);
        //console.log("Successfully wrote YML file to dir");
        fs.closeSync(fd);
    } catch {
        console.error("Error writing file");
    }
    const artClient = artifact.create();
    artClient.uploadArtifact(artName, [location + "/" + fileName], location);
}
