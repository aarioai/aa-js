import {AError} from "./error";
import {E_ClientThrow} from "./code";
import {E_MissingResponseBody, E_ParseResponseBodyFailed} from "./errors";
import {ResponseBody} from '../../aa/atype/a_server_dto'

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
        return E_MissingResponseBody
    }
    if (typeof resp === "string") {
        const s = resp.trim()
        try {
            resp = JSON.parse(s) as ResponseBody
        } catch (err) {
            return E_ParseResponseBodyFailed.addDetail(s)
        }
    }
    return new AError(resp['code'], resp['msg'])
}