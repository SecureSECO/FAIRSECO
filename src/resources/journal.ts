export class Journal {
    title: string;
    doi: string;
    pmid: string;
    pmcid: string;
    year: number;
    database: string;


    constructor(titleConst: string, doiConst: string,  pmidConst: string, pmcid: string, yearConst: number, databaseConst: string) {
        this.title = titleConst;
        this.year = yearConst;
        this.doi = doiConst;
        this.pmid = pmidConst;
        this.pmcid = pmidConst;
        this.database = databaseConst;
    }
}

