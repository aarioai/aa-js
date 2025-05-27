import {t_api_pattern} from '../../basic/urls/base'
import {RequestOptions, RequestStruct} from './define_interfaces'
import AaURL from '../../basic/urls/url'
import {fillObjects} from '../../basic/maps/groups'
import defaults from './defaults'


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

    return {
        url: url,
        headers: headers,
        data: opts?.data ?? null,
        timeout: opts?.timeout ?? 0,
        credentials: opts?.credentials ?? null,
        debounceInterval: opts?.debounceInterval ?? defaults.debounceInterval
    }
}