import SearchParams, {ParamsType} from '../../basic/urls/search_params'
import {t_httpmethod} from '../../aa/atype/a_define_enums'
import {MapObject} from '../../aa/atype/a_define_interfaces'
import {t_api_pattern} from '../../basic/urls/base'
import {t_credentials} from './define_enums'

export interface RequestOptions {
    method?: t_httpmethod
    baseURL?: string
    headers?: MapObject<string>
    params?: ParamsType
    data?: MapObject | FormData
    body?: string
    timeout?: number
    credentials?: t_credentials
}

export interface NormalizedRequestOptions {
    method: t_httpmethod
    url: string
    headers: MapObject<string> | null
    params: SearchParams | null
    data: MapObject | FormData | null
    body: string
    timeout: number
    credentials: t_credentials
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

