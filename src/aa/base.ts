/**
 * Safely converts a value to JSON string with BigInt support.
 *
 * Features:
 * - Handles null/undefined inputs by returning null
 * - Automatically converts BigInt values to strings
 * - Provides detailed error logging
 * - Maintains circular reference safety (via JSON.stringify)
 *
 * @param {any} o - The value to serialize to JSON
 * @returns {string | null} The JSON string or null if serialization fails
 *
 * @example
 * jsonify({a: 1, b: 2n}) // '{"a":1,"b":"2"}'
 * jsonify(null)           // null
 * jsonify(undefined)      // null
 * jsonify({x: new Date()}) // stringified date
 */
export function jsonify(o: any): string {
    if (!o) {
        return null
    }
    try {
        // bigint should be converted into string
        return JSON.stringify(o, (_, v) => typeof v === 'bigint' ? v.toString() : v)
    } catch (error) {
        console.error(`jsonify error: ${error}`, o)
    }
    return null
}

/**
 * Safely parses a JSON string or returns the input if already an object
 *
 * @example
 * parseJSON('{"a":1}') // {a: 1}
 * parseJSON({"a":1}) // {a: 1}
 * parseJSON(null)      // null
 * parseJSON('invalid') // null
 */
export function parseJSON(input: string | undefined | null | Map<any, any> | Array<any>): object {
    if (!input || (typeof input === "string" && input.trim().toLowerCase() === "null")) {
        return null
    }
    if (typeof input === 'object') {
        return input
    }

    try {
        return JSON.parse(input.trim())
    } catch (error) {

    }
    return null
}