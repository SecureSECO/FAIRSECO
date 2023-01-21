import { post } from "../../src/post";
import { expect, test } from "@jest/globals";
import fs from "fs";
import testData from '../data/ejstestdata.json'
import {ReturnObject} from '../../src/getdata'

// test("Generates .FairSECO folder", async () => {
//     await post([]);
//     let FolderExists: Boolean = false;
//     FolderExists = fs.existsSync("./.FairSECO");
//     expect(FolderExists).toBe(true);
// });
//
describe('Index.html is still generated with', () => {
    // Collect all the returnnames from our test data into an array, so we can test these objects being ommitted
    const returnNames : String[] = [];
    testData.data.forEach((obj) => returnNames.push(obj.ReturnName));
    
    test.each(returnNames)('%s ommitted from the results.', async (toBeOmitted) => {
        const modifiedData: ReturnObject[] = testData.data.filter((obj) => obj.ReturnName !== toBeOmitted);
        await post(modifiedData) 
        let FileExists: Boolean = false;
        FileExists = fs.existsSync("./.FairSECO/index.html");
        expect(FileExists).toBe(true);
    });
});

afterEach(() => {
    fs.rmSync('./FairSECO', {recursive: true, force: true})
});
