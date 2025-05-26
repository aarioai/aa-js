import {ForEachIterable} from '../../aa/atype/a_define_interfaces'
import {t_second, t_utc} from '../../aa/atype/a_define'

export const STORAGE_SEPARATOR = ' `'

export interface StorageImpl extends Storage, ForEachIterable<string> {

}


export type t_storage_expires = t_second | Date | t_utc | null
export const NO_EXPIRES: t_storage_expires = null

export interface StorageOptions {
    expires?: t_storage_expires
    persistent?: boolean
}

export interface CookieOptions extends StorageOptions {
    domain?: string,
    path?: string
    secure?: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
}