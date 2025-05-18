export type Maps = Record<string, any>

export interface ValueOf<T = number> {
    valueOf(): T
}