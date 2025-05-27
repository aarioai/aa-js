import {DbLikeImpl, InsertCondition, StorageOptions} from './define_types'
import AaDbLike from './dblike'
import {AnyMap, MapObject} from '../../aa/atype/a_define_interfaces'
import {normalizeArrayArguments} from '../arrays/fn'

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

    find(key: string): unknown {
        return this.db.find(this.tableName, key)
    }

    findMany(key: string[] | string, ...rest: string[]): MapObject | null {
        const keys = normalizeArrayArguments(key, ...rest)
        return this.db.findMany(this.tableName, keys)
    }

    findAll(): MapObject | null {
        return this.db.findAll(this.tableName)
    }

    insert(key: string, value: unknown, options?: StorageOptions): void {
        return this.db.insert(this.tableName, key, value, options)
    }

    insertMany(data: AnyMap, options?: StorageOptions): void {
        return this.db.insertMany(this.tableName, data, options)
    }

    insertWhen(data: AnyMap, when: InsertCondition, options?: StorageOptions): void {
        return this.db.insertWhen(this.tableName, data, when, options)
    }
}