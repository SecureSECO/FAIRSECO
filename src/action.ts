import {pre} from './pre'
import {data} from './getdata'
import {post} from './post'


export async function main(): Promise<void> {
    try {
    
        pre()  // call preconditions check. 
        data() // call data check. 
        post() // call post check. 
        
    } catch (error) {
        // catch error
    }
}