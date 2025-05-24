import {RequestInterface} from '../base/define_interfaces'
import {AaFetchRequest} from '../base/fetch_request'

class Auth {
    readonly request: RequestInterface

    constructor(r: RequestInterface = new AaFetchRequest()) {
        this.request = r
    }
}