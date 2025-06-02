import {a_array, a_bool, a_number, a_string} from '../atype/t_basic'
import {
    array_t,
    bigint_t,
    bool_t,
    class_t,
    date_t,
    dict_t,
    function_t,
    isAtype,
    map_t,
    node_t,
    nodelist_t,
    null_t,
    number_t,
    regexp_t,
    serializable_t,
    set_t,
    string_t,
    symbol_t,
    t_atype,
    undefined_t
} from '../atype/t_atype'
import {SERIALIZE_SEPARATOR} from '../atype/a_define_consts'
import Serializable from '../atype/a_define_interfaces'
import {invokeStaticMethod} from '../calls/hack'
import json from '../atype/json'


export function deserialize(s: string): Serializable {
    const [className, serial] = s.split(SERIALIZE_SEPARATOR)
    if (!className) {
        return null
    }
    return invokeStaticMethod(className, 'serialize', serial)
}

export function atypeize(value: unknown, type: t_atype): unknown {
    if (!isAtype(type)) {
        return value
    }
    switch (type) {
        case array_t:
            return typeof value === 'string' ? json.Unmarshal(value) : a_array(value as any)
        case bigint_t:
            return BigInt(value as any)
        case bool_t:
            return a_bool(value as any)
        case class_t:
            return value
        case date_t:
            return value instanceof Date ? value : new Date(value as any)
        case function_t:
            return value
        case map_t:
            return value instanceof Map ? value : new Map(value as any)
        case dict_t:
            return typeof value === 'string' ? json.Unmarshal(value) : value
        case node_t:
            return value
        case nodelist_t:
            return value
        case null_t:
            return null
        case number_t:
            return a_number(value as any)
        case serializable_t:
            return typeof value === 'string' ? deserialize(value) : value
        case set_t:
            return value instanceof Set ? value : new Set(value as any)
        case symbol_t:
            return value
        case string_t:
            return a_string(value)
        case regexp_t:
            return value instanceof RegExp ? value : new RegExp(value as any)
        case undefined_t:
            return undefined
        default:
            return value
    }
}