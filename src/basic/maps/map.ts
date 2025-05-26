import {AaMapImpl, IterableKV, KV, MapCallbackFn} from './base'
import {mapizeKV} from './kv'
import {BREAK, CONTINUE} from '../../aa/atype/a_define_enums'
import {compareAny} from './groups'
import json from '../../aa/atype/json'
import {forEach} from './iterates'

export default class AaMap<V = unknown> implements AaMapImpl<V> {
    [Symbol.toStringTag] = 'AaMap'
    readonly isAaMap = true
    readonly map: Map<string, V>
    cast?: (value: unknown) => V

    constructor(source?: KV) {
        this.map = mapizeKV(source)
    }

    get size(): number {
        return this.map.size
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
        this.map.forEach((value, key, map?) => {
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

    get(key: string): V {
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

    merge(source: IterableKV | undefined, overwrite: boolean = false) {
        if (!source) {
            return
        }
        forEach(source, (value, key) => {
            if (overwrite || !this.has(key)) {
                this.set(key, value)
            }
        })
    }

    reset(source?: KV): this {
        this.map.clear()
        this.setMany(source)
        return this
    }

    set(key: string, value: unknown): this {
        const typedValue = this.cast ? this.cast(value) : value as V
        this.map.set(key, typedValue)
        return this
    }

    setMany(source: IterableKV | undefined): this {
        if (!source) {
            return this
        }
        forEach(source, (value, key) => {
            // Handle Iterable array
            if (typeof key === 'number' && Array.isArray(value)) {
                this.set(value[0], value[1])
                return CONTINUE
            }
            this.set(key, value)
        })
    }

    toJSON(): string {
        return json.MarshalMap(this.map)
    }
}