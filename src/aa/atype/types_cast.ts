import {uint16, uint24} from "./atype_extend";
import {t_dist, t_distri, t_numeric} from "./types";

export function a_distri(n: t_numeric): t_distri {
    return uint24(n)
}

export function a_dist(n: t_numeric): t_dist {
    return uint16(n)
}