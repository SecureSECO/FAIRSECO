/**
 * This module contains functions to handle docker exit codes based on error status.
 * 
 * @module
 */

// Known docker errors: https://komodor.com/learn/exit-codes-in-containers-and-kubernetes-the-complete-guide/
// Other exit codes indicate the contained command's exit code
const dockerErrors = new Map<number, string>();
dockerErrors.set(125, "Container failed to run error");
dockerErrors.set(
    126,
    "A command specified in the image specification could not be invoked"
);
dockerErrors.set(
    127,
    "File or directory specified in the image specification was not found"
);
dockerErrors.set(
    128,
    "Exit was triggered with an invalid exit code (valid codes are integers between 0-255)"
);
dockerErrors.set(
    134,
    "The container aborted itself using the abort() function."
);
dockerErrors.set(
    137,
    "Container was immediately terminated by the operating system via SIGKILL signal"
);
dockerErrors.set(
    139,
    "Container attempted to access memory that was not assigned to it and was terminated"
);
dockerErrors.set(
    143,
    "Container received warning that it was about to be terminated, then terminated"
);
dockerErrors.set(
    255,
    "Container exited, returning an exit code outside the acceptable range, meaning the cause of the error is not known"
);

/**
 * Checks if a docker exit code indicates an error with docker or the application.
 * @param exitCode The docker exit code.
 * @returns `true` if the exit code indicates an error from docker or the application.
 */
export function isError(exitCode: number): boolean {
    return exitCode !== 0;
}

/**
 * Checks if a docker exit code indicates a docker error.
 * @param exitCode The docker exit code.
 * @returns `true` if the exit code indicates a docker error, `false` if it indicates an application's return value.
 */
export function isDockerError(exitCode: number): boolean {
    return dockerErrors.has(exitCode);
}

/**
 * Checks if a docker exit code indicates a docker error and throws the error if it does.
 * No error is thrown if the exit code indicates an application error.
 * @param exitCode The docker exit code.
 */
export function throwDockerError(exitCode: number): void {
    if (isDockerError(exitCode)) {
        throw new Error(dockerErrors.get(exitCode));
    }
}

/**
 * Checks if a docker exit code indicates an error with docker or the application, and throw it if it does.
 * @param application The name of the used application.
 * @param exitCode The docker exit code.
 */
export function throwError(application: string, exitCode: number): void {
    if (isError(exitCode)) {
        // If the exit code is a docker error, throw it
        throwDockerError(exitCode);

        // Throw application error
        throw new Error(
            application + " application error: " + exitCode.toString()
        );
    }
}
