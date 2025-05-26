import {MapCallbackFn} from '../maps/base'
import {BREAK} from '../../aa/atype/a_define_enums'
import {decodeStorageValue, encodeStorageValue} from './fn'
import {StorageImpl, StorageOptions} from './define_types'
import {Second} from '../../aa/atype/a_define_units'
import {floatToInt} from '../../aa/atype/t_basic'
import {t_millisecond, t_second} from '../../aa/atype/a_define'

export class AaStorageEngine implements StorageImpl {
    readonly name = 'AaStorageEngine'
    readonly persistentNames: Set<string>
    readonly storage: Storage
    readonly encode: boolean = false
    readonly startTimeKey = 'aa:storage:start_time'

    constructor(storage: Storage, encode: boolean = false, persistentNames: string[] = []) {
        this.storage = storage
        this.encode = encode
        this.persistentNames = new Set(persistentNames)
        this.removeExpiredItems()
    }

    get length(): number {
        return this.storage.length
    }

    clear(options?: StorageOptions): void {
        this.storage.clear()
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

    getItem(key: string): unknown {
        let encodedValue = this.storage.getItem(key)
        if (!encodedValue || !this.encode) {
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

    removeItems(keyPattern: RegExp): void {
        this.forEach((_, key) => {
            if (keyPattern.test(key)) {
                this.removeItem(key)
            }
        })
    }

    setItem(key: string, value: string, options?: StorageOptions): void {
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