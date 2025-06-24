import {BREAK, type t_loopsignal} from '../../aa/atype/a_define_signals'
import {decodeStorageValue, encodeStorageValue} from './fn'
import type {StorageImpl, StorageOptions} from './define_types'
import {NO_EXPIRES, Second} from '../../aa/atype/a_define_units'
import {floatToInt} from '../../aa/atype/t_basic'
import type {t_expires, t_second} from '../../aa/atype/a_define'
import {matchAny, normalizeArrayArguments} from '../arrays/fn'
import type {Dict} from '../../aa/atype/a_define_interfaces'
import log from '../../aa/alog/log.ts'

export default class AaStorageEngine implements StorageImpl {
    readonly name = 'AaStorageEngine'
    enableDebug = false
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
            if (key === null || this.unclearable.has(key)) {
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

    forEach(fn: (value: unknown, key: string) => void | t_loopsignal, thisArg?: unknown): void {
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i)
            if (key === null) {
                continue
            }
            const value = this.getItem(key)
            const result = thisArg ? fn.call(thisArg, value, key) : fn(value, key)
            if (result === BREAK) {
                break
            }
        }
    }

    getItemWithTTL<T = unknown>(key: string): [T, t_expires] | null {
        let encodedValue = this.storage.getItem(key)
        if (!encodedValue) {
            return null
        }
        const {value, options} = decodeStorageValue(encodedValue)
        if (!options?.expiresIn) {
            return [value as T, NO_EXPIRES]
        }

        const ttl = options.expiresIn - this.timeDiff()
        if (ttl < 0) {
            this.removeItem(key)  // remove expired
        }
        return [value as T, ttl]
    }

    getItem<T = unknown>(key: string): T | null {
        const result = this.getItemWithTTL<T>(key)
        if (!result) {
            return null
        }
        return result[0]
    }

    getItems(key: (RegExp | string)[] | RegExp | string, ...rest: (RegExp | string)[]): Dict | null {
        const keys = normalizeArrayArguments(key, ...rest)
        let result: Dict = {}
        let has = false
        this.forEach((_, key) => {
            if (matchAny(key, keys)) {
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
        this.debug(`remove ${key}`)
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
            this.debug(`remove ${key}`)
            this.removeItem(key)  // remove expired
            return
        }
        this.debug(`set ${key}=${encodedValue}`)
        this.storage.setItem(key, encodedValue)
    }

    private debug(...msgs: unknown[]) {
        if (!this.enableDebug) {
            return
        }
        log.debug('AaStorageEngine', ...msgs)
    }

    private timeDiff(): t_second {
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
        return diff
    }

}