import {ZERO_VALUES} from "../../aa/atype/a_server_consts";

/**
 * Sets a property on an object if the property doesn't exist or matches an excluded value.
 * Creates a new object/array if the target doesn't exist.
 *
 * @example
 * // Basic usage
 * const obj = {};
 * setIfNotExists(obj, 'name', 'John'); // { name: 'John' }
 *
 * // With excluded values
 * const arr = [1, 2, 3];
 * setIfNotExists(arr, 1, 99, [2]); // [1, 99, 3]
 *
 * // Auto-create target
 * setIfNotExists(null, 'a', 1); // { a: 1 }
 */
export function setNX<T extends object, K extends keyof unknown>(target: T, key: K, value: unknown, exclude?: unknown[]): T {
    if (!target) {
        target = (typeof key === 'number' ? [] : {}) as T
    }

    const v = (target as any)[key]
    if (typeof v === 'undefined') {
        (target as any)[key] = value
        return target
    }

    if (exclude?.length) {
        let v = (target as any)[key]
        for (let i = 0; i < exclude.length; i++) {
            let ex = exclude[i]
            if (v === ex || (typeof v === "number" && typeof ex === "number" && isNaN(ex) && isNaN(v))) {
                (target as any)[key] = value
                break
            }
        }
    }

    return target
}


export function setNotZero<T extends object, K extends keyof unknown>(target: T, key: K, value: unknown): T {
    return setNX(target, key, value, ZERO_VALUES)
}

