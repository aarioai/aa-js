import {ParamsType} from '../../basic/urls/search_params'
import {t_httpmethod} from '../../aa/atype/a_define_enums'
import {MapObject} from '../../aa/atype/a_define_interfaces'
import {ApiPattern} from '../../basic/urls/base'

export interface RequestOptions {
    method?: t_httpmethod
    baseURL?: string
    headers?: MapObject<string>
    params?: ParamsType
    data?: MapObject
    body?: string
    timeout?: number
    withCredentials?: boolean
}


export interface RequestInterface {
    Request(api: ApiPattern, options?: RequestOptions): Promise<unknown>
}

export interface AdapterInterface {
    Request(api: ApiPattern, options?: RequestOptions): Promise<unknown>

    Head(api: ApiPattern, options?: RequestOptions): Promise<unknown>

    Get(api: ApiPattern, options?: RequestOptions): Promise<unknown>

    Delete(api: ApiPattern, options?: RequestOptions): Promise<unknown>

    Post(api: ApiPattern, options?: RequestOptions): Promise<unknown>

    Put(api: ApiPattern, options?: RequestOptions): Promise<unknown>

    Patch(api: ApiPattern, options?: RequestOptions): Promise<unknown>
}

