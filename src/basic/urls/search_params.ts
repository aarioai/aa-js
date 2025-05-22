import {deepEncodeURI, parseURLSearch} from './func'
import {AnyMap, Callback, MapObject} from '../../aa/atype/a_define_complex'
import {a_string} from '../../aa/atype/t_basic'
import {Ascend, Break} from '../../aa/atype/const'
import {SortFunc} from '../../aa/atype/a_define'

export type SearchParamsAcceptType = string | URLSearchParams | MapObject | AnyMap
export type ParamsType = SearchParamsAcceptType | SearchParams

/**
 * Pros for Web API URLSearchParams
 *  1. JSON.stringify(new URLSearchParams('a=100'))  returns '{}', but not {"a":"100"}
 *  2. Jest URLSearchParams does not have `size` property
 */
export class SearchParams {
    params: MapObject<string> = {}   // Disable arrays, e.g.  a[]=100&a[]=200 is not allowed
    sortFunc: SortFunc = Ascend
    tidy: boolean = true
    encode: (s: string) => string = deepEncodeURI

    constructor(searchString?: SearchParamsAcceptType) {
        if (searchString) {
            this.setMany(searchString)
        }
    }

    get size(): number {
        return this.keys().length
    }


    delete(name: string, value?: unknown) {
        if (this.has(name, value)) {
            delete this.params[name]

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
            if (callback(value, key) === Break) {
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

    set(name: string, value: unknown) {
        this.params[name] = a_string(value)
    }

    setFromEntries(entries: [string, unknown][]) {
        for (const [key, value] of entries) {
            this.params[key] = a_string(value)
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


    setMany(params: SearchParamsAcceptType) {
        if (typeof params === 'string') {
            this.setFromSearch(params)
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
        this.sortFunc = sortFunc || sortFunc === null ? sortFunc : Ascend
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

        let s = ''
        for (const key of keys) {
            const value = this.get(key)
            if (!value && this.tidy) {
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