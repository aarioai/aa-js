import {t_httpmethod} from '../../aa/atype/a_define_enums'
import {MapObject} from '../../aa/atype/a_define_interfaces'
import {t_requestdata} from './define_interfaces'


// https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
export type t_fetchbody = string
//  | ArrayBuffer
    | Blob
    // | DataView
    | File
    | FormData
//| ReadableStream
//  | TypedArray

export interface BaseOptions {
    attributionReporting?: boolean
    body?: t_requestdata
    browsingTopics?: boolean
    cache?: RequestCache
    credentials?: RequestCredentials // `omit` no send cookie; `same-origin` only send cookie with same-origin; `include` send cookie
    headers?: Headers | MapObject
    integrity?: string
    keepalive?: boolean
    method?: t_httpmethod
    mode?: RequestMode
    priority?: RequestPriority
    redirect?: RequestRedirect
    referer?: string
    referrerPolicy?: ReferrerPolicy
    signal?: AbortSignal
}

export interface FetchBaseOptions extends BaseOptions {
    headers?: Headers
}

// https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
export interface FetchOptions extends FetchBaseOptions {
    body?: t_fetchbody
}