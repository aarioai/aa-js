import {RequestInterface} from '../base/define_interfaces'
import {AaDefaultFetch} from '../middleware/fetch'

class Auth {
    readonly request: RequestInterface

    constructor(r: RequestInterface = new AaDefaultFetch()) {
        this.request = r
    }
}