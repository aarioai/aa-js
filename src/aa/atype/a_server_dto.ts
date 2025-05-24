import {t_float64, t_uint, t_uint16, t_uint8, t_versiontag} from './a_define'

export type ResponseBody = {
    code: number,
    msg: string,
    data: unknown,
}

export type Paging = {
    page: t_uint,
    page_end: t_uint,
    page_size: t_uint8,
    offset: t_uint,
    limit: t_uint16,
    prev: t_uint,
    next: t_uint,
}

export type Location = {
    latitude: t_float64,
    longitude: t_float64,
    height: t_float64,
    name: string,
    address: string,
}

export type Coordinate = {
    latitude: t_float64,
    longitude: t_float64,
    height: t_float64,
}

export type Point = {
    x: t_float64,
    y: t_float64,
}

export type Version = {
    main: t_uint,
    major: t_uint,
    minor: t_uint,
    patch: t_uint,
    tag: t_versiontag
}