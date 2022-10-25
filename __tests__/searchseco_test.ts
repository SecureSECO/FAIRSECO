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

    test("Multiple Hashes with gibberish in between", () => {
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

    test("Only gibberish", () => {
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
        const result = ss.getMethodInfo(input, 0, input.length);

        expect(result.name).toBe("");
        expect(result.file).toBe("searchseco_test.ts");
        expect(result.line).toBe(91);
        expect(result.authors).toEqual([]);
    });

    test("Missing File Name", () => {
        const input = [
            "*Method unitTest4 in file  line 117",
            "Authors of local function:",
        ];
        const result = ss.getMethodInfo(input, 0, input.length);

        expect(result.name).toBe("unitTest4");
        expect(result.file).toBe("");
        expect(result.line).toBe(117);
        expect(result.authors).toEqual([]);
    });
});
