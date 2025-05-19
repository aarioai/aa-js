export const array_t = 'array'
export const bigint_t = 'bigint'
export const boolean_t = 'boolean'
export const class_t = 'class'  // new XXX()
export const date_t = 'date'
export const maps_t = 'maps'  // {}  map struct
export const node_t = 'node'
export const nodelist_t = 'nodelist'
export const function_t = 'function'
export const null_t = 'null'
export const number_t = 'number'
export const map_t = 'map'   // new Map()
export const set_t = 'set'  // new Set()
export const string_t = 'string'
export const undefined_t = 'undefined'
export const regexp_t = 'regexp'

export type Atype =
    'array'
    | 'bigint'
    | 'boolean'
    | 'class'
    | 'date'
    | 'maps'
    | 'node'
    | 'nodelist'
    | 'function'
    | 'null'
    | 'number'
    | 'map'
    | 'set'
    | 'string'
    | 'undefined'
    | 'regexp'

export const TypeAlias = {
    'array': 'a',
    'boolean': 'b',
    'class': 'c',
    'date': 'd',
    'maps': 'e',
    'number': 'i',
    'function': 'f',
    'null': 'l',
    'map': 'm',
    'bigint': 'n',
    'node': 'p',
    'nodelist': 'q',
    'regexp': 'r',
    'string': 's',
    'set': 't',
    'undefined': 'u',

    '_serializable': 'z'         // 特殊类，可以序列化为JSON字符串，并且将字符串对应的JSON作为构造参数，自动还原
}


export function objectAtype(v: object): Atype {
    if (v === null) {
        return null_t
    }
    if (Array.isArray(v)) {
        return array_t
    }
    if (isJQueryDom(v)) {
        return node_t
    }
    let c = v.constructor?.name?.toLowerCase() ?? ''
    if (c === "nodelist") {
        return nodelist_t
    }
    // html element
    if (c.startsWith('html')) {
        return node_t
    }

    switch (c) {
        case 'date':
            return date_t
        case 'regexp':
            return regexp_t
        case 'map':
            return map_t
        case 'set':
            return set_t
        case 'object':
            return maps_t
    }
    return v.constructor !== Object && c !== "object" ? class_t : undefined_t
}

export function atype(v: unknown): Atype {
    if (v === null) {
        return null_t
    }
    if (v === undefined) {
        return undefined_t
    }

    const t = typeof v
    switch (t) {
        case boolean_t:
            return boolean_t
        case bigint_t:
            return bigint_t
        case function_t:
            return function_t
        case number_t:
            return number_t
        case string_t:
            return string_t
    }

    return typeof v === "object" ? objectAtype(v) : undefined_t
}

export function isJQueryDom(value: object): boolean {
    return value !== null &&
        'jquery' in value &&
        !!value.jquery &&
        (value as any).length > 0;
}

export function isMaps(v: unknown): boolean {
    return typeof v === 'object' && objectAtype(v) === maps_t
}

/**
 * Is node or node list
 * @param v
 */
export function isDOM(v: unknown): boolean {
    if (typeof v !== 'object') {
        return false
    }
    const t = objectAtype(v)
    return t === nodelist_t || t === node_t
}

export function isNode(v: unknown): boolean {
    return typeof v === 'object' && objectAtype(v) === node_t
}

export function isNodelist(v: unknown): boolean {
    return typeof v === 'object' && objectAtype(v) === nodelist_t
}

/**
 * Is the value a zero value
 */
export function isZil(value: unknown): boolean {
    if (value === undefined || value === null || value === '' || value === 0) {
        return true
    }

    if (typeof value === 'boolean') {
        return !value
    }
    if (Array.isArray(value)) {
        return value.length === 0
    }

    return typeof value === 'object' && Object.keys(value).length === 0
}


export function atypeAlias(t: unknown): string | unknown {
    if (typeof t === 'undefined') {
        return TypeAlias.undefined
    }
    if (t === null) {
        return TypeAlias.null
    }
    if (typeof t !== 'string' || t !== string_t) {
        t = atype(t)
    }
    return TypeAlias[t as Atype]
}

