import {RequestInterface, RequestOptions} from './define_interfaces'
import {AaURL} from '../../basic/urls/url'
import {ApiPattern} from '../../basic/urls/base'
import {NIP} from '../../aa/atype/a_define_funcs'

export class AaFetchRequest implements RequestInterface {
    constructor() {
    }

    Request(api: ApiPattern | AaURL, options?: RequestOptions): Promise<unknown> {
        return NIP
    }
}