import AaCookie from './cookie'
import {AaStorageEngine} from './engine'
import {StorageImpl} from './define_types'

class AaStorageFactory {
    readonly name = 'AaStorageFactory'

    readonly length: number

    readonly cookieStorage: StorageImpl
    readonly localStorage: StorageImpl
    readonly sessionStorage: StorageImpl

    constructor(cookieStorage?: StorageImpl, localStorage?: Storage, sessionStorage?: Storage) {
        this.cookieStorage = cookieStorage ? cookieStorage : new AaCookie()
        this.localStorage = new AaStorageEngine(localStorage ? localStorage : window.localStorage)
        this.sessionStorage = new AaStorageEngine(sessionStorage ? sessionStorage : window.sessionStorage)
    }

    clear(): void {
        this.cookieStorage.clear()
        this.localStorage.clear()
        this.sessionStorage.clear()
    }

    forEach(fn: (value: unknown, key: string) => void, thisArg?: unknown): void {
    }

    getItem(key: string): unknown {
        return this.cookieStorage.getItem(key) ?? this.sessionStorage.getItem(key) ?? this.sessionStorage.getItem(key)
    }

}