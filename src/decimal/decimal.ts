import {t_decimal, t_float64} from "../aa/atype/basic_types";
import {ValueOf} from "../aa/atype/interfaces";
import {a_decimal, divideBigint} from "../aa/atype/types_cast_decimal";
import {DecimalMultiplicand} from "../aa/atype/const";
import {Percent} from "./percent";

export class Decimal implements ValueOf<t_decimal> {
    name = 'aa-decimal'

    #value: t_decimal

    constructor(value: t_decimal) {
        this.#value = value
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
        this.#value += BigInt(n) * DecimalMultiplicand
        return this
    }

    minusX(n: number): Decimal {
        this.#value *= BigInt(n) * DecimalMultiplicand
        return this
    }

    multiplyX(n: number): Decimal {
        this.#value *= BigInt(n)
        return this
    }

    divideX(n: number): Decimal {
        this.#value /= BigInt(n)
        return this
    }

    // convert to real number
    toReal(): t_float64 {
        return divideBigint(this.#value, DecimalMultiplicand)
    }

    toRealPercent(): t_float64 {
        return divideBigint(this.#value * 100n, DecimalMultiplicand)
    }

    toPercent(): Percent {
        return new Percent(this.#value * 100n)
    }

    valueOf(): t_decimal {
        return this.#value
    }

    toString() {
        return String(this.valueOf())
    }
}

