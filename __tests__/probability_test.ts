import { MetaDataPaper } from "../src/resources/Paper";
import { calculateProbabiltyOfReference } from "../src/resources/probability";

test("empty map is handeled properly, returns empty array", () => {
    expect(calculateProbabiltyOfReference(new Map())).toStrictEqual([]);
});

test("singleton map is handled properly", () => {
    expect(
        calculateProbabiltyOfReference(
            new Map([["id", new MetaDataPaper("title", 1, 1, "Paper", 0)]])
        )
    ).toStrictEqual([1]);
});

test("multiple entries map is handled correctly", () => {
    expect(
        calculateProbabiltyOfReference(
            new Map([
                ["id1", new MetaDataPaper("title1", 1, 1, "Paper1", 0)],
                ["id2", new MetaDataPaper("title2", 10, 10, "Paper2", 0)],
            ])
        )
    ).toStrictEqual([0, 1]);
});
