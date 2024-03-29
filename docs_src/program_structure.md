
---

The program starts in [main.ts](../modules/main.html), which calls the entrypoint of the program, [main()](../functions/action.main.html) which is defined in [action.ts](../modules/action.html).

 The program performs the following steps:
  - Handle preconditions required for the program to run
  - Call the modules that generate the data
  - Generate the output files

<br>

## Preconditions

---

The preconditions are handled by the [pre()](../functions/pre.pre.html) function in [pre.ts](../modules/pre.html), which performs the following:
- Creating the FAIRSECO directory
 - Creating the log file
 - Checking the necessary inputs that are required for the program to run
 
 <br>

 ## Generating Data

 ---

 To generate the data, the [data()](../functions/getdata.data.html) function in [getdata.ts](../modules/getdata.html) is called.
 This function calls the [getGitHubInfo()](../functions/git.getGitHubInfo.html) function in [git.ts](../modules/git.html) and the other data collection modules in the resources directory and compiles their results to an array of [ReturnObjects](../interfaces/getdata.ReturnObject.html).

 The following data collection modules are used:
- **Tortellini** ([resources/tortellini.ts](../modules/resources_tortellini.html))
    - Gets license information
- **fairtally** ([resources/fairtally.ts](../modules/resources_fairtally.html))  
    - Gets checklist of FAIRness criteria
- **SearchSECO** ([resources/searchseco.ts](../modules/resources_searchseco.html))
    - Gets method reuse
- **CitationCff** ([resources/citation_cff.ts](../modules/resources_citation_cff.html))
    - Reads and validates CITATION.cff file from repository
- **SBOM** ([resources/sbom.ts](../modules/resources_sbom.html))
    - Gets a dependency tree for the project
- **CitingPapers** ([resources/citations/citing_papers.ts](../modules/resources_citations_citing_papers.html))
    - Gets data about academic references to the software
- **QualityMetrics** ([resources/qualitymetrics.ts](../modules/resources_qualitymetrics.html))
    - Calculates quality metrics

Each module run is wrapped in a try-catch block, so modules that encounter a fatal error don't crash the program. Any module that fails won't have its data included in the output.

The GitHub token from the output of the [getGitHubInfo()](../functions/git.getGitHubInfo.html) function in [git.ts](../modules/git.html) is used by data collection modules, but is excluded from the output.

<br>

## Program Output

---

After generating and compiling the data, the [post()](../functions/post.post.html) function in [post.ts](../modules/post.html) is called, which generates the output report files. The FAIRSECO history file is also read and updated.

The following output files are generated:
- report.yml
    - The raw output in YAML format
- dashboard.html (generated by the [WriteHTML()](../functions/webapp.WriteHTML.html) function in [webapp.ts](../modules/webapp.html)) 
    - A webpage that shows a clear overview of the data
- citationgraph.html (generated by the [WriteHTML()](../functions/webapp.WriteHTML.html) function in [webapp.ts](../modules/webapp.html))
    - Graph view for citations in the dashboard
- .fairseco_history.json (generated by the [getHistoryData()](../functions/history.getHistoryData.html) function in [history.ts](../modules/history.html))
    - Contains historical data displayed on the Impact History page
    - Is written to the GitHub repository directly

<br>

## Generation of dashboard.html

---

The [WriteHTML()](../functions/webapp.WriteHTML.html) function in [webapp.ts](../modules/webapp.html) generates the dashboard.html file using the [EJS](https://ejs.co) templating language.
The EJS template files are located in the `templates` directory.

The HTML page is built with the following structure:
- `index.ejs` (main page)
    - Includes `head.ejs` (page head)
    - Includes `body.ejs` (page body)
        - Includes `logo.ejs` (FAIRSECO logo)
        - Includes `leftpane.ejs` (left pane)
            - Includes `leftpanenav.ejs` (left pane tabs)
            - Includes `citations.ejs` (Citations page)
                - Includes `citation.ejs` for each [citing paper](../classes/resources_citations_paper.Paper.html)
            - Includes `licenses.ejs` (Licenses page)
                - Includes `violation.ejs` for each license violation
            - Includes `searchseco.ejs` (SearchSECO page)
                - Includes `searchseco-method.ejs` for each [method](../interfaces/resources_searchseco.Method.html)
                    - Includes `searchseco-match.ejs` for each [match](../interfaces/resources_searchseco.Match.html)
                - Includes `searchseco-project.ejs` for each unique [project](../interfaces/resources_searchseco.MethodData.html#project) of the [matches](../interfaces/resources_searchseco.Match.html)
                    - Includes `searchseco-project-match.ejs` for each [match](../interfaces/resources_searchseco.Match.html) the [project](../interfaces/resources_searchseco.MethodData.html#project) is involved in
            - Includes `footer.ejs` (footer in left pane)
        - Includes `rightpane.ejs` (right pane)
            - Includes `rightpanenav.ejs` (right pane tabs)
            - Includes `overview.ejs` (Overview page)
            - Includes `fairtally.ejs` (FAIRness page)
            - Includes `quality.ejs` (Quality page)
            - Includes `impact.ejs` (Impact page)
            - Includes `impact-history.ejs` (Impact History page)
                - Includes `impact-history-graph.ejs` for the following fields:
                    - Quality Score
                    - FAIRness
                    - Citations
                    - Method matches
- `citationgraph.ejs` (citation graph page)
    - Includes `leftpane-citationgraph.ejs` (left pane)
        - Includes `citations-citationgraph.ejs` (container showing info about selected things)
    - Includes `starfieldgraph.ejs` (chart)

The inclusions of pages by `leftpane.ejs` and `rightpane.ejs` are all wrapped in separate try-catch blocks.
When a page cannot be included, for example due to missing data, it will be replaced by the `leftpane-error.ejs` page or `rightpane-error.ejs` page respectively, which display the encountered error.