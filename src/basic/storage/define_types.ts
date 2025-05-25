import {ForEachIterable} from '../../aa/atype/a_define_interfaces'
import {t_millisecond} from '../../aa/atype/a_define'

export interface StorageImpl extends Storage, ForEachIterable<string> {

}

export interface CookieOptions {
    domain?: string,
    expires?: t_millisecond | Date | string
    path?: string
    persistent?: boolean
    secure?: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
}