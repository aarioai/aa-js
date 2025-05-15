/**
 * Escapes all special regex characters in a string to make it safe for regex construction.
 * This allows the string to be matched literally in regular expressions.
 *
 * @param {string} s - The input string containing potential regex special characters
 * @returns {string} A regex-safe string with all special characters properly escaped
 *
 * @example
 * escapeRegexChars(/\d+/.source)       // Returns '\\\\d\\+'
 * escapeRegexChars(/^\w+/ig.source) // Returns '\\^\\\\w\\+'
 */
export function escapeRegExpChars(s:string) :string{
    return s.replace(/[.*+?^${}()|\[\]\\]/g, '\\$&')
}

export function escapeRegExp(s:string, flags?:string) :RegExp{
    return new RegExp(escapeRegExpChars(s), flags)
}
