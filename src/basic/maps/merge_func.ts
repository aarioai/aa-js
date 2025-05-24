import {AaMap, MapObject} from '../../aa/atype/a_define_interfaces'

/**
 * Safely assigns properties from a source object to a target object.
 *
 * @example
 *  assignObjects({}, {name:'Aario'}           // {name:'Aario'}
 *  assignObjects({age:18}, {name:'Aario'}     // {name:'Aario', age:18}
 *  assignObjects(null, {name:'Aario'}         // {name:'Aario'}
 */
export function assignObjects<T = MapObject>(target: T | undefined, source: MapObject | AaMap | undefined): T {
    if (!target) {
        target = {} as T
    }
    if (!source) {
        return target
    }
    return Object.assign(target, source)
}

/**
 * Updates existing properties in a defaults object with values from a source object
 *
 * @example
 *  fillDefaultsObject({a:1,b:2}, {a:100,c:200})       //  {a:100, b:2}
 */
export function fillDefaultsObject<T = MapObject>(defaults: T | undefined, source: MapObject | AaMap | undefined): T {
    if (!defaults) {
        return {} as T
    }
    if (!source) {
        return defaults
    }
    for (const key of Object.keys(defaults)) {
        if (typeof source[key] !== 'undefined') {
            defaults[key] = source[key]
        }
    }
    return defaults
}

/**
 * Updates existing properties in a target object with values from a source object
 *
 * @example
 *  mergeObject({a:1,b:2}, {a:100,c:200})       //  {a:100, b:2}
 */
// export function fillDefaults<T = MapObject | MarshallableMap | AnyMap>(defaults: T, source: MapObject | MarshallableMap | undefined): T {
//     if (!defaults) {
//         throw E_MissingArgument
//     }
//     if (!source) {
//         return defaults
//     }
//     // Handle ForEachIterable, e.g. MapObjectable, Map
//     if (defaults instanceof Map || defaults instanceof MarshallableMap) {
//         (defaults as any).forEach((value: unknown, key: string) => {
//
//         })
//     }
// }