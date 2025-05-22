export type t_safeint = number  // [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER] [-9007199254740991, 9007199254740991]
export type t_numeric = number | bigint | string
export type SortFunc = null | ((a: unknown, b: unknown) => number)

export type LoopSignal = string | undefined

export type t_httpmethod =
    'HEAD'
    | 'GET'
    | 'POST'
    | 'DELETE'
    | 'PUT'
    | 'PATCH'
    | 'OPTIONS'

export const HttpMethods: t_httpmethod[] = ['HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
export const HttpMethodReplacer = new RegExp('^(' + HttpMethods.join('|') + ')\\s+', 'i')



