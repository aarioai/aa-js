// a nil function
import {
    t_booln,
    t_date,
    t_datetime,
    t_decimal,
    t_int16,
    t_int24,
    t_int32,
    t_int8,
    t_money,
    t_percent,
    t_uint16,
    t_uint24,
    t_uint32,
    t_uint8,
    t_vmoney
} from "./a_define";


export const MIN_INT32: t_int32 = -2147483648
export const MAX_INT32: t_int32 = 2147483647
export const MIN_INT24: t_int24 = -8388608
export const MAX_INT24: t_int24 = 8388607
export const MIN_INT16: t_int16 = -32768
export const MAX_INT16: t_int16 = 32767
export const MIN_INT8: t_int8 = -128
export const MAX_INT8: t_int8 = 127
export const MAX_UINT32: t_uint32 = 4294967295
export const MAX_UINT24: t_uint24 = 16777215
export const MAX_UINT16: t_uint16 = 65535
export const MAX_UINT8: t_uint8 = 255

export const FALSE: t_booln = 0
export const TRUE: t_booln = 1

export const DATE_PATTERN = 'yyyy-MM-dd'  // TZData
export const DATETIME_PATTERN = 'yyyy-MM-dd HH:mm:ss'

export const MIN_DATE: t_date = "0000-00-00"
export const MAX_DATE: t_date = "9999-12-31"
export const MIN_DATETIME: t_datetime = "0000-00-00 00.00.00"
export const MAX_DATETIME: t_datetime = "9999-12-31 23:59:59"
export const DATE_TESTER = /^\d{4}-[01]\d-[03]\d$/
export const DATE_MATCHER = /\D?(\d{4}-[01]\d-[03]\d)\D?/
export const DATETIME_TESTER = /^\d{4}-[01]\d-[03]\d[\sT][0-2]\d:[0-5]\d:[0-5]\d$/
export const DATETIME_MATCHER = /\D?(\d{4}-[01]\d-[03]\d[\sT][0-2]\d:[0-5]\d:[0-5]\d)\D?/

export const ZERO_VALUES = new Set([null, '', undefined, false, 0, 0n, 0.0, '0', "0.0", "0.00", MIN_DATE, MIN_DATETIME])
export const FALSE_STRINGS = new Set(["", "false", "f", "0", "0n", "no", "off", "null"])

export const PERCENT_SCALE = 2
export const PERCENT_X: t_percent = Math.pow(10, PERCENT_SCALE)//  percent multiplicand = 100 = 10^2    percent is number, not big int
export const HUNDRED_PERCENT: t_percent = PERCENT_X  // 100% 

export const DECIMAL_SCALE = 4
export const X_DECIMAL: t_decimal = BigInt(Math.pow(10, DECIMAL_SCALE))// decimal multiplicand = 10000 = 10^4
export const MONEY_SCALE = 4
export const X_MONEY: t_money = BigInt(Math.pow(10, MONEY_SCALE)) // money multiplicand = 10000 = 10^4
export const VMONEY_SCALE = 4
export const X_VMONEY: t_vmoney = BigInt(Math.pow(10, VMONEY_SCALE)) // vmoney multiplicand = 10000 = 10^4