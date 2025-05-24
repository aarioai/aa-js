import {MapObject} from '../../aa/atype/a_define_interfaces'
import {ASCEND, SortFunc} from '../../aa/atype/a_define_funcs'

export function sort<T = MapObject>(source: T, compareFn: SortFunc = ASCEND): T {
    return Object.keys(source).sort(compareFn).reduce((acc: T, key: string): T => {
        acc[key] = source[key]
        return acc
    }, {} as T)
}