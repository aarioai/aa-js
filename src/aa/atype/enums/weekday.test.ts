import {describe, expect, test} from '@jest/globals'
import {a_weekday, Weekday} from './weekday'

describe('basic server type converters', () => {

    test('a_weekday', () => {
        expect(a_weekday(Weekday.FRIDAY)).toBe(Weekday.FRIDAY)
        expect(a_weekday(String(Weekday.FRIDAY))).toBe(Weekday.FRIDAY)
        expect(a_weekday('')).toBe(Weekday.NO_WEEKDAY)
        expect(a_weekday('mon')).toBe(Weekday.MONDAY)
        expect(a_weekday('Th.')).toBe(Weekday.THURSDAY)
        expect(a_weekday('SAT')).toBe(Weekday.SATURDAY)
    })
})