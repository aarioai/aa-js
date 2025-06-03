import AaStorageEngine from './engine'
import {DbLikeImpl, InsertCondition, StorageOptions} from './define_types'
import {Dict} from '../../aa/atype/a_define_interfaces'
import {matchAny} from '../arrays/fn'
import {t_expires} from '../../aa/atype/a_define'

export default class AaDbLike implements DbLikeImpl {
    readonly storage: AaStorageEngine

    constructor(storage?: AaStorageEngine) {
        this.storage = storage ? storage : new AaStorageEngine(window.localStorage)
    }

    delete(tableName: string, key: string): void {
        const filed = this.normalizeFieldKey(tableName, key)
        this.storage.removeItem(filed)
    }

    drop(tableName: string): void {
        tableName = this.normalizeTableName(tableName)
        this.storage.removeItems(new RegExp(`^${tableName}\\.`))
    }


    find<T = unknown>(tableName: string, key: string): T | null {
        const filed = this.normalizeFieldKey(tableName, key)
        return this.storage.getItem<T>(filed)
    }

    findWithTTL<T = unknown>(tableName: string, key: string): [T, t_expires] | null {
        const filed = this.normalizeFieldKey(tableName, key)
        return this.storage.getItemWithTTL<T>(filed)
    }

    findMany(tableName: string, keys: string[]): Dict | null {
        const fields: string[] = []
        for (const key of keys) {
            fields.push(this.normalizeFieldKey(tableName, key))
        }
        return this.revertItems(this.storage.getItems(fields))
    }

    findAll(tableName: string): Dict | null {
        tableName = this.normalizeTableName(tableName)
        return this.revertItems(this.storage.getItems(new RegExp(`^${tableName}\\.`)))
    }

    insert(tableName: string, key: string, value: unknown, options?: StorageOptions): void {
        const filed = this.normalizeFieldKey(tableName, key)
        this.storage.setItem(filed, value, options)
    }

    insertMany(tableName: string, data: Dict, options?: StorageOptions): void {
        for (const [key, value] of Object.entries(data)) {
            this.insert(tableName, key, value, options)
        }
    }

    insertWhen(tableName: string, data: Dict, when: InsertCondition, options?: StorageOptions): void {
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

    private normalizeFieldKey(tableName: string, key: string): string {
        return this.normalizeTableName(tableName) + '.' + key
    }

    private normalizeTableName(name: string): string {
        return `aa:db:${name}`
    }

    private extractFieldName(field: string): [string, string] {
        field = field.replace(/^aa:db:/, '')
        const [tableName, key] = field.split('.')
        return [tableName, key]
    }

    private revertItems(items: Dict | null): Dict | null {
        if (!items) {
            return null
        }
        const result: Dict = {}
        for (const [field, value] of Object.entries(items)) {
            const [_, key] = this.extractFieldName(field)
            result[key] = value
        }
        return result
    }
}