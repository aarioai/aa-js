import {t_loopsignal} from './a_define_enums'

export type MapObject<T = unknown> = Record<string, T>  // same as {[key:string]:T
export type StringMap = Map<string, string>

export type AnyMap = Map<string, unknown>

export type Callback<V = unknown, K = unknown> = (value: V, key: K) => void | t_loopsignal

export interface ValueOf<T = number> {
    valueOf(): T
}


export interface Marshallable<T = unknown> {
    toJSON(): T    // Decimal.toJSON() => string, Percent.toJSON() => number
}

export interface MapObjectable extends Marshallable<string> {
    size: number

    clear(): unknown

    delete(key: string, value?: unknown): unknown

    forEach(callback: Callback<string, string>, thisArg?: unknown): unknown

    get(key: string): unknown

    has(name: string, value?: unknown): boolean

    set(name: string, value: unknown): unknown

    toMap(): Map<string, unknown>

    entries(): IterableIterator<Array<unknown>>

    keys(): MapIterator<string>     // Array.from(keys()) converts iterator to an array

    values(): MapIterator<unknown>

    [Symbol.iterator](): IterableIterator<Array<unknown>>
}


export interface ForEachIterable<T = number | string> {
    forEach(fn: (value: unknown, key: T) => void, thisArg?: unknown): void
}


export interface ForEachCopyable<T = number | string> {
    forEach(fn: (value: unknown, key: T) => void, thisArg?: unknown): void

    get(key: T): unknown

    set(key: T, value: unknown): void
}

export interface ToStringable {
    toString(): string
}

export type Stringable = string | number | ToStringable

export type Builder<T> = new(...args: any[]) => T