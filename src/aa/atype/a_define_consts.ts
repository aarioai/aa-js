import type {t_alphabetical, t_alphadigits, t_digits, t_lowers, t_safeint, t_uppers} from './a_define'

export const LF = '\n'

export const APX_MAX_SAFE_INT: t_safeint = 9000999999999999  // slightly smaller than 9007199254740991 = Number.MAX_SAFE_INTEGER
export const APX_MIN_SAFE_INT: t_safeint = -9000999999999999 // slightly greater than -9007199254740991 = Number.MIN_SAFE_INTEGER
export const APX_MAX_SAFE_INT_LEN = 16 // String(ApproximateMaxUint).length

export const atoz: t_lowers = 'abcdefghijklmnopqrstuvwxyz'
export const AtoZ: t_uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const ALPHABETICAL: t_alphabetical = atoz + AtoZ
export const DIGITS: t_digits = '0123456789'
export const ALPHA_DIGITS: t_alphadigits = ALPHABETICAL + DIGITS

export const SERIALIZE_SEPARATOR = '::'  // a separator to split class name and its serialize string

 