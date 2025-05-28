import {t_httpmethod} from '../../aa/atype/a_define_enums'
import {MapObject} from '../../aa/atype/a_define_interfaces'
import {ParamsType, t_api_pattern} from '../../basic/urls/base'
import {t_credentials} from './define_enums'
import AaURL from '../../basic/urls/url'
import {t_millisecond} from '../../aa/atype/a_define'

// https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
export type t_fetchbody = string
//  | ArrayBuffer
    | Blob
    // | DataView
    | File
    | FormData
//| ReadableStream
//  | TypedArray

export type t_requestdata = t_fetchbody | MapObject | null

export interface RequestOptions {
    method?: t_httpmethod
    baseURL?: string
    hash?: string
    headers?: MapObject<string>
    params?: ParamsType
    data?: t_requestdata
    timeout?: number
    credentials?: t_credentials
    debounceInterval?: t_millisecond
}

export interface RequestStruct {
    url: AaURL  // method is in AaURL, url.method
    headers: MapObject<string>  // nullable
    data: t_requestdata
    timeout: number
    credentials: t_credentials
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

