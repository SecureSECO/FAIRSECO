<<<<<<< HEAD
import { MetaDataPaper } from "./Paper";
import { ErrorLevel, LogMessage } from "../log";
/**
 *
 * @returns array containing for each paper a probability from 0 to 1 that they are a reference paper.
 * Probability is definied as the number of words that occur in both titles divided by the total number of words in the title of the main paper.
 */
export function calculateProbabiltyOfReference(
    uniquePapers: Map<string, MetaDataPaper>
): number[] {
=======
import { MetaDataJournal } from "./journal"
/**
 * 
 * @returns array containing for each paper a probability from 0 to 1 that they are a reference paper.
 * Probability is definied as the number of words that occur in both titles divided by the total number of words in the title of the main paper.
 */
export function calculateProbabiltyOfReference(uniquePapers: Map<string, MetaDataJournal>): number[] {
>>>>>>> Integration-Testing
    // initialization
    let mainPaperId: string = "";
    let highestContributors = 0;
    let lowestContributors = Number.MAX_SAFE_INTEGER;
    let highestCitations = 0;
    let lowestCitations = Number.MAX_SAFE_INTEGER;
    let i: number = 0;
    const output: number[] = new Array(uniquePapers.size).fill(0); // Holds probabilities for each paper that they are a reference paper

    // find highest/lowest contributor/citation count, then assign one paper as main
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
<<<<<<< HEAD
    });

    // calculate mean values of contributors and citations and find the unique id of the main paper
    const meanContributors =
        lowestContributors + (highestContributors - lowestContributors) / 2;
    const meanCitations =
        lowestCitations + (highestCitations - lowestCitations) / 2;
    const title = uniquePapers.get(mainPaperId)?.title;

    // Find the probabilty of a paper being a reference paper based on the similarity of the title to the main paper, ignoring papers beneath the mean value of contributors or citations.
    if (title === undefined) {
        LogMessage("Paper has no title", ErrorLevel.info);
    } else {
        const wordsMainPaper: string[] = title.toLowerCase().split(" ");
        const mainTitle: Map<string, number> = new Map();
        let count = 0;
        wordsMainPaper.forEach((word) => {
            if (mainTitle.has(word)) {
                count = mainTitle.get(word) as number;
                mainTitle.set(word, count + 1);
            } else mainTitle.set(word, 1);
        });
        uniquePapers.forEach((paper, id) => {
            if (id === mainPaperId) output[i] = 1;
            else if (
                paper.contributors <= meanContributors &&
                paper.citationCount <= meanCitations
            )
                output[i] = 0;
            else {
                const wordsPaper: string[] = paper.title
                    .toLowerCase()
                    .split(" ");
                const title: Map<string, number> = new Map();
                let similarWordsCount = 0;
                wordsPaper.forEach((word) => {
                    if (title.has(word)) {
                        count = title.get(word) as number;
                        title.set(word, count + 1);
                    } else title.set(word, 1);
                });
                mainTitle.forEach((count, word) => {
                    if (title.has(word))
                        similarWordsCount += Math.min(
                            mainTitle.get(word) as number,
                            title.get(word) as number
                        );
                });
=======
    }); 

    // calculate mean values of contributors and citations and find the unique id of the main paper
    const meanContributors = lowestContributors + ((highestContributors - lowestContributors) / 2);
    const meanCitations = lowestCitations + ((highestCitations - lowestCitations) / 2);
    const title = uniquePapers.get(mainPaperId)?.title;

    // Find the probabilty of a paper being a reference paper based on the similarity of the title to the main paper, ignoring papers beneath the mean value of contributors or citations.
    // TODO: change title strings to Map<word, count> and compare those.
    if(title === undefined){
        console.log("Paper has no title")
    }
    else{
        const wordsMainPaper: string[] = title.toLowerCase().split(" ");
        uniquePapers.forEach((paper, id) => {
            if (id === mainPaperId)
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
>>>>>>> Integration-Testing
                output[i] = similarWordsCount / wordsMainPaper.length;
            }
            i++;
        });
    }
    return output;
<<<<<<< HEAD
}
=======
}
>>>>>>> Integration-Testing
