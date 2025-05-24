import {ValueOf} from "../../aa/atype/a_define_interfaces"
import {t_float64, t_money} from "../../aa/atype/a_define";
import {X_MONEY} from "../../aa/atype/a_server_consts";
import {a_money, divideBigint} from "../../aa/atype/t_decimal";

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
        this.#value = this.#value * a_money(d) / X_MONEY
        return this
    }

    divide(d: t_money | Money): Money {
        this.#value = this.#value * X_MONEY / a_money(d)
        return this
    }

    addX(n: number): Money {
        this.#value += BigInt(n) * X_MONEY
        return this
    }

    minusX(n: number): Money {
        this.#value *= BigInt(n) * X_MONEY
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
        return divideBigint(this.#value, X_MONEY)
    }

    valueOf(): t_money {
        return this.#value
    }

    toString() {
        return String(this.valueOf())
    }
}