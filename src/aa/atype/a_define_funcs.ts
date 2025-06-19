export const NIF = () => undefined
export const NIP = new Promise(NIF) // a nil promise

export type ResolveFn<T = unknown> = (value: T | PromiseLike<T>) => void
export type RejectFn = (reason?: unknown) => void
//export type PromiseFn<T = unknown> = (resolve: ResolveFn, reject: RejectFn) => void

export type SortFunc<T = unknown> = null | ((a: T, b: T) => number)
export const ASCEND: SortFunc = (a: unknown, b: unknown): number => {
    let aa = a
    let bb = b
    if (Array.isArray(a)) {
        aa = a[0]
        bb = (b as unknown[])[0]
    }

    if (typeof aa === 'number' && typeof bb === 'number') {
        return aa - bb
    }
    return String(aa).localeCompare(String(bb))
}

export const DESCEND: SortFunc = (a: unknown, b: unknown): number => {
    let aa = a
    let bb = b
    if (Array.isArray(a)) {
        aa = a[0]
        bb = (b as unknown[])[0]
    }
    if (typeof aa === 'number' && typeof bb === 'number') {
        return bb - aa
    }
    return String(bb).localeCompare(String(aa))
}

export function sort<T>(target: {
    sort: (compareFn?: (a: T, b: T) => number) => T[]
}, sortFunc: SortFunc): T[] {
    if (!sortFunc) {
        return target as T[]
    }
    return target.sort(sortFunc)
}