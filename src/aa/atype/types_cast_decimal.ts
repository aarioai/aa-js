import {t_decimal, t_money, t_percent, t_vmoney} from "./basic_types";
import {ValueOf} from "./types";
import {int54} from "./types_cast";

export function a_decimal(n: number | ValueOf<t_decimal>): t_decimal {
    if (typeof n === 'number') {
        return int54(n)
    }
    return n.valueOf()
}

export function a_money(n: number | ValueOf<t_money>): t_money {
    if (typeof n === 'number') {
        return int54(n)
    }
    return n.valueOf()
}

export function a_vmoney(n: number | ValueOf<t_vmoney>): t_vmoney {
    if (typeof n === 'number') {
        return int54(n)
    }
    return n.valueOf()
}

export function a_percent(n: number | ValueOf<t_percent>): t_percent {
    if (typeof n === 'number') {
        return int54(n)
    }
    return n.valueOf()
}