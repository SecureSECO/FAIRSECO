import * as fs from 'fs'
import { ReturnObject } from '../src/getdata';
import { runSBOM } from "../src/resources/sbom";

test("Check if sbom file exists", async () => {
    const outputmodule: ReturnObject = await runSBOM();    
});