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

    public combine(input: Paper): Paper {
        if (this.doi === "")
            this.doi = input.doi;
        if (this.pmid === "")
            this.pmid = input.pmid;
        if (this.pmcid === "")
            this.pmcid = input.pmcid;
        if (this.authors !== input.authors) {
            input.authors.forEach(element => {
                if (!this.authors.includes(element))
                    this.authors.push(element);
            });
        }
        if (this.fields !== input.fields) {
            input.fields.forEach(element => {
                if (!this.fields.includes(element))
                    this.fields.push(element);
            });
        }
        return this;
    }

    private getFields(input: string[]): Field[] {
        const output: Field[] = []
        input.forEach(element => {
            element = element.toLowerCase();
            switch (element) {
                case ("computer science"):
                    output.push("Computer science");
                    break;
                case ("medicine"):
                    output.push("Medicine");
                    break;
                case ("chemistry"):
                    output.push("Chemistry");
                    break;
                case ("biology"):
                    output.push("Biology");
                    break;
                case ("materials science"):
                    output.push("Materials science");
                    break;
                case ("physics"):
                    output.push("Physics");
                    break;
                case ("geology"):
                    output.push("Geology");
                    break;
                case ("psychology"):
                    output.push("Psychology");
                    break;
                case ("art"):
                    output.push("Art");
                    break;
                case ("history"):
                    output.push("History");
                    break;
                case ("geography"):
                    output.push("Geography");
                    break;
                case ("sociology"):
                    output.push("Sociology");
                    break;
                case ("business"):
                    output.push("Business");
                    break;
                case ("political science"):
                    output.push("Political science");
                    break;
                case ("economics"):
                    output.push("Economics");
                    break;
                case ("philosophy"):
                    output.push("Philosophy");
                    break;
                case ("mathematics"):
                    output.push("Mathematics");
                    break;
                case ("engineering"):
                    output.push("Engineering");
                    break;
                case ("environmental science"):
                    output.push("Environmental science");
                    break;
                case ("agricultural and food sciences"):
                    output.push("Biology");
                    break;
                case ("law"):
                    output.push("Philosophy");
                    break;
                case ("education"):
                    output.push("Psychology");
                    break;
                case ("linguistics"):
                    output.push("Psychology");
                    break;
                // default:
                //     console.log(element)
                //     break;
            }
        });
        if (output.length === 0)
            output.push("Unknown");
        return output;
    }

    private getDiscipline(input: string[]): Discipline {
        const output: Discipline[] = [];
        for (const field of input) {
            switch (field) {
                case ("Computer Science"):
                    output.push("Formal Sciences");
                    break;
                case ("Computer science"):
                    output.push("Formal Sciences");
                    break;
                case ("Medicine"):
                    output.push("Applied Sciences");
                    break;
                case ("Chemistry"):
                    output.push("Natural Sciences");
                    break;
                case ("Biology"):
                    output.push("Natural Sciences");
                    break;
                case ("Materials Science"):
                    output.push("Applied Sciences");
                    break;
                case ("Physics"):
                    output.push("Natural Sciences");
                    break;
                case ("Geology"):
                    output.push("Natural Sciences");
                    break;
                case ("Psychology"):
                    output.push("Social Sciences");
                    break;
                case ("Art"):
                    output.push("Humanities");
                    break;
                case ("History"):
                    output.push("Humanities");
                    break;
                case ("Geography"):
                    output.push("Social Sciences");
                    break;
                case ("Sociology"):
                    output.push("Social Sciences");
                    break;
                case ("Business"):
                    output.push("Applied Sciences");
                    break;
                case ("Political Science"):
                    output.push("Applied Sciences");
                    break;
                case ("Political science"):
                    output.push("Applied Sciences");
                    break;
                case ("Economics"):
                    output.push("Social Sciences");
                    break;
                case ("Philosophy"):
                    output.push("Humanities");
                    break;
                case ("Mathematics"):
                    output.push("Formal Sciences");
                    break;
                case ("Engineering"):
                    output.push("Applied Sciences");
                    break;
                case ("Environmental Science"):
                    output.push("Applied Sciences");
                    break;
                case ("Environmental science"):
                    output.push("Applied Sciences");
                    break;
                case ("Agricultural and Food Sciences"):
                    output.push("Applied Sciences");
                    break;
                case ("Law"):
                    output.push("Humanities");
                    break;
                case ("Education"):
                    output.push("Social Sciences");
                    break;
                case ("Linguistics"):
                    output.push("Social Sciences");
                    break;
            }
        }
        const map: Map<Discipline, number> = new Map();
        output.forEach(element => {
            if (map.has(element))
                map.set(element, map.get(element) as number + 1);
            else
                map.set(element, 1);
        })
        let result: Discipline = "Unknown";
        let max = 0; let twoHighest = false;
        map.forEach((value, key) => {
            if (max < value) {
                result = key;
                max = value;
                twoHighest = false;
            }
            else if (max === value && max !== 0)
                twoHighest = true;
        })
        if (twoHighest)
            return output[0];
        else
            return result;
    }
}

export class MetaDataPaper {
    title: string;
    contributors: number;
    citationCount: number;
    Paper: string;
    probability: number;

    constructor(title: string, contributors: number, citationCount: number, Paper: string, probabilty: number) {
        this.title = title;
        this.contributors = contributors;
        this.citationCount = citationCount;
        this.Paper = Paper;
        this.probability = probabilty;
    }
}

export class Author {
    name: string;
    orchidId: string;
        
    constructor(name: string, orchidId: string) {
        this.name = name;
        this.orchidId = orchidId;
    }
}

export type Discipline = 
    | "Humanities" 
    | "Social Sciences"
    | "Natural Sciences"
    | "Formal Sciences"
    | "Applied Sciences"
    | "Unknown"

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
