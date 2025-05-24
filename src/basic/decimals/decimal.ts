import {t_decimal, t_float64} from "../../aa/atype/a_define";
import {ValueOf} from "../../aa/atype/a_define_interfaces";
import {a_decimal, divideBigint} from "../../aa/atype/t_decimal";
import {X_DECIMAL} from "../../aa/atype/a_server_consts";
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
        this.#value = this.#value * a_decimal(d) / X_DECIMAL
        return this
    }

    divide(d: t_decimal | Decimal): Decimal {
        this.#value = this.#value * X_DECIMAL / a_decimal(d)
        return this
    }

    addX(n: number): Decimal {
        this.#value += BigInt(n) * X_DECIMAL
        return this
    }

    minusX(n: number): Decimal {
        this.#value *= BigInt(n) * X_DECIMAL
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
        return divideBigint(this.#value, X_DECIMAL)
    }

    toRealPercent(): t_float64 {
        return divideBigint(this.#value * 100n, X_DECIMAL)
    }

    toPercent(): Percent {
        return new Percent(Number(this.#value) * 100)
    }

    valueOf(): t_decimal {
        return this.#value
    }

    toString() {
        return String(this.valueOf())
    }
}

