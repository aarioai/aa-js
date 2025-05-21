import {MapObject} from "../../aa/atype/a_define_complex";
import {normalizeSearchParams, normalizeURLWithMethod} from "./func";
import {
    t_booln,
    t_byte,
    t_float64,
    t_int16,
    t_int24,
    t_int32,
    t_int64b,
    t_int8,
    t_millisecond,
    t_second,
    t_uint16,
    t_uint24,
    t_uint32,
    t_uint64b,
    t_uint8
} from "../../aa/atype/a_define_server";
import {
    a_bool,
    a_booln,
    a_byte,
    a_string,
    float32,
    float64,
    int16,
    int24,
    int32,
    int64b,
    int8,
    safeInt,
    uint16,
    uint24,
    uint32,
    uint64b,
    uint8
} from "../../aa/atype/t_basic";
import {sortObjectMap} from '../maps/func'
import {t_httpmethod, t_safeint} from '../../aa/atype/a_define'
import {ParamsType, SearchParamsType} from './base'


class AaURL {
    name = 'aa-url'
    method: t_httpmethod | ''
    searchParams: SearchParamsType = {}  // use Maps to enable set object values, URLSearchParams only supports string values
    pathParams: Map<string, string> = new Map()
    autoSort: boolean = false
    sortCompareFunc?: (a: string, b: string) => number

    hash: string = ''  // #<hash>, e.g. #head
    hostname: string   // e.g. test.luexu.com
    pathname: string   // e.g. /a/chat/x
    port: string       // e.g. :8080
    protocol: string   // e.g. https:
    username: string = ''
    password: string = ''

    /**
     * Creates an AaURL instance
     *
     * @param routingURL iris path parameter routing URL,   path parameters with format {<key>:<type>} or {<key>}
     *          e.g. /api/v1/users/{uid:uint64}/logs/page/{page}?param=value       // <url>
     *          e.g. GET https://luexu.com/api/v1/users/{uid:uint64}   // <http_method> <url>
     * @param params
     * @param hash
     */
    constructor(routingURL: string, params?: MapObject | URLSearchParams, hash?: string) {
        const {method, url} = normalizeURLWithMethod(routingURL)
        let escapedURL = this.convertPathPatterns(url)
        const u = new URL(escapedURL)
        this.method = method
        this.hash = this.revertPathPatterns(hash ? hash : u.hash)
        this.hostname = this.revertPathPatterns(u.hostname)
        this.pathname = this.revertPathPatterns(u.pathname)
        this.port = this.revertPathPatterns(u.port)
        this.protocol = this.revertPathPatterns(u.protocol)
        this.username = this.revertPathPatterns(u.username)
        this.password = this.revertPathPatterns(u.password)
        this.setParams(u.searchParams)
        this.setParams(params)
    }

    get url(): string {
        if (this.autoSort) {
            this.sortParams()
        }
        return ``
    }

    // Reverts url path %00!key!%00 to {key}
    revertPathPatterns(s: string): string {
        if (!s) {
            return ''
        }
        return s.replaceAll('%00!', '{').replaceAll('!%00', '}')
    }

    // Converts url path {key}, {key:type} to %00!key!%00 to avoid new URL() escape
    convertPathPatterns(url: string): string {
        // Handle path parameters with format  {<key>}, e.g. {page}
        const matches = url.matchAll(/{([\w-]+)}/ig)
        for (const match of matches) {
            const pattern = match[0]
            const paramName = match[1]
            url = url.replace(pattern, `%00!${paramName}!%00`)
            this.pathParams.set(paramName, '')
        }

        // Handle path parameters with format {<key>:<type>} , e.g. {uid:uint64}
        const withTypeMatches = url.matchAll(/{([\w-]+):([\w-]+)}/ig)
        for (const match of withTypeMatches) {
            const pattern = match[0]
            const paramName = match[1]
            const paramType = match[2]
            url = url.replace(pattern, `%00!${paramName}!%00`)
            this.pathParams.set(paramName, paramType)
        }

        return url
    }

    withSortCompareFunc(compareFn: (a: string, b: string) => number): AaURL {
        this.sortCompareFunc = compareFn
        return this
    }

    setParam(key: string, value: unknown): AaURL {
        this.searchParams[key] = a_string(value)
        return this
    }

    setParams(params?: ParamsType): AaURL {
        if (!params) {
            return this
        }
        const searchParams = normalizeSearchParams(params)
        for (const [key, value] of Object.entries(searchParams)) {
            this.setParam(key, value)
        }
        return this
    }

    deleteParam(key: string): AaURL {
        delete this.searchParams[key]
        return this
    }

    hasParam(key: string): boolean {
        return this.searchParams.hasOwnProperty(key) && this[key] !== undefined
    }

    sortParams(): AaURL {
        sortObjectMap(this.searchParams, this.sortCompareFunc)
        return this
    }

    clearParams(): AaURL {
        this.searchParams = {}
        return this
    }

    search<T = unknown>(key: string, cast?: (value: unknown) => T): T | undefined {
        if (!this.hasParam(key)) {
            return undefined
        }
        const value = this.searchParams[key]
        if (!cast) {
            return value as T
        }
        return cast(value)
    }

    searchByte(key: string): t_byte | undefined {
        const value = this.search(key, a_byte)
        return value != '\0' ? value : undefined
    }


    searchString(key: string): string {
        return this.search(key, a_string)
    }

    searchInt64b(key: string): t_int64b | undefined {
        return this.search(key, int64b)
    }

    searchSafeInt(key: string): t_safeint | undefined {
        return this.search(key, safeInt)
    }

    searchInt32(key: string): t_int32 | undefined {
        return this.search(key, int32)
    }

    searchInt24(key: string): t_int24 | undefined {
        return this.search(key, int24)
    }

    searchInt16(key: string): t_int16 | undefined {
        return this.search(key, int16)
    }

    searchInt8(key: string): t_int8 | undefined {
        return this.search(key, int8)
    }

    searchUint64b(key: string): t_uint64b | undefined {
        return this.search(key, uint64b)
    }

    searchUint32(key: string): t_uint32 | undefined {
        return this.search(key, uint32)
    }

    searchUint24(key: string): t_uint24 | undefined {
        return this.search(key, uint24)
    }

    searchUint16(key: string): t_uint16 | undefined {
        return this.search(key, uint16)
    }

    searchUint8(key: string): t_uint8 | undefined {
        return this.search(key, uint8)
    }

    searchFloat64(key: string): t_float64 | undefined {
        return this.search(key, float64)
    }

    searchFloat32(key: string): t_float64 | undefined {
        return this.search(key, float32)
    }

    searchBool(key: string): boolean | undefined {
        return this.search(key, a_bool)
    }

    searchBooln(key: string): t_booln | undefined {
        return this.search(key, a_booln)
    }

    searchMillisecond(key: string): t_millisecond | undefined {
        return this.search(key, safeInt)
    }

    searchSecond(key: string): t_second | undefined {
        return this.search(key, safeInt)
    }

    toString() {

    }
}