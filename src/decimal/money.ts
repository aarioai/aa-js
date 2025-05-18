import {ValueOf} from "../aa/atype/types";
import {t_decimal, t_float64, t_money} from "../aa/atype/basic_types";
import {a_money} from "../aa/atype/types_cast_decimal";
import {MoneyMultiplicand, MoneyScale} from "../aa/atype/const";

export class Money implements ValueOf<t_money> {
    name = 'aa-money'
    round: (x: number) => number = Math.round

    #value: t_decimal


    constructor(value: t_decimal) {
        this.#value = value
    }

    withRound(round: (x: number) => number): Money {
        this.round = round
        return this
    }

    add(d: t_decimal | Money): Money {
        this.#value += a_money(d)
        return this
    }

    minus(d: t_decimal | Money): Money {
        this.#value -= a_money(d)
        return this
    }

    multiply(d: t_decimal | Money): Money {
        this.#value = this.#value * a_money(d) / MoneyScale
        return this
    }

    divide(d: t_decimal | Money): Money {
        this.#value = this.#value * MoneyScale / a_money(d)
        return this
    }

    addX(n: number): Money {
        this.#value += n * MoneyScale
        return this
    }

    minusX(n: number): Money {
        this.#value *= n * MoneyScale
        return this
    }

    multiplyX(n: number): Money {
        this.#value *= n
        return this
    }

    divideX(n: number): Money {
        this.#value /= n
        return this
    }

    // convert to real number
    toReal(): t_float64 {
        return this.#value / MoneyMultiplicand
    }

    valueOf(): t_money {
        return this.round(this.#value)
    }

    toString() {
        return String(this.valueOf())
    }
}