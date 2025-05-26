export type MapObject<T = unknown> = Record<string, T>  // same as {[key:string]:T

export type AnyMap<T = unknown> = Map<string, T>
export type StringMap = AnyMap<string>

export interface ValueOf<T = number> {
    valueOf(): T
}


export interface Marshallable<T = unknown> {
    toJSON(): T    // Decimal.toJSON() => string, Percent.toJSON() => number
}

export interface ForEachIterable<T = number | string> {
    forEach(fn: (value: unknown, key: T) => void, thisArg?: unknown): void
}

export interface ForEachCopyable<T = number | string> extends ForEachIterable<T> {
    get(key: T): unknown

    set(key: T, value: unknown): void
}

export interface ToStringable {
    toString(): string
}

export type Stringable = string | number | ToStringable

export type Builder<T> = new(...args: any[]) => T


/**
 * A class can serialize itself to a string, and revert itself with the string
 *
 * @example
 *  class A extends Serializable{
 *      value:int = 0
 *      constructor(value:int){
 *          this.value = value
 *      }
 *      static deserialize(s:string): A{
 *          return new A(Number(s))
 *      }
 *      serialize():string{
 *          return String(s)
 *      }
 *  }
 */
export default abstract class Serializable {
    static deserialize<T extends Serializable>(s: string): T {
        throw new Error("Not Implemented")
    }

    abstract serialize(): string

}


