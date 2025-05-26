import {MapObject} from '../../aa/atype/a_define_interfaces'
import {ASCEND, SortFunc} from '../../aa/atype/a_define_funcs'
import {IterableKV, MapCallbackFn} from './base'
import {BREAK, t_loopsignal} from '../../aa/atype/a_define_enums'

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
        const result = thisArg ? callbackfn.call(thisArg, value, key, obj) : callbackfn(value, key, obj)
        if (result === BREAK) {
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