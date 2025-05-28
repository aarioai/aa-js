import {E_ClientThrow, E_FailedAndSeeOther} from "./code";
import {code2msg} from "./code2msg";
import {language, matchLanguage} from "../../aa/translate/language";
import {AErrorDictionaries} from "./dictionaries";
import {translate} from "../../aa/translate/dictionary";
import {LF} from "../../aa/atype/a_define_consts";
import {t_numeric} from '../../aa/atype/a_define'
import {a_number} from '../../aa/atype/t_basic'
import {NotFoundCodes} from './base'

export class AError extends Error {
    readonly code: number
    readonly message = ''
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

    widthDetail(detail: string): AError {
        let e = this.#locked ? this.clone() : this
        e.#details.push(detail)
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
        return this.code >= 200 && this.code < 300
    }

    isFailedAndSeeOther(): boolean {
        return this.code === E_FailedAndSeeOther && this.message !== ''
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
            heading = AError.decorateHeadings(this.#headings, (text: string) => translate(text, dict))
        }
        if (this.#details.length) {
            detail = AError.decorateHeadings(this.#details, (text: string) => translate(text, dict))
        }
        return heading + msg + detail
    }
}