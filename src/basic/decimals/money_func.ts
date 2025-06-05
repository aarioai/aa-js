import {Money} from "./money";
import {X_MONEY} from "../../aa/atype/a_server_consts";

/**
 * Instances by performing precise add of real numbers
 */
export function moneyAddX(addend: number, ...adders: number[]): Money {
    let v = addend
    for (const adder of adders) {
        v += adder
    }
    return new Money(BigInt(v) * X_MONEY)
}

export function moneySubX(minuend: number, ...subtrahends: number[]): Money {
    let v = minuend
    for (const sub of subtrahends) {
        v -= sub
    }
    return new Money(BigInt(v) * X_MONEY)
}

export function moneyMulX(multiplicand: number, ...multipliers: number[]): Money {
    let v = BigInt(multiplicand) * X_MONEY
    for (const m of multipliers) {
        v *= BigInt(m)
    }
    return new Money(v)
}

/**
 * Instances Money by performing precise division of real numbers
 */
export function moneyDivX(dividend: number, ...divisors: number[]): Money {
    let v = BigInt(dividend) * X_MONEY
    for (const divisor of divisors) {
        v /= BigInt(divisor)
    }
    return new Money(v)
}
