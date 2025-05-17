import {Optional, Required} from "./env/const";
import {atype} from "./atype";

export class Panic extends Error {
}

export function assert(when: boolean, message: string) {
    if (when) {
        throw new Panic(message)
    }
}

/**
 * Panic when the value type is not matched
 *
 * @warn 不要滥用这个，会耗费不必要的性能。对于异步获取值的时候，最好使用，比如Promise 或 registry.Register的时候，应该使用！
 * @example
 *  panicOnErrorType(key, 'string')
 *  panicOnErrorType(key, ['string','number'])
 * panicOnErrorType(date, ['string', 'number', Date, time], OPTIONAL)
 */
export function panicOnErrorType(value: any, type: any, required: boolean = Required, allowEmpty: boolean = true) {
    if (required === Optional && (typeof value === 'undefined' || value === null)) {
        return
    }
    if (!allowEmpty && !value) {
        throw new TypeError('empty value')
    }
    const ty = atype(value)
    if (typeof type === 'string') {
        if (ty !== type && typeof value !== type) {
            throw new TypeError(`${ty}:${value} is not a ${type}`)
        }
        return
    }

    /**
     * typeof not callable class/function is 'function. e.g. typeof Aa ==> 'function'
     *      instance of RightHand Right-hand side of 'instanceof' is not callable
     */
    if (typeof type === 'function') {
        if (!(value instanceof type)) {
            throw new TypeError(`${ty} is not an instance of ${type.name}`)
        }
        return
    }

    if (Array.isArray(type)) {
        let matched = false
        for (let i = 0; i < type.length; i++) {
            try {
                panicOnErrorType(value, type[i])
                matched = true
                break
            } catch (err) {
            }
        }
        if (!matched) {
            throw new TypeError(`${ty}:${value} is not in types of (${type.join('|')})`)
        }
    }
}

