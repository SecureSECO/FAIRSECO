import * as fs from "fs";
// import { ReturnObject } from "../../src/getdata";
import { WriteHTML } from "../../src/webapp";

test("Check if html file exists", async () => {
    // let fileExists: Boolean = false;
    // let mockResult: ReturnObject[] = [];
    // let citingPapers: ReturnObject = {
    //     ReturnName: "citingPapers",
    //     ReturnData: [],
    // };
    // let tortellini: ReturnObject = {
    //     ReturnName: "Tortellini",
    //     ReturnData: {
    //         violations: [],
    //     },
    // };
    // mockResult[0] = citingPapers;
    // mockResult[1] = tortellini;

    let fd = fs.openSync("./__tests__/data/ejstestdata.json", "r");
    let mockResult = JSON.parse(fs.readFileSync(fd).toString());

    WriteHTML(mockResult.data, "./.FairSECO/index.html").then(() => {
        let fileExists = fs.existsSync("./.FairSECO/index.html");
        expect(fileExists).toBe(true);
    });
});
