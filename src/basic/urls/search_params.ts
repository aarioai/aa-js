import {deepEncodeURI, parseURLSearch} from './func'
import {AnyMap, Callback, MapObject} from '../../aa/atype/a_define_interfaces'
import {a_bool, a_string} from '../../aa/atype/t_basic'
import {FALSE, TRUE} from '../../aa/atype/a_server_consts'
import {HashAliasName, safePathParamValue} from './base'
import SearchReference from './search_reference'
import {P_Stringify} from '../../aa/aconfig/const_param'
import {ASCEND, SortFunc} from '../../aa/atype/a_define_funcs'
import {t_bool} from '../../aa/atype/a_define'
import {BREAK} from '../../aa/atype/a_define_enums'

export type SearchParamsAcceptType = string | URLSearchParams | MapObject | AnyMap
export type ParamsType = SearchParamsAcceptType | SearchParams


export function NewChangeReferrerError(referer: string, reference: string): Error {
    return new Error(`Parameter '${referer}' references to '${reference}'. Modify the source parameter instead.`)
}


/**
 * Pros for Web API URLSearchParams
 *  1. JSON.stringify(new URLSearchParams('a=100'))  returns '{}', but not {"a":"100"}
 *  2. Jest URLSearchParams does not have `size` property
 */
export default class SearchParams {
    params: MapObject<string> = {}   // Disable arrays, e.g.  a[]=100&a[]=200 is not allowed
    references: SearchReference = new SearchReference()
    sortFunc: SortFunc = ASCEND
    tidy: boolean = true
    encode: (s: string) => string = deepEncodeURI

    constructor(searchString?: SearchParamsAcceptType) {
        this.params[P_Stringify] = String(TRUE)
        if (searchString) {
            this.setMany(searchString)
        }
    }

    get size(): number {
        return this.keys().length
    }

    get xStringify(): boolean {
        return a_bool(this.get(P_Stringify))
    }

    set xStringify(value: t_bool) {
        const v = a_bool(value)
        if (v) {
            this.set(P_Stringify, String(TRUE))
        } else {
            this.delete(P_Stringify)
        }
    }

    delete(name: string, value?: unknown) {
        if (this.has(name, value)) {
            delete this.params[name]
            return
        }
    }

    entries(): [string, string][] {
        return Object.entries(this.params)
    }

    forEach(callback: Callback<string, string>, thisArg?: unknown) {
        if (thisArg) {
            callback = callback.bind(thisArg)
        }
        for (const [key, value] of this.entries()) {
            if (callback(value, key) === BREAK) {
                break
            }
        }
    }

    get(name: string): string | null {
        if (!name || !this.params.hasOwnProperty(name)) {
            return null // as URLSearchParams interface
        }
        return this.params[name]
    }

    getHashName(): string | null {
        if (this.references && this.references.has(HashAliasName)) {
            return this.references.get(HashAliasName)[0]
        }
        return null
    }

    getHash(): string | null {
        const hashName = this.getHashName()
        if (!hashName) {
            return null
        }
        const hash = this.get(hashName)
        return (!hash || hash.startsWith('#')) ? hash : ('#' + hash)
    }

    has(name: string, value?: unknown): boolean {
        if (!this.params.hasOwnProperty(name)) {
            return false
        }
        if (typeof value === 'undefined') {
            return true
        }
        return a_string(value) === this.params[name]
    }

    keys(): string[] {
        return Object.keys(this.params)
    }

    reset(params?: SearchParamsAcceptType) {
        this.params = {}
        if (params) {
            this.setMany(params)
        }
    }


    set(name: string, value: unknown) {
        const v = a_string(value)
        if (name == P_Stringify && v === String(FALSE)) {
            this.delete(name)
            return
        }

        if (this.references.has(name)) {
            throw NewChangeReferrerError(name, this.references.getReference(name))
        }

        this.params[name] = v

        // Set all parameters that reference to this parameter to this value
        const refs = this.references.referrers(name)
        if (refs?.length) {
            for (const [key, type] of refs) {
                this.params[key] = safePathParamValue(v, type)
            }
        }
    }

    setFromEntries(entries: [string, unknown][]) {
        for (const [key, value] of entries) {
            this.set(key, value)
        }
    }

    /**
     * Sets parameters from a search string
     * @note Duplicate query parameters returns last occurrence, e.g. a=100&a=300 will only set a=300
     *
     * @example
     *  setFromSearch('a=100&a==300')       // set a=300
     */
    setFromSearch(searchString: string) {
        const {valid, search} = parseURLSearch(searchString)
        if (!valid) {
            return
        }
        this.setFromEntries(Object.entries(search))
    }


    setMany(params: ParamsType) {
        if (!params) {
            return
        }
        if (typeof params === 'string') {
            this.setFromSearch(params)
            return
        }
        if (params instanceof SearchParams) {
            this.setFromEntries(params.entries())
            return
        }
        if (params instanceof Map) {
            this.setFromEntries(params.entries() as any)
            return
        }
        if (params instanceof URLSearchParams) {
            // Jest URLSearchParams not support `size` and `entries()` yet
            params.forEach((value, key) => {
                this.set(key, value)
            })
            return
        }
        this.setFromEntries(Object.entries(params))
    }

    /**
     * Sets sort function, default is Ascend
     *
     * @example
     *  sort(null)      // Disable sorting
     *  sort()          // Default Ascend sort
     *  sort(Descend)  // Descend sort
     */
    sort(sortFunc?: SortFunc): SearchParams {
        this.sortFunc = sortFunc || sortFunc === null ? sortFunc : ASCEND
        return this
    }


    toJSON(): string {
        return this.toString()
    }

    toString(): string {

        let keys = this.keys()
        if (keys.length === 0) {
            return ''
        }
        if (this.sortFunc) {
            keys.sort(this.sortFunc)
        }
        const hashName = this.getHashName()
        let s = ''

        for (const key of keys) {
            let value = ''
            // The alias overrides/prevails over the key.
            if (this.references.has(key)) {
                const [name, type] = this.references.get(key)
                value = safePathParamValue(this.get(name), type)
            } else {
                value = this.get(key)
            }
            if (this.tidy && (!value || key === hashName)) {
                continue
            }
            const encodedValue = this.encode(value)
            s += `&${key}=${encodedValue}`
        }

        if (!s) {
            return ''
        }
        return s.slice(1)
    }

    values(): string[] {
        return Object.values(this.params)
    }

    * [Symbol.iterator](): IterableIterator<[string, any]> {
        for (const [key, value] of this.entries()) {
            yield [key, value]
        }
    }
}