export type MapObject<T = unknown> = Record<string, T>  // same as {[key:string]:T

export type AnyMap<T = unknown> = Map<string, T>

export interface ValueOf<T = number> {
    valueOf(): T
}


export interface Marshallable<T = unknown> {
    toJSON(): T    // Decimal.toJSON() => string, Percent.toJSON() => number
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