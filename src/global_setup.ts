import { createFairSECODir } from "./pre";
import { createLogFile } from "./log";

module.exports = async function () {
    createFairSECODir();
    createLogFile();
};
