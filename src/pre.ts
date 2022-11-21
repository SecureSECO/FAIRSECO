import * as core from '@actions/core'

/**
 * Handles preconditions for getting the data.
 * @returns Whether the preconditions for getting the data are satisfied.
 */
export async function pre():Promise<boolean>{

    try {
        const repositories: string = core.getInput('repository')
        if (repositories === '') {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        core.setFailed(error.message)
    }
    return false
}
 