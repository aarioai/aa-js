import {Builder, MapObject} from './a_define_interfaces'
import {isIterable} from './type_check'
import json from './json'


/**
 * Builds a new instance of the same type as the source object using its constructor
 *
 * @example
 *  build(new Date())   //  Equals to new Date()
 *
 * @example
 *  class CustomMap extends Map{}
 *  build(new CustomMap())  // Equals to new CustomMap()
 */
export function build<T>(source: T): T {
    return new (source.constructor as Builder<T>)()
}

/**
 * Determines whether a value requires deep cloning based on its type.
 */
export function needDeepClone(value: unknown): boolean {
    if (value === null) {
        return false
    }
    switch (typeof value) {
        case 'undefined':
        case 'bigint':
        case 'boolean':
        case 'number':
        case 'string':
        case 'symbol':  // symbol is readonly
            return false
        default:
            return true
    }
}

/**
 * Safely uses structuredClone() without throwing errors
 * Returns the original object if cloning fails (e.g., for URL, URLSearchParams, or other non-cloneable types).
 *
 * @example
 *  structuredCloneUnsafe([new Map()])                    //  {clone:xxx, ok:true}
 *  structuredCloneUnsafe([new URLSearchParams('')])      //  {clone:xxx, ok:false}
 */
export function structuredCloneUnsafe<T = unknown>(source: T): { clone: T, ok: boolean } {
    if (!needDeepClone(source)) {
        return {clone: source, ok: true}
    }
    try {
        return {clone: structuredClone(source), ok: true}
    } catch {
        return {clone: source, ok: false}
    }
}

export function cloneArray<V = unknown>(values: V[]): V[] {
    const length = values?.length
    if (!length) {
        return []
    }
    let clone: V[] = new Array<V>(length)
    for (let i = 0; i < length; i++) {
        clone[i] = cloneAny(values[i])
    }
    return clone
}

export function cloneIterable<V = unknown, T extends Iterable<V> = Iterable<V>>(source: T): T {
    const target = build<T>(source)
    for (const item of source) {
        const cloneItem = cloneAny(item)
        if (typeof (target as any).set === 'function') {
            (target as any).set(cloneItem)  // e.g. Map
        } else if (typeof (target as any).push === 'function') {
            (target as any).push(cloneItem)  // e.g. Array
        } else if ((typeof (target as any).add === 'function')) {
            (target as any).add(cloneItem)   // e.g. Set
        } else {
            return source   // invalid iterable
        }
    }
    return target
}

/**
 * Clones a Map instance or a Map subclass instance
 * Only deep copy basic types, Map
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
    const target = build<T>(source)
    source.forEach((value: V, key: K) => target.set(key, cloneAny(value)))
    return target
}

export function cloneMapObject(source: MapObject): MapObject {
    if (!source) {
        return {}
    }
    const {clone, ok} = structuredCloneUnsafe(source)
    if (ok) {
        return clone
    }

    const target = {}
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const value = source[key]
            target[key] = (value && typeof value === 'object') ? json.Unmarshal(json.Marshal(value)) : value
        }
    }
    return target
}

export function cloneSet<V = unknown, T extends Set<V> = Set<V>>(source: T): T {
    const target = build<T>(source)
    source.forEach((value: V) => target.add(cloneAny(value)))
    return target
}


export function cloneAny<T = unknown>(source: T): T {
    const {clone, ok} = structuredCloneUnsafe(source)
    if (ok) {
        return clone
    }

    if (typeof clone !== 'object') {
        return clone
    }

    // may be some non-cloneable objects exists in this Array
    if (Array.isArray(clone)) {
        return cloneArray(clone) as T
    }

    // may be some non-cloneable objects exists in this Map
    if (clone instanceof Map) {
        return cloneMap(clone)
    }

    // may be some non-cloneable objects exists in this Set
    if (clone instanceof Set) {
        return cloneSet(clone)
    }

    if (isIterable(clone)) {
        return cloneIterable(clone)
    }

    // try as MapObject
    try {
        const target = build<T>(clone)
        for (const key in clone) {
            if (!Object.prototype.hasOwnProperty.call(clone, key)) {
                continue
            }
            target[key] = cloneAny(clone[key])
        }
        return target
    } catch {
        return clone
    }
}