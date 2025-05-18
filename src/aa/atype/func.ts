import {a_string} from "./type_cast";

/**
 * Calculates the length/size of any value with consistent fallback behavior.
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
    if (typeof value === 'undefined' || value === null) {
        return 0
    }

    // self-defined property or getter (get len(){ return 10 })
    if (typeof (value as any).len === "number") {
        return (value as any).len
    }

    // string, array or others
    if (typeof (value as any).length === "number") {
        return (value as any).length
    }

    switch (typeof value) {
        case 'number':
            return String(value).length
        case 'object':
            return Object.keys(value).length
    }
    return a_string(value).length
}

/**
 * Converts an array of elements to a typed array
 *
 * @example
 * typeArray([1,"3","5"], a_number)
 */
export function typeArray<T>(cast: (value: any) => T, arr: any[]): T[] {
    if (arr.length === 0) {
        return []
    }
    let result: T[] = new Array(arr.length)
    for (let i = 0; i < arr.length; i++) {
        result[i] = cast(arr[i])
    }
    return result
}

export function stringArray(arr: any[]): string[] {
    return arr.map(v => String(v))
}

export function numberArray(arr: any[]): number[] {
    return arr.map(v => Number(v)).filter(v => !isNaN(v))
}

export function booleanArray(arr: any[]): boolean[] {
    return arr.map(v => Boolean(v))
}