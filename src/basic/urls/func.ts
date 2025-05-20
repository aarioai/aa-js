import {joinPath, parseBaseName, splitPath} from "../strings/path_func";
import {HttpMethods, t_httpmethod} from "../../aa/atype/a_define";
import {AnyMap, MapObject} from '../../aa/atype/a_define_complex'
import {cloneMap, cloneObjectMap} from '../../aa/atype/clone'
import {a_string} from '../../aa/atype/t_basic'
import {PathParamMap, PathParamValue, safePathParamValue, URLPathError, URLPattern} from './base'


/**
 * Fully decodes a URI-encoded string until no further decoding is possible.
 * @example
 *  deepDecodeURI('hello%2520world') // %2520 --> %20 --> ' ', Returns hello world
 */
export function deepDecodeURI(uri: string): string {
    if (!uri) {
        return ''
    }

    let decode = decodeURIComponent(uri)
    while (decode !== uri) {
        decode = uri
        try {
            uri = decodeURIComponent(uri)
        } catch {
            return decode
        }
    }
    return uri
}

/**
 * Optimized URI encoder that first fully decodes then encodes the input.
 *
 * @example
 * deepEncodeURI('/hello%2520world') // returns '%2Fhello%20world'
 */
export function deepEncodeURI(uri: string): string {
    return uri ? encodeURIComponent(deepDecodeURI(uri)) : ''
}

/**
 * Splits a URL string into uppercased method and URL parts
 *
 * @example
 *  splitURLMethod('//luexu.com/m')   // {method:'', url:'//luexu.com/m'}
 *  splitURLMethod('GET  //luexu.com/m')   // {method:'GET', url:'//luexu.com/m'}
 *  splitURLMethod('Put //luexu.com/m')   // {method:'PUT', url:'//luexu.com/m'}
 *  splitURLMethod('ANY //luexu.com/m')   // {method:'', url:'ANY //luexu.com/m'}
 */
export function splitURLMethod(url: string): { method: t_httpmethod | '', url: string } {
    url = url.trim()
    const spaceIndex = url.indexOf(' ')
    if (spaceIndex < 0) {
        return {method: '', url: url}
    }
    const uppercaseMethod = url.slice(0, spaceIndex).toUpperCase() as t_httpmethod
    if (!HttpMethods.includes(uppercaseMethod)) {
        return {method: '', url: url}
    }
    return {
        method: uppercaseMethod,
        url: url.slice(spaceIndex + 1).trim().replaceAll(' ', '%20') // %20 = encodeURIComponent(' ')
    }
}

/**
 * Split a URLs into host and path
 *
 * @example
 *  splitURLHost('https://luexu.com/m')     // {host:'https://luexu.com', path:'/m'}
 *  splitURLHost('//luexu.com/m')           // {host:'//luexu.com', path:'/m'}
 *  splitURLHost('luexu.com/m')             // {host:'', path:'luexu.com/m'}
 *  splitURLHost('/m')                      // {host:'', path:'/m'}
 */
export function splitURLHost(url: string): { host: string, path: string } {
    if (!url) {
        return {host: '', path: ''}
    }
    const index = url.indexOf('//')
    if (index < 0) {
        return {host: '', path: url}
    }
    const scheme = url.slice(0, index)
    let path = url.slice(index + 2)

    const slashIndex = path.indexOf('/')
    if (slashIndex < 0) {
        return {host: url, path: ''}
    }
    let host = scheme + '//' + path.slice(0, slashIndex)
    path = path.slice(slashIndex)
    return {
        host,
        path
    }
}

/**
 * Normalizes a URL string by converting relative paths to absolute URLs
 * based on the current browser location. Handles various URL formats.
 *
 * @example
 * // On https://luexu.com/about/rule/user
 *  normalizeURL('//luexu.com/m')   // https://luexu.com/m
 *  normalizeURL('GET /m')              // https://luexu.com/m
 *  normalizeURL('GET /m')              // GET https://luexu.com/m
 *  normalizeURL('user_privacy')    // https://luexu.com/about/rule/user_privacy
 *  normalizeURL('./user_privacy')    // https://luexu.com/about/rule/user_privacy
 *  normalizeURL('../../us')    // https://luexu.com/about/us
 */
