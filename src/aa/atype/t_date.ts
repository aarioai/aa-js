import {uint16, uint24} from "./t_basic"
import {DatePattern, DatetimePattern, MinDate, MinDatetime} from "./const_server"
import {AConfig} from "../env/aconfig"
import {TZDate} from "@date-fns/tz"
import {format} from "date-fns";
import {t_date, t_datetime, t_dist, t_distri, t_timestamp} from './a_define_server'

export function a_distri(n: number): t_distri {
    return uint24(n)
}

export function a_dist(n: number): t_dist {
    return uint16(n)
}


export function tzdate(s: string | t_timestamp | Date | TZDate, timezone?: string): TZDate | null {
    if (!s) {
        return null
    }
    if (!timezone) {
        timezone = AConfig.timezone
    }
    if (s instanceof TZDate) {
        return s.withTimeZone(timezone)
    }

    if (s instanceof Date) {
        return new TZDate(s, timezone)
    }
    if (typeof s === 'number') {
        return new TZDate(s, timezone)  // timestamp
    }
    return new TZDate(s, timezone)
}

/**
 *  Converts date string, datetime string, unix timestamp, Date to t_date type
 *
 * @example
 *  a_date('2012-01-01') // 2012-01-01
 *  a_date('2012-01-01 12:00:00') // 2012-01-01
 *  a_date('2023-10-10T00:00:00.000Z') // 2023-10-10
 *  a_date(new Date('2012-01-01 12:00:00')) // 2012-01-01
 */
export function a_date(s: string | t_timestamp | Date | TZDate, timezone?: string): t_date {
    if (!s) {
        return MinDate
    }

    try {
        const d = tzdate(s, timezone)
        if (!d) {
            return MinDate
        }
        return format(d, DatePattern)
    } catch (err) {
        console.error(`Unable to parse date ${s}`, err)
    }
    return MinDate
}

/**
 *  Converts date string, datetime string, unix timestamp, Date to t_datetime type
 *
 * @example
 *  a_datetime('2012-01-01') // 2012-01-01 00:00:00
 *  a_datetime('2012-01-01 12:00:00') // 2012-01-01 12:00:00
 *  a_datetime('2023-10-10T00:00:00.000Z') // 2023-10-10 00:00:00
 *  a_datetime(new Date('2012-01-01 12:00:00')) // 2012-01-01 12:00:00
 */
export function a_datetime(s: string | t_timestamp | Date, timezone?: string): t_datetime {
    if (!s) {
        return MinDatetime
    }
    try {
        const d = tzdate(s, timezone)
        if (!d) {
            return MinDatetime
        }
        return format(d, DatetimePattern)
    } catch (err) {
        console.error(`Unable to parse datetime ${s}`, err)
    }
    return MinDatetime
}