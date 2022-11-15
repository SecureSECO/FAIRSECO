import { MetaDataJournal } from "./journal"

export function calculateProbabiltyOfReference(uniquePapers: Map<string, MetaDataJournal>): number[] {
    let mainPaperId: string = "";
    let highestContributors = 0;
    let lowestContributors = Number.MAX_SAFE_INTEGER;
    let highestCitations = 0;
    let lowestCitations = Number.MAX_SAFE_INTEGER;
    const output: number[] = new Array(uniquePapers.size).fill(0);
    uniquePapers.forEach((paper, key) => {
        if (paper.contributors > highestContributors) {
            highestContributors = paper.contributors;
            mainPaperId = key;
        }
        if (paper.contributors < lowestContributors)
            lowestContributors = paper.contributors;
        if (paper.citationCount > highestCitations)
            highestCitations = paper.citationCount;
        if (paper.citationCount < lowestCitations)
            lowestCitations = paper.citationCount;
    });
    const meanContributors = lowestContributors + ((highestContributors - lowestContributors) / 2);
    const meanCitations = lowestCitations + ((highestCitations - lowestCitations) / 2);
    let i: number = 0;
    const wordsMainPaper: string[] = uniquePapers.get(mainPaperId)?.title.toLowerCase().split(" ") as string[];
    uniquePapers.forEach((paper, key) => {
        if (key === mainPaperId)
            output[i] = 1;
        else if (paper.contributors <= meanContributors && paper.citationCount <= meanCitations)
            output[i] = 0;
        else {
            const wordsPaper = paper.title.toLowerCase().split(" ");
            let similarWordsCount = 0;
            for (let i = 0; i < wordsMainPaper.length; i++) {
                for (let j = 0; j < wordsPaper.length; j++) {
                    if (wordsMainPaper[i] === wordsPaper[j]) {
                        similarWordsCount++;
                        wordsPaper[j] = "";
                    }
                }
            }
            output[i] = similarWordsCount / wordsMainPaper.length;
        }
        i++;
    });
    return output;
}