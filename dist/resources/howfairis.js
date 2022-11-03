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
exports.runHowfairis = void 0;
const git_1 = require("../git");
const exec_1 = require("@actions/exec");
function runHowfairis() {
    return __awaiter(this, void 0, void 0, function* () {
        const gitrepo = yield (0, git_1.getRepoUrl)();
        console.debug("HowFairIs started");
        const cmd = "docker";
        const args = [
            "run",
            "--rm",
            "fairsoftware/fairtally",
            "--format",
            "json",
            "-o",
            "-",
            gitrepo,
        ];
        let stdout = "";
        let stderr = "";
        const options = {
            ignoreReturnCode: true,
        };
        options.listeners = {
            stdout: (data) => {
                stdout += data.toString();
            },
            stderr: (data) => {
                stderr += data.toString();
            },
        };
        const exitCode = yield (0, exec_1.exec)(cmd, args, options);
        console.debug("Docker running fairtally returned " + String(exitCode));
        console.debug("stdout:");
        console.debug(stdout);
        console.debug("stderr:");
        console.debug(stderr);
        return {
            ReturnName: "HowFairIs",
            ReturnData: JSON.parse(stdout)
        };
    });
}
exports.runHowfairis = runHowfairis;
