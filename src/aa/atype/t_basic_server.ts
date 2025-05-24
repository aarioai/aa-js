import {t_lowers, t_uppers, t_weekday} from './a_define'
import {a_string} from './t_basic'
import {FRIDAY, INVALID_WEEKDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY} from './a_define_enums'

export function a_lowers(value: unknown): t_lowers {
    return a_string(value).toLowerCase()
}

export function a_uppers(value: unknown): t_uppers {
    return a_string(value).toUpperCase()
}

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
        return INVALID_WEEKDAY
    }
    if (typeof value === 'number') {
        return value >= 0 && value <= 6 ? value : INVALID_WEEKDAY
    }
    if (typeof value === 'string' && value.length === 1) {
        const c = value[0]
        return c >= '0' && c <= '6' ? Number(c) : INVALID_WEEKDAY
    }

    const s = a_string(value).trim().toLowerCase().replaceAll('.', '')
    switch (s) {
        case String(SUNDAY):
        case 'sunday':
        case 'sun':
        case 'su':
            return SUNDAY

        case String(MONDAY):
        case 'monday':
        case 'mon':
        case 'mo':
            return MONDAY

        case String(TUESDAY):
        case 'tuesday':
        case 'tue':
        case 'tues':
        case 'tu':
            return TUESDAY

        case String(WEDNESDAY):
        case 'wednesday':
        case 'wed':
        case 'we':
            return WEDNESDAY

        case String(THURSDAY):
        case 'thursday':
        case 'thur':
        case 'thurs':
        case 'th':
            return THURSDAY

        case String(FRIDAY):
        case 'friday':
        case 'fri':
        case 'fr':
            return FRIDAY

        case String(SATURDAY):
        case 'saturday':
        case 'sat':
        case 'sa':
            return SATURDAY

        default:
            return INVALID_WEEKDAY
    }
}