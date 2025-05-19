import {ForEachCopyable, Maps} from "../aa/atype/types";

export function cloneMaps(source: Maps): Maps {
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

export function forEachCopy<T extends ForEachCopyable>(source: T, target: T): T {
    if (!source) {
        return target
    }
    source.forEach((value, key) => {
        target.set(key, value)
    })
    return target
}

export function sortMaps<T = Maps>(source: T, compareFn?: (a: string, b: string) => number): T {
    return Object.keys(source).sort(compareFn).reduce((acc: T, key: string): T => {
        acc[key] = source[key]
        return acc
    }, {} as T)
}


export function assign(target: Maps, source: Maps) {

}