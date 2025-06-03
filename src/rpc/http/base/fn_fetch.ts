// https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
import json from '../../../aa/atype/json'
import {t_httpmethod} from '../../../aa/atype/enums/http_method'
import {Dict} from '../../../aa/atype/a_define_interfaces'
import {fillDict} from '../../../basic/maps/groups'
import defaults from './defaults'
import {FetchBaseOptions, FetchOptions, t_fetchbody} from './define_fetch'

export function normalizeHeaders(method: t_httpmethod, headers?: Headers | Dict): Headers {
    const defaultHeaders = fillDict<string>({}, defaults.headers[method], defaults.headers.common)
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

export function normalizeFetchOptions(source: FetchBaseOptions, method?: t_httpmethod): FetchOptions {
    if (method && source.method !== method) {
        source.method = method
    }
    const result: FetchOptions = {}
    const body: t_fetchbody | null = source.body ?? (source.data ? json.Marshal(source.data) : null)
    if (body) {
        result.body = body
    }
    for (const [key, value] of Object.entries(source)) {
        if (key === 'body' || key === 'data') {
            continue
        }
        if (value !== null && value !== undefined && value !== '') {
            result[key] = value
        }
    }
    return result
}