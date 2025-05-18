import {describe, expect, test} from "@jest/globals"
import {concat, concatInType, contains, generateArray} from "./array"
import {a_string, uint8} from "../aa/atype/type_cast"

describe('concat', () => {
    test('concat([1, 2], [3, 4])', () => {
        expect(concat([1, 2], [3, 4])).toEqual([1, 2, 3, 4])
    })

    test('concat([], [1, 2], [])', () => {
        expect(concat([], [1, 2], [])).toEqual([1, 2])
    })

    test('concat([1], null, undefined, [2])', () => {
        expect(concat([1], null, undefined, [2])).toEqual([1, 2])
    })

    test('concat(null, undefined)', () => {
        expect(concat(null, undefined)).toEqual([])
    })

    test("concat(['a'], [1], [true])", () => {
        expect(concat(['a'], [1], [true])).toEqual(['a', 1, true])
    })

    test('concat([1], [2, 3], [4])', () => {
        expect(concat([1], [2, 3], [4])).toEqual([1, 2, 3, 4])
    })

    test('works with sparse arrays', () => {
        const sparse = [1]
        sparse[3] = 4
        expect(concat(sparse, [5])).toEqual([1, undefined, undefined, 4, 5])
    })

    test('handles large arrays', () => {
        const bigArray = new Array(10000).fill(1)
        expect(concat(bigArray, [2]).length).toBe(10001)
    })

    test('returns new array without mutating inputs', () => {
        const arr1 = [1]
        const arr2 = [2]
        const result = concat(arr1, arr2)
        expect(result).toEqual([1, 2])
        expect(result).not.toBe(arr1)
        expect(arr1).toEqual([1])
        expect(arr2).toEqual([2])
    })

    test('handles array-like objects', () => {
        const arrayLike = {0: 'a', 1: 'b', length: 2}
        expect(concat(['x'], Array.from(arrayLike))).toEqual(['x', 'a', 'b'])
    })
})

describe('concatInType', () => {
    test('concatInType(uint8, [1, "2"], ["3", 4])', () => {
        expect(concatInType(uint8, [1, '2'], ['3', 4])).toEqual([1, 2, 3, 4])
    })
    test('concatInType(a_string, [1, "2"], ["3", 4])', () => {
        expect(concatInType(a_string, [1, '2'], ['3', 4])).toEqual(['1', '2', '3', '4'])
    })
})


describe('contains', () => {
    test('contains([1,2,3], "1")', () => {
        expect(contains([1, 2, 3], 1)).toBe(true)
    })
    test("contains([/apple/i, 'money'], 'Apple')", () => {
        expect(contains([/apple/i, 'money'], 'Apple')).toBe(true)
    })
    test("contains([/apple/i, 'money'], 'orange')", () => {
        expect(contains([/apple/i, 'money'], 'orange')).toBe(false)
    })
})


describe('generateArray', () => {
    test('generateArray(3, "a")', () => {
        expect(generateArray(3, 'a')).toEqual(['a', 'a', 'a'])
    })
    test('generateArray(5, 1, v => v * 2)', () => {
        expect(generateArray(5, 1, v => v * 2)).toEqual([1, 2, 4, 8, 16])
    })
    test('generateArray(0, "x")', () => {
        expect(generateArray(0, "x")).toEqual([])
    })
})