export function normalizeURL(rawURL: string, keepMethod: boolean = false): string {
    rawURL = rawURL ? rawURL.trim() : ''
    if (!rawURL) {
        return location.origin
    }

    let {method, url} = splitURLMethod(rawURL)
    const m = (!method || !keepMethod) ? '' : (method + ' ')
    if (url.startsWith('//')) {
        return m + location.protocol + url
    }
    if (url.startsWith('/')) {
        return m + location.origin + url
    }
    if (url.indexOf('://') > -1) {
        return m + url
    }

    let path = location.href.replace(location.origin, '')
    // move to current directory
    if (path.charAt(path.length - 1) !== '/') {
        const {dirname} = parseBaseName(path)
        path = dirname
    }
    const newPath = joinPath(path, url)
    return m + location.origin + newPath
}

/**
 * Normalizes a URL string with method by converting relative paths to absolute URLs
 * based on the current browser location. Handles various URL formats.
 *
 * @example
 * // On https://luexu.com/about/rule/user
 *  normalizeURLWithMethod('//luexu.com/m')   // {method:'', url:'https://luexu.com/m'}
 *  normalizeURLWithMethod('GET /m')              // {method:'GET', url:'https://luexu.com/m'}
 *  normalizeURLWithMethod('post user_privacy')    //  {method:'POST', url:'https://luexu.com/about/rule/user_privacy'}
 *  normalizeURLWithMethod('Get ./user_privacy')    // {method:'GET', url:'https://luexu.com/about/rule/user_privacy'}
 *  normalizeURLWithMethod('Delete ../../us')    // {method:'DELETE', url:'https://luexu.com/about/us'}
 */
export function normalizeURLWithMethod(url: string): { method: t_httpmethod | '', url: string } {
    url = normalizeURL(url, true)

    if (url.indexOf(' ') <= 0) {
        return {
            method: '', url: url
        }
    }
    const arr = url.split(' ')
    return {
        method: arr[0] as t_httpmethod,
        url: arr[1]
    }
}

/**
 * Safely joins URI segments, handling leading/trailing slashes and encoding components.
 *
 * @example
 * // On https://luexu.com/about/rule/user
 * joinURI('https://luexu.com', 'api', 'v1/users')    // returns 'https://luexu.com/api/v1/users'
 * joinURI('/api/', '/users/', '/1/')                   // returns 'https://luexu.com/api/users/1/'
 * joinURI('/api/v1', '../.', 'v2', 'test')                   // returns 'https://luexu.com/api/v2/test'
 */
export function joinURL(base: string, ...parts: (number | string)[]): string {
    if (!base) {
        return ''
    }
    const {host, path} = splitURLHost(base)
    let newPath = splitPath(path, ...parts).join('/')

    // Preserve trailing slash if last segment had one
    const lastSeg = parts[parts.length - 1];
    if (typeof lastSeg === 'string' && lastSeg.endsWith('/')) {
        newPath += '/'
    }
    if (newPath) {
        newPath = '/' + newPath
    }
    return normalizeURL(host + newPath)
}

// Replaces simple path parameters to its value in a URL, simple means only contains {<key>} format path parameter
function _revertSimpleSearchParamsURL<T extends URLSearchParams = URLSearchParams>(url: string, pathParams: PathParamMap, params: T): {
    url: string,
    search: T,
    cloned: boolean,
    ok: boolean
} {
    if (params.size == 0) {
        return {url: url, search: params, cloned: false, ok: false}
    }
    let search = new URLSearchParams(params.toString())

}

