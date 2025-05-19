import {joinPath, parseBaseName, splitPath} from "../strings/path_func";
import {http_method, HttpMethods} from "../aa/atype/atype_server";
import {Maps} from '../aa/atype/types'
import {forEachCopy} from '../maps/func'

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
export function splitURLMethod(url: string): { method: http_method | '', url: string } {
    url = url.trim()
    const spaceIndex = url.indexOf(' ')
    if (spaceIndex < 0) {
        return {method: '', url: url}
    }
    const uppercaseMethod = url.slice(0, spaceIndex).toUpperCase() as http_method
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
export function normalizeURLWithMethod(url: string): { method: http_method | '', url: string } {
    url = normalizeURL(url, true)

    if (url.indexOf(' ') <= 0) {
        return {
            method: '', url: url
        }
    }
    const arr = url.split(' ')
    return {
        method: arr[0] as http_method,
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


function replaceURLSearchParams(url: string, params: URLSearchParams): {
    url: string,
    search: URLSearchParams,
    handled: boolean
} {
    if (params.size == 0) {
        return {url: url, search: params, handled: false}
    }
    // @warn do not use let search = new URLSearchParams(params.toString()) to clone params.
    // Because
    let search = forEachCopy(params, new URLSearchParams())

}

/**
 * Replaces iris-like path parameters to its value in a URL string
 *
 * @example
 *  replaceURLPathParams('/api/{version}/users/{uid:uint64}', {version:'v1', uid:100n})
 *  // Returns '/api/v1/users/100
 */
export function replaceURLPathParams<T = Maps | URLSearchParams>(url: string, params: T): {
    url: string,
    search: T,
    handled: boolean
} {
    if (!url) {
        return {url: '', search: params, handled: false}
    }
    if (!url.includes('{')) {
        return {url: url, search: params, handled: false}
    }
}