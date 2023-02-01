/*
This program has been developed by students from the bachelor Computer Science at
Utrecht University within the Software Project course.
© Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/**
 * This module sets up the directories and files that are needed for the unit tests.
 *
 * @module
 */

import { createFAIRSECODir } from "./pre";
import { createLogFile } from "./errorhandling/log";

// This is used for jest testing, runs before all tests
module.exports = async function () {
    createFAIRSECODir();
    createLogFile();
};
