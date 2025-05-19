import {mapobject_t, node_t, nodelist_t, objectAtype} from './atype'

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
    return typeof v === 'object' && objectAtype(v) === mapobject_t
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