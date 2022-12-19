import { ReturnObject } from "../../src/getdata";
import { GithubInfo } from "../git";

import * as gh from "@actions/github";
import * as fs from "fs";

/** Contains information about the quality of the repository. */
export interface QualityMetrics {
    /** The overall score 0-100 */
    score: number;
    /** The FAIRness score, percent score from howfairis 0-100. */
    fairnessScore: number;
    /** The license score based on license violations 0-100. */
    licenseScore: number;
    /** The maintability score, percentage of solved issues 0-100. */
    maintainabilityScore: number;
    /** The documentation score, 100 if documentation has been detected, 0 otherwise. */
    documentationScore: number;
    /** Average time in days it took to solve closed github issues. Undefined if no issues have been solved. */
    avgSolveTime: number | undefined;
}

/**
 * Finds quality metrics about the repository.
 * @param ghInfo A {@link git.GithubInfo} containing information about the GitHub repository.
 * @param howfairisOutput The output from the howfairis module.
 * @param tortelliniOutput The output from the tortellini module.
 * @returns A {@link getdata.ReturnObject} containing a {@link QualityMetrics} object containing quality metrics about the repository.
 */
export async function getQualityMetrics(
    ghInfo: GithubInfo,
    howfairisOutput: ReturnObject,
    tortelliniOutput: ReturnObject
): Promise<ReturnObject> {
    const fairnessScore = (howfairisOutput.ReturnData as any[])[0].count * 20;

    const licenseScore = getLicenseScore(tortelliniOutput);

    // Get github issues
    const issues = await getIssues(ghInfo);

    const maintainabilityScore = await getMaintainabilityScore(issues);

    const avgSolveTime = getAvgSolveTime(issues);

    const documentationScore = hasDocumentation() ? 100 : 0;

    // Overall score
    const score =
        fairnessScore * 0.38 +
        licenseScore * 0.27 +
        maintainabilityScore * 0.23 +
        documentationScore * 0.12;

    // Quality score to return
    const qualityMetrics: QualityMetrics = {
        score,
        fairnessScore,
        licenseScore,
        maintainabilityScore,
        documentationScore,
        avgSolveTime,
    };

    return {
        ReturnName: "QualityMetrics",
        ReturnData: qualityMetrics,
    };
}

/**
 * Calculates the percentage of license violations. The more violations there are,
 * the lower the score will be.
 *
 * @param licenseInfo The {@link getdata.ReturnObject} containing the (curated)
 * output from Tortellini.
 *
 * @returns Score between 0 and 100 indicating how well licenses correspond with each other.
 */
export function getLicenseScore(licenseInfo: ReturnObject): number {
    const licenseCount = (licenseInfo.ReturnData as any).packages.length;
    const violationCount = (licenseInfo.ReturnData as any).violations.length;

    // Check if there's no licenses
    if (licenseCount === 0) {
        return 100;
    }

    // Fraction of licenses that are not violated
    const correctFraction = (licenseCount - violationCount) / licenseCount;

    // When there are more licenses, the same fraction of violations results in a lower score
    return Math.pow(correctFraction, Math.log2(1 + licenseCount)) * 100;
}

/**
 * Calculates the maintainability of the code, by comparing the number of open
 * issues with the total number of issues. If the number of open issues is relatively high,
 * this will result in a lower score.
 *
 * @param issues Array of issues from GitHub.
 * @returns Score between 0 and 100 indicating the maintainability of the code.
 */
export function getMaintainabilityScore(issues: any[]): number {
    const total = issues.length;
    // Count amount of closed issues
    let closed = 0;
    for (const issue of issues) {
        if (issue.closed_at as boolean) closed++;
    }

    // Return score as percentage of closed issues
    return total > 0 ? (100 * closed) / total : 100;
}

/**
 * Calculates the average number of days it takes to solve an issue.
 *
 * @param issues Array of issues from GitHub.
 * @returns The average solve time of issues (in days).
 */
export function getAvgSolveTime(issues: any[]): number | undefined {
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
    return numberOfIssues > 0 ? totalTime / numberOfIssues : undefined;
}

/**
 * Checks if the repository has documentation by checking if there is a folder named "docs" or "documentation".
 *
 * @returns A boolean indicating the existence of a "docs" or "documentation" folder.
 */
export function hasDocumentation(): boolean {
    return fs.existsSync("./docs") || fs.existsSync("./documentation");
}

/**
 * Gets issues of the current repository from GitHub.
 *
 * @param ghInfo {@link git.GithubInfo} object containing metadata about the current repository.
 * @returns Array of issue objects.
 */
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

    // Request issues of the repo
    try {
        const response = await octokit.request(
            "GET /repos/" + ghInfo.Owner + "/" + ghInfo.Repo + "/issues",
            {
                owner: ghInfo.Owner,
                repo: ghInfo.Repo,
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(
            "Error getting issues: " +
                (error instanceof Error ? error.message : "unknown")
        );
    }
}
