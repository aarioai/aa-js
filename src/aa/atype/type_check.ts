import {dict_t, node_t, nodelist_t, objectAtype} from './t_atype'
import {APX_MAX_SAFE_INT_LEN} from './a_define_consts'


/**
 * Checks if a string represents an integer within the conservative safe range
 * [-9000999999999999, 9000999999999999], which is slightly smaller than
 * JavaScript's MAX_SAFE_INTEGER for additional safety margin.
 */
export function isSafeInt(source: string): boolean {
    let length = source.length
    // Fast path for most common cases
    if (length < APX_MAX_SAFE_INT_LEN) {
        return true
    }
    let i = 0
    // Remove negative sign
    if (source.startsWith('-')) {
        length--
        i++
    }
    if (length < APX_MAX_SAFE_INT_LEN) {
        return true
    }
    if (length > APX_MAX_SAFE_INT_LEN) {
        return false
    }
    if (source[i] < '9') {
        return true
    }
    return source[i + 1] === '0' && source[i + 2] === '0' && source[i + 3] === '0'  // 9000xxxxxxxxxxxx
}

export function isIterable<T>(value: unknown): value is Iterable<T> {
    if (!value) {
        return false
    }
    return typeof (value as any)[Symbol.iterator] === 'function'
}


export function isJQueryDom(value: object): boolean {
    return value !== null &&
        'jquery' in value &&
        !!value.jquery &&
        (value as any).length > 0;
}

export function isMapObject(v: unknown): boolean {
    return typeof v === 'object' && objectAtype(v) === dict_t
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