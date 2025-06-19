import type {DictKey} from '../../aa/atype/a_define_interfaces'
import {ASCEND, type SortFunc} from '../../aa/atype/a_define_funcs'
import type {CallbackFn, IterableKV, KV} from './base'
import {BREAK, type t_loopsignal} from '../../aa/atype/a_define_signals'
import {getKV} from './kv.ts'

// Iterates over a key-value collection, executing a callback for each entry.
export function forEach<V = unknown, K extends DictKey = DictKey>(obj: IterableKV<V, K>, callbackfn: CallbackFn<V, K>, thisArg?: unknown): t_loopsignal {
    if (!obj) {
        return
    }

    // 1. Handle Array<[K, V]>
    // @warn array has method forEach
    if (Array.isArray(obj)) {
        for (const [key, value] of obj) {
            const result = thisArg ? callbackfn.call(thisArg, value, key) : callbackfn(value, key)
            if (result === BREAK) {
                break
            }
        }
        return
    }

    // 2. Handle Map-like objects that have their own forEach
    if (typeof (obj as any).forEach === 'function') {
        let stop = false
        const f = (obj as any)
        f.forEach((value: V, key: K) => {
            if (stop) {
                return BREAK
            }
            const result = thisArg ? callbackfn.call(thisArg, value, key) : callbackfn(value, key)
            if (result === BREAK) {
                stop = true
                return BREAK
            }
        })
        return
    }

    // 3. Fallback handle plain objects
    for (const [key, value] of Object.entries(obj)) {
        const result = thisArg ? callbackfn.call(thisArg, value, key as K) : callbackfn(value, key as K)
        if (result === BREAK) {
            return
        }
    }
}

export function getKeys<K extends DictKey = DictKey>(source: IterableKV<unknown, K>): K[] {
    const result: K[] = []
    forEach(source, (_, key: K) => {
        result.push(key)
    })
    return result
}

export function sortKV<R = unknown, V = unknown, K extends DictKey = DictKey, T extends KV<V, K> = KV<V, K>>(source: T, itemHandler: (key: K, value: V | undefined) => R, compareFn: SortFunc = ASCEND): R[] {
    const keys = getKeys(source)
    if (compareFn) {
        keys.sort(compareFn)
    }
    const result: R[] = []
    for (const key of keys) {
        const value = getKV<V, K>(source, key)
        result.push(itemHandler(key, value))
    }
    return result
}

export function valuesSortedByKeys<V = unknown, K extends DictKey = DictKey, T extends KV<V, K> = KV<V, K>>(source: T, compareFn: SortFunc = ASCEND): K[] {
    return sortKV<K, V, K, T>(source, (key: K): K => key, compareFn)
}