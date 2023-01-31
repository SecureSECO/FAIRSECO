/**
 * This module contains functions that retrieve data of the GitHub repository using Octokit.
 * 
 * @module
 */

import * as core from "@actions/core";
import * as gh from "@actions/github";
import * as log from "./errorhandling/log"

/**
 * Object containing all info retrieved from Octokit about the repository.
 */
export interface GitHubInfo {
    Repo: string;
    GithubToken: string;
    Owner: string;
    FullURL: string;
    Stars: number;
    Forks: number;
    Watched: number;
    Visibility: string;
    Readme: string;
    Badges: string[];
    Contributors: GitHubContributor[];
}

/** Object containing GitHub contributor info. */
export interface GitHubContributor {
    login?: string;
    id?: number;
    node_id?: string;
    avatar_url?: string;
    gravatar_id?: string | null;
    url?: string;
    html_url?: string;
    followers_url?: string;
    following_url?: string;
    gists_url?: string;
    starred_url?: string;
    subscriptions_url?: string;
    organizations_url?: string;
    repos_url?: string;
    events_url?: string;
    received_events_url?: string;
    type?: string;
    site_admin?: boolean;
    contributions?: number;
}

/** Object containing GitHub repository statistics. */
export interface RepoStats {
    stars: number;
    forks: number;
    watchers: number;
    visibility: string;
}

/**
 * Retrieves the stats of the repository from Octokit.
 * 
 * @param owner The username of the owner of the repository.
 * @param repo The name of the repository.
 * @param token The GitHub token associated with the owner.
 * @returns A `RepoStats` object containing stats of the repository.
 */
export async function getRepoStats(
    owner: string,
    repo: string,
    token: string
): Promise<RepoStats> {
    // Make a dummy response first, this is sent instead when we error
    const repostats: RepoStats = {
        stars: -1,
        forks: -1,
        watchers: -1,
        visibility: "",
    };
    let octokit: any;
    try {
        // First try our supplied token, if that doesn't work, we can already return the dummy.
        octokit = gh.getOctokit(token);
    } catch (error) {
        log.LogMessage("Error while contacting Octokit API: " + (error.message as string), log.ErrorLevel.err);

        // We return the dummy when we can't do anything
        return repostats;
    }
    try {
        // Now we contact the api
        const { data: response } = await octokit.rest.repos.get({
            owner,
            repo,
        });
        repostats.stars = response.stargazers_count;
        repostats.forks = response.forks_count;
        repostats.watchers = response.watchers_count;
        repostats.visibility = response.visibility;
    } catch (error) {
        log.LogMessage("Error when requesting repo information: " + (error.message as string), log.ErrorLevel.err);
    }

    return repostats;
}

/**
 * Creates a GitHubInfo object with all data collected from the Octokit API.
 * 
 * @returns A GitHubInfo object containing all data recieved from Octokit.
 */
export async function getGitHubInfo(): Promise<GitHubInfo> {
    const ghInfo: GitHubInfo = {
        Owner: "",
        Repo: "",
        GithubToken: "",
        FullURL: "",
        Stars: 0,
        Forks: 0,
        Watched: 0,
        Readme: "",
        Badges: [],
        Visibility: "",
        Contributors: [],
    };
    const ghtoken = core.getInput("myToken");
    ghInfo.Repo = core.getInput("repository").split("/")[1];
    ghInfo.Owner = core.getInput("repository").split("/")[0];
    ghInfo.GithubToken = ghtoken;
    ghInfo.FullURL = await getRepoUrl();
    const ghstats: RepoStats = await getRepoStats(
        ghInfo.Owner,
        ghInfo.Repo,
        ghtoken
    );
    ghInfo.Stars = ghstats.stars;
    ghInfo.Forks = ghstats.forks;
    ghInfo.Watched = ghstats.forks;
    ghInfo.Visibility = ghstats.visibility;
    ghInfo.Readme = await getRepoReadme(ghInfo.Owner, ghInfo.Repo, ghtoken);
    ghInfo.Badges = filterBadgeURLS(ghInfo.Readme);
    ghInfo.Contributors = await getContributors(
        ghInfo.Owner,
        ghInfo.Repo,
        ghtoken
    );
    return ghInfo;
}

/**
 * Retrieves the contributors of the repository.
 * 
 * @param owner The username of the owner of the repository.
 * @param repo The name of the repository.
 * @param token The GitHub token associated with the owner.
 * @returns An array with the GitHub contributors of the repository.
 */
export async function getContributors(
    owner: string,
    repo: string,
    token: string
): Promise<GitHubContributor[]> {
    try {
        const octokit = gh.getOctokit(token);
        const { data: contributors } =
            await octokit.rest.repos.listContributors({
                owner,
                repo,
            });
            
        return contributors;
    } catch {
        log.LogMessage("An error occured while retrieving contributors.", log.ErrorLevel.err);
        
        return [];
    }
}

/**
 * Constructs the full URL of the repository by combining the username and repo name.
 * 
 * @returns The URL of the repository.
 */
export async function getRepoUrl(): Promise<string> {
    const prefix = "https://github.com/";
    const repository: string = core.getInput("repository");
    
    return prefix + repository;
}

/**
 * Retrieves the readme.md file from the repository.
 * 
 * @param owner The username of the owner of the repository.
 * @param repo The name of the repository.
 * @param token The GitHub token associated with the owner.
 * @returns A string with the contents of the readme.md file.
 */
export async function getRepoReadme(
    owner: string,
    repo: string,
    token: string
): Promise<string> {
    let result = "";

    try {
        const octokit = gh.getOctokit(token);
        const {
            data: { content: readme },
        } = await octokit.rest.repos.getReadme({
            owner,
            repo,
        });
        result = Buffer.from(readme, "base64").toString();
    } catch {
        log.LogMessage("An error occured while retrieving readme.", log.ErrorLevel.err);
    }
    
    return result;
}

/**
 * Searches through the readme.md file for badge links from shields.io.
 * 
 * @param input The contents of the readme.md file.
 * @returns An array of badge links.
 */
export function filterBadgeURLS(input: string): string[] {
    const rgexp: RegExp =
        /!\[.*\]\s*\(https:\/\/img\.shields\.io\/badge\/.*\)/g;
    const result: string[] | null = input.match(rgexp);
    
    if (result == null) {
        return [];
    } else {
        return result;
    }
}
