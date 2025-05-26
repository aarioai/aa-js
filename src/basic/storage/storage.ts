import {StorageImpl} from './define_types'

export class AaStorage implements StorageImpl {
    readonly name = 'AaStorage'
    persistentNames: Set<string>
    private storage: StorageImpl

    constructor(storage: StorageImpl, persistentNames: string[] = []) {
        this.storage = storage
        this.persistentNames = new Set(persistentNames)
    }

    get length(): number {
        return this.storage.length
    }

    clear(): void {
        this.storage.clear()
    }

    forEach(fn: (value: unknown, key: string) => void, thisArg?: unknown): void {
        this.storage.forEach(fn, thisArg)
    }

    getItem(key: string): string | null {
        return this.storage.getItem(key)
    }

    key(index: number): string | null {
        return this.storage.key(index)
    }

    removeItem(key: string): void {
        this.storage.removeItem(key)
    }

    setItem(key: string, value: string): void {
        this.storage.setItem(key, value)
    }

}