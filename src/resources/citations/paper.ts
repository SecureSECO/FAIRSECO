/**
 * Contains class definitions for handling papers and getting citation information.
 * 
 * @module
 */

/** All possible fields. */
export type Field = 
    | "Philosophy" 
    | "Art"
    | "History"
    | "Economics"
    | "Geography"
    | "Psychology"
    | "Sociology"
    | "Biology"
    | "Chemistry"
    | "Geology"
    | "Physics"
    | "Mathematics"
    | "Computer science"
    | "Business"
    | "Engineering"
    | "Environmental science"
    | "Medicine"
    | "Political science"
    | "Materials science"
    | "Unknown"

/** All possible disciplines. */
export type Discipline = 
    | "Humanities" 
    | "Social Sciences"
    | "Natural Sciences"
    | "Formal Sciences"
    | "Applied Sciences"
    | "Unknown"

/** Contains the data belonging to a paper found in OpenAlex or Semantic Scholar. */
export class Paper {
    title: string;
    doi: string;
    pmid: string;
    pmcid: string;
    year: number;
    database: string;
    authors: Author[];
    discipline: Discipline;
    fields: Field[];
    journal: string;
    url : string;
    numberOfCitations: number;

    constructor(title: string,
                doi: string,
                pmid: string,
                pmcid: string,
                year: number,
                database: string,
                authors: Author[],
                fields: string[],
                journal: string,
                url: string,
                numberOfCitations: number) {
        this.title = title;
        this.year = year;
        this.doi = doi;
        this.pmid = pmid;
        this.pmcid = pmcid;
        this.database = database;
        this.authors = authors;
        this.fields = this.getFields(fields);
        this.discipline = this.getDiscipline(fields);
        this.journal = journal;
        this.url = url;
        this.numberOfCitations = numberOfCitations;
    }

    /**
     * Combines the metadata of this paper with that of another.
     * 
     * @param input The other paper.
     * @returns A paper containing the combined metadata of both papers.
     */
    public combine(input: Paper): Paper {
        // Combine identifiers
        if (this.doi === "") {
            this.doi = input.doi;
        }
        if (this.pmid === "") {
            this.pmid = input.pmid;
        }
        if (this.pmcid === "") {
            this.pmcid = input.pmcid;
        }
        
        // Combine authors
        const uniqueAuthors = new Set<Author>(this.authors.concat(input.authors));
        this.authors = Array.from(uniqueAuthors.values());

        // Combine fields
        const uniqueFields = new Set<Field>(this.fields.concat(input.fields));
        this.fields = Array.from(uniqueFields.values());

        // Combine databases
        if (!this.database.includes(input.database)) {
            this.database += ", " + input.database;
        }

        return this;
    }

    private static readonly fieldMap : {[index: string] : Field} = {
        "computer science": "Computer science",
        "medicine": "Medicine",
        "chemistry": "Chemistry",
        "biology": "Biology",
        "materials science": "Materials science",
        "physics": "Physics",
        "geology": "Geology",
        "psychology": "Psychology",
        "art": "Art",
        "history": "History",
        "geography": "Geography",
        "sociology": "Sociology",
        "business": "Business",
        "political science": "Political science",
        "economics": "Economics",
        "philosophy": "Philosophy",
        "mathematics": "Mathematics",
        "engineering": "Engineering",
        "environmental science": "Environmental science",
        "agricultural and food sciences": "Biology",
        "law": "Philosophy",
        "education": "Psychology",
        "linguistics": "Psychology",
    }

    private getFields(input: string[]): Field[] {
        // Get the unique fields
        const uniqueFields = new Set<Field>();
        for (const subject of input) {
            uniqueFields.add(Paper.fieldMap[subject.toLowerCase()] ?? "Unknown");
        }
        
        // Return an array of the unique fields,
        // or an array with a single unknown if it's empty
        const fields = Array.from(uniqueFields.values());
        if (fields.length > 0) {
            return fields;
        } else {
            return ["Unknown"];
        }
    }

