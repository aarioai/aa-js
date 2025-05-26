import {
    DATE_TESTER,
    DATETIME_TESTER,
    FALSE,
    FALSE_STRINGS,
    MAX_INT16,
    MAX_INT24,
    MAX_INT32,
    MAX_INT8,
    MAX_UINT16,
    MAX_UINT24,
    MAX_UINT32,
    MAX_UINT8,
    MIN_INT16,
    MIN_INT24,
    MIN_INT32,
    MIN_INT8,
    MYSQL_MIN_DATETIME,
    TRUE
} from "./a_server_consts";
import {Panic} from "./panic";
import {
    t_booln,
    t_char,
    t_int16,
    t_int24,
    t_int32,
    t_int64b,
    t_int8,
    t_numeric,
    t_safeint,
    t_uint16,
    t_uint24,
    t_uint32,
    t_uint64b,
    t_uint8,
} from "./a_define";
import {MapObject} from './a_define_interfaces'
import {typeArray} from './func'

import json from './json'
import {NIF} from './a_define_funcs'

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
 * Converts a value to an array consistently.
 *
 * @example
 * a_array(null)         // => []
 * a_array([1, 2, 3])    // => [1, 2, 3]
 * a_array({a: 1, b: 2}) // => [1, 2]
 */
export function a_array<T = unknown>(value: object | unknown[] | undefined, cast?: (value: unknown) => T): T[] {
    if (value === undefined || value == null) {
        return []
    }
    if (Array.isArray(value)) {
        return cast ? typeArray(cast, value) : value as T[]
    }
    Panic.assertNotTypeof(value, ['object'])
    return Object.values(value)
}

export function a_func(value: Function | undefined) {
    return typeof value === "function" ? value : NIF
}

export function record<T = unknown>(key: string, value: T): MapObject<T> {
    const result: MapObject<T> = {}
    result[key] = value
    return result
}

export function a_maps(value: MapObject | unknown[] | undefined): MapObject {
    if (!value) {
        return {}
    }
    // convert array to {0:a[0], 1:a[1]...}
    if (Array.isArray(value)) {
        return {...value}
    }
    return typeof value === "object" ? value : {}
}


/**
 * Converts number except NaN, bigint into a number, NaN into 0, and boolean into a t_bool
 * @param v
 */
export function a_number(v?: t_numeric | boolean): number {
    switch (typeof v) {
        case 'undefined':
            return 0
        case 'number':
            return isNaN(v) ? 0 : v
        case 'boolean':
            return v ? TRUE : FALSE
        default:
            const num = Number(v)
            return isNaN(num) ? 0 : num
    }
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
    switch (typeof value) {
        case 'boolean':
            return value ? String(TRUE) : String(FALSE)
        case 'string':
            return value
        case 'number':
            return isNaN(value) ? '' : String(value)
        case 'bigint':
            return String(value)
        case 'undefined':
            return ''
    }
    if (value === null) {
        return ''
    }

    // toJSON() > toString() > valueOf()
    if (typeof (value as any).toJSON === 'function') {
        return a_string((value as any).toJSON())
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

    const j = typeof value === 'object' ? json.Marshal(value) : ''
    return j ? j : String(value)
}


/**
 * Converts a visible ASCII byte character
 * @returns Single ASCII character or null character (\0) if conversion fails
 */
export function a_char(value: string | number | undefined): t_char {
    if (!value) {
        return '\0' // String.fromCharCode(0)
    }
    if (typeof value === 'number') {
        return (value > 31 && value < 127) ? String.fromCharCode(value) : '\0'
    }

    if (typeof value === 'string') {
        if (value.length !== 1) {
            return '\0'
        }
        const charCode = value.charCodeAt(0);
        return (charCode > 31 && charCode < 127) ? value : '\0';
    }

    return '\0';
}

export function a_bool(value: boolean | number | bigint | string | undefined): boolean {
    switch (typeof value) {
        case "boolean":
            return value
        case "number":
            return value > 0
        case 'bigint':
            return value > 0n
        case "string":
            value = value.trim().toLowerCase()
            return !FALSE_STRINGS.has(value)
        default:
            return Boolean(value)
    }
}

export function a_booln(value: boolean | number | bigint | string | undefined): t_booln {
    return a_bool(value) ? TRUE : FALSE
}


export function float64(v?: t_numeric): number {
    return a_number(v)
}

export function float32(v?: t_numeric): number {
    return float64(v)
}

export function floatToInt(v: number): number {
    return v ? v | 0 : 0  // faster than Math.floor()
}

export function int64b(v?: t_numeric): t_int64b {
    return BigInt(v)
}

// [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER] [-9007199254740991, 9007199254740991]
export function safeInt(v?: t_numeric): t_safeint {
    return floatToInt(a_number(v))
}

export function int32(v?: t_numeric): t_int32 {
    return inRange(safeInt(v), MIN_INT32, MAX_INT32, 'int32')
}

export function int24(v?: t_numeric): t_int24 {
    return inRange(safeInt(v), MIN_INT24, MAX_INT24, 'int24')
}

export function int16(v?: t_numeric): t_int16 {
    return inRange(safeInt(v), MIN_INT16, MAX_INT16, 'int16')
}

export function int8(v?: t_numeric): t_int8 {
    return inRange(safeInt(v), MIN_INT8, MAX_INT8, 'int8')
}

export function uint64b(v?: t_numeric): t_uint64b {
    return BigInt(v)
}

export function uint32(v?: t_numeric): t_uint32 {
    return inRange(safeInt(v), 0, MAX_UINT32, 'uint32')
}

export function uint24(v?: t_numeric): t_uint24 {
    return inRange(safeInt(v), 0, MAX_UINT24, 'uint24')
}

export function uint16(v?: t_numeric): t_uint16 {
    return inRange(safeInt(v), 0, MAX_UINT16, 'uint16')
}

export function uint8(v?: number): t_uint8 {
    return inRange(safeInt(v), 0, MAX_UINT8, 'uint8')
}

export function zeroize<T = unknown>(value: T): T {
    if (!value) {
        return value
    }

    switch (typeof value) {
        case 'boolean':
            return false as T
        case 'number':
            return 0 as T
        case 'bigint':
            return 0n as T
        case 'string':
            if (DATETIME_TESTER.test(value)) {
                return MYSQL_MIN_DATETIME as T
            } else if (DATE_TESTER.test(value)) {
                return MYSQL_MIN_DATETIME as T
            }
            return '' as T
    }

    return null
}

/**
 * Coerces a value to match the type of the source reference value
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion
 *
 * @example
 *  coerceType(1, '200')        // '1'
 *  coerceType(1n, 20)          // 1
 *  coerceType(undefined, 100)  // 0
 */
export function coerceType<T = unknown>(target: unknown, source: T): T {
    if (typeof target === typeof source) {
        return target as T
    }
    if (!target) {
        return zeroize(source)
    }
    switch (typeof source) {
        case 'boolean':
            return a_bool(target as any) as T
        case 'number':
            return a_number(target as any) as T
        case 'bigint':
            return BigInt(target as any) as T
        case 'string':
            return a_string(target) as T
    }
    return target as T
}