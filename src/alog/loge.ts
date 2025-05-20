import {AError} from "../basic/aerror/error";
import * as log from "./log";

export function loge(err: Error | AError) {
    // AError extends Error
    if (err instanceof AError) {
        return err.isNotFound() ? log.debug(err.toString()) : log.error(err.toString())
    }

    if (err instanceof Error) {
        log.error(err.toString())
        return
    }
}