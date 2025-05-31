import {PATH_PARAMS_RAW, t_path_param, t_weekday} from './a_define'

export type t_loopsignal = '-.../.-././.-/-.-' | undefined | void
// a signal from callback function to break forEach((value,key)) iterator
export const BREAK: t_loopsignal = '-.../.-././.-/-.-'  // Morse code of BREAK
export const CONTINUE: t_loopsignal = undefined // return Continue in a loop is not important, but better for people to read

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods
export const HTTP_METHODS_RAW = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'TRACE']
export type t_httpmethod = typeof HTTP_METHODS_RAW[number]
export const HTTP_METHODS: Set<t_httpmethod> = new Set(HTTP_METHODS_RAW)
export const HTTP_METHOD_REGEXP = new RegExp('^(' + HTTP_METHODS_RAW.join('|') + ')\\s+', 'i')


export const PATH_PARAMS: t_path_param[] = PATH_PARAMS_RAW
export const path_param_string_t: t_path_param = ':string'
export const PATH_PARAM_TESTER = new RegExp(`^({|%7B|%257B)([_a-z]\\w*)(${PATH_PARAMS.join('|')})?(}|%7D|%257D)$`, 'i')  // %7B is encodeURIComponent('{')
export const PATH_PARAMS_MATCHER = new RegExp(`({|%7B|%257B)([_a-z]\\w*)(${PATH_PARAMS.join('|')})?(}|%7D|%257D)`, 'ig')   // {<key>} or {<key><type>}


export const INVALID_WEEKDAY = -1
export const SUNDAY: t_weekday = 0
export const MONDAY: t_weekday = 1
export const TUESDAY: t_weekday = 2
export const WEDNESDAY: t_weekday = 3
export const THURSDAY: t_weekday = 4
export const FRIDAY: t_weekday = 5
export const SATURDAY: t_weekday = 6