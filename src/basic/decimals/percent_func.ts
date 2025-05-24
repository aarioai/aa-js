import {Percent} from "./percent";
import {PERCENT_X} from "../../aa/atype/a_server_consts";

/**
 * Instances Percent by performing precise add of real numbers
 */
export function percentAddX(addend: number, ...adders: number[]): Percent {
    let v = addend
    for (const adder of adders) {
        v += adder
    }
    return new Percent(v * PERCENT_X)
}

export function percentMinusX(minuend: number, ...subtrahends: number[]): Percent {
    let v = minuend
    for (const sub of subtrahends) {
        v -= sub
    }
    return new Percent(v * PERCENT_X)
}

export function percentMultiplyX(multiplicand: number, ...multipliers: number[]): Percent {
    let v = multiplicand * PERCENT_X
    for (const m of multipliers) {
        v *= m
    }
    return new Percent(v)
}

/**
 * Instances Percent by performing precise division of real numbers
 */
export function percentDivideX(dividend: number, ...divisors: number[]): Percent {
    let v = dividend * PERCENT_X
    for (const divisor of divisors) {
        v /= divisor
    }
    return new Percent(v)
}
