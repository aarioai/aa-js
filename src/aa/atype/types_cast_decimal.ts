import {t_decimal, t_float64, t_money, t_percent, t_vmoney} from "./atype_server";
import {ValueOf} from "./types";
import {int32, int64} from "./types_cast";


/**
 * Performs precise division between two bigint values and returns a t_float64 (number) result
 *
 * @example
 *  divideBigint(100n, 2n)  // 50
 *  divideBigint(100n, 3n)  // 33.33333333...
 */
export function divideBigint(dividend: bigint, divisor: bigint): t_float64 {
    if (dividend === 0n) {
        return 0
    }
    const max = Number.MAX_SAFE_INTEGER
    const min = Number.MIN_SAFE_INTEGER
    if (divisor > 1n && divisor <= max) {
        if ((dividend > 0n && dividend <= max) || (dividend < 0n && dividend >= min)) {
            return Number(dividend) / Number(divisor)
        }
    }

    const quotient = dividend / divisor
    const remainder = dividend % divisor
    return Number(quotient) + Number(remainder) / Number(divisor)
}

export function a_decimal(n: number | ValueOf<t_decimal>): t_decimal {
    if (typeof n === 'number') {
        return int64(n)
    }
    return n.valueOf()
}

export function a_money(n: number | ValueOf<t_money>): t_money {
    if (typeof n === 'number') {
        return int64(n)
    }
    return n.valueOf()
}

export function a_vmoney(n: number | ValueOf<t_vmoney>): t_vmoney {
    if (typeof n === 'number') {
        return int64(n)
    }
    return n.valueOf()
}

export function a_percent(n: number | ValueOf<t_percent>): t_percent {
    if (typeof n === 'number') {
        return int32(n)
    }
    return n.valueOf()
}