import {BaseRequestHooks, BaseRequestOptions, BasicRequestStruct, RequestImpl} from '../base/define_interfaces'
import {t_url_pattern} from '../../../basic/urls/base'
import {normalizeBasicRequestOptions} from '../base/fn'
import {fillObjects} from '../../../basic/maps/groups'
import AaMiddleware from './middleware'
import {reject} from '../../../basic/promises/fn'
import {FetchOptions} from '../base/define_fetch'
import {normalizeFetchOptions} from '../base/fn_fetch'
import {AError} from '../../../aa/aerror/error'
import json from '../../../aa/atype/json'
import {ResponseBody, ResponseBodyData} from '../../../aa/atype/a_server_dto'
import {isOK} from '../../../aa/aerror/fn'
import {E_ParseResponseBodyFailed} from '../base/errors'
import {Dict} from '../../../aa/atype/a_define_interfaces'
import {t_httpmethod} from '../../../aa/atype/a_define_enums'

export class AaRequest implements RequestImpl {
    defaultOptions?: BaseRequestOptions
    readonly middleware: AaMiddleware


    constructor(defaults?: BaseRequestOptions, middleware: AaMiddleware = new AaMiddleware()) {
        this.defaultOptions = defaults
        this.middleware = middleware
    }


    fetch<T = ResponseBodyData>(url: string, options: FetchOptions): Promise<T> {
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

    request<T = ResponseBodyData>(r: BasicRequestStruct, hooks?: BaseRequestHooks): Promise<T> {
        if (hooks?.beforeFetch) {
            r = hooks.beforeFetch(r)
        }
        const [denied, err] = this.middleware.denied(r)
        if (denied) {
            return reject(err.widthDetail(`${r.url.method} ${r.url.href} is denied`))
        }
        if (hooks?.onFetch) {
            return hooks.onFetch(r).then((r: BasicRequestStruct) => {
                return this.fetch(r.url.href, normalizeFetchOptions(r))
            })
        }
        return this.fetch(r.url.href, normalizeFetchOptions(r))
    }

    Request<T = ResponseBodyData>(api: t_url_pattern, options?: BaseRequestOptions, hooks?: BaseRequestHooks): Promise<T> {
        return this.request(this.normalizeOptions(api, options), hooks)
    }


    private normalizeOptions(api: t_url_pattern, options?: BaseRequestOptions, method?: t_httpmethod): BasicRequestStruct {
        if (this.defaultOptions) {
            options = fillObjects(options, this.defaultOptions as Dict)
        }
        if (method && options.method !== method) {
            options.method = method
        }
        return normalizeBasicRequestOptions(api, options)
    }
}