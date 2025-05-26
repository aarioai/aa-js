import AaCookie from './cookie'
import {AaStorageEngine} from './engine'
import {StorageImpl} from './define_types'

export default class AaStorageManager {
    readonly name = 'AaStorageManager'

    readonly length: number

    readonly cookie: StorageImpl
    readonly local: StorageImpl
    readonly session: StorageImpl

    constructor(cookieStorage?: StorageImpl, localStorage?: Storage, sessionStorage?: Storage) {
        this.cookie = cookieStorage ? cookieStorage : new AaCookie()
        this.local = new AaStorageEngine(localStorage ? localStorage : window.localStorage)
        this.session = new AaStorageEngine(sessionStorage ? sessionStorage : window.sessionStorage)
    }

    clearAll(): void {
        this.cookie.clear()
        this.local.clear()
        this.session.clear()
    }

    getOne(key: string): unknown {
        return this.cookie.getItem(key) ?? this.session.getItem(key) ?? this.session.getItem(key)
    }

}