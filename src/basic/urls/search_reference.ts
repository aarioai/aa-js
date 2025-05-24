import {t_path_param} from '../../aa/atype/a_define'
import {BREAK, path_param_string_t} from '../../aa/atype/a_define_enums'
import {AaMap, MapCallback} from '../../aa/atype/a_define_interfaces'
import json from '../../aa/atype/json'

export default class SearchReference implements AaMap {
    readonly isAaMap: boolean = true
    readonly [Symbol.toStringTag] = 'SearchReference'
    private readonly map: Map<string, [string, t_path_param]>

    constructor(iterable?: Iterable<any>) {
        this.map = new Map<string, [string, t_path_param]>(iterable)
    }
 
    get size(): number {
        return this.map.size
    }

    spread(source?: SearchReference, overwrite: boolean = false) {
        if (!source) {
            return
        }
        if (source instanceof SearchReference) {
            for (const [key, [ref, type]] of source.entries()) {
                if (!overwrite && this.has(key)) {
                    continue
                }
                this.set(key, ref, type)
            }
        }
    }

    referrers(reference: string): [string, t_path_param][] {
        const result: [string, t_path_param][] = []
        for (const [referer, [ref, type]] of this.entries()) {
            if (ref === reference) {
                result.push([referer, type])
            }
        }
        return result
    }

    clear() {
        this.map.clear()
    }


    delete(name: string): boolean {
        return this.map.delete(name)
    }


    forEach(callback: MapCallback<[string, t_path_param], string>, thisArg?: any) {
        let stop = false
        this.map.forEach((value, key) => {
            if (stop) {
                return
            }
            if (BREAK === callback(value, key)) {
                stop = true
            }
        }, thisArg)
    }

    get(name: string): [string, t_path_param] {
        return this.map.get(name)
    }

    getReference(name: string): string {
        return this.get(name)[0]
    }

    has(name: string): boolean {
        return this.map.has(name)
    }


    set(name: string, ref: string, type: t_path_param = path_param_string_t): this {
        this.map.set(name, [ref, type])
        return this
    }

    toJSON(): string {
        return json.MarshalMap(this.map)
    }

    toMap(): Map<string, [string, t_path_param]> {
        return this.map
    }

    entries(): MapIterator<[string, [string, t_path_param]]> {
        return this.map.entries()
    }

    keys(): MapIterator<string> {
        return this.map.keys()
    }

    values(): MapIterator<[string, t_path_param]> {
        return this.map.values()
    }


    [Symbol.iterator](): IterableIterator<[string, [string, t_path_param]]> {
        return this.map[Symbol.iterator]()
    }
}