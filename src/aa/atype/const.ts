// a nil function
export const Nif = () => undefined

// a nil promise
export const Nip = new Promise(Nif)

export const MinInt32 = -2147483648
export const MaxInt32 = 2147483647
export const MinInt24 = -8388608
export const MaxInt24 = 8388607
export const MinInt16 = -32768
export const MaxInt16 = 32767
export const MinInt8 = -128
export const MaxInt8 = 127
export const MaxUint32 = 4294967295
export const MaxUint24 = 16777215
export const MaxUint16 = 65535
export const MaxUint8 = 255