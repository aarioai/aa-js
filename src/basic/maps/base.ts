import {AnyMap, Dict, ForEachIterable, Marshallable} from '../../aa/atype/a_define_interfaces'
import {t_loopsignal} from '../../aa/atype/a_define_enums'


export type MapCallbackFn<V = unknown, K = string, T = Map<K, V>> = (value: V, key: K, map?: T) => void | t_loopsignal


export interface AaMapImpl<V = unknown> extends AnyMap, Marshallable<string> {
    [Symbol.toStringTag]: string
    readonly isAaMap: boolean
    readonly map: Map<string, V>
    readonly cast?: (value: unknown) => V

    keysArray(): string[]

    merge(source: AaMapImpl | AnyMap | undefined, overwrite: boolean): void

    reset(source?: KV): this

    setMany(source?: KV): this
}


export type KV<V = unknown, K = string> = Dict | AaMapImpl | AnyMap | Array<[K, V]>

export type IterableKV = KV | ForEachIterable