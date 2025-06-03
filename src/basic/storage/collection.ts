import {DbLikeImpl, InsertCondition, StorageOptions} from './define_types'
import AaDbLike from './dblike'
import {Dict} from '../../aa/atype/a_define_interfaces'
import {normalizeArrayArguments} from '../arrays/fn'
import {t_expires} from '../../aa/atype/a_define'

export default class AaCollection {
    readonly db: DbLikeImpl
    readonly tableName: string

    constructor(tableName: string, db: DbLikeImpl = new AaDbLike()) {
        this.tableName = tableName
        this.db = db
    }

    delete(key: string): void {
        this.db.delete(this.tableName, key)
    }

    drop(): void {
        this.db.drop(this.tableName)
    }

    find<T = unknown>(key: string): T | null {
        return this.db.find<T>(this.tableName, key)
    }

    findWithTTL<T = unknown>(key: string): [T, t_expires] | null {
        return this.db.findWithTTL<T>(this.tableName, key)
    }

    findMany(key: string[] | string, ...rest: string[]): Dict | null {
        const keys = normalizeArrayArguments(key, ...rest)
        return this.db.findMany(this.tableName, keys)
    }

    findAll(): Dict | null {
        return this.db.findAll(this.tableName)
    }

    insert(key: string, value: unknown, options?: StorageOptions): void {
        return this.db.insert(this.tableName, key, value, options)
    }

    insertMany(data: Dict, options?: StorageOptions): void {
        return this.db.insertMany(this.tableName, data, options)
    }

    insertWhen(data: Dict, when: InsertCondition, options?: StorageOptions): void {
        return this.db.insertWhen(this.tableName, data, when, options)
    }
}