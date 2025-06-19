import AaCookie from './cookie'
import AaStorageEngine from './engine'
import type {StorageImpl} from './define_types'

export default class AaStorageManager {

    readonly cookie: StorageImpl
    readonly local: AaStorageEngine
    readonly session: AaStorageEngine

    constructor(cookieStorage?: StorageImpl, localStorage?: Storage, sessionStorage?: Storage) {
        // Share cookie with server, need to keep original value
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