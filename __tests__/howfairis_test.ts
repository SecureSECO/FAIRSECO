import { runHowfairis } from "../src/resources/howfairis";
import { ReturnObject } from "../src/getdata";
import { matchers } from "jest-json-schema";
expect.extend(matchers);
jest.setTimeout(30000);

test("that output json matches the schema", async () => {
    const schema = {
        definitions: {
            howfairis: {
                type: "object",
                additionalProperties: false,
                properties: {
                    badge: {
                        type: "string",
                        format: "uri",
                        "qt-uri-protocols": ["https"],
                    },
                    checklist: {
                        type: "boolean",
                    },
                    citation: {
                        type: "boolean",
                    },
                    count: {
                        type: "integer",
                    },
                    license: {
                        type: "boolean",
                    },
                    registry: {
                        type: "boolean",
                    },
                    repository: {
                        type: "boolean",
                    },
                    stderr: {
                        type: "string",
                    },
                    stdout: {
                        type: "string",
                    },
                    url: {
                        type: "string",
                        format: "uri",
                        "qt-uri-protocols": ["https"],
                    },
                },
                required: [
                    "badge",
                    "checklist",
                    "citation",
                    "count",
                    "license",
                    "registry",
                    "repository",
                    "stderr",
                    "stdout",
                    "url",
                ],
                title: "howfairis",
            },
        },
    };

    // const githubtesturl = 'https://github.com/QDUNI/FairSECO/';
    const outputmodule: ReturnObject = await runHowfairis();
    console.log(outputmodule.ReturnData);
    expect(outputmodule).toMatchSchema(schema);
});
