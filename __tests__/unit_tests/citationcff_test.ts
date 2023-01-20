import * as cff from "../../src/resources/citation_cff";

describe("Test runModule", () => {
    jest.setTimeout(60000);
    test("Correct", async () => {
        const result = await cff.runModule(
            ["./__tests__/unit_tests/citation_files/correct"]
        );

        expect(result.status).toBe("valid");

        if (result.status == "valid") {
            expect(result.citation["cff-version"]).not.toBeUndefined();
            expect(result.citation).toHaveProperty("title");
            expect(result.citation).toHaveProperty("authors");
            expect(result.citation).toHaveProperty("message");
        }
    });

    test("Extra Key", async () => {
        const result = await cff.runModule(
            ["./__tests__/unit_tests/citation_files/extra-key"]
        );

        expect(result.status).toBe("validation_error");

        if (result.status == "validation_error") {
            expect(result.citation["cff-version"]).not.toBeUndefined();
            expect(result.citation).toHaveProperty("title");
            expect(result.citation).toHaveProperty("authors");
            expect(result.citation).toHaveProperty("message");
        }
    });

    test("Incorrect DOI", async () => {
        const result = await cff.runModule(
            ["./__tests__/unit_tests/citation_files/incorrect-doi"]
        );

        expect(result.status).toBe("validation_error");

        if (result.status == "valid") {
            expect(result.citation["cff-version"]).not.toBeUndefined();
            expect(result.citation).toHaveProperty("title");
            expect(result.citation).toHaveProperty("authors");
            expect(result.citation).toHaveProperty("message");
        }
    });

    test("Incorrect Version", async () => {
        const result = await cff.runModule(
            ["./__tests__/unit_tests/citation_files/incorrect-version"]
        );

        expect(result.status).toBe("validation_error");

        if (result.status == "validation_error") {
            expect(result.citation["cff-version"]).not.toBeUndefined();
            expect(result.citation).toHaveProperty("title");
            expect(result.citation).toHaveProperty("authors");
            expect(result.citation).toHaveProperty("message");
        }
    });

    test("No Authors", async () => {
        const result = await cff.runModule(
            ["./__tests__/unit_tests/citation_files/no-authors"]
        );

        expect(result.status).toBe("validation_error");

        if (result.status == "validation_error") {
            expect(result.citation["cff-version"]).not.toBeUndefined();
            expect(result.citation).toHaveProperty("title");
            expect(result.citation).toHaveProperty("authors");
            expect(result.citation).toHaveProperty("message");
        }
    });

    test("No cff-version", async () => {
        const result = await cff.runModule(
            ["./__tests__/unit_tests/citation_files/no-cff-version"]
        );

        expect(result.status).toBe("validation_error");

        if (result.status == "validation_error") {
            expect(result.citation["cff-version"]).toBeUndefined();
            expect(result.citation).toHaveProperty("title");
            expect(result.citation).toHaveProperty("authors");
            expect(result.citation).toHaveProperty("message");
        }
    });

    test("No message", async () => {
        const result = await cff.runModule(
            ["./__tests__/unit_tests/citation_files/no-message"]
        );

        expect(result.status).toBe("validation_error");

        if (result.status == "validation_error") {
            expect(result.citation["cff-version"]).toBeUndefined();
            expect(result.citation).toHaveProperty("title");
            expect(result.citation).toHaveProperty("authors");
            expect(result.citation).not.toHaveProperty("message");
        }
    });

    test("Missing File", async () => {
        const result = await cff.runModule(
            ["./__tests__/unit_tests/citation_files/missing-file"]
        );

        expect(result.status).toBe("missing_file");
    });

    test("Incorrect YAML", async () => {
        const result = await cff.runModule(
            ["./__tests__/unit_tests/citation_files/incorrect-yaml"]
        );

        expect(result.status).toBe("incorrect_yaml");
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
