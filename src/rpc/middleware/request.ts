import {RequestInterface, RequestOptions, RequestStruct} from '../base/define_interfaces'
import {t_api_pattern} from '../../basic/urls/base'
import {normalizeRequestOptions} from '../base/fn'
import {fillObjects} from '../../basic/maps/groups'
import AaMiddleware from './middleware'
import {warn} from '../../alog/log'

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

    fetch(r: RequestStruct): Promise<unknown> {
        return fetch(r.url.href, {})
    }

    async request(r: RequestStruct): Promise<unknown> {
        if (this.middleware.deny(r)) {
            return new Promise<unknown>((resolve, reject) => {
                warn(`${r.url.method} ${r.url.href} is denied`)
            })
        }

        return await this.fetch(r)
    }

    async Request(api: t_api_pattern, options?: RequestOptions): Promise<unknown> {
        return this.request(this.normalizeOptions(api, options))
    }


    private normalizeOptions(api: t_api_pattern, options?: RequestOptions): RequestStruct {
        if (this.defaultOptions) {
            options = fillObjects(options, this.defaultOptions as any)
        }
        return normalizeRequestOptions(api, options)
    }
}