import AaStorageEngine from './engine'
import {InsertCondition, StorageOptions} from './define_types'
import {AnyMap, MapObject} from '../../aa/atype/a_define_interfaces'
import {matchAny} from '../arrays/fn'

export default class AaDbLike {
    readonly storage: AaStorageEngine

    constructor(storage?: AaStorageEngine) {
        this.storage = storage ? storage : new AaStorageEngine(window.localStorage)
    }

    normalizeTableName(name: string): string {
        return `aa:db:${name}`
    }

    normalizeFieldKey(tableName: string, key: string): string {
        return this.normalizeTableName(tableName) + '.' + key
    }

    delete(tableName: string, key: string): void {
        const filed = this.normalizeFieldKey(tableName, key)
        this.storage.removeItem(filed)
    }

    drop(tableName: string): void {
        tableName = this.normalizeTableName(tableName)
        this.storage.removeItems(new RegExp(`^${tableName}\\.`))
    }

    find(tableName: string, key: string): unknown {
        const filed = this.normalizeFieldKey(tableName, key)
        return this.storage.getItem(filed)
    }

    findMany(tableName: string, keys: string[]): MapObject | null {
        const fields: string[] = []
        for (let i = 0; i < keys.length; i++) {
            fields.push(this.normalizeFieldKey(tableName, keys[i]))
        }
        return this.storage.getItems(fields)
    }

    findAll(tableName: string): MapObject | null {
        tableName = this.normalizeTableName(tableName)
        return this.storage.getItems(new RegExp(`^${tableName}\\.`))
    }

    insert(tableName: string, key: string, value: unknown, options?: StorageOptions): void {
        const filed = this.normalizeFieldKey(tableName, key)
        this.storage.setItem(filed, value, options)
    }

    insertMany(tableName: string, data: AnyMap, options?: StorageOptions): void {
        for (const [key, value] of Object.entries(data)) {
            this.insert(tableName, key, value, options)
        }
    }

    insertWhen(tableName: string, data: AnyMap, when: InsertCondition, options?: StorageOptions): void {
        const is = when.is ? (Array.isArray(when.is) ? when.is : [when.is]) : []
        const not = when.not ? (Array.isArray(when.not) ? when.not : [when.not]) : []
        if (!is.length && !not.length) {
            return this.insertMany(tableName, data, options)
        }
        for (const [key, value] of Object.entries(data)) {
            if (matchAny(value, is)) {
                this.insert(tableName, key, value, options)  // matching `is` can overwrite matching `not`
                continue
            }

            // key name ends with _ indicates it's temporary
            if (key.endsWith('_') || matchAny(value, not)) {
                continue
            }

            this.insert(tableName, key, value, options)
        }
    }
}