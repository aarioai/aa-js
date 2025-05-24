import {describe, expect, test} from '@jest/globals'
import {a_weekday} from './t_basic_server'
import {FRIDAY, INVALID_WEEKDAY, MONDAY, SATURDAY, THURSDAY} from './a_define_enums'

describe('basic server type converters', () => {

    test('a_weekday', () => {
        expect(a_weekday(FRIDAY)).toBe(FRIDAY)
        expect(a_weekday(String(FRIDAY))).toBe(FRIDAY)
        expect(a_weekday('')).toBe(INVALID_WEEKDAY)
        expect(a_weekday('mon')).toBe(MONDAY)
        expect(a_weekday('Th.')).toBe(THURSDAY)
        expect(a_weekday('SAT')).toBe(SATURDAY)
    })
})