export const NIF = () => undefined
export const NIP = new Promise(NIF) // a nil promise

export type SortFunc = null | ((a: unknown, b: unknown) => number)
export const ASCEND: SortFunc = (a: unknown, b: unknown): number => {
    let aa = a
    let bb = b
    if (Array.isArray(a)) {
        aa = a[0]
        bb = b[0]
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
        bb = b[0]
    }
    if (typeof aa === 'number' && typeof bb === 'number') {
        return bb - aa
    }
    return String(bb).localeCompare(String(aa))
}
