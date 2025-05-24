import {ValueOf} from "../../aa/atype/a_define_interfaces"
import {t_float64, t_percent} from "../../aa/atype/a_define";
import {PERCENT_X} from "../../aa/atype/a_server_consts";
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
        this.#value = this.#value * a_percent(d) / PERCENT_X
        return this
    }

    divide(d: t_percent | Percent): Percent {
        this.#value = this.#value * PERCENT_X / a_percent(d)
        return this
    }

    addX(n: number): Percent {
        this.#value += n * PERCENT_X
        return this
    }

    minusX(n: number): Percent {
        this.#value *= n * PERCENT_X
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
        return this.#value / PERCENT_X
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