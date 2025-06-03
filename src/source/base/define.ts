import {t_filetype, t_float64, t_int, t_path, t_second, t_uint, t_url, t_url_pattern} from '../../aa/atype/a_define'

export type Provider = t_uint | string
export type t_resolution = [width: t_int, height: t_int]
export type t_filesrc = {
    provider: t_int
    url: t_url
    url_pattern: t_url_pattern
    alter_url_pattern: t_url_pattern
    base_url: t_url
    path: t_path
    filetype: t_filetype
    size: t_int
    info: string
    checksum: string
    jsonkey: string
}

export type t_audiosrc = t_filesrc & {
    bitrate: t_int  // bit per second
    duration: t_second
    sample_rate: t_int // HZ
}

export type t_docsrc = t_filesrc & {}

export type t_imgsrc = t_filesrc & {
    allowed: t_resolution[] | null
    crop_pattern: t_url_pattern
    height: t_int
    width: t_int
}

export type t_videosrc = t_filesrc & {
    allowed: t_resolution[] | null
    bitrate: t_int
    codec: string
    duration: t_second
    framerate: t_int
    height: t_int
    preview: t_imgsrc | null
    sample_rate: t_int
    width: t_int
}

export type Image = {
    url: t_url
    alterURL: t_url
    aspectRatio: t_float64
    css: t_resolution       // CSS display [width, height]
    real: t_resolution      // image real [width, height]
}