import {VMoney} from "./vmoney";
import {X_VMONEY} from "../../aa/atype/a_server_consts";

/**
 * Instances VMoney by performing precise add of real numbers
 */
export function vmoneyAddX(addend: number, ...adders: number[]): VMoney {
    let v = addend
    for (const adder of adders) {
        v += adder
    }
    return new VMoney(BigInt(v) * X_VMONEY)
}

export function vmoneySubX(minuend: number, ...subtrahends: number[]): VMoney {
    let v = minuend
    for (const sub of subtrahends) {
        v -= sub
    }
    return new VMoney(BigInt(v) * X_VMONEY)
}

export function vmoneyMulX(multiplicand: number, ...multipliers: number[]): VMoney {
    let v = BigInt(multiplicand) * X_VMONEY
    for (const m of multipliers) {
        v *= BigInt(m)
    }
    return new VMoney(v)
}

/**
 * Instances VMoney by performing precise division of real numbers
 */
export function vmoneyDivX(dividend: number, ...divisors: number[]): VMoney {
    let v = BigInt(dividend) * X_VMONEY
    for (const divisor of divisors) {
        v /= BigInt(divisor)
    }
    return new VMoney(v)
}
