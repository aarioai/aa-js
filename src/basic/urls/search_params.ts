import {deepEncodeURI, parseURLSearch} from './func'
import {AaMap, MapCallback} from '../../aa/atype/a_define_interfaces'
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
 *
 * Cons:
 *  1. SearchParams not support array search params, e.g.  a[]=100&a[]=200 is not allowed
 */
export default class SearchParams implements AaMap {
    readonly isAaMap: boolean = true
    references: SearchReference = new SearchReference()
    sortFunc: SortFunc = ASCEND
    tidy: boolean = true
    encode: (s: string) => string = deepEncodeURI
    readonly [Symbol.toStringTag] = 'SearchParams'
    private readonly map: StringMap = new Map<string, string>()

    constructor(searchString?: SearchParamsAcceptType) {
        if (searchString) {
            this.setMany(searchString)
        }
    }

    get size(): number {
        return this.map.size
    }

    clear() {
        this.map.clear()
    }

    delete(name: string, value?: unknown): boolean {
        if (this.has(name, value)) {
            this.map.delete(name)
            return
        }
    }

    forEach(callback: MapCallback<string, string>, thisArg?: unknown) {
        let stop = false
        this.map.forEach((value, key) => {
            if (stop) {
                return
            }
            if (BREAK === callback(value, key)) {
                stop = true
            }
        }, thisArg)
    }

    get(name: string): string {
        if (!name || !this.map.has(name)) {
            return null // as URLSearchParams interface
        }
        return this.map.get(name)
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
        if (!this.map.has(name)) {
            return false
        }
        if (typeof value === 'undefined') {
            return true
        }
        return a_string(value) === this.map.get(name)
    }

    reset(params?: SearchParamsAcceptType) {
        this.map.clear()
        if (params) {
            this.setMany(params)
        }
    }

    set(name: string, value: unknown): this {
        const v = a_string(value)

        if (this.references.has(name)) {
            throw NewChangeReferrerError(name, this.references.getReference(name))
        }

        this.map.set(name, v)

        // Set all parameters that reference to this parameter to this value
        const refs = this.references.referrers(name)
        if (refs?.length) {
            for (const [key, type] of refs) {
                this.map.set(key, safePathParamValue(v, type))
            }
        }
        return this
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
        return json.MarshalMap(this.map)
    }

    toMap(): StringMap {
        return this.map
    }

    toString(): string {
        let keys = Array.from(this.map.keys())
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

    entries(): MapIterator<[string, string]> {
        return this.map.entries()
    }

    keys(): MapIterator<string> {
        return this.map.keys()
    }

    values(): MapIterator<string> {
        return this.map.values()
    }

    [Symbol.iterator](): IterableIterator<[string, string]> {
        return this.map[Symbol.iterator]()
    }
}