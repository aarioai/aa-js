import type {t_enum, t_uint64b} from '../aa/atype/a_define'

export type t_vtype = t_enum

export interface Vuser {
    vuid: t_uint64b
    vtype: t_vtype

    [key: string]: unknown
}

export type VuserMetadata = {
    vuser: Vuser
    sub_vusers?: Vuser[]
}

export type NormalizedVuserMetadata = {
    vuser: Vuser
    sub_vusers: Vuser[] | null
    selected_vuid: t_uint64b | null
}