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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScholarly = void 0;
const semanticscholarAPI_1 = require("./semanticscholarAPI");
const openalexAPI_1 = require("./openalexAPI");
function runScholarly(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const outData1 = yield (0, semanticscholarAPI_1.semanticScholarCitations)(title);
        const outData2 = yield (0, openalexAPI_1.openAlexCitations)(title);
        const objString = JSON.stringify(outData1);
        const obj1 = JSON.parse(objString);
        const objString2 = JSON.stringify(outData2);
        const obj2 = JSON.parse(objString2);
        let uniques = [];
        obj1.forEach((e1) => {
            let duplicate = false;
            obj2.forEach((e2) => {
                if (e1.title === e2.title) {
                    duplicate = true;
                }
            });
            if (!duplicate) {
                uniques = uniques.concat([e1.title]);
            }
        });
        obj2.forEach((element) => {
            uniques = uniques.concat([element.title]);
        });
        return {
            ReturnName: "Scholarly",
            ReturnData: outData2,
        };
    });
}
exports.runScholarly = runScholarly;
