import {AError} from "../aerror/error";
import {aerror} from "../aerror/fn";

export function asleep(delay: number, ...args: unknown[]) {
    return new Promise(resolve => setTimeout(resolve, delay, ...args))
}

export function asleepx(p: Promise<unknown>, delay: number, ...args: unknown[]): Promise<unknown> {
    return p.then((...params) => asleep(delay, ...args));
}


export function resolve(value: unknown) {
    return Promise.resolve(value)
}

export function reject(err: string | Error | AError) {
    let reason: AError
    if (err instanceof AError) {
        reason = err
    } else if (err instanceof Error) {
        reason = aerror(err)
    } else {
        reason = new AError(err)
    }
    return Promise.reject(reason)
}


