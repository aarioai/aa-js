import {DATE_PATTERN, DATETIME_PATTERN, ZERO_DATE, ZERO_DATETIME} from "../atype/a_server_consts"
import aconfig from "../aconfig/aconfig"
import {TZDate} from "@date-fns/tz"
import {format} from "date-fns";
import {t_date, t_datetime, t_timestamp} from '../atype/a_define'


export function isZeroDate(s: string | t_timestamp): boolean {
    if (!s) {
        return true
    }


    if (aconfig.enableZeroDate) {
        if (s === ZERO_DATE || s === ZERO_DATETIME) {
            return true
        }
    }
    return s === aconfig.minDate || s == aconfig.minDatetime
}


export function tzdate(s: string | t_timestamp | Date | TZDate, timezone?: string): TZDate {
    if (!s) {
        return null
    }
    if (!timezone) {
        timezone = aconfig.timezone
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
    if (!s || (typeof s === 'string' && isZeroDate(s))) {
        return aconfig.minDate
    }

    try {
        const d = tzdate(s, timezone)
        if (!d) {
            return aconfig.minDate
        }
        return format(d, DATE_PATTERN)
    } catch (err) {
        console.error(`Unable to parse date ${s}`, err)
    }
    return aconfig.minDate
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
        return aconfig.minDatetime
    }
    try {
        const d = tzdate(s, timezone)
        if (!d) {
            return aconfig.minDatetime
        }
        return format(d, DATETIME_PATTERN)
    } catch (err) {
        console.error(`Unable to parse datetime ${s}`, err)
    }
    return aconfig.minDatetime
}