import {AError} from "./error";
import {E_ClientThrow} from "./code";
import {ResponseBody} from "../aa/env/const";
import {MissingResponseBody, ParseResponseBodyFailed} from "./error_standard";

export function aerror(e: number | string | Error | AError, msg?: string): AError {
    if (e instanceof AError) {
        return e
    }
    if (e instanceof Error) {
        return new AError(E_ClientThrow, e.toString())
    }
    return new AError(e, msg)
}

export function parseResponseAError(resp: undefined | string | ResponseBody): AError {
    if (!resp) {
        return MissingResponseBody
    }
    if (typeof resp === "string") {
        const s = resp.trim()
        try {
            resp = JSON.parse(s) as ResponseBody
        } catch (err) {
            return ParseResponseBodyFailed.addDetail(s)
        }
    }
    return new AError(resp['code'], resp['msg'])
}