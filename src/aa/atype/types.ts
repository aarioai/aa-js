export type Maps = Record<string, unknown>

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