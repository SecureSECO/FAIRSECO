import { Author, Journal } from "../src/resources/journal";
import { deleteDuplicates } from "../src/resources/citingPapers";

test("Check deleteDuplicates with two empty arrays", async () => {
    expect(deleteDuplicates([], [])).toStrictEqual([]);
});

test("Check deleteDuplicates with two identical singletons", async () => {
    const testJournal: Journal = new Journal("title", "DOI", "pmid", "pmcid", 2022, "database", []);
    expect(deleteDuplicates([testJournal], [testJournal])).toStrictEqual([testJournal]);
});

test("Check deleteDuplicates with two empty arrays", async () => {
    expect(deleteDuplicates([], [])).toStrictEqual([]);
});