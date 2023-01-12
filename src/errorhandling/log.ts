/**
 * This module contains functions for logging program output.
 * 
 * @module
 */

import fs from "fs";

/**
 * Enum describing the severity of an error when logged by {@link LogMessage}.
 */
export enum ErrorLevel {
    info,
    warn,
    err,
}

/**
 * Logs an error or information message to console and appends the message to the log file.
 *
 * @param content - The string or error to be printed.
 * @param level - Severity of the error as an {@link ErrorLevel}.
 *
 * @see {@link ErrorLevel}
 */
export function LogMessage(content: string | Error, level: ErrorLevel): void {
    // Format the message
    const message: string = formatMessage(content, level);

    // Write the message to stdout or stderr based on the error level
    if (level >= ErrorLevel.err) {
        console.error(message);
    } else {
        console.log(message);
    }

    // Write the message to the log file
    try {
        fs.appendFileSync("./.FairSECO/program.log", message);
    } catch (e) {
        console.error(formatMessage(e, ErrorLevel.err));
    }
}

/**
 * Creates the log file.
 * 
 * Path: `.FairSECO/program.log`
 */
export function createLogFile(): void {
    // Open the log file
    const fd: number = fs.openSync("./.FairSECO/program.log", "w+");
    
    // Write to the log file
    try {
        fs.writeSync(fd, formatMessage("FairSECO Log initialized", ErrorLevel.info));
        fs.writeSync(fd, "\n------------------------------\n");
        fs.closeSync(fd);
    } catch {
        console.error(formatMessage("Failed to create log file", ErrorLevel.err));
    }
}

/**
 * Formats a message for logging.
 * @param content The message in the form of a string or Error.
 * @param level The {@link ErrorLevel | error level} of the message.
 * @returns The formatted message.
 */
export function formatMessage(content: string | Error, level: ErrorLevel): string {
    // Start the message with the current date
    let message: string = new Date().toLocaleString("en-US");

    // Add the error level to the message
    const levelNames = {
        [ErrorLevel.info]: "INFO",
        [ErrorLevel.warn]: "WARN",
        [ErrorLevel.err]: "ERR"
    };
    message += "- [" + levelNames[level] + "]: ";

    // Add the content of the message
    if (typeof content === "string") {
        message += content;
    } else {
        message += content.message;
    }

    return message;
}