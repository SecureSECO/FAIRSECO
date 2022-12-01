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
        const inputField : string = input[0].toLowerCase()
        switch (inputField) {
            case ("computer science"):
                output.push("Formal Sciences");
                break;
            case ("medicine"):
                output.push("Applied Sciences");
                break;
            case ("chemistry"):
                output.push("Natural Sciences");
                break;
            case ("biology"):
                output.push("Natural Sciences");;
                break;
            case ("materials science"):
                output.push("Applied Sciences");
                break;
            case ("physics"):
                output.push("Natural Sciences");
                break;
            case ("geology"):
                output.push("Natural Sciences");
                break;
            case ("psychology"):
                output.push("Social Sciences");
                break;
            case ("art"):
                output.push("Humanities");
                break;
            case ("history"):
                output.push("Humanities");
                break;
            case ("geography"):
                output.push("Social Sciences");
                break;
            case ("sociology"):
                output.push("Social Sciences");
                break;
            case ("business"):
                output.push("Applied Sciences");
                break;
            case ("political science"):
                output.push("Applied Sciences");
                break;
            case ("economics"):
                output.push("Social Sciences");
                break;
            case ("philosophy"):
                output.push("Humanities");
                break;
            case ("mathematics"):
                output.push("Formal Sciences");
                break;
            case ("engineering"):
                output.push("Applied Sciences");
                break;
            case ("environmental science"):
                output.push("Applied Sciences");
                break;
            case ("agricultural and food sciences"):
                output.push("Applied Sciences");
                break;
            case ("law"):
                output.push("Humanities");
                break;
            case ("education"):
                output.push("Social Sciences");
                break;
            case ("linguistics"):
                output.push("Social Sciences");
                break;
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

export class Citations {
    papers: Paper[];
    unqiueFields: Field[];
    firstYear: number;
    firstHandCitations: number;
    secondHandCitations: number;
    disciplines: Map<Discipline, number>;

    constructor(papers: Paper[]) {
        this.papers = papers;
        this.firstHandCitations = this.papers.length;
        let firstYear = Number.MAX_SAFE_INTEGER;
        const unqiueFields: Set<Field> = new Set();
        let secondHandCitations = 0;
        const disciplines: Map<Discipline, number> = new Map;
        papers.forEach(paper => {
            if (paper.year < firstYear)
                firstYear = paper.year;
            paper.fields.forEach(field => {
                unqiueFields.add(field);
            })
            secondHandCitations += paper.numberOfCitations;
            if (disciplines.has(paper.discipline))
                disciplines.set(paper.discipline, disciplines.get(paper.discipline) as number + 1);
            else
                disciplines.set(paper.discipline, 1);
        })
        this.unqiueFields = Array.from(unqiueFields.values());
        this.firstYear = firstYear;
        this.secondHandCitations = secondHandCitations;
        this.disciplines = disciplines;
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
