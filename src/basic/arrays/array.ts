import {typeArray} from "../../aa/atype/func";
import {Break} from "../../aa/atype/const";
import {floatToInt} from "../../aa/atype/t_basic";


/**
 * Removes falsy elements from the start and end of an array
 *
 * @example
 *  trimArray([undefined, '', undefined, 'a', undefined, 'b', '', null])               //  ['', undefined, 'a',undefined, 'b', '', null]
 *  trimArray([undefined, '', undefined, 'a', undefined, 'b', '', null],v=>!v)         //  ['a', undefined, 'b']
 *  trimArray([1, 2, '', 3])                                                //  [1, 2, '', 3]
 *  trimArray([null, undefined, 'hello', undefined, 0, false], v => v === undefined || v === null)  // ['hello', undefined, 0, false]
 */
export function trimArray<T = unknown>(arr: T[], trimable: (v: T) => boolean = v => v === undefined): T[] {
    if (!arr?.length) {
        return []
    }
    // Trim start
    let start = 0
    while (start < arr.length && trimable(arr[start])) {
        start++
    }

    // Trim end
    let end = arr.length - 1
    while (end > -1 && trimable(arr[end])) {
        end--
    }
    if (start > end) {
        return []
    }
    return arr.slice(start, end + 1)
}

/**
 * Concatenates multiple arrays into a single array, skipping empty/null inputs
 *
 * @example
 * concat([1, 2], [3, 4]) // [1, 2, 3, 4]
 * concat([1], null, [2]) // [1, 2]
 * concat([], [1, 2])     // [1, 2]
 */
export function concat(...arrays: (unknown[] | null | undefined)[]): unknown[] {
    let result: unknown[] = []
    for (const arr of arrays) {
        if (!arr) {
            continue
        }
        if (arr?.length) {
            result.push(...arr)
        }
    }
    return result
}

export function concatInType<T>(cast: (v: unknown) => T, ...args: (unknown[] | null | undefined)[]): T[] {
    let arr = concat(...args)
    if (!arr.length) {
        return []
    }
    return typeArray(cast, arr)
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
    let itemStr: string = ''
    return arr.some(element => {
        if (element instanceof RegExp) {
            if (!itemStr) {
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

/**
 * Range from start to end
 */
export function range(start: number, end: number, step: number, callback: (i: number) => any) {
    step = Math.abs(step)
    if (start < end) {
        for (let i = start; i < end; i += step) {
            const r = callback(i)
            if (r === Break) {
                return Break
            }
        }
    }
    for (let i = start; i > end; i -= step) {
        const r = callback(i)
        if (r === Break) {
            return Break
        }
    }
}

/**
 * Shuffle an array using the Fisher-Yates algorithm
 */
export function shuffle<T>(origin: readonly T[]): T[] {
    const shuffled = origin.slice()
    let i = shuffled.length


    // While there remain elements to shuffle.
    while (i > 0) {
        const randomIndex = floatToInt(Math.random() * i)
        i--

        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]]
    }

    return shuffled;
}