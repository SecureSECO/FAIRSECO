import { ReturnObject } from "../../src/getdata";
import { GithubInfo } from "../git";

import * as gh from "@actions/github";
import * as fs from "fs";

export interface QualityScore {
    fairnessScore: number;
    licenseScore: number;
    maintainabilityScore: number;
    hasDocs: boolean;
    score: number;
    avgSolveTime: number;
}

export async function getQualityScore(
    ghInfo: GithubInfo,
    howfairisOutput: ReturnObject,
    licenseInfo: ReturnObject
): Promise<ReturnObject> {
    const fairnessScore = (howfairisOutput.ReturnData as any[])[0].count * 20;

    const licenseScore = getLicenseScore(licenseInfo);

    // Get github issues
    const issues = await getIssues(ghInfo);

    const maintainabilityScore = await getMaintainabilityScore(issues);

    const avgSolveTime = getAvgSolveTime(issues);

    const hasDocs = hasDocumentation();
    const docsScore = hasDocs ? 100 : 0;

    // Total quality score
    const score =
        fairnessScore * 0.38 +
        licenseScore * 0.27 +
        maintainabilityScore * 0.23 +
        docsScore * 0.12;

    // Quality score to return
    const qualityScore: QualityScore = {
        fairnessScore,
        licenseScore,
        maintainabilityScore,
        hasDocs,
        score,
        avgSolveTime,
    };

    return {
        ReturnName: "QualityScore",
        ReturnData: qualityScore,
    };
}

export function getLicenseScore(licenseInfo: ReturnObject): number {
    const licenseCount = (licenseInfo.ReturnData as any).packages.length;
    const violations = (licenseInfo.ReturnData as any).violations.length;

    // Return percentage of correct licenses
    return (100 * (licenseCount - violations)) / licenseCount;
}

export async function getMaintainabilityScore(issues: any[]): Promise<number> {
    let open = 0;
    let closed = 0;
    for (const issue of issues) {
        if (issue.closed_at === null) open++;
        else closed++;
    }

    // Return percentage of closed issues
    return (100 * closed) / open;
}

export function getAvgSolveTime(issues: any[]): number {
    let totalTime = 0;
    let numberOfIssues = 0;

    for (const issue of issues) {
        // Skip unsolved issues
        if (issue.closed_at === null) continue;

        // Get created and closed times in milliseconds
        const created = Date.parse(issue.created_at);
        const closed = Date.parse(issue.closed_at);

        // Add solved time in days
        totalTime += (closed - created) / (1000 * 60 * 60 * 24);
        numberOfIssues++;
    }

    // Return average solve time
    return totalTime / numberOfIssues;
}

export function hasDocumentation(): boolean {
    return fs.existsSync("./docs") || fs.existsSync("./documentation");
}

export async function getIssues(ghInfo: GithubInfo): Promise<any[]> {
    // Get octokit
    let octokit: any;
    try {
        octokit = gh.getOctokit(ghInfo.GithubToken);
    } catch {
        throw new Error(
            "Error while contacting octokit API, did you supply a valid token?"
        );
    }

    // Request issues of the repo, is returned as a json string
    const response: string = await octokit.request(
        "GET /repos/" + ghInfo.Owner + "/" + ghInfo.Repo + "/issues",
        {
            owner: ghInfo.Owner,
            repo: ghInfo.Repo,
        }
    );

    console.log("RESPONSE:\n", response);

    return JSON.parse(response);
}
