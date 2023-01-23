import { exec, ExecOptions } from "@actions/exec";
import { GitHubInfo } from "../../src/git";
import { throwError } from "../../src/errorhandling/docker_exit";
import { LogMessage, ErrorLevel } from "../../src/errorhandling/log";
import * as fs from "fs";
import {
    getHashIndices,
    getMatches,
    getMatchIndicesOfHash,
    getMethodInfo,
    Method,
    MethodData,
    Output,
    parseOutput,
    runModule,
} from "../../src/resources/SearchSECO";

jest.setTimeout(30000);

const ghInfo: GitHubInfo = {
    Repo: "",
    GithubToken: "",
    Owner: "",
    FullURL: "https://github.com/QDUNI/FAIRSECO",
    Stars: 0,
    Forks: 0,
    Watched: 0,
    Visibility: "private",
    Readme: "",
    Badges: [],
    Contributors: [],
};

jest.setTimeout(100000);

// Test cases for SearchSECO mock
test(
    "Check if getMatches is working on the correct Indices",
    correctIndicesMethod
);

test("Authors presence", authorsPresence);

test("Parse the input with HashIndices", parseInputIntegration);

test("Integration between SearchSECO and Parse input", () =>
    localrunModule(ghInfo));

// Test is SearchSECO mock gives same result as running it here locally
async function localrunModule(ghInfo: GitHubInfo): Promise<void> {
    const gitrepo: string = ghInfo.FullURL;
    const useMock = ghInfo.Visibility !== "public";

    // Determine which docker image to use
    const dockerImage = useMock
        ? "jarnohendriksen/mockseco:v1"
        : "searchseco/controller";

    // The mock can't handle a custom entrypoint, while SearchSECO requires it
    const entrypoint = useMock
        ? ""
        : '--entrypoint="./controller/build/SearchSECO"';

    // The token will be retrieved from the git data collection object once that is merged
    const ghToken = "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";

    LogMessage("SearchSECO started.", ErrorLevel.info);
    if (useMock)
        LogMessage(
            "Running a mock of SearchSECO. The output will be incorrect!",
            ErrorLevel.warn
        );

    const cmd = "docker";
    const mockArgs = [
        "run",
        "--rm",
        "--name",
        "searchseco-container",
        "-e",
        '"github_token=' + ghToken + '"',
        "-e",
        '"worker_name=test"',
        dockerImage,
        "check",
        gitrepo,
    ];
    const realArgs = [
        "run",
        "--rm",
        "--name",
        "searchseco-container",
        entrypoint,
        "-e",
        '"github_token=' + ghToken + '"',
        "-e",
        '"worker_name=test"',
        dockerImage,
        "check",
        gitrepo,
    ];

    const args = useMock ? mockArgs : realArgs;

    // Output from the docker container
    let stdout = "";
    let stderr = "";

    try {
        if (!fs.existsSync("./ssOutputFiles")) fs.mkdirSync("./ssOutputFiles/");
        else
            LogMessage(
                "Directory ssOutputFiles already exists!",
                ErrorLevel.info
            );
    } catch {
        LogMessage("Could not create ssOutputFiles directory", ErrorLevel.err);
    }

    const stdOutStream = fs.createWriteStream("./ssOutputFiles/ssOutput.txt");
    const stdErrStream = fs.createWriteStream("./ssOutputFiles/ssError.txt");

    const options: ExecOptions = {
        ignoreReturnCode: true,
        windowsVerbatimArguments: true,
        outStream: stdOutStream,
        errStream: stdErrStream,
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

    // Check docker exit code
    throwError("SearchSECO", exitCode);

    // ParseInput expects an array of trimmed lines
    // (i.e. without trailing or leading whitespace)
    const lines = stdout.split("\n");
    const filteredlines = lines.filter((x) => x !== "");

    for (let n = 0; n < filteredlines.length; n++) {
        filteredlines[n] = filteredlines[n].trim();
    }

    const output: Output = parseOutput(filteredlines);

    const realOutput = await runModule(ghInfo);

    expect(output).toEqual(realOutput);
}

// Test if the input is correctly parsed
async function parseInputIntegration(): Promise<void> {
    const databaseMock: String[] = [
        "Hash 1234567890",
        "*Method methodName in file Test.cpp line 24",
        "Authors of local function:",
        "AuthorName",
        "DATABASE",
        "*Method functionName in project projName1 in file file.cpp line 33",
        "URL: https://github.com/user/project",
        "Method marked as vulnerable with code: 123(https://www.url-of-vulnerability.com)",
        "Authors of function found in database:",
        "Rowin1",
        "Rowin2",
    ];
    const hashIndices: number[] = getHashIndices(databaseMock);

    const localMS: Method[] = [];
    const parseInputMS: Method[] = parseOutput(databaseMock).methods;

    for (let i = 0; i < hashIndices.length - 1; i++) {
        const h = databaseMock[hashIndices[i]].split(" ")[1];
        const d = getMethodInfo(
            databaseMock,
            hashIndices[i],
            hashIndices[i + 1]
        );
        const m = getMatches(databaseMock, hashIndices[i], hashIndices[i + 1]);
        localMS.push({ hash: h, data: d, matches: m });
    }

    expect(localMS).toMatchObject(parseInputMS);
}

// Test if the authors are correct
async function authorsPresence(): Promise<void> {
    const databaseMock: String[] = [
        "*Method <methodName> in file <fileName> line <lineNumber>",
        "Test2",
        "*Method <methodName> in file <fileName> line <lineNumber>",
        "Authors of local function:",
        "Rowin1, Rowin2",
    ];
    const start: number = 0;
    const end: number = 3;

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

    const methInfo: MethodData = getMethodInfo(databaseMock, start, end);

    expect(authMock).toEqual(methInfo.authors);
}

// Test if the indices are correctly integrated
async function correctIndicesMethod(): Promise<void> {
    const matchesMock: String[] = ["*Method Test1", "Test2", "*Method Test3"];
    const numberOfIndices: number = getMatchIndicesOfHash(
        matchesMock,
        0,
        3
    ).length;
    const lengthOfMatchedList: number =
        getMatches(matchesMock, 0, 3).length + 1;

    expect(numberOfIndices).toEqual(lengthOfMatchedList);
}
