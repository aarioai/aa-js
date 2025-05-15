/**
 * Escapes all special regex characters in a string to make it safe for regex construction.
 * This allows the string to be matched literally in regular expressions.
 *
 * @param {string} s - The input string containing potential regex special characters
 * @returns {string} A regex-safe string with all special characters properly escaped
 *
 * @example
 * escapeRegexChars('file.txt')       // Returns 'file\\.txt'
 * escapeRegexChars('price: $100.00') // Returns 'price\\: \\$100\\.00'
 */
export function escapeRegExpChars(s:string) :string{
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}


export function escapeRegExp(s:string, flags?:string) :RegExp{
    return new RegExp(escapeRegExpChars(s), flags)
}
