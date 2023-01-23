*FAIRSECO* is a GitHub Action that analyzes your repository to give information about:

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
    RunFAIRSECO:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: tortellini-tools/action@v3
            - uses: actions/upload-artifact@v3
              with:
                  name: tortellini-result
                  path: .tortellini/out
            - uses: anchore/sbom-action@v0
              with:
                  artifact-name: SBOM.spdx
            - uses: QDUNI/FAIRSECO@main
            - uses: actions/upload-artifact@v3
              with:
                  name: FAIRSECO Result
                  path: .FAIRSECO/
```

The workflow creates an artifact in the `.FAIRSECO` directory that contains the following files:
- dashboard.html
    - Dashboard where you can see the results in a clear overview
- report.yml
    - Contains the data collected and processed by the action
- program.log
    - The log of the program

<br>

# License 

This project is licensed under the GNU Affero General Public License v3.0. See LICENSE for more info.

This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)
