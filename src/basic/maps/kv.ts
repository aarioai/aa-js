import {ZERO_VALUES} from "../../aa/atype/a_server_consts";
import {MapObject} from '../../aa/atype/a_define_interfaces'

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

