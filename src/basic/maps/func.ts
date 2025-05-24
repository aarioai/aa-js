import {MapObject} from "../../aa/atype/a_define_interfaces";


export function sortObjectMap<T = MapObject>(source: T, compareFn?: (a: string, b: string) => number): T {
    return Object.keys(source).sort(compareFn).reduce((acc: T, key: string): T => {
        acc[key] = source[key]
        return acc
    }, {} as T)
}


export function assign(target: MapObject, source: MapObject) {

}