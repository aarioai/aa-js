import type {AaMapImpl, IterableKV, KV, MapCallbackFn} from './base'
import {mapizeKV} from './kv'
import {BREAK} from '../../aa/atype/a_define_signals'
import {compareAny} from './groups'
import json from '../../aa/atype/json'
import {forEach} from './iterates'
import Serializable, {type AnyMap} from '../../aa/atype/a_define_interfaces'

export default class AaMap<V = unknown> extends Serializable implements AaMapImpl<V> {
    [Symbol.toStringTag] = 'AaMap'
    readonly isAaMap = true
    readonly map: AnyMap<V>
    cast?: (value: unknown) => V

    constructor(source?: KV<V, string>) {
        super()
        this.map = mapizeKV<V, string>(source)
    }

    get size(): number {
        return this.map.size
    }

    static deserialize<V, T extends AaMap<V>, G extends KV<V> = KV<V>>(this: new (source?: G) => T, s: string): T {
        return new this(json.Unmarshal(s) as G)
    }

    entries(): MapIterator<[string, V]> {
        return this.map.entries()
    }

    keys(): MapIterator<string> {
        return this.map.keys()
    }

    values(): MapIterator<V> {
        return this.map.values()
    }

    [Symbol.iterator](): MapIterator<[string, V]> {
        return this.map[Symbol.iterator]()
    }

    clear(): void {
        this.map.clear()
    }

    /**
     * Deletes a property
     *
     * @return true if an element existed and has been removed, or false if the element does not exist or value does not match
     */
    delete(key: string, value?: unknown): boolean {
        if (this.has(key, value)) {
            return this.map.delete(key)
        }
        return false
    }

    forEach(callbackfn: MapCallbackFn<V>, thisArg?: unknown): void {
        let stop = false
        this.map.forEach((value, key, map) => {
            if (stop) {
                return BREAK
            }
            const result = thisArg ? callbackfn.call(thisArg, value, key, map) : callbackfn(value, key, map)
            if (result === BREAK) {
                stop = true
                return BREAK
            }
        })
    }

    get(key: string): V | undefined {
        return this.map.get(key)
    }

    has(key: string, value?: unknown): boolean {
        const has = this.map.has(key)
        if (!has || value === undefined) {
            return has
        }
        const typedValue = this.cast ? this.cast(value) : value
        const origin = this.get(key)
        return compareAny(typedValue, origin)
    }

    keysArray(): string[] {
        return Array.from(this.map.keys())
    }

    merge(source: IterableKV<V, string> | undefined, overwrite: boolean = false) {
        if (!source) {
            return
        }
        forEach(source, (value, key: string) => {
            if (overwrite || !this.has(key)) {
                this.set(key, value)
            }
        })
    }

    reset(source?: IterableKV<V, string>): this {
        this.map.clear()
        this.setMany(source)
        return this
    }

    serialize(): string | null {
        return json.Marshal(Array.from(this.map))
    }

    set(key: string, value: unknown): this {
        const typedValue = this.cast ? this.cast(value) : value as V
        this.map.set(key, typedValue)
        return this
    }

    setMany(source: IterableKV<V, string> | undefined): this {
        if (!source) {
            return this
        }
        forEach(source, (value, key) => {
            this.set(key, value)
        })
        return this
    }

    toJSON(): string | null {
        return json.Marshal(this.map)
    }
}