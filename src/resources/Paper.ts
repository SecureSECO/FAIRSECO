import internal from "stream";

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

    constructor(title: string, doi: string, pmid: string, pmcid: string, year: number, database: string, authors: Author[], fields: string[], journal: string, url: string, numberOfCitations: number) {
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
        let output: Discipline = "Unknown";
        switch (input[0]) {
            case ("Computer Science"):
                output = "Formal Sciences";
                break;
            case ("Computer science"):
                output = "Formal Sciences";
                break;
            case ("Medicine"):
                output = "Applied Sciences";
                break;
            case ("Chemistry"):
                output = "Natural Sciences";
                break;
            case ("Biology"):
                output = "Natural Sciences";;
                break;
            case ("Materials Science"):
                output = "Applied Sciences";
                break;
            case ("Physics"):
                output = "Natural Sciences";
                break;
            case ("Geology"):
                output = "Natural Sciences";
                break;
            case ("Psychology"):
                output = "Social Sciences";
                break;
            case ("Art"):
                output = "Humanities";
                break;
            case ("History"):
                output = "Humanities";
                break;
            case ("Geography"):
                output = "Social Sciences";
                break;
            case ("Sociology"):
                output = "Social Sciences";
                break;
            case ("Business"):
                output = "Applied Sciences";
                break;
            case ("Political Science"):
                output = "Applied Sciences";
                break;
            case ("Political science"):
                output = "Applied Sciences";
                break;
            case ("Economics"):
                output = "Social Sciences";
                break;
            case ("Philosophy"):
                output = "Humanities";
                break;
            case ("Mathematics"):
                output = "Formal Sciences";
                break;
            case ("Engineering"):
                output = "Applied Sciences";
                break;
            case ("Environmental Science"):
                output = "Applied Sciences";
                break;
            case ("Environmental science"):
                output = "Applied Sciences";
                break;
            case ("Agricultural and Food Sciences"):
                output = "Applied Sciences";
                break;
            case ("Law"):
                output = "Humanities";
                break;
            case ("Education"):
                output = "Social Sciences";
                break;
            case ("Linguistics"):
                output = "Social Sciences";
                break;
        }
        return output;
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
    givenNames: string;
    familyName: string;
    orchidId: string;
        
    constructor(givenNames: string, familyName: string, orchidId: string) {
        this.familyName = familyName;
        this.givenNames = givenNames;
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
