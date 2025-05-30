import {RequestHooks, RequestInterface, RequestOptions, RequestStruct} from '../base/define_interfaces'
import {t_api_pattern} from '../../basic/urls/base'
import {normalizeRequestOptions} from '../base/fn'
import {fillObjects} from '../../basic/maps/groups'
import AaMiddleware from './middleware'
import {reject} from '../../basic/promises/fn'
import {FetchOptions} from '../base/define_fetch'
import {normalizeFetchOptions} from '../base/fn_fetch'
import {AError} from '../../aa/aerror/error'
import json from '../../aa/atype/json'
import {ResponseBody, ResponseBodyData} from '../../aa/atype/a_server_dto'
import {isOK} from '../../aa/aerror/fn'
import {E_ParseResponseBodyFailed} from '../base/errors'

export class AaRequest implements RequestInterface {
    readonly defaultOptions?: RequestOptions
    readonly middleware: AaMiddleware


    constructor(defaults?: RequestOptions, middleware: AaMiddleware = new AaMiddleware()) {
        this.defaultOptions = defaults
        this.middleware = middleware
    }


    fetch(url: string, options: FetchOptions): Promise<ResponseBodyData> {
        return window.fetch(url, options).then(resp => {
            let err = new AError(resp.status)
            if (!err.isOK()) {
                throw err
            }
            // Handle HEAD
            if (!options.method || options.method === 'HEAD') {
                return {
                    code: err.code,
                    msg: err.toString(),
                    data: null,
                } as ResponseBody
            }
            let bodyText = ''
            try {
                return resp.text().then(text => {
                    bodyText = text
                    return json.Unmarshal(text) as ResponseBody
                })
            } catch {
                throw E_ParseResponseBodyFailed.widthDetail(bodyText)
            }
        }).then(resp => {
            if (isOK(resp.code)) {
                return resp.data
            }
            throw new AError(resp.code, resp.msg)
        })
    }

    request(r: RequestStruct, hooks?: RequestHooks): Promise<ResponseBodyData> {
        if (hooks?.preHook) {
            r = hooks.preHook(r)
        }
        const [denied, err] = this.middleware.denied(r)
        if (denied) {
            return hooks?.deniedHook ? hooks.deniedHook(err, r) : reject(err.widthDetail(`${r.url.method} ${r.url.href} is denied`))
        }
        if (hooks?.beforeFetchHook) {
            return hooks.beforeFetchHook(r).then((r: RequestStruct) => {
                return this.fetch(r.url.href, normalizeFetchOptions(r))
            })
        }
        return this.fetch(r.url.href, normalizeFetchOptions(r))
    }

    Request(api: t_api_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<ResponseBodyData> {
        return this.request(this.normalizeOptions(api, options), hooks)
    }


    private normalizeOptions(api: t_api_pattern, options?: RequestOptions): RequestStruct {
        if (this.defaultOptions) {
            options = fillObjects(options, this.defaultOptions as any)
        }
        return normalizeRequestOptions(api, options)
    }
}