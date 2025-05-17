/**
 * Concatenates multiple arrays into a single array, skipping empty/null inputs
 *
 * @example
 * concat([1, 2], [3, 4]) // [1, 2, 3, 4]
 * concat([1], null, [2]) // [1, 2]
 * concat([], [1, 2])     // [1, 2]
 */
export function concat(...args: (any[] | null | undefined)[]): any[] {
    let result: any[] = []
    for (const arr of args) {
        if (arr?.length) {
            result.push(...arr)
        }
    }
    return result
}