import {Break, ZeroValues} from "./a_const";
import {formatArguments} from "./format";

/**
 * Sets a property on an object if the property doesn't exist or matches an excluded value.
 * Creates a new object/array if the target doesn't exist.
 *
 * @example
 * // Basic usage
 * const obj = {};
 * setIfNotExists(obj, 'name', 'John'); // { name: 'John' }
 *
 * // With excluded values
 * const arr = [1, 2, 3];
 * setIfNotExists(arr, 1, 99, [2]); // [1, 99, 3]
 *
 * // Auto-create target
 * setIfNotExists(null, 'a', 1); // { a: 1 }
 */
export function setNX<T extends object, K extends keyof any>(target: T, key: K, value: any, exclude?: any[]): T {
    if (!target) {
        target = (typeof key === 'number' ? [] : {}) as T
    }

    const v = (target as any)[key]
    if (typeof v === 'undefined') {
        (target as any)[key] = value
        return target
    }

    if (exclude?.length) {
        let v = (target as any)[key]
        for (let i = 0; i < exclude.length; i++) {
            let ex = exclude[i]
            if (v === ex || (typeof v === "number" && typeof ex === "number" && isNaN(ex) && isNaN(v))) {
                (target as any)[key] = value
                break
            }
        }
    }

    return target
}


export function setNotZero<T extends object, K extends keyof any>(target: T, key: K, value: any): T {
    return setNX(target, key, value, ZeroValues)
}

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
        retry = Math.ceil(5000 / interval)
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
function forever(run: (i: number) => any, interval: number, i: number = 0) {
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
export function safeCall<T = any>(fn: ((...args: any[]) => T) | null | undefined, ...args: any[]): T | null {
    if (!fn) {
        return null
    }
    if (typeof fn !== 'function') {
        console.error('safeCall expected a function, but got', fn)
        return null
    }
    return fn(...formatArguments(...args))
}