import {Dict} from '../../aa/atype/a_define_interfaces'
import {KV} from './base'
import {zeroValues} from '../../aa/dynamics/fn'

// Converts a KV object to a Map instance
export function mapizeKV<V = unknown, K = string>(source: KV<V, K>): Map<K, V> {
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

export function getKV(target: KV, key: string): unknown | undefined {
    if (!target) {
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
        return target.get(key)
    }

    // Fallback to plain object
    return target.hasOwnProperty(key) ? target[key] : undefined
}

export function hasKV(target: KV, key: string, value?: unknown): boolean {
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
            return target.has(target)
        }

        // Fallback to plain object access
        return target.hasOwnProperty(key)
    }

    const v = getKV(target, key)
    return v === value
}

export function setKV(target: KV, key: string, value: unknown) {
    if (!target) {
        return
    }

    // Handle Array<K, V>
    if (Array.isArray(target)) {
        for (let i = 0; i < target.length; i++) {
            if (target[i][0] === key) {
                target[i][1] = value
                return
            }
        }
        target.push([key, value])
        return
    }

    // Handle Map-like objects (those with a .set() method), e.g. AaMap, AnyMap
    if (typeof target.set === 'function') {
        target.set(key, value)
        return
    }

    // Fallback to plain object
    target[key] = value
}

/**
 *
 * @return true if an element existed and has been removed, or false if the element does not exist or value does not match
 */
export function deleteKV(target: KV, key: string, value?: unknown): boolean {
    if (!target || !hasKV(target, key, value)) {
        return false
    }

    // Handle Array<K, V>
    if (Array.isArray(target)) {
        for (let i = 0; i < target.length; i++) {
            if (target[i][0] === key) {
                target.splice(i, 1)
            }
        }
        return
    }

    // Handle Map-like objects (those with a .delete() method), e.g. AaMap, AnyMap
    if (typeof target.delete === 'function') {
        const result = target.delete(key)
        if (typeof result === 'function') {
            return result
        }
    }
    // Fallback to plain object
    delete target[key]
    return !hasKV(target, key)
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
export function setNX<V = unknown, T = Dict<V>>(target: T, key: string, value: V, excludes?: Set<unknown>): T {
    if (!target) {
        target = {} as T
        target[key] = value
        return target
    }

    const old = target[key]

    if (old === undefined || (typeof old === 'number' && isNaN(old))) {
        target[key] = value
        return target
    }

    if (excludes && excludes.has(old)) {
        target[key] = value
        return target
    }

    return target
}


export function setNotZero<T extends object, K extends keyof unknown>(target: T, key: K, value: unknown): T {
    return setNX(target, key, value, zeroValues())
}


