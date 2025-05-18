import {describe, expect, test} from "@jest/globals";
import {formatNumber, trimFloat} from "./numerics";

describe('trimFloat', () => {
    test('trimFloat(1.2, 4)', () => {
        expect(trimFloat(1.2, 4)).toBe('1.2')
    })
    test('trimFloat(1.2340, 4)', () => {
        expect(trimFloat(1.2340, 4)).toBe('1.234')
    })
})


describe('formatNumber', () => {
    test('formatNumber(1234567.89, 2)', () => {
        expect(formatNumber(1234567.89, 2)).toBe('1,234,567.89')
    })
    test('formatNumber(1234567, 0, " ")', () => {
        expect(formatNumber(1234567, 0, ' ')).toBe('1 234 567')
    })
})
