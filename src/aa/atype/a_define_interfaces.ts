export type DictKey = string | number
export type Dict<V = unknown> = Record<string, V>  // same as {[key:string]:T

export type AnyMap<V = unknown> = Map<string, V>
export type StringMap = AnyMap<string>

export interface ValueOf<T = number> {
    valueOf(): T
}


export interface Marshallable<T = unknown> {
    toJSON(): T | null    // Decimal.toJSON() => string, Percent.toJSON() => number
}

export interface ForEachIterable<V = unknown, K = DictKey> {
    forEach(fn: (value: V, key: K) => void, thisArg?: unknown): void
}

export interface ForEachCopyable<V = unknown, K = DictKey> extends ForEachIterable<V, K> {
    get(key: K): unknown

    set(key: K, value: V): void
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
    static deserialize(serialized: string): Serializable {
        throw new Error(`${this.name} deserialization not implemented. Serialized string: ${serialized}`);
    }

    abstract serialize(): string | null
}


export function isSerializable(value: unknown): value is Serializable {
    if (!value || typeof value !== 'object') {
        return false
    }
    return value instanceof Serializable ||
        ('serialize' in value && typeof value.serialize === 'function' &&
            'constructor' in value &&
            'deserialize' in (value as any).constructor &&
            typeof (value as any).constructor.deserialize === 'function')
}