import {trimLeft} from "./format_strings";

/**
 * convert string to snake_case like
 * @param s
 */
export function snakeCase(s: string): string {
    s = s.replaceAll('-', '_')
    const isPascal = s && (s[0] >= 'A' && s[0] <= 'Z')
    s = s.replace(/_?([A-Z]+)/g, (_, y) => "_" + y.toLowerCase())
    return isPascal ? trimLeft(s, '_', 1) : s
}


/**
 * capitalize words
 * @param s
 * @param handleCases
 */
export function capitalizeWords(s: string, handleCases = false): string {
    if (handleCases) {
        s = snakeCase(s).replaceAll('_', ' ')
    }
    s = s.replace(/(^|[\s_-])([a-z])/g, function (x, y, z) {
        return y + z.toUpperCase()
    })
    return s
}