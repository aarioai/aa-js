import {AError} from "./error";
import {CODE_CLIENT_THROWING} from "./code";

export function aerror(e: number | string | Error | AError, msg?: string): AError {
    if (e instanceof AError) {
        return e
    }
    if (e instanceof Error) {
        return new AError(CODE_CLIENT_THROWING, e.toString())
    }
    return new AError(e, msg)
}

export function isOK(code: number | string): boolean {
    const c = Number(code)
    return c >= 200 && c < 300
}