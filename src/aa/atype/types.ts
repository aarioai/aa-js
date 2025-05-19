export type Maps = Record<string, any>

export interface ValueOf<T = number> {
    valueOf(): T
}

export interface ToStringable {
    toString(): string
}

export type Stringable = string | number | ToStringable