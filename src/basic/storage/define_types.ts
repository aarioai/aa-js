import type {t_expires, t_second, t_utc} from '../../aa/atype/a_define'
import type {Dict} from '../../aa/atype/a_define_interfaces'

export const STORAGE_SEPARATOR = '  |'

export interface StorageImpl {
    readonly length: number
    enableDebug: boolean

    key(index: number): string | null

    clear(options?: StorageOptions): void

    getItem<T = unknown>(key: string): T | null

    getItemWithTTL<T = unknown>(key: string): [T | null, t_expires] | null

    getItems(key: (RegExp | string)[] | RegExp | string, ...keys: (RegExp | string)[]): Dict | null

    removeItem(key: string): void

    removeItems(keys: (RegExp | string)[] | RegExp | string): void

    setItem(key: string, value: unknown, options?: StorageOptions): void
}


export type t_storage_expires = t_expires | Date | t_utc

export interface StorageOptions {
    expiresIn?: t_storage_expires | null
    unclearable?: boolean
    timeDiff?: t_second
}

export interface NormalizedStorageOptions {
    expiresIn: t_expires | null
    unclearable: boolean
    timeDiff: t_second
}

export interface CookieOptions extends StorageOptions {
    domain?: string,
    path?: string
    secure?: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
}

export interface InsertCondition {
    is?: string | RegExp | (string | RegExp)[]  //  matching `is` can overwrite matching `not`
    not?: string | RegExp | (string | RegExp)[]
}

export interface DbLikeImpl {
    delete(tableName: string, key: string): void

    drop(tableName: string): void

    find<T = unknown>(tableName: string, key: string): T | null

    findWithTTL<T = unknown>(tableName: string, key: string): [T, t_expires] | null

    findMany(tableName: string, keys: string[]): Dict | null

    findAll(tableName: string): Dict | null

    insert(tableName: string, key: string, value: unknown, options?: StorageOptions): void

    insertMany(tableName: string, data: Dict, options?: StorageOptions): void

    insertWhen(tableName: string, data: Dict, when: InsertCondition, options?: StorageOptions): void
}