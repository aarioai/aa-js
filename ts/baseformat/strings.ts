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
export function splitFirst(s:string, separator:string|number = ','):[string, string, boolean] {
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

type searchType =
    |string
    |RegExp
    |Array<[string|RegExp, string|number]>
    |Array<[string|RegExp, string|number]>[]
    |{[key:string]:string|number}

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
function normalizeReplacements(searchValue:searchType, replaceValue?:string|number):[string|RegExp, string][] {
    if (Array.isArray(searchValue)) {
        // Array<[string|RegExp, string|number]>
        if(!Array.isArray(searchValue[0])) {
            return [[searchValue[0], String(searchValue[1])]];
        }

        // Array<[string|RegExp, string|number]>[]
        let result :[string|RegExp, string][] = new Array(searchValue.length);
        for (let i=0;i< searchValue.length;i++){
            const v = searchValue[i] as [string|RegExp, string|number]
            result[i]=[v[0], String(v[1])]
        }
        return result
    }
        // {k:string|RegExp; v:string|number}
    if (typeof searchValue === 'object' && !(searchValue instanceof RegExp)) {
        const arr = Object.entries(searchValue)
        let result :[string|RegExp, string][] = new Array(arr.length);
        for (let i=0;i< arr.length;i++){
            const v = arr[i]
            result[i]=[v[0], String(v[1])]
        }
        return result;
    }

    return [[searchValue, String(replaceValue)]];
}

/**
 * Replaces all matched values
 *
 * @example
 *  replaceAll("I'm Aario. Hi, Aario!", "Aario", "Tom")  ==> I'm Tom. Hi, Tom!
 *  replaceAll("I'm Aario. Hi, Aario!", {
 *      "Aario": "Tom",
 *      "Hi": "Hello",
 *  })  ====>  I'm Tom. Hello, Tom!
 *  replaceAll("I'm Aario. Hi, Aario!", [["Aario", "Tom"],["Hi","Hello"]])  ====>  I'm Tom. Hello, Tom!
 */
export function replaceAll(s:string, searchValue:searchType, replaceValue?:string|number) {
     const replacements =  normalizeReplacements(searchValue, replaceValue);

    for (const [search, replace] of replacements) {
        if (search instanceof RegExp) {
            if (!search.flags.includes('g')) {
                throw new TypeError('replaceAll must be called with a global RegExp');
            }
            s = s.replace(search, replace)
        } else {
            s = s.split(search).join(replace)
        }
    }
    return s;
}