/**
 * This module contains functions that get data from the previously run modules and new data from GitHub,
 * and calculates a number of metrics used to calculate the quality score.
 * 
 * @module
 */

import { GitHubInfo } from "../git";

import * as gh from "@actions/github";
import * as fs from "fs";

/** The name of the module. */
export const ModuleName = "QualityMetrics";

/**
 * Contains information about the quality of the repository.
 * The reported values are whole numbers.
*/
export interface QualityMetrics {
    /** The total score 0-100 as a whole number. */
    score: number;

    /** The FAIRness score, percent score from fairtally 0-100. */
    fairnessScore: number;

    /** The license score based on license violations 0-100. */
    licenseScore: number;
    
    /** The maintainability score, percentage of solved issues 0-100. */
    maintainabilityScore: number;
    
    /** The documentation score 0-100, based on presence of documentation. */
    documentationScore: number;

    /** Average time in days it took to solve closed GitHub issues. Undefined if no issues have been solved. */
    avgSolveTime: number | undefined;
}

/**
 * Calculates the quality metrics of the repository.
 * 
 * @param params The parameters passed by getData. It should contain the following:
 * - A `GitHubInfo` object containing data about the GitHub repository.
 * - The output from the fairtally module.
 * - The output from the tortellini module.
 * @returns The quality metrics of the repository.
 * 
 * @remarks
 * #### FAIRness score
 * Score between 0 and 100 proportional to how many of the five FAIRness criteria are met.
 * #### Maintainability score
 * The percentage of closed GitHub issues.
 * #### License score
 * Score between 0 and 100 indicating how compatible the license of the project is with those of its dependencies. The more violations there are, the lower the license score will be.
 * #### Documentation
 * Score between 0 and 100, depending on the presence of a documentation directory and readme.md file.
 * #### Average Solve Time
 * Average number of days between opening and closing an issue. This number is not used to calculate the quality score, but may be displayed separately. This is because the acceptable amount of time it takes to solve an issue can be different for each project.
 */
export async function runModule(
    params: any[]
): Promise<QualityMetrics> {
    if (params.length < 3)
        throw new Error("Too few arguments passed to " + ModuleName + "'s runModule function");

    const ghInfo = params[0] as GitHubInfo;
    const fairtallyOutput = params[1];
    const tortelliniOutput = params[2];

    // Check if fairtally and Tortellini output exist
    if (fairtallyOutput === undefined || tortelliniOutput === undefined) {
        throw new Error("fairtallyOutput or tortelliniOutput is undefined");
    }

    // FAIRness score
    const fairnessScore = fairtallyOutput[0].count * 20;

    // License score
    const licenseScore = getLicenseScore(tortelliniOutput);

    // Get github issues
    const issues = await getIssues(ghInfo);

    // Maintainability score
    const maintainabilityScore = getMaintainabilityScore(issues);

    // Average solve time
    const avgSolveTime = getAvgSolveTime(issues);

    // Documentation score
    const docsDirectoryScore = hasDocumentationDir() ? 50 : 0;
    const readmeScore = ghInfo.Readme !== "" ? 50 : 0;
    const documentationScore = docsDirectoryScore + readmeScore;

    // Scoring weights
    const fairnessWeight = 38;
    const licenseWeight = 27;
    const maintainabilityWeight = 23;
    const documentationWeight = 12;
    const totalWeight = fairnessWeight + licenseWeight + maintainabilityWeight + documentationWeight;

    // Total score
    const score = Math.round(
        (
            fairnessScore * fairnessWeight +
            licenseScore * licenseWeight +
            maintainabilityScore * maintainabilityWeight +
            documentationScore * documentationWeight
        ) / totalWeight
    );

    return {
        score,
        fairnessScore,
        licenseScore,
        maintainabilityScore,
        documentationScore,
        avgSolveTime,
    };
}

/**
 * Calculates the percentage of license violations. The more violations there are,
 * the lower the score will be.
 *
 * @param licenseInfo The output from Tortellini.
 * @returns Score between 0 and 100 indicating how well licenses correspond with each other.
 */
export function getLicenseScore(licenseInfo: any): number {
    const licenseCount : number = licenseInfo.packages.length;
    const violationCount : number = licenseInfo.violations.length;

    // Check if there's no licenses
    if (licenseCount === 0) {
        return 100;
    }

    // Fraction of licenses that are not violated
    const correctFraction = (licenseCount - violationCount) / licenseCount;

    // When there are more licenses, the same fraction of violations results in a lower score
    return Math.round(Math.pow(correctFraction, Math.log2(1 + licenseCount)) * 100);
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
    return total > 0 ? Math.round((100 * closed) / total) : 100;
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

    // Return average solve time (rounded up to next day)
    return numberOfIssues > 0 ? Math.round(totalTime / numberOfIssues) : undefined;
}

/**
 * Checks if the repository has documentation by checking if there is a directory
 * named "docs" or "documentation" in the root of the repositiory.
 *
 * @returns A boolean indicating the existence of a "docs" or "documentation" directory.
 */
export function hasDocumentationDir(): boolean {
    return fs.existsSync("./docs") || fs.existsSync("./documentation");
}

/**
 * Gets issues (excluding pull requests) of the current repository from GitHub.
 *
 * @param ghInfo Information about the GitHub repository.
 * @returns An array of GitHub issue objects.
 */
export async function getIssues(ghInfo: GitHubInfo): Promise<any[]> {
    // Get octokit
    let octokit: any;
    try {
        octokit = gh.getOctokit(ghInfo.GithubToken);
    } catch (error) {
        throw new Error("Error while contacting Octokit API: " + (error.message as string));
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

        // Filter out pull requests and return the issues
        return response.data.filter((issue: any) => issue.pull_request === undefined);
    } catch (error) {
        throw new Error("Error getting issues: " + (error.message as string));
    }
}
