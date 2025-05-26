import {t_millisecond, t_utc} from '../../aa/atype/a_define'

export const STORAGE_SEPARATOR = ' `'

export interface StorageImpl {
    readonly length: number

    key(index: number): string | null

    clear(options?: StorageOptions): void

    getItem(key: string): unknown

    removeItem(key: string): void

    removeItems(key: RegExp): void

    setItem(key: string, value: unknown, options?: StorageOptions): void
}


export type t_storage_expires = t_millisecond | Date | t_utc

export interface StorageOptions {
    expires?: t_storage_expires
    unclearable?: boolean
    timeDiff?: t_millisecond
}

export interface NormalizedStorageOptions {
    expires: t_millisecond | null
    unclearable: boolean
    timeDiff: t_millisecond
}

export interface CookieOptions extends StorageOptions {
    domain?: string,
    path?: string
    secure?: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
}