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
exports.openAlexCitations = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
function openAlexCitations(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiURL = "https://api.openalex.org/";
        const query = "works?filter=cites:";
        const filter = ",type:journal-article";
        // get paper id
        const paperId = yield getOpenAlexPaperId(title);
        const paperIdSliced = paperId.replace("https://openalex.org/", "");
        try {
            // get meta data for amount of results
            let outputText = "";
            const firstResponse = yield (0, node_fetch_1.default)(apiURL + query + paperIdSliced + filter + "&per-page=1", {
                method: 'GET',
                headers: {},
            });
            const firstResponseText = yield firstResponse.text();
            const firstResponseJSON = JSON.parse(firstResponseText);
            const amount = firstResponseJSON.meta.count;
            const pages = Math.ceil(amount / 200);
            for (let i = 1; i <= pages; i++) {
                const response = yield (0, node_fetch_1.default)(apiURL + query + paperIdSliced + filter + "&per-page=200", {
                    method: 'GET',
                    headers: {},
                });
                const responseText = yield response.text();
                const responseJSON = JSON.parse(responseText);
                outputText += JSON.stringify(responseJSON.results).slice(1, -1) + ",";
            }
            outputText = "[" + outputText.slice(0, -1) + "]";
            return JSON.parse(outputText);
        }
        catch (error) {
            console.log("error while searching openAlex with openAlex ID of: " + title);
            return JSON.parse("");
        }
    });
}
exports.openAlexCitations = openAlexCitations;
function getOpenAlexPaperId(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiURL = "https://api.openalex.org/";
        const searchQuery = "works?search=";
        try {
            const response = yield (0, node_fetch_1.default)(apiURL + searchQuery + title, {
                method: 'GET',
                headers: {},
            });
            const output = yield response.text();
            const outputJSON = JSON.parse(output);
            const paperid = outputJSON.results[0].id;
            ;
            return paperid;
        }
        catch (error) {
            console.log("Error while fetching paperID from openAlex of: " + title);
            const output = JSON.parse("");
            return output;
        }
    });
}
