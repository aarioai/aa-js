import * as ae from "./code";

export const AErrorMessages: [number, string][] = [
    [ae.E_Continue, "Continue"],
    [ae.E_SwitchingProtocols, "Switching Protocols"],
    [ae.E_Processing, "Processing"],
    [ae.E_EarlyHints, "Early Hints"],

    [ae.E_OK, "OK"],
    [ae.E_Created, "Created"],
    [ae.E_Accepted, "Accepted"],
    [ae.E_NonAuthoritativeInformation, "Non-Authoritative Information"],
    [ae.E_NoContent, "No Content"],
    [ae.E_ResetContent, "Reset Content"],
    [ae.E_PartialContent, "Partial Content"],
    [ae.E_MultiStatus, "Multi-Status"],
    [ae.E_AlreadyReported, "Already Reported"],
    [ae.E_IMUsed, "IM Used"],

    [ae.E_MultipleChoices, "Multiple Choices"],
    [ae.E_MovedPermanently, "Moved Permanently"],
    [ae.E_Found, "Found"],
    [ae.E_SeeOther, "See Other"],
    [ae.E_NotModified, "Not Modified"],
    [ae.E_UseProxy, "Use Proxy"],
    [ae.E_TemporaryRedirect, "Temporary Redirect"],
    [ae.E_PermanentRedirect, "Permanent Redirect"],
    [ae.E_FailedAndSeeOther, "FailedAnd See Other"],

    [ae.E_BadRequest, "Bad Request"],
    [ae.E_Unauthorized, "Unauthorized"],
    [ae.E_PaymentRequired, "Payment Required"],
    [ae.E_Forbidden, "Forbidden"],
    [ae.E_NotFound, "Not Found"],
    [ae.E_MethodNotAllowed, "Method Not Allowed"],
    [ae.E_NotAcceptable, "Not Acceptable"],
    [ae.E_ProxyAuthRequired, "Proxy AuthRequired"],
    [ae.E_Timeout, "Timeout"],
    [ae.E_Conflict, "Conflict"],
    [ae.E_Gone, "Gone"],
    [ae.E_LengthRequired, "Length Required"],
    [ae.E_PreconditionFailed, "Precondition Failed"],
    [ae.E_RequestEntityTooLarge, "Request Entity Too Large"],
    [ae.E_RequestTargetInvalid, "Request Target Invalid"],
    [ae.E_UnsupportedMediaType, "Unsupported Media Type"],
    [ae.E_RequestedRangeNotSatisfiable, "Requested Range Not Satisfiable"],
    [ae.E_ExpectationFailed, "Expectation Failed"],
    [ae.E_PageExpired, "Page Expired"],
    [ae.E_EnhanceYourCalm, "Enhance Your Calm"],
    [ae.E_Locked, "Locked"],
    [ae.E_FailedDependency, "Failed Dependency"],
    [ae.E_TooEarly, "Too Early"],
    [ae.E_UpgradeRequired, "Upgrade Required"],
    [ae.E_PreconditionRequired, "Precondition Required"],
    [ae.E_TooManyRequests, "Too Many Requests"],
    [ae.E_RequestHeaderFieldsTooLarge, "Request Header Fields TooLarge"],
    [ae.E_LoginTimeOut, "Login TimeOut"],
    [ae.E_NoResponse, "No Response"],
    [ae.E_UnavailableForLegalReasons, "Unavailable For Legal Reasons"],
    [ae.E_RetryWith, "Retry With"],
    [ae.E_NoRowsAvailable, "No Rows Available"],
    [ae.E_ConflictWith, "Conflict With"],

    [ae.E_InternalServerError, "Internal Server Error"],
    [ae.E_NotImplemented, "Not Implemented"],
    [ae.E_BadGateway, "Bad Gateway"],
    [ae.E_ServerUnavailable, "Server Unavailable"],
    [ae.E_GatewayTimeout, "Gateway Timeout"],
    [ae.E_VariantAlsoNegotiates, "Variant Also Negotiates"],
    [ae.E_InsufficientStorage, "Insufficient Storage"],
    [ae.E_LoopDetected, "Loop Detected"],
    [ae.E_NotExtended, "Not Extended"],
    [ae.E_NetworkAuthenticationRequired, "Network Authentication Required"],
    [ae.E_Exception, "Exception"],
    [ae.E_ClientThrow, "Client Throw"],
]


export function code2msg(code: number): string {
    for (let i = 0; i < AErrorMessages.length; i++) {
        let p = AErrorMessages[i]
        if (p[0] === code) {
            return p[1]
        }
    }
    return "code: " + code
}