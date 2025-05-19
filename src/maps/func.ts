import {ForEachCopyable, MapObject} from "../aa/atype/types";

/**
 * Deep clone a Map instance or a Map subclass instance
 *
 * @example
 *  cloneMap(new Map([['a',100],['b', 200]]))
 *
 * @example
 * // Clone a custom Map subclass
 *  class CustomMap<K, V> extends Map<K, V> {}
 *  cloneMap(new CustomMap([['a',100],['b', 200]]))   // Returns CustomMap instance
 */
export function cloneMap<K = unknown, V = unknown, T extends Map<K, V> = Map<K, V>>(source: T): T {
    const target = new (source.constructor as new() => T)()
    source.forEach((value: V, key: K): T => target.set(key, value))
    return target
}

export function cloneObjectMap(source: MapObject): MapObject {
    if (!source) {
        return {}
    }
    // new function, suggest
    if (typeof structuredClone === 'function') {
        return structuredClone(source)
    }

    const target = {}
    for (const key in source) {
        if (!Object.prototype.hasOwnProperty.call(source, key)) {
            continue
        }
        const value = source[key]
        target[key] = (value && typeof value === 'object') ? JSON.parse(JSON.stringify(value)) : value
    }
    return target
}

export function forEachCopy<T extends ForEachCopyable>(source: T, target: T): T {
    if (!source) {
        return target
    }
    source.forEach((value, key) => {
        target.set(key, value)
    })
    return target
}

export function sortObjectMap<T = MapObject>(source: T, compareFn?: (a: string, b: string) => number): T {
    return Object.keys(source).sort(compareFn).reduce((acc: T, key: string): T => {
        acc[key] = source[key]
        return acc
    }, {} as T)
}


export function assign(target: MapObject, source: MapObject) {

}