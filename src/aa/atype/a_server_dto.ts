import type {t_expires, t_float64, t_uint, t_uint16, t_uint8, t_versiontag} from './a_define'
import type {Dict} from './a_define_interfaces'

export type ResponseBodyData = Dict | string | null
export type ResponseBody = {
    code: number,
    msg: string,
    data: ResponseBodyData,
}


// https://www.rfc-editor.org/rfc/rfc6749#section-4.2.2
export type t_usertoken_key =
    'access_token'
    | 'expires_in'
    | 'refresh_token'
    | 'scope'
    | 'state'
    | 'token_type'
    | 'attach'

export type UserTokenAttach = {
    refresh_api?: string
    refresh_ttl?: t_expires
    secure?: boolean
    validate_api?: string
    [key: string]: unknown
}
export type UserToken = {
    access_token?: string
    expires_in?: t_expires
    refresh_token?: string
    scope?: Dict
    state?: string
    token_type?: string

    attach?: UserTokenAttach
}

export type NormalizedUserToken = {
    access_token: string | null
    expires_in: t_expires | null
    refresh_token: string | null
    scope: Dict | null
    state: string | null
    token_type: string | null

    attach: UserTokenAttach | null
}

export type Paging = {
    page: t_uint
    page_end: t_uint
    page_size: t_uint8
    offset: t_uint
    limit: t_uint16
    prev: t_uint
    next: t_uint
}

export type Location = {
    latitude: t_float64
    longitude: t_float64
    height: t_float64
    name: string
    address: string
}

export type Coordinate = {
    latitude: t_float64
    longitude: t_float64
    height: t_float64
}

export type Point = {
    x: t_float64
    y: t_float64
}

export type Version = {
    main: t_uint
    major: t_uint
    minor: t_uint
    patch: t_uint
    tag: t_versiontag
}