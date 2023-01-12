/**
 * This module sets up the folders and files that are needed for the unit tests.
 * 
 * @module
 */

import { createFairSECODir } from "./pre";
import { createLogFile } from "./errorhandling/log";

// This is used for jest testing, runs before all tests
module.exports = async function () {
    createFairSECODir();
    createLogFile();
};
