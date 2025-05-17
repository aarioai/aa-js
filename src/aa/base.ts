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

export function isLocalhost(): boolean {
    if (typeof location === 'undefined' || !location.hostname) {
        return true
    }
    const h = location.hostname.toLowerCase()
    if (['localhost', '127.0.0.1', '::1'].includes(h)) {
        return true
    }
    // A类局域网IP范围
    if (/^10\.\d+\.\d+\.\d+$/.test(h)) {
        return true
    }
    // B类局域网
    if (/^127\.\d+\.\d+\.\d+$/.test(h) || /^172\.(1[6-9]|2\d|3[0-2])\.\d+\.\d+$/.test(h)) {
        return true
    }

    // C类局域网IP
    return /^192\.168\.\d+\.\d+$/.test(h);
}

