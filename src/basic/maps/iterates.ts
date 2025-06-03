import {Dict} from '../../aa/atype/a_define_interfaces'
import {ASCEND, SortFunc} from '../../aa/atype/a_define_funcs'
import {IterableKV, MapCallbackFn} from './base'
import {BREAK, t_loopsignal} from '../../aa/atype/a_define_signals'
import {a_string} from '../../aa/atype/t_basic'

// Iterates over a key-value collection, executing a callback for each entry.
export function forEach(obj: IterableKV, callbackfn: MapCallbackFn<unknown, string, unknown>, thisArg?: unknown): t_loopsignal {
    if (!obj) {
        return
    }

    // Handle Map-like objects that have their own forEach
    if (typeof obj.forEach === 'function') {
        let stop = false
        obj.forEach((value: unknown, key: string, map?: Map<string, unknown>) => {
            if (stop) {
                return BREAK
            }
            const result = thisArg ? callbackfn.call(thisArg, value, key, map) : callbackfn(value, key, map)
            if (result === BREAK) {
                stop = true
                return BREAK
            }
        })
        return
    }

    // Fallback handle plain objects
    for (const [key, value] of Object.entries(obj)) {
        let k: string
        let v: unknown
        // Handle Array<[K, V]>
        if (typeof key === 'number' && Array.isArray(value) && value.length === 2) {
            k = value[0]
            v = value[1]
        } else {
            k = key
            v = value
        }

        const result = thisArg ? callbackfn.call(thisArg, v, k, obj) : callbackfn(v, k, obj)
        if (result === BREAK) {
            return
        }
    }
}

export function sort<T = Dict>(source: T, compareFn: SortFunc = ASCEND): T {
    return Object.keys(source).sort(compareFn).reduce((acc: T, key: string): T => {
        acc[key] = source[key]
        return acc
    }, {} as T)
}

export function valuesSortedByKeys(obj: Dict, sortKey: SortFunc = ASCEND): string[] {
    let values: string[] = []
    Object.keys(obj).sort(sortKey).forEach(key => {
        values.push(a_string(obj[key]))
    })
    return values
}