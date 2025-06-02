import {t_httpmethod} from '../../../aa/atype/a_define_enums'
import {Dict} from '../../../aa/atype/a_define_interfaces'
import {TypedArray} from '../../../aa/atype/a_define'


// https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
export type t_fetchbody = string
    | ArrayBuffer   // file to array buffer
    | Blob
    | DataView  // array buffer with self-defined protocol header
    | File
    | FormData
    | ReadableStream  // big file stream
    | TypedArray  // file segment, e.g., new Uint8Array(file.arrayBuffer(),0,1024)   1KB file buffer

export interface BaseOptions {
    attributionReporting?: boolean
    data?: Dict            // self-defined
    body?: t_fetchbody
    browsingTopics?: boolean
    cache?: RequestCache
    credentials?: RequestCredentials // `omit` no send cookie; `same-origin` only send cookie with same-origin; `include` send cookie
    headers?: Headers | Dict
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