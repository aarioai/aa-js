import {MapObject} from '../../aa/atype/a_define_interfaces'
import {E_MissingArgument} from '../aerror/errors'
import {KV} from './base'
import {forEach} from './iterates'
import {isMeaningfulValue} from './base_func'
import {getKV, setKV} from './kv'
import {coerceType, zeroize} from '../../aa/atype/t_basic'

/**
 * Safely assigns from a source KV object to a target map object.
 *
 * @example
 *  assign({}, {name:'Aario'}           // {name:'Aario'}
 *  assign({age:18}, undefined)         // {age:18}
 *  assign({age:18}, {name:'Aario'})    // {name:'Aario', age:18}
 *  assign(null, {name:'Aario'}         // {name:'Aario'}
 */
export function assign<T = MapObject>(target: T | undefined, source: KV | undefined): T {
    if (!target) {
        target = {} as T
    }
    if (!source) {
        return target
    }
    forEach(source, (value, key) => {
        if (isMeaningfulValue(value)) {
            target[key] = value
        }
    })
    return target
}

/**
 * Merges from a source KV object to a target KV object
 *
 * @example
 *  merge({age:18}, undefined)                      // {name:'Aario'}
 *  merge({age:18}, {name:'Aario'})                 // {name:'Aario', age:18}
 *  merge(new Map([['age', 18]]), {name:'Aario'})   // {name:'Aario', age:18}
 */
export function merge<T extends KV = KV>(target: T | undefined, source: KV | undefined): T {
    if (!target) {
        throw E_MissingArgument
    }
    if (!source) {
        return target
    }
    forEach(source, (value, key) => {
        if (isMeaningfulValue(value)) {
            setKV(target, key, value)
        }
    })
    return target
}

/**
 * Fills existing properties in a target KV object with values from a source KV object
 *
 * @example
 *  fill({a:1,b:2}, {a:100,c:200})       //  {a:100, b:2}
 *  fill(new SearchParams({a:1,b:2}), {a:100,c:200})       //  SearchParams({a:100, b:2})
 */
export function fill<T extends KV = KV>(defaults: T, source: KV | undefined): T {
    if (!defaults) {
        throw E_MissingArgument
    }
    if (!source) {
        return defaults
    }
    forEach(defaults, (old, key) => {
        const sourceValue = getKV(source, key)
        if (isMeaningfulValue(sourceValue)) {
            setKV(defaults, key, coerceType(sourceValue, old))
        }
    })
    return defaults
}

/**
 * Fills existing properties in a target KV object with values from a source KV object and non-existing properties to its zero value
 *
 * @example
 *  refill({a:1,b:2n}, {a:100,c:200})       //  {a:100, b:0n}
 *  refill(new SearchParams({a:1,b:'2'}), {a:100,c:200})       //  SearchParams({a:100, b:''})
 */
export function refill<T extends KV = KV>(defaults: T, source: KV | undefined): T {
    if (!defaults) {
        throw E_MissingArgument
    }
    if (!source) {
        return defaults
    }
    forEach(defaults, (old, key) => {
        const sourceValue = getKV(source, key)
        if (isMeaningfulValue(sourceValue)) {
            setKV(defaults, key, coerceType(sourceValue, old))
        } else {
            setKV(defaults, key, zeroize(old))
        }
    })
    return defaults
}