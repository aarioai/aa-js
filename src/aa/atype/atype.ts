// a nil function
export const Nif = () => undefined

// a nil promise
export const Nip = new Promise(Nif)

export const MinInt32 = -2147483648
export const MaxInt32 = 2147483647
export const MinInt24 = -8388608
export const MaxInt24 = 8388607
export const MinInt16 = -32768
export const MaxInt16 = 32767
export const MinInt8 = -128
export const MaxInt8 = 127
export const MaxUint32 = 4294967295
export const MaxUint24 = 16777215
export const MaxUint16 = 65535
export const MaxUint8 = 255

export const t_array = 'array'
export const t_bigint = 'bigint'
export const t_boolean = 'boolean'
export const t_class = 'class'  // new XXX()
export const t_date = 'date'
export const t_dict= 'dict'  // {}
export const t_node = 'node'
export const t_nodelist = 'nodelist'
export const t_function = 'function'
export const t_null = 'null'
export const t_number = 'number'
export const t_map = 'map'   // new Map()
export const t_set = 'set'  // new Set()
export const t_string = 'string'
export const t_undefined = 'undefined'
export const t_regexp = 'regexp'

export type Atype  = 'array' | 'bigint' | 'boolean' | 'class'|'date' |'dict'| 'node'|'nodelist'| 'function'|'null' | 'number' | 'map' |  'set'|'string' | 'undefined' | 'regexp'

export const TypeAlias = {
    'array'    : 'a',
    'boolean'  : 'b',
    'class'    : 'c',
    'date'     : 'd',
    'dict':'e',
    'number'   : 'i',
    'function' : 'f',
    'null'     : 'l',
    'map'      : 'm',
    'bigint'   : 'n',
    'node'      : 'p',
    'nodelist':'q',
    'regexp'   : 'r',
    'string'   : 's',
    'set':'t',
    'undefined': 'u',

    '_serializable': 'z'         // 特殊类，可以序列化为JSON字符串，并且将字符串对应的JSON作为构造参数，自动还原
}



export function objectAtype(v :object):Atype{
    if (v===null) {
        return t_null
    }
    if(Array.isArray(v)){
        return t_array
    }
    if(isJQueryDom(v)){
        return t_node
    }
    let c = v.constructor?.name?.toLowerCase() ?? ''
    if(c ==="nodelist"){
        return t_nodelist
    }
    // html element
    if (c.startsWith('html')) {
        return t_node
    }

    switch (c) {
        case 'date': return t_date
        case 'regexp': return t_regexp
        case 'map': return t_map
        case 'set': return t_set
        case 'object': return t_dict
    }
    return v.constructor !== Object && c !== "object" ? t_class: t_undefined
}

export function atype(v :any):Atype{
    if(v ===null){
        return t_null
    }
    if (v===undefined){
        return t_undefined
    }

    const t = typeof v
    switch (t) {
        case t_boolean: return t_boolean
        case t_bigint: return t_bigint
        case t_function: return t_function
        case t_number: return t_number
        case t_string: return t_string
    }

    return typeof v === "object" ? objectAtype(v) : t_undefined
}

export function isJQueryDom(value:object) : boolean {
    return  value !== null &&
        'jquery' in value &&
        !!value.jquery &&
        (value as any).length > 0;
}

export function isDict(v:any):boolean {
    return typeof v ==='object' && objectAtype(v) === t_dict
}

/**
 * Is node or node list
 * @param v
 */
export function isDOM(v:any):boolean {
    if(typeof v !=='object'){
        return false
    }
    const t = objectAtype(v)
    return t=== t_nodelist || t ===t_node
}

export function isNode(v:any):boolean {
    return typeof v ==='object' && objectAtype(v) === t_node
}

export function isNodelist(v:any):boolean {
    return typeof v ==='object' && objectAtype(v) === t_nodelist
}

/**
 * Is the value a zero value
 */
export function isZil(value:any):boolean {
    if (value === undefined || value === null || value === '' || value ===0) {
        return true
    }

    if(typeof value ==='boolean'){
        return !value
    }
    if(Array.isArray(value)) {
        return value.length ===0
    }

    return typeof value ==='object' && Object.keys(value).length === 0
}


export function atypeAlias(t:any):string|any{
    if (typeof t === 'undefined') {
        return TypeAlias.undefined
    }
    if (t === null) {
        return TypeAlias.null
    }
    if (typeof t !== 'string' || t !== t_string) {
        t = atype(t)
    }
    return TypeAlias[t]
}

