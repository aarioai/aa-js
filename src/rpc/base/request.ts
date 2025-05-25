import {NormalizedRequestOptions, RequestInterface, RequestOptions} from './define_interfaces'
import {t_api_pattern} from '../../basic/urls/base'
import {NIP} from '../../aa/atype/a_define_funcs'
import {normalizeRequestOptions} from './fn'

export class AaDefaultRequest implements RequestInterface {
    constructor() {
    }

    Request(api: t_api_pattern | NormalizedRequestOptions, options?: RequestOptions): Promise<unknown> {
        const opts = typeof api === 'string' ? normalizeRequestOptions(api, options) : api

        return NIP
    }
}