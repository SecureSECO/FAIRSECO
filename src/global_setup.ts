import { createFairSECODir } from "./pre";
import { createLogFile } from "./log";

// This is used for jest testing, runs before all tests
module.exports = async function () {
    createFairSECODir();
    createLogFile();
};
