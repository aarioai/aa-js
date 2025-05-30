// https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
import {t_requestdata} from './define_interfaces'
import json from '../../aa/atype/json'
import {t_httpmethod} from '../../aa/atype/a_define_enums'
import {MapObject} from '../../aa/atype/a_define_interfaces'
import {fillObjects} from '../../basic/maps/groups'
import defaults from './defaults'
import {FetchBaseOptions, FetchOptions, t_fetchbody} from './define_fetch'

export function normalizeHeaders(method: t_httpmethod, headers?: Headers | MapObject): Headers {
    const defaultHeaders = fillObjects<string>({}, defaults.http.headers[method], defaults.http.headers.common)
    const newHeaders = headers ? new Headers(headers as any) : new Headers()
    for (const [key, value] of Object.entries(defaultHeaders)) {
        if (!newHeaders.has(key)) {
            newHeaders.set(key, value)
        }
    }

    const contentType = newHeaders.get('Content-Type')
    // multipart/form-data needs boundary
    if (contentType === 'multipart/form-data' || contentType === '') {
        newHeaders.delete('Content-Type')
    }
    return newHeaders
}


export function buildFetchBody(data: t_requestdata): t_fetchbody {
    if (!data) {
        return null
    }
    if (typeof data === 'string'
        || data instanceof Blob
        || data instanceof File
        || data instanceof FormData
    ) {
        return data
    }
    return json.Marshal(data)
}

export function normalizeFetchOptions(source: FetchBaseOptions): FetchOptions {
    const result: FetchOptions = {}
    for (const [key, value] of Object.entries(source)) {
        if (value !== null && value !== undefined && value !== '') {
            result[key] = key === 'body' ? buildFetchBody(value) : value
        }
    }
    return result
}