import {AError} from "./error";
import {E_ClientThrow} from "./code";

export function aerror(e: number | string | Error | AError, msg?: string): AError {
    if (e instanceof AError) {
        return e
    }
    if (e instanceof Error) {
        return new AError(E_ClientThrow, e.toString())
    }
    return new AError(e, msg)
}

export function isOK(code: number): boolean {
    return code >= 200 && code < 300
}