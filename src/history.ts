/**
 * This module contains a function that handles getting and updating FAIRSECO history data.
 * 
 * @module
 */

import { ReturnObject } from "./getdata";
import * as fs from "fs";
import { QualityMetrics } from "./resources/qualitymetrics";
import { Citations } from "./resources/citations/paper"
import { FairtallyOutput } from "./resources/fairtally";
import { Output } from "./resources/searchseco"
import { ErrorLevel, LogMessage } from "./errorhandling/log";

/**
 * An object that contains historical data from FAIRSECO.
 * Missing data will be undefined.
 */
export interface HistoryData {
    date?: string,
    quality?: number,
    citations?: number,
    fairness?: number,
    matches?: number,
}

/**
 * Gets history data and updates the history file with new data.
 * - If the history file can not be read, the history is reset.
 * - If the last entry in the history has the current date, it will be updated with the new data.
 * 
 * @param filePath The path to read history from and write history to.
 * @param result The data gathered by FAIRSECO.
 * @returns The history data with the new data added.
 */
export function getHistoryData(filePath: string, result: ReturnObject[]): HistoryData[] {
    // Get current date
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const date =
        (day <= 9 ? "0" + String(day) : String(day)) +
        "/" +
        (month <= 9 ? "0" + String(month) : String(month)) +
        "/" +
        year;

    // Get quality score
    const quality = (result.find((ele) => (ele.ModuleName === "QualityMetrics"))?.Data as QualityMetrics | undefined)?.score;

    // Get citations
    const citationsData = result.find((ele) => (ele.ModuleName === "CitingPapers"))?.Data as Citations | undefined;
    const firstHandCitations = citationsData?.firstHandCitations;
    const secondHandCitations = citationsData?.secondHandCitations;
    const citations = firstHandCitations === undefined || secondHandCitations === undefined ? undefined : firstHandCitations + secondHandCitations;

    // Get fairness
    const fairnessOutput = (result.find((ele) => (ele.ModuleName === "fairtally"))?.Data as FairtallyOutput[] | undefined);
    const fairness = fairnessOutput !== undefined ? fairnessOutput[0].count : undefined;

    // Get method matches
    const searchsecoOutput = result.find((ele) => (ele.ModuleName === "SearchSECO"))?.Data as Output | undefined;
    let matches;
    if (searchsecoOutput?.methods !== undefined) {
        matches = 0;
        for (const method of searchsecoOutput.methods) {
            matches += method.matches.length;
        }
    }

    // New data object
    const newData = {
        date,
        quality,
        citations,
        fairness,
        matches
    }

    // Read the history file
    const historyData = readHistoryFile(filePath);

    // Check if the last entry is of the current date.
    // If it is, update it with the new data.
    // Otherwise, add a new entry
    let includeLater = false;
    if (historyData.length >= 1 && historyData[historyData.length - 1].date === date) {
        // Update the last entry
        const lastEntry = historyData[historyData.length - 1];
        Object.assign(lastEntry, newData);
    } else {
        // Append new data to the history if it has useful data.
        // Otherwise, append it later to exclude it from the history file.
        if (newData.quality !== undefined || newData.citations !== undefined || newData.fairness !== undefined || newData.fairness !== undefined) {
            historyData.push(newData);
        } else {
            includeLater = true;
        }
    }
    
    // Write new history to the history file
    try {
        fs.writeFileSync(filePath, JSON.stringify(historyData));
    } catch (error) {
        LogMessage("Failed to write to FAIRSECO history file:\n" + (error.message as string), ErrorLevel.err);
    }

    // Include new data after writing file, if needed
    if (includeLater) {
        historyData.push(newData);
    }

    return historyData;
}

function readHistoryFile(filePath: string): HistoryData[] {
    // Get the history data
    let historyData: HistoryData[] = [];
    try {
        // Read the history file
        const readData = JSON.parse(fs.readFileSync(filePath).toString());

        // Verify that the history data is an array
        if (readData.constructor !== Array) {
            throw new Error("Incorrect format (history is not an array)");
        }

        // Verify that the children are objects
        for (const data of readData) {
            if (typeof(data) !== "object") {
                throw new Error("Incorrect format (element of history is not an object)");
            }
        }
        
        historyData = readData;
    } catch (error) {
        if (error.code === "ENOENT") {
            // File not found
            LogMessage("No FAIRSECO history file found:\n" + (error.message as string), ErrorLevel.info);
        } else {
            // Error reading history file
            LogMessage("Failed to read FAIRSECO history file (history will be reset!):\n" + (error.message as string), ErrorLevel.warn);
        }
    }

    return historyData;
}