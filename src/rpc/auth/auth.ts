import {RequestInterface} from '../base/define_interfaces'
import {AaDefaultRequest} from '../middleware/request'

class Auth {
    readonly request: RequestInterface

    constructor(r: RequestInterface = new AaDefaultRequest()) {
        this.request = r
    }
}