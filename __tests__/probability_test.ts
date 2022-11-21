import { MetaDataJournal } from "../src/resources/journal";
import { deleteDuplicates } from "../src/resources/citingPapers";

function randomMetaDataJournals(length: number) {
    const amountBelowCitations = randomNumber(0, (length - 1) / 2);
    const amountBelowContributors = randomNumber(0, (length - 1) / 2);
    const highestContributors = randomNumber(90, 120);
    const lowestContributors = randomNumber(0, 10);
    const highestCitations = randomNumber(180, 240);
    const lowestCitations = randomNumber(0, 10);
    const mainPaperId = randomString(randomNumber(10, 20));
    for (let i = 0; i < length; i++) {
        
    }
}

function randomString(string_length: number) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars[rnum];
    }
    return randomstring;
}

function randomNumber(low: number, high: number) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
}
