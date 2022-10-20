import * as core from '@actions/core'

export async function getRepoUrl(): Promise<string>{

    const prefix = 'https://github.com/'
    const repository: string = core.getInput('repository')
    return prefix + repository

}