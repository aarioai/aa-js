import {CookieOptions, StorageImpl} from './define_types'
import {MapObject, StringMap} from '../../aa/atype/a_define_interfaces'
import {MapCallbackFn} from '../maps/base'
import {BREAK} from '../../aa/atype/a_define_enums'
import {a_string} from '../../aa/atype/t_basic'
import {unsafeExtractDomain} from '../urls/fn'
import {Millisecond} from '../../aa/atype/a_define_units'
import {matchAny, normalizeArrayArguments} from '../arrays/fn'

export default class AaCookie implements StorageImpl {
    readonly name: 'AaCookie'
    private cachedCookie: string = ''  // no need share
    private cached: StringMap = new Map()

    get length(): number {
        return this.getAll().size
    }

    /**
     * Note that this code has two limitations:
     *
     * It will not delete cookies with HttpOnly flag set, as the HttpOnly flag disables JavaScript's access to the cookie.
     * It will not delete cookies that have been set with a Path value. (This is despite the fact that those cookies will appear in document.cookie, but you can't delete it without specifying the same Path value with which it was set.)
     */
    clear(options?: CookieOptions): void {
        this.forEach((_, key) => {
            this.removeItem(key, options)
        })
    }

    forEach(callbackfn: MapCallbackFn<string>, thisArg?: unknown) {
        const all = this.getAll()
        for (const [key, value] of all) {
            const result = thisArg ? callbackfn.call(thisArg, value, key, all) : callbackfn(value, key, all)
            if (result === BREAK) {
                break
            }
        }
    }

    getItem(key: string): string | null {
        return this.getAll().get(key)
    }

    getItems(key: (RegExp | string)[] | RegExp | string, ...keys: (RegExp | string)[]): MapObject<string> | null {
        const fields = normalizeArrayArguments(key, ...keys)
        let result: MapObject<string> = {}
        let has = false
        this.forEach((_, key) => {
            if (matchAny(key, fields)) {
                const value = this.getItem(key)
                if (value !== null && value !== undefined) {
                    result[key] = value
                    has = true
                }
            }
        })
        return has ? result : null
    }

    getAll(): StringMap {
        return this.syncCache()
    }

    key(index: number): string | null {
        const keys = Array.from(this.getAll().keys())
        return keys[index] ?? null
    }

    removeItem(key: string, options?: CookieOptions): void {
        this.setItem(key, '', {
            ...options,
            expires: options?.expires ?? new Date(0), // 1970-01-01
        })
    }

    removeItems(keys: (RegExp | string)[] | RegExp | string, options?: CookieOptions): void {
        if (!Array.isArray(keys)) {
            keys = [keys]
        }
        this.forEach((_, key) => {
            if (matchAny(key, keys)) {
                this.removeItem(key, options)
            }
        })
    }

    normalizeOptions(options?: CookieOptions | undefined): CookieOptions {
        let expires = null
        if (options?.expires) {
            if (typeof options.expires === 'string') {
                expires = options.expires
            } else {
                let expiresDate: Date = null
                if (typeof options.expires === 'number') {
                    expiresDate = new Date()
                    expiresDate.setTime(expiresDate.getTime() + options.expires * Millisecond)
                } else if (options.expires instanceof Date) {
                    expiresDate = options.expires
                }
                if (expiresDate) {
                    expires = expiresDate.toUTCString()
                }
            }
        }
        return {
            domain: options?.domain ?? unsafeExtractDomain(location.hostname),
            expires: expires,
            unclearable: options?.unclearable ?? false,
            path: options?.path ?? '/',
            secure: options?.secure ?? location.protocol === 'https',
            sameSite: options?.sameSite ?? 'Lax',
        }
    }

    stringifyOptions(options: CookieOptions): string {
        if (!options) {
            return ''
        }
        let s = ''
        if (options.domain) {
            s += `; domain='${options.domain}'`
        }
        if (options.expires) {
            s += `; expires=${options.expires}`
        }
        if (options.path) {
            s += `; path='${options.path}'`
        }
        if (options.unclearable) {
            s += `; persistent`
        }
        if (options.sameSite) {
            s += `; sameSite='${options.sameSite}'`
        }
        if (options.secure) {
            s += `; secure`
        }
        return s
    }

    setItem(key: string, value: unknown, options?: CookieOptions): void {
        let cookie = `${encodeURIComponent(key)}=${encodeURIComponent(a_string(value))}`
        cookie += this.stringifyOptions(this.normalizeOptions(options))
        document.cookie = cookie
    }

    private syncCache(): StringMap {
        const cookieString = document.cookie
        if (cookieString === this.cachedCookie) {
            return this.cached
        }

        this.cached.clear()
        const cookies = cookieString.split('; ')  //  format: k=v; k=v; k=v; k=xxx=xxx; k; k;
        // Process cookies in reverse to maintain first-seen priority
        for (let i = cookies.length - 1; i >= 0; i--) {
            const cookie = cookies[i]
            const [key, ...valueParts] = cookie.split('=')      // Handle cases like  k=xxx=xxx;
            if (!key || !valueParts?.length) {
                continue
            }
            const decodedKey = decodeURIComponent(key)

            // First occurrence takes precedence (due to reverse iteration)
            if (!this.cached.has(decodedKey)) {
                const value = decodeURIComponent(valueParts.join('='))
                this.cached.set(decodedKey, value)
            }
        }
        this.cachedCookie = cookieString
        return this.cached
    }


}