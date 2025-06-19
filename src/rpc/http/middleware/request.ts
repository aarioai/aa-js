import type {BaseRequestHooks, BaseRequestOptions, BasicRequestStruct, RequestImpl} from '../base/define_interfaces'
import type {t_url_pattern} from '../../../aa/atype/a_define'
import {normalizeBasicRequestOptions} from '../base/fn'
import {fillDict} from '../../../basic/maps/groups'
import AaMiddleware from './middleware'
import {reject} from '../../../basic/promises/fn'
import type {FetchOptions} from '../base/define_fetch'
import {normalizeFetchOptions} from '../base/fn_fetch'
import {AError} from '../../../aa/aerror/error'
import json from '../../../aa/atype/json'
import type {ResponseBody, ResponseBodyData} from '../../../aa/atype/a_server_dto'
import {isOK} from '../../../aa/aerror/fn'
import {E_ParseResponseBodyFailed} from '../base/errors'
import type {Dict} from '../../../aa/atype/a_define_interfaces'
import type {t_httpmethod} from '../../../aa/atype/enums/http_method'

export class AaRequest implements RequestImpl {
    defaultOptions?: BaseRequestOptions
    readonly middleware: AaMiddleware


    constructor(defaults?: BaseRequestOptions, middleware: AaMiddleware = new AaMiddleware()) {
        this.defaultOptions = defaults
        this.middleware = middleware
    }


    fetch<T = ResponseBodyData>(url: string, options: FetchOptions): Promise<T | null> {
        return window.fetch(url, options).then(resp => {
            let err = new AError(resp.status)
            if (!err.isOK()) {
                throw err
            }
            // Handle HEAD
            if (!options.method || options.method === 'HEAD') {
                return null
            }
            let bodyText = ''
            try {
                return resp.text().then(text => {
                    bodyText = text
                    const result = json.Unmarshal(text) as ResponseBody
                    if (isOK(result.code)) {
                        return result.data as T
                    }
                    throw new AError(result.code, result.msg)
                })
            } catch (err) {
                throw err instanceof AError ? err : E_ParseResponseBodyFailed.widthDetail(bodyText)
            }
        })
    }

    request<T = ResponseBodyData>(r: BasicRequestStruct, hooks?: BaseRequestHooks): Promise<T | null> {
        if (hooks?.beforeFetch) {
            r = hooks.beforeFetch(r)
        }
        const denied = this.middleware.denied(r)
        if (denied) {
            return reject(denied.widthDetail(`${r.url.method} ${r.url.href} is denied`))
        }
        if (hooks?.onFetch) {
            return hooks.onFetch(r).then((r: BasicRequestStruct) => {
                return this.fetch(r.url.href, normalizeFetchOptions(r))
            })
        }
        return this.fetch(r.url.href, normalizeFetchOptions(r))
    }

    Request<T = ResponseBodyData>(api: t_url_pattern, options?: BaseRequestOptions, hooks?: BaseRequestHooks): Promise<T | null> {
        return this.request(this.normalizeOptions(api, options), hooks)
    }


    private normalizeOptions(api: t_url_pattern, options?: BaseRequestOptions, method?: t_httpmethod): BasicRequestStruct {
        if (this.defaultOptions) {
            options = fillDict(options, this.defaultOptions as Dict)
        }
        if (method && options!.method !== method) {
            options!.method = method
        }
        return normalizeBasicRequestOptions(api, options!)
    }
}