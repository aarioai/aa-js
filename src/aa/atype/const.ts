import {t_alphabetical, t_alphadigits, t_digits, t_lowers, t_uppers} from './a_define_server'
import {LoopSignal, SortFunc} from './a_define'

export const Nif = () => undefined
// a nil promise
export const Nip = new Promise(Nif)

export const atoz: t_lowers = 'abcdefghijklmnopqrstuvwxyz'
export const AtoZ: t_uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const Alphabetical: t_alphabetical = atoz + AtoZ
export const Digits: t_digits = '0123456789'
export const AlphaDigits: t_alphadigits = Alphabetical + Digits


export const Ascend: SortFunc = (a: unknown, b: unknown): number => {
    let aa = a
    let bb = b
    if (Array.isArray(a)) {
        aa = a[0]
        bb = b[0]
    }

    if (typeof aa === 'number' && typeof bb === 'number') {
        return aa - bb
    }
    return String(aa).localeCompare(String(bb))
}

export const Descend: SortFunc = (a: unknown, b: unknown): number => {
    let aa = a
    let bb = b
    if (Array.isArray(a)) {
        aa = a[0]
        bb = b[0]
    }
    if (typeof aa === 'number' && typeof bb === 'number') {
        return bb - aa
    }
    return String(bb).localeCompare(String(aa))
}


// a signal from callback function to break forEach((value,key)) iterator
export const Break: LoopSignal = '-.../.-././.-/-.-'

// return Continue in a loop is not important, but better for people to read
export const Continue: LoopSignal = undefined

export const LF = '\n'

export const Max = 'Max'
export const Min = 'Min'
export const Optional = false
export const Required = !Optional
export const Incr = 'INCR'
export const Decr = 'DECR'