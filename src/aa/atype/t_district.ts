import type {t_dist, t_distri} from './a_define'
import {uint16, uint24} from './t_basic'

export function a_distri(n: number): t_distri {
    return uint24(n)
}

export function a_dist(n: number): t_dist {
    return uint16(n)
}
