import {joinPath, parseBaseName, splitPath} from "../strings/path_func";
import {HttpMethods, t_httpmethod} from "../../aa/atype/a_define";
import {a_string} from '../../aa/atype/t_basic'
import {HashAliasName, ParamPattern, PathParamMap, safePathParamValue, URLBase, URLPathError} from './base'
import {PathParamsMatchesRegex, PathParamString, PathParamTestRegexp} from '../../aa/atype/const_server'
import {t_path_param} from '../../aa/atype/a_define_server'
import {MapObject} from '../../aa/atype/a_define_complex'
import {ParamsType, SearchParams} from './search_params'


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


export function searchParam(params: ParamsType, name: string): unknown {
    if (!name || !params) {
        return undefined
    }
    if (params instanceof URLSearchParams || params instanceof Map || params instanceof SearchParams) {
        return params.get(name)
    }
    return params.hasOwnProperty(name) ? params[name] : undefined
}


export function spreadSearchParams(target: SearchParams, source: ParamsType) {

    // merge SearchParams alias
    if (source instanceof SearchParams) {
        target.references.spread(source.references)
    }
    const set: string[] = []
    // Handle parameter alias, e.g. winner={max_score}&best={winner:string}
    for (const [key, value] of target.entries()) {
        if (!value || value.length < 3) {
            continue   // pattern requires at least 3 chars (e.g. {x})
        }
        const match = value.match(PathParamTestRegexp)
        if (!match) {
            continue
        }
        const [, , name, paramType,] = match
        set.push(key)
        target.set(key, safePathParamValue(searchParam(source, name), paramType))
        if (key !== name) {
            target.references.set(key, name, paramType)
        }
    }
    if (!(source instanceof SearchParams)) {
        source = new SearchParams(source)
    }
    for (const [key, value] of source.entries()) {
        if (set.includes(key)) {
            continue
        }
        if (target.references.has(key)) {
            const name = target.references.get(key)
            target.set(key, a_string(name))
        } else {
            target.set(key, a_string(value))
        }
    }
}


/**
 * Parse a URL search pattern string to check its validation, and returns its object type
 *
 * @example
 *  parseURLSearch('')  // {valid:true, search:{}}
 *  parseURLSearch('a=') // {valid:true, search:{}}
 *  parseURLSearch('a=100&b=20') // {valid:true, search:{a:'100', b:'20'}}
 *  parseURLSearch('a=100&&b=20') // {valid:true, search:{a:'100', b:'20'}}
 *  parseURLSearch('a') // {valid:false, search:{}}
 *  parseURLSearch('a=100&b') // {valid:false, search:{}}
 *  parseURLSearch('a={a}') // {valid: true, search: {a: '{a}'}
 *  parseURLSearch('a={a:uint}') // {valid: true, search: {a: '{a:uint}'}}
 *  parseURLSearch('a={a:uint}&&&key={key_value}') // {valid: true, search: {a: '{a:uint}', key:'{key_value}'}}
 */
export function parseURLSearch(s: string): {
    valid: boolean,
    search: MapObject<string>
} {
    if (!s) {
        return {valid: true, search: {}}
    }
    let search: MapObject<string> = {}
    const pairs = s.split('&')
    for (let pair of pairs) {
        pair = pair.trim()
        if (!pair) {
            continue // Empty pair (like "a=1&&b=2")
        }
        const segs = pair.split('=')
        if (segs.length != 2) {
            return {valid: false, search: {}}
        }

        const [keyName, value] = segs
        if (!/^[_a-zA-Z]\w*$/.test(keyName)) {
            return {valid: false, search: {}}
        }
        search[keyName] = value
    }
    return {valid: true, search: search}
}

/**
 * Splits a URL string or a URL pattern string into a new URL string without search parameters and its parameters as an object
 *
 * @example
 *  splitURLSearch('https://luexu.com/m?name={name}&age=30')  // {base:'https://luexu.com/m', hash:'', search:{name:'{name}', age:'30'}}
 *  splitURLSearch('/api/v1/users/{user:uint64}/favorites/page/{page}#hash0#{hash1:string}?name=Aario#hash2#{hash2}&age=30?age=18&sex=male#{hash3}#{hash3:string}')
 *  // Returns  {base:'/api/v1/users/{user:uint64}/favorites/page/{page}', hash: '#{hash2}',search:{name:'Aario', age:'18', sex:'male'}}
 */
