export class Journal {
    title: string;
    doi: string;
    pmid: string;
    pmcid: string;
    year: number;
    database: string;
    authors: Author[];
    discipline: Discipline;
    fields: Field[];

    constructor(title: string, doi: string, pmid: string, pmcid: string, year: number, database: string, authors: Author[], fields: string[]) {
        this.title = title;
        this.year = year;
        this.doi = doi;
        this.pmid = pmid;
        this.pmcid = pmcid;
        this.database = database;
        this.authors = authors;
        this.fields = this.getFields(fields);
        this.discipline = this.getDiscipline(fields);
    }

    private getFields(input: string[]): Field[] {
        const output: Field[] = []
        input.forEach(element => {
            switch (element) {
                case ("Computer Science"):
                    output.push("Computer science");
                    break;
                case ("Medicine"):
                    output.push("Medicine");
                    break;
                case ("Chemistry"):
                    output.push("Chemistry");
                    break;
                case ("Biology"):
                    output.push("Biology");
                    break;
                case ("Materials Science"):
                    output.push("Materials science");
                    break;
                case ("Physics"):
                    output.push("Physics");
                    break;
                case ("Geology"):
                    output.push("Geology");
                    break;
                case ("Psychology"):
                    output.push("Psychology");
                    break;
                case ("Art"):
                    output.push("Art");
                    break;
                case ("History"):
                    output.push("History");
                    break;
                case ("Geography"):
                    output.push("Geography");
                    break;
                case ("Sociology"):
                    output.push("Sociology");
                    break;
                case ("Business"):
                    output.push("Business");
                    break;
                case ("Political Science"):
                    output.push("Political science");
                    break;
                case ("Economics"):
                    output.push("Economics");
                    break;
                case ("Philosophy"):
                    output.push("Philosophy");
                    break;
                case ("Mathematics"):
                    output.push("Mathematics");
                    break;
                case ("Engineering"):
                    output.push("Engineering");
                    break;
                case ("Environmental Science"):
                    output.push("Environmental science");
                    break;
                case ("Agricultural and Food Sciences"):
                    output.push("Biology");
                    break;
                case ("Law"):
                    output.push("Philosophy");
                    break;
                case ("Education"):
                    output.push("Psychology");
                    break;
                case ("Linguistics"):
                    output.push("Psychology");
                    break;
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

export class MetaDataJournal {
    title: string;
    contributors: number;
    citationCount: number;
    journal: string;
    probability: number;

    constructor(title: string, contributors: number, citationCount: number, journal: string, probabilty: number) {
        this.title = title;
        this.contributors = contributors;
        this.citationCount = citationCount;
        this.journal = journal;
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
