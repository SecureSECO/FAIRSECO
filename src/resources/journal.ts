export class Journal {
    title: string;
    doi: string;
    pmid: string;
    pmcid: string;
    year: number;
    database: string;
    authors: Author[];

    constructor(title: string, doi: string,  pmid: string, pmcid: string, year: number, database: string, authors: Author[]) {
        this.title = title;
        this.year = year;
        this.doi = doi;
        this.pmid = pmid;
        this.pmcid = pmcid;
        this.database = database;
        this.authors = authors;
    }
}

export class Author {
    givenNames: String;
    familyName: String;
    orchidId: String;
        
    constructor(givenNames: String, familyName: String, orchidId: String) {
        this.familyName = familyName;
        this.givenNames = givenNames;
        this.orchidId = orchidId;
    }
}

