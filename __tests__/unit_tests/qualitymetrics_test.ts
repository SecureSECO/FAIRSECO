import { ReturnObject } from "../../src/getdata";
import { GitHubInfo } from "../../src/git";
import * as quality from "../../src/resources/qualitymetrics";

import * as fs from "fs";

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

test("Test runModule", async () => {
    const mockHowfairisOutput = [
        {
            count: 3,
        },
    ];

    const mockTortelliniOutput = {
        packages: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], // 12
        violations: [{}, {}, {}], // 3
    };

    let qualityScore = (
        await quality.runModule(
            {} as unknown as GitHubInfo,
            mockHowfairisOutput,
            mockTortelliniOutput
        )
    ) as quality.QualityMetrics;

    const hasDocs =
        fs.existsSync("./docs") || fs.existsSync("./documentation");

    expect(qualityScore.fairnessScore).toBe(60);
    expect(qualityScore.licenseScore).toBe(34);
    expect(qualityScore.documentationScore).toBe(hasDocs ? 100 : 0);
});

describe("Test getLicenseScore", () => {
    test("Some violations", () => {
        const mockTortelliniOutput = {
                packages: [{}, {}, {}, {}, {}, {}], // 6
                violations: [{}, {}], // 2
            };

        expect(quality.getLicenseScore(mockTortelliniOutput)).toBe(32);
    });

    test("No violations", () => {
        const mockTortelliniOutput = {
            packages: [{}, {}], // 2
            violations: [], // 0
        };

        expect(quality.getLicenseScore(mockTortelliniOutput)).toBe(100);
    });

    test("100% violations", () => {
        const mockTortelliniOutput = {
            packages: [{}, {}, {}], // 3
            violations: [{}, {}, {}], // 3
        };

        expect(quality.getLicenseScore(mockTortelliniOutput)).toBe(0);
    });

    test("No packages", () => {
        const mockTortelliniOutput = {
            packages: [], // 0
            violations: [], // 0
        };

        expect(quality.getLicenseScore(mockTortelliniOutput)).toBe(100);
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

        expect(quality.getMaintainabilityScore(mockIssues)).toBe(67);
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

        expect(quality.getMaintainabilityScore(mockIssues)).toBe(0);
    });

    test("Only solved issues", () => {
        const mockIssues = [
            {
                closed_at: "2022-12-06T15:00:00Z",
            },
        ];

        expect(quality.getMaintainabilityScore(mockIssues)).toBe(100);
    });

    test("No issues", () => {
        const mockIssues: any[] = [];

        expect(quality.getMaintainabilityScore(mockIssues)).toBe(100);
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

        expect(result).toBe(3);
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

        expect(result).toBe(5);
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

        expect(result).toBe(7);
    });
});

describe("Test hasDocumentation", () => {
    test("Existing docs folder", () => {
        const result = quality.hasDocumentationDir();

        const hasDocs =
            fs.existsSync("./docs") || fs.existsSync("./documentation");

        expect(result).toBe(hasDocs);
    });
});

test("Test getIssues", async () => {
    const result = await quality.getIssues({} as unknown as GitHubInfo);

    expect(result).toEqual(mockedOctokitIssues);
});