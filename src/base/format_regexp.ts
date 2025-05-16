/**
 * Escapes all special regex characters in a string
 *
 * @example
 * escapeRegExp('a/b.txt')       // Returns 'a\/b\.txt'
 * str.replace(new RegExp(escapeRegExp('old ?'), 'g'), 'new !')
 */
export function escapeRegExp(nonRegString: string): string {
    return nonRegString.replace(/[.*+?^${}()|\[\]\\]/g, '\\$&')
}