import * as cff from "../../src/resources/citation_cff";

describe("Test getCitationFile", () => {
    jest.setTimeout(60000);
    test("Correct", async () => {
        const result = await cff.getCitationFile(
            "./__tests__/unit_tests/citation_files/correct"
        );

        const cffData: cff.CffObject = result.ReturnData as cff.CffObject;

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
            "./__tests__/unit_tests/citation_files/extra-key"
        );

        const cffData: cff.CffObject = result.ReturnData as cff.CffObject;

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
            "./__tests__/unit_tests/citation_files/incorrect-doi"
        );

        const cffData: cff.CffObject = result.ReturnData as cff.CffObject;

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
            "./__tests__/unit_tests/citation_files/incorrect-version"
        );

        const cffData: cff.CffObject = result.ReturnData as cff.CffObject;

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
            "./__tests__/unit_tests/citation_files/no-authors"
        );

        const cffData: cff.CffObject = result.ReturnData as cff.CffObject;

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
            "./__tests__/unit_tests/citation_files/no-cff-version"
        );

        const cffData: cff.CffObject = result.ReturnData as cff.CffObject;

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
            "./__tests__/unit_tests/citation_files/no-message"
        );

        const cffData: cff.CffObject = result.ReturnData as cff.CffObject;

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
            "./__tests__/unit_tests/citation_files/missing-file"
        );

        const cffData: cff.CffObject = result.ReturnData as cff.CffObject;

        expect(cffData.status).toBe("missing_file");
    });

    test("Incorrect YAML", async () => {
        const result = await cff.getCitationFile(
            "./__tests__/unit_tests/citation_files/incorrect-yaml"
        );

        const cffData: cff.CffObject = result.ReturnData as cff.CffObject;

        expect(cffData.status).toBe("incorrect_yaml");
    });
});

describe("Test GetError", () => {
    test("One Line", () => {
        const input = "Error: Unit Test 1";

        const result = cff.getError(input);

        expect(result).toBe(input);
    });

    test("Error not at the start", () => {
        const input = "Apple Error: Unit Test 2";

        const result = cff.getError(input);

        expect(result).toBe(cff.unknownErrorMsg);
    });

    test("Two Lines", () => {
        const input = "Error: Unit Test 3\n Second line";

        const result = cff.getError(input);

        expect(result).toBe(input.split("\n")[0]);
    });

    test("Garbage", () => {
        const input = "dyy ywy rtyrtywb  sheb";

        const result = cff.getError(input);

        expect(result).toBe(cff.unknownErrorMsg);
    });

    test("Empty String", () => {
        const input = "";

        const result = cff.getError(input);

        expect(result).toBe(cff.unknownErrorMsg);
    });
});
