import {MapObject, ToJSON} from "./a_define_interfaces";
import {isSafeInt} from './type_check'

export interface JsonReviverCtx {
    source: string

    [key: string]: any  // other keys
}

export const marshalReviver = (key: string, value: unknown): any => {
    return typeof value === 'bigint' ? value.toString() : value
}

export const unmarshalReviver = (key: string, value: unknown, ctx?: JsonReviverCtx): any => {
    if (!ctx) {
        return value
    }
    if (typeof value === 'number') {
        // Keep floats as-is
        if (ctx.source.includes('.')) {
            return value
        }
        if (isSafeInt(ctx.source)) {
            return value
        }
        // Bigint
        try {
            return BigInt(ctx.source)
        } catch {
            return value
        }
    }
    return value
}

class json {


    /**
     * Safely converts a value to JSON string with BigInt support.
     * Returns 'null' is safer than returns empty string ''
     *
     * @example
     * Marshal({a: 1, b: 2n}) // '{"a":1,"b":"2"}'
     * Marshal(null)           // null
     * Marshal(undefined)      // null
     */
    static Marshal(o: object | ToJSON<string> | null | undefined): string {
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
            return JSON.stringify(o, marshalReviver)
        } catch (error) {
            console.error(`json marshal error: ${error}`, o)
        }
        return 'null'
    }

    /**
     * Safely parses a JSON string or returns the input if already an object
     *
     * @example
     * Unmarshal('{"a":1000000000000000000}') // {a: 1000000000000000000n}
     * Unmarshal({"a":1}) // {a: 1}
     * Unmarshal(null)      // null
     * Unmarshal('invalid') // null
     */
    static Unmarshal(input: string | undefined | null | MapObject | Array<unknown>): object {
        if (!input || (typeof input === "string" && input.trim().toLowerCase() === "null")) {
            return null
        }
        if (typeof input === 'object') {
            return input
        }

        try {
            return JSON.parse(input.trim(), unmarshalReviver)
        } catch (error) {
            console.error(`json unmarshal error: ${error}`, input)
        }
        return null
    }
}

export default json
