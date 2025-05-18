import {Money} from "./money";
import {MoneyMultiplicand} from "../aa/atype/const";

/**
 * Instances by performing precise add of real numbers
 */
export function moneyAddX(addend: number, ...adders: number[]): Money {
    let v = addend
    for (const adder of adders) {
        v += adder
    }
    return new Money(BigInt(v) * MoneyMultiplicand)
}

export function moneyMinusX(minuend: number, ...subtrahends: number[]): Money {
    let v = minuend
    for (const sub of subtrahends) {
        v -= sub
    }
    return new Money(BigInt(v) * MoneyMultiplicand)
}

export function moneyMultiplyX(multiplicand: number, ...multipliers: number[]): Money {
    let v = BigInt(multiplicand) * MoneyMultiplicand
    for (const m of multipliers) {
        v *= BigInt(m)
    }
    return new Money(v)
}

/**
 * Instances Money by performing precise division of real numbers
 */
export function moneyDivideX(dividend: number, ...divisors: number[]): Money {
    let v = BigInt(dividend) * MoneyMultiplicand
    for (const divisor of divisors) {
        v /= BigInt(divisor)
    }
    return new Money(v)
}
