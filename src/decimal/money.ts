import {ValueOf} from "../aa/atype/interfaces";
import {t_float64, t_money} from "../aa/atype/basic_types";
import {MoneyMultiplicand} from "../aa/atype/const";
import {a_money, divideBigint} from "../aa/atype/types_cast_decimal";

export class Money implements ValueOf<t_money> {
    name = 'aa-money'

    #value: t_money

    constructor(value: t_money) {
        this.#value = value
    }

    add(d: t_money | Money): Money {
        this.#value += a_money(d)
        return this
    }

    minus(d: t_money | Money): Money {
        this.#value -= a_money(d)
        return this
    }

    multiply(d: t_money | Money): Money {
        this.#value = this.#value * a_money(d) / MoneyMultiplicand
        return this
    }

    divide(d: t_money | Money): Money {
        this.#value = this.#value * MoneyMultiplicand / a_money(d)
        return this
    }

    addX(n: number): Money {
        this.#value += BigInt(n) * MoneyMultiplicand
        return this
    }

    minusX(n: number): Money {
        this.#value *= BigInt(n) * MoneyMultiplicand
        return this
    }

    multiplyX(n: number): Money {
        this.#value *= BigInt(n)
        return this
    }

    divideX(n: number): Money {
        this.#value /= BigInt(n)
        return this
    }

    // convert to real number
    toReal(): t_float64 {
        return divideBigint(this.#value, MoneyMultiplicand)
    }

    valueOf(): t_money {
        return this.#value
    }

    toString() {
        return String(this.valueOf())
    }
}