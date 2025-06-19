import {describe, expect, test} from '@jest/globals';
import {
    array_t,
    atypeAlias,
    bigint_t,
    bool_t,
    class_t,
    date_t,
    detectAtype,
    detectAtypeAlias,
    dict_t,
    function_t,
    map_t,
    null_t,
    number_t,
    objectAtype,
    regexp_t,
    set_t,
    string_t,
    undefined_t
} from "./t_atype";
import {isZil} from './type_check'

describe('objectAtype', () => {
    test('objectAtype null', () => {
        expect(objectAtype(null)).toBe(null_t)
    })

    test('objectAtype new Date()', () => {
        expect(objectAtype(new Date())).toBe(date_t)
    })

    test('objectAtype new Map()', () => {
        expect(objectAtype(new Map())).toBe(map_t)
    })

    test('objectAtype new Set()', () => {
        expect(objectAtype(new Set())).toBe(set_t)
    })

    test('objectAtype {a: 1, b: 2n}', () => {
        expect(objectAtype({a: 1, b: 2n})).toBe(dict_t)
    })
})

describe('atype', () => {
    test('atype', () => {
        expect(detectAtype([1, "2", 3])).toBe(array_t)
        expect(detectAtype(1n)).toBe(bigint_t)
        expect(detectAtype(true)).toBe(bool_t)

        class A {
        }

        expect(detectAtype(A)).toBe(class_t)
        expect(detectAtype(new A())).toBe(undefined_t)

        function f() {
        }

        expect(detectAtype(f)).toBe(function_t)

        expect(detectAtype("str")).toBe(string_t)
        expect(detectAtype(new RegExp(/^\d+$/))).toBe(regexp_t)
        expect(detectAtype(undefined)).toBe(undefined_t)
        expect(detectAtype(null)).toBe(null_t)
        expect(detectAtype(Date)).toBe(function_t)
        expect(detectAtype(new Date())).toBe(date_t)
        expect(detectAtype(new Map())).toBe(map_t)
        expect(detectAtype(new Set())).toBe(set_t)
        expect(detectAtype({a: 1, b: 2n})).toBe(dict_t)
    })

    test('detectAtypeAlias', () => {
        expect(detectAtypeAlias([])).toEqual([array_t, atypeAlias(array_t)])
        expect(detectAtypeAlias(true)).toEqual([bool_t, atypeAlias(bool_t)])
        expect(detectAtypeAlias(false)).toEqual([bool_t, atypeAlias(bool_t)])

        class A {
        }

        expect(detectAtypeAlias(A)).toEqual([class_t, atypeAlias(class_t)])
        expect(detectAtypeAlias(Date)).toEqual([function_t, atypeAlias(function_t)])
        expect(detectAtypeAlias(new Date())).toEqual([date_t, atypeAlias(date_t)])
        expect(detectAtypeAlias({})).toEqual([dict_t, atypeAlias(dict_t)])
        expect(detectAtypeAlias(0)).toEqual([number_t, atypeAlias(number_t)])

        function f() {
        }

        expect(detectAtypeAlias(f)).toEqual([function_t, atypeAlias(function_t)])
        expect(detectAtypeAlias(null)).toEqual([null_t, atypeAlias(null_t)])
        expect(detectAtypeAlias(new Map())).toEqual([map_t, atypeAlias(map_t)])
        expect(detectAtypeAlias(1n)).toEqual([bigint_t, atypeAlias(bigint_t)])
        expect(detectAtypeAlias(new RegExp(/^\d+$/ig))).toEqual([regexp_t, atypeAlias(regexp_t)])
        expect(detectAtypeAlias('')).toEqual([string_t, atypeAlias(string_t)])
        expect(detectAtypeAlias('string')).toEqual([string_t, atypeAlias(string_t)])
        expect(detectAtypeAlias(new Set())).toEqual([set_t, atypeAlias(set_t)])
        expect(detectAtypeAlias(undefined)).toEqual([undefined_t, atypeAlias(undefined_t)])
    })
})

describe('isZil', () => {
    test('isZil 0', () => {
        expect(isZil(0)).toBe(true)
    })
    test('isZil 0.0', () => {
        expect(isZil(0.0)).toBe(true)
    })
    test('isZil null', () => {
        expect(isZil(null)).toBe(true)
    })
    test('isZil undefined', () => {
        expect(isZil(undefined)).toBe(true)
    })
    test('isZil ""', () => {
        expect(isZil('')).toBe(true)
    })
    test('isZil []', () => {
        expect(isZil([])).toBe(true)
    })
    test('isZil {}', () => {
        expect(isZil({})).toBe(true)
    })
    test('isZil [0]', () => {
        expect(isZil([0])).toBe(false)
    })
    test('isZil {"A":false}', () => {
        expect(isZil({"A": false})).toBe(false)
    })
    test('isZil false', () => {
        expect(isZil(false)).toBe(true)
    })
    test('isZil true', () => {
        expect(isZil(true)).toBe(false)
    })
    test('isZil 1', () => {
        expect(isZil(1)).toBe(false)
    })
})

