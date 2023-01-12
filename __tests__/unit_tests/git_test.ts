import {
    GithubInfo,
    GithubContributor,
    RepoStats,
    getGithubInfo,
    filterBadgeURLS,
    getContributors,
    getRepoReadme,
    getRepoStats,
} from "../../src/resources/git";

test("Has correct properties", async () => {
    const ghinfo: GithubInfo = await getGithubInfo();
    console.log(ghinfo);
    expect(ghinfo).toHaveProperty("Stars");
    expect(ghinfo).toHaveProperty("Watched");
    expect(ghinfo).toHaveProperty("Forks");
    expect(ghinfo).toHaveProperty("Visibility");
});

test("Filters text for badge urls properly", () => {
    //input readme.md
    const input = `
# FairSECO

![fair-software.eu](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8F-green)
![test1](https://img.shields.io/badge/textafter) text after the line

# License 

text before on the same line ![test2](https://img.shields.io/badge/textbefore)
text before on the same line ![test3](https://img.shields.io/badge/textbeforeafter) text after on the same line
This project is licensed under the GNU Affero General Public License v3.0. See LICENSE for more info.

This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)
    `;

    const output: string[] = filterBadgeURLS(input);
    const expected: string[] = [
        "![fair-software.eu](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8F-green)",
        "![test1](https://img.shields.io/badge/textafter)",
        "![test2](https://img.shields.io/badge/textbefore)",
        "![test3](https://img.shields.io/badge/textbeforeafter)",
    ];
    expect(output).toEqual(expected);
});

test("getContributors of a nonexistent repo without a token", async () => {
    const output: GithubContributor[] = await getContributors(
        "blahblahblablahblahblahh",
        "asdfasdfasfasfsa112121cc",
        ""
    );
    const expected: GithubContributor[] = [];
    expect(output).toEqual(expected);
});
test("get repo of a nonexistent repo without a token", async () => {
    const output: RepoStats = await getRepoStats(
        "blahblahblablahblahblahh",
        "asdfasdfasfasfsa112121cc",
        ""
    );
    const expected: RepoStats = {
        stars: -1,
        forks: -1,
        watchers: -1,
        visibility: "",
    };
    expect(output).toEqual(expected);
});