export function splitURLSearch(urlPattern: string): URLBase {
    if (!urlPattern) {
        return {base: '', hash: '', search: new SearchParams()}
    }
    let hash = ''
    let search = new SearchParams()

    const parts = urlPattern.split('?')
    if (parts.length > 1) {
        urlPattern = parts[0]
        for (let i = parts.length - 1; i > 0; i--) {
            let part = parts[i]
            if (!part) {
                continue
            }
            const hashParts = part.split('#')
            if (hashParts.length > 1) {
                part = hashParts[0]   // trim end hashes
                const lastHashPart = hashParts[hashParts.length - 1] // last hash
                if (hash === '' && lastHashPart) {
                    hash = '#' + lastHashPart
                }
            }
            const ps = parseURLSearch(part)
            if (!ps.valid) {
                urlPattern += '?' + parts.slice(1, i + 1).join('?')
                break
            }
            for (const [key, value] of Object.entries(ps.search)) {
                if (!(search.has(key))) {
                    search.set(key, value)
                }
            }
        }
    }


    const hashParts = urlPattern.split('#')
    if (hashParts.length > 1) {
        urlPattern = hashParts[0]
        const lastHashPart = hashParts[hashParts.length - 1] // last hash
        if (hash === '' && lastHashPart) {
            hash = '#' + lastHashPart
        }
    }

    return {base: urlPattern, hash, search}
}

/**
 * Reverts iris-like path parameters to its value in a URL string
 *
 * @example
 *  revertURLPathParams('/api/{version}/users/{uid:uint64}?name=Aario&from={from}#top', {version:'v1', uid:100n, age:10})
 *  // Returns {base:"/api/v1/users/100", hash:"top", search:{name:"Aario", age:"10", from:""}}
 *
 * @example
 * // Params in path are required
 * revertURLPathParams('/api/{version}/users/{uid:uint64}', {version:'v1', age:10})
 *  // Throws new URLPathError
 *
 * @example
 * revertURLPathParams('/api/{version}/users/{uid:uint64}#{hash}', {version:'v1', uid:100n, age:10, hash:'home'})
 * // Returns {base:"/api/v1/users/100", hash:'#home' search:{age:"10"}}
 *
 * @example
 * // Params in hash or query string are optional
 * revertURLPathParams('/api/{version}/users/{uid:uint64}#{hash}?work={work}', {version:'v1', uid:100n, age:10,})
 * // Returns {base:"/api/v1/users/100", hash:'', search:{age:"10", work=""}}
 */
export function revertURLPathParams(urlPattern: ParamPattern, params: ParamsType): URLBase {
    if (!urlPattern) {
        throw new URLPathError(`url is empty`)
    }
    let {base, hash, search} = splitURLSearch(urlPattern)
    spreadSearchParams(search, params)
    let hashAlias = ''
    // Handle hash parameter {<key>} or {<key><type>}
    if (hash) {
        const match = hash.slice(1).match(PathParamTestRegexp)
        if (match) {
            const [, , name, paramType,] = match
            hash = safePathParamValue(search.get(name), paramType)
            if (hash) {
                hash = '#' + hash
            }
            search.references.set(HashAliasName, name, paramType)
            hashAlias = name
        }
    }

    // Handle no parameter
    const pathParams: PathParamMap = new Map<string, t_path_param>()

    // Handle base parameter {<key>} or {<key><type>}
    const matches = base.matchAll(PathParamsMatchesRegex)
    for (const match of matches) {
        const [pattern, , name, paramType,] = match
        let type = paramType ? paramType : PathParamString
        const simple = '{' + name + '}'
        if (pattern !== simple) {
            base = base.replace(pattern, simple)     // format to {<key>}
        }
        pathParams.set(name, type)
    }

    // Set path param values and checks all required path parameters are all exists in  the specific parameters
    for (const [name, type] of pathParams) {
        const value = safePathParamValue(search.get(name), type)

        if (!value) {
            throw new URLPathError(`missing required path parameter ${name}`)
        }

        base = base.replaceAll(`{${name}}`, value)
        search.delete(name)
    }

    if (hashAlias) {
        search.delete(hashAlias)
    }

    return {base, hash, search}
}


/**
 * Builds a URL string with result from revertURLPathParams
 */
export function buildURL(base: string, hash: string, search: SearchParams): string {
    if (!hash) {
        const searchHash = search.getHash()
        if (searchHash) {
            hash = searchHash
        }
    }
    const searchString = search.toString()
    let url = base
    if (searchString) {
        url += '?' + searchString
    }
    return url + hash
}