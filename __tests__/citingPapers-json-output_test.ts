// Test if our openAlexCitations and semanticScholarCitations function work correctly:
// so if the conversion to an array of journals works correctly
// We do this with a JSON schema that determines how the JSON output of the citations should look like
import { openAlexCitations } from "../src/resources/openalexAPI";
import { semanticScholarCitations } from "../src/resources/semanticscholarAPI";
import { matchers } from "jest-json-schema";
expect.extend(matchers);
jest.setTimeout(30000);

test("Check that openAlexCitations and semanticScholarCitations output json matches the schema", async () => {
    // The schema below defines what our JSON output should look like
    const schema = {
        definitions: {
            citingPapers: {
                type: "object",
                additionalProperties: false,
                properties: {
                    title: {
                        "type": "string"
                    },
                    year: {
                        "type": "integer"
                    },
                    doi: {
                        "type": "string"
                    },
                    pmid: {
                        "type": "string"
                    },
                    pmcid: {
                        "type": "string"
                    },
                    database: {
                        "type" : "string"
                    }
                },
                required: [
                    // Should have title, year, reference to database it is from
                    // The id's are not required since some papers don't have these ID's
                    "database",
                    "title",
                    "year"
                ],
                title: "citingPapers",
            },
        },
    };

    // We use a predefined title example
    const title = "ss-TEA: Entropy based identification of receptor specific ligand binding residues from a multiple sequence alignment of class A GPCRs"
    //Run openAlexCitations and check if output JSON matches with the predefined schema
    const openAlex_output = await openAlexCitations(title);
    expect(openAlex_output).toMatchSchema(schema);
    //Run semanticScholarCitations and check if output JSON matches with the predefined schema
    const semanticScholar_output = await semanticScholarCitations(title);
    expect(semanticScholar_output).toMatchSchema(schema);
});