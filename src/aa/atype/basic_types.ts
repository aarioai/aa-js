export type t_bin = string  // binary string
export type t_booln = 0 | 1

export type t_numeric = number | string
export type t_int8 = number
export type t_int16 = number
export type t_int24 = number
export type t_int32 = number
export type t_intMax = number
export type t_int64 = string   // js number only support int53
export type t_uint8 = number
export type t_uint16 = number
export type t_uint24 = number
export type t_uint32 = number
export type t_uintMax = number
export type t_uint64 = string   // js number only support uint53
export type t_float32 = number
export type t_float64 = number

export type t_decimal = t_intMax
export type t_money = t_decimal
export type t_vmoney = t_money

export type t_year = t_uint16  // 4 digits number, format YYYY
export type t_yearmonth = t_uint24  // 6 digits number, format YYYYMM
export type t_ymd = t_uint32  // 8 digits number, format YYYYMMDD
export type t_date = string // format YYYY-MM-DD
export type t_datetime = string // format YYYY-MM-DD HH:II:SS
export type t_timestamp = t_int64  // unix timestamp


export type t_percent = number

export type t_province = number  // 2 digits province district code
export type t_dist = number       // 4 digits district code
export type t_distri = number   // 6 digits district code
export type t_district = number  // 12 digits district code


export type t_version = number  // Semantic Versioning https://semver.org/lang/zh-CN/
