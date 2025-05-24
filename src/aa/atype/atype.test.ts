import {describe, expect, test} from '@jest/globals';
import {
    array_t,
    atype,
    atypeAlias,
    bigint_t,
    bool_t,
    class_t,
    date_t,
    function_t,
    map_t,
    mapobject_t,
    null_t,
    number_t,
    objectAtype,
    regexp_t,
    set_t,
    string_t,
    TYPES_ALIAS,
    undefined_t
} from "./atype";
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
        expect(objectAtype({a: 1, b: 2n})).toBe(mapobject_t)
    })
})

describe('atype', () => {
    test('atype', () => {
        expect(atype([1, "2", 3])).toBe(array_t)
        expect(atype(1n)).toBe(bigint_t)
        expect(atype(true)).toBe(bool_t)

        class A {
        }

        expect(atype(A)).toBe(class_t)
        expect(atype(new A())).toBe(undefined_t)

        function f() {
        }

        expect(atype(f)).toBe(function_t)

        expect(atype("str")).toBe(string_t)
        expect(atype(new RegExp(/^\d+$/))).toBe(regexp_t)
        expect(atype(undefined)).toBe(undefined_t)
        expect(atype(null)).toBe(null_t)
        expect(atype(Date)).toBe(function_t)
        expect(atype(new Date())).toBe(date_t)
        expect(atype(new Map())).toBe(map_t)
        expect(atype(new Set())).toBe(set_t)
        expect(atype({a: 1, b: 2n})).toBe(mapobject_t)
    })

    test('atypeAlias', () => {
        expect(atypeAlias([])).toBe(TYPES_ALIAS[array_t])
        expect(atypeAlias(true)).toBe(TYPES_ALIAS[bool_t])
        expect(atypeAlias(false)).toBe(TYPES_ALIAS[bool_t])

        class A {
        }

        expect(atypeAlias(A)).toBe(TYPES_ALIAS[class_t])
        expect(atypeAlias(Date)).toBe(TYPES_ALIAS[function_t])
        expect(atypeAlias(new Date())).toBe(TYPES_ALIAS[date_t])
        expect(atypeAlias({})).toBe(TYPES_ALIAS[mapobject_t])
        expect(atypeAlias(0)).toBe(TYPES_ALIAS[number_t])

        function f() {
        }

        expect(atypeAlias(f)).toBe(TYPES_ALIAS[function_t])
        expect(atypeAlias(null)).toBe(TYPES_ALIAS[null_t])
        expect(atypeAlias(new Map())).toBe(TYPES_ALIAS[map_t])
        expect(atypeAlias(1n)).toBe(TYPES_ALIAS[bigint_t])
        expect(atypeAlias(new RegExp(/^\d+$/ig))).toBe(TYPES_ALIAS[regexp_t])
        expect(atypeAlias('')).toBe(TYPES_ALIAS[string_t])
        expect(atypeAlias('string')).toBe(TYPES_ALIAS[string_t])
        expect(atypeAlias(new Set())).toBe(TYPES_ALIAS[set_t])
        expect(atypeAlias(undefined)).toBe(TYPES_ALIAS[undefined_t])
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

