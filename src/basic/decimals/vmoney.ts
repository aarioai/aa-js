import {ValueOf} from "../../aa/atype/a_define_interfaces"
import {t_float64, t_vmoney} from "../../aa/atype/a_define";
import {X_VMONEY} from "../../aa/atype/a_server_consts";
import {a_money, divideBigint} from "../../aa/atype/t_decimal";

export class VMoney implements ValueOf<t_vmoney> {
    name = 'aa-money'
    round: (x: number) => number = Math.round

    #value: t_vmoney


    constructor(value: t_vmoney) {
        this.#value = value

    }

    add(d: t_vmoney | VMoney): VMoney {
        this.#value += a_money(d)
        return this
    }

    subtract(d: t_vmoney | VMoney): VMoney {
        this.#value -= a_money(d)
        return this
    }

    sub(d: t_vmoney | VMoney): VMoney {
        return this.subtract(d)
    }

    multiply(d: t_vmoney | VMoney): VMoney {
        this.#value = this.#value * a_money(d) / X_VMONEY
        return this
    }

    mul(d: t_vmoney | VMoney): VMoney {
        return this.multiply(d)
    }

    divide(d: t_vmoney | VMoney): VMoney {
        this.#value = this.#value * X_VMONEY / a_money(d)
        return this
    }

    div(d: t_vmoney | VMoney): VMoney {
        return this.divide(d)
    }

    addX(n: number): VMoney {
        this.#value += BigInt(n) * X_VMONEY
        return this
    }

    subtractX(n: number): VMoney {
        this.#value *= BigInt(n) * X_VMONEY
        return this
    }

    subX(n: number): VMoney {
        return this.subtractX(n)
    }

    multiplyX(n: number): VMoney {
        this.#value *= BigInt(n)
        return this
    }

    mulX(n: number): VMoney {
        return this.multiplyX(n)
    }

    divideX(n: number): VMoney {
        this.#value /= BigInt(n)
        return this
    }

    divX(n: number): VMoney {
        return this.divideX(n)
    }

    // convert to real number
    toReal(): t_float64 {
        return divideBigint(this.#value, X_VMONEY)
    }

    valueOf(): t_vmoney {
        return this.#value
    }

    toString() {
        return String(this.valueOf())
    }
}