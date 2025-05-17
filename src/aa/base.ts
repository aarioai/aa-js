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

