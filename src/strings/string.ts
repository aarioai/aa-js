import {shuffle} from "../arrays/array";
import {AlphaDigits} from "../aa/env/const";

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
export function randomString(length: number, base: string = AlphaDigits): string {
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