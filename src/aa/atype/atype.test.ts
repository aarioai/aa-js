import {describe, expect, test} from '@jest/globals';
import {
    array_t,
    atypeAlias,
    AtypeAlias,
    bigint_t,
    bool_t,
    class_t,
    date_t,
    detectAtype,
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

    test('atypeAlias', () => {
        expect(atypeAlias([])).toBe(AtypeAlias[array_t])
        expect(atypeAlias(true)).toBe(AtypeAlias[bool_t])
        expect(atypeAlias(false)).toBe(AtypeAlias[bool_t])

        class A {
        }

        expect(atypeAlias(A)).toBe(AtypeAlias[class_t])
        expect(atypeAlias(Date)).toBe(AtypeAlias[function_t])
        expect(atypeAlias(new Date())).toBe(AtypeAlias[date_t])
        expect(atypeAlias({})).toBe(AtypeAlias[dict_t])
        expect(atypeAlias(0)).toBe(AtypeAlias[number_t])

        function f() {
        }

        expect(atypeAlias(f)).toBe(AtypeAlias[function_t])
        expect(atypeAlias(null)).toBe(AtypeAlias[null_t])
        expect(atypeAlias(new Map())).toBe(AtypeAlias[map_t])
        expect(atypeAlias(1n)).toBe(AtypeAlias[bigint_t])
        expect(atypeAlias(new RegExp(/^\d+$/ig))).toBe(AtypeAlias[regexp_t])
        expect(atypeAlias('')).toBe(AtypeAlias[string_t])
        expect(atypeAlias('string')).toBe(AtypeAlias[string_t])
        expect(atypeAlias(new Set())).toBe(AtypeAlias[set_t])
        expect(atypeAlias(undefined)).toBe(AtypeAlias[undefined_t])
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

