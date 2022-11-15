import fs from "fs";

/**
 * Enum describing the severity of an error when logged by {@link LogMessage}. Can be info, warn, and err
 */
export enum ErrorLevel {
    info,
    warn,
    err,
}

/**
 * Logs an error or information message to console and appends the message to the log file.
 *
 * @remarks
 * This function will only log the stack trace for errors if the verbose flag is set. (Once we implement the verbose flag)
 *
 * @param content - string or error to be printed
 * @param level - Severity of the error as an {@link ErrorLevel}
 * @returns nothing
 *
 * @see {@link ErrorLevel}
 */
export function LogMessage(content: string | Error, level: ErrorLevel): void {
    let message: string = "";
    const d: Date = new Date();
    message += d.toLocaleString("en-US");
    switch (level) {
        case ErrorLevel.info:
            message += "- [INFO]: ";
            break;
        case ErrorLevel.warn:
            message += "- [WARN]: ";
            break;
        case ErrorLevel.err:
            message += "- [ERR]: ";
            break;
        default:
    }
    if (typeof content === "string") {
        message += content;
    } else {
        message += content.message;
        // TODO: Check for the verbose flag here and print stack trace if necessary.
    }

    console.log(message);
    const fd: number = fs.openSync("./.FairSECO/program.log", "a+");
    try {
        fs.writeSync(fd, message);
        fs.closeSync(fd);
    } catch {
        console.error("");
    }
}

/**
 * Creates the log file on disk
 * @returns nothing
 */

export function createLogFile(): void {
    const fd: number = fs.openSync("./.FairSECO/program.log", "w+");
    const d: Date = new Date();
    try {
        fs.writeSync(fd, "[INFO] FairSECO Log initialized");
        fs.writeSync(fd, "[INFO] date:" + d.toDateString());
        fs.writeSync(fd, "\n------------------------------\n");
        fs.closeSync(fd);
    } catch {
        console.error("");
    }
}
