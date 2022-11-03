"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.semanticScholarCitations = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
function semanticScholarCitations(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const semanticScholarApiURL = "https://api.semanticscholar.org/graph/v1/paper/";
        const fieldsQuery = "/citations?fields=title,externalIds,year&limit=2";
        // get paper id
        const paperId = yield getSemanticScholarPaperId(title);
        const output = [];
        try {
            const response = yield (0, node_fetch_1.default)(semanticScholarApiURL + paperId + fieldsQuery, {
                method: 'GET',
                headers: {},
            });
            const outputText = yield response.text();
            console.log(outputText);
            const outputJSON = JSON.parse(outputText);
            console.log(outputJSON.data);
            outputJSON.data.forEach((element) => {
                if (element.citingPaper.externalIds !== undefined) {
                    console.log(element.citingPaper.externalIds);
                    // element.citingPaper.externalIds.forEach((key: any, value: any) => {
                    //     console.log(value);
                    // });
                }
                else {
                    console.log("jammer");
                }
            });
            return output;
        }
        catch (error) {
            console.log("error while searching semantic scholar with semantic scholar ID of: " + title);
            const output = JSON.parse("");
            return output;
        }
    });
}
exports.semanticScholarCitations = semanticScholarCitations;
function getSemanticScholarPaperId(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const semanticScholarApiURL = "https://api.semanticscholar.org/graph/v1/paper/";
        const searchQuery = "search?query=";
        try {
            const response = yield (0, node_fetch_1.default)(semanticScholarApiURL + searchQuery + "\"" + title + "\"", {
                method: 'GET',
                headers: {},
            });
            const output = yield response.text();
            const outputJSON = JSON.parse(output);
            const paperid = outputJSON.data[0].paperId;
            return paperid;
        }
        catch (error) {
            console.log("Error while fetching paperID from semantic scholar of: " + title);
            const output = JSON.parse("");
            return output;
        }
    });
}
