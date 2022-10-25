import { ReturnObject } from "../getdata";
import { getRepoUrl } from "../git";

import { exec, ExecOptions } from "@actions/exec";

export async function runSearchseco(): Promise<ReturnObject> {
    const gitrepo: string = await getRepoUrl();

    // When the real SearchSECO is back, the run command needs to be slightly edited.
    // The docker image needs to be replaced with 'searchseco/controller',
    // and the enrtypoint needs to be inserted at the location indicated below.
    const dockerImage = "jarnohendriksen/mockseco:v1.1";
    const entrypoint = '--entrypoint="./controller/build/searchseco"';

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
        '"github_token=uirw3tb4rvtwte"',
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

    for (let n = 0; n < lines.length; n++) {
        lines[n] = lines[n].trim();
    }

    const output: Output = parseInput(lines);

    return {
        ReturnName: "SearchSeco",
        ReturnData: output,
    };
}

export interface Output {
    methods: Method[];
}

export interface Method {
    hash: String;
    data: MethodData;
    matches: Match[];
}

export interface MethodData {
    name: String;
    project?: String;
    file: String;
    line: number;
    authors: String[];
}

export interface Match {
    data: MethodData;
    vuln: Vuln;
}

export interface Vuln {
    code: String;
    url: String;
}

export function parseInput(input: String[]): Output {
    const hashIndices: number[] = getHashIndices(input);
    const ms: Method[] = [];

    for (let i = 0; i < hashIndices.length - 1; i++) {
        const h = input[hashIndices[i]].split(" ")[1];
        const d = getMethodInfo(input, hashIndices[i], hashIndices[i + 1]);
        const m = getMatches(input, hashIndices[i], hashIndices[i + 1]);
        ms.push({ hash: h, data: d, matches: m });
    }

    return { methods: ms };
}

// Return list of indices of lines that contain a hash
// (i.e. they point to the start of a new hash)
export function getHashIndices(input: String[]): number[] {
    const indices: number[] = [];

    for (let i = 0; i < input.length; i++) {
        if (input[i].search("Hash") !== -1) indices.push(i);
    }

    // Add last line + 1, to let the program know when to stop looping
    indices.push(input.length);

    return indices;
}

// Looks for the first line within a hash that contains '*Method', and extracts
// the data from the line.
// The line always looks like: *Method <methodName> in file <filename> line <lineNumber>,
// so the data are always the 2nd, 5th, and 7th words (index 1, 4, and 6 resp.)
export function getMethodInfo(
    input: String[],
    start: number,
    end: number
): MethodData {
    const methodDataLine = getMatchIndicesOfHash(input, start, end);
    const words = input[methodDataLine[0]].split(" ").filter((x) => x);
    // console.log(words);
    const auth: String[] = [];

    // List of authors always starts two lines below the line with method data,
    // and ends before the line containing DATABASE
    let index = methodDataLine[0] + 2;
    while (input[index] !== "DATABASE" && index <= end) {
        if (input[index] !== "") auth.push(input[index]);
        index++;
    }

    const data: MethodData = {
        name: words[1],
        file: words[4],
        line: parseInt(words[6]),
        authors: auth,
    };
    return data;
}

export function getMatches(
    input: String[],
    start: number,
    end: number
): Match[] {
    const matchList: Match[] = [];
    const methodDataLine = getMatchIndicesOfHash(input, start, end);
    for (let i = 1; i < methodDataLine.length; i++) {
        const words = input[methodDataLine[i]].split(" ");
        const auth: String[] = [];

        const vulnLine = input[methodDataLine[i] + 2].split(" ")[6].split("(");
        // console.log(vulnLine + '|' + methodDataLine[i] + '|' + start + ',' + end);
        const vCode = vulnLine[0];
        const vUrl = vulnLine[1].substring(0, vulnLine[1].length - 1);

        const v: Vuln = { code: vCode, url: vUrl };

        // List of authors always starts two lines below the line with method data,
        // and ends before the next *Method or the next Hash header (a string of dashes)
        let index = methodDataLine[i] + 4;
        while (
            input[index].search(/\*Method/) == -1 &&
            input[index].search(/[-]+/) == -1 &&
            input[index] !== "" &&
            index < end - 1
        ) {
            auth.push(input[index++]);
        }

        const d: MethodData = {
            name: words[1],
            file: words[7],
            project: words[4],
            line: parseInt(words[9]),
            authors: auth,
        };

        const match: Match = { data: d, vuln: v };

        matchList.push(match);
    }

    return matchList;
}

export function getMatchIndicesOfHash(
    input: String[],
    start: number,
    end: number
): number[] {
    const indices: number[] = [];
    for (let i = start; i < end; i++) {
        if (input[i].search(/\*Method/) !== -1) indices.push(i);
    }

    return indices;
}
