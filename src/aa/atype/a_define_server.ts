// @see ./t_basic.ts

import {t_safeint} from './a_define'

export type t_booln = 0 | 1
export type t_char = string  // single character in ASCII characters [32, 126]
export type t_float64 = number
export type t_float32 = number
export type t_int8 = number
export type t_int16 = number
export type t_int24 = number
export type t_int32 = number
export type t_int = t_int32
export type t_int64b = bigint   // js number only support int53
export type t_uint8 = number
export type t_uint16 = number
export type t_uint24 = number
export type t_uint32 = number
export type t_uint = t_uint32
export type t_uint64b = bigint   // js number only support uint53
export type t_bin = string  // binary string
export type t_bitpos = t_uint8
export type t_bitposition = t_uint16

export type t_millisecond = t_safeint
export type t_second = t_safeint

export const pathParams = [
    ':bool',
    ':int8',
    ':int16',  // no :int24 and :uint24, floats
    ':int32',
    ':int',
    ':int64',
    ':uint8',
    ':uint16',
    ':uint32',
    ':uint',
    ':uint64',
    ':string',
    ':uuid',
    ':alphabetical',
    ':email',
    ':mail',     // mail is same to email, but mail without server domain validation
    ':weekday',
]
// @see ./t_path_param.ts
export type t_path_param = typeof pathParams[number]
export type t_uuid = string       // 32 or 36 bytes, 8-4-4-4-12
export type t_digits = string  // \d+
export type t_lowers = string // [a-z]+
export type t_uppers = string  // [A-Z]+
export type t_alphabetical = string // [a-zA-Z]+
export type t_alphadigits = string   // [a-zA-Z\d]+
export type t_word = string         //  \w+
export type t_email = string
export type t_weekday = t_int8        // [0-6] from sunday to saturday, -1 to invalid weekday

// @see ./t_path.ts

export type t_filetype = string
export type t_std_filename = string         // [\w-.]+ // standard file name
export type t_filename = string// [\w-.!@#$%^&(){}~]+ , unicode filename
export type t_std_path = string         // [\w-.\/]+
export type t_path = string // [\w-.!@#$%^&(){}~/]+ , unicode path
export type t_url = string  // e.g. https://xxx/video.avi?quality=80
export type t_filename_pattern = string // e.g. {name}_{size:int}.avi
export type t_path_pattern = string   // e.g. /a/b/{name}_{size:int}.avi
export type t_url_pattern = string // e.g. https://xxx/{user}/video.avi?quality={quality:int}

// @see ./t_path_mime.ts

export type t_filepath = string
export type t_documentpath = t_filepath
export type t_imagepath = t_filepath
export type t_videopath = t_filepath
export type t_audiopath = t_filepath


// @see ./t_decimal.ts

export type t_round = t_uint8
export type t_decimal = t_int64b
export type t_percent = t_int32  // Percent is number, not big int
export type t_money = t_decimal
export type t_vmoney = t_money

// @see ./t_date.ts

export type t_year = t_uint16  // 4 digits number, format YYYY
export type t_yearmonth = t_uint24  // 6 digits number, format YYYYMM
export type t_ymd = t_uint32  // 8 digits number, format YYYYMMDD
export type t_date = string // format YYYY-MM-DD
export type t_datetime = string // format YYYY-MM-DD HH:II:SS
export type t_timestamp = t_safeint  // unix timestamp

// @see ./t_district.ts

export type t_province = number  // 2 digits province district code
export type t_dist = number       // 4 digits district code
export type t_distri = number   // 6 digits district code
export type t_district = number  // 12 digits district code

// @see ./t_version.ts

export type t_version = number  // Semantic Versioning https://semver.org/lang/zh-CN/
export type t_versiontag = t_uint8

