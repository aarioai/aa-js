import {t_path_param} from '../../aa/atype/a_define'
import AaMap from '../maps/map'
import {t_params} from './base'
import {parseURLSearch} from './fn'
import {ASCEND, SortFunc} from '../../aa/atype/a_define_funcs'
import {path_param_string_t} from '../../aa/atype/a_define_enums'

export default class SearchReference<V = [string, t_path_param]> extends AaMap<V> {
    [Symbol.toStringTag] = 'SearchReference'
    sortFunc: SortFunc = ASCEND

    constructor(source?: t_params) {
        super()
        if (!source) {
            return
        }
        this.setMany(source)
    }

    readonly cast = (v: [string, t_path_param?]): V => {
        if (!v[1]) {
            v[1] = path_param_string_t
        }
        return v as V
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
            return
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

        super.setMany(source)
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

    referrers(reference: string): [string, t_path_param][] {
        const result: [string, t_path_param][] = []
        this.forEach((ref, referer) => {
            if (ref[0] === reference) {
                result.push([referer, ref[1]])
            }
        })
        return result
    }


    getReference(name: string): string {
        return this.get(name)[0]
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
            const value = this.get(key)
            s += `&${key}=${value}`
        }
        if (!s) {
            return ''
        }
        return s.slice(1)
    }

}