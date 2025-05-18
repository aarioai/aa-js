import {Maps} from "../aa/atype/types";

export function clone(source: Maps): Maps {
    if (!source) {
        return {}
    }
    // new function, suggest
    if (typeof structuredClone === 'function') {
        return structuredClone(source)
    }

    const target = {}
    for (const key in source) {
        if (!Object.prototype.hasOwnProperty.call(source, key)) {
            continue
        }
        const value = source[key]
        target[key] = (value && typeof value === 'object') ? JSON.parse(JSON.stringify(value)) : value
    }
    return target
}

export function assign(target: Maps, source: Maps) {

}