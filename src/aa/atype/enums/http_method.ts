// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods
export enum HttpMethod {
    CONNECT,
    DELETE,
    GET,
    HEAD,
    OPTIONS,
    POST,
    PUT,
    PATCH,
    TRACE
}

export type t_httpmethod = keyof typeof HttpMethod
export const HttpMethods: Set<t_httpmethod> = new Set(Object.keys(HttpMethod) as t_httpmethod[])
export const JOINT_HTTP_METHODS = Object.keys(HttpMethod).join('|')
export const HTTP_METHOD_REGEXP = new RegExp('^(' + JOINT_HTTP_METHODS + ')\\s+', 'i')