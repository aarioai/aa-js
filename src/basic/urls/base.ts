import {a_booln, a_string, int16, int32, int64b, int8, uint16, uint32, uint64b, uint8} from '../../aa/atype/t_basic'
import {t_path_param} from '../../aa/atype/a_define_server'
import {AnyMap, MapObject} from '../../aa/atype/a_define_complex'

export type SearchParamsType = MapObject<string>
export type ParamsType = MapObject | URLSearchParams | AnyMap
/**
 * A URL string with iris-like routing path pattern {<key>} or {<key>:<type>}
 * <key> must starts with a _ or alphabet, and only contains _, alphabets or numbers
 * <type> must starts with a small-case alphabet, and only contains small-case alphabets and numbers
 *
 * @example
 * userAPI: URLPattern = 'https://luexu.com/api/v1/users/{uid:uint64}'
 * userAPI: URLPattern = 'https://luexu.com/api/v1/users/{uid}'
 * usersAPI: URLPattern = '/api/v1/groups/{group}/users/page/{page:uint}
 */
export type URLPattern = string
 
export type PathParamMap = Map<string, t_path_param>


export class URLPathError extends Error {

}

export function safePathParamValue(value: unknown, type: t_path_param): string {
    if (value === undefined || value === null || value === '') {
        return ''
    }
    if (!type) {
        return a_string(value)
    }
    switch (type) {
        case ':bool':
            return String(a_booln(value as any))
        case ':int8':
            return String(int8(value as any))
        case ':int16':
            return String(int16(value as any))
        case ':int32':
        case ':int':
            return String(int32(value as any))
        case ':int64':
            return String(int64b(value as any))
        case ':uint8':
            return String(uint8(value as any))
        case ':uint16':
            return String(uint16(value as any))
        case ':uint32':
        case ':uint':
            return String(uint32(value as any))
        case ':uint64':
            return String(uint64b(value as any))
        default:
            return a_string(value)  // :string, :alphabetical, :uuid, :email, :mail, :weekday
    }
}