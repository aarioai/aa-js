import type {BaseOptions, FetchBaseOptions, FetchOptions} from './define_fetch'
import AaURL from '../../../basic/urls/url'
import type {ResponseBodyData} from '../../../aa/atype/a_server_dto'
import type {t_millisecond, t_url_pattern} from '../../../aa/atype/a_define'
import type {t_params} from '../../../basic/urls/base.ts'
import {Dict} from '../../../aa/atype/a_define_interfaces.ts'
import type {t_httpmethod} from '../../../aa/atype/enums/http_method.ts'
import AaAuth from '../auth/auth.ts'

export interface BaseRequestOptions extends BaseOptions {
    baseURL?: string
    hash?: string
    params?: t_params
    timeout?: number
    debounceInterval?: t_millisecond
}

export interface BasicRequestStruct extends FetchBaseOptions {
    url: AaURL  // method is in AaURL, url.method
    timeout: number
    debounceInterval: t_millisecond
    interceptError: boolean
}

export type HeaderSetting = {
    [key in t_httpmethod]: Dict<string>
} & {
    common: Dict<string>
}

export interface RequestOptions extends BaseRequestOptions {
    mustAuth?: boolean  // panic on missing Authorization header
    disableAuth?: boolean  // disable attach Authorization header
    disableAuthRefresh?: boolean // disable refresh user token via refresh token
}

export interface RequestStruct extends BasicRequestStruct {
    disableAuth: boolean  // disable attach Authorization header
    disableAuthRefresh: boolean // disable refresh user token via refresh token
}

export interface BaseRequestHooks {
    beforeFetch: (r: BasicRequestStruct) => BasicRequestStruct,
    onFetch: (r: BasicRequestStruct) => Promise<BasicRequestStruct>
}

export interface RequestHooks extends BaseRequestHooks {

}

export interface RequestImpl {
    head(r: BasicRequestStruct, hooks?: BaseRequestHooks): Promise<void>

    Head(api: t_url_pattern, options?: FetchOptions, hooks?: BaseRequestHooks): Promise<void>

    fetchString(url: string, options?: FetchOptions): Promise<string>

    fetch<T = ResponseBodyData>(url: string, options?: FetchOptions): Promise<T>

    Fetch(api: t_url_pattern, options?: BaseRequestOptions, hooks?: BaseRequestHooks): Promise<string>

    request<T = ResponseBodyData>(r: BasicRequestStruct, hooks?: BaseRequestHooks): Promise<T>

    Request<T = ResponseBodyData>(api: t_url_pattern, options?: BaseRequestOptions, hooks?: BaseRequestHooks): Promise<T>
}

export interface HttpImpl {
    readonly auth: AaAuth
    readonly baseRequest: RequestImpl
    baseURL: string
    debounceInterval: t_millisecond

    handleRedirect(path: string): unknown

    fetch(r: RequestStruct, hooks?: RequestHooks): Promise<string>

    Fetch(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<string>

    request<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T | null>

    Request<T = ResponseBodyData>(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T | null>

    head(r: RequestStruct, hooks?: RequestHooks): Promise<void>

    Head(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<void>

    get<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T>

    Get<T = ResponseBodyData>(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T>

    delete<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T>

    Delete<T = ResponseBodyData>(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T>

    post<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T>

    Post<T = ResponseBodyData>(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T>

    put<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T>

    Put<T = ResponseBodyData>(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T>

    patch<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T>

    Patch<T = ResponseBodyData>(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T>
}


