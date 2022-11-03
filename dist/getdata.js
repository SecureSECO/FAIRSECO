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
exports.data = void 0;
const scholarly_1 = require("./resources/scholarly");
function data() {
    return __awaiter(this, void 0, void 0, function* () {
        const output = [];
        /*
        try {
            const tortelliniResult = await runTortellini();
            output.push(tortelliniResult);
        } catch (error) {
            console.error("Tortellini threw an error:");
            console.error(error);
        }
    
        try {
            const howfairisResult = await runHowfairis();
            output.push(howfairisResult);
        } catch (error) {
            console.error("Howfairis threw an error:");
            console.error(error);
        }
    
        try {
            const searchsecoResult = await runSearchseco();
            output.push(searchsecoResult);
        } catch (error) {
            console.error("Searchseco threw an error:");
            console.error(error);
        }
        */
        try {
            const scholarlyResult = yield (0, scholarly_1.runScholarly)("Autocalibration of accelerometer data for free-living physical activity assessment using local gravity and temperature: an evaluation on four continents");
            output.push(scholarlyResult);
        }
        catch (error) {
            console.error("Scholarly threw an error:");
            console.error(error);
        }
        return output;
    });
}
exports.data = data;
