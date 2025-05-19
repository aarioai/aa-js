import {describe, expect, test} from '@jest/globals';
import {
    array_t,
    atype,
    atypeAlias,
    bigint_t,
    boolean_t,
    class_t,
    date_t,
    function_t,
    isZil,
    map_t,
    mapobject_t,
    null_t,
    number_t,
    objectAtype,
    regexp_t,
    set_t,
    string_t,
    TypeAlias,
    undefined_t
} from "./atype";

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
    test('atype [1, "2", 3]', () => {
        expect(atype([1, "2", 3])).toBe(array_t)
    })

    test('atype 1n', () => {
        expect(atype(1n)).toBe(bigint_t)
    })

    test('atype true', () => {
        expect(atype(true)).toBe(boolean_t)
    })

    test('atype A{}', () => {
        class A {
        }

        expect(atype(new A())).toBe(class_t)
    })

    test('atype f()', () => {
        function f() {
        }

        expect(atype(f)).toBe(function_t)
    })

    test('atype str', () => {
        expect(atype("str")).toBe(string_t)
    })

    test('atype regexp', () => {
        expect(atype(new RegExp(/^\d+$/))).toBe(regexp_t)
    })

    test('atype undefined', () => {
        expect(atype(undefined)).toBe(undefined_t)
    })

    test('atype null', () => {
        expect(atype(null)).toBe(null_t)
    })

    test('atype new Date()', () => {
        expect(atype(new Date())).toBe(date_t)
    })

    test('atype new Map()', () => {
        expect(atype(new Map())).toBe(map_t)
    })

    test('atype new Set()', () => {
        expect(atype(new Set())).toBe(set_t)
    })

    test('atype {a: 1, b: 2n}', () => {
        expect(atype({a: 1, b: 2n})).toBe(mapobject_t)
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


describe('atypeAlias', () => {
    test('atypeAlias []', () => {
        expect(atypeAlias([])).toBe(TypeAlias[array_t])
    })
    test('atypeAlias true', () => {
        expect(atypeAlias(true)).toBe(TypeAlias[boolean_t])
    })
    test('atypeAlias false', () => {
        expect(atypeAlias(false)).toBe(TypeAlias[boolean_t])
    })
    test('atypeAlias A{}', () => {
        class A {
        }

        expect(atypeAlias(new A())).toBe(TypeAlias[class_t])
    })
    test('atypeAlias new Date()', () => {
        expect(atypeAlias(new Date())).toBe(TypeAlias[date_t])
    })
    test('atypeAlias {}', () => {
        expect(atypeAlias({})).toBe(TypeAlias[mapobject_t])
    })

    test('atypeAlias 0', () => {
        expect(atypeAlias(0)).toBe(TypeAlias[number_t])
    })
    test('atypeAlias fn()', () => {
        function f() {
        }

        expect(atypeAlias(f)).toBe(TypeAlias[function_t])
    })
    test('atypeAlias null', () => {
        expect(atypeAlias(null)).toBe(TypeAlias[null_t])
    })

    test('atypeAlias new Map()', () => {
        expect(atypeAlias(new Map())).toBe(TypeAlias[map_t])
    })
    test('atypeAlias 1n', () => {
        expect(atypeAlias(1n)).toBe(TypeAlias[bigint_t])
    })
    test('atypeAlias new RegExp', () => {
        expect(atypeAlias(new RegExp(/^\d+$/ig))).toBe(TypeAlias[regexp_t])
    })
    test('atypeAlias ""', () => {
        expect(atypeAlias('')).toBe(TypeAlias[string_t])
    })
    test('atypeAlias string', () => {
        expect(atypeAlias('string')).toBe(TypeAlias[string_t])
    })
    test('atypeAlias new Set()', () => {
        expect(atypeAlias(new Set())).toBe(TypeAlias[set_t])
    })
    test('atypeAlias undefined', () => {
        expect(atypeAlias(undefined)).toBe(TypeAlias[undefined_t])
    })
})