import {ZERO_VALUES} from "../../aa/atype/a_server_consts";
import {MapObject} from '../../aa/atype/a_define_interfaces'
import {KV} from './base'


export function getKV(target: KV, key: string): unknown {
    if (!target) {
        return undefined
    }
    // Handle Map-like objects (those with a .get() method), e.g. AaMap, AnyMap
    if (typeof target.get === 'function') {
        return target.get(key)
    }
    // Fallback to plain object access
    return target[key]
}

export function setKV(target: KV, key: string, value: unknown) {
    if (!target) {
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
export function setNX<V = unknown, T = MapObject<V>>(target: T, key: string, value: V, excludes?: unknown[]): T {
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

    if (excludes?.length) {
        for (const exclude of excludes) {
            if (old === exclude) {
                target[key] = value
                return target
            }
        }
    }

    return target
}


export function setNotZero<T extends object, K extends keyof unknown>(target: T, key: K, value: unknown): T {
    return setNX(target, key, value, ZERO_VALUES)
}

