import {NormalizedStorageOptions, STORAGE_SEPARATOR, StorageOptions, t_storage_expires} from './define_types'
import {aliasToAtype, ATYPE_PREFIX, detectAtypeAlias} from '../../aa/atype/t_atype'
import {a_string, floatToInt} from '../../aa/atype/t_basic'
import {atypeize} from '../../aa/dynamics/atype'
import {t_expires, t_second} from '../../aa/atype/a_define'
import {DaysInSecond, MinuteInSecond, MinutesInSecond, NO_EXPIRES} from '../../aa/atype/a_define_units'
import {a_second} from '../../aa/atype/t_basic_server'


function normalizeStorageExpires(expires: t_storage_expires, timeDiff: t_second): t_expires {
    if (expires === undefined || expires === null) {
        return 3 * DaysInSecond // default expires, 3 days
    }
    if (!expires) {
        return 0   // expired
    }

    if (typeof expires === 'number') {
        return expires + timeDiff
    }
    if (typeof expires === 'string') {
        expires = new Date(expires)
    }

    if (!(expires instanceof Date)) {
        return 0
    }

    return a_second(Date.now() - expires.getTime()) + timeDiff
}

function normalizeStorageOptions(options: StorageOptions): NormalizedStorageOptions {
    return {
        expiresIn: normalizeStorageExpires(options.expiresIn, options.timeDiff),
        unclearable: options.unclearable ?? false,
        timeDiff: options.timeDiff ?? 0,
    }
}

function encodeStorageOptions(options: NormalizedStorageOptions): string {
    if (!options) {
        return ''
    }
    const expires = options.expiresIn ? ('-' + floatToInt(options.expiresIn / MinuteInSecond)) : ''
    const unclearable = options?.unclearable ? ':' : ''
    return `${expires}${unclearable}`
}

export function encodeStorageValue(value: unknown, options?: StorageOptions): string | null {
    const normalizedOptions = normalizeStorageOptions(options)
    if (!normalizedOptions.expiresIn) {
        return null  // expired
    }

    const [_, typeAlias] = detectAtypeAlias(value)  // including Serializable class
    const s = a_string(value)
    const opts = encodeStorageOptions(normalizedOptions)
    return `${s}${STORAGE_SEPARATOR}${typeAlias}${opts}`
}

export function decodeStorageValue<T = unknown>(s: string): { value: T, options?: NormalizedStorageOptions } {
    if (!s) {
        return {value: null}
    }
    const sep = STORAGE_SEPARATOR + ATYPE_PREFIX
    const parts = s.split(sep)
    const last = parts.pop()
    if (parts.length < 1 || !last) {
        return {value: s as T}
    }
    if (!/^[a-z](-\d+)?:?$/.test(last)) {
        return {value: s as T}
    }

    const typeAlias = ATYPE_PREFIX + last[0]
    const type = aliasToAtype(typeAlias)
    if (!type) {
        return {value: s as T}
    }
    const value = atypeize(parts.join(sep), type) as T
    if (last.length === 1) {
        return {value: value}
    }
    const unclearable = last.endsWith(':')
    const exp = last.substring(2, unclearable ? last.length - 1 : last.length)
    let expires: t_expires = NO_EXPIRES
    if (exp) {
        expires = Number(exp) * MinutesInSecond
    }
    return {value: value, options: {unclearable, expiresIn: expires, timeDiff: 0}}
}