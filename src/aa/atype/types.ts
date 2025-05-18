export type Maps = { [key: string]: any }

export interface ValueOf<T = number> {
    valueOf(): T
}