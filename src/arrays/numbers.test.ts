import {describe, expect, test} from "@jest/globals"
import {ComparisonOperator, findClosestValue} from "./numbers"

describe('findClosestValue', () => {
    const testValues = [10, 20, 30, 40, 50]
    const stringValues = ['10', '20', '30', '40', '50']

    describe('Equals operator (= or ==)', () => {
        test('returns exact match when available', () => {
            expect(findClosestValue(testValues, '=', 30)).toBe(30)
            expect(findClosestValue(stringValues, '==', '30')).toBe(30)
        })

        test('returns closest value when no exact match', () => {
            expect(findClosestValue(testValues, '=', 27)).toBe(30) // Closer to 30 than 20
            expect(findClosestValue(testValues, '=', 23)).toBe(20) // Closer to 20 than 30
        })

        test('handles edge values', () => {
            expect(findClosestValue(testValues, '=', 5)).toBe(10)  // Below range
            expect(findClosestValue(testValues, '=', 55)).toBe(50) // Above range
        })
    })

    describe('Less than operator (<)', () => {
        test('returns largest value less than target', () => {
            expect(findClosestValue(testValues, '<', 30)).toBe(20)
            expect(findClosestValue(stringValues, '<', '35')).toBe(30)
        })

        test('throws error when no value is less than target', () => {
            expect(() => findClosestValue(testValues, '<', 5)).toThrow('No value less than target')
        })
    })

    describe('Less than or equal operator (<=)', () => {
        test('returns largest value <= target', () => {
            expect(findClosestValue(testValues, '<=', 30)).toBe(30)
            expect(findClosestValue(testValues, '<=', 25)).toBe(20)
        })

        test('throws error when no value <= target', () => {
            expect(() => findClosestValue(testValues, '<=', 5)).toThrow('No value less than or equal to target')
        })
    })

    describe('Greater than operator (>)', () => {
        test('returns smallest value > target', () => {
            expect(findClosestValue(testValues, '>', 30)).toBe(40)
            expect(findClosestValue(stringValues, '>', '25')).toBe(30)
        })

        test('throws error when no value > target', () => {
            expect(() => findClosestValue(testValues, '>', 55)).toThrow('No value greater than target')
        })
    })

    describe('Greater than or equal operator (>=)', () => {
        test('returns smallest value >= target', () => {
            expect(findClosestValue(testValues, '>=', 30)).toBe(30)
            expect(findClosestValue(testValues, '>=', 35)).toBe(40)
        })

        test('throws error when no value >= target', () => {
            expect(() => findClosestValue(testValues, '>=', 55)).toThrow('No value greater than or equal to target')
        })
    })

    describe('Edge cases', () => {
        test('handles single value array', () => {
            expect(findClosestValue([10], '=', 15)).toBe(10)
            expect(findClosestValue(['10'], '>=', 5)).toBe(10)
        })

        test('throws error for empty array', () => {
            expect(() => findClosestValue([], '=', 10)).toThrow()
        })

        test('handles non-numeric strings by ignoring them', () => {
            const mixedValues = [10, 'twenty', 30, '40px', 50]
            expect(findClosestValue(mixedValues, '=', 35)).toBe(30)
        })

        test('handles negative numbers', () => {
            const negativeValues = [-50, -20, 0, 10]
            expect(findClosestValue(negativeValues, '>', -30)).toBe(-20)
            expect(findClosestValue(negativeValues, '=', -15)).toBe(-20)
        })
    })

    describe('Invalid operators', () => {
        test('throws error for invalid operator', () => {
            expect(() => findClosestValue(testValues, '!=' as ComparisonOperator, 30))
                .toThrow('Invalid operator: !=')
        })
    })
})