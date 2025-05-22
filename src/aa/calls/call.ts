import {Second} from "../atype/const_unit";
import {Break} from "../atype/const";
import {formatArguments} from "../format/format";

/**
 *  Executes a function once a readiness condition is met, with retry logic.
 * @example
 * // Basic usage
 * once(() => document.readyState === 'complete', () => console.log('DOM is ready'), 200)
 *
 * // With custom retry count
 * once(() => someCondition(), () => doSomething(), 100, 10)
 */
export function once(ready: () => boolean, run: () => void, interval: number, retry?: number): void {
    if (ready()) {
        run()
        return
    }
    if (typeof retry !== 'number') {
        retry = Math.ceil(5 * Second / interval)
    }
    if (retry <= 0) {
        return
    }

    setTimeout(() => {
        once(ready, run, interval, retry === Infinity ? Infinity : (retry - 1))
    }, interval)
}

/**
 * Run forever
 */
function forever(run: (i: number) => unknown, interval: number, i: number = 0) {
    if (run(i) === Break) {
        return
    }
    setTimeout(() => {
        forever(run, interval, i + 1)
    }, interval)
}

/**
 * Try call the method if the method is a function
 */
export function safeCall<T = unknown>(fn: ((...args: unknown[]) => T) | null | undefined, ...args: unknown[]): T | null {
    if (!fn) {
        return null
    }
    if (typeof fn !== 'function') {
        console.error('safeCall expected a function, but got', fn)
        return null
    }
    return fn(...formatArguments(...args))
}