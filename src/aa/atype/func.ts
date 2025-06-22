import {a_bool, a_string} from "./t_basic";


/**
 * Gets the length/size of any value with consistent fallback behavior.
 *
 * Handles:
 * - null/undefined → 0
 * - Custom .len property (if numeric)
 * - Standard .length property (arrays, strings, etc.)
 * - Numbers → digit count
 * - Objects → key count
 * - Other types → 0
 *
 *
 * @example
 * len(null)            // 0
 * len([1, 2, 3])       // 3
 * len("hello")         // 5
 * len({a: 1, b: 2})    // 2
 * len(123)             // 3
 * len(.300)             // 3 ("0.3")
 * len(123.45)          // 6 (including decimal point)
 * len({len: 5})        // 5 (custom length property)
 * len(class A{get len(){return 5}})        // 5 (custom length property)
 */
export function len(value: unknown): number {
    if (value === undefined || value === null) {
        return 0
    }

    if (typeof value !== 'object') {
        return a_string(value).length
    }
    const v = (value as any)
    // Handle custom len property or len getter (get len(){ return 10 })
    if (typeof v.len === "number") {
        return v.len
    }

    // Handle Map, Set, etc.
    if (typeof v.size === "number") {
        return v.size
    }

    // Handle array, ect.
    if (typeof v.length === "number") {
        return v.length
    }

    // Handle iterables (including Headers)
    if (typeof v[Symbol.iterator] === 'function') {
        // Special case for Headers which has entries()
        if (typeof v.entries === 'function') {
            return Array.from(v.entries()).length;
        }
        return Array.from(v).length;
    }

    // Fallback handle plain object
    return Object.keys(value).length
}

/**
 * Converts an array of elements to a typed array
 *
 * @example
 * typeArray([1,"3","5"], a_number)
 */
export function typeArray<T, F = unknown>(cast: (value?: F) => T, arr: unknown[]): T[] {
    if (arr.length === 0) {
        return []
    }
    let result: T[] = new Array(arr.length)
    for (let i = 0; i < arr.length; i++) {
        result[i] = cast(arr[i] as F)
    }
    return result
}

export function stringArray(arr: unknown[]): string[] {
    return arr.map(v => String(v))
}

export function numberArray(arr: unknown[]): number[] {
    return arr.map(v => Number(v)).filter(v => !isNaN(v))
}

export function boolArray(arr: unknown[]): boolean[] {
    return arr.map(v => v && a_bool(v as any)) as boolean[]
}
