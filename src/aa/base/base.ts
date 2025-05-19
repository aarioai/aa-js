import {Maps, ToJSON} from "../atype/types";

/**
 * Safely converts a value to JSON string with BigInt support.
 * Returns 'null' is safer than returns empty string ''
 *
 * @example
 * jsonify({a: 1, b: 2n}) // '{"a":1,"b":"2"}'
 * jsonify(null)           // null
 * jsonify(undefined)      // null
 */
export function jsonify(o: object | ToJSON<string> | null | undefined): string {
    if (!o) {
        return 'null'
    }

    try {
        if ((o as any).toJSON === 'function') {
            const s = (o as any).toJSON()
            if (typeof s === 'string') {
                return s
            }
        }
        // Convert bigint into string
        return JSON.stringify(o, (_, v) => typeof v === 'bigint' ? v.toString() : v)
    } catch (error) {
        console.error(`jsonify error: ${error}`, o)
    }
    return 'null'
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
export function parseJSON(input: string | undefined | null | Maps | Array<unknown>): object {
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