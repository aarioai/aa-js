import {buildURL, normalizeSearchParams, normalizeURLWithMethod, revertURLPathParams} from "./fn";
import {
    t_booln,
    t_char,
    t_float64,
    t_int16,
    t_int24,
    t_int32,
    t_int64b,
    t_int8,
    t_millisecond,
    t_safeint,
    t_second,
    t_uint16,
    t_uint24,
    t_uint32,
    t_uint64b,
    t_uint8,
    t_url_pattern
} from "../../aa/atype/a_define";
import {
    a_bool,
    a_booln,
    a_char,
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
import {t_params, t_searchparam, URLOptions} from './base'
import SearchParams from './search_params'
import {t_httpmethod} from '../../aa/atype/enums/http_method'
import {ASCEND, SortFunc} from '../../aa/atype/a_define_funcs'
import {MapCallbackFn} from '../maps/base'
import {a_weekday, t_weekday} from '../../aa/atype/enums/weekday'
import {t_path_param} from '../../aa/atype/enums/path_param'


export default class AaURL {
    name = 'aa-url'
    method: t_httpmethod   // can be null
    #tidy: boolean = true  // remove empty string value parameter, e.g. a=&b=10

    private readonly searchParams: SearchParams   // as URL interface
    private sortFunc: SortFunc = ASCEND

    // https://developer.mozilla.org/en-US/docs/Web/API/URL/host
    #protocol: string   // e.g. https:, or blob:https:
    #hostname: string   // e.g. test.luexu.com
    #port: t_uint16       // e.g. 8080
    #hashPattern: t_url_pattern = ''  // #<hash>, e.g. #head, #{hash}
    #pathnamePattern: t_url_pattern   // e.g. /a/chat/x
    #password: string = ''
    #username: string = ''

    #href: string

    /**
     * Creates an AaURL instance
     *
     * iris path parameter routing URL,   path parameters with format {<key>:<type>} or {<key>}
     *          e.g. /api/v1/users/{uid:uint64}/logs/page/{page}?param=value       // <url>
     *          e.g. GET https://luexu.com/api/v1/users/{uid:uint64}   // <http_method> <url>
     *
     * method priority: url pattern > options
     */
    constructor(urlPattern: t_url_pattern, options?: URLOptions) {
        const {method, url} = normalizeURLWithMethod(urlPattern, options?.baseURL)
        const u = new URL(url)
        this.method = method ? method : (options?.method ? options.method : null)
        this.#protocol = u.protocol
        this.#hostname = u.hostname
        this.#port = u.port ? uint16(u.port) : 0
        this.#pathnamePattern = u.pathname
        this.#username = u.username
        this.#password = u.password
        this.hash = typeof options?.hash === 'string' ? options.hash : u.hash  // options.hash can be ''
        this.searchParams = normalizeSearchParams(new SearchParams(u.searchParams), options?.params)
    }

    get tidy(): boolean {
        return this.#tidy
    }

    set tidy(tidy: boolean) {
        this.#href = ''
        this.#tidy = tidy
    }

    get hash(): string {
        return this.#hashPattern
    }

    set hash(hash: string) {
        if (typeof hash !== 'string') {
            return
        }
        this.#href = ''
        if (!hash) {
            this.#hashPattern = ''
            return
        }
        this.#hashPattern = hash.startsWith('#') ? hash : `#${hash}`
    }

    get host(): string {
        if (!this.port) {
            return this.#hostname
        }
        return this.#hostname + ':' + this.#port
    }

    /**
     * Sets hostname or host (host name with point)
     *
     * @note If the given value for the host setter lacks a port, the URL's port will not change.
     * This can be unexpected as the host getter does return a URL-port string, so one might have assumed the setter to always "reset" both.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/URL/host
     */
    set host(value: string) {
        if (!value) {
            return   // act as URL interface
        }
        const [hostname, port] = value.toLowerCase().trim().split(':')
        if (!hostname) {
            return // act as URL interface
        }
        this.#href = ''
        this.#hostname = hostname
        if (!port || !/^\d+$/.test(port)) {
            return  // act as URL interface
        }
        const p = Number(port)
        if (!p) {
            return
        }
        this.port = p
    }

    get hostname(): string {
        return this.#hostname
    }

    set hostname(vale: string) {
        if (!vale) {
            return  // act as URL interface
        }
        this.#href = ''
        this.#hostname = vale
    }

    get href(): string {
        if (!this.#href) {
            this.#href = this.toString()
        }
        return this.#href
    }

    get origin(): string {
        return this.#protocol + '//' + this.#hostname + this.#port
    }

    get pathname(): string {
        return this.#pathnamePattern
    }

    set pathname(value: string) {
        this.#href = ''
        if (!value || value === '/') {
            this.#pathnamePattern = '/'
            return
        }
        value = value.replace(/\/+/g, '/').replace(/[?#].*$/g, '')  // trim search and hash
        this.#pathnamePattern = value.startsWith('/') ? value : `/${value}`
    }

    get port(): string {
        return this.#port ? String(this.#port) : ''
    }

    set port(value: string | number) {
        this.#href = ''
        if (!value) {
            this.#port = 0
            return
        }
        let port: number = 0
        if (typeof value === 'number') {
            port = value
        } else {
            port = uint16(value.startsWith(':') ? value.slice(1) : value)
        }
        if (!port) {
            return // act as URL interface
        }
        this.tidyPort(this.#protocol, port)
    }

    get protocol(): string {
        return this.#protocol
    }

    set protocol(value: string) {
        if (!value) {
            return
        }
        this.#href = ''
        this.#protocol = value.toLowerCase().replace(/\/+$/g, '')
        this.tidyPort(this.#protocol, this.#port)
    }

    get search(): string {
        return this.searchParams.toString()
    }

    set search(value: string) {
        this.resetParams(value)
    }

    get username(): string {
        return this.#username
    }

    set username(value: string) {
        this.#href = ''
        this.#username = value
    }

    get password(): string {
        return this.#password
    }

    set password(value: string) {
        this.#href = ''
        this.#password = value
    }

    userinfo(): string {
        if (!this.#username && !this.#password) {
            return ''
        }
        const username = this.#username ? this.#username : 'root'
        return `${username}:${this.#password}`
    }

    tidyPort(protocol: string, port: t_uint16) {
        switch (port) {
            case 80:
                // blob:http://http://luexu.com
                if (protocol === 'http' || protocol.endsWith(':http')) {
                    this.#port = 0
                    return // act as URL interface
                }
                break
            case 443:
                // blob:https://http://luexu.com
                if (protocol === 'https' || protocol.endsWith(':https')) {
                    this.#port = 0
                    return // act as URL interface
                }
                break
        }
        this.#port = port
    }

    clearReference() {
        this.#href = ''
        this.searchParams.references.clear()
    }

    hasReference(name: string): boolean {
        return this.searchParams.references.has(name)
    }

    setReference(name: string, value: [string, t_path_param]) {
        this.#href = ''
        this.searchParams.references.set(name, value)
    }

    deleteReference(name: string) {
        this.#href = ''
        this.searchParams.references.delete(name)
    }

    getReference(name: string): [string, t_path_param] {
        return this.searchParams.references.get(name)
    }

    forEachReference(callback: MapCallbackFn<[string, t_path_param]>, thisArg?: any) {
        this.#href = ''
        this.searchParams.references.forEach(callback, thisArg)
    }

    sort(sort?: SortFunc): AaURL {
        this.#href = ''
        this.sortFunc = sort ? sort : ASCEND
        return this
    }

    resetParams(params?: t_searchparam): AaURL {
        this.#href = ''
        this.searchParams.reset(params)
        return this
    }

    setParam(key: string, value: unknown): AaURL {
        this.#href = ''
        this.searchParams.set(key, a_string(value))
        return this
    }

    setParams(params?: t_params): AaURL {
        this.#href = ''
        this.searchParams.setMany(params)
        return this
    }

    deleteParam(key: string, value?: unknown): AaURL {
        this.#href = ''
        this.searchParams.delete(key, value)
        return this
    }

    hasParam(key: string, value?: unknown): boolean {
        return this.searchParams.has(key, value)
    }

    query<T = unknown>(key: string, cast?: (value: unknown) => T): T | undefined {
        if (!this.hasParam(key)) {
            return undefined
        }
        const value = this.searchParams[key]
        if (!cast) {
            return value as T
        }
        return cast(value)
    }

    queryByte(key: string): t_char | undefined {
        const value = this.query(key, a_char)
        return value != '\0' ? value : undefined
    }

    queryString(key: string): string {
        return this.query(key, a_string)
    }

    queryInt64b(key: string): t_int64b | undefined {
        return this.query(key, int64b)
    }

    querySafeInt(key: string): t_safeint | undefined {
        return this.query(key, safeInt)
    }

    queryInt32(key: string): t_int32 | undefined {
        return this.query(key, int32)
    }

    queryInt24(key: string): t_int24 | undefined {
        return this.query(key, int24)
    }

    queryInt16(key: string): t_int16 | undefined {
        return this.query(key, int16)
    }

    queryInt8(key: string): t_int8 | undefined {
        return this.query(key, int8)
    }

    queryUint64b(key: string): t_uint64b | undefined {
        return this.query(key, uint64b)
    }

    queryUint32(key: string): t_uint32 | undefined {
        return this.query(key, uint32)
    }

    queryUint24(key: string): t_uint24 | undefined {
        return this.query(key, uint24)
    }

    queryUint16(key: string): t_uint16 | undefined {
        return this.query(key, uint16)
    }

    queryUint8(key: string): t_uint8 | undefined {
        return this.query(key, uint8)
    }

    queryFloat64(key: string): t_float64 | undefined {
        return this.query(key, float64)
    }

    queryFloat32(key: string): t_float64 | undefined {
        return this.query(key, float32)
    }

    queryBool(key: string): boolean | undefined {
        return this.query(key, a_bool)
    }

    queryBooln(key: string): t_booln | undefined {
        return this.query(key, a_booln)
    }

    queryMillisecond(key: string): t_millisecond | undefined {
        return this.query(key, safeInt)
    }

    querySecond(key: string): t_second | undefined {
        return this.query(key, safeInt)
    }

    queryWeekday(key: string): t_weekday {
        return this.query(key, a_weekday)
    }

    toJSON() {
        return this.href
    }

    toString() {
        const path = this.#pathnamePattern + this.#hashPattern
        const {base, hash, search} = revertURLPathParams(path, this.searchParams)
        let baseURL = this.host + base
        const userinfo = this.userinfo()
        if (userinfo) {
            baseURL = this.#protocol + '//' + userinfo + '@' + baseURL
        } else {
            baseURL = this.#protocol + '//' + baseURL
        }
        search.sortFunc = this.sortFunc
        search.tidy = this.tidy
        return buildURL(baseURL, hash, search)
    }
}