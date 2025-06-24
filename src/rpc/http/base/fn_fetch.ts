// https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
import json from '../../../aa/atype/json'
import type {t_httpmethod} from '../../../aa/atype/enums/http_method'
import type {Dict} from '../../../aa/atype/a_define_interfaces'
import {unsafeUnion} from '../../../basic/maps/groups'
import type {FetchBaseOptions, FetchOptions, t_fetchbody} from './define_fetch'
import {HeaderSetting} from './define_interfaces.ts'
import {cloneDict} from '../../../aa/atype/clone.ts'
import {forEach} from '../../../basic/maps/iterates.ts'

export function normalizeHeaders(method: t_httpmethod, headers?: Headers | Dict<string>, defaultHeader?: HeaderSetting): Headers {
    const h = defaultHeader?.[method as keyof typeof defaultHeader] || {}
    let defaultHeaders = cloneDict(defaultHeader?.common || {})
    defaultHeaders = unsafeUnion(defaultHeaders, h)
    const newHeaders = new Headers(defaultHeaders)

    if (headers) {
        forEach(headers, (value, key) => {
            newHeaders.set(key, value)
        })
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
            result[key as keyof typeof result] = value
        }
    }
    return result
}