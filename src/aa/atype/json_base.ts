import {isSafeInt} from './type_check'
import type {AnyMap, Dict} from './a_define_interfaces'

export interface JsonReviverCtx {
    source: string

    [key: string]: any  // other keys
}

/**
 * @example
 *  JSON.parse('{"a":123456789101112131415161718, "b":[1,2,3]}', (key, value)=>{console.log(key, '=>', value);return value})
 *    a => 1.2345678910111214e+26
 *    '0' => 1
 *    '1' => 2
 *    '2' => 3
 *    'b' => [1 ,2, 3]
 *    '' => {a: 1.2345678910111214e+26, b: [1 ,2, 3]}
 */
export const unmarshalReviver = (key: string, value: unknown, ctx?: JsonReviverCtx): any => {
    if (!ctx || !key) {
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

export function convertJSONAny(v: unknown): unknown {
    if (!v) {
        return v
    }
    if (typeof v !== 'object') {
        return typeof v === 'bigint' ? v.toString() : v
    }
    if (Array.isArray(v)) {
        return convertJSONArray(v)
    }

    // toJSON can overwrite server-defined property `jsonkey`
    if ('toJSON' in v && typeof v.toJSON === 'function') {
        return v.toJSON()
    }

    // Server-defined property `jsonkey`,
    //  e.g. {"nation":{"code":86, "name:"China", "jsonkey":"code"}}
    //  means, server wants client send nation code {"nation":86} back, but not the whole map object
    if ('jsonkey' in v && typeof v.jsonkey === 'string' && v.jsonkey in v) {
        return convertJSONAny(v[v.jsonkey as keyof typeof v])
    }
    if (v instanceof Map) {
        return convertJSONMap(v)
    }
    return v
}

export function convertJSONArray(arr: unknown[]): unknown [] | null {
    if (!arr?.length) {
        return []
    }
    const result = []
    for (const value of arr) {
        result.push(convertJSONAny(value))
    }
    return result
}

// JSON stringify hasn't supported Map yet
export function convertJSONMap(o: AnyMap): Dict {
    if (!o) {
        return {}
    }
    const data: Dict = {}
    o.forEach((value: unknown, key: string) => {
        data[key] = convertJSONAny(value)
    })
    return data
}

/**
 * @example
 *  class A{ toJSON(){return 'AAA'}}
 *  JSON.stringify([2, 3, [55, new A()]], (key, value)=>{console.log(key, '=>', value);return value})
 *    ''  => [2, 3, [55, A]]
 *    '0' => 2
 *    '1' => 3
 *    '2' => [55, A]
 *    '0' => 55
 *    '1' => AAA
 */
export const marshalReviver = (key: string, value: unknown): any => {
    if (key === '' || !value) {
        return value
    }
    return convertJSONAny(value)
}

export class JsonMarshalError extends Error {
    constructor(msg: unknown, object?: unknown) {
        super(`json.Marshal error: ${msg}`)
        console.error('json.Marshal error: ${msg}', object)
    }
}

