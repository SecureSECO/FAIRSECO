import * as core from '@actions/core'

/**
 * Retrieves the url of the repository.
 * @returns The url of the repository the program is being run in.
 */
export async function getRepoUrl(): Promise<string>{

    const prefix = 'https://github.com/'
    const repository: string = core.getInput('repository')
    return prefix + repository

}