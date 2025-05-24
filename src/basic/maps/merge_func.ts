import {MapObject, MapObjectable} from '../../aa/atype/a_define_interfaces'

/**
 * Safely assigns properties from a source object to a target object.
 *
 * @example
 *  assign({}, {name:'Aario'}           // {name:'Aario'}
 *  assign({age:18}, {name:'Aario'}     // {name:'Aario', age:18}
 *  assign(null, {name:'Aario'}         // {name:'Aario'}
 */
export function assign(target: MapObject | undefined, source: MapObject | MapObjectable | undefined) {
    if (!target) {
        target = {}
    }
    if (!source) {
        return target
    }
    return Object.assign(target, source)
}

export function merge(target: MapObject | undefined, source: MapObject | MapObjectable | undefined) {

}