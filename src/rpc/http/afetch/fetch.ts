import {HttpImpl, RequestHooks, RequestImpl, RequestOptions, RequestStruct} from '../base/define_interfaces'
import AaAuth from '../auth/auth'
import {t_api_pattern} from '../../../basic/urls/base'
import {ResponseBodyData} from '../../../aa/atype/a_server_dto'
import {normalizeRequestOptions} from '../base/fn'
import {fillObjects} from '../../../basic/maps/groups'
import {MapObject} from '../../../aa/atype/a_define_interfaces'
import {aerror} from '../../../aa/aerror/fn'
import {E_OK} from '../../../aa/aerror/errors'
import {t_httpmethod} from '../../../aa/atype/a_define_enums'

export default class AaFetch implements HttpImpl {
    readonly auth: AaAuth
    readonly baseRequest: RequestImpl
    defaultOptions: RequestOptions | null

    constructor(auth: AaAuth, defaultOptions: RequestOptions | null = null) {
        this.auth = auth
        this.baseRequest = auth.request
        this.defaultOptions = defaultOptions
    }

    handleRedirect(path: string) {
        location.href = path
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

    Request<T = ResponseBodyData>(api: t_api_pattern, options?: RequestOptions): Promise<T> {
        return this.request<T>(this.normalizeOptions(api, options))
    }

    head(r: RequestStruct, hooks?: RequestHooks): Promise<null> {
        if (r.method !== 'HEAD') {
            r.method = 'HEAD'
        }
        return this.request(r, hooks)
    }

    Head(api: t_api_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<null> {
        return this.head(this.normalizeOptions(api, options, 'HEAD'), hooks)
    }

    get<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T> {
        if (r.method !== 'GET') {
            r.method = 'GET'
        }
        return this.request<T>(r, hooks)
    }

    Get<T = ResponseBodyData>(api: t_api_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T> {
        return this.get<T>(this.normalizeOptions(api, options, 'GET'), hooks)
    }

    delete<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T> {
        if (r.method !== 'DELETE') {
            r.method = 'DELETE'
        }
        return this.request<T>(r, hooks)
    }

    Delete<T = ResponseBodyData>(api: t_api_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T> {
        return this.delete<T>(this.normalizeOptions(api, options, 'GET'), hooks)
    }

    post<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T> {
        if (r.method !== 'POST') {
            r.method = 'POST'
        }
        return this.request<T>(r, hooks)
    }

    Post<T = ResponseBodyData>(api: t_api_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T> {
        return this.post<T>(this.normalizeOptions(api, options, 'POST'), hooks)
    }

    put<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T> {
        if (r.method !== 'PUT') {
            r.method = 'PUT'
        }
        return this.request<T>(r, hooks)
    }

    Put<T = ResponseBodyData>(api: t_api_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T> {
        return this.put<T>(this.normalizeOptions(api, options, 'POST'), hooks)
    }

    patch<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T> {
        if (r.method !== 'PATCH') {
            r.method = 'PATCH'
        }
        return this.request<T>(r, hooks)
    }

    Patch<T = ResponseBodyData>(api: t_api_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T> {
        return this.patch<T>(this.normalizeOptions(api, options, 'PATCH'), hooks)
    }

    private normalizeOptions(api: t_api_pattern, options?: RequestOptions, method?: t_httpmethod): RequestStruct {
        if (this.defaultOptions) {
            options = fillObjects(options, this.defaultOptions as MapObject)
        }
        if (method && options.method !== method) {
            options.method = method
        }
        return normalizeRequestOptions(api, options)
    }
}