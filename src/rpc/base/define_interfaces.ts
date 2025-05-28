import {MapObject} from '../../aa/atype/a_define_interfaces'
import {t_api_pattern, t_params} from '../../basic/urls/base'
import {BaseOptions, FetchBaseOptions, t_fetchbody} from './define_fetch'
import AaURL from '../../basic/urls/url'
import {t_millisecond} from '../../aa/atype/a_define'
import {AError} from '../../basic/aerror/error'
import {ResponseBodyData} from '../../aa/atype/a_server_dto'


export type t_requestdata = t_fetchbody | MapObject | null

export interface RequestOptions extends BaseOptions {
    baseURL?: string
    hash?: string
    params?: t_params
    timeout?: number
    debounceInterval?: t_millisecond
}

export interface RequestStruct extends FetchBaseOptions {
    url: AaURL  // method is in AaURL, url.method
    timeout: number
    debounceInterval: t_millisecond
}

export interface RequestInterface {
    Request(api: t_api_pattern, options?: RequestOptions): Promise<unknown>
}

export interface AdapterInterface {
    Request(api: t_api_pattern, options?: RequestOptions): Promise<unknown>

    Head(api: t_api_pattern, options?: RequestOptions): Promise<unknown>

    Get(api: t_api_pattern, options?: RequestOptions): Promise<unknown>

    Delete(api: t_api_pattern, options?: RequestOptions): Promise<unknown>

    Post(api: t_api_pattern, options?: RequestOptions): Promise<unknown>

    Put(api: t_api_pattern, options?: RequestOptions): Promise<unknown>

    Patch(api: t_api_pattern, options?: RequestOptions): Promise<unknown>
}

export interface RequestHooks {
    preHook: (r: RequestStruct) => RequestStruct,
    deniedHook: (err: AError, r: RequestStruct) => Promise<ResponseBodyData>
    beforeFetchHook: (r: RequestStruct) => Promise<RequestStruct>
}

