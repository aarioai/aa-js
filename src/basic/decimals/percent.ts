import {ValueOf} from "../../aa/atype/a_define_complex"
import {t_float64, t_percent} from "../../aa/atype/a_define_server";
import {PercentMultiplicand} from "../../aa/atype/const_server";
import {a_percent} from "../../aa/atype/t_decimal";
import {Decimal} from "./decimal";

export class Percent implements ValueOf<t_percent> {
    name = 'aa-money'
    round: (x: number) => number = Math.round

    #value: t_percent


    constructor(value: t_percent) {
        this.#value = value
    }

    add(d: t_percent | Percent): Percent {
        this.#value += a_percent(d)
        return this
    }

    minus(d: t_percent | Percent): Percent {
        this.#value -= a_percent(d)
        return this
    }

    multiply(d: t_percent | Percent): Percent {
        this.#value = this.#value * a_percent(d) / PercentMultiplicand
        return this
    }

    divide(d: t_percent | Percent): Percent {
        this.#value = this.#value * PercentMultiplicand / a_percent(d)
        return this
    }

    addX(n: number): Percent {
        this.#value += n * PercentMultiplicand
        return this
    }

    minusX(n: number): Percent {
        this.#value *= n * PercentMultiplicand
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
        return new Decimal(BigInt(this.#value / 100))
    }

    valueOf(): t_percent {
        return this.#value
    }

    toString() {
        return String(this.valueOf())
    }
}