import {t_millisecond, t_params, t_url_pattern} from '../../../aa/atype/a_define'
import {BaseOptions, FetchBaseOptions} from './define_fetch'
import AaURL from '../../../basic/urls/url'
import {ResponseBodyData} from '../../../aa/atype/a_server_dto'

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
    request<T = ResponseBodyData>(r: BasicRequestStruct, hooks?: BaseRequestHooks): Promise<T>

    Request<T = ResponseBodyData>(api: t_url_pattern, options?: BaseRequestOptions, hooks?: BaseRequestHooks): Promise<T>
}

export interface HttpImpl {
    request<T = ResponseBodyData>(r: RequestStruct, hooks?: RequestHooks): Promise<T>

    Request<T = ResponseBodyData>(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<T>

    head(r: RequestStruct, hooks?: RequestHooks): Promise<null>

    Head(api: t_url_pattern, options?: RequestOptions, hooks?: RequestHooks): Promise<null>

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


