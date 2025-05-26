import {a_string} from '../../aa/atype/t_basic'

/**
 * Normalizes mixed array/individual element arguments into a single flat array.
 */
export function normalizeArrayArguments<T>(first: T[] | T, ...rest: T[]): T[] {
    const args = Array.isArray(first) ? [...first] : [first]
    return rest.length > 0 ? args.concat(rest) : args
}

export function matchAny(value: unknown, testers: (bigint | boolean | number | null | string | undefined | RegExp)[]): boolean {
    const s = a_string(value)
    return testers.some(test => {
        if (test === value) {
            return true
        }

        if (test instanceof RegExp) {
            return test.test(s)
        }

        if (!test && test !== 0) {
            return false
        }
        return s === a_string(test)
    })
}
