import {RequestInterface, RequestOptions, RequestStruct} from '../base/define_interfaces'
import {t_api_pattern} from '../../basic/urls/base'
import {normalizeRequestOptions} from '../base/fn'
import {fillObjects} from '../../basic/maps/groups'
import AaMiddleware from './middleware'

export class AaDefaultRequest implements RequestInterface {
    readonly defaultOptions?: RequestOptions
    readonly middleware: AaMiddleware


    constructor(defaults?: RequestOptions, middleware: AaMiddleware = new AaMiddleware()) {
        this.defaultOptions = defaults
        this.middleware = middleware
    }


    needDebounce(options: RequestStruct): boolean {
        return false
    }

    fetch(api: t_api_pattern, options?: RequestOptions): Promise<unknown> {
        const opts = this.normalizeOptions(api, options)
        return fetch(opts.url.href, {})
    }

    async Request(api: t_api_pattern, options?: RequestOptions): Promise<unknown> {
        return await this.fetch(api, options)
    }

    private normalizeOptions(api: t_api_pattern, options?: RequestOptions): RequestStruct {
        if (this.defaultOptions) {
            options = fillObjects(options, this.defaultOptions as any)
        }
        return normalizeRequestOptions(api, options)
    }
}