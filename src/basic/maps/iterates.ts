import {MapCallback, MapObject} from '../../aa/atype/a_define_interfaces'
import {ASCEND, SortFunc} from '../../aa/atype/a_define_funcs'
import {KV} from './base'

// Iterates over a key-value collection, executing a callback for each entry.
export function forEach(obj: KV, callback: MapCallback, thisArg?: unknown) {
    if (!obj) {
        return
    }
    // Handle Map-like objects that have their own forEach
    if (typeof obj.forEach === 'function') {
        obj.forEach(callback, thisArg)
        return
    }
    if (thisArg) {
        callback.bind(this)
    }

    // Fallback handle plain objects
    for (const [key, value] of Object.entries(obj)) {
        callback(key, value)
    }
}

export function sort<T = MapObject>(source: T, compareFn: SortFunc = ASCEND): T {
    return Object.keys(source).sort(compareFn).reduce((acc: T, key: string): T => {
        acc[key] = source[key]
        return acc
    }, {} as T)
}