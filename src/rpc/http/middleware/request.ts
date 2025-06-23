import {
    BaseRequestHooks,
    BaseRequestOptions,
    BasicRequestStruct,
    HeaderSetting,
    RequestImpl
} from '../base/define_interfaces'
import type {t_url_pattern} from '../../../aa/atype/a_define'
import {normalizeBasicRequestOptions} from '../base/fn'
import {fillDict} from '../../../basic/maps/groups'
import AaMiddleware from './middleware'
import {reject} from '../../../basic/promises/fn'
import type {FetchOptions} from '../base/define_fetch'
import {normalizeFetchOptions} from '../base/fn_fetch'
import {AError} from '../../../aa/aerror/error'
import type {ResponseBody, ResponseBodyData} from '../../../aa/atype/a_server_dto'
import type {Dict} from '../../../aa/atype/a_define_interfaces'
import type {t_httpmethod} from '../../../aa/atype/enums/http_method'
import json from '../../../aa/atype/json.ts'
import {E_ParseResponseBodyFailed} from '../base/errors.ts'
import {aerror, isOK} from '../../../aa/aerror/fn.ts'
import defaults from '../base/defaults.ts'

export class AaRequest implements RequestImpl {
    defaults: BaseRequestOptions
    readonly middleware: AaMiddleware
    requestErrorHook?: (e: AError) => AError
    defaultHeader?: HeaderSetting

    constructor(defaults?: BaseRequestOptions, middleware: AaMiddleware = new AaMiddleware()) {
        this.defaults = defaults || {}
        this.middleware = middleware
    }

    head(r: BasicRequestStruct, hooks?: BaseRequestHooks): Promise<void> {
        if (hooks?.beforeFetch) {
            r = hooks.beforeFetch(r)
        }
        const denied = this.middleware.denied(r)
        if (denied) {
            return reject(denied.widthDetail(`${r.url.method} ${r.url.href} is denied`))
        }
        if (hooks?.onFetch) {
            return hooks.onFetch(r).then((r: BasicRequestStruct) => {
                return this.fetchRaw(r.url.href, normalizeFetchOptions(r), true) as Promise<void>
            })
        }
        return this.fetchRaw(r.url.href, normalizeFetchOptions(r), true) as Promise<void>
    }

    Head(api: t_url_pattern, options?: FetchOptions, hooks?: BaseRequestHooks): Promise<void> {
        if (!options) {
            options = {}
        }
        options.method = 'HEAD'

        let r = this.normalizeOptions(api, options)
        return this.head(r, hooks)
    }

    fetchString(url: string, options?: FetchOptions): Promise<string> {
        return this.fetchRaw(url, options) as Promise<string>
    }

    fetch<T = ResponseBodyData>(url: string, options?: FetchOptions): Promise<T> {
        return this.fetchString(url, options).then(body => {
            if (options?.method === 'HEAD') {
                return null as T
            }
            let result: ResponseBody
            try {
                result = json.Unmarshal(body) as ResponseBody
            } catch (err) {
                throw E_ParseResponseBodyFailed.widthDetail(body)
            }
            if (!isOK(result.code)) {
                throw new AError(result.code, result.msg)
            }
            return result.data as T
        }).catch(e => {
            e = aerror(e)
            const handler = this.requestErrorHook || defaults.requestErrorHook
            throw (handler ? handler(e) : e)
        })
    }

    Fetch(api: t_url_pattern, options?: BaseRequestOptions, hooks?: BaseRequestHooks): Promise<string> {
        let r = this.normalizeOptions(api, options)
        if (hooks?.beforeFetch) {
            r = hooks.beforeFetch(r)
        }
        const denied = this.middleware.denied(r)
        if (denied) {
            return reject(denied.widthDetail(`${r.url.method} ${r.url.href} is denied`))
        }
        if (hooks?.onFetch) {
            return hooks.onFetch(r).then((r: BasicRequestStruct) => {
                return this.fetchString(r.url.href, normalizeFetchOptions(r))
            })
        }
        return this.fetchString(r.url.href, normalizeFetchOptions(r))
    }

    request<T = ResponseBodyData>(r: BasicRequestStruct, hooks?: BaseRequestHooks): Promise<T> {
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

    Request<T = ResponseBodyData>(api: t_url_pattern, options?: BaseRequestOptions, hooks?: BaseRequestHooks): Promise<T> {
        return this.request(this.normalizeOptions(api, options), hooks)
    }

    private fetchRaw(url: string, options?: FetchOptions, returnVoid?: boolean): Promise<string | void> {
        return window.fetch(url, options).then(resp => {
            if (!isOK(resp.status)) {
                throw new AError(resp.status)
            }
            if (returnVoid) {
                return
            }
            return resp.text()
        }).catch((err: Error) => {
            const e = aerror(err)
            const handler = this.requestErrorHook || defaults.requestErrorHook
            throw (handler ? handler(e) : e)
        })
    }

    private normalizeOptions(api: t_url_pattern, options?: BaseRequestOptions, method?: t_httpmethod): BasicRequestStruct {
        options = fillDict(options, this.defaults as Dict)
        if (method && options!.method !== method) {
            options!.method = method
        }
        return normalizeBasicRequestOptions(api, options!, this.defaultHeader)
    }
}