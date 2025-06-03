import {a_string} from '../t_basic'

export enum Weekday {
    NO_WEEKDAY = -1,
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
}

export type t_weekday = Weekday

/**
 * Converts weekday code and English names to weekday code
 * English names (ignore cases):
 *  sunday, monday, tuesday, wednesday, thursday, friday, saturday
 *  sun., mon., tue., wed., thu., fri., sat.,
 *  sun, mon, tue, wed, thu, fri, sat,
 *  su., mo., tu., we., th., fr., sa.,
 *  su, mo, tu, we, th, fr, sa,
 *  tues., tues, thur., thur, thurs., thurs
 *
 * @return [0-6] from sunday to saturday, -1 to invalid weekday
 *
 * @example
 *  a_weekday(0)  // Returns 0, 0 is sunday
 *  a_weekday(-3) // Returns -1, -1 is an invalid week day
 *  a_weekday('Sunday') // Returns 0
 *  a_weekday('FRI.')  // Returns 5
 */
export function a_weekday(value: unknown): t_weekday {
    if (!value) {
        return Weekday.NO_WEEKDAY
    }
    if (typeof value === 'number') {
        return value >= 0 && value <= 6 ? value : Weekday.NO_WEEKDAY
    }
    if (typeof value === 'string' && value.length === 1) {
        const c = value[0]
        return c >= '0' && c <= '6' ? Number(c) : Weekday.NO_WEEKDAY
    }

    const s = a_string(value).trim().toLowerCase().replaceAll('.', '')
    switch (s) {
        case String(Weekday.SUNDAY):
        case 'sunday':
        case 'sun':
        case 'su':
            return Weekday.SUNDAY

        case String(Weekday.MONDAY):
        case 'monday':
        case 'mon':
        case 'mo':
            return Weekday.MONDAY

        case String(Weekday.TUESDAY):
        case 'tuesday':
        case 'tue':
        case 'tues':
        case 'tu':
            return Weekday.TUESDAY

        case String(Weekday.WEDNESDAY):
        case 'wednesday':
        case 'wed':
        case 'we':
            return Weekday.WEDNESDAY

        case String(Weekday.THURSDAY):
        case 'thursday':
        case 'thur':
        case 'thurs':
        case 'th':
            return Weekday.THURSDAY

        case String(Weekday.FRIDAY):
        case 'friday':
        case 'fri':
        case 'fr':
            return Weekday.FRIDAY

        case String(Weekday.SATURDAY):
        case 'saturday':
        case 'sat':
        case 'sa':
            return Weekday.SATURDAY

        default:
            return Weekday.NO_WEEKDAY
    }
}