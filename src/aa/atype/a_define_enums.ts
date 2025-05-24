import {PATH_PARAMS_RAW, t_path_param, t_weekday} from './a_define'

export type t_loopsignal = '-.../.-././.-/-.-' | undefined
// a signal from callback function to break forEach((value,key)) iterator
export const BREAK: t_loopsignal = '-.../.-././.-/-.-'  // Morse code of BREAK
export const CONTINUE: t_loopsignal = undefined // return Continue in a loop is not important, but better for people to read


export type t_httpmethod =
    'HEAD'
    | 'GET'
    | 'POST'
    | 'DELETE'
    | 'PUT'
    | 'PATCH'
    | 'OPTIONS'
export const HTTP_METHODS: t_httpmethod[] = ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
export const HTTP_METHOD_REGEXP = new RegExp('^(' + HTTP_METHODS.join('|') + ')\\s+', 'i')


export const PATH_PARAMS: t_path_param[] = PATH_PARAMS_RAW
export const path_param_string_t: t_path_param = ':string'
export const PATH_PARAM_TEST_REGEXP = new RegExp(`^({|%7B|%257B)([_a-z]\\w*)(${PATH_PARAMS.join('|')})?(}|%7D|%257D)$`, 'i')  // %7B is encodeURIComponent('{')
export const PATH_PARAMS_REGEXP = new RegExp(`({|%7B|%257B)([_a-z]\\w*)(${PATH_PARAMS.join('|')})?(}|%7D|%257D)`, 'ig')   // {<key>} or {<key><type>}


export const INVALID_WEEKDAY = -1
export const SUNDAY: t_weekday = 0
export const MONDAY: t_weekday = 1
export const TUESDAY: t_weekday = 2
export const WEDNESDAY: t_weekday = 3
export const THURSDAY: t_weekday = 4
export const FRIDAY: t_weekday = 5
export const SATURDAY: t_weekday = 6