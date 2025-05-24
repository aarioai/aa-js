import {isJQueryDom} from './type_check'

export const array_t = ':array'
export const bigint_t = ':bigint'
export const bool_t = ':bool'
export const class_t = ':class' // class A{}   A is :class, but (new A{}()) is :undefined
export const date_t = ':date'// Date is :function, but (new Date()) is :date
export const function_t = ':function'
export const map_t = ':map'   // new Map()
export const mapobject_t = ':mapobject'  // {}  map object
export const node_t = ':node'
export const nodelist_t = ':nodelist'
export const null_t = ':null'
export const number_t = ':number'
export const set_t = ':set'  // new Set()
export const symbol_t = ':symbol'
export const string_t = ':string'
export const regexp_t = ':regexp'
export const undefined_t = ':undefined'


export type Atype =
    ':array'
    | ':bigint'
    | ':bool'
    | ':class'
    | ':date'
    | ':function'
    | ':map'
    | ':mapobject'
    | ':node'
    | ':nodelist'
    | ':null'
    | ':number'
    | ':set'
    | ':symbol'
    | ':string'
    | ':regexp'
    | ':undefined'

export const TYPES_ALIAS = {
    ':array': 'a',
    ':bigint': 'i',
    ':boolean': 'b',
    ':class': 'c',
    ':date': 'd',
    ':function': 'f',
    ':map': 'm',
    ':mapobject': 'o',
    ':node': 'p',
    ':nodelist': 'q',
    ':null': 'l',
    ':number': 'n',
    ':set': 't',
    ':symbol': 'y',
    ':string': 's',
    ':regexp': 'r',
    ':undefined': 'u',
}


export function atypeAlias(value: unknown): string | unknown {
    return TYPES_ALIAS[atype(value)]
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
            return mapobject_t
    }
    return undefined_t
}

/**
 *
 * class A{}
 * atype(A) // ':class'
 * atype (new A())  // ':undefined'
 * atype(Date)  // ':function'
 * atype(new Date())    // ':date'
 */
export function atype(v: unknown): Atype {
    if (v === null) {
        return null_t
    }

    const t = typeof v
    switch (t) {
        case 'undefined':
            return undefined_t
        case 'boolean':
            return bool_t
        case 'bigint':
            return bigint_t
        case 'function':
            return v.toString().startsWith('class ') ? class_t : function_t
        case 'number':
            return number_t
        case 'string':
            return string_t
        case 'symbol':
            return symbol_t
    }

    return typeof v === "object" ? objectAtype(v) : undefined_t
}