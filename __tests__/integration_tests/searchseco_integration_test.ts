import { exec, ExecOptions } from "@actions/exec";
import { getRepoUrl } from "../../src/git";
import { getHashIndices, getMatches, getMatchIndicesOfHash, getMethodInfo, Method, MethodData, Output, parseInput, runSearchseco } from "../../src/resources/searchseco";

// Test cases for SearchSeco mock
test("Check if getMatches is working on the correct Indices", correctIndicesMethod);

test("Authors presence", authorsPresence);

test("Parse the input with HashIndices", parseInputIntegration);

test("Integration between SearchSeco and Parse input", localRunSearchSeco);

// Test is searchseco mock gives same result as running it here locally
async function localRunSearchSeco(): Promise<void>{
    const gitrepo: string = await getRepoUrl();
    // When the real SearchSECO is back, the run command needs to be slightly edited.
    // The docker image needs to be replaced with 'searchseco/controller',
    // and the enrtypoint needs to be inserted at the location indicated below.
    const dockerImage = "jarnohendriksen/mockseco:v1";
    const entrypoint = '--entrypoint="./controller/build/searchseco"';

    const ghToken = ""; // core.getInput("GITHUB_TOKEN");

    console.debug("SearchSECO started");
    console.debug(
        "WARNING: Running a mock of SearchSECO. The output will be incorrect!"
    );
    const cmd = "docker";
    const args = [
        "run",
        "--rm",
        "--name",
        "searchseco-container",
        // This is where 'entrypoint' goes
        "-e",
        '"github_token=' + ghToken + '"',
        "-e",
        '"worker_name=test"',
        dockerImage,
        "check",
        gitrepo,
    ];

    let stdout = "";
    let stderr = "";

    const options: ExecOptions = {
        ignoreReturnCode: true,
    };

    // SearchSECO prints its results in the console. The code below copies the
    // output to the variables stdout and stderr
    options.listeners = {
        stdout: (data: Buffer) => {
            stdout += data.toString();
        },
        stderr: (data: Buffer) => {
            stderr += data.toString();
        },
    };

    // Executes the docker run command
    const exitCode = await exec(cmd, args, options);

    console.debug("Docker running SearchSECO returned " + String(exitCode));
    console.debug("stdout:");
    console.debug(stdout);
    console.debug("stderr:");
    console.debug(stderr);

    // ParseInput expects an array of trimmed lines
    // (i.e. without trailing or leading whitespace)
    const lines = stdout.split("\n");
    const filteredlines = lines.filter((x) => x !== "");

    for (let n = 0; n < filteredlines.length; n++) {
        filteredlines[n] = filteredlines[n].trim();
    }

    const output: Output = parseInput(filteredlines);

    const realOutput = (await runSearchseco()).ReturnData

    expect(output).toEqual(realOutput);
}

// Test if the input is correctly parsed
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

// Test if the authors are correct
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

// Test if the indices are correctly integrated
async function correctIndicesMethod(): Promise<void>{
    const matchesMock : String[] = ["*Method Test1", "Test2", "*Method Test3"];
    const numberOfIndices : number = getMatchIndicesOfHash(matchesMock, 0, 3).length;
    const lengthOfMatchedList : number = getMatches(matchesMock, 0, 3).length + 1;

    expect(numberOfIndices).toEqual(lengthOfMatchedList);
}