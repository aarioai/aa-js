import {deepEncodeURI, parseURLSearch} from './func'
import {Callback, MapObjectable} from '../../aa/atype/a_define_interfaces'
import {a_string} from '../../aa/atype/t_basic'
import {HASH_REF_NAME, NewChangeReferrerError, ParamsType, safePathParamValue, SearchParamsAcceptType} from './base'
import SearchReference from './search_reference'
import {ASCEND, SortFunc} from '../../aa/atype/a_define_funcs'
import {BREAK} from '../../aa/atype/a_define_enums'
import {StringMap} from 'ts-jest'
import json from '../../aa/atype/json'


/**
 * Pros for Web API URLSearchParams
 *  1. JSON.stringify(new URLSearchParams('a=100'))  returns '{}', but not {"a":"100"}
 *  2. Jest URLSearchParams does not have `size` property
 */
export default class SearchParams implements MapObjectable {
    params: StringMap   // Disable arrays, e.g.  a[]=100&a[]=200 is not allowed
    references: SearchReference = new SearchReference()
    sortFunc: SortFunc = ASCEND
    tidy: boolean = true
    encode: (s: string) => string = deepEncodeURI

    constructor(searchString?: SearchParamsAcceptType) {
        this.params = new Map<string, string>()
        if (searchString) {
            this.setMany(searchString)
        }
    }

    get size(): number {
        return this.params.size
    }


    clear() {
        this.params.clear()
    }

    delete(name: string, value?: unknown) {
        if (this.has(name, value)) {
            this.params.delete(name)
            return
        }
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

    get(name: string): string {
        if (!name || !this.params.has(name)) {
            return null // as URLSearchParams interface
        }
        return this.params.get(name)
    }

    getHashName(): string {
        if (this.references && this.references.has(HASH_REF_NAME)) {
            return this.references.get(HASH_REF_NAME)[0]
        }
        return null
    }

    getHash(): string {
        const hashName = this.getHashName()
        if (!hashName) {
            return null
        }
        const hash = this.get(hashName)
        return (!hash || hash.startsWith('#')) ? hash : ('#' + hash)
    }

    has(name: string, value?: unknown): boolean {
        if (!this.params.has(name)) {
            return false
        }
        if (typeof value === 'undefined') {
            return true
        }
        return a_string(value) === this.params.get(name)
    }


    reset(params?: SearchParamsAcceptType) {
        this.params.clear()
        if (params) {
            this.setMany(params)
        }
    }


    set(name: string, value: unknown) {
        const v = a_string(value)

        if (this.references.has(name)) {
            throw NewChangeReferrerError(name, this.references.getReference(name))
        }

        this.params.set(name, v)

        // Set all parameters that reference to this parameter to this value
        const refs = this.references.referrers(name)
        if (refs?.length) {
            for (const [key, type] of refs) {
                this.params.set(key, safePathParamValue(v, type))
            }
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
        for (const [key, value] of Object.entries(search)) {
            this.set(key, value)
        }
    }


    setMany(params: ParamsType) {
        if (!params) {
            return
        }
        if (typeof params === 'string') {
            this.setFromSearch(params)
            return
        }
        // Handle ForEachIterable, e.g. SearchParams, URLSearchParams, Map
        if (typeof params.forEach === 'function') {
            params.forEach((value: unknown, key: string) => {
                this.set(key, value)
            })
            return
        }

        // Fallback, e.g. MapObject
        for (const [key, value] of Object.entries(params)) {
            this.set(key, value)
        }
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
        return json.MarshalMap(this.params)
    }

    toMap(): StringMap {
        return this.params
    }

    toString(): string {
        let keys = Array.from(this.params.keys())
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

    * keys(): MapIterator<string> {
        for (const key of Object.keys(this.params)) {
            yield key
        }
    }

    * values(): MapIterator<string> {
        for (const value of Object.values(this.params)) {
            yield value
        }
    }

    * entries(): IterableIterator<[string, string]> {
        yield* this.params.entries()
    }

    * [Symbol.iterator](): IterableIterator<[string, string]> {
        yield* this.entries()
    }


}