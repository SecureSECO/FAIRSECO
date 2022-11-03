export class Journal {
    title: string;
    doi: string;
    mag: string;
    pmid: string;
    pmcid: string;
    year: number;
    database: string;

    constructor(titleConst: string, doiConst: string, magConst: string, pmidConst: string, pmcid: string, yearConst: number, databaseConst: string) {
        this.title = titleConst;
        this.year = yearConst;
        this.doi = doiConst;
        this.mag = magConst;
        this.pmid = pmidConst;
        this.pmcid = pmidConst;
        this.database = databaseConst;
    }
}

