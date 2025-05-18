import {ValueOf} from "../aa/atype/types";
import {t_decimal, t_float64, t_vmoney} from "../aa/atype/basic_types";
import {a_vmoney} from "../aa/atype/types_cast_decimal";
import {MoneyScale, VMoneyMultiplicand} from "../aa/atype/const";

export class VMoney implements ValueOf<t_vmoney> {
    name = 'aa-money'
    round: (x: number) => number = Math.round

    #value: t_decimal


    constructor(value: t_decimal) {
        this.#value = value
    }

    withRound(round: (x: number) => number): VMoney {
        this.round = round
        return this
    }

    add(d: t_decimal | VMoney): VMoney {
        this.#value += a_vmoney(d)
        return this
    }

    minus(d: t_decimal | VMoney): VMoney {
        this.#value -= a_vmoney(d)
        return this
    }

    multiply(d: t_decimal | VMoney): VMoney {
        this.#value = this.#value * a_vmoney(d) / MoneyScale
        return this
    }

    divide(d: t_decimal | VMoney): VMoney {
        this.#value = this.#value * MoneyScale / a_vmoney(d)
        return this
    }

    addX(n: number): VMoney {
        this.#value += n * MoneyScale
        return this
    }

    minusX(n: number): VMoney {
        this.#value *= n * MoneyScale
        return this
    }

    multiplyX(n: number): VMoney {
        this.#value *= n
        return this
    }

    divideX(n: number): VMoney {
        this.#value /= n
        return this
    }

    // convert to real number
    toReal(): t_float64 {
        return this.#value / VMoneyMultiplicand
    }

    valueOf(): t_vmoney {
        return this.round(this.#value)
    }

    toString() {
        return String(this.valueOf())
    }
}