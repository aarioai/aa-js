import {describe, expect, test} from '@jest/globals';
import {
    atype,
    atypeAlias,
    isZil,
    objectAtype,
    t_array,
    t_bigint,
    t_boolean,
    t_class,
    t_date,
    t_dict,
    t_function,
    t_map,
    t_null,
    t_number,
    t_regexp,
    t_set,
    t_string,
    t_undefined,
    TypeAlias
} from "./atype";

describe('objectAtype', ()=>{
    test('objectAtype null', ()=>{
        expect(objectAtype(null)).toBe(t_null)
    })

    test('objectAtype new Date()', ()=>{
        expect(objectAtype(new Date())).toBe(t_date)
    })

    test('objectAtype new Map()', ()=>{
        expect(objectAtype(new Map())).toBe(t_map)
    })

    test('objectAtype new Set()', ()=>{
        expect(objectAtype(new Set())).toBe(t_set)
    })

    test('objectAtype {a: 1, b: 2n}', ()=>{
        expect(objectAtype({a: 1, b: 2n})).toBe(t_dict)
    })
})

describe('atype', ()=>{
    test('atype [1, "2", 3]', ()=>{
        expect(atype([1, "2", 3])).toBe(t_array)
    })

    test('atype 1n', ()=>{
        expect(atype(1n)).toBe(t_bigint)
    })

    test('atype true', ()=>{
        expect(atype(true)).toBe(t_boolean)
    })

    test('atype A{}', ()=>{
        class A{}
        expect(atype(new A())).toBe(t_class)
    })

    test('atype f()', ()=>{
        function f(){}
        expect(atype(f)).toBe(t_function)
    })

    test('atype str', ()=>{
        expect(atype("str")).toBe(t_string)
    })

    test('atype regexp', ()=>{
        expect(atype(new RegExp(/^\d+$/))).toBe(t_regexp)
    })

    test('atype undefined', ()=>{
        expect(atype(undefined)).toBe(t_undefined)
    })

    test('atype null', ()=>{
        expect(atype(null)).toBe(t_null)
    })

    test('atype new Date()', ()=>{
        expect(atype(new Date())).toBe(t_date)
    })

    test('atype new Map()', ()=>{
        expect(atype(new Map())).toBe(t_map)
    })

    test('atype new Set()', ()=>{
        expect(atype(new Set())).toBe(t_set)
    })

    test('atype {a: 1, b: 2n}', ()=>{
        expect(atype({a: 1, b: 2n})).toBe(t_dict)
    })
})

describe('isZil', ()=>{
    test('isZil 0', ()=>{
        expect(isZil(0)).toBe(true)
    })
    test('isZil 0.0', ()=>{
        expect(isZil(0.0)).toBe(true)
    })
    test('isZil null', ()=>{
        expect(isZil(null)).toBe(true)
    })
    test('isZil undefined', ()=>{
        expect(isZil(undefined)).toBe(true)
    })
    test('isZil ""', ()=>{
        expect(isZil('')).toBe(true)
    })
    test('isZil []', ()=>{
        expect(isZil([])).toBe(true)
    })
    test('isZil {}', ()=>{
        expect(isZil({})).toBe(true)
    })
    test('isZil [0]', ()=>{
        expect(isZil( [0])).toBe(false)
    })
    test('isZil {"A":false}', ()=>{
        expect(isZil({"A":false})).toBe(false)
    })
    test('isZil false', ()=>{
        expect(isZil(false)).toBe(true)
    })
    test('isZil true', ()=>{
        expect(isZil(true)).toBe(false)
    })
    test('isZil 1', ()=>{
        expect(isZil(1)).toBe(false)
    })
})


describe('atypeAlias', ()=>{
    test('atypeAlias []', ()=>{
        expect(atypeAlias([])).toBe(TypeAlias[t_array])
    })
    test('atypeAlias true', ()=>{
        expect(atypeAlias(true)).toBe(TypeAlias[t_boolean])
    })
    test('atypeAlias false', ()=>{
        expect(atypeAlias(false)).toBe(TypeAlias[t_boolean])
    })
    test('atypeAlias A{}', ()=>{
        class A{}
        expect(atypeAlias(new A())).toBe(TypeAlias[t_class])
    })
    test('atypeAlias new Date()', ()=>{
        expect(atypeAlias(new Date())).toBe(TypeAlias[t_date])
    })
    test('atypeAlias {}', ()=>{
        expect(atypeAlias({})).toBe(TypeAlias[t_dict])
    })

    test('atypeAlias 0', ()=>{
        expect(atypeAlias(0)).toBe(TypeAlias[t_number])
    })
    test('atypeAlias fn()', ()=>{
        function f(){}
        expect(atypeAlias(f)).toBe(TypeAlias[t_function])
    })
    test('atypeAlias null', ()=>{
        expect(atypeAlias(null)).toBe(TypeAlias[t_null])
    })

    test('atypeAlias new Map()', ()=>{
        expect(atypeAlias(new Map())).toBe(TypeAlias[t_map])
    })
    test('atypeAlias 1n', ()=>{
        expect(atypeAlias(1n)).toBe(TypeAlias[t_bigint])
    })
    test('atypeAlias new RegExp', ()=>{
        expect(atypeAlias(new RegExp(/^\d+$/ig))).toBe(TypeAlias[t_regexp])
    })
    test('atypeAlias ""', ()=>{
        expect(atypeAlias('')).toBe(TypeAlias[t_string])
    })
    test('atypeAlias string', ()=>{
        expect(atypeAlias('string')).toBe(TypeAlias[t_string])
    })
    test('atypeAlias new Set()', ()=>{
        expect(atypeAlias(new Set())).toBe(TypeAlias[t_set])
    })
    test('atypeAlias undefined', ()=>{
        expect(atypeAlias(undefined)).toBe(TypeAlias[t_undefined])
    })
})