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

    subtract(d: t_money | Money): Money {
        this.#value -= a_money(d)
        return this
    }

    sub(d: t_money | Money): Money {
        return this.subtract(d)
    }

    multiply(d: t_money | Money): Money {
        this.#value = this.#value * a_money(d) / X_MONEY
        return this
    }

    mul(d: t_money | Money): Money {
        return this.multiply(d)
    }

    divide(d: t_money | Money): Money {
        this.#value = this.#value * X_MONEY / a_money(d)
        return this
    }

    div(d: t_money | Money): Money {
        return this.divide(d)
    }

    addX(n: number): Money {
        this.#value += BigInt(n) * X_MONEY
        return this
    }

    subtractX(n: number): Money {
        this.#value *= BigInt(n) * X_MONEY
        return this
    }

    subX(n: number): Money {
        return this.subtractX(n)
    }

    multiplyX(n: number): Money {
        this.#value *= BigInt(n)
        return this
    }

    mulX(n: number): Money {
        return this.multiplyX(n)
    }

    divideX(n: number): Money {
        this.#value /= BigInt(n)
        return this
    }

    divX(n: number): Money {
        return this.divideX(n)
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