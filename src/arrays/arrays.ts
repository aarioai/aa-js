import {typeArray} from "../aa/atype_func";

/**
 * Concatenates multiple arrays into a single array, skipping empty/null inputs
 *
 * @example
 * concat([1, 2], [3, 4]) // [1, 2, 3, 4]
 * concat([1], null, [2]) // [1, 2]
 * concat([], [1, 2])     // [1, 2]
 */
export function concat(...args: (any[] | null | undefined)[]): any[] {
    let result: any[] = []
    for (const arr of args) {
        if (arr?.length) {
            result.push(...arr)
        }
    }
    return result
}

export function concatInType<T>(cast: (v: any) => T, ...args: (any[] | null | undefined)[]): T[] {
    let arr = concat(...args)
    if (!arr.length) {
        return []
    }
    return typeArray(arr, cast)
}

/**
 * Checks if an array contains an item, with support for RegExp matching
 *
 * @example
 * contains([1,2,3], 1) // Return true
 * contains([/apple/i, 'money'], 'orange')  // Returns false
 * contains([/apple/i, 'money'], 'Apple')  // Returns true
 */
export function contains<T>(arr: Array<T | RegExp>, item: T): boolean {
    if (!arr?.length) {
        return false
    }
    let itemStr: string
    return arr.some(element => {
        if (element instanceof RegExp) {
            if (itemStr === '') {
                itemStr = String(item)
            }
            return element.test(itemStr)
        }
        return element === item
    })
}

/**
 * Generates an array by applying a value generator function n times
 *
 * @example
 * // Static fill
 * generateArray(3, 'a') // ['a', 'a', 'a']
 *
 * // Dynamic generation
 * generateArray(5, 1, v => v * 2) // [1, 2, 4, 8, 16]
 *
 * // Edge cases
 * generateArray(0, 'x') // []
 */
export function generateArray<T>(count: number, initialValue: T, generator?: (current: T, index: number) => T): T[] {
    if (!count || count < 1) {
        return []
    }

    const result = new Array(count)
    result[0] = initialValue

    for (let i = 1; i < count; i++) {
        result[i] = generator ? generator(result[i - 1], i) : initialValue
    }

    return result
}