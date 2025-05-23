import {t_path_param} from '../../aa/atype/a_define_server'
import {PathParamString} from '../../aa/atype/const_server'
import {LoopSignal} from '../../aa/atype/a_define'
import {Break} from '../../aa/atype/const'

export class SearchReference {
    data: Map<string, [string, t_path_param]>

    constructor(iterable?: Iterable<any>) {
        this.data = new Map<string, [string, t_path_param]>(iterable)

    }

    get size(): number {
        return this.data.size
    }

    spread(source?: SearchReference, overwrite: boolean = false) {
        if (!source) {
            return
        }
        if (source instanceof SearchReference) {
            for (const [key, ref, type] of source.entries()) {
                if (!overwrite && this.has(key)) {
                    continue
                }
                this.set(key, ref, type)
            }
        }
    }

    referrers(reference: string): [string, t_path_param][] {
        const result: [string, t_path_param][] = []
        for (const [referer, ref, type] of this.entries()) {
            if (ref === reference) {
                result.push([referer, type])
            }
        }
        return result
    }

    clear() {
        this.data.clear()
    }


    * entries(): IterableIterator<[string, string, t_path_param]> {
        for (const [key, [ref, type]] of this.data.entries()) {
            yield [key, ref, type];
        }
    }

    delete(name: string) {
        this.data.delete(name)
    }


    forEach(callback: (ref: string, type: t_path_param, key: string) => LoopSignal, thisArg?: any) {
        const forEach = this.data.forEach
        if (thisArg) {
            forEach.bind(thisArg)
        }
        let stop = false
        forEach((value: [string, t_path_param], key: string) => {
            if (stop) {
                return
            }
            if (callback(value[0], value[1], key) === Break) {
                stop = true
            }
        })
    }

    get(name: string): [string, t_path_param] {
        return this.data.get(name)
    }

    getReference(name: string): string {
        return this.get(name)[0]
    }

    has(name: string): boolean {
        return this.data.has(name)
    }

    keys(): MapIterator<string> {
        return this.data.keys()
    }

    values(): IterableIterator<[string, t_path_param]> {
        return this.data.values()
    }

    set(name: string, ref: string, type: t_path_param = PathParamString) {
        this.data.set(name, [ref, type])
    }

    * [Symbol.iterator](): IterableIterator<[string, string, t_path_param]> {
        yield* this.entries();
    }
}