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
    return new Money(v * MoneyMultiplicand)
}

export function moneyMinusX(minuend: number, ...subtrahends: number[]): Money {
    let v = minuend
    for (const sub of subtrahends) {
        v -= sub
    }
    return new Money(v * MoneyMultiplicand)
}

export function moneyMultiplyX(multiplicand: number, ...multipliers: number[]): Money {
    let v = multiplicand * MoneyMultiplicand
    for (const m of multipliers) {
        v *= m
    }
    return new Money(v)
}

/**
 * Instances Money by performing precise division of real numbers
 */
export function moneyDivideX(dividend: number, ...divisors: number[]): Money {
    let v = dividend * MoneyMultiplicand
    for (const divisor of divisors) {
        v /= divisor
    }
    return new Money(v)
}
