import * as ss from "../src/resources/searchseco";
import YAML from "yaml";

jest.setTimeout(100000);

describe("Test getHashIndices", () => {
    test("Single Hash", () => {
        const result = ss.getHashIndices(["--------", "Hash 123"]);

        // The input only has a hash on line 0, and the length is 1, so it
        // should return [0, 1]
        expect(result).toEqual([1, 2]);
    });

    test("Multiple consecutive Hashes", () => {
        const input = [
            "--------",
            "Hash 1",
            "--------",
            "Hash 2",
            "--------",
            "Hash 3",
            "--------",
            "Hash 4",
            "--------",
        ];
        const result = ss.getHashIndices(input);

        expect(result).toEqual([1, 3, 5, 7, 9]);
    });

    test("Multiple Hashes with Other Stuff", () => {
        const input = [
            "--------",
            "Hash 1",
            "--------",
            "jhhfg",
            "--------",
            "Hash 2",
            "--------",
            "iwuy4t87rf",
            "--------",
            "Hash 3",
            "--------",
            "Hash 4",
            "--------",
        ];

        const result = ss.getHashIndices(input);

        expect(result).toEqual([1, 5, 9, 11, 13]);
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
    test("Full Input", () => {
        const input = [
            "-----------------------------------------------------------------------------------------------------",
            'Matched the project at "https://github.com/user/project" against the database.',
            "-----------------------------------------------------------------------------------------------------",
            "Summary:",
            "Methods in checked project: 4",
            "Matches: 2 (50%)",
            "Projects found in database:",
            "Local authors present in matches:",
            "Authors present in database matches:",
            "--------------------------------------------------------------------------------------------------------------------------------",
            "Details of matches found",
            "--------------------------------------------------------------------------------------------------------------------------------",
            "---------------",
            "Hash 1234567890",
            "---------------",
            "*Method methodName in file Test.cpp line 24",
            "Authors of local function:",
            "Valia Bykova",
            "DATABASE",
            "*Method functionName1 in project projName1 in file file.ts line 33",
            "URL: https://github.com/user/project",
            "Method marked as vulnerable with code: 123(https://www.url-of-vulnerability.com)",
            "Authors of function found in database:",
            "Tjibbe Bolhuis",
            "Rowin Schouten",
            "*Method functionName2 in project projName2 in file file.cpp line 39",
            "URL: https://github.com/user/project",
            "Method marked as vulnerable with code: 123(https://www.url-of-vulnerability.com)",
            "Authors of function found in database:",
            "Quinn Donkers",
            "Jarno Hendriksen",
            "---------------",
            "Hash 9876544322",
            "---------------",
            "*Method otherMethod in file OtherFile.cpp line 180",
            "Authors of local function:",
            "Bram Lankhorst",
            "DATABASE",
            "*Method otherMethod in project projName1 in file file.cpp line 88",
            "URL: https://github.com/user/project",
            "Method marked as vulnerable with code: 123(https://www.url-of-vulnerability.com)",
            "Authors of function found in database:",
            "Bart Hageman",
            "Alina Aydin",
        ];

        const hashlines = ss.getHashIndices(input);

        const hash1matches = ss.getMatches(input, hashlines[0], hashlines[1]);
        const hash2matches = ss.getMatches(input, hashlines[1], hashlines[2]);

        expect(hash1matches[0].data.name).toBe("functionName1");
        expect(hash1matches[0].data.file).toBe("file.ts");
        expect(hash1matches[0].data.project).toBe("projName1");
        expect(hash1matches[0].data.line).toBe(33);
        expect(hash1matches[0].data.authors).toEqual([
            "Tjibbe Bolhuis",
            "Rowin Schouten",
        ]);

        expect(hash1matches[0].vuln.code).toBe(123);
        expect(hash1matches[0].vuln.url).toBe(
            "https://www.url-of-vulnerability.com"
        );

        expect(hash1matches[1].data.name).toBe("functionName2");
        expect(hash1matches[1].data.file).toBe("file.cpp");
        expect(hash1matches[1].data.project).toBe("projName2");
        expect(hash1matches[1].data.line).toBe(39);
        expect(hash1matches[1].data.authors).toEqual([
            "Quinn Donkers",
            "Jarno Hendriksen",
        ]);

        expect(hash1matches[1].vuln.code).toBe(123);
        expect(hash1matches[1].vuln.url).toBe(
            "https://www.url-of-vulnerability.com"
        );

        expect(hash2matches[0].data.name).toBe("otherMethod");
        expect(hash2matches[0].data.file).toBe("file.cpp");
        expect(hash2matches[0].data.project).toBe("projName1");
        expect(hash2matches[0].data.line).toBe(88);
        expect(hash2matches[0].data.authors).toEqual([
            "Bart Hageman",
            "Alina Aydin",
        ]);

        expect(hash2matches[0].vuln.code).toBe(123);
        expect(hash2matches[0].vuln.url).toBe(
            "https://www.url-of-vulnerability.com"
        );
    });

    test("Two Matches, All lines", () => {
        const input = [
            "*Method twoMatches", // This is needed, because the function skips the first occurrence of *Method
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

describe("Test parseInput", () => {
    test("Full Input", () => {
        const input = [
            "-----------------------------------------------------------------------------------------------------",
            'Matched the project at "https://github.com/user/project" against the database.',
            "-----------------------------------------------------------------------------------------------------",
            "Summary:",
            "Methods in checked project: 4",
            "Matches: 2 (50%)",
            "Projects found in database:",
            "Local authors present in matches:",
            "Authors present in database matches:",
            "--------------------------------------------------------------------------------------------------------------------------------",
            "Details of matches found",
            "--------------------------------------------------------------------------------------------------------------------------------",
            "---------------",
            "Hash 1234567890",
            "---------------",
            "*Method methodName in file Test.cpp line 24",
            "Authors of local function:",
            "Valia Bykova",
            "DATABASE",
            "*Method functionName1 in project projName1 in file file.ts line 33",
            "URL: https://github.com/user/project",
            "Method marked as vulnerable with code: 123(https://www.url-of-vulnerability.com)",
            "Authors of function found in database:",
            "Tjibbe Bolhuis",
            "Rowin Schouten",
            "*Method functionName2 in project projName2 in file file.cpp line 39",
            "URL: https://github.com/user/project",
            "Method marked as vulnerable with code: 123(https://www.url-of-vulnerability.com)",
            "Authors of function found in database:",
            "Quinn Donkers",
            "Jarno Hendriksen",
            "---------------",
            "Hash 9876544322",
            "---------------",
            "*Method otherMethod in file OtherFile.cpp line 180",
            "Authors of local function:",
            "Bram Lankhorst",
            "DATABASE",
            "*Method otherMethod in project projName1 in file file.cpp line 88",
            "URL: https://github.com/user/project",
            "Method marked as vulnerable with code: 123(https://www.url-of-vulnerability.com)",
            "Authors of function found in database:",
            "Bart Hageman",
            "Alina Aydin",
        ];

        const result = ss.parseInput(input);

        expect(result.methods[0].hash).toBe("1234567890");
        expect(result.methods[0].data.name).toBe("methodName");
        expect(result.methods[0].data.file).toBe("Test.cpp");
        expect(result.methods[0].data.line).toBe(24);
        expect(result.methods[0].data.authors).toEqual(["Valia Bykova"]);

        expect(result.methods[1].hash).toBe("9876544322");
        expect(result.methods[1].data.name).toBe("otherMethod");
        expect(result.methods[1].data.file).toBe("OtherFile.cpp");
        expect(result.methods[1].data.line).toBe(180);
        expect(result.methods[1].data.authors).toEqual(["Bram Lankhorst"]);

        const hash1matches = result.methods[0].matches;
        const hash2matches = result.methods[1].matches;

        expect(hash1matches[0].data.name).toBe("functionName1");
        expect(hash1matches[0].data.file).toBe("file.ts");
        expect(hash1matches[0].data.project).toBe("projName1");
        expect(hash1matches[0].data.line).toBe(33);
        expect(hash1matches[0].data.authors).toEqual([
            "Tjibbe Bolhuis",
            "Rowin Schouten",
        ]);

        expect(hash1matches[0].vuln.code).toBe(123);
        expect(hash1matches[0].vuln.url).toBe(
            "https://www.url-of-vulnerability.com"
        );

        expect(hash1matches[1].data.name).toBe("functionName2");
        expect(hash1matches[1].data.file).toBe("file.cpp");
        expect(hash1matches[1].data.project).toBe("projName2");
        expect(hash1matches[1].data.line).toBe(39);
        expect(hash1matches[1].data.authors).toEqual([
            "Quinn Donkers",
            "Jarno Hendriksen",
        ]);

        expect(hash1matches[1].vuln.code).toBe(123);
        expect(hash1matches[1].vuln.url).toBe(
            "https://www.url-of-vulnerability.com"
        );

        expect(hash2matches[0].data.name).toBe("otherMethod");
        expect(hash2matches[0].data.file).toBe("file.cpp");
        expect(hash2matches[0].data.project).toBe("projName1");
        expect(hash2matches[0].data.line).toBe(88);
        expect(hash2matches[0].data.authors).toEqual([
            "Bart Hageman",
            "Alina Aydin",
        ]);

        expect(hash2matches[0].vuln.code).toBe(123);
        expect(hash2matches[0].vuln.url).toBe(
            "https://www.url-of-vulnerability.com"
        );
    });

    test("Only Header", () => {
        const input = [
            "-----------------------------------------------------------------------------------------------------",
            'Matched the project at "https://github.com/user/project" against the database.',
            "-----------------------------------------------------------------------------------------------------",
            "Summary:",
            "Methods in checked project: 4",
            "Matches: 2 (50%)",
            "Projects found in database:",
            "Local authors present in matches:",
            "Authors present in database matches:",
            "--------------------------------------------------------------------------------------------------------------------------------",
            "Details of matches found",
            "--------------------------------------------------------------------------------------------------------------------------------",
        ];

        const result = ss.parseInput(input);

        expect(result.methods).toEqual([]);
    });
});

test("Test runSearchSECO", async () => {
    const getRepoFn = jest.fn();
    getRepoFn.mockReturnValue("https://github.com/rowins/test");
    const result = await ss.runSearchseco(getRepoFn, true);

    // Since the previous tests already check if the data is processed correctly,
    // we only need to check if SearchSECO gets executed at all, and if it can
    // create some kind of output. If the output is a non-empty object,
    // we know that it has succeeded.
    expect(result.ReturnName).toBe("SearchSeco");
    expect(result.ReturnData).toBeTruthy();
    expect(result.ReturnData).not.toEqual({});
});
