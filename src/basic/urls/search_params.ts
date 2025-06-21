import {deepEncodeURI, parseURLSearch} from './fn'
import {a_string} from '../../aa/atype/t_basic'
import {HASH_REF_NAME, NewChangeReferrerError, safePathParamValue, type t_params} from './base'
import {ASCEND, type SortFunc} from '../../aa/atype/a_define_funcs'
import AaMap from '../maps/map'
import SearchReference from './search_reference'


/**
 * Pros for Web API URLSearchParams
 *  1. JSON.stringify(new URLSearchParams('a=100'))  returns '{}', but not {"a":"100"}
 *  2. Jest URLSearchParams does not have `size` property
 *
 * Cons:
 *  1. SearchParams not support array search params, e.g.  a[]=100&a[]=200 is not allowed
 */
export default class SearchParams extends AaMap<string> {
    [Symbol.toStringTag] = 'SearchParams'
    readonly cast = a_string as any
    readonly isAaMap = true
    references: SearchReference = new SearchReference()
    sortFunc: SortFunc = ASCEND
    tidy: boolean = true
    encode: (s: string) => string = deepEncodeURI


    constructor(source?: t_params) {
        super()
        this.setMany(source)
    }


    getHashName(): string | undefined {
        if (this.references.has(HASH_REF_NAME)) {
            return this.references.getReference(HASH_REF_NAME)
        }
        return undefined
    }

    getHash(): string {
        const hashName = this.getHashName()
        if (!hashName) {
            return ''
        }
        const hash = this.get(hashName)
        if (!hash) {
            return ''
        }
        return hash.startsWith('#') ? hash : ('#' + hash)
    }

    reset(source?: t_params): this {
        this.map.clear()
        this.setMany(source)
        return this
    }

    set(name: string, value: unknown): this {
        const v = this.cast(value)

        if (this.references.has(name)) {
            throw NewChangeReferrerError(name, this.references.getReference(name))
        }

        this.map.set(name, v)

        // Set all parameters that reference to this parameter to this value
        const refs = this.references.referrers(name)
        for (const ref of refs) {
            const [key, type] = ref
            this.map.set(key, safePathParamValue(v, type))
        }
        return this
    }

    setMany(source?: t_params): this {
        if (!source) {
            return this
        }
        if (typeof source === 'string') {
            return this.setFromSearch(source)
        }

        super.setMany(source as any)
        return this
    }


    /**
     * Sets parameters from a search string
     * @note Duplicate query parameters returns last occurrence, e.g. a=100&a=300 will only set a=300
     *
     * @example
     *  setFromSearch('a=100&a==300')       // set a=300
     */
    setFromSearch(searchString: string): this {
        const {valid, search} = parseURLSearch(searchString)
        if (!valid) {
            return this
        }
        for (const [key, value] of Object.entries(search)) {
            this.set(key, value)
        }
        return this
    }

    /**
     * Sets sort function, default is Ascend
     *
     * @example
     *  sort(null)      // Disable sorting
     *  sort()          // Default Ascend sort
     *  sort(Descend)  // Descend sort
     */
    sort(sortFunc: SortFunc = ASCEND): SearchParams {
        this.sortFunc = sortFunc
        return this
    }


    toString(): string {
        let keys = this.keysArray()
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
                const [name, type] = this.references.get(key)!
                value = safePathParamValue(this.get(name), type)
            } else {
                value = this.get(key) || ''
            }
            if (this.tidy && (!value || key === hashName)) {
                continue
            }
            const encodedValue = this.encode(Array.isArray(value) ? value.join(',') : value)
            s += `&${key}=${encodedValue}`
        }

        if (!s) {
            return ''
        }
        return s.slice(1)
    }
}