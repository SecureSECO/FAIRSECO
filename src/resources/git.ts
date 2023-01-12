/**
 * This module contains functions that retrieve data of the Github repository using Octokit.
 * 
 * @module
 */

import * as core from "@actions/core";
import * as gh from "@actions/github";
import * as log from "../errorhandling/log"

/**
 * Object containing all info retrieved from Octokit about the repository.
 */
export interface GithubInfo {
    Repo: string;
    GithubToken: string;
    Owner: string;
    FullURL: string;
    Stars: number;
    Forks: number;
    Watched: number;
    Visibility: string | undefined;
    Readme: string;
    Badges: string[];
    Contributors: GithubContributor[];
}

export interface GithubContributor {
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

export interface RepoStats {
    stars: number;
    forks: number;
    watchers: number;
    visibility: string | undefined;
}

/**
 * Retrieves the stats of the repository from Octokit.
 * 
 * @param owner The username of the owner of the repository.
 * @param repo The name of the repository.
 * @param token The Github token associated with the owner.
 * @returns A RepoStats object containing stats of the repository.
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
    } catch {
        log.LogMessage("Error while contacting octokit API, did you supply a valid token?", log.ErrorLevel.err);
        return repostats; // We return the dummy when we can't do anything
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
    } catch {
        log.LogMessage("Error when requesting repo information. Was the supplied repo name and owner correct?", log.ErrorLevel.err);
    }

    return repostats;
}

/**
 * Creates a GithubInfo object with all data collected from the Octokit API
 * 
 * @returns A GithubInfo object containing all data recieved from Octokit.
 */
export async function getGithubInfo(): Promise<GithubInfo> {
    const ghinfo: GithubInfo = {
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
    ghinfo.Repo = core.getInput("repository").split("/")[1];
    ghinfo.Owner = core.getInput("repository").split("/")[0];
    ghinfo.GithubToken = ghtoken;
    ghinfo.FullURL = await getRepoUrl();
    const ghstats: RepoStats = await getRepoStats(
        ghinfo.Owner,
        ghinfo.Repo,
        ghtoken
    );
    ghinfo.Stars = ghstats.stars;
    ghinfo.Forks = ghstats.forks;
    ghinfo.Watched = ghstats.forks;
    ghinfo.Visibility = ghstats.visibility;
    ghinfo.Readme = await getRepoReadme(ghinfo.Owner, ghinfo.Repo, ghtoken);
    ghinfo.Badges = filterBadgeURLS(ghinfo.Readme);
    ghinfo.Contributors = await getContributors(
        ghinfo.Owner,
        ghinfo.Repo,
        ghtoken
    );
    return ghinfo;
}

/**
 * 
 * @param owner The username of the owner of the repository.
 * @param repo The name of the repository.
 * @param token The Github token associated with the owner.
 * @returns An array of {@link GithubContributor}s.
 */
export async function getContributors(
    owner: string,
    repo: string,
    token: string
): Promise<GithubContributor[]> {
    // Get all repo contributors here
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
 * @returns The url of the repository
 */
export async function getRepoUrl(): Promise<string> {
    const prefix = "https://github.com/";
    const repository: string = core.getInput("repository");
    return prefix + repository;
}

/**
 * 
 * Retrieves the readme.md file from the repository.
 * 
 * @param owner The username of the owner of the repository.
 * @param repo The name of the repository.
 * @param token The Github token associated with the owner.
 * @returns A string with the contents of the readme.md file
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
 * Searches through the readme.md file for badge links from shields.io
 * 
 * @param input The contents of the readme.md file
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
