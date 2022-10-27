import * as ss from "../src/resources/searchseco";

describe("Test getHashIndices", () => {
    test("Single Hash", () => {
        const result = ss.getHashIndices(["Hash 123"]);

        // The input only has a hash on line 0, and the length is 1, so it
        // should return [0, 1]
        expect(result).toEqual([0, 1]);
    });

    test("Multiple consecutive Hashes", () => {
        const input = ["Hash 1", "Hash 2", "Hash 3", "Hash 4"];
        const result = ss.getHashIndices(input);

        expect(result).toEqual([0, 1, 2, 3, 4]);
    });

    test("Multiple Hashes with Other Stuff", () => {
        const input = [
            "Hash 1",
            "jhhfg",
            "Hash 2",
            "iwuy4t87rf",
            "Hash 3",
            "Hash4",
        ];

        const result = ss.getHashIndices(input);

        expect(result).toEqual([0, 2, 4, 5, 6]);
    });

    test("Multiple Lines of Other Stuff", () => {
        const input = [
            "iweggfiyf",
            "iw7rbf",
            "wfigibow",
            "b7gw8vbri",
            "webvuov",
        ];
        const result = ss.getHashIndices(input);

        expect(result).toEqual([5]);
    });

    test("Empty input", () => {
        const result = ss.getHashIndices([]);

        expect(result).toEqual([0]);
    });
});

describe("Test getMethodInfo", () => {
    test("Normal input, one Author", () => {
        const input = [
            "*Method unitTest1 in file searchseco_test.ts line 56",
            "Authors of local function:",
            "Jarno Hendriksen",
        ];
        const result = ss.getMethodInfo(input, 0, input.length);

        expect(result.name).toBe("unitTest1");
        expect(result.file).toBe("searchseco_test.ts");
        expect(result.line).toBe(56);
        expect(result.authors).toEqual(["Jarno Hendriksen"]);
    });

    test("Normal input, several Authors", () => {
        const input = [
            "*Method unitTest2 in file searchseco_test.ts line 71",
            "Authors of local function:",
            "Jarno Hendriksen",
            "Rowin Schouten",
            "Bram Lankhorst",
        ];
        const result = ss.getMethodInfo(input, 0, input.length);

        expect(result.name).toBe("unitTest2");
        expect(result.file).toBe("searchseco_test.ts");
        expect(result.line).toBe(71);
        expect(result.authors).toEqual([
            "Jarno Hendriksen",
            "Rowin Schouten",
            "Bram Lankhorst",
        ]);
    });

    test("No Authors", () => {
        const input = [
            "*Method unitTest3 in file searchseco_test.ts line 91",
            "Authors of local function:",
        ];
        const result = ss.getMethodInfo(input, 0, input.length);

        expect(result.name).toBe("unitTest3");
        expect(result.file).toBe("searchseco_test.ts");
        expect(result.line).toBe(91);
        expect(result.authors).toEqual([]);
    });

    test("Missing Method Name", () => {
        const input = [
            "*Method  in file searchseco_test.ts line 91",
            "Authors of local function:",
        ];

        expect(() => ss.getMethodInfo(input, 0, input.length)).toThrow();
    });

    test("Missing File Name", () => {
        const input = [
            "*Method unitTest4 in file  line 117",
            "Authors of local function:",
        ];

        expect(() => ss.getMethodInfo(input, 0, input.length)).toThrow();
    });
});

