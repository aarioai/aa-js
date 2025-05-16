import {AError} from "./error";

export function aerror(code: number | string | Error | AError, msg?: string): AError {
    if (code instanceof AError) {
        return code
    }
    return new AError(code, msg)
}