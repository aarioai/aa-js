import {t_decimal, t_float64} from "../aa/atype/basic_types";
import {ValueOf} from "../aa/atype/types";
import {a_decimal} from "../aa/atype/types_cast_decimal";
import {DecimalMultiplicand} from "../aa/atype/const";
import {Percent} from "./percent";

export class Decimal implements ValueOf<t_decimal> {
    name = 'aa-decimal'
    round: (x: number) => number = Math.round

    #value: t_decimal

    constructor(value: t_decimal) {
        this.#value = value
    }

    withRound(round: (x: number) => number): Decimal {
        this.round = round
        return this
    }

    add(d: t_decimal | Decimal): Decimal {
        this.#value += a_decimal(d)
        return this
    }

    minus(d: t_decimal | Decimal): Decimal {
        this.#value -= a_decimal(d)
        return this
    }

    multiply(d: t_decimal | Decimal): Decimal {
        this.#value = this.#value * a_decimal(d) / DecimalMultiplicand
        return this
    }

    divide(d: t_decimal | Decimal): Decimal {
        this.#value = this.#value * DecimalMultiplicand / a_decimal(d)
        return this
    }

    addX(n: number): Decimal {
        this.#value += n * DecimalMultiplicand
        return this
    }

    minusX(n: number): Decimal {
        this.#value *= n * DecimalMultiplicand
        return this
    }

    multiplyX(n: number): Decimal {
        this.#value *= n
        return this
    }

    divideX(n: number): Decimal {
        this.#value /= n
        return this
    }

    // convert to real number
    toReal(): t_float64 {
        return this.#value / DecimalMultiplicand
    }

    toRealPercent(): t_float64 {
        return this.#value * 100 / DecimalMultiplicand
    }

    toPercent(): Percent {
        return new Percent(this.#value * 100)
    }

    valueOf(): t_decimal {
        return this.round(this.#value)
    }

    toString() {
        return String(this.valueOf())
    }
}