// Replaces simple path parameters to its value in a URL, simple means only contains {<key>} format path parameter
function _revertSimpleMapParamsURL<T extends AnyMap = AnyMap>(url: string, pathParams: PathParamMap, params: T): {
    url: string,
    search: T,
    cloned: boolean,
    ok: boolean
} {
    if (params.size == 0) {
        return {url: url, search: params, cloned: false, ok: false}
    }
    let search = cloneMap(params)

    return
}

// Replaces simple path parameters to its value in a URL, simple means only contains {<key>} format path parameter
function _revertSimpleObjectParamsURL<T extends MapObject = MapObject>(url: string, pathParams: PathParamMap, params: T): {
    url: string,
    search: T,
    cloned: boolean,
    ok: boolean
} {
    if (!Object.keys(params)?.length) {
        return {url: url, search: params, cloned: false, ok: false}
    }
    let search = cloneObjectMap(params)


    return
}

export function searchParam(name: string, params: MapObject | URLSearchParams | AnyMap): unknown {
    if (!name || !params) {
        return undefined
    }
    if (params instanceof URLSearchParams || params instanceof Map) {
        return params.get(name)
    }
    return params.hasOwnProperty(name) ? params[name] : undefined
}


/**
 * Replaces iris-like path parameters to its value in a URL string
 *
 * @example
 *  replaceURLPathParams('/api/{version}/users/{uid:uint64}', {version:'v1', uid:100n})
 *  // Returns '/api/v1/users/100
 */
export function replaceURLPathParams<T extends MapObject | URLSearchParams | AnyMap>(urlPattern: URLPattern, params: T): {
    url: string,
    search: T,
    cloned: boolean,
    ok: boolean
} {
    if (!urlPattern) {
        return {url: '', search: params, cloned: false, ok: false}
    }
    if (!urlPattern.includes('{')) {
        return {url: urlPattern, search: params, cloned: false, ok: true}
    }
    const pathParams: PathParamMap = new Map<string, PathParamValue>()

    // Handle {<key>} format, e.g. {page}
    const simpleRegex = /\/?{([_a-zA-Z]\w*)}/ig
    let match: RegExpExecArray
    while ((match = simpleRegex.exec(urlPattern)) !== null) {
        const [pattern, paramName] = match
        const required = pattern.startsWith('/')
        const pathParam: PathParamValue = {type: ':string', required: required, value: undefined}
        pathParams.set(paramName, pathParam);
    }

    // Handle {<key>:<type>} format , e.g. {uid:uint64}
    const typedRegex = /\/?{([_a-zA-Z]\w*):([a-z][a-z\d]+)}/ig
    while ((match = typedRegex.exec(urlPattern)) !== null) {
        const [pattern, paramName, paramType] = match
        const required = pattern.startsWith('/')
        const replaceTo = required ? `/{${paramName}}` : `{${paramName}}`
        urlPattern = urlPattern.replace(pattern, replaceTo)     // format to {<key>}
        const pathParam: PathParamValue = {type: paramType as any, required: required, value: undefined}
        pathParams.set(paramName, pathParam)
    }

    if (pathParams.size === 0) {
        if (!urlPattern) {
            return {url: urlPattern, search: params, cloned: false, ok: true}
        }
    }

    // Sets path param values and checks all required path parameters are all exists in  the specific parameters
    for (const [name, param] of pathParams) {
        const value = safePathParamValue(searchParam(name, params), param.type)
        if (param.required) {
            if (!a_string(value)) {
                throw new URLPathError(`missing required path parameter ${name}`)
            }
        }
        pathParams[name].value = value
    }


    if (params instanceof URLSearchParams) {
        return _revertSimpleSearchParamsURL(urlPattern, pathParams, params)
    }
    if (params instanceof Map) {
        return _revertSimpleMapParamsURL(urlPattern, pathParams, params)
    }

    return _revertSimpleObjectParamsURL(urlPattern, pathParams, params) as {
        url: string,
        search: T,
        cloned: boolean,
        ok: boolean
    }
}