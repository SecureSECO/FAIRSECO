
# FAIRSECO

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
<br>
![BuildAction](https://img.shields.io/github/actions/workflow/status/QDUNI/FAIRSECO/runfairseco.yml?branch=main&logo=FAIRSECO&style=for-the-badge)
![Version](https://img.shields.io/github/package-json/v/QDUNI/FAIRSECO/main?style=for-the-badge)
![Fairtally](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8F-green?style=for-the-badge)
![license](https://img.shields.io/github/license/QDUNI/FAIRSECO?style=for-the-badge)

FAIRSECO provides a way to quickly analyse a variety of data and metrics of your software, and it allows you to explore the impact of your software on the academic world. To accomplish this, we gather lots of metadata, either directly from the GitHub repository or through external sources. The data is then analysed and compiled into a clear and concise overview.



The FAIRSECO github action will seperate the following categories:
- **Impact**
    - Academic references
        - Citations
        - Academic fields
    - Code reuse
        - Methods matching those used in other projects (from [SearchSECO](https://github.com/SecureSECO/SearchSECOController))
- **Quality**
    - FAIRness criteria (from [fairtally](https://github.com/fair-software/fairtally))
        - Findable
            - Registered in a public repository
        - Accessible
            - Public repository
        - Interoperable
            - Using a quality checklist
        - Reusable
            - Citation file present
            - License file present
    - License information (from [Tortellini](https://github.com/tortellini-tools/action))
        - Licenses of dependencies
        - License violations
    - Maintainability
        - Open/closed GitHub issues
    - Documentation
        - Presence of documentation directory
        - Presence of readme file
- **SBOM** (from  [sbom-action](https://github.com/anchore/sbom-action))
    - Dependency tree

<br>

# How to Run

In your GitHub repository, put the following workflow code in a `.yml` file in the `.github/workflows` directory:

```yaml
name: RunFAIRSECO

on:
    # Allows you to run this workflow manually from the Actions tab
    workflow_dispatch:

jobs:
  RunTortellini:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: tortellini-tools/action@v3
            - uses: actions/upload-artifact@v3
              with:
                  name: tortellini-result
                  path: .tortellini/out
  
  RunSBOM:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: anchore/sbom-action@v0
              with:
                  artifact-name: SBOM.spdx
  
  RunFAIRSECO:
        needs: [RunTortellini, RunSBOM]
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: actions/checkout@v3
              with:
                repository: QDUNI/FairSECO
                path: FAIRSECO_Assets
            - uses: QDUNI/FairSECO@V1.0.0 # this is the main action
              with:
                  myToken: ${{ secrets.GITHUB_TOKEN }}
            - uses: actions/upload-artifact@v3
              with:
                  name: FAIRSECO Result
                  path: .FAIRSECO/
            # commit and push the history file to the repo
            - name: Commit files
              run: |
                  git config --local user.email "github-actions[bot]@users.noreply.github.com"
                  git config --local user.name "github-actions[bot]"
                  git pull
                  git add -f ./.fairseco_history.json
                  git commit --allow-empty -m "Update FAIRSECO history file"
            - name: Push changes
              uses: ad-m/github-push-action@master
              with:
                  github_token: ${{ secrets.GITHUB_TOKEN }}
                  branch: ${{ github.ref }}
```

The workflow creates an artifact in the `.FAIRSECO` directory that contains the following files:
- dashboard.html
    - Dashboard where you can see the results in a clear overview
- citationgraph.html
    - Graph view for citations in the dashboard
- report.yml
    - Contains the data collected and processed by the action (yml)
- report.json
    - Contains the data collected and processed by the action (json)
- program.log
    - The log of the program

<br>

# Impact History
The workflow also writes the `.fairseco_history.json` file to the repository. This file contains historical data used for the Impact History page in the dashboard.
To prevent the history file from becoming too large too quickly, a new run on the same day overwrites the data from the previous run on the same day. This means if someone decides to run the action 100 times on a single day, it will still result in a single entry in the history file.
<br>
**_Note:_** To make this work, the repo needs to give read and write permissions to workflows. This can be done as follows:
- Go to Settings
- On the left side, click on Actions->General
- Under Workflow Permissions, select Read and Write permissions

<br>

# Instructions for Developers
All commands that are necessary when developing the program have an alias described in `package.json`.

To build the files in `src`, you can simply execute `npm run build`. This will compile all Typescript files into a single `index.js` in the `dist` folder.
This is the file that will be used when running the action.

To convert docstrings into actual documentation, you can run `npm run builddocs`, or simply `typedoc`. This will convert all docstrings and extra pages
defined in `docs_src` into a set of html files, and put them in the `docs` folder.

We use Jest for our unit and integration tests. You can run all tests by simply running `npm run test`. To run a single test file, you can run `npm test -- filename.ts`. Because the files in the `__tests__` folder have no access to GitHub tokens, some modules will fail (like `@action/artifact` or `octokit`). To make sure the unit tests work, we mock these modules.

<br>

# License 

This project is licensed under the GNU Affero General Public License v3.0. See LICENSE for more info.

This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)
