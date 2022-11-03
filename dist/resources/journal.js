"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Journal = void 0;
class Journal {
    constructor(titleConst, doiConst, magConst, pmidConst, pmcid, yearConst) {
        this.title = titleConst;
        this.year = yearConst;
        this.doi = doiConst;
        this.mag = magConst;
        this.pmid = pmidConst;
        this.pmcid = pmidConst;
    }
}
exports.Journal = Journal;
