import { ReturnObject } from "../../src/getdata";
import { GithubInfo } from "../../src/git";
import * as quality from "../../src/resources/qualitymetrics";

// Mock of issues returned by octokit request: 1 open issue
const mockedOctokitIssues: any[] = [
    {
        closed_at: null,
        created_at: "2011-04-22T13:33:48Z",
    },
];

// Mock the @actions/github module to replace requests for data in unit tests
jest.mock("@actions/github", () => {
    const actualModule = jest.requireActual("@actions/github");

    return {
        __esModule: true,
        ...actualModule,
        // Mock getOctokit to return the mocked octokit
        getOctokit: jest.fn(() => {
            // Mock of octokit
            const moctokit = {
                request: jest.fn(async () => {
                    return {
                        data: mockedOctokitIssues,
                    };
                }),
            };

            return moctokit;
        }),
    };
});

test("Test getQualityScore", async () => {
    const mockGhInfo: GithubInfo = {
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

    const mockHowfairisOutput: ReturnObject = {
        ReturnName: "Howfairis",
        ReturnData: [
            {
                count: 3,
            },
        ],
    };

    const mockTortelliniOutput: ReturnObject = {
        ReturnName: "Tortellini",
        ReturnData: {
            packages: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], // 12
            violations: [{}, {}, {}], // 3
        },
    };

    let qualityScore = (
        await quality.getQualityMetrics(
            mockGhInfo,
            mockHowfairisOutput,
            mockTortelliniOutput
        )
    ).ReturnData as quality.QualityMetrics;

    expect(qualityScore.fairnessScore).toBeCloseTo(3 * 20);
    expect(qualityScore.licenseScore).toBeCloseTo((100 * (12 - 3)) / 12);
    expect(qualityScore.hasDocs).toBeTruthy();
});

describe("Test getLicenseScore", () => {
    test("Some violations", () => {
        const mockTortelliniOutput: ReturnObject = {
            ReturnName: "Tortellini",
            ReturnData: {
                packages: [{}, {}, {}, {}, {}, {}], // 6
                violations: [{}, {}], // 2
            },
        };

        expect(quality.getLicenseScore(mockTortelliniOutput)).toBeCloseTo(
            (100 * (6 - 2)) / 6
        );
    });

    test("No violations", () => {
        const mockTortelliniOutput: ReturnObject = {
            ReturnName: "Tortellini",
            ReturnData: {
                packages: [{}, {}], // 2
                violations: [], // 0
            },
        };

        expect(quality.getLicenseScore(mockTortelliniOutput)).toBeCloseTo(100);
    });

    test("100% violations", () => {
        const mockTortelliniOutput: ReturnObject = {
            ReturnName: "Tortellini",
            ReturnData: {
                packages: [{}, {}, {}], // 3
                violations: [{}, {}, {}], // 3
            },
        };

        expect(quality.getLicenseScore(mockTortelliniOutput)).toBeCloseTo(0);
    });

    test("No packages", () => {
        const mockTortelliniOutput: ReturnObject = {
            ReturnName: "Tortellini",
            ReturnData: {
                packages: [], // 0
                violations: [], // 0
            },
        };

        expect(quality.getLicenseScore(mockTortelliniOutput)).toBeCloseTo(100);
    });
});

describe("Test getMaintainabilityScore", () => {
    test("Some solved issues", () => {
        const mockIssues = [
            {
                closed_at: null,
            },
            {
                closed_at: "2022-12-06T12:00:00Z",
            },
            {
                closed_at: "2022-12-06T14:00:00Z",
            },
        ];

        expect(quality.getMaintainabilityScore(mockIssues)).toBeCloseTo(
            (100 * 2) / 3
        );
    });

    test("No solved issues", () => {
        const mockIssues = [
            {
                closed_at: null,
            },
            {
                closed_at: null,
            },
        ];

        expect(quality.getMaintainabilityScore(mockIssues)).toBeCloseTo(0);
    });

    test("Only solved issues", () => {
        const mockIssues = [
            {
                closed_at: "2022-12-06T15:00:00Z",
            },
        ];

        expect(quality.getMaintainabilityScore(mockIssues)).toBeCloseTo(100);
    });

    test("No issues", () => {
        const mockIssues: any[] = [];

        expect(quality.getMaintainabilityScore(mockIssues)).toBeCloseTo(100);
    });
});

describe("Test getAvgSolveTime", () => {
    test("One Closed Issue", () => {
        const mockIssues = [
            {
                closed_at: "2011-04-25T13:33:48Z", // 3 days
                created_at: "2011-04-22T13:33:48Z",
            },
        ];

        const result = quality.getAvgSolveTime(mockIssues);

        expect(result).toBeCloseTo(3);
    });

    test("Two Closed Issues", () => {
        const mockIssues = [
            {
                closed_at: "2011-04-25T13:33:48Z", // 3 days
                created_at: "2011-04-22T13:33:48Z",
            },
            {
                closed_at: "2011-04-29T13:33:48Z", // 7 days
                created_at: "2011-04-22T13:33:48Z",
            },
        ]; // Average = (3+7)/2 = 5 days

        const result = quality.getAvgSolveTime(mockIssues);

        expect(result).toBeCloseTo(5);
    });

    test("No Issues", () => {
        const mockIssues: any[] = [];

        const result = quality.getAvgSolveTime(mockIssues);

        expect(result).toBeUndefined();
    });

    test("One Open Issue", () => {
        const mockIssues = [
            {
                closed_at: null,
                created_at: "2011-04-22T13:33:48Z",
            },
        ];

        const result = quality.getAvgSolveTime(mockIssues);

        expect(result).toBeUndefined();
    });

    test("One Open, One Closed Issue", () => {
        const mockIssues = [
            {
                closed_at: null,
                created_at: "2011-04-22T13:33:48Z",
            },
            {
                closed_at: "2011-04-29T13:33:48Z", // 7 days
                created_at: "2011-04-22T13:33:48Z",
            },
        ];

        const result = quality.getAvgSolveTime(mockIssues);

        expect(result).toBeCloseTo(7);
    });
});

describe("Test hasDocumentation", () => {
    test("Existing docs folder", () => {
        const result = quality.hasDocumentation();

        expect(result).toBeTruthy();
    });
});

describe("Test getIssues", () => {
    test("Correct Token", async () => {
        const mockGhInfo: GithubInfo = {
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

        const result = await quality.getIssues(mockGhInfo);

        expect(result).toEqual(mockedOctokitIssues);
    });
});
