// a signal from callback function to break forEach((value,key)) iterator
export const Break = '-.../.-././.-/-.-'

// return Continue in a loop is not important, but better for people to read
export const Continue = undefined

export const MinDate = "0000-00-00"
export const MinTime = "00:00:00"
export const MinDatetime = "0000-00-00 00:00:00"

export const Max = 'Max'
export const Min = 'Min'
export const Optional = false
export const Required = !Optional
export const Incr = 'INCR'
export const Decr = 'DECR'
export const ZeroValues = [null, '', undefined, false, 0, 0n, 0.0, '0', "0.0", "0.00",MinDate, MinTime, MinDatetime]


