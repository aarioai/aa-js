import {Decimal} from "./decimal";
import {DecimalMultiplicand} from "../aa/atype/const";


/**
 * New a Decimal by performing precise add of real numbers
 */
export function addX(addend: number, ...adders: number[]): Decimal {
    let v = addend
    for (const adder of adders) {
        v += adder
    }
    return new Decimal(v * DecimalMultiplicand)
}

export function minusX(minuend: number, ...subtrahends: number[]): Decimal {
    let v = minuend
    for (const sub of subtrahends) {
        v -= sub
    }
    return new Decimal(v * DecimalMultiplicand)
}

export function multiplyX(multiplicand: number, ...multipliers: number[]): Decimal {
    let v = multiplicand * DecimalMultiplicand
    for (const m of multipliers) {
        v *= m
    }
    return new Decimal(v)
}

/**
 * New a Decimal by performing precise division of real numbers
 */
export function divideX(dividend: number, ...divisors: number[]): Decimal {
    let v = dividend * DecimalMultiplicand
    for (const divisor of divisors) {
        v /= divisor
    }
    return new Decimal(v)
}


