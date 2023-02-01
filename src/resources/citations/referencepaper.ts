/*
This program has been developed by students from the bachelor Computer Science at
Utrecht University within the Software Project course.
© Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/**
 * This module contains a function that selects reference papers for a paper title.
 *
 * @module
 */

import { MetaDataPaper } from "./paper";

/**
 * Selects papers that are likely a reference paper of the main paper given by its title.
 * The number of contributors should be at least the average of contributors of all papers given.
 * Probability is defined as the number of words that occur in both titles divided by the total number of words in the title of the main paper.
 *
 * @param title The title of the main paper.
 * @param uniquePapers A map containing the ID and metadata of the papers.
 * @param probabilityThreshold The minimum probability a paper need to be counted as a reference paper.
 *
 * @returns An array containing the keys of papers that are likely a reference paper.
 */
export function selectReferencePapers(
    title: string,
    uniquePapers: Map<string, MetaDataPaper>,
    probabilityThreshold: number
): string[] {
    let contributors = 0;
    let citations = 0;
    let highestContributors = 0;
    let lowestContributors = Number.MAX_SAFE_INTEGER;
    let highestCitations = 0;
    let lowestCitations = Number.MAX_SAFE_INTEGER;

    // Find the highest/lowest contributor/citation count
    uniquePapers.forEach((paper, key) => {
        contributors += paper.contributors;
        if (paper.contributors > highestContributors) {
            highestContributors = paper.contributors;
        }
        lowestContributors = Math.min(lowestContributors, paper.contributors);

        citations += paper.citationCount;
        highestCitations = Math.max(highestCitations, paper.citationCount);
        lowestCitations = Math.min(lowestCitations, paper.citationCount);
    });

    // Calculate mean values of contributors and citations
    const meanContributors = contributors / uniquePapers.size;
    const meanCitations = citations / uniquePapers.size;

    // Holds IDs of works that are likely a reference paper
    const output: string[] = [];

    // Get number of occurences of unique words in main title
    const mainTitleWordOccurences: Map<string, number> = wordOccurences(title);

    // Find the probabilty of a paper being a reference paper based on the similarity of the title to the main paper.
    // Papers that meet the probability threshold are added to the output.
    uniquePapers.forEach((paper, id) => {
        // Ignore papers that have less than the mean value of contributors or citations
        if (
            paper.contributors >= meanContributors &&
            paper.citationCount >= meanCitations
        ) {
            // Get number of occurences of unique words in paper title
            const paperWordOccurences: Map<string, number> = wordOccurences(
                paper.title
            );

            // Calculate probability of being a reference paper
            let similarWordsCount = 0;
            mainTitleWordOccurences.forEach((count, word) => {
                if (paperWordOccurences.has(word)) {
                    similarWordsCount += Math.min(
                        mainTitleWordOccurences.get(word) as number,
                        paperWordOccurences.get(word) as number
                    );
                }
            });
            const probability = similarWordsCount / title.split(" ").length;

            // Add paper to output if the probability is high enough
            if (probability >= probabilityThreshold) {
                output.push(id);
            }
        }
    });

    return output;
}

// Counts the number of occurences of each unique word of a title
function wordOccurences(title: string): Map<string, number> {
    const wordCount: Map<string, number> = new Map();

    for (const word of title.toLowerCase().split(" ")) {
        if (wordCount.has(word)) {
            const count = wordCount.get(word) as number;
            wordCount.set(word, count + 1);
        } else {
            wordCount.set(word, 1);
        }
    }

    return wordCount;
}