describe("Test getMatchIndicesOfHash", () => {
    test("Single Line", () => {
        const input = ["*Method unitTest5 in file searchseco_test.ts line 131"];
        const result = ss.getMatchIndicesOfHash(input, 0, input.length);

        expect(result).toEqual([0]);
    });

    test("Multiple Consecutive Lines", () => {
        const input = [
            "*Method unitTest6 in file searchseco_test.ts line 131",
            "*Method unitTest7 in file searchseco_test.ts line 132",
            "*Method unitTest8 in file searchseco_test.ts line 133",
            "*Method unitTest9 in file searchseco_test.ts line 134",
        ];
        const result = ss.getMatchIndicesOfHash(input, 0, input.length);

        expect(result).toEqual([0, 1, 2, 3]);
    });

    test("Multiple Lines with Other Stuff", () => {
        const input = [
            "*Method unitTest6 in file searchseco_test.ts line 131",
            "ksegrtviub54",
            "*Method unitTest8 in file searchseco_test.ts line 133",
            "eye5yvibti5w",
            "*Method unitTest8 in file searchseco_test.ts line 133",
            "*Method unitTest8 in file searchseco_test.ts line 133",
        ];
        const result = ss.getMatchIndicesOfHash(input, 0, input.length);

        expect(result).toEqual([0, 2, 4, 5]);
    });

    test("Multiple Lines of Other Stuff", () => {
        const input = ["ksegrtviub54", "eye5yvibti5w"];
        const result = ss.getMatchIndicesOfHash(input, 0, input.length);

        expect(result).toEqual([]);
    });

    test("Empty String", () => {
        const input = [""];
        const result = ss.getMatchIndicesOfHash(input, 0, input.length);

        expect(result).toEqual([]);
    });

    test("Empty Input", () => {
        const input: string[] = [];
        const result = ss.getMatchIndicesOfHash(input, 0, input.length);

        expect(result).toEqual([]);
    });
});

