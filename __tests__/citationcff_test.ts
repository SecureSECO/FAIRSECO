import * as cff from "../src/resources/citations";

describe("Test getCitationFile", () => {
    jest.setTimeout(60000);
    test("Correct", async () => {
        const result = await cff.getCitationFile(
            "./__tests__/citation_files/CITATION-correct.cff"
        );

        const cffData: cff.CFFObject = result.ReturnData as cff.CFFObject;

        console.log(result);

        console.log(cffData);

        expect(cffData.status).toBe("valid");

        if (cffData.status == "valid") {
            expect(cffData.citation["cff-version"]).not.toBeUndefined();
            expect(cffData.citation).toHaveProperty("title");
            expect(cffData.citation).toHaveProperty("authors");
            expect(cffData.citation).toHaveProperty("message");
        }
    });

    test("Extra Key", async () => {
        const result = await cff.getCitationFile(
            "./__tests__/citation_files/CITATION-extra-key.cff"
        );

        const cffData: cff.CFFObject = result.ReturnData as cff.CFFObject;

        console.log(result);

        console.log(cffData);

        expect(cffData.status).toBe("validation_error");

        if (cffData.status == "validation_error") {
            expect(cffData.citation["cff-version"]).not.toBeUndefined();
            expect(cffData.citation).toHaveProperty("title");
            expect(cffData.citation).toHaveProperty("authors");
            expect(cffData.citation).toHaveProperty("message");
        }
    });

    test("Incorrect DOI", async () => {
        const result = await cff.getCitationFile(
            "./__tests__/citation_files/CITATION-incorrect-doi.cff"
        );

        const cffData: cff.CFFObject = result.ReturnData as cff.CFFObject;

        console.log(result);

        console.log(cffData);

        expect(cffData.status).toBe("validation_error");

        if (cffData.status == "valid") {
            expect(cffData.citation["cff-version"]).not.toBeUndefined();
            expect(cffData.citation).toHaveProperty("title");
            expect(cffData.citation).toHaveProperty("authors");
            expect(cffData.citation).toHaveProperty("message");
        }
    });

    test("Incorrect Version", async () => {
        const result = await cff.getCitationFile(
            "./__tests__/citation_files/CITATION-incorrect-version.cff"
        );

        const cffData: cff.CFFObject = result.ReturnData as cff.CFFObject;

        console.log(result);

        console.log(cffData);

        expect(cffData.status).toBe("validation_error");

        if (cffData.status == "validation_error") {
            expect(cffData.citation["cff-version"]).not.toBeUndefined();
            expect(cffData.citation).toHaveProperty("title");
            expect(cffData.citation).toHaveProperty("authors");
            expect(cffData.citation).toHaveProperty("message");
        }
    });

    test("No Authors", async () => {
        const result = await cff.getCitationFile(
            "./__tests__/citation_files/CITATION-no-authors.cff"
        );

        const cffData: cff.CFFObject = result.ReturnData as cff.CFFObject;

        console.log(result);

        console.log(cffData);

        expect(cffData.status).toBe("validation_error");

        if (cffData.status == "validation_error") {
            expect(cffData.citation["cff-version"]).not.toBeUndefined();
            expect(cffData.citation).toHaveProperty("title");
            expect(cffData.citation).toHaveProperty("authors");
            expect(cffData.citation).toHaveProperty("message");
        }
    });

    test("No cff-version", async () => {
        const result = await cff.getCitationFile(
            "./__tests__/citation_files/CITATION-no-cff-version.cff"
        );

        const cffData: cff.CFFObject = result.ReturnData as cff.CFFObject;

        console.log(result);

        console.log(cffData);

        expect(cffData.status).toBe("validation_error");

        if (cffData.status == "validation_error") {
            expect(cffData.citation["cff-version"]).toBeUndefined();
            expect(cffData.citation).toHaveProperty("title");
            expect(cffData.citation).toHaveProperty("authors");
            expect(cffData.citation).toHaveProperty("message");
        }
    });

    test("No message", async () => {
        const result = await cff.getCitationFile(
            "./__tests__/citation_files/CITATION-no-message.cff"
        );

        const cffData: cff.CFFObject = result.ReturnData as cff.CFFObject;

        console.log(result);

        console.log(cffData);

        expect(cffData.status).toBe("validation_error");

        if (cffData.status == "validation_error") {
            expect(cffData.citation["cff-version"]).toBeUndefined();
            expect(cffData.citation).toHaveProperty("title");
            expect(cffData.citation).toHaveProperty("authors");
            expect(cffData.citation).not.toHaveProperty("message");
        }
    });

    test("Missing File", async () => {
        const result = await cff.getCitationFile(
            "./__tests__/citation_files/CITATION-missing-file.cff"
        );

        const cffData: cff.CFFObject = result.ReturnData as cff.CFFObject;

        console.log(result);

        console.log(cffData);

        expect(cffData.status).toBe("missing_file");
    });

    test("Incorrect YAML", async () => {
        const result = await cff.getCitationFile(
            "./__tests__/citation_files/CITATION-incorrect-yaml.cff"
        );

        const cffData: cff.CFFObject = result.ReturnData as cff.CFFObject;

        console.log(result);

        console.log(cffData);

        expect(cffData.status).toBe("incorrect_yaml");
    });
});
