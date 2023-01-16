import * as fs from "fs";
// import { ReturnObject } from "../../src/getdata";
import { WriteHTML } from "../../src/webapp";

test("Check if html file exists", async () => {
    let fd = fs.openSync("./__tests__/data/ejstestdata.json", "r");
    let mockResult = JSON.parse(fs.readFileSync(fd).toString());

    WriteHTML(mockResult.data, "./.FAIRSECO/index.html").then(() => {
        let fileExists = fs.existsSync("./.FAIRSECO/index.html");
        expect(fileExists).toBe(true);
    });
});