    private static readonly disciplineMap : {[index: string] : Discipline} = {
        "computer science" : "Formal Sciences",
        "medicine" : "Applied Sciences",
        "chemistry" : "Natural Sciences",
        "biology" : "Natural Sciences",
        "materials science" : "Applied Sciences",
        "physics" : "Natural Sciences",
        "geology" : "Natural Sciences",
        "psychology" : "Social Sciences",
        "art" : "Humanities",
        "history" : "Humanities",
        "geography" : "Social Sciences",
        "sociology" : "Social Sciences",
        "business" : "Applied Sciences",
        "political science" : "Applied Sciences",
        "economics" : "Social Sciences",
        "philosophy" : "Humanities",
        "mathematics" : "Formal Sciences",
        "engineering" : "Applied Sciences",
        "environmental science" : "Applied Sciences",
        "agricultural and food sciences": "Applied Sciences",
        "law" : "Humanities",
        "education" : "Social Sciences",
        "linguistics" : "Social Sciences",
    }

    private getDiscipline(input: string[]): Discipline {
        // Get the discipline of each subject
        const uniqueDisc = new Set<Discipline>();
        for (const subject of input) {
            uniqueDisc.add(
                Paper.disciplineMap[subject.toLowerCase()] ?? "Unknown"
            );
        }

        // Return an array of the unique disciplines,
        // or an array with a single unknown if it's empty
        let output = Array.from(uniqueDisc.values());
        if (output.length <= 0) {
            output = ["Unknown"];
        }

        // Count the number of occurences of each discipline
        const map: Map<Discipline, number> = new Map();
        for (const disc of output) {
            if (map.has(disc)) {
                map.set(disc, (map.get(disc) as number) + 1);
            } else {
                map.set(disc, 1);
            }
        }

        // Get the main (most common) discipline
        let mainDiscipline: Discipline = "Unknown";
        let max = 0;
        for (const [key, value] of map) {
            if (key !== "Unknown" && value > max) {
                max = value;
                mainDiscipline = key;
            }
        }

        return mainDiscipline;
    }
}

/** Contains metadata belonging to a paper found in OpenAlex or Semantic Scholar. */
export class MetaDataPaper {
    title: string;
    contributors: number;
    citationCount: number;
    paperID: string;

    constructor(
        title: string,
        contributors: number,
        citationCount: number,
        paperID: string
    ) {
        this.title = title;
        this.contributors = contributors;
        this.citationCount = citationCount;
        this.paperID = paperID;
    }
}

/** Contains the name and OrchidID of an author. */
export class Author {
    name: string;
    orchidID: string;
        
    constructor(name: string, orchidID: string) {
        this.name = name;
        this.orchidID = orchidID;
    }
}

/**
 * Contains papers that cite the software, and general information about the citations.
 */
export class Citations {
    papers: Paper[];
    uniqueFields: Field[];
    firstYear: number;
    firstHandCitations: number;
    secondHandCitations: number;
    disciplines: {[index: string]: number};

    /** 
     * Analyzes metadata of citing papers and constructs the object containing this information.
     * 
     * @param papers The citing papers.
     * @returns An object containing citation information.
     */
    constructor(papers: Paper[]) {
        let firstYear = Number.MAX_SAFE_INTEGER;
        
        let secondHandCitations = 0;
        const uniqueFields: Set<Field> = new Set();
        let disciplines: {[index: string]: number} = {};

        for (const paper of papers) {
            // Find year of oldest paper
            firstYear = Math.min(firstYear, paper.year);
            
            // Find secondhand citations
            secondHandCitations += paper.numberOfCitations;

            // Find all fields occuring in papers
            for (const field of paper.fields) {
                uniqueFields.add(field);
            };

            // Count the disciplines of all papers
            const disciplineCounter = disciplines[paper.discipline] ?? 0 as number;
            disciplines[paper.discipline] = disciplineCounter + 1;
        };
        
        this.papers = papers;
        this.firstHandCitations = this.papers.length;
        this.uniqueFields = Array.from(uniqueFields.values());
        this.firstYear = firstYear;
        this.secondHandCitations = secondHandCitations;
        this.disciplines = disciplines;
    }
}
