// a nil function
import {
    t_booln,
    t_date,
    t_datetime,
    t_int16,
    t_int24,
    t_int32,
    t_int8,
    t_uint16,
    t_uint24,
    t_uint32,
    t_uint8
} from "./basic_types";

export const Nif = () => undefined

// a nil promise
export const Nip = new Promise(Nif)

export const MinInt32: t_int32 = -2147483648
export const MaxInt32: t_int32 = 2147483647
export const MinInt24: t_int24 = -8388608
export const MaxInt24: t_int24 = 8388607
export const MinInt16: t_int16 = -32768
export const MaxInt16: t_int16 = 32767
export const MinInt8: t_int8 = -128
export const MaxInt8: t_int8 = 127
export const MaxUint32: t_uint32 = 4294967295
export const MaxUint24: t_uint24 = 16777215
export const MaxUint16: t_uint16 = 65535
export const MaxUint8: t_uint8 = 255

export const False: t_booln = 0
export const True: t_booln = 1

export const DatePattern = 'yyyy-MM-dd'  // TZData
export const DatetimePattern = 'yyyy-MM-dd HH:mm:ss'

export const MinDate: t_date = "0000-00-00"
export const MaxDate: t_date = "9999-12-31"
//export const MinTime = "00.00.00"
export const MinDatetime: t_datetime = "0000-00-00 00.00.00"
export const MaxDatetime: t_datetime = "9999-12-31 23:59:59"

export const ZeroValues = [null, '', undefined, false, 0, 0n, 0.0, '0', "0.0", "0.00", MinDate, MinDatetime]


export const DecimalScale = 4
export const DecimalMultiplicand = Math.pow(10, DecimalScale) // 10000 = 10^4
export const PercentScale = 2
export const PercentMultiplicand = Math.pow(10, PercentScale) // 100 = 10^2
export const MoneyScale = 4
export const MoneyMultiplicand = Math.pow(10, MoneyScale) // 10000 = 10^4
export const VMoneyScale = 4
export const VMoneyMultiplicand = Math.pow(10, VMoneyScale) // 10000 = 10^4