import * as core from "@actions/core";
import * as gh from "@actions/github";

class GithubInfo {
    RepoLink: string = "";
    Stars: number = 0;
    Forks: number = 0;
    Watched: number = 0;
    Authors: GithubAuthor[] = [];
}

class GithubAuthor {
    GithubName: string = "";
    Email: string = "";
    login: string = "";
    id: number = 1;
    node_id: string = "";
    avatar_url: string = "";
    gravatar_id: string = "";
    url: string = "";
    html_url: string = "";
    followers_url: string = "";
    following_url: string = "";
    gists_url: string = "";
    starred_url: string = "";
    subscriptions_url: string = "";
    organizations_url: string = "";
    repos_url: string = "";
    events_url: string = "";
    received_events_url: string = "";
    type: string = "";
    site_admin: boolean = false;
    contributions: number = 32;
    // More info here
}

export async function getContributors(
    owner: string,
    repo: string
): Promise<Object> {
    // Get all repo contributors here
    const myToken = core.getInput("myToken");
    const octokit = gh.getOctokit(myToken);
    const { data: contributors } = await octokit.rest.repos.listContributors({
        owner,
        repo,
    });
    // const result: GithubAuthor[] = [];
    return contributors;
}

export async function getRepoUrl(): Promise<string> {
    const prefix = "https://github.com/";
    const repository: string = core.getInput("repository");
    return prefix + repository;
}
