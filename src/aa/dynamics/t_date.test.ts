import {describe, expect, test} from "@jest/globals";
import {DATE_PATTERN, DATETIME_PATTERN, MYSQL_MIN_DATE} from "../atype/a_server_consts";
import {a_date, tzdate} from "./t_date";
import {format} from "date-fns";


describe('tzdate', () => {

    test('tzdate t_datetime', () => {
        const s = '2025-05-18T00:01:02Z'
        let f = format(tzdate(new Date(s), 'Asia/Shanghai'), DATETIME_PATTERN)
        expect(f).toBe('2025-05-18 08:01:02')

        f = format(tzdate(new Date(s), 'Asia/Shanghai'), DATE_PATTERN)
        expect(f).toBe('2025-05-18')

        f = format(tzdate(s, 'America/New_York'), DATETIME_PATTERN)
        expect(f).toBe('2025-05-17 20:01:02')

        f = format(tzdate(s, 'America/New_York'), DATE_PATTERN)
        expect(f).toBe('2025-05-17')
    })


    test('tzdate t_datetime', () => {
        const s = '2025-05-18 16:01:01'
        let f = format(tzdate(new Date(s), 'Asia/Shanghai'), DATETIME_PATTERN)
        expect(f).toBe(s)

        f = format(tzdate(new Date(s), 'Asia/Shanghai'), DATE_PATTERN)
        expect(f).toBe('2025-05-18')


        f = format(tzdate(s, 'America/New_York'), DATETIME_PATTERN)
        expect(f).toBe('2025-05-18 04:01:01')

        f = format(tzdate(s, 'America/New_York'), DATE_PATTERN)
        expect(f).toBe('2025-05-18')
    })


    test('tzdate t_date', () => {
        const s = '2025-05-18'
        let f = format(tzdate(new Date(s), 'Asia/Shanghai'), DATE_PATTERN)
        expect(f).toBe(s)

        f = format(tzdate(s, 'America/New_York'), DATE_PATTERN)
        expect(f).toBe('2025-05-17')
    })


})
describe('cast to date/datetime', () => {
    test('a_date null', () => {
        expect(a_date(null)).toBe(MYSQL_MIN_DATE)
    })
    test('a_date undefined', () => {
        expect(a_date(undefined)).toBe(MYSQL_MIN_DATE)
    })
    test('a_date 2012-01-01', () => {
        expect(a_date('2012-01-01')).toBe('2012-01-01')
    })

    test('a_date 2012-01-01 12:00:00', () => {
        expect(a_date('2012-01-01 12:00:00')).toBe('2012-01-01')
    })

    test('a_date 2023-10-10T20:01:02.000Z', () => {
        expect(a_date('2023-10-10T20:01:02.000Z')).toBe('2023-10-11')
    })

    test('a_date Date', () => {
        expect(a_date(new Date('2023-10-10T20:01:02.000Z'))).toBe('2023-10-11')
    })
})