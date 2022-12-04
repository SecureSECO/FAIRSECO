// Test if our openAlexCitations and semanticScholarCitations function work correctly:
// so if the conversion to an array of journals works correctly
// We do this with a JSON schema that determines how the JSON output of the citations should look like
import { openAlexCitations } from "../../src/resources/openalexAPI";
import { semanticScholarCitations } from "../../src/resources/semanticscholarAPI";
import { matchers } from "jest-json-schema";
import { Author } from "../../src/resources/Paper";

expect.extend(matchers);
jest.setTimeout(30000);
//TODO enable test when citingPapers works again
test.skip("Check that openAlexCitations and semanticScholarCitations output json matches the schema", async () => {
    // The schema below defines what our JSON output should look like
    const schema = {
        definitions: {
            citingPapers: {
                type: "object",
                additionalProperties: false,
                properties: {
                    title: {
                        type: "string",
                    },
                    year: {
                        type: "number",
                    },
                    doi: {
                        type: "string",
                    },
                    pmid: {
                        type: "string",
                    },
                    pmcid: {
                        type: "string",
                    },
                    database: {
                        type: "string",
                    },
                    authors: {
                        type: "array",
                    },
                },
                required: [
                    // Should have title, year, authors and reference to database it is from
                    // The id's are not required since some papers don't have these ID's
                    "database",
                    "title",
                    "year",
                    "authors",
                ],
                title: "citingPapers",
            },
        },
    };

    // We use a citation.cff example for the title and authors
    const title = "Parcels";
    const authors: Author[] = [
        new Author("Erik Van Sebille", "https://orcid.org/0000-0003-2041-0704"),
        new Author("Christian Kehl", "https://orcid.org/0000-0003-4200-1450"),
        new Author("Michael Lange", "https://orcid.org/0000-0002-3232-0127"),
        new Author(
            "Philippe Delandmeter",
            "https://orcid.org/0000-0003-0100-5834"
        ),
    ];
    const refTitles: string[] = [];
    //Run openAlexCitations and check if output JSON matches with the predefined schema
    const openAlex_output = await openAlexCitations(authors, title, refTitles);
    expect(openAlex_output).toMatchSchema(schema);
    //Run semanticScholarCitations and check if output JSON matches with the predefined schema
    const semanticScholar_output = await semanticScholarCitations(
        authors,
        title,
        refTitles
    );
    expect(semanticScholar_output).toMatchSchema(schema);
});
