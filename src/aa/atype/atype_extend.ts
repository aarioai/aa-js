import {
    MaxInt16,
    MaxInt24,
    MaxInt32,
    MaxInt8,
    MaxUint16,
    MaxUint24,
    MaxUint32,
    MaxUint8,
    MinInt16,
    MinInt24,
    MinInt32,
    MinInt8,
    Nif
} from "./atype";
import {jsonify} from "../base/base";

function inRange(value: number, min: number, max: number, name: string): number {
    if ((typeof min !== 'undefined' && value < min) || (typeof max !== 'undefined' && value > max)) {
        if (!name) {
            name = `[${min}, ${max}]`
        }
        let msg = value + " can't be converted to " + name
        throw new RangeError(msg)
    }
    return value
}


/**
 * Converts any value to an array consistently.
 *
 * @example
 * a_array(null)         // => []
 * a_array([1, 2, 3])    // => [1, 2, 3]
 * a_array({a: 1, b: 2}) // => [1, 2]
 */
export function a_array<T>(value: T | T[] | null | undefined): T[] {
    if (value === undefined || value == null) {
        return []
    }
    if (Array.isArray(value)) {
        return value
    }
    if (["string", "number", "boolean"].includes(typeof value)) {
        throw new TypeError("a_array only accepts a null, undefined, dict or an array")
    }
    return Object.values(value)
}

export function a_bool(value: any): boolean {
    switch (typeof value) {
        case "boolean":
            return value
        case 'undefined':
            return false
        case "number":
            return value > 0
        case "string":
            value = value.trim().toLowerCase()
            return !["", "false", "f", "0", "no", "off", "null"].includes(value)
        case 'function':
            return Boolean(value())
        case 'object':
            return value !== null
        default:
            return Boolean(value)
    }
}

export function a_func(value: any) {
    return typeof value === "function" ? value : Nif
}

export function a_dict(value: any): object {
    if (typeof value === "undefined" || value == null) {
        return {}
    }
    // convert array to {0:a[0], 1:a[1]...}
    if (Array.isArray(value)) {
        return {...value}
    }
    return typeof value === "object" ? value : {}
}

/**
 * Safely converts any value to a string representation with intelligent handling of:
 * - Primitives (string, number, boolean)
 * - null/undefined (returns empty string)
 * - Objects with custom string representations (toJSON(), toString())
 * - Dates and other valueOf()-able objects
 * - Complex objects (via JSON serialization)
 *
 * @example
 * a_string("hello")       // "hello" (strings pass through)
 * a_string(null)          // "" (null becomes empty string)
 * a_string(42)            // "42" (number conversion)
 * a_string(true)          // "true" (boolean conversion)
 * a_string(new Date())    // ISO date string
 * a_string({a: 1})        // "{"a":1}" (JSON serialization)
 * a_string([1, 2, 3])     // "[1,2,3]" (array serialization)
 */
export function a_string(value: unknown): string {
    if (typeof (value) === 'string') {
        return value
    }
    if (typeof value == 'undefined' || value === null) {
        return ''
    }

    if (typeof (value as any).toJSON === 'function') {
        return (value as any).toJSON()
    }

    if (Array.isArray(value)) {
        return JSON.stringify(value)
    }

    if (typeof (value as any).toString === 'function') {
        const s = (value as any).toString();
        if (!s.startsWith('[object ')) {
            return s;
        }
    }

    // time, Date
    if (typeof (value as any).valueOf === 'function') {
        const v = (value as any).valueOf()
        if (typeof v !== 'object') {
            return String(v)
        }
    }

    if (typeof value === 'object') {
        return jsonify(value)
    }
    return String(value)
}

export function a_number(v?: number | string): number {
    return Number(v ? v : 0)
}

export function float64(v?: number | string): number {
    return Number(v)
}

export function float32(v?: number | string): number {
    return float64(v)
}

export function floatToInt(v: number): number {
    return v ? v | 0 : 0  // faster than Math.floor()
}

export function int54(v?: number | string): number {
    return floatToInt(a_number(v))
}

export function int32(v?: number | string): number {
    return inRange(int54(v), MinInt32, MaxInt32, 'int32')
}

export function int24(v?: number | string): number {
    return inRange(int54(v), MinInt24, MaxInt24, 'int24')
}

export function int16(v?: number | string): number {
    return inRange(int54(v), MinInt16, MaxInt16, 'int16')
}

export function int8(v?: number | string): number {
    return inRange(int54(v), MinInt8, MaxInt8, 'int8')
}

export function uint32(v?: number | string): number {
    return inRange(int54(v), 0, MaxUint32, 'uint32')
}

export function uint24(v?: number | string): number {
    return inRange(int54(v), 0, MaxUint24, 'uint24')
}

export function uint16(v?: number | string): number {
    return inRange(int54(v), 0, MaxUint16, 'uint16')
}

export function uint8(v?: number | string): number {
    return inRange(int54(v), 0, MaxUint8, 'uint8')
}


