import {t_alphabetical, t_alphadigits, t_digits, t_lowers, t_uppers} from './a_define_server'
import {SortNumberFunc, SortStringFunc} from './a_define'

export const Nif = () => undefined
// a nil promise
export const Nip = new Promise(Nif)

export const atoz: t_lowers = 'abcdefghijklmnopqrstuvwxyz'
export const AtoZ: t_uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const Alphabetical: t_alphabetical = atoz + AtoZ
export const Digits: t_digits = '0123456789'
export const AlphaDigits: t_alphadigits = Alphabetical + Digits


export const AscStringFunc: SortStringFunc = (a: string, b: string): number => a.localeCompare(b)
export const DescStringFunc: SortStringFunc = (a: string, b: string): number => b.localeCompare(a)
export const AscNumberFunc: SortNumberFunc = (a: number, b: number): number => a - b
export const DescNumberFunc: SortNumberFunc = (a: number, b: number): number => b - a