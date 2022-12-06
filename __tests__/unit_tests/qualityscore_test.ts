import { ReturnObject } from "../../src/getdata";
import { GithubInfo } from "../../src/git";
import {
    getQualityScore,
    QualityScore,
} from "../../src/resources/qualityscore";

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
        .ReturnData as QualityScore;

    expect(qualityScore.fairnessScore).toBeCloseTo(3 * 20);
    expect(qualityScore.licenseScore).toBeCloseTo((100 * (12 - 3)) / 12);
    expect(qualityScore.hasDocs).toBeTruthy();
});
