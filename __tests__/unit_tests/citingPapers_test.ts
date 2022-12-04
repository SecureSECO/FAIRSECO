import { Journal } from "../../src/resources/journal";
import { deleteDuplicates } from "../../src/resources/citingPapers";

test("Check deleteDuplicates with two empty arrays", () => {
    expect(deleteDuplicates([], [])).toStrictEqual([]);
});

test("Check deleteDuplicates with two identical singletons", () => {
    const testJournal: Journal = new Journal("title", "DOI", "pmid", "pmcid", 2022, "database", []);
    expect(deleteDuplicates([testJournal], [testJournal])).toStrictEqual([testJournal]);
});

test("Check deleteDuplicates with two different singletons", () => {
    const testJournal1: Journal = new Journal("title", "DOI", "pmid", "pmcid", 2022, "database", [])
    const testJournal2: Journal = new Journal("title2", "DOI2", "pmid2", "pmcid2", 2022, "database", [])
    expect(deleteDuplicates([testJournal1], [testJournal2])).toStrictEqual([testJournal1, testJournal2]);
});

test("Check deleteDuplicates with two different arrays with one similar paper", () => {
    const testJournal1: Journal = new Journal("title", "DOI", "pmid", "pmcid", 2022, "database", [])
    const testJournal2: Journal = new Journal("title2", "DOI2", "pmid2", "pmcid2", 2022, "database", [])
    const testJournal3: Journal = new Journal("title3", "DOI3", "pmid3", "pmcid3", 2022, "database", [])
    expect(deleteDuplicates([testJournal1, testJournal3], [testJournal2, testJournal3])).toStrictEqual([testJournal1, testJournal3, testJournal2]);
});