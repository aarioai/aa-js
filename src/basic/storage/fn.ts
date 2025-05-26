import {NO_EXPIRES, STORAGE_SEPARATOR, StorageOptions, t_storage_expires} from './define_types'
import {aliasToAtype, ATYPE_PREFIX, detectAtypeAlias} from '../../aa/atype/t_atype'
import {a_string} from '../../aa/atype/t_basic'
import {Second} from '../../aa/atype/a_define_units'
import {atypeize} from '../../aa/dynamics/atype'


function normalizeStorageExpires(expires: t_storage_expires): number {
    if (expires === undefined || expires === null) {
        return null     // no expires
    }
    if (!expires) {
        return 0   // expired
    }

    if (typeof expires === 'number') {
        return expires
    }
    if (typeof expires === 'string') {
        expires = new Date(expires)
    }

    if (!(expires instanceof Date)) {
        return 0
    }

    return Math.floor((Date.now() - expires.getTime()) / Second)
}

function normalizeStorageOptions(options: StorageOptions): StorageOptions {
    return {
        expires: normalizeStorageExpires(options.expires),
        persistent: options.persistent ?? false,
    }
}

function encodeStorageOptions(options: StorageOptions): string {
    if (!options) {
        return ''
    }
    const expires = options.expires ? ('-' + options.expires) : ''
    const persis = options?.persistent ? ':' : ''
    return `${expires}${persis}`
}

export function encodeStorageValue(value: unknown, options?: StorageOptions): string {
    options = normalizeStorageOptions(options)
    if (!options!.expires && options.expires !== NO_EXPIRES) {
        return ''
    }

    const [_, typeAlias] = detectAtypeAlias(value)  // including Serializable class
    const s = a_string(value)
    const opts = encodeStorageOptions(options)
    return `${s}${STORAGE_SEPARATOR}${typeAlias}${opts}`
}

export function decodeStorageValue(s: string): { value: unknown, options: StorageOptions } {
    if (!s) {
        return {value: null, options: {}}
    }
    const sep = STORAGE_SEPARATOR + ATYPE_PREFIX
    const parts = s.split(sep)
    const last = parts.pop()
    if (parts.length < 1 || !last) {
        return {value: s, options: {}}
    }
    if (!/^[a-z](-\d+)?:?$/.test(last)) {
        return {value: s, options: {}}
    }

    const typeAlias = ATYPE_PREFIX + last[0]
    const type = aliasToAtype(typeAlias)
    if (!type) {
        return {value: s, options: {}}
    }
    const value = atypeize(parts.join(sep), type)
    if (last.length === 1) {
        return {value: value, options: {}}
    }
    const persistent = last.endsWith(':')
    const exp = last.substring(2, persistent ? last.length - 1 : last.length)
    let expires: t_storage_expires = NO_EXPIRES
    if (exp) {
        expires = Number(exp)
    }
    return {value: value, options: {persistent, expires}}
}