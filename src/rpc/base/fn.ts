import {t_api_pattern} from '../../basic/urls/base'
import {RequestOptions, RequestStruct, t_fetchbody, t_requestdata} from './define_interfaces'
import AaURL from '../../basic/urls/url'
import {fillObjects} from '../../basic/maps/groups'
import defaults from './defaults'
import json from '../../aa/atype/json'


// Determines the base URL for API requests based on priority: options > defaults > location.origin
export function getBaseURL(opts: RequestOptions): string {
    if (opts?.baseURL) {
        return opts.baseURL
    }
    if (defaults.baseURL) {
        return defaults.baseURL
    }
    return location.origin
}

export function normalizeRequestOptions(apiPattern: t_api_pattern, opts: RequestOptions): RequestStruct {
    const url = new AaURL(apiPattern, {
        method: opts?.method ?? 'GET',
        baseURL: getBaseURL(opts),
        params: opts?.params,
    })
    const headers = fillObjects<string>(opts?.headers, defaults.headers[url.method], defaults.headers.common)

    const contentType = headers['Content-Type']
    // multipart/form-data needs boundary
    if (contentType === 'multipart/form-data' || contentType === '') {
        delete headers['Content-Type']
    }
    return {
        url: url,
        headers: headers,
        data: opts?.data ?? null,
        timeout: opts?.timeout ?? 0,
        credentials: opts?.credentials ?? null,
        debounceInterval: opts?.debounceInterval ?? defaults.debounceInterval
    }
}

// https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
export function buildFetchBody(data: t_requestdata, contentType: string = 'application/json'): t_fetchbody {
    if (!data) {
        return null
    }
    if (typeof data === 'string'
        || data instanceof Blob
        || data instanceof DataView
        || data instanceof File
        || data instanceof FormData
        || data instanceof ReadableStream
    ) {
        return data
    }
    return json.Marshal(data)
}