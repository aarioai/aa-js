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
 * splitFirst('hello-world', '-')  // Returns ['hello', 'world', true]
 * splitFirst('no_split', 'x')    // Returns ['no_split', '', false]
 * splitFirst('a:b:c', ':')       // Returns ['a', 'b:c', true]
 */
export function splitFirst(s:string, separator:[string|number]):[string, string, boolean] {
    const sep = String(separator)
    const index = s.indexOf(sep);
    return index >= 0
        ? [s.slice(0, index), s.slice(index + sep.length), true]
        : [s, "", false];
}

/**
 * Joins non-empty values with a specified separator, intelligently handling different value types.
 *
 * - Skips null, undefined, and empty string values
 * - Trims whitespace from string values
 * - Converts non-string values to strings
 * - Only adds the separator between non-empty values
 *
 * @param {string} separator - The string used to separate the joined values
 * @param {...any} args - The values to be joined (any type)
 * @returns {string} A string containing the joined values separated by the specified separator
 *
 * @example
 * joinWith(', ', 'apple', null, 'banana', 42, '', undefined) // Returns "apple, banana, 42"
 * joinWith(' - ', 'Hello', 'World')                          // Returns "Hello - World"
 * joinWith('/', '2023', '05', '15')                         // Returns "2023/05/15"
 */
export function joinWith(separator:string, ...args: any[]  ):string{
    const validValues: string[] = [];

    for (const arg of args) {
        if (arg !== null && arg !== undefined && arg !== '') {
            const value = typeof arg === "string" ? arg.trim() : String(arg);
            if (value) {  // Check again after trimming/conversion
                validValues.push(value);
            }
        }
    }

    return validValues.join(separator);
}

/**
 * Joins non-empty values with a blank
 * @param args
 */
export function joinWithBlank(...args:string[]):string{
    return joinWith(' ', ...args);
}

/**
 * Normalizes different replacement value formats into a consistent array of [search, replace] tuples.
 * Handles multiple input formats:
 * - Single search/replace pair
 * - Array of search values (converted to search/replace pairs)
 * - Object of key/value replacements
 * - Array of [search, replace] tuples (passed through)
 *
 * @param {any} searchValue - The search value(s) to normalize
 * @param {any} replaceValue - The replacement value (used when searchValue isn't a collection)
 * @returns {[string, string][]} Array of [search, replace] string tuples
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
function normalizeReplacements(searchValue:any, replaceValue:any):[string, string][] {
    if (Array.isArray(searchValue)) {
        return searchValue.length > 0 && Array.isArray(searchValue[0])
            ? searchValue
            : [searchValue];
    }

    if (typeof searchValue === 'object' && !(searchValue instanceof RegExp)) {
        return Object.entries(searchValue);
    }

    return [[searchValue, replaceValue]];
}

export function replaceAll(s:string, searchValue:any, replaceValue:any) {
     const replacements =  normalizeReplacements( searchValue, replaceValue);

    for (const [search, replace] of replacements) {
        if (search instanceof RegExp) {
            if (!search.flags.includes('g')) {
                throw new TypeError('replaceAll must be called with a global RegExp');
            }
            s = s.replace(search, replace);
        } else {
            s = s.split(search).join(replace);
        }
    }
    return s;
}