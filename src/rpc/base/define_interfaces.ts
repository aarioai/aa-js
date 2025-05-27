import {t_httpmethod} from '../../aa/atype/a_define_enums'
import {MapObject} from '../../aa/atype/a_define_interfaces'
import {ParamsType, t_api_pattern} from '../../basic/urls/base'
import {t_credentials} from './define_enums'
import AaURL from '../../basic/urls/url'
import {t_millisecond} from '../../aa/atype/a_define'

export interface RequestOptions {
    method?: t_httpmethod
    baseURL?: string
    hash?: string
    headers?: MapObject<string>
    params?: ParamsType
    data?: MapObject | File | FormData | string | null
    timeout?: number
    credentials?: t_credentials
    debounceInterval?: t_millisecond
}

export interface RequestStruct {
    url: AaURL  // method is in AaURL, url.method
    headers: MapObject<string>  // nullable
    data: MapObject | File | FormData | string | null
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

