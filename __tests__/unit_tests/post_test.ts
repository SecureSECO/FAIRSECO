import { post } from "../../src/post";
import { expect, test } from "@jest/globals";
import fs from "fs";
import testData from '../data/ejstestdata.json'
import {ReturnObject} from '../../src/getdata'

// Do we really need a test to see if a folder is created? This is not part of our functionality.

// test("Generates .FairSECO folder", async () => {
//     await post([]);
//     let FolderExists: Boolean = false;
//     FolderExists = fs.existsSync("./.FairSECO");
//     expect(FolderExists).toBe(true);
// });

