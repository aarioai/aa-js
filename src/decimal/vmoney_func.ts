import {VMoney} from "./vmoney";
import {VMoneyMultiplicand} from "../aa/atype/const";

/**
 * Instances VMoney by performing precise add of real numbers
 */
export function vmoneyAddX(addend: number, ...adders: number[]): VMoney {
    let v = addend
    for (const adder of adders) {
        v += adder
    }
    return new VMoney(BigInt(v) * VMoneyMultiplicand)
}

export function vmoneyMinusX(minuend: number, ...subtrahends: number[]): VMoney {
    let v = minuend
    for (const sub of subtrahends) {
        v -= sub
    }
    return new VMoney(BigInt(v) * VMoneyMultiplicand)
}

export function vmoneyMultiplyX(multiplicand: number, ...multipliers: number[]): VMoney {
    let v = BigInt(multiplicand) * VMoneyMultiplicand
    for (const m of multipliers) {
        v *= BigInt(m)
    }
    return new VMoney(v)
}

/**
 * Instances VMoney by performing precise division of real numbers
 */
export function vmoneyDivideX(dividend: number, ...divisors: number[]): VMoney {
    let v = BigInt(dividend) * VMoneyMultiplicand
    for (const divisor of divisors) {
        v /= BigInt(divisor)
    }
    return new VMoney(v)
}
