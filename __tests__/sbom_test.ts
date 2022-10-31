import * as fs from 'fs'
import { ReturnObject } from '../src/getdata';
import { runSBOM } from "../src/resources/sbom";

test("Check if sbom file exists", async () => {
    let fileExists: Boolean = false;
    let mockResult: ReturnObject[] = []
    let mockSingleResult: ReturnObject = {
        ReturnName: "test",
        ReturnData: {}
    }
    mockResult[0] = mockSingleResult;

    runSBOM().then(() => {
        fileExists = fs.existsSync("./.SBOM-unit-test/SBOM.spdx");
        console.log("exists")
        expect(fileExists).toBe(true);
    }).catch(() => {
        console.log("does not exist")
        expect(fileExists).toBe(true);
    })
});