import {Dict} from '../../aa/atype/a_define_interfaces'
import {Err_MissingArgument} from '../../aa/aerror/errors'
import {KV} from './base'
import {forEach} from './iterates'
import {getKV, setKV} from './kv'
import {isMeaningful, syncType, zeroize} from '../../aa/atype/t_basic'
import {BREAK, CONTINUE} from '../../aa/atype/a_define_signals'


export function compareAny(a: unknown, b: unknown): boolean {
    if (!a && !b) {
        return a === b
    }
    if (!a || !b) {
        return false
    }
    if (typeof a !== 'object') {
        return a === b
    }
    if (Array.isArray(a)) {
        const lenA = a.length
        if (!Array.isArray(b) || lenA !== b.length) {
            return false
        }
        for (let i = 0; i < lenA; i++) {
            if (!compareAny(a[i], b[i])) {
                return false
            }
        }
        return true
    }

    return compare(a as any, b as any)
}

export function compare(a: KV, b: KV): boolean {
    if (!a && !b) {
        return a === b
    }
    if (!a || !b) {
        return false
    }

    const sizeA = Array.isArray(a) ? a.length : a.size
    const sizeB = Array.isArray(a) ? a.length : a.size
    if (typeof sizeA === 'number' && typeof sizeB === 'number' && sizeA !== sizeB) {
        return false
    }
    let same = true
    forEach(a, (valueA, key) => {
        const valueB = getKV(b, key)
        if (!compareAny(valueA, valueB)) {
            same = false
            return BREAK
        }
    })
    return same
}

/**
 * Assigns from a source KV object to a target KV object
 *
 * @example
 *  assign({age:18}, undefined)                      // {name:'Aario'}
 *  assign({age:18}, {name:'Aario'})                 // {name:'Aario', age:18}
 *  assign(new Map([['age', 18]]), {name:'Aario'})   // {name:'Aario', age:18}
 */
export function assign<T extends KV = KV>(target: T, ...sources: (KV | undefined)[]): T {
    if (!target) {
        throw Err_MissingArgument
    }
    const n = sources.length
    if (n === 0) {
        return target
    }
    for (let i = 0; i < n; i++) {
        forEach(sources[i], (value, key) => {
            if (isMeaningful(value)) {
                setKV(target, key, value)
            }
        })
    }
    return target
}

/**
 * Safely assigns from one or many source KV objects to a target map object.
 *
 * @example
 *  assignDict({}, {name:'Aario', sex: 'male'}, {name:'Tom'})           // {name:'Tom', sex:'male'}
 *  assignDict({age:18}, undefined)         // {age:18}
 *  assignDict({age:18}, {name:'Aario'})    // {name:'Aario', age:18}
 *  assignDict(null, {name:'Aario'}         // {name:'Aario'}
 */
export function assignDict<T = Dict>(target: T | undefined, ...sources: (KV | undefined)[]): T {
    if (!target) {
        target = {} as T
    }
    return assign(target as any, ...sources)
}


/**
 *  Fills non-existing properties in a target KV object with default values
 *
 * @example
 *  fillObjects({}, defaults.headers.POST, defaults.headers.common)
 */
export function fill<T extends KV = KV>(target: T, ...defaults: (KV | undefined)[]): T {
    if (!target) {
        throw Err_MissingArgument
    }
    const n = defaults.length
    if (n === 0) {
        return target
    }
    for (let i = 0; i < n; i++) {
        forEach(defaults[i], (defaultValue, key) => {
            const value = getKV(target, key)
            if (!isMeaningful(value)) {
                setKV(target, key, defaultValue)
            }
        })
    }
    return target
}

/**
 * Fills non-existing properties in a target KV object with default values
 *
 * @example
 *  fillDict({}, defaults.headers.POST, defaults.headers.common)
 */
export function fillDict<V = unknown, T = Dict<V>>(target: T | undefined, ...defaults: (KV | undefined)[]): T {
    if (!target) {
        target = {} as T
    }
    return fill(target as any, ...defaults)
}

/**
 * Fills existing properties in a default KV object with values from a source KV object
 *
 * @example
 *  fillIn({a:1,b:2}, {a:100,c:200})       //  {a:100, b:2}
 *  fillIn(new SearchParams({a:1,b:2}), {a:100,c:200})       //  SearchParams({a:100, b:2})
 */
export function fillIn<T extends KV = KV>(defaults: T, source: KV | undefined): T {
    if (!defaults) {
        throw Err_MissingArgument
    }
    if (!source) {
        return defaults
    }
    forEach(defaults, (old, key) => {
        const sourceValue = getKV(source, key)
        if (isMeaningful(sourceValue)) {
            setKV(defaults, key, syncType(sourceValue, old))
        }
    })
    return defaults
}

/**
 * Fills existing properties in a default KV object with values from a source KV object and non-existing properties to its zero value
 *
 * @example
 *  refillIn({a:1,b:2n}, {a:100,c:200})       //  {a:100, b:0n}
 *  refillIn(new SearchParams({a:1,b:'2'}), {a:100,c:200})       //  SearchParams({a:100, b:''})
 */
export function refillIn<T extends KV = KV>(defaults: T, source: KV | undefined): T {
    if (!defaults) {
        throw Err_MissingArgument
    }
    if (!source) {
        return defaults
    }
    forEach(defaults, (old, key) => {
        const sourceValue = getKV(source, key)
        if (isMeaningful(sourceValue)) {
            setKV(defaults, key, syncType(sourceValue, old))
        } else {
            setKV(defaults, key, zeroize(old))
        }
    })
    return defaults
}

/**
 * Deeply unions two objects recursively
 *
 * @example
 *  union({a:100, b:200}, {b:1, c:2})                       // {a:100, b:1, c:2}
 *  union({a:{aa:{aaa:1}}}, {a:{aa:{bbb:2}, ab:2}})         // {a:{aa:{aaa:1, bbb:2}, ab:2}}
 *  union({a:[100]}, {a:[200]})                             // {a:[100, 200]}
 *  union({a:[100]}, {a:[200]}, false)                      // {a:[200]}
 */
export function union<T extends KV = KV>(base: T, partial: T, unionArrays: boolean = true): T {
    if (!base || Object.keys(base).length === 0) {
        return partial
    }

    forEach(partial, (value, key) => {
        if (!isMeaningful(base[key]) || !isMeaningful(value)) {
            base[key] = value
            return CONTINUE
        }

        if (typeof value !== 'object') {
            base[key] = value
        } else if (Array.isArray(value)) {
            if (!unionArrays) {
                base[key] = value
            } else {
                if (!Array.isArray(base[key])) {
                    throw new TypeError(`cannot merge array with non-array value at key '${key}'`);
                }
                base[key] = [...base[key], ...value]
            }
        } else {
            base[key] = union(base[key] as Dict, value as Dict)
        }
    })

    return base
}