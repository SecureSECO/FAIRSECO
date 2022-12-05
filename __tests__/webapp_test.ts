import * as fs from "fs";
import { ReturnObject } from "../src/getdata";
import { WriteHTML, WriteCSS } from "../src/webapp";
import validator from "html-validator";

test("Check if html file exists", async () => {
    let fileExists: Boolean = false;
    let mockResult: ReturnObject[] = [];
    let citingPapers: ReturnObject = {
        ReturnName: "citingPapers",
        ReturnData: [],
    };
    let tortellini: ReturnObject = {
        ReturnName: "Tortellini",
        ReturnData: {
            violations: [],
        },
    };
    mockResult[0] = citingPapers;
    mockResult[1] = tortellini;

    WriteHTML(mockResult, "./.FairSECO/index.html").then(() => {
        fileExists = fs.existsSync("./.FairSECO/index.html");
        expect(fileExists).toBe(true);
    });
});

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
