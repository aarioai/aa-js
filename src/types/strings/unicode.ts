/**
 * Calculates the UTF-8 byte length of a string
 *
 * @example
 * utf8Len('a')      // 1
 * utf8Len('é')      // 2
 * utf8Len('你好?')     // 7
 * utf8Len('𐍈')     // 4 (surrogate pair)
 */
export function utf8Len(s?: string): number {
    return new TextEncoder().encode(s).length
}