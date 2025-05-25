import {MapObject} from '../../aa/atype/a_define_interfaces'
import {ASCEND, SortFunc} from '../../aa/atype/a_define_funcs'
import {IterableKV, MapCallbackFn} from './base'
import {BREAK, t_loopsignal} from '../../aa/atype/a_define_enums'

// Iterates over a key-value collection, executing a callback for each entry.
export function forEach(obj: IterableKV, callbackfn: MapCallbackFn, thisArg?: unknown): t_loopsignal {
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
            if (callbackfn(value, key, map) === BREAK) {
                stop = true
                return BREAK
            }
        }, thisArg)
        return
    }
    if (thisArg) {
        callbackfn.bind(this)
    }

    // Fallback handle plain objects
    for (const [key, value] of Object.entries(obj)) {
        if (callbackfn(value, key) === BREAK) {
            return
        }
    }
}

export function sort<T = MapObject>(source: T, compareFn: SortFunc = ASCEND): T {
    return Object.keys(source).sort(compareFn).reduce((acc: T, key: string): T => {
        acc[key] = source[key]
        return acc
    }, {} as T)
}