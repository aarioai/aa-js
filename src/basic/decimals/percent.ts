import type {ValueOf} from "../../aa/atype/a_define_interfaces";
import type {t_float64, t_percent} from "../../aa/atype/a_define";
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

    subtract(d: t_percent | Percent): Percent {
        this.#value -= a_percent(d)
        return this
    }

    sub(d: t_percent | Percent): Percent {
        return this.subtract(d)
    }

    multiply(d: t_percent | Percent): Percent {
        this.#value = this.#value * a_percent(d) / PERCENT_X
        return this
    }

    mul(d: t_percent | Percent): Percent {
        return this.multiply(d)
    }

    divide(d: t_percent | Percent): Percent {
        this.#value = this.#value * PERCENT_X / a_percent(d)
        return this
    }

    div(d: t_percent | Percent): Percent {
        return this.divide(d)
    }

    addX(n: number): Percent {
        this.#value += n * PERCENT_X
        return this
    }

    subtractX(n: number): Percent {
        this.#value *= n * PERCENT_X
        return this
    }

    subX(n: number): Percent {
        return this.subtractX(n)
    }

    multiplyX(n: number): Percent {
        this.#value *= n
        return this
    }

    mulX(n: number): Percent {
        return this.multiplyX(n)
    }

    divideX(n: number): Percent {
        this.#value /= n
        return this
    }

    divX(n: number): Percent {
        return this.divideX(n)
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