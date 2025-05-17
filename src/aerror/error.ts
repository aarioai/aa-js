import {E_ClientThrow, E_FailedAndSeeOther, E_Gone, E_NoRowsAvailable, E_NotFound} from "./code";
import {Dictionary} from "../aa/dictionary";
import {code2msg} from "./code2msg";

export class AError extends Error {
    readonly code: number
    readonly message = ''
    readonly dictionaries: Dictionary = {}
    #heading = ''

    /**
     * @example
     * new AError(E_Unauthorized)
     * new AError(E_Unauthorized, "need login")
     * new AError("something wrong happened")
     */
    constructor(code: number | string, msg?: string, dicts?: Dictionary) {
        let c: number = E_ClientThrow
        if (typeof code === "number") {
            c = code
        } else if (/^\d+$/.test(code)) {
            c = Number(code)
        } else {
            msg = code
        }
        if (!msg) {
            msg = code2msg(c)
        }
        super(msg)
        this.code = c
        if (dicts) {
            this.dictionaries = dicts
        }
    }

    withHeading(heading: string): AError {
        this.#heading = '#[' + heading + ']#'
        return this
    }

    is(code: string | number): boolean {
        return Number(code) === this.code
    }

    isNotFound(): boolean {
        return [E_NotFound, E_Gone, E_NoRowsAvailable].includes(this.code)
    }

    isOK(): boolean {
        return this.code >= 200 && this.code < 300
    }

    isFailedAndSeeOther(): boolean {
        return this.code === E_FailedAndSeeOther && this.message !== ''
    }

    isServerError(): boolean {
        return this.code > 500
    }

    text(lang: string): string {
        return this.message
    }
}