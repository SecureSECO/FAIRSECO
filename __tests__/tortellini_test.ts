import { runTortellini, functionsToTest } from "../src/resources/tortellini";
import { expect, test } from "@jest/globals";
import * as fs from "fs";
import * as artifact from "@actions/artifact";
import YAML from "yaml";

const { getArtifactData, getFileFromArtifact } = functionsToTest;

test("Test retrieval of artifacts", async () => {
    uploadDummyArtifact(
        "getArtifactData-test",
        "./.getArtifactData-test/in",
        "test",
        "test.txt"
    );
    const dlResponse = await getArtifactData(
        "getArtifactData-test",
        "./.getArtifactData-test/out"
    );
    const result = await getFileFromArtifact(dlResponse, "test.txt");

    expect(result).toBe("test");
});

test("Test if runTortellini returns a correct ReturnObject", async () => {
    const yamlContent = {
        test1: "value1",
        test2: "value2",
    };
    const content = YAML.stringify(yamlContent);
    uploadDummyArtifact(
        "runTortellini-test",
        "./.runTortellini-test/in",
        content,
        "test.yml"
    );

    const dlResponse = await getArtifactData(
        "runTortellini-test",
        "./.runTortellini-test/out"
    );
    const result = await getFileFromArtifact(dlResponse, "test.yml");

    const parsedResult = YAML.parse(result);

    expect(parsedResult).toEqual(yamlContent);
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
        console.error("Error writing txt file");
    }
    const artClient = artifact.create();
    artClient.uploadArtifact(artName, [location + "test.txt"], location);
}
