import {RequestInterface, RequestOptions} from './define_interfaces'
import {t_api_pattern} from '../../basic/urls/base'
import {NIP} from '../../aa/atype/a_define_funcs'

export class AaDefaultRequest implements RequestInterface {
    constructor() {
    }

    Request(api: t_api_pattern, options?: RequestOptions): Promise<unknown> {
        return NIP
    }
}