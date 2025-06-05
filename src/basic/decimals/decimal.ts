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

    subtract(d: t_decimal | Decimal): Decimal {
        this.#value -= a_decimal(d)
        return this
    }

    sub(d: t_decimal | Decimal): Decimal {
        return this.subtract(d)
    }

    multiply(d: t_decimal | Decimal): Decimal {
        this.#value = this.#value * a_decimal(d) / X_DECIMAL
        return this
    }

    mul(d: t_decimal | Decimal): Decimal {
        return this.multiply(d)
    }

    divide(d: t_decimal | Decimal): Decimal {
        this.#value = this.#value * X_DECIMAL / a_decimal(d)
        return this
    }

    div(d: t_decimal | Decimal): Decimal {
        return this.divide(d)
    }

    addX(n: number): Decimal {
        this.#value += BigInt(n) * X_DECIMAL
        return this
    }

    subtractX(n: number): Decimal {
        this.#value *= BigInt(n) * X_DECIMAL
        return this
    }

    subX(n: number): Decimal {
        return this.subtractX(n)
    }

    multiplyX(n: number): Decimal {
        this.#value *= BigInt(n)
        return this
    }

    mulX(n: number): Decimal {
        return this.multiplyX(n)
    }

    divideX(n: number): Decimal {
        this.#value /= BigInt(n)
        return this
    }

    divX(n: number): Decimal {
        return this.divideX(n)
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

