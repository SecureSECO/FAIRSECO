// Test to check if fairtally works correctly
// We check if fairtally gives the correct JSON output
// Using a json schema and the jest-json-schema package we can run the test with jest
import { runModule } from "../../src/resources/fairtally";
import { matchers } from "jest-json-schema";
import { getGitHubInfo } from "../../src/git";
expect.extend(matchers);
jest.setTimeout(30000);

test("that output json matches the schema", async () => {
    // The schema below defines what our JSON output should look like
    // (what headers and what the types of the values are)
    const schema = {
        definitions: {
            howfairis: {
                type: "object",
                additionalProperties: false,
                properties: {
                    badge: {
                        // Definition that is a URI (URL)
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
                        // The fairness score should be 0 to 5
                        type: "integer",
                        minimum: 0,
                        maximum: 5,
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
                        nullable: "true",
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
                    // All headers are required for the output (but some values can be null)
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

    // Run fairtally and check if output JSON matches with the predefined schema
    const output = await runModule([await getGitHubInfo()]);
    expect(output).toMatchSchema(schema);
});
