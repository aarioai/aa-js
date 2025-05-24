import {RequestInterface} from '../base/define_interfaces'
import {AaBasicRequest} from '../base/basic_request'

class Auth {
    readonly request: RequestInterface

    constructor(r: RequestInterface = new AaBasicRequest()) {
        this.request = r
    }
}