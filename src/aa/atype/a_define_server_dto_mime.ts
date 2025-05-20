import {t_int, t_path, t_uint8} from './a_define_server'

export type ImagePattern = {
    height: t_int,
    width: t_int,
    quality: t_uint8,
    max_width: t_int,
    min_width: t_int,
    watermark: string
}

export type AudioSrc = {
    provider: t_int,
    pattern: string,
    origin: string,
    path: t_path,
    filetype: string,
    size: t_int,
    duration: t_int,
    jsonkey: string,
}

export type DocumentSrc = {
    provider: t_int,
    pattern: string,
    origin: string,
    path: t_path,
    size: t_int,
    duration: t_int,
    jsonkey: string,
}