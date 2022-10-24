// Pre.ts is a possiblilty to handle certain precondition/checks before 
// executing the get data.  
import * as core from '@actions/core'

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
 