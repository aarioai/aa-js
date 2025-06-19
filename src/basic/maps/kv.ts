import type {KV} from './base'
import {zeroValues} from '../../aa/dynamics/fn'
import type {Dict, DictKey} from '../../aa/atype/a_define_interfaces.ts'

// Converts a KV object to a Map instance
export function mapizeKV<V = unknown, K extends DictKey = DictKey, T extends KV<V, K> = KV<V, K>>(source: T | undefined | null): Map<K, V> {
    if (!source) {
        return new Map<K, V>()
    }
    if (source instanceof Map) {
        return source as Map<K, V>
    }
    if ('map' in source && source.map instanceof Map) {
        return source.map as Map<K, V>
    }

    // Handle Array<K, V>
    if (Array.isArray(source)) {
        return new Map<K, V>(source)
    }

    // Fallback to plain object
    return new Map<K, V>(Object.entries(source) as any)
}

export function getKV<V = unknown, K extends DictKey = DictKey, T extends KV<V, K> = KV<V, K>>(target: T, key: K): V | undefined {
    if (!target || typeof target !== 'object') {
        return undefined
    }

    // Handle Array<K, V>
    if (Array.isArray(target)) {
        for (const [k, v] of target) {
            if (k === key) {
                return v
            }
        }
        return undefined
    }

    // Handle Map-like objects (those with a .get() method), e.g. AaMap, AnyMap
    if (typeof target.get === 'function') {
        return (target as any).get(key)
    }

    // Fallback to plain objects
    return (target as any)[key]
}

export function hasKV<V = unknown, K extends DictKey = DictKey, T extends KV<V, K> = KV<V, K>>(target: T, key: K, value?: V): boolean {
    if (!target) {
        return false
    }
    if (typeof value === 'undefined') {
        // Handle Array<K, V>
        if (Array.isArray(target)) {
            for (const [k, _] of target) {
                if (k === key) {
                    return true
                }
            }
            return false
        }

        // Handle Map-like objects (those with a .get() method), e.g. AaMap, AnyMap
        if (typeof target.has === 'function') {
            return (target as any).has(target)
        }

        // Fallback to plain object access
        return target.hasOwnProperty(key as any)
    }

    const v = getKV(target, key)
    return v === value
}

/**
 * @return true if an element existed and has been removed, or false if the element does not exist or value does not match
 */
export function deleteKV<V = unknown, K extends DictKey = DictKey, T extends KV<V, K> = KV<V, K>>(target: T, key: K, value?: V): T | null {
    if (!target || !hasKV(target, key, value)) {
        return null
    }

    // Handle Array<K, V>
    if (Array.isArray(target)) {
        for (let i = 0; i < target.length; i++) {
            if (target[i][0] === key) {
                target.splice(i, 1)
            }
        }
        return target
    }


    // Handle Map-like objects (those with a .delete() method), e.g. AaMap, AnyMap
    if (typeof target.delete === 'function') {
        (target as any).delete(key)
        return target
    }
    // Fallback to plain object
    delete (target as any)[key]
    return target
}

export function setKV<V = unknown, K extends DictKey = DictKey, T extends KV<V, K> = KV<V, K>>(target: T, key: K, value: V): T | null {
    if (!target || typeof target !== 'object') {
        return null
    }

    // Handle Array<K, V>
    if (Array.isArray(target)) {
        for (let i = 0; i < target.length; i++) {
            if (target[i][0] === key) {
                target[i][1] = value
                return target
            }
        }
        target.push([key, value])
        return target
    }

    // Handle Map-like objects (those with a .set() method), e.g. AaMap, AnyMap
    if (typeof target.set === 'function') {
        (target as any).set(key, value)
        return target
    }

    // Fallback to plain object
    (target as any)[key] = value
    return target
}

/**
 * Sets a property on a map object if the property doesn't exist or matches an excluded value.
 * Creates a new object/array if the target doesn't exist.
 *
 * @example
 * setNX({age:18}, 'name', 'John'); // { name: 'John', age:18 }
 *
 * @example
 * // Exists, stop setting
 * setNX({name:'Tom', age:18}, 'name', 'John'); // { name: 'Tom', age:18 }
 *
 * @example
 * // Auto-create target
 * setNX(null, 'a', 1); // { a: 1 }
 */
export function setNX<V = unknown, K extends DictKey = DictKey, T extends KV<V, K> = KV<V, K>>(target: T | undefined | null, key: K, value: V, excludes?: Set<unknown>): T {
    if (!target) {
        const result: Dict<V> = {}
        result[String(key)] = value
        return result as T
    }

    const old = getKV(target, key)

    if (old === undefined || (typeof old === 'number' && isNaN(old))) {
        return setKV(target, key, value) as T
    }

    if (excludes && excludes.has(old)) {
        return setKV(target, key, value) as T
    }

    return target
}


export function setNotZero<V = unknown, K extends DictKey = DictKey, T extends KV<V, K> = KV<V, K>>(target: T, key: K, value: V): T {
    return setNX(target, key, value, zeroValues())
}