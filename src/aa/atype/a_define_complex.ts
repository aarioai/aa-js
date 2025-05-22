import {LoopSignal} from './a_define'

export type MapObject<T = unknown> = Record<string, T>  // same as {[key:string]:T
export type StringMap = Map<string, string>
export type AnyMap = Map<string, unknown>

export type Callback<V = unknown, K = unknown> = (value: V, key: K) => void | LoopSignal

export interface ValueOf<T = number> {
    valueOf(): T
}

export interface ToJSON<T = unknown> {
    toJSON(): unknown    // Decimal.toJSON() => string, Percent.toJSON() => number
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