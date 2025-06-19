import {isJQueryDom} from './type_check'
import Serializable from './a_define_interfaces'

export const ATYPE_PREFIX = ':'

export enum AtypeAlias {
    ':array' = ':a',
    ':bigint' = ':g',
    ':boolean' = ':b',
    ':class' = ':c',
    ':date' = ':d',
    ':dict' = ':e',
    ':function' = ':f',
    ':map' = ':m',
    ':node' = ':n',
    ':nodelist' = ':l',
    ':null' = ':o',
    ':number' = ':i',
    ':serializable' = ':z',
    ':set' = ':t',
    ':symbol' = ':y',
    ':string' = ':s',
    ':regexp' = ':r',
    ':undefined' = ':u',
}

const ATYPES = Object.keys(AtypeAlias)
const ALIASED_ATYPES = Object.values(AtypeAlias)
export type t_atype = typeof ATYPES[number]
export type t_atype_alias = typeof ALIASED_ATYPES[number] | ''

export const array_t: t_atype = ':array'
export const bigint_t: t_atype = ':bigint'
export const bool_t: t_atype = ':bool'
export const class_t: t_atype = ':class' // Non-instantiated class. e.g.  A is a :class, but (new A{}()) is :undefined
export const date_t: t_atype = ':date'// Date is :function, but (new Date()) is :date
export const dict_t: t_atype = ':dict'  // Dict<unknown>
export const function_t: t_atype = ':function'  // function, not include Non-instantiated class
export const map_t: t_atype = ':map'   // new Map()
export const node_t: t_atype = ':node'          // e.g. document.querySelector('div')
export const nodelist_t: t_atype = ':nodelist'  // e.g. document.querySelector('body').childNodes
export const null_t: t_atype = ':null'
export const number_t: t_atype = ':number'
export const serializable_t: t_atype = ':serializable'  // extends Serializable, a class can serialize itself to a string, and revert itself with the string
export const set_t: t_atype = ':set'  // new Set()
export const symbol_t: t_atype = ':symbol'
export const string_t: t_atype = ':string'
export const regexp_t: t_atype = ':regexp'
export const undefined_t: t_atype = ':undefined'

export function isAtype(key: t_atype | string): key is keyof typeof AtypeAlias {
    return key in AtypeAlias
}

export function isAtypeAlias(s: string): boolean {
    return ALIASED_ATYPES.includes(s as any)
}


export function objectAtype(v: object | null): t_atype {
    if (v === null) {
        return null_t
    }
    if (Array.isArray(v)) {
        return array_t
    }
    if (v instanceof Serializable) {
        return serializable_t  // special
    }

    let c = v.constructor?.name ?? ''

    switch (c) {
        case 'Date':
            return date_t
        case 'RegExp':
            return regexp_t
        case 'Map':
            return map_t
        case 'NodeList':
            return nodelist_t
        case 'Set':
            return set_t
        case 'Object':
            return dict_t
    }

    // html element
    if (c.startsWith('HTML') || isJQueryDom(v)) {
        return node_t
    }
    return undefined_t
}

/**
 * Checks a value is a non-instantiated class
 * Difference between :function and :class:
 *  :class is a non-instantiated class, have to use `new class()` to instantiate it
 *  :function can use `new function()` or just `function()` to instantiate it
 *
 * @example
 *  class A{}
 *  isNonInstantiatedClass(A)       // true
 *  isNonInstantiatedClass(new A()) // false
 *  isNonInstantiatedClass(Date)    // false, Date is a function
 */
export function isNonInstantiatedClass(v: unknown): boolean {
    if (!v || typeof v !== 'function') {
        return false
    }
    if (v.toString().startsWith('class ')) {
        return true
    }
    try {
        v()   // Classes throw when called without 'new'
        return false
    } catch (err) {
        return (err as Error).message.includes('class constructor')
    }
}

/**
 *
 * class A{}
 * atype(A) // ':class'
 * atype (new A())  // ':undefined'
 * atype(Date)  // ':function'
 * atype(new Date())    // ':date'
 */
export function detectAtype(v: unknown): t_atype {
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
            return isNonInstantiatedClass(v) ? class_t : function_t
        case 'number':
            return number_t
        case 'string':
            return string_t
        case 'symbol':
            return symbol_t
    }

    return typeof v === "object" ? objectAtype(v) : undefined_t
}

export function detectAtypeAlias(value: unknown): [t_atype, t_atype_alias] {
    const t = detectAtype(value)
    if (isAtype(t)) {
        return [t, AtypeAlias[t]]
    }
    return [t, ""]
}

export function atypeAlias(t: t_atype | string): t_atype_alias {
    if (isAtype(t)) {
        return AtypeAlias[t]
    }
    return ""
}

export function aliasToAtype(alias: t_atype_alias): t_atype {
    for (const [t, a] of Object.entries(AtypeAlias)) {
        if (alias === a) {
            return t
        }
    }
    return undefined_t
}


