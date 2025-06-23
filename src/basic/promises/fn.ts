import {AError} from "../../aa/aerror/error";
import {aerror} from "../../aa/aerror/fn";

export function asleep(delay: number, ...args: unknown[]) {
    return new Promise(resolve => setTimeout(resolve, delay, ...args))
}

export function asleepx(p: Promise<unknown>, delay: number, ...args: unknown[]): Promise<unknown> {
    return p.then(() => asleep(delay, ...args))
}


export function resolve<T = unknown>(value: T): Promise<T> {
    return Promise.resolve(value)
}

export function reject(err: string | Error | AError): Promise<never> {
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