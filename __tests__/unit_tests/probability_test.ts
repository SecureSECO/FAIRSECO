import { MetaDataPaper } from "../../src/resources/citations/Paper";
import { selectReferencePapers } from "../../src/resources/citations/referencepaper";

test("Empty map is handeled properly, returns empty array", () => {
    expect(selectReferencePapers("", new Map(), 1)).toStrictEqual([]);
});

test("Singleton map is handled properly", () => {
    expect(
        selectReferencePapers(
            "title",
            new Map([["id", new MetaDataPaper("title", 1, 1, "Paper")]]),
            1
        )
    ).toStrictEqual(["id"]);
});

test("Multiple entries map is handled correctly", () => {
    expect(
        selectReferencePapers(
            "title1",
            new Map([
                ["id1", new MetaDataPaper("title1", 1, 1, "Paper1")],
                ["id2", new MetaDataPaper("title2", 10, 10, "Paper2")],
            ]),
            1
        )
    ).toStrictEqual([]);
});
