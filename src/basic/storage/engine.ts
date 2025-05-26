import {MapCallbackFn} from '../maps/base'
import {BREAK} from '../../aa/atype/a_define_enums'
import {decodeStorageValue, encodeStorageValue} from './fn'
import {StorageImpl, StorageOptions} from './define_types'
import {Second} from '../../aa/atype/a_define_units'
import {floatToInt} from '../../aa/atype/t_basic'
import {t_millisecond, t_second} from '../../aa/atype/a_define'
import {matchAny, normalizeArrayArguments} from '../arrays/fn'
import {MapObject} from '../../aa/atype/a_define_interfaces'

export default class AaStorageEngine implements StorageImpl {
    readonly name = 'AaStorageEngine'
    readonly unclearable: Set<string>
    readonly storage: Storage
    readonly startTimeKey = 'aa:storage:start_time'

    constructor(storage: Storage, unclearable: Set<string> = new Set()) {
        this.storage = storage
        this.unclearable = unclearable
        this.removeExpiredItems()
    }

    get length(): number {
        return this.storage.length
    }

    clear(): void {
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i)
            if (this.unclearable.has(key)) {
                continue
            }
            const encodedValue = this.storage.getItem(key)
            if (!encodedValue) {
                this.removeItem(key)
                continue
            }
            const {options} = decodeStorageValue(encodedValue)
            if (!options?.unclearable) {
                this.removeItem(key)
            }
        }
    }

    forEach(fn: MapCallbackFn<unknown, string, StorageImpl>, thisArg?: unknown): void {
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i)
            const value = this.getItem(key)
            const result = thisArg ? fn.call(thisArg, value, key) : fn(value, key)
            if (result === BREAK) {
                break
            }
        }
    }

    getItem(key: string): unknown | null {
        let encodedValue = this.storage.getItem(key)
        if (!encodedValue) {
            return encodedValue
        }
        const {value, options} = decodeStorageValue(encodedValue)
        if (options?.expires) {
            const timeDiff = this.timeDiff()
            if (timeDiff > options.expires) {
                this.removeItem(key)  // remove expired
            }
        }
        return value
    }

    getItems(key: (RegExp | string)[] | RegExp | string, ...keys: (RegExp | string)[]): MapObject | null {
        const fields = normalizeArrayArguments(key, ...keys)
        let result: MapObject = {}
        let has = false
        this.forEach((_, key) => {
            if (matchAny(key, fields)) {
                const value = this.getItem(key)
                if (value !== null && value !== undefined) {
                    result[key] = value
                    has = true
                }
            }
        })
        return has ? result : null
    }

    key(index: number): string | null {
        return this.storage.key(index)
    }

    removeExpiredItems() {
        const timeDiff = this.timeDiff()
        if (!timeDiff) {
            this.clear()
            return
        }
        this.forEach((_, key) => {
            this.getItem(key)  // will remove expired
        })
    }

    removeItem(key: string): void {
        this.storage.removeItem(key)
    }

    removeItems(keys: (RegExp | string)[] | RegExp | string): void {
        if (!Array.isArray(keys)) {
            keys = [keys]
        }
        this.forEach((_, key) => {
            if (matchAny(key, keys)) {
                this.removeItem(key)
            }
        })
    }

    setItem(key: string, value: unknown, options?: StorageOptions): void {
        const encodedValue = encodeStorageValue(value, {
            ...options,
            timeDiff: this.timeDiff(),
        })
        if (encodedValue === null) {
            this.removeItem(key)  // remove expired
            return
        }
        this.storage.setItem(key, encodedValue)
    }

    private timeDiff(): t_millisecond {
        const now = floatToInt(Date.now() / Second)
        let diff: t_second = 0
        let startTime = Number(this.storage.getItem(this.startTimeKey) ?? 0)
        if (startTime) {
            diff = now - startTime
        }
        if (!diff) {
            diff = 0
            this.storage.setItem(this.startTimeKey, String(now))
        }
        return diff * Second
    }

}