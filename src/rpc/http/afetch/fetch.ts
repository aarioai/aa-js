import type {HttpImpl, RequestHooks, RequestImpl, RequestOptions, RequestStruct} from '../base/define_interfaces'
import AaAuth from '../auth/auth'
import type {ResponseBodyData} from '../../../aa/atype/a_server_dto'
import {normalizeBasicRequestOptions, normalizeRequestOptions} from '../base/fn'
import {fillDict, union} from '../../../basic/maps/groups'
import type {Dict} from '../../../aa/atype/a_define_interfaces'
import {aerror} from '../../../aa/aerror/fn'
import {E_OK, E_Unauthorized} from '../../../aa/aerror/errors'
import type {t_httpmethod} from '../../../aa/atype/enums/http_method'
import type {t_millisecond, t_url_pattern} from '../../../aa/atype/a_define'
import {Millisecond} from '../../../aa/atype/a_define_units.ts'

export default class AaFetch implements HttpImpl {
    readonly auth: AaAuth
    readonly baseRequest: RequestImpl
    defaultOptions: RequestOptions | null

    baseURL: string = ''
    debounceInterval: t_millisecond = 400 * Millisecond

    constructor(auth: AaAuth, defaultOptions: RequestOptions | null = null) {
        this.auth = auth
        this.baseRequest = auth.request
        this.defaultOptions = defaultOptions
    }

    handleRedirect(path: string): unknown {
        location.href = path
        return
    }

    fetch(r: RequestStruct, hooks?: RequestHooks): Promise<string> {
        return this.baseRequest.Fetch(r.url.href, normalizeBasicRequestOptions(r.url.href, r), hooks)
    }

    Fetch(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<string> {
        return this.normalizeOptions(api, options).then(r => this.fetch(r, hooks)
        )
    }

    request<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T> {
        return this.baseRequest.request<T>(r, hooks).catch(err => {
            err = aerror(err)
            if (err.isFailedAndSeeOther()) {
                this.handleRedirect(err.message)  // special redirect
                throw E_OK
            }
            if (err.isUnauthorized()) {
                if (this.auth.handleUnauthorized()) {
                    throw E_OK
                }
            }
            throw err
        })
    }

    Request<T = ResponseBodyData>(api: t_url_pattern, options?: RequestOptions): Promise<T> {
        return this.normalizeOptions(api, options).then(r => this.request<T>(r))
    }

    head(r: RequestStruct, hooks?: RequestHooks): Promise<void> {
        r.method = 'HEAD'
        return this.baseRequest.head(r, hooks)
    }

    Head(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<void> {
        return this.normalizeOptions(api, options, 'HEAD').then(r => this.head(r, hooks))
    }

    get<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T> {
        r.method = 'GET'
        return this.request<T>(r, hooks) as Promise<T>
    }

    Get<T = ResponseBodyData>(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T> {
        return this.normalizeOptions(api, options, 'GET').then(r => this.get<T>(r, hooks))
    }

    delete<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T> {
        r.method = 'DELETE'
        return this.request<T>(r, hooks) as Promise<T>
    }

    Delete<T = ResponseBodyData>(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T> {
        return this.normalizeOptions(api, options, 'GET').then(r => this.delete<T>(r, hooks))
    }

    post<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T> {
        r.method = 'POST'
        return this.request<T>(r, hooks) as Promise<T>
    }

    Post<T = ResponseBodyData>(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T> {
        return this.normalizeOptions(api, options, 'POST').then(r => this.post<T>(r, hooks))
    }

    put<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T> {
        r.method = 'PUT'
        return this.request<T>(r, hooks) as Promise<T>
    }

    Put<T = ResponseBodyData>(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T> {
        return this.normalizeOptions(api, options, 'PUT').then(r => this.put<T>(r, hooks))
    }

    patch<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T> {
        r.method = 'PATCH'
        return this.request<T>(r, hooks) as Promise<T>
    }

    Patch<T = ResponseBodyData>(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T> {
        return this.normalizeOptions(api, options, 'PATCH').then(r => this.patch<T>(r, hooks))
    }

    private async normalizeOptions(api: t_url_pattern, options?: RequestOptions, method?: t_httpmethod): Promise<RequestStruct> {
        options = options ?? {}
        if (this.baseURL) {
            options.baseURL = this.baseURL
        }
        options.debounceInterval = this.debounceInterval
        if (this.defaultOptions) {
            options = fillDict(options, this.defaultOptions as Dict)
        }
        if (method && options.method !== method) {
            options.method = method
        }

        // Handle auth
        if (!options.disableAuth) {
            const [auth, err] = await this.auth.getAuthorizationOptions()
            if (!err) {
                options = union(options as Dict, auth as Dict)
            } else if (options.mustAuth) {
                throw E_Unauthorized
            }
        }
        return normalizeRequestOptions(api, options)
    }
}