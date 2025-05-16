import {E_ClientThrow} from "./code";
import {Dictionaries} from "../base/dictionaries";

export class AError extends Error {
    #heading = ''
    #code: number
    #message = ''
    #dictionaries: Dictionaries = {}

    constructor(code: number | string | Error, msg?: string) {
        let c: number = E_ClientThrow
        if (code instanceof Error) {
            msg = code.toString()
        } else if (typeof code === "string") {
            msg = msg ? code + " " + msg : code
        } else {
            c = code
        }
        super(msg)
        this.#code = c
        this.#message = msg
    }

    get code() {
        return this.#code
    }

    get msg(): string {
        return this.#message
    }

    get message(): string {
        return this.msg
    }

    withHeading(heading: string): AError {
        this.#heading = '#[' + heading + ']#'
        return this
    }

    withTranslation(dicts: Dictionaries): AError {
        this.#dictionaries = dicts
        return this
    }
}