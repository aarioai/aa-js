import {NormalizedStorageOptions, STORAGE_SEPARATOR, StorageOptions, t_storage_expires} from './define_types'
import {aliasToAtype, ATYPE_PREFIX, detectAtypeAlias} from '../../aa/atype/t_atype'
import {a_string, floatToInt} from '../../aa/atype/t_basic'
import {atypeize} from '../../aa/dynamics/atype'
import {t_millisecond} from '../../aa/atype/a_define'
import {Hour, Minute, NO_EXPIRES} from '../../aa/atype/a_define_units'


function normalizeStorageExpires(expires: t_storage_expires, timeDiff: t_millisecond): t_millisecond {
    if (expires === undefined || expires === null) {
        return 72 * Hour     // default expires, 3 days
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

    return Date.now() - expires.getTime() + timeDiff
}

function normalizeStorageOptions(options: StorageOptions): NormalizedStorageOptions {
    return {
        expires: normalizeStorageExpires(options.expires, options.timeDiff),
        persistent: options.persistent ?? false,
        timeDiff: options.timeDiff ?? 0,
    }
}

function encodeStorageOptions(options: NormalizedStorageOptions): string {
    if (!options) {
        return ''
    }
    const expires = options.expires ? ('-' + floatToInt(options.expires / Minute)) : ''
    const persis = options?.persistent ? ':' : ''
    return `${expires}${persis}`
}

export function encodeStorageValue(value: unknown, options?: StorageOptions): string | null {
    const normalizedOptions = normalizeStorageOptions(options)
    if (!normalizedOptions.expires) {
        return null  // expired
    }

    const [_, typeAlias] = detectAtypeAlias(value)  // including Serializable class
    const s = a_string(value)
    const opts = encodeStorageOptions(normalizedOptions)
    return `${s}${STORAGE_SEPARATOR}${typeAlias}${opts}`
}

export function decodeStorageValue(s: string): { value: unknown, options?: NormalizedStorageOptions } {
    if (!s) {
        return {value: null}
    }
    const sep = STORAGE_SEPARATOR + ATYPE_PREFIX
    const parts = s.split(sep)
    const last = parts.pop()
    if (parts.length < 1 || !last) {
        return {value: s}
    }
    if (!/^[a-z](-\d+)?:?$/.test(last)) {
        return {value: s}
    }

    const typeAlias = ATYPE_PREFIX + last[0]
    const type = aliasToAtype(typeAlias)
    if (!type) {
        return {value: s}
    }
    const value = atypeize(parts.join(sep), type)
    if (last.length === 1) {
        return {value: value}
    }
    const persistent = last.endsWith(':')
    const exp = last.substring(2, persistent ? last.length - 1 : last.length)
    let expires: t_millisecond | null = NO_EXPIRES
    if (exp) {
        expires = Number(exp) * Minute
    }
    return {value: value, options: {persistent, expires, timeDiff: 0}}
}