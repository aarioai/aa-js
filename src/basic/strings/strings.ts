import {a_string} from "../../aa/atype/t_basic";
import type {Dict} from '../../aa/atype/a_define_interfaces';

/**
 * Splits a string at the first occurrence of a separator, returning the parts and a success flag.
 *
 * This is similar to String.split() but provides more control by:
 * - Only splitting at the first occurrence
 * - Returning a flag indicating if the split occurred
 * - Preserving the separator in the results
 *
 * @param {string} s - The input string to be split
 * @param {string|number} separator - The separator to split at (will be converted to string)
 * @returns {[string, string, boolean]} A tuple containing:
 *            [0] The part before the separator
 *            [1] The part after the separator
 *            [2] Boolean indicating if split occurred
 *
 * @example
 * splitFirst('hello-world-!', '-')  // Returns ['hello', 'world-!', true]
 * splitFirst('no_split', 'x')    // Returns ['no_split', '', false]
 * splitFirst('a:b:c', ':')       // Returns ['a', 'b:c', true]
 */
export function splitFirst(s: string, separator: string | number = ','): [string, string, boolean] {
    const sep = String(separator)
    const index = s.indexOf(sep)
    return index >= 0
        ? [s.slice(0, index), s.slice(index + sep.length), true]
        : [s, "", false]

}

/**
 * Joins non-empty values with a specified separator, intelligently handling different value types.
 *
 * - Skips null, undefined, and empty string values
 * - Trims whitespace from string values
 * - Converts non-string values to strings
 * - Only adds the separator between non-empty values
 *
 * @example
 * joinWith(', ', 'apple', null, 'banana', 42, '', undefined) // Returns "apple, banana, 42"
 * joinWith(' - ', 'Hello', 'World')                          // Returns "Hello - World"
 * joinWith('/', '2023', '05', '15')                         // Returns "2023/05/15"
 */
export function joinWith(separator: string, ...args: unknown[]): string {
    const validValues: string[] = []

    for (const arg of args) {
        if (arg !== null && arg !== undefined && arg !== '') {
            const value = a_string(arg)
            if (value) {  // Check again after trimming/conversion
                validValues.push(value)
            }
        }
    }

    return validValues.join(separator)
}

/**
 * Joins non-empty values with a whitespace
 */
export function joinWithSpace(...args: string[]): string {
    return joinWith(' ', ...args)

}


type replacements =
    | Array<[string | RegExp, unknown]>
    | Array<[string | RegExp, unknown]>[]
    | Dict

/**
 * Normalizes different replacement value formats into a consistent array of [search, replace] tuples.
 * Handles multiple input formats:
 * - Single search/replace pair
 * - Array of search values (converted to search/replace pairs)
 * - Object of key/value replacements
 * - Array of [search, replace] tuples (passed through)
 *
 * @example
 * // Single replacement
 * normalizeReplacements('old', 'new') // => [['old', 'new']]
 *
 * // Array of search terms (replaced with empty string)
 * normalizeReplacements(['a', 'b'], '') // => [['a', ''], ['b', '']]
 *
 * // Object mapping
 * normalizeReplacements({old: 'new', foo: 'bar'}) // => [['old', 'new'], ['foo', 'bar']]
 *
 * // Already normalized array
 * normalizeReplacements([['a', '1'], ['b', '2']]) // => [['a', '1'], ['b', '2']]
 */
function normalizeReplacements(reps: replacements): [string | RegExp, string][] {
    if (Array.isArray(reps)) {
        // Array<[string|RegExp, string|number]>
        if (!Array.isArray(reps[0])) {
            return [[reps[0], a_string(reps[1])]]
        }

        // Array<[string|RegExp, string|number]>[]
        let result: [string | RegExp, string][] = new Array(reps.length)

        for (let i = 0; i < reps.length; i++) {
            const v = reps[i] as [string | RegExp, string | number]
            result[i] = [v[0], a_string(v[1])]
        }
        return result
    }
    // {k:string|RegExp; v:string|number}
    const arr = Object.entries(reps)
    let result: [string | RegExp, string][] = new Array(arr.length)
    for (let i = 0; i < arr.length; i++) {
        const v = arr[i]
        result[i] = [v[0], a_string(v[1])]
    }
    return result
}

/**
 * Replaces all matched values
 *
 * @example
 *  replaceAll("I'm Aario. Hi, Aario!", {
 *      "Aario": "Tom",
 *      "Hi": "Hello",
 *  })  ====>  I'm Tom. Hello, Tom!
 *  replaceAll("I'm Aario. Hi, Aario!", [["Aario", "Tom"],["Hi","Hello"]])  ====>  I'm Tom. Hello, Tom!
 *  replaceAll("I'm Aario. Hi, Aario!", [["Aario", "Tom"],["Hi","Hello"]])  ====>  I'm Tom. Hello, Tom!
 */
export function replace(s: string, reps: replacements): string {
    const replacements = normalizeReplacements(reps)
    for (const [search, replace] of replacements) {
        s = s.replace(search, a_string(replace))
    }
    return s
}

export function replaceAll(s: string, reps: replacements): string {
    const replacements = normalizeReplacements(reps)
    for (const [search, replace] of replacements) {
        if (search instanceof RegExp) {
            s = s.replace(search, a_string(replace))
        } else {
            s = s.replaceAll(search, a_string(replace))
        }
    }
    return s
}

/**
 * Splits a string by separator, trims each part, and removes empty strings
 *
 *
 * @example
 * tidySplit('a, b , , c', ',')       // ['a', 'b', 'c']
 * tidySplit('  one  two  three  ', /\s+/) // ['one', 'two', 'three']
 * tidySplit('a|b|c|d', '|', 2)      // ['a', 'b']
 */
export function tidySplit(s: string, separator: string | RegExp = ',', limit?: number) {
    return s ? s.split(separator, limit).map(part => part.trim()).filter(part => part.length > 0) : []
}


export function trimRight(s: string, cut: string | number = ' ', cutLen?: number) {
    const cutstr = String(cut)
    const cutLength = cutstr.length

    if (!s || s.length < cutLength) {
        return s
    }

    cutLen = cutLen || s.length
    let endIndex = s.length

    while (cutLen > 0 && endIndex >= cutLength &&
    s.substring(endIndex - cutLength, endIndex) === cutstr) {
        cutLen--
        endIndex -= cutLength
    }

    return endIndex < 1 ? '' : s.substring(0, endIndex)
}


export function trimLeft(s: string, cut: string | number = ' ', cutLen?: number) {
    const cutstr = String(cut)
    const cutLength = cutstr.length

    if (!s || s.length < cutLength) {
        return s
    }

    cutLen = cutLen ? cutLen : s.length
    let startIndex = 0

    while (cutLen > 0 && startIndex <= s.length - cutLength &&
    s.substring(startIndex, startIndex + cutLength) === cut) {
        cutLen--
        startIndex += cutLength
    }

    return startIndex > s.length - 1 ? '' : s.substring(startIndex)
}

export function trim(s: string, cut: string | number = ' ', cutLen?: number) {
    return trimRight(trimLeft(s, cut, cutLen), cutLen)
}