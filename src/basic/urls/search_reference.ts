import {path_param_string_t, type t_path_param} from '../../aa/atype/enums/path_param'
import AaMap from '../maps/map'
import type {t_params} from './base'
import {parseURLSearch} from './fn'
import {ASCEND, type SortFunc} from '../../aa/atype/a_define_funcs'

export default class SearchReference<V = [string, t_path_param?]> extends AaMap<V> {
    [Symbol.toStringTag] = 'SearchReference'
    sortFunc: SortFunc = ASCEND

    constructor(source?: t_params) {
        super()
        this.setMany(source)
    }
 
    /**
     * Sets parameters from a search string
     * @example
     *  setFromSearch('a={a:uint}&b={b}')
     */
    setFromSearch(searchString: string) {
        const {valid, search} = parseURLSearch(searchString)
        if (!valid) {
            return
        }
        for (const [key, value] of Object.entries(search)) {
            this.set(key, [value, path_param_string_t])
        }
    }

    set(key: string, value: [string, t_path_param?] | undefined): this {
        if (!value) {
            return this
        }
        super.set(key, value)
        return this
    }

    setMany(source?: t_params): this {
        if (!source) {
            return this
        }
        if (typeof source === 'string') {
            this.setFromSearch(source)
            return this
        }
        super.setMany(source as any)
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
    sort(sortFunc: SortFunc = ASCEND): this {
        this.sortFunc = sortFunc
        return this
    }

    referrers(reference: string): V[] {
        const result: V[] = []
        super.forEach((ref, referer) => {
            const r: [string, t_path_param?] = ref as any
            if (r[0] === reference) {
                const v: [string, t_path_param?] = [referer]
                if (r.length === 2) {
                    v.push(r[1] as t_path_param)
                }
                result.push(v as V)
            }
        })
        return result
    }

    getReference(name: string): string | undefined {
        const value = super.get(name)
        return value ? (value as any)[0] : undefined
    }

    toString(): string {
        let keys = this.keysArray()
        if (keys.length === 0) {
            return ''
        }
        if (this.sortFunc) {
            keys.sort(this.sortFunc)
        }
        let s = ''
        for (const key of keys) {
            const value = this.getReference(key) || ''
            s += `&${key}=${value}`
        }
        if (!s) {
            return ''
        }
        return s.slice(1)
    }

}