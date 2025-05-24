import {describe, expect, test} from '@jest/globals'
import {isSafeInt} from './type_check'

describe('isSafeInt', () => {
    test('should return true for short numbers', () => {
        expect(isSafeInt('123')).toBe(true)
        expect(isSafeInt('-42')).toBe(true)
        expect(isSafeInt('900719925474099')).toBe(true) // length 15
    })

    test('should handle boundary values', () => {
        expect(isSafeInt('9007199254740991')).toBe(false) // MAX_SAFE_INTEGER > APX_MAX_SAFE_INT
        expect(isSafeInt('-9007199254740991')).toBe(false) // MIN_SAFE_INTEGER < APX_MIN_SAFE_INT
        expect(isSafeInt('9000999999999999')).toBe(true) // APX_MAX_SAFE_INT
        expect(isSafeInt('-9000999999999999')).toBe(true) // APX_MIN_SAFE_INT
    })

    test('should reject too long numbers', () => {
        expect(isSafeInt('12345678901234567890')).toBe(false)
        expect(isSafeInt('-12345678901234567890')).toBe(false)
    })

    test('should handle numbers starting with 9 but safe', () => {
        expect(isSafeInt('9234567890123456')).toBe(false)   //  (within [-9000999999999999, 9000999999999999] bounds)
        expect(isSafeInt('-9234567890123456')).toBe(false)
    })
})