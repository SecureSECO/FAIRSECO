
import { Paper } from "../src/resources/Paper";
import { deleteDuplicates } from "../src/resources/citingPapers";

test("Check deleteDuplicates with two empty arrays", () => {
    expect(deleteDuplicates([], [])).toStrictEqual([]);
});

test("Check deleteDuplicates with two identical singletons", () => {
    const testPaper: Paper = new Paper("title", "DOI", "pmid", "pmcid", 2022, "database", [], [], "journal", "url", 0);
    const expectedPaper: Paper = new Paper("title", "DOI", "pmid", "pmcid", 2022, "database", [], ["Unknown"], "journal", "url", 0);
    expect(deleteDuplicates([testPaper], [testPaper])).toStrictEqual([expectedPaper]);
});

test("Check deleteDuplicates with two different singletons", () => {
    const testPaper1: Paper = new Paper("title", "DOI", "pmid", "pmcid", 2022, "database", [], [], "journal", "url", 0);
    const testPaper2: Paper = new Paper("title2", "DOI2", "pmid2", "pmcid2", 2022, "database", [], [], "journal", "url", 0);
    const expectedPaper1: Paper = new Paper("title", "DOI", "pmid", "pmcid", 2022, "database", [], ["Unknown"], "journal", "url", 0);
    const expectedPaper2: Paper = new Paper("title2", "DOI2", "pmid2", "pmcid2", 2022, "database", [], ["Unknown"], "journal", "url", 0);
    expect(deleteDuplicates([testPaper1], [testPaper2])).toStrictEqual([expectedPaper1, expectedPaper2]);
});

test("Check deleteDuplicates with two different arrays with one similar paper", () => {
    const testPaper1: Paper = new Paper("title", "DOI", "pmid", "pmcid", 2022, "database", [], [], "journal", "url", 0);
    const testPaper2: Paper = new Paper("title2", "DOI2", "pmid2", "pmcid2", 2022, "database", [], [], "journal", "url", 0);
    const testPaper3: Paper = new Paper("title3", "DOI3", "pmid3", "pmcid3", 2022, "database", [], [], "journal", "url", 0);
    const expectedPaper1: Paper = new Paper("title", "DOI", "pmid", "pmcid", 2022, "database", [], ["Unknown"], "journal", "url", 0);
    const expectedPaper2: Paper = new Paper("title2", "DOI2", "pmid2", "pmcid2", 2022, "database", [], ["Unknown"], "journal", "url", 0);
    const expectedPaper3: Paper = new Paper("title3", "DOI3", "pmid3", "pmcid3", 2022, "database", [], ["Unknown"], "journal", "url", 0);
    expect(deleteDuplicates([testPaper1, testPaper3], [testPaper2, testPaper3])).toStrictEqual([expectedPaper1, expectedPaper3, expectedPaper2]);
});

test("Check Paper.getFields with one field", () => {
    const testFields = ["Computer Science"]
    const testPaper: Paper = new Paper("title", "DOI", "pmid", "pmcid", 2022, "database", [],  testFields, "journal", "url", 0);
    expect(testPaper.fields === testFields)
});

test("Check Paper.getFields with one 'unknown' field", () => {
    const testFields = ["Unknown"]
    const testPaper: Paper = new Paper("title", "DOI", "pmid", "pmcid", 2022, "database", [],  testFields, "journal", "url", 0);
    expect(testPaper.fields === testFields)
});

test("Check Paper.getFields with multiple (different) fields", () => {
    const testFields = ["Computer Science", "Geology", "Sociology", "Environmental Science", "Unknown"]
    const testPaper: Paper = new Paper("title", "DOI", "pmid", "pmcid", 2022, "database", [],  testFields, "journal", "url", 0);
    expect(testPaper.fields === testFields)
});


test("Check Paper.getDiscipline with one field", () => {
    const testFields = ["Computer Science"]
    const testPaper: Paper = new Paper("title", "DOI", "pmid", "pmcid", 2022, "database", [],  testFields, "journal", "url", 0);
    const expectedFields = ["Format Sciences"]
    expect(testPaper.fields === expectedFields)
});