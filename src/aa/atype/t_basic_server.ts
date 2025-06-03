import {t_lowers, t_millisecond, t_second, t_uppers} from './a_define'
import {a_string, floatToInt} from './t_basic'
import {Second} from './a_define_units'

export function a_lowers(value: unknown): t_lowers {
    return a_string(value).toLowerCase()
}

export function a_uppers(value: unknown): t_uppers {
    return a_string(value).toUpperCase()
}

export function a_second(value: t_millisecond): t_second {
    return floatToInt(value / Second)
}
