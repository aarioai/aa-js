import {Percent} from "./percent";
import {PercentMultiplicand} from "../../aa/atype/const";

/**
 * Instances Percent by performing precise add of real numbers
 */
export function percentAddX(addend: number, ...adders: number[]): Percent {
    let v = addend
    for (const adder of adders) {
        v += adder
    }
    return new Percent(v * PercentMultiplicand)
}

export function percentMinusX(minuend: number, ...subtrahends: number[]): Percent {
    let v = minuend
    for (const sub of subtrahends) {
        v -= sub
    }
    return new Percent(v * PercentMultiplicand)
}

export function percentMultiplyX(multiplicand: number, ...multipliers: number[]): Percent {
    let v = multiplicand * PercentMultiplicand
    for (const m of multipliers) {
        v *= m
    }
    return new Percent(v)
}

/**
 * Instances Percent by performing precise division of real numbers
 */
export function percentDivideX(dividend: number, ...divisors: number[]): Percent {
    let v = dividend * PercentMultiplicand
    for (const divisor of divisors) {
        v /= divisor
    }
    return new Percent(v)
}
