"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.filterData = exports.getFileFromArtifact = exports.getArtifactData = exports.runTortellini = void 0;
const artifact = __importStar(require("@actions/artifact"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml_1 = __importDefault(require("yaml"));
function runTortellini(artifactObject) {
    return __awaiter(this, void 0, void 0, function* () {
        // An artifact object is only passed in the unit test. If that is the case,
        // set the download destination to the unit test output folder.
        // If not, use the regular Github Action artifact, and the normal output folder
        let destination = "";
        if (artifactObject !== undefined) {
            destination = ".tortellini-unit-test";
        }
        else {
            artifactObject = artifact;
            destination = ".tortellini-artifact";
        }
        const downloadResponse = yield getArtifactData("tortellini-result", destination, artifactObject);
        const fileContents = yield getFileFromArtifact(downloadResponse, "evaluation-result.yml");
        const obj = yaml_1.default.parse(fileContents);
        const filteredData = yield filterData(obj);
        return {
            ReturnName: "Tortellini",
            ReturnData: filteredData,
        };
    });
}
exports.runTortellini = runTortellini;
// Download the artifact that was uploaded by Tortellini
function getArtifactData(artifactName, destination, artifactObject) {
    return __awaiter(this, void 0, void 0, function* () {
        const artifactClient = artifactObject.create();
        const downloadResponse = yield artifactClient.downloadArtifact(artifactName, destination);
        return downloadResponse;
    });
}
exports.getArtifactData = getArtifactData;
// Get a file from the artifact as a string
function getFileFromArtifact(dlResponse, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        let filePath = "";
        if (dlResponse.downloadPath === undefined)
            filePath = fileName;
        else
            filePath = path.join(dlResponse.downloadPath, fileName);
        const buffer = fs.readFileSync(filePath);
        return buffer.toString();
    });
}
exports.getFileFromArtifact = getFileFromArtifact;
// Only get the data that is relevant for license checking
// To make sure all properties are always present,
// replace undefined properties with a dash
function filterData(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        // Project data
        const project = obj.analyzer.result.projects[0];
        const projData = {
            id: project.id || "-",
            licenses: project.declared_licenses || "-",
            description: project.description || "-",
            authors: project.authors || "-",
            vcs: project.vcs_processed || "-",
        };
        // Package data
        const packages = obj.analyzer.result.packages;
        const packData = [];
        for (const pack of packages) {
            const p = {
                id: pack.package.id || "-",
                licenses: pack.package.declared_licenses || "-",
                description: pack.package.description || "-",
                authors: pack.package.authors || "-",
                vcs: pack.package.vcs_processed || "-",
            };
            packData.push(p);
        }
        // Violations
        const viol = obj.evaluator.violations;
        return { project: projData, packages: packData, violations: viol };
    });
}
exports.filterData = filterData;
