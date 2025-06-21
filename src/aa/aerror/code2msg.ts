import * as ae from "./code";
import {CODE_CLIENT_THROWING} from "./code";

export const AErrorMessages: [number, string][] = [
    [ae.CODE_CONTINUE, "Continue"],
    [ae.CODE_SWITCHING_PROTOCOLS, "Switching Protocols"],
    [ae.CODE_PROCESSING, "Processing"],
    [ae.CODE_EARLY_HINTS, "Early Hints"],

    [ae.CODE_OK, "OK"],
    [ae.CODE_CREATED, "Created"],
    [ae.CODE_ACCEPTED, "Accepted"],
    [ae.CODE_NON_AUTHORITATIVE_INFORMATION, "Non-Authoritative Information"],
    [ae.CODE_NO_CONTENT, "No Content"],
    [ae.CODE_RESET_CONTENT, "Reset Content"],
    [ae.CODE_PARTIAL_CONTENT, "Partial Content"],
    [ae.CODE_MULTI_STATUS, "Multi-Status"],
    [ae.CODE_ALREADY_REPORTED, "Already Reported"],
    [ae.CODE_IM_USED, "IM Used"],

    [ae.CODE_MULTIPLE_CHOICES, "Multiple Choices"],
    [ae.CODE_MOVED_PERMANENTLY, "Moved Permanently"],
    [ae.CODE_FOUND, "Found"],
    [ae.CODE_SESS_OTHER, "See Other"],
    [ae.CODE_NOT_MODIFIED, "Not Modified"],
    [ae.CODE_USE_PROXY, "Use Proxy"],
    [ae.CODE_TEMPORARY_REDIRECT, "Temporary Redirect"],
    [ae.CODE_PERMANENT_REDIRECT, "Permanent Redirect"],
    [ae.CODE_FAILED_AND_SEE_OTHER, "FailedAnd See Other"],

    [ae.CODE_BAD_REQUEST, "Bad Request"],
    [ae.CODE_UNAUTHORIZED, "Unauthorized"],
    [ae.CODE_PAYMENT_REQUIRED, "Payment Required"],
    [ae.CODE_FORBIDDEN, "Forbidden"],
    [ae.CODE_NOT_FOUND, "Not Found"],
    [ae.CODE_METHOD_NOT_ALLOWED, "Method Not Allowed"],
    [ae.CODE_NOT_ACCEPTABLE, "Not Acceptable"],
    [ae.CODE_PROXY_AUTH_REQUIRED, "Proxy AuthRequired"],
    [ae.CODE_TIMEOUT, "Timeout"],
    [ae.CODE_CONFLICT, "Conflict"],
    [ae.CODE_GONE, "Gone"],
    [ae.CODE_LENGTH_REQUIRED, "Length Required"],
    [ae.CODE_PRECONDITION_FAILED, "Precondition Failed"],
    [ae.CODE_REQUEST_ENTITY_TOO_LARGE, "Request Entity Too Large"],
    [ae.CODE_REQUEST_TARGET_INVALID, "Request Target Invalid"],
    [ae.CODE_UNSUPPORTED_MEDIA_TYPE, "Unsupported Media Type"],
    [ae.CODE_REQUESTED_RANGE_NOT_SATISFIABLE, "Requested Range Not Satisfiable"],
    [ae.CODE_EXPECTATION_FAILED, "Expectation Failed"],
    [ae.CODE_PAGE_EXPIRED, "Page Expired"],
    [ae.CODE_ENHANCE_YOUR_CALM, "Enhance Your Calm"],
    [ae.CODE_LOCKED, "Locked"],
    [ae.CODE_FAILED_DEPENDENCY, "Failed Dependency"],
    [ae.CODE_TOO_EARLY, "Too Early"],
    [ae.CODE_UPGRADE_REQUIRED, "Upgrade Required"],
    [ae.CODE_PRECONDITION_REQUIRED, "Precondition Required"],
    [ae.CODE_TOO_MANY_REQUESTS, "Too Many Requests"],
    [ae.CODE_REQUEST_HEADER_FIELDS_TOO_LARGE, "Request Header Fields Too Large"],
    [ae.CODE_LOGIN_TIMEOUT, "Login Time-out"],
    [ae.CODE_NO_RESPONSE, "No Response"],
    [ae.CODE_UNAVAILABLE_FOR_LEGAL_REASONS, "Unavailable For Legal Reasons"],
    [ae.CODE_RETRY_WITH, "Retry With"],
    [ae.CODE_NO_ROWS_AVAILABLE, "No Rows Available"],
    [ae.CODE_CONFLICT_WITH, "Conflict With"],

    [ae.CODE_INTERNAL_SERVER_ERROR, "Internal Server Error"],
    [ae.CODE_NOT_IMPLEMENTED, "Not Implemented"],
    [ae.CODE_BAD_GATEWAY, "Bad Gateway"],
    [ae.CODE_SERVER_UNAVAILABLE, "Server Unavailable"],
    [ae.CODE_GATEWAY_TIMEOUT, "Gateway Timeout"],
    [ae.CODE_VARIANT_ALSO_NEGOTIATES, "Variant Also Negotiates"],
    [ae.CODE_INSUFFICIENT_STORAGE, "Insufficient Storage"],
    [ae.CODE_LOOP_DETECTED, "Loop Detected"],
    [ae.CODE_NOT_EXTENDED, "Not Extended"],
    [ae.CODE_NETWORK_AUTHENTICATION_REQUIRED, "Network Authentication Required"],
    [ae.CODE_EXCEPTION, "Exception"],
    [ae.CODE_CLIENT_THROWING, "Client Throw"],
]


export function code2msg(code: number): string {
    for (const [c, msg] of AErrorMessages) {
        if (c === code) {
            return msg
        }
    }
    return "code: " + code
}

export function msg2code(message: string): number {
    const m = message.toLocaleUpperCase().replace(/[^A-Z\d]/g, '')
    for (const [code, msg] of AErrorMessages) {
        if (msg.toLocaleUpperCase().replace(/[^A-Z\d]/g, '') === m) {
            return code
        }
    }
    return CODE_CLIENT_THROWING
}