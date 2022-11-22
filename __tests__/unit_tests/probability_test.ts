import { MetaDataJournal } from "../../src/resources/journal";
import { deleteDuplicates } from "../../src/resources/citingPapers";
import { calculateProbabiltyOfReference } from "../../src/resources/probability"

test('empty map is handeled properly, returns empty array', () => {
  expect(calculateProbabiltyOfReference(new Map())).toStrictEqual([]);
});

test('singleton map is handled properly', () => {
  expect(calculateProbabiltyOfReference(new Map([["id", new MetaDataJournal("title", 1, 1, "journal", 0)]]))).toStrictEqual([1]);
});

test('multiple entries map is handled correctly', () => {
    expect(calculateProbabiltyOfReference(new Map([["id1", new MetaDataJournal("title1", 1, 1, "journal1", 0)], ["id2", new MetaDataJournal("title2", 10, 10, "journal2", 0)]]))).toStrictEqual([0, 1]);
});