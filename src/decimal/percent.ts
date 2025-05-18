import {ValueOf} from "../aa/atype/types";
import {t_decimal, t_float64, t_percent} from "../aa/atype/basic_types";
import {a_percent} from "../aa/atype/types_cast_decimal";
import {MoneyScale, PercentMultiplicand} from "../aa/atype/const";
import {Decimal} from "./decimal";

export class Percent implements ValueOf<t_percent> {
    name = 'aa-money'
    round: (x: number) => number = Math.round

    #value: t_decimal


    constructor(value: t_decimal) {
        this.#value = value
    }

    withRound(round: (x: number) => number): Percent {
        this.round = round
        return this
    }

    add(d: t_decimal | Percent): Percent {
        this.#value += a_percent(d)
        return this
    }

    minus(d: t_decimal | Percent): Percent {
        this.#value -= a_percent(d)
        return this
    }

    multiply(d: t_decimal | Percent): Percent {
        this.#value = this.#value * a_percent(d) / MoneyScale
        return this
    }

    divide(d: t_decimal | Percent): Percent {
        this.#value = this.#value * MoneyScale / a_percent(d)
        return this
    }

    addX(n: number): Percent {
        this.#value += n * MoneyScale
        return this
    }

    minusX(n: number): Percent {
        this.#value *= n * MoneyScale
        return this
    }

    multiplyX(n: number): Percent {
        this.#value *= n
        return this
    }

    divideX(n: number): Percent {
        this.#value /= n
        return this
    }

    // convert to real number
    toReal(): t_float64 {
        return this.#value / PercentMultiplicand
    }

    toDecimal(): Decimal {
        return new Decimal(this.#value)
    }


    valueOf(): t_percent {
        return this.round(this.#value)
    }

    toString() {
        return String(this.valueOf())
    }
}