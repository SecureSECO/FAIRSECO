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

export class MetaDataJournal {
    title: string;
    contributors: number;
    citationCount: number;
    journal: string;

    constructor(title: string, contributors: number, citationCount: number, journal: string) {
        this.title = title;
        this.contributors = contributors;
        this.citationCount = citationCount;
        this.journal = journal;
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

