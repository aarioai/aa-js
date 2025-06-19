import type {AnyMap, DictKey, ForEachIterable, Marshallable} from '../../aa/atype/a_define_interfaces'
import type {t_loopsignal} from '../../aa/atype/a_define_signals'


export type MapCallbackFn<V = unknown, K = string, T extends Map<K, V> = Map<K, V>> = (value: V, key: K, map: T) => void | t_loopsignal
export type CallbackFn<V = unknown, K = string> = (value: V, key: K) => void | t_loopsignal

export interface AaMapImpl<V = unknown> extends AnyMap, Marshallable<string> {
    [Symbol.toStringTag]: string
    readonly isAaMap: boolean
    readonly map: Map<string, V>
    readonly cast?: (value: unknown) => V

    keysArray(): string[]

    merge(source: AaMapImpl<V> | AnyMap<V> | undefined, overwrite: boolean): void

    reset(source?: KV<V, string>): this

    setMany(source?: KV<V, string>): this
}


export type KV<V = unknown, K extends DictKey = DictKey> =
    Record<DictKey, V>
    | AaMapImpl<V>
    | AnyMap<V>
    | Array<[K, V]>
    | {
    size: number,
    get(key: K): V | undefined | null,
    has(key: K): boolean,
    set(key: K, value: V): unknown
    delete(key: K): unknown
}

export type IterableKV<V = unknown, K extends DictKey = DictKey> = KV<V, K> | ForEachIterable<V, K>