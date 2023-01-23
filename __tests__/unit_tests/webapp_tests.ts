import * as fs from "fs";
// import { ReturnObject } from "../../src/getdata";
import { WriteHTML } from "../../src/webapp";
import {ReturnObject} from '../../src/getdata'
import testData from '../data/ejstestdata.json'

describe('WriteHTML still generates files with', () => {
    // Collect all the returnnames from our test data into an array, so we can test these objects being ommitted
    const returnNames : String[] = [];
    testData.data.forEach((obj) => returnNames.push(obj.ModuleName));
    
    test.each(returnNames)('%s ommitted from the results.', async (toBeOmitted) => {
        const modifiedData: ReturnObject[] = testData.data.filter(
            (obj) => obj.ModuleName !== toBeOmitted
        );
        return expect(WriteHTML(modifiedData, "./.FairSECO/index.html")).resolves.not.toThrow()
    });
});
