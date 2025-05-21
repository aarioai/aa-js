import {describe, expect, test} from '@jest/globals'
import {a_weekday} from './t_basic_server'
import {Friday, InvalidWeekday, Monday, Saturday, Thursday} from './const_server'

describe('basic server type converters', () => {

    test('a_weekday', () => {
        expect(a_weekday(Friday)).toBe(Friday)
        expect(a_weekday(String(Friday))).toBe(Friday)
        expect(a_weekday('')).toBe(InvalidWeekday)
        expect(a_weekday('mon')).toBe(Monday)
        expect(a_weekday('Th.')).toBe(Thursday)
        expect(a_weekday('SAT')).toBe(Saturday)
    })
})