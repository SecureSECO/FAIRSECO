import { getHashIndices, getMatches, getMatchIndicesOfHash, getMethodInfo, Method, MethodData, parseInput } from "../../src/resources/searchseco";


test("Check if getMatches is working on the correct Indices", correctIndicesMethod);

test("Authors presence", authorsPresence);

test("Parse the input with HashIndices", parseInputIntegration);

async function parseInputIntegration(): Promise<void>{
    const databaseMock : String[] = ["Hash 1234567890", "*Method methodName in file Test.cpp line 24", "Authors of local function:", "AuthorName", "DATABASE", "*Method functionName in project projName1 in file file.cpp line 33", "URL: https://github.com/user/project", "Method marked as vulnerable with code: 123(https://www.url-of-vulnerability.com)", "Authors of function fuond in database:", "Rowin1", "Rowin2"];
    const hashIndices: number[] = getHashIndices(databaseMock);

    const localMS: Method[] = [];
    const parseInputMS : Method[] = parseInput(databaseMock).methods;
    
    for (let i = 0; i < hashIndices.length - 1; i++) {
        const h = databaseMock[hashIndices[i]].split(" ")[1];
        const d = getMethodInfo(databaseMock, hashIndices[i], hashIndices[i + 1]);
        const m = getMatches(databaseMock, hashIndices[i], hashIndices[i + 1]);
        localMS.push({ hash: h, data: d, matches: m });
    }


    expect(localMS).toMatchObject(parseInputMS);
}

async function authorsPresence(): Promise<void>{
    const databaseMock : String[] = ["*Method <methodName> in file <fileName> line <lineNumber>", "Test2", "*Method <methodName> in file <fileName> line <lineNumber>", "Authors of local function:", "Rowin1, Rowin2"];
    const start : number = 0;
    const end : number = 3;
    
    const methodDataLine = getMatchIndicesOfHash(databaseMock, start, end);

    const authMock: String[] = [];

    let index = methodDataLine[0] + 2;
    if (databaseMock[index - 1].includes("Authors of local function:")) {
        while (index < end) {
            if (databaseMock[index] === "DATABASE") break;
            if (databaseMock[index] !== "") authMock.push(databaseMock[index]);
            index++;
        }
    }

    const methInfo : MethodData = getMethodInfo(databaseMock, start, end);

    expect(authMock).toEqual(methInfo.authors);
}

async function correctIndicesMethod(): Promise<void>{
    const matchesMock : String[] = ["*Method Test1", "Test2", "*Method Test3"];
    const numberOfIndices : number = getMatchIndicesOfHash(matchesMock, 0, 3).length;
    const lengthOfMatchedList : number = getMatches(matchesMock, 0, 3).length + 1;

    expect(numberOfIndices).toEqual(lengthOfMatchedList);
}