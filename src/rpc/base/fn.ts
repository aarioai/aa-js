import {t_api_pattern} from '../../basic/urls/base'
import {RequestOptions, RequestStruct} from './define_interfaces'
import AaURL from '../../basic/urls/url'
import defaults from './defaults'
import {BaseOptions, FetchBaseOptions} from './define_fetch'
import {normalizeHeaders} from './fn_fetch'
import {t_httpmethod} from '../../aa/atype/a_define_enums'
import {ResponseBody} from '../../aa/atype/a_server_dto'
import {AError} from '../../aa/aerror/error'
import json from '../../aa/atype/json'
import {E_MissingResponseBody, E_ParseResponseBodyFailed} from './errors'


// Determines the base URL for API requests based on priority: options > defaults > location.origin
export function getBaseURL(opts: RequestOptions): string {
    if (opts?.baseURL) {
        return opts.baseURL
    }
    if (defaults.http.baseURL) {
        return defaults.http.baseURL
    }
    return location.origin
}

export function extractFetchOptions(method: t_httpmethod, source: BaseOptions): FetchBaseOptions {
    const result = {
        method: method,
        headers: normalizeHeaders(method, source.headers),
    }
    for (const [key, value] of Object.entries(source)) {
        // Handled headers
        if (key === 'headers') {
            continue
        }
        if (value !== null && value !== undefined && value !== '') {
            result[key] = value
        }
    }
    return result
}

export function normalizeRequestOptions(apiPattern: t_api_pattern, opts: RequestOptions): RequestStruct {
    const url = new AaURL(apiPattern, {
        method: opts?.method ?? 'GET',
        baseURL: getBaseURL(opts),
        params: opts?.params,
    })
    const options = extractFetchOptions(url.method, opts)

    return {
        ...options,
        url: url,
        timeout: opts?.timeout ?? 0,
        debounceInterval: opts?.debounceInterval ?? defaults.http.debounceInterval,
        disableAuth: opts?.disableAuth ?? false,
        disableAuthRefresh: opts.disableAuthRefresh ?? false,
    }
}

export function parseResponseAError(resp: undefined | string | ResponseBody): AError {
    if (!resp) {
        return E_MissingResponseBody
    }
    if (typeof resp === "string") {
        const s = resp.trim()
        try {
            resp = json.Unmarshal(s) as ResponseBody
        } catch {
            return E_ParseResponseBodyFailed.widthDetail(s)
        }
    }
    return new AError(resp['code'], resp['msg'])
}