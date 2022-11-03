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
exports.post = void 0;
const yaml_1 = __importDefault(require("yaml"));
const fs_1 = __importDefault(require("fs"));
const webapp_1 = require("./webapp");
// Main function
function post(result) {
    return __awaiter(this, void 0, void 0, function* () {
        createFairSECODir("./.FairSECO/"); // Make sure the output dir exists before we place files in it.
        createReport(result); // Create report.yml file
        yield generateHTML(result);
        return true;
    });
}
exports.post = post;
function createFairSECODir(path) {
    // Create dir if not exists
    console.log("Creating FairSECO directory.");
    try {
        fs_1.default.mkdirSync(path);
    }
    catch (_a) {
        console.log("Folder already exists, skipping");
    }
}
// Generate the report of FairSeco
function createReport(result) {
    const fd = fs_1.default.openSync("./.FairSECO/Report.yml", "w+");
    try {
        console.log(result);
        fs_1.default.writeSync(fd, yaml_1.default.stringify(result));
        console.log("Successfully wrote YML file to dir");
        fs_1.default.closeSync(fd);
    }
    catch (_a) {
        console.error("Error writing yaml file");
    }
}
// Make a webapp from the report
function generateHTML(result) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, webapp_1.WriteHTML)(result, "./.FairSECO/index.html");
            console.log("Successfully wrote HTML to dir");
            yield (0, webapp_1.WriteCSS)("./.FairSECO/style.css");
            console.log("Successfully wrote CSS to dir");
        }
        catch (_a) {
            console.error("Error writing HTML file");
            ;
        }
    });
}