describe("Test getMatches", () => {
    test("Complete Input", () => {
        const input = [
            "*Method completeInput", // This is needed, because the function skips the first occurrence of *Method
            "*Method unitTest10 in project SearchSECOController in file print.cpp line 188",
            "URL: https://github.com/secureSECO/SearchSECOController",
            "Method marked as vulnerable with code: 123(https://www.url-of-vulnerability.com)",
            "Authors of function found in database:",
            "Jarno Hendriksen",
            "Rowin Schouten",
            "*Method unitTest11 in project TrustSECO in file test.cpp line 194",
            "URL: https://github.com/secureSECO/TrustSECO",
            "Method marked as vulnerable with code: 246(https://www.url-of-vulnerability.com)",
            "Authors of function found in database:",
            "Tjibbe Bolhuis",
            "Alina Aydin",
        ];

        const result = ss.getMatches(input, 0, input.length);

        const res0 = result[0];
        const res1 = result[1];

        expect(res0.data.name).toBe("unitTest10");
        expect(res0.data.file).toBe("print.cpp");
        expect(res0.data.project).toBe("SearchSECOController");
        expect(res0.data.line).toBe(188);
        expect(res0.data.authors).toEqual([
            "Jarno Hendriksen",
            "Rowin Schouten",
        ]);

        expect(res0.vuln.code).toBe(123);
        expect(res0.vuln.url).toBe("https://www.url-of-vulnerability.com");

        expect(res1.data.name).toBe("unitTest11");
        expect(res1.data.file).toBe("test.cpp");
        expect(res1.data.project).toBe("TrustSECO");
        expect(res1.data.line).toBe(194);
        expect(res1.data.authors).toEqual(["Tjibbe Bolhuis", "Alina Aydin"]);

        expect(res1.vuln.code).toBe(246);
        expect(res1.vuln.url).toBe("https://www.url-of-vulnerability.com");
    });

    test("Missing Vulnerabilities", () => {
        const input = [
            "*Method missingVulns", // This is needed, because the function skips the first occurrence of *Method
            "*Method unitTest10 in project SearchSECOController in file print.cpp line 188",
            "URL: https://github.com/secureSECO/SearchSECOController",
            "Authors of function found in database:",
            "Jarno Hendriksen",
            "Rowin Schouten",
            "*Method unitTest11 in project TrustSECO in file test.cpp line 194",
            "URL: https://github.com/secureSECO/TrustSECO",
            "Authors of function found in database:",
            "Tjibbe Bolhuis",
            "Alina Aydin",
        ];

        const result = ss.getMatches(input, 0, input.length);

        const res0 = result[0];
        const res1 = result[1];

        expect(res0.data.name).toBe("unitTest10");
        expect(res0.data.file).toBe("print.cpp");
        expect(res0.data.project).toBe("SearchSECOController");
        expect(res0.data.line).toBe(188);
        expect(res0.data.authors).toEqual([
            "Jarno Hendriksen",
            "Rowin Schouten",
        ]);

        expect(res0.vuln.code).toBe(-1);
        expect(res0.vuln.url).toBe("-");

        expect(res1.data.name).toBe("unitTest11");
        expect(res1.data.file).toBe("test.cpp");
        expect(res1.data.project).toBe("TrustSECO");
        expect(res1.data.line).toBe(194);
        expect(res1.data.authors).toEqual(["Tjibbe Bolhuis", "Alina Aydin"]);

        expect(res1.vuln.code).toBe(-1);
        expect(res1.vuln.url).toBe("-");
    });

    test("Missing Authors", () => {
        const input = [
            "*Method missingAuthors", // This is needed, because the function skips the first occurrence of *Method
            "*Method unitTest10 in project SearchSECOController in file print.cpp line 188",
            "URL: https://github.com/secureSECO/SearchSECOController",
            "Method marked as vulnerable with code: 123(https://www.url-of-vulnerability.com)",
            "*Method unitTest11 in project TrustSECO in file test.cpp line 194",
            "URL: https://github.com/secureSECO/TrustSECO",
            "Method marked as vulnerable with code: 246(https://www.url-of-vulnerability.com)",
        ];

        const result = ss.getMatches(input, 0, input.length);

        const res0 = result[0];
        const res1 = result[1];

        expect(res0.data.name).toBe("unitTest10");
        expect(res0.data.file).toBe("print.cpp");
        expect(res0.data.project).toBe("SearchSECOController");
        expect(res0.data.line).toBe(188);
        expect(res0.data.authors).toEqual([]);

        expect(res0.vuln.code).toBe(123);
        expect(res0.vuln.url).toBe("https://www.url-of-vulnerability.com");

        expect(res1.data.name).toBe("unitTest11");
        expect(res1.data.file).toBe("test.cpp");
        expect(res1.data.project).toBe("TrustSECO");
        expect(res1.data.line).toBe(194);
        expect(res1.data.authors).toEqual([]);

        expect(res1.vuln.code).toBe(246);
        expect(res1.vuln.url).toBe("https://www.url-of-vulnerability.com");
    });

    test("Missing Vulnerabilities and Authors", () => {
        const input = [
            "*Method missingVulnAuthors", // This is needed, because the function skips the first occurrence of *Method
            "*Method unitTest10 in project SearchSECOController in file print.cpp line 188",
            "URL: https://github.com/secureSECO/SearchSECOController",
            "*Method unitTest11 in project TrustSECO in file test.cpp line 194",
            "URL: https://github.com/secureSECO/TrustSECO",
        ];

        const result = ss.getMatches(input, 0, input.length);

        const res0 = result[0];
        const res1 = result[1];

        expect(res0.data.name).toBe("unitTest10");
        expect(res0.data.file).toBe("print.cpp");
        expect(res0.data.project).toBe("SearchSECOController");
        expect(res0.data.line).toBe(188);
        expect(res0.data.authors).toEqual([]);

        expect(res0.vuln.code).toBe(-1);
        expect(res0.vuln.url).toBe("-");

        expect(res1.data.name).toBe("unitTest11");
        expect(res1.data.file).toBe("test.cpp");
        expect(res1.data.project).toBe("TrustSECO");
        expect(res1.data.line).toBe(194);
        expect(res1.data.authors).toEqual([]);

        expect(res1.vuln.code).toBe(-1);
        expect(res1.vuln.url).toBe("-");
    });
});
