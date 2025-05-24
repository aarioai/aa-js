import {shuffle} from "../arrays/array";
import {ALPHA_DIGITS} from '../../aa/atype/a_define_consts'

export function shuffleString(s: string): string {
    return shuffle(s.split('')).join('')
}

/**
 * Generates a random string of specified length from a given character set
 *
 * @example
 * randomString(8) // "xY7pQ2aK"
 * randomString(16, "abc123") // "2a1b3c2a1b3c2a1b"
 */
export function randomString(length: number, base: string = ALPHA_DIGITS): string {
    base = shuffleString(base)
    const baseLen = base.length
    const rand = new Uint32Array(length)
    crypto.getRandomValues(rand)
    let result = ''

    for (let i = 0; i < length; i++) {
        result += base[rand[i] % baseLen]
    }
    return result
}