import { Journal } from "../src/resources/journal";
import { deleteDuplicates } from "../src/resources/citingPapers";

test("Check if deleteDpulicates returns no duplicate Journal objects", async () => {
    const inputArrays: Journal[][] = randomJournalArrays(randomNumber(5, 50));
    const outputArray: Journal[] = deleteDuplicates(inputArrays[0], inputArrays[1]);
    const hasDuplicates: Boolean = containsDuplicates(outputArray);
    expect(hasDuplicates).toBe(false);
});

function randomJournalArrays(length: number) {
    const duplicates = randomNumber(1, length);
    var duplicateArray = new Array(length).fill(0);
    for (var i = 0; i < duplicates; i++)
        duplicateArray[i] = 1;
    duplicateArray = shuffleArray(duplicateArray);
    var array1: Journal[] = [];
    var array2: Journal[] = [];
    for (var i = 0; i < length; i++) {
        const randomJournal = randomTestJournal();
        array1 = array1.concat([randomJournal]);
        if (duplicateArray[i] === 1)
            array2 = array2.concat([randomJournal]);
        else
            array2 = array2.concat([randomTestJournal()]);
    }
    array2 = shuffleArray(array2);
    return [array1, array2];  
}

function randomTestJournal() {
    const title = randomString(randomNumber(10, 50));
    const year = randomNumber(1950, 2022);
    const doi = randomDOI();
    const pmid = randomNumberString(8);
    const pmcid = randomNumberString(8);
    const database = randomString(randomNumber(8, 16));
    return new Journal(title, doi, pmid, pmcid, year, database, []);
}

function randomDOI() {
    var randomDOI = "10.";
    var firstPart = randomNumberString(randomNumber(4, 8));
    var secondPart = randomNumberString(randomNumber(4, 8));
    return randomDOI + firstPart + "/" + secondPart;
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
function randomNumberString(string_length: number) {
    var chars = "0123456789";
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

function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = randomNumber(0, i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function containsDuplicates(array: any) {
    if (array.length !== new Set(array).size)
      return true;
    return false;
}
  