import type {t_url_pattern} from '../../../aa/atype/a_define'
import {BaseRequestOptions, BasicRequestStruct, HeaderSetting, RequestOptions, RequestStruct} from './define_interfaces'
import AaURL from '../../../basic/urls/url'
import type {BaseOptions, FetchBaseOptions} from './define_fetch'
import {normalizeHeaders} from './fn_fetch'
import type {t_httpmethod} from '../../../aa/atype/enums/http_method'
import type {ResponseBody} from '../../../aa/atype/a_server_dto'
import {AError} from '../../../aa/aerror/error'
import json from '../../../aa/atype/json'
import {E_MissingResponseBody, E_ParseResponseBodyFailed} from './errors'
import type {Dict} from '../../../aa/atype/a_define_interfaces.ts'
import defaults from './defaults.ts'


// Determines the base URL for API requests based on priority: options > defaults > location.origin
export function getBaseURL(opts: BaseRequestOptions): string {
    if (opts?.baseURL) {
        return opts.baseURL
    }

    if (defaults.baseURL) {
        return defaults.baseURL
    }

    return location.origin
}

export function extractFetchOptions(method: t_httpmethod, source: BaseOptions, defaultHeader?: HeaderSetting): FetchBaseOptions {
    const result: Dict = {
        method: method,
        headers: normalizeHeaders(method, source.headers, defaultHeader),
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

export function normalizeBasicRequestOptions(apiPattern: t_url_pattern, opts: BaseRequestOptions, defaultHeader?: HeaderSetting): BasicRequestStruct {
    const url = new AaURL(apiPattern, {
        method: opts?.method,
        baseURL: getBaseURL(opts),
        params: opts?.params,
    })
    const options = extractFetchOptions(url.method || 'GET', opts, defaultHeader)

    return {
        ...options,
        url: url,
        timeout: opts?.timeout ?? 0,
        debounceInterval: opts?.debounceInterval || 0,
    }
}

export function normalizeRequestOptions(apiPattern: t_url_pattern, opts: RequestOptions, defaultHeader?: HeaderSetting): RequestStruct {
    const url = new AaURL(apiPattern, {
        method: opts?.method,
        baseURL: getBaseURL(opts),
        params: opts?.params,
    })
    const options = extractFetchOptions(url.method || 'GET', opts, defaultHeader)

    return {
        ...options,
        url: url,
        timeout: opts?.timeout || 0,
        debounceInterval: opts.debounceInterval || 0,
        disableAuth: opts?.disableAuth ?? false,
        disableAuthRefresh: opts?.disableAuthRefresh ?? false,
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