import aconfig from '../aconfig/aconfig'
import {ZERO_DATE, ZERO_DATETIME, ZERO_VALUES} from '../atype/a_server_consts'

let ZeroValues: Set<unknown> = new Set([aconfig.minDate, aconfig.minDatetime, ZERO_DATE, ZERO_DATETIME, ...ZERO_VALUES])

function rebuildZeroValues(): Set<unknown> {
    const values = [aconfig.minDate, aconfig.minDatetime, ...ZERO_VALUES]
    if (aconfig.enableZeroDate) {
        values.push(ZERO_DATE)
        values.push(ZERO_DATETIME)
    }
    ZeroValues = new Set(values)
    return ZeroValues
}

export function zeroValues(): Set<unknown> {
    if (!ZeroValues || ZeroValues.has(aconfig.minDate)) {
        return rebuildZeroValues()
    }

    if (aconfig.enableZeroDate) {
        if (!ZeroValues.has(ZERO_DATE) || !ZeroValues.has(ZERO_DATETIME)) {
            ZeroValues.add(ZERO_DATE)
            ZeroValues.add(ZERO_DATETIME)
        }
    } else {
        if (ZeroValues.has(ZERO_DATE) || ZeroValues.has(ZERO_DATETIME)) {
            ZeroValues.delete(ZERO_DATE)
            ZeroValues.delete(ZERO_DATETIME)
        }
    }
    return ZeroValues
}
