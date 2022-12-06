import { ReturnObject } from "../../src/getdata";
import { GithubInfo } from "../../src/git";
import { QualityMetrics } from "../../src/resources/qualitymetrics";

// Mock the @actions/github module to replace requests for data in unit tests
jest.mock("@actions/github", () => {
    const actualModule = jest.requireActual("@actions/github");

    // Mock of octokit
    // Returns array with 1 open issue
    const moctokit = {
        request: function (): any {
            return {
                data: [
                    {
                        closed_at: null,
                        created_at: "2011-04-22T13:33:48Z",
                    },
                ],
            };
        },
    };

    return {
        __esModule: true,
        ...actualModule,
        getOctoKit: async () => {
            return moctokit;
        },
    };
});

test("Test getQualityScore", async () => {
    const ghInfo: GithubInfo = {
        Repo: "FairSECO",
        GithubToken: "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",
        Owner: "QDUNI",
        FullURL: "https://github.com/QDUNI/FairSECO",
        Stars: 0,
        Forks: 0,
        Watched: 0,
        Visibility: undefined,
        Readme: "",
        Badges: [],
        Contributors: [],
    };

    const hfiInput: ReturnObject = {
        ReturnName: "Howfairis",
        ReturnData: [
            {
                count: 3,
            },
        ],
    };

    const tortInput: ReturnObject = {
        ReturnName: "Howfairis",
        ReturnData: {
            packages: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], // 12
            violations: [{}, {}, {}], // 3
        },
    };

    let qualityScore = (await getQualityScore(ghInfo, hfiInput, tortInput))
        .ReturnData as QualityMetrics;

    expect(qualityScore.fairnessScore).toBeCloseTo(3 * 20);
    expect(qualityScore.licenseScore).toBeCloseTo((100 * (12 - 3)) / 12);
    expect(qualityScore.hasDocs).toBeTruthy();
});

describe("Test getLicenseScore");
