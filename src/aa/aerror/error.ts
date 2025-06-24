import {CODE_FAILED_AND_SEE_OTHER, CODE_UNAUTHORIZED} from "./code";
import {code2msg, msg2code} from "./code2msg";
import {language, matchLanguage} from "../translate/language";
import {AErrorDictionaries} from "./dictionaries";
import {translate} from "../translate/dictionary";
import {LF} from "../atype/a_define_consts";
import type {t_numeric} from '../atype/a_define';
import {a_number, a_string} from '../atype/t_basic'
import {NotFoundCodes, Separator} from './base'
import {isOK} from './fn'

export class AError extends Error {
    readonly code: number

    #headings: string[] = []
    #details: string[] = []
    #locked: boolean = false

    /**
     * @example
     * new AError(E_Unauthorized)
     * new AError(E_Unauthorized, "need login")
     * new AError("something wrong happened")
     */
    constructor(code: number | string, msg?: string) {
        let c: number
        if (typeof code === "number") {
            c = code
        } else if (/^\d+$/.test(code)) {
            c = Number(code)
        } else {
            msg = code
            c = msg2code(code)
        }
        if (!msg) {
            msg = code2msg(c)
        }
        super(msg)
        this.code = c
    }

    static decorateStrings(arr?: string[], translate?: (text: string) => string): string {
        if (!arr?.length) {
            return ''
        }
        if (translate) {
            let newHeadings: string[] = new Array(arr.length)
            for (let i = arr.length - 1; i >= 0; i--) {
                newHeadings[i] = translate(arr[i])
            }
            arr = newHeadings
        }

        return arr.join(' / ')
    }

    static decorateHeadings(headings?: string[], translate?: (text: string) => string): string {
        const s = AError.decorateStrings(headings, translate)
        if (!s) {
            return ''
        }
        return s + LF
    }

    static decorateDetails(details?: string[], translate?: (text: string) => string): string {
        const s = AError.decorateStrings(details, translate)
        if (!s) {
            return ''
        }
        return LF + s
    }

    addHeading(heading: string): AError {
        let e = this.#locked ? this.clone() : this
        e.#headings.push(heading)
        return e
    }

    widthDetail(detail: unknown): AError {
        let e = this.#locked ? this.clone() : this
        e.#details.push(a_string(detail))
        return e
    }

    clone(): AError {
        let e = new AError(this.code, this.message)
        if (this.#headings.length) {
            for (const heading of this.#headings) {
                e.addHeading(heading)
            }
        }
        if (this.#details.length) {
            for (const detail of this.#details) {
                e.widthDetail(detail)
            }
        }

        return e
    }

    is(code: t_numeric): boolean {
        return a_number(code) === this.code
    }

    isNotFound(): boolean {
        return NotFoundCodes.has(this.code)
    }

    isOK(): boolean {
        return isOK(this.code)
    }

    isFailedAndSeeOther(): boolean {
        return this.code === CODE_FAILED_AND_SEE_OTHER && this.message !== ''
    }

    isUnauthorized(): boolean {
        return this.code === CODE_UNAUTHORIZED
    }

    isServerError(): boolean {
        return this.code > 500
    }

    handleLock(): AError {
        if (this.#locked) {
            return this.clone()
        }
        return this
    }

    lock(): AError {
        this.#locked = true
        return this
    }


    toString(lang?: string): string {
        const availableLangs = Object.keys(AErrorDictionaries)
        lang = lang ? matchLanguage(lang, availableLangs) : language(availableLangs)
        if (lang === '') {
            return AError.decorateHeadings(this.#headings) + this.message + AError.decorateDetails(this.#details)
        }
        const dict = AErrorDictionaries[lang]
        const msg = translate(this.message, dict)

        let heading = ''
        let detail = ''
        if (this.#headings.length) {
            heading = AError.decorateHeadings(this.#headings, (text: string) => translate(text, dict)) + Separator
        }
        if (this.#details.length) {
            detail = Separator + AError.decorateHeadings(this.#details, (text: string) => translate(text, dict))
        }
        return heading + msg + detail
    }
}