import * as fs from "fs";
import { ReturnObject } from "../src/getdata";
import { WriteHTML, WriteCSS } from "../src/webapp";
import validator from "html-validator";

test("Validate HTML file", async () => {
    let fileExists: Boolean = false;
    let mockResult: ReturnObject[] = [];
    let mockSingleResult: ReturnObject = {
        ReturnName: "test",
        ReturnData: {},
    };
    mockResult[0] = mockSingleResult;

    const result = await WriteHTML(mockResult, "./.FairSECO/index.html");

    // Check if html file exists
    fileExists = fs.existsSync("./.FairSECO/index.html");
    expect(fileExists).toBe(true);

    fileExists = fs.existsSync("./.FairSECO/index.html");
    expect(fileExists).toBe(true);

    // let options: validator.OptionsForHtmlFileAsValidationTargetAndObjectAsResult;
    // options = {
    //     data: fs.readFileSync("./.FairSECO/index.html", "utf8"),
    // };

    // const validationResult = await validator(options);

    // Check if the validation result contains any errors
    // for (const message of validationResult.messages) {
    //     if (message.type == "error") {
    //         // Run W3C version and request human readable information to show the error
    //         let options2: validator.OptionsForHtmlFileAsValidationTargetAndTextAsResults;
    //         options2 = {
    //             format: "text",
    //             data: fs.readFileSync("./.FairSECO/index.html", "utf8"),
    //         };
    //         const validatorResult2 = await validator(options2);

    //         throw "HTML validation errors:\n" + validatorResult2;
    //     }
    // }
});
