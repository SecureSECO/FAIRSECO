import * as fs from 'fs'
import { ReturnObject } from '../src/getdata';
import {WriteHTML, WriteCSS} from '../src/webapp'

test("Check if html file exists", async () => {
    let fileExists: Boolean = false;
    let mockResult: ReturnObject[] = []
    let mockSingleResult: ReturnObject = {
        ReturnName: "test",
        ReturnData: {}
    }
    mockResult[0] = mockSingleResult;

    WriteHTML(mockResult, "./.FairSECO/index.html").then(() => {
        fileExists = fs.existsSync("./.FairSECO/index.html");
        expect(fileExists).toBe(true);
    }).catch(() => {
        expect(fileExists).toBe(true);
    })
});

test("Check if css file exists", async () => {
    let fileExists: Boolean = false;

    WriteCSS("./.FairSECO/style.css").then(() => {
        fileExists = fs.existsSync("./.FairSECO/style.css");
    }).catch(() => {
        expect(fileExists).toBe(true);
    })
});