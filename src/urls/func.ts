import {joinPath} from "../strings/path_func";
import {http_method, HttpMethods} from "../aa/atype/atype_server";
import {Maps} from "../aa/atype/types";

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
 * encodeURI('hello%2520world') // returns 'hello%20world'
 */
export function encodeURI(uri: string): string {
    return uri ? encodeURIComponent(deepDecodeURI(uri)) : ''
}

/**
 * Normalizes a URL string by converting relative paths to absolute URLs
 * based on the current browser location. Handles various URL formats.
 *
 * @example
 * // On https://luexu.com/about/rule/user
 *  normalizeURL('//luexu.com/m')   // https://luexu.com/m
 *  normalizeURL('/m')              // https://luexu.com/m
 *  normalizeURL('user_privacy')    // https://luexu.com/about/rule/user_privacy
 *  normalizeURL('./user_privacy')    // https://luexu.com/about/rule/user_privacy
 *  normalizeURL('../../us')    // https://luexu.com/about/us
 */
export function normalizeURL(url: string): string {
    url = url ? url.trim() : ''
    if (!url) {
        return location.origin
    }
    if (url.startsWith('//')) {
        return location.protocol + url
    }
    if (url.startsWith('/')) {
        return location.origin + url
    }

    if (url.indexOf('://') > -1) {
        return url
    }

    let path = location.href.replace(location.origin, '')
    if (path.charAt(path.length - 1) !== '/') {
        let parts = path.split('/')
        let dirname = parts.join('/')
        dirname = joinPath(dirname, url)
        return location.origin + dirname
    }
    return location.origin + '/' + url
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
    url = url ? url.trim() : ''
    if (!url) {
        return {method: '', url: ''}
    }
    let method: http_method | '' = ''
    const parts = url.split(' ')
    if (parts.length > 1) {
        const m = parts[0].toUpperCase()
        if (HttpMethods.includes(m)) {
            method = m as http_method
            url = parts.slice(1).join('%20')  // %20 is encodeURIComponent(' ')
        }
    }
    return {
        method,
        url
    }
}

/**
 * Safely joins URI segments, handling leading/trailing slashes and encoding components.
 *
 * @example
 * joinURI('https://luexu.com', 'api', 'v1/users')    // returns 'https://luexu.com/api/v1/users'
 * joinURI('/api/', '/users/', '/1/')                   // returns '/api/users/1/'
 */
export function joinURI(base: string, ...segs: any[]): string {
    base = normalizeURL(base)
    if (!base) {
        return ''
    }
    if (!segs?.length) {
        return base
    }
    const encodedSegs = segs
        .map(seg => String(seg).trim())
        .filter(seg => seg.length > 0)
        .map(encodeURI)
    let result = base.replace(/\/+$/, '')
    for (const seg of encodedSegs) {
        if (seg) {
            result += '/' + seg
        }
    }

    // Preserve trailing slash if last segment had one
    const lastSeg = segs[segs.length - 1];
    if (typeof lastSeg === 'string' && lastSeg.endsWith('/')) {
        result += '/';
    }
    return result
}


export function replaceURLPathParams(url: string, params: Maps | URLSearchParams): string {

